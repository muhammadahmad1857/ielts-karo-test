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
