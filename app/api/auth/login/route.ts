import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import jwt from "jsonwebtoken";

// Make sure to set a strong JWT_SECRET in your .env file
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      },
      JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
      },
    });

    // Set HttpOnly cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Secure in production
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json(
      { error: "Failed to login user" },
      { status: 500 }
    );
  }
}
