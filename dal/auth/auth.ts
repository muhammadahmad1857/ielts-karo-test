/**
 * Authentication Data Access Layer
 * Handles all authentication-related API calls
 */

import { api, apiWithAuth } from "@/lib/axios";
import type {
  ApiResponse,
  BearerResponse,
  LoginCredentials,
  UserCreate,
  User,
  EmailRequest,
  TokenRequest,
  PasswordResetRequest,
  OAuth2AuthorizeResponse,
} from "@/types";
import { logOut } from "./getToken";
import axios from "axios";

/**
 * Login with email and password
 * Uses custom /api/login endpoint
 *
 * @param credentials - User login credentials
 * @returns ApiResponse with bearer token
 */
export async function login(
  credentials: LoginCredentials
): Promise<ApiResponse<BearerResponse>> {
  try {
    // Convert to form data format as required by the API
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const { data } = await axios.post<BearerResponse>(
      "/api/login",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    return {
      data: null,
      success: false,
      error:
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Login failed",
    };
  }
}

/**
 * Logout current user
 * Requires authentication
 *
 * @returns ApiResponse with void data
 */
export async function logout(): Promise<ApiResponse<void>> {
  try {
    await apiWithAuth.post("/auth/jwt/logout");
    await logOut(); // Call the logOut utility to clear cookies
    return {
      data: null,
      success: true,
      error: null,
    };
  } catch (err: any) {
    return {
      data: null,
      success: false,
      error:
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Logout failed",
    };
  }
}

/**
 * Register a new user
 *
 * @param userData - User registration data
 * @returns ApiResponse with created user
 */
export async function register(
  userData: UserCreate
): Promise<ApiResponse<User>> {
  try {
    const { data } = await api.post<User>("/auth/register", userData);

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    const errorDetail = err.response?.data?.detail;
    let errorMessage = "Registration failed";

    if (Array.isArray(errorDetail)) {
      errorMessage = errorDetail[0]?.msg || errorMessage;
    } else if (typeof errorDetail === "string") {
      errorMessage = errorDetail;
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    return {
      data: null,
      success: false,
      error: errorMessage,
    };
  }
}



/**
 * Get Google OAuth authorization URL
 *
 * @param scopes - Optional OAuth scopes
 * @returns ApiResponse with authorization URL
 */
export async function getGoogleAuthUrl(
  scopes?: string[]
): Promise<ApiResponse<OAuth2AuthorizeResponse>> {
  try {
    const params = scopes ? { scopes } : {};
    const { data } = await api.get<OAuth2AuthorizeResponse>(
      "/auth/google/authorize",
      { params }
    );

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    return {
      data: null,
      success: false,
      error:
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to get Google auth URL",
    };
  }
}

/**
 * Handle Google OAuth callback
 *
 * @param code - Authorization code
 * @param codeVerifier - Code verifier for PKCE
 * @param state - State parameter
 * @param error - Error from OAuth provider
 * @returns ApiResponse with bearer token or error
 */
export async function handleGoogleCallback(params: {
  code?: string;
  code_verifier?: string;
  state?: string;
  error?: string;
}): Promise<ApiResponse<BearerResponse>> {
  try {
    const { data } = await api.get<BearerResponse>("/auth/google/callback", {
      params,
    });

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    return {
      data: null,
      success: false,
      error:
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Google OAuth callback failed",
    };
  }
}


// /**
//  * Request email verification token
//  *
//  * @param email - User's email address
//  * @returns ApiResponse with void data
//  */
// export async function requestVerifyToken(
//   email: string
// ): Promise<ApiResponse<void>> {
//   try {
//     const requestBody: EmailRequest = { email };
//     await api.post("/auth/request-verify-token", requestBody);

//     return {
//       data: null,
//       success: true,
//       error: null,
//     };
//   } catch (err: any) {
//     return {
//       data: null,
//       success: false,
//       error:
//         err.response?.data?.detail ||
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to request verification token",
//     };
//   }
// }

// /**
//  * Verify email with token
//  *
//  * @param token - Verification token
//  * @returns ApiResponse with verified user
//  */
// export async function verifyEmail(token: string): Promise<ApiResponse<User>> {
//   try {
//     const requestBody: TokenRequest = { token };
//     const { data } = await api.post<User>("/auth/verify", requestBody);

//     return {
//       data,
//       success: true,
//       error: null,
//     };
//   } catch (err: any) {
//     return {
//       data: null,
//       success: false,
//       error:
//         err.response?.data?.detail ||
//         err.response?.data?.message ||
//         err.message ||
//         "Email verification failed",
//     };
//   }
// }


// /**
//  * Request password reset token
//  *
//  * @param email - User's email address
//  * @returns ApiResponse with void data
//  */
// export async function forgotPassword(
//   email: string
// ): Promise<ApiResponse<void>> {
//   try {
//     const requestBody: EmailRequest = { email };
//     await api.post("/auth/forgot-password", requestBody);

//     return {
//       data: null,
//       success: true,
//       error: null,
//     };
//   } catch (err: any) {
//     return {
//       data: null,
//       success: false,
//       error:
//         err.response?.data?.detail ||
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to request password reset",
//     };
//   }
// }

// /**
//  * Reset password with token
//  *
//  * @param token - Reset token
//  * @param password - New password
//  * @returns ApiResponse with updated user
//  */
// export async function resetPassword(
//   token: string,
//   password: string
// ): Promise<ApiResponse<User>> {
//   try {
//     const requestBody: PasswordResetRequest = { token, password };
//     const { data } = await api.post<User>("/auth/reset-password", requestBody);

//     return {
//       data,
//       success: true,
//       error: null,
//     };
//   } catch (err: any) {
//     return {
//       data: null,
//       success: false,
//       error:
//         err.response?.data?.detail ||
//         err.response?.data?.message ||
//         err.message ||
//         "Password reset failed",
//     };
//   }
// }
