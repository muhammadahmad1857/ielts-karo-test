"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload,
  X,
  Library,
  FileText,
  Music,
  Image as ImageIcon,
} from "lucide-react";
import { deleteMedia, uploadMedia, getUserMedia } from "@/dal";
import type { Media } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  const [libraryDialogOpen, setLibraryDialogOpen] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<Media[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const fetchMediaLibrary = async () => {
    setLibraryLoading(true);
    try {
      const response = await getUserMedia({ limit: 100 });
      if (Array.isArray(response.data)) {
        setMediaLibrary(response.data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load media library"
      );
    } finally {
      setLibraryLoading(false);
    }
  };

  const handleLibraryOpen = () => {
    setLibraryDialogOpen(true);
    if (mediaLibrary.length === 0) {
      fetchMediaLibrary();
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    } else if (mimeType.startsWith("audio/")) {
      return <Music className="w-5 h-5 text-purple-500" />;
    } else if (mimeType === "application/pdf") {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const handleSelectFromLibrary = (media: Media) => {
    const selected = {
      url: `https://api.ieltskaro.com/media/${media.id}/url`,
      id: media.id,
    };
    setImage(selected);
    onUpload?.(selected.url, { media, url: selected.url });
    setLibraryDialogOpen(false);
    setSearchQuery("");
  };

  const filteredMedia = mediaLibrary.filter((media) =>
    media.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {!image && (
        <div className="space-y-3">
          {/* Upload Section */}
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

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                or
              </span>
            </div>
          </div>

          {/* Library Button */}
          <Button
            onClick={handleLibraryOpen}
            variant="outline"
            className="w-full"
            disabled={libraryLoading}
          >
            <Library className="w-4 h-4 mr-2" />
            {libraryLoading ? "Loading..." : "Choose from Library"}
          </Button>
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

      {/* Media Library Dialog */}
      <AlertDialog open={libraryDialogOpen} onOpenChange={setLibraryDialogOpen}>
        <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Select from Media Library</AlertDialogTitle>
            <AlertDialogDescription>
              Choose from your existing uploaded media files
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Search */}
          <div className="mt-4">
            <Input
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto">
            {libraryLoading ? (
              <div className="col-span-full flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p>Loading media...</p>
                </div>
              </div>
            ) : filteredMedia.length > 0 ? (
              filteredMedia.map((media) => (
                <Card
                  key={media.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => handleSelectFromLibrary(media)}
                >
                  <div className="relative bg-muted aspect-square flex items-center justify-center">
                    {media.mime_type.startsWith("image/") && (
                      <img
                        src={`https://api.ieltskaro.com/media/${media.id}/url`}
                        alt={media.filename}
                        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                      />
                    )}
                    {media.mime_type.startsWith("audio/") && (
                      <div className="flex flex-col items-center gap-2">
                        <Music className="w-12 h-12 text-purple-500" />
                        <span className="text-xs text-muted-foreground">
                          Audio
                        </span>
                      </div>
                    )}
                    {media.mime_type === "application/pdf" && (
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-red-500" />
                        <span className="text-xs text-muted-foreground">
                          PDF
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" variant="secondary">
                        Select
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">
                      {media.filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {media.size_mb < 1
                        ? (media.size_mb * 1024).toFixed(2) + " KB"
                        : media.size_mb.toFixed(2) + " MB"}
                    </p>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {mediaLibrary.length === 0
                  ? "No media uploaded yet"
                  : "No matching media found"}
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
