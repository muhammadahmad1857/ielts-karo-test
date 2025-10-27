/**
 * Media Data Access Layer
 * Handles media file upload, retrieval, and management API calls
 */

import { apiWithAuth } from "@/lib/axios";
import type {
  ApiResponse,
  Media,
  MediaUploadResponse,
  MediaUrlResponse,
  MediaStats,
  ObjectId,
  PaginationParams,
} from "@/types";

/**
 * Upload a media file (image or PDF)
 * Requires authentication
 * Accepts: JPEG, PNG, GIF, WebP, PDF
 * Max size: 10 MB
 *
 * @param file - File to upload
 * @returns ApiResponse with uploaded media metadata and URL
 */
export async function uploadMedia(
  file: File
): Promise<ApiResponse<MediaUploadResponse>> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiWithAuth.post<MediaUploadResponse>(
      "/media/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    const errorDetail = err.response?.data?.detail;
    let errorMessage = "Failed to upload media";

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
 * Upload an audio file
 * Requires authentication
 * Accepts: MP3, WAV, OGG, WebM, AAC, M4A
 * Max size: 50 MB
 *
 * @param file - Audio file to upload
 * @returns ApiResponse with uploaded media metadata and URL
 */
export async function uploadAudio(
  file: File
): Promise<ApiResponse<MediaUploadResponse>> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiWithAuth.post<MediaUploadResponse>(
      "/media/upload/audio",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    const errorDetail = err.response?.data?.detail;
    let errorMessage = "Failed to upload audio";

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
 * Get all media files for current user
 * Super admins can see all files
 * Regular users can only see their own files
 * Requires authentication
 *
 * @param pagination - Pagination parameters
 * @returns ApiResponse with array of media files
 */
export async function getUserMedia(
  pagination?: PaginationParams
): Promise<ApiResponse<Media[]>> {
  try {
    const { data } = await apiWithAuth.get<Media[]>("/media/", {
      params: pagination,
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
        "Failed to fetch media files",
    };
  }
}

/**
 * Get media statistics
 * Super admins can see stats for all files
 * Regular users can only see stats for their own files
 * Requires authentication
 *
 * @returns ApiResponse with media statistics
 */
export async function getMediaStats(): Promise<ApiResponse<MediaStats>> {
  try {
    const { data } = await apiWithAuth.get<MediaStats>("/media/stats");

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
        "Failed to fetch media statistics",
    };
  }
}

/**
 * Get a specific media file by ID
 * Super admins can access any file
 * Regular users can only access their own media files
 * Requires authentication
 *
 * @param mediaId - Media file ID
 * @returns ApiResponse with media file
 */
export async function getMediaById(
  mediaId: ObjectId
): Promise<ApiResponse<Media>> {
  try {
    const { data } = await apiWithAuth.get<Media>(`/media/${mediaId}`);

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
        "Failed to fetch media file",
    };
  }
}

/**
 * Delete a media file by ID
 * Deletes from Google Cloud Storage and removes database record
 * Super admins can delete any file
 * Regular users can only delete their own media files
 * Requires authentication
 *
 * @param mediaId - Media file ID
 * @returns ApiResponse with void data
 */
export async function deleteMedia(
  mediaId: ObjectId
): Promise<ApiResponse<void>> {
  try {
    await apiWithAuth.delete(`/media/${mediaId}`);

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
        "Failed to delete media file",
    };
  }
}

/**
 * Get public URL for a media file
 * Super admins can access URLs for any file
 * Regular users can only access URLs for their own media files
 * Requires authentication
 *
 * @param mediaId - Media file ID
 * @returns ApiResponse with public URL
 */
export async function getMediaUrl(
  mediaId: ObjectId
): Promise<ApiResponse<MediaUrlResponse>> {
  try {
    const { data } = await apiWithAuth.get<MediaUrlResponse>(
      `/media/${mediaId}/url`
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
        "Failed to fetch media URL",
    };
  }
}
