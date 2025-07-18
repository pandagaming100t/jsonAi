import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not configured");
}

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables." 
      }, { status: 500 });
    }

    if (!genAI) {
      return NextResponse.json({ 
        error: "Gemini API is not properly initialized" 
      }, { status: 500 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const enhancedPrompt = `
      Generate a JSON schema based on this description: "${prompt}"
      
      Return ONLY a valid JSON object that represents the schema structure with the following format:
      - Each field should have: id (unique string), name (field name), type (one of: "String", "Number", "Boolean", "Array", "Object", "Date", "Email", "URL", "UUID", "Integer", "Float", "Enum", "Nested")
      - Include optional properties: required (boolean), description (string)
      - For String/Email/URL: include minLength, maxLength if appropriate
      - For Number/Integer/Float: include min, max if appropriate
      - For Enum: include enumValues array and set value to one of the enum values
      - For Array: include arrayItemType
      - For Nested/Object: include children array with nested fields
      - Choose appropriate default values based on type
      
      Example format:
      [
        {
          "id": "field_1",
          "name": "title",
          "type": "String",
          "value": "Default Title",
          "required": true,
          "description": "The title of the item",
          "minLength": 1,
          "maxLength": 100
        },
        {
          "id": "field_2",
          "name": "email",
          "type": "Email",
          "value": "example@email.com",
          "required": true,
          "description": "User email address"
        },
        {
          "id": "field_3",
          "name": "status",
          "type": "Enum",
          "value": "active",
          "enumValues": ["active", "inactive", "pending"],
          "required": true,
          "description": "Current status"
        },
        {
          "id": "field_4",
          "name": "tags",
          "type": "Array",
          "arrayItemType": "String",
          "description": "List of tags"
        },
        {
          "id": "field_5",
          "name": "metadata",
          "type": "Nested",
          "children": [
            {
              "id": "field_6",
              "name": "createdAt",
              "type": "Date",
              "value": "2024-01-01",
              "required": true
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