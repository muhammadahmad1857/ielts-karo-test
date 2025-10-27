/**
 * Admin Data Access Layer
 * Handles administrative API calls (super admin only)
 */

import { apiWithAuth } from "@/lib/axios";
import type {
  ApiResponse,
  User,
  UserRole,
  ObjectId,
  UpdateRoleRequest,
} from "@/types";

/**
 * List all users in the system
 * Requires super admin role
 *
 * @param params - Pagination and filter parameters
 * @returns ApiResponse with array of users
 */
export async function listAllUsers(params?: {
  skip?: number;
  limit?: number;
  role?: UserRole;
}): Promise<ApiResponse<User[]>> {
  try {
    const { data } = await apiWithAuth.get<User[]>("/admin/users", {
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
        "Failed to fetch users",
    };
  }
}

/**
 * Get a specific user by ID (admin endpoint)
 * Requires super admin role
 *
 * @param userId - User ID
 * @returns ApiResponse with user
 */
export async function getAdminUserById(
  userId: ObjectId
): Promise<ApiResponse<User>> {
  try {
    const { data } = await apiWithAuth.get<User>(`/admin/users/${userId}`);

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
 * Update a user's role
 * Requires super admin role
 * Cannot modify own role or demote the last super admin
 *
 * @param userId - User ID
 * @param role - New role
 * @returns ApiResponse with updated user
 */
export async function updateUserRole(
  userId: ObjectId,
  role: UserRole
): Promise<ApiResponse<User>> {
  try {
    const requestBody: UpdateRoleRequest = { role };
    const { data } = await apiWithAuth.patch<User>(
      `/admin/users/${userId}/role`,
      requestBody
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
        "Failed to update user role",
    };
  }
}
