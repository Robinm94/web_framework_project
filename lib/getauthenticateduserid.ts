import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export default async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { userId: string };
    return decoded.userId;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
