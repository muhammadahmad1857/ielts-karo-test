/**
 * @deprecated This file is deprecated. Use `dal/auth/auth.ts` instead.
 * See `dal/MIGRATION.md` for migration guide.
 */

// "use server";

import { api } from "@/lib/axios";

interface RegisterInput {
  email: string;
  password: string;
  is_active?: boolean;
  is_superuser?: boolean;
  is_verified?: boolean;
  role?: "student" | "admin" | "instructor";
}

interface RegisterResponse extends Omit<RegisterInput, "password"> {
  id: string;
}

export async function registerUser(
  input: RegisterInput
): Promise<RegisterResponse> {
  const body = {
    email: input.email,
    password: input.password,
    is_active: input.is_active ?? true,
    is_superuser: input.is_superuser ?? false,
    is_verified: input.is_verified ?? false,
    role: input.role ?? "student",
  };

  try {
    console.log("Registering user with data:", body);
    const { data } = await api.post<RegisterResponse>(
      "https://api.ieltskaro.com/auth/register",
      {
        ...body,
      }
    );

    return data;
    // @eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.detail[0].msg ||
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      "Registeration Faied for some reason";
    throw new Error(`Registration failed: ${errorMessage}`);
  }
}
