import { apiWithAuth } from "@/lib/axios";
import type { AxiosResponse } from "axios";

export type UserRole = "student" | "super_admin";

export interface UserItem {
  id: string;
  email: string;
  is_active?: boolean;
  is_superuser?: boolean;
  is_verified?: boolean;
  role?: UserRole;
  created_at?: string;
}

/**
 * Fetch users from admin API
 * All parameters are optional. Role may include "super_admin".
 *
 * Usage (positional): getAllUsers(0, 100, 'student')
 * Usage (named): getAllUsers({ limit: 100, role: 'super_admin' })
 */
export async function getAllUsers(
  skip?: number,
  limit?: number,
  role?: string
): Promise<AxiosResponse<UserItem[]>> {
  // Support both positional args and single object param
  let params: { [k: string]: number | string } = {};

  if (typeof skip !== "undefined") params.skip = skip;
  if (typeof limit !== "undefined") params.limit = limit;
  if (role) params.role = role;

  try {
    return await apiWithAuth.get<UserItem[]>("/admin/users", { params });
  } catch (err: any) {
    // Normalize error message
    const msg =
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch users";
    throw new Error(msg);
  }
}

/**
 * Update a user's role.
 * PATCH /admin/users/{id}/role
 */
export async function updateUserRole(
  userId: string,
  role: string
): Promise<AxiosResponse<UserItem>> {
  try {
    return await apiWithAuth.patch<UserItem>(`/admin/users/${userId}/role`, {
      role,
    });
  } catch (err: any) {
    const msg =
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.message ||
      "Failed to update user role";
    throw new Error(msg);
  }
}

/**
 * Check if the current user is a super admin.
 * GET /users/me
 */
export async function isSuperAdmin(): Promise<boolean> {
  try {
    const response = await apiWithAuth.get<UserItem>("/users/me");
    console.log("Response",response)
    return response.data.role === "super_admin";
  } catch (err: any) {
    console.error("Failed to check super admin status:", err);
    return false;
  }
}
