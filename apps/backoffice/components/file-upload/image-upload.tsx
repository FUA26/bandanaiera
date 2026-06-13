/**
 * Image Upload Component with Preview
 *
 * Enhanced image upload with preview, single/multi mode, and existing images support
 */

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, ImagePlus, Trash2, X, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface ImageFile {
  id?: string; // Existing file ID
  url: string; // Preview URL (can be blob URL for new files)
  file?: File; // File object for new uploads
  status: "existing" | "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface ImageUploadProps {
  images?: ImageFile[]; // Existing images
  onImagesChange?: (images: ImageFile[]) => void;
  onUploadComplete?: (fileIds: string[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
  label?: string;
  aspectRatio?: "square" | "landscape" | "portrait" | "free";
  showPreview?: boolean;
}

export function ImageUpload({
  images = [],
  onImagesChange,
  onUploadComplete,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB default
  disabled = false,
  className,
  label = "Images",
  aspectRatio = "free",
  showPreview = true,
}: ImageUploadProps) {
  const [currentImages, setCurrentImages] = useState<ImageFile[]>(images);
  const [isUploading, setIsUploading] = useState(false);

  const updateImages = useCallback(
    (newImages: ImageFile[]) => {
      setCurrentImages(newImages);
      onImagesChange?.(newImages);
    },
    [onImagesChange]
  );

  const uploadFile = async (file: File): Promise<ImageFile> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "IMAGE");
    formData.append("isPublic", "true");

    try {
      const response = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      return {
        id: data.file.id,
        url: `/api/public/files/${data.file.id}/serve`,
        file,
        status: "success",
      };
    } catch (error) {
      return {
        url: URL.createObjectURL(file),
        file,
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  };

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      // Check max files limit
      if (currentImages.length + files.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} file(s) allowed`);
        return;
      }

      // Validate files
      const validFiles: File[] = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }
        if (file.size > maxSize) {
          toast.error(`${file.name} is too large (max ${(maxSize / 1024 / 1024).toFixed(1)}MB)`);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      setIsUploading(true);

      // Create preview URLs and mark as pending
      const newImages: ImageFile[] = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        file,
        status: "pending",
      }));

      updateImages([...currentImages, ...newImages]);

      // Upload files
      const uploadedImages: ImageFile[] = [];
      for (let i = 0; i < newImages.length; i++) {
        const image = newImages[i];
        const index = currentImages.length + i;

        // Update status to uploading
        updateImages((prev) =>
          prev.map((img, idx) =>
            idx === index ? { ...img, status: "uploading" } : img
          )
        );

        // Upload
        const result = await uploadFile(image.file!);

        if (result.status === "error") {
          toast.error(result.error);
        }

        uploadedImages.push(result);
      }

      // Update with results
      updateImages((prev) => {
        const updated = [...prev];
        uploadedImages.forEach((result, i) => {
          const index = currentImages.length + i;
          updated[index] = result;
        });
        return updated;
      });

      // Call completion callback
      const successImages = uploadedImages.filter((img) => img.status === "success" && img.id);
      if (successImages.length > 0) {
        const fileIds = successImages.map((img) => img.id!);
        onUploadComplete?.(fileIds);
      }

      setIsUploading(false);

      // Reset input
      e.target.value = "";
    },
    [currentImages, maxFiles, maxSize, updateImages, onUploadComplete]
  );

  const removeImage = useCallback(
    (index: number) => {
      const newImages = currentImages.filter((_, i) => i !== index);
      updateImages(newImages);
    },
    [currentImages, updateImages]
  );

  const getPreviewClassName = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "landscape":
        return "aspect-video";
      case "portrait":
        return "aspect-[3/4]";
      default:
        return "";
    }
  };

  const isMulti = maxFiles > 1;
  const hasSlots = currentImages.length < maxFiles;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Label and count */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs text-muted-foreground">
          {currentImages.length}/{maxFiles} {currentImages.length === 1 ? "image" : "images"}
        </span>
      </div>

      {/* Images grid */}
      <div className={cn(
        "grid gap-4",
        isMulti ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"
      )}>
        {/* Existing/uploaded images */}
        {currentImages.map((image, index) => (
          <div key={index} className="relative group">
            <div className={cn(
              "relative overflow-hidden rounded-lg border bg-muted",
              getPreviewClassName(),
              !isMulti && "max-w-[200px]"
            )}>
              {showPreview ? (
                <img
                  src={image.url}
                  alt={`${label} ${index + 1}`}
                  className={cn(
                    "w-full h-full object-cover",
                    image.status === "uploading" && "opacity-50"
                  )}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-muted-foreground truncate px-2">
                    {image.file?.name || `Image ${index + 1}`}
                  </span>
                </div>
              )}

              {/* Status overlay */}
              {image.status === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}

              {image.status === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
              )}

              {image.status === "success" && (
                <div className="absolute top-2 right-2">
                  <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}

              {/* Remove button */}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                disabled={disabled || isUploading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Error message */}
            {image.status === "error" && (
              <p className="text-xs text-destructive mt-1">{image.error}</p>
            )}
          </div>
        ))}

        {/* Upload button */}
        {hasSlots && !disabled && (
          <div className={cn(
            "relative",
            !isMulti && "max-w-[200px]"
          )}>
            <input
              type="file"
              accept="image/*"
              multiple={isMulti}
              onChange={handleFileSelect}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className={cn(
              "flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 hover:bg-muted/50 transition-colors",
              getPreviewClassName(),
              isUploading && "opacity-50 cursor-not-allowed"
            )}>
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground text-center px-2">
                    {isMulti ? "Add images" : "Add image"}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Help text */}
      <p className="text-xs text-muted-foreground">
        Accepts: JPG, PNG, GIF, WebP (max {(maxSize / 1024 / 1024).toFixed(1)}MB each)
      </p>
    </div>
  );
}
