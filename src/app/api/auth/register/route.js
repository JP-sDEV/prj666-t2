"use server";

import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { User } from "@/models/user";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req, res) {
  try {
    const { email, password, firstName, lastName, authProvider } =
      await req.json();

    if (!email || !password || !firstName || !lastName || !authProvider) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);
    console.log("Password: ", password);
    console.log("Hash Password: ", hashedPassword);

    const newUser = new User({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      authProvider: "email",
    });

    console.log("New User: ", newUser);

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create user",
      },
      { status: 500 }
    );
  }
}
