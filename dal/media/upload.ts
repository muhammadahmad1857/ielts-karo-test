/**
 * @deprecated This file is deprecated. Use `dal/media/media.ts` instead.
 * See `dal/MIGRATION.md` for migration guide.
 */
// eslint-disable @typescript-eslint/no-explicit-any
import { apiWithAuth } from "@/lib/axios";
import axios from "axios";

export interface UploadedMedia {
  id: string;
  owner_id: string;
  key: string;
  filename: string;
  mime_type: string;
  size_mb: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UploadResponse {
  media: UploadedMedia;
  url: string;
}

/**
 * Upload a file to the IELTSKaro API.
 * @param file - The File or Blob object to upload
 * @returns The uploaded media data and public URL
 */
export async function uploadMedia(file: File | Blob): Promise<{
  data: UploadResponse | null;
  success: boolean;
  error: string | null;
}> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await apiWithAuth.post<UploadResponse>(
      "/media/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      }
    );
    return { data: res.data, success: true, error: null };
  } catch (error: any) {
    console.error("Upload failed:", error.response?.data || error.message);
    return {
      data: null,
      success: false,
      error: error.response?.data || error.message,
    };
  }
}
