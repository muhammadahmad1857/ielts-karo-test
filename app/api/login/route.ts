// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

interface PythonLoginResponse {
  access_token: string;
  token_type: string;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const username = formData.get("username") as string | null;
    const password = formData.get("password") as string | null;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Call your Python API
    const { data } = await axios.post<PythonLoginResponse>(
      "https://api.ieltskaro.com/auth/jwt/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    // Store token securely in cookies
    const cookieStore = await cookies();
    cookieStore.set("token", data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({ success: true, ...data }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const msg =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      "Login failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
