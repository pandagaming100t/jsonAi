import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    const schemas = await db
      .collection("schemas")
      .find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ schemas });
  } catch (error) {
    console.error("Failed to fetch schemas:", error);
    return NextResponse.json(
      { error: "Failed to fetch schemas" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, schema } = await req.json();

    if (!name || !schema) {
      return NextResponse.json(
        { error: "Name and schema are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection("schemas").insertOne({
      name,
      schema,
      userEmail: session.user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    });
  } catch (error) {
    console.error("Failed to save schema:", error);
    return NextResponse.json(
      { error: "Failed to save schema" },
      { status: 500 }
    );
  }
}