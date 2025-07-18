import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const enhancedPrompt = `
      Generate a JSON schema based on this description: "${prompt}"
      
      Return ONLY a valid JSON object that represents the schema structure with the following format:
      - Each field should have: id (unique string), name (field name), type ("String", "Number", or "Nested")
      - For String type: include a default value
      - For Number type: include a default numeric value
      - For Nested type: include a children array with nested fields
      
      Example format:
      [
        {
          "id": "field_1",
          "name": "title",
          "type": "String",
          "value": "Default Title"
        },
        {
          "id": "field_2",
          "name": "count",
          "type": "Number",
          "value": 0
        },
        {
          "id": "field_3",
          "name": "metadata",
          "type": "Nested",
          "children": [
            {
              "id": "field_4",
              "name": "author",
              "type": "String",
              "value": "Default Author"
            }
          ]
        }
      ]
      
      Make sure the response is valid JSON that can be parsed directly.
    `;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response to ensure it's valid JSON
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const schema = JSON.parse(text);
      return NextResponse.json({ schema });
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      return NextResponse.json(
        { error: "Failed to generate valid schema" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate schema" },
      { status: 500 }
    );
  }
}