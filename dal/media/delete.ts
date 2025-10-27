/**
 * @deprecated This file is deprecated. Use `dal/media/media.ts` instead.
 * See `dal/MIGRATION.md` for migration guide.
 */

import { apiWithAuth } from "@/lib/axios";

/**
 * Delete a media file from the IELTSKaro API.
 * @param mediaId - The ID of the media file to delete
 * @returns Success status and error message if any
 */
export async function deleteMedia(mediaId: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const res = await apiWithAuth.delete(`/media/${mediaId}`, {
      headers: {
        Accept: "*/*",
      },
    });

    // 204 No Content indicates successful deletion
    if (res.status === 204) {
      return { success: true, error: null };
    }

    // Unexpected success status code
    return {
      success: false,
      error: "Unexpected response from server",
    };
  } catch (error: any) {
    console.error("Delete failed:", error.response?.data || error.message);

    // Handle 404, 402, or other error status codes
    if (
      error.response?.status === 404 ||
      error.response?.status === 402 ||
      error.response?.data?.detail
    ) {
      return {
        success: false,
        error: error.response?.data?.detail || "Media deletion failed",
      };
    }

    return {
      success: false,
      error:
        error.response?.data?.detail ||
        error.message ||
        "An error occurred while deleting media",
    };
  }
}
