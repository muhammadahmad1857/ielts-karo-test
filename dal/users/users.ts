/**
 * Users Data Access Layer
 * Handles user profile and management API calls
 */

import { apiWithAuth } from "@/lib/axios";
import type { ApiResponse, User, UserUpdate, ObjectId } from "@/types";

/**
 * Get current authenticated user's profile
 * Requires authentication
 *
 * @returns ApiResponse with current user
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  try {
    const { data } = await apiWithAuth.get<User>("/users/me");

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
        "Failed to fetch current user",
    };
  }
}

/**
 * Update current authenticated user's profile
 * Requires authentication
 *
 * @param userData - User update data
 * @returns ApiResponse with updated user
 */
export async function updateCurrentUser(
  userData: UserUpdate
): Promise<ApiResponse<User>> {
  try {
    const { data } = await apiWithAuth.patch<User>("/users/me", userData);

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    const errorDetail = err.response?.data?.detail;
    let errorMessage = "Failed to update user";

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
 * Get a specific user by ID
 * Requires super admin role
 *
 * @param userId - User ID
 * @returns ApiResponse with user
 */
export async function getUserById(
  userId: ObjectId
): Promise<ApiResponse<User>> {
  try {
    const { data } = await apiWithAuth.get<User>(`/users/${userId}`);

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
        "Failed to fetch user",
    };
  }
}

/**
 * Update a specific user by ID
 * Requires super admin role
 *
 * @param userId - User ID
 * @param userData - User update data
 * @returns ApiResponse with updated user
 */
export async function updateUserById(
  userId: ObjectId,
  userData: UserUpdate
): Promise<ApiResponse<User>> {
  try {
    const { data } = await apiWithAuth.patch<User>(
      `/users/${userId}`,
      userData
    );

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    const errorDetail = err.response?.data?.detail;
    let errorMessage = "Failed to update user";

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
 * Delete a specific user by ID
 * Requires super admin role
 *
 * @param userId - User ID
 * @returns ApiResponse with void data
 */
export async function deleteUserById(
  userId: ObjectId
): Promise<ApiResponse<void>> {
  try {
    await apiWithAuth.delete(`/users/${userId}`);

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
        "Failed to delete user",
    };
  }
}
