"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { deleteMedia, uploadMedia } from "@/dal";

interface ImageUploadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpload?: (url: string, metadata: any) => void;
  accept?: string;
  maxSize?: number;
}

export function ImageUpload({
  onUpload,
  accept = "image/*,.pdf",
  maxSize = 10 * 1024 * 1024,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<{ url: string; id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);

    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setUploading(true);
    try {
      const response = await uploadMedia(file);
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        const uploaded = { url: response.data.url, id: response.data.media.id };
        setImage(uploaded);
        onUpload?.(uploaded.url, response.data);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = async () => {
    if (!image) return;
    try {
      const result = await deleteMedia(image.id);
      if (result.success) {
        setImage(null);
      } else {
        setError(result.error || "Failed to delete media");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete media");
    }
  };

  return (
    <div className="space-y-4">
      {!image && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="font-medium">Drag and drop your file here</p>
          <p className="text-sm text-muted-foreground">or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) =>
              e.target.files?.[0] && handleFileSelect(e.target.files[0])
            }
            className="hidden"
          />
        </div>
      )}

      {image && (
        <div className="relative w-full max-w-xs mx-auto">
          <img
            src={image.url}
            alt="Uploaded"
            className="w-full rounded-lg border"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full hover:bg-destructive/90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
          {error}
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}
