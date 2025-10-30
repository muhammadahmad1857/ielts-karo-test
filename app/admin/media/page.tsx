"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Trash2,
  Search,
  Loader2,
  Image as ImageIcon,
  FileText,
  Music,
} from "lucide-react";
import { getUserMedia, deleteMedia } from "@/dal/media/media";
import type { Media } from "@/types";
import { toast } from "sonner";

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<{
    id: string;
    filename: string;
  } | null>(null);
  const [isDeletingMedia, setIsDeletingMedia] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<Media | null>(null);

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    setLoading(true);
    try {
      const response = await getUserMedia({ limit: 100 });
      if (Array.isArray(response.data)) {
        setMediaFiles(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch media files:", error);
      toast.error("Failed to fetch media files");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string, filename: string) => {
    setMediaToDelete({ id: mediaId, filename });
    setDeleteDialogOpen(true);
  };

  const handlePreview = (media: Media) => {
    setPreviewMedia(media);
    setPreviewOpen(true);
  };

  const confirmDelete = async () => {
    if (!mediaToDelete) return;

    setIsDeletingMedia(true);
    setDeletingMediaId(mediaToDelete.id);

    try {
      const response = await deleteMedia(mediaToDelete.id);
      if (response.success) {
        setMediaFiles(mediaFiles.filter((m) => m.id !== mediaToDelete.id));
        toast.success("Media deleted successfully");
      } else {
        toast.error(response.error || "Failed to delete media");
      }
    } catch (error) {
      console.error("Failed to delete media:", error);
      toast.error("Failed to delete media");
    } finally {
      setDeletingMediaId(null);
      setIsDeletingMedia(false);
      setMediaToDelete(null);
      setDeleteDialogOpen(false);
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

  const formatFileSize = (sizeMb: number): string => {
    if (sizeMb < 1) {
      return `${(sizeMb * 1024).toFixed(2)} KB`;
    }
    return `${sizeMb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      uploaded: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-sm font-medium ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredMedia = mediaFiles.filter((media) =>
    media.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Media Management</h1>
        <p className="text-muted-foreground">Manage all uploaded media files</p>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{mediaToDelete?.filename}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingMedia}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeletingMedia}
              className="bg-destructive hover:bg-destructive/90 disabled:opacity-50"
            >
              {isDeletingMedia ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog (uses AlertDialog for consistency) */}
      <AlertDialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>{previewMedia?.filename}</AlertDialogTitle>
            <AlertDialogDescription>
              Preview of the selected media file
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex items-center justify-center py-6">
            {previewMedia?.mime_type.startsWith("image/") && (
              <img
                src={`https://api.ieltskaro.com/media/${previewMedia.id}/url`}
                alt={previewMedia.filename}
                className="max-w-full max-h-[60vh] object-contain rounded"
              />
            )}
            {previewMedia?.mime_type.startsWith("audio/") && (
              <audio controls className="w-full">
                <source
                  src={`https://api.ieltskaro.com/media/${previewMedia.id}/url`}
                  type={previewMedia.mime_type}
                />
                Your browser does not support the audio element.
              </audio>
            )}
            {previewMedia?.mime_type === "application/pdf" && (
              <iframe
                src={`https://api.ieltskaro.com/media/${previewMedia.id}/url`}
                className="w-full h-[60vh] rounded"
                title={previewMedia.filename}
              />
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Search Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Media List */}
      <Card>
        <CardHeader>
          <CardTitle>Media Files ({filteredMedia.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p>Loading media files...</p>
              </div>
            </div>
          ) : filteredMedia.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">File</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Size</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Created At
                    </th>
                    <th className="text-right py-3 px-4 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedia.map((media) => (
                    <tr
                      key={media.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getFileIcon(media.mime_type)}
                          <button
                            onClick={() => handlePreview(media)}
                            className="font-medium truncate max-w-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                          >
                            {media.filename}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">
                          {media.mime_type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">
                          {formatFileSize(media.size_mb)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(media.status)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(media.created_at)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleDeleteMedia(media.id, media.filename)
                            }
                            disabled={deletingMediaId !== null}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No media files found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
