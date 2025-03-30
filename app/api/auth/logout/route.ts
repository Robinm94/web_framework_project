import { NextResponse } from "next/server";

export async function POST() {
  // Create response
  const response = NextResponse.json({
    message: "Logged out successfully",
  });

  // Clear the token cookie
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    expires: new Date(0), // Set expiry to epoch time to delete the cookie
    path: "/",
  });

  return response;
}
