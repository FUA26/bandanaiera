"use client";

import { useCallback, useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageGallery } from './image-gallery';
import { validateImageFile, validateImageDimensions, getImageDimensions } from '@/lib/image-upload/validation';
import { compressImage, generatePreview } from '@/lib/image-upload/compression';
import type { UploadedImage, ImageUploadOptions } from '@/lib/image-upload/types';
import { toast } from 'sonner';

interface EnhancedImageUploaderProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  multiple?: boolean;
  category?: string;
  maxSize?: number;
  maxWidth?: number;
  quality?: number;
  disabled?: boolean;
}

export function EnhancedImageUploader({
  value = [],
  onChange,
  multiple = false,
  category = 'SERVICES',
  maxSize = 5 * 1024 * 1024,
  maxWidth = 1920,
  quality = 0.85,
  disabled = false,
}: EnhancedImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [abortControllers, setAbortControllers] = useState<Map<string, AbortController>>(new Map());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllers.forEach(controller => controller.abort());
    };
  }, [abortControllers]);

  const processFile = useCallback(async (file: File): Promise<UploadedImage | null> => {
    // Create temporary ID
    const id = crypto.randomUUID();

    try {
      // Validate file type and size
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid file');
        return null;
      }

      // Validate dimensions
      const dimensionValidation = await validateImageDimensions(file);
      if (!dimensionValidation.valid) {
        toast.error(dimensionValidation.error || 'Invalid dimensions');
        return null;
      }

      // Generate preview
      const preview = await generatePreview(file);

      // Create initial image object
      const uploadedImage: UploadedImage = {
        id,
        file,
        preview,
        status: 'processing',
        progress: 0,
      };

      return uploadedImage;
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process file');
      return null;
    }
  }, []);

  const uploadFile = useCallback(async (image: UploadedImage) => {
    // Create abort controller for this upload
    const controller = new AbortController();
    setAbortControllers(prev => new Map(prev).set(image.id, controller));

    try {
      // Update status to uploading
      onChange((prevValue) =>
        prevValue.map((img) =>
          img.id === image.id ? { ...img, status: 'uploading' as const, progress: 0 } : img
        )
      );

      // Compress if needed
      let fileToUpload = image.file;
      const dimensions = await getImageDimensions(image.file);

      if (image.file.size > 1024 * 1024 || dimensions.width > maxWidth) {
        const compressed = await compressImage(image.file, {
          maxSize,
          maxWidth,
          quality,
        });
        fileToUpload = new File([compressed], image.file.name, {
          type: image.file.type,
        });
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('category', category);
      formData.append('isPublic', 'true');

      // Upload with progress tracking
      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();

      // Update with server response
      onChange((prevValue) =>
        prevValue.map((img) =>
          img.id === image.id
            ? {
                ...img,
                status: 'success' as const,
                progress: 100,
                serverResponse: result.file,
              }
            : img
        )
      );

      toast.success('Image uploaded successfully');
    } catch (error) {
      // Don't show error if aborted
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';

      onChange((prevValue) =>
        prevValue.map((img) =>
          img.id === image.id
            ? {
                ...img,
                status: 'error' as const,
                error: errorMessage,
              }
            : img
        )
      );

      toast.error(errorMessage);
    } finally {
      // Clean up controller
      setAbortControllers(prev => {
        const next = new Map(prev);
        next.delete(image.id);
        return next;
      });
    }
  }, [onChange, category, maxSize, maxWidth, quality]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    if (!multiple && fileArray.length > 1) {
      toast.error('Only one image allowed');
      return;
    }

    // Process all files
    const processedImages = await Promise.all(
      fileArray.map((file) => processFile(file))
    );

    const validImages = processedImages.filter(
      (img): img is UploadedImage => img !== null
    );

    if (validImages.length === 0) {
      return;
    }

    // Add to state
    onChange((prevValue) => {
      if (!multiple && prevValue.length > 0) {
        toast.error('Remove existing image first');
        return prevValue;
      }
      return [...prevValue, ...validImages];
    });

    // Start uploads
    for (const image of validImages) {
      await uploadFile(image);
    }
  }, [multiple, onChange, processFile, uploadFile]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      handleFiles(files);
    },
    [disabled, handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const handleRemove = useCallback(
    (id: string) => {
      onChange((prevValue) => prevValue.filter((img) => img.id !== id));
    },
    [onChange]
  );

  const handleReorder = useCallback(
    (oldIndex: number, newIndex: number) => {
      onChange((prevValue) => {
        const newImages = [...prevValue];
        const [removed] = newImages.splice(oldIndex, 1);
        newImages.splice(newIndex, 0, removed);
        return newImages;
      });
    },
    [onChange]
  );

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label htmlFor="file-upload">
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">
                {multiple ? 'Upload Images' : 'Upload Image'}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, or WEBP up to {Math.round(maxSize / (1024 * 1024))}MB
              </p>
            </div>
            <Button type="button" variant="outline" disabled={disabled}>
              Select File
            </Button>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple={multiple}
            onChange={handleFileInput}
            disabled={disabled}
          />
        </label>
      </Card>

      {value.length > 0 && (
        <ImageGallery
          images={value}
          onRemove={handleRemove}
          onReorder={handleReorder}
        />
      )}
    </div>
  );
}
