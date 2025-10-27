/**
 * @deprecated This file is deprecated. Use `dal/auth/auth.ts` instead.
 * See `dal/MIGRATION.md` for migration guide.
 */
// eslint-disable @typescript-eslint/no-explicit-any
import axios from "axios";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  success: boolean;
}

export async function loginUser(input: LoginInput): Promise<LoginResponse> {
  try {
    const { data } = await axios.post<LoginResponse>("/api/login", input);
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || err.message || "Login failed");
  }
}
