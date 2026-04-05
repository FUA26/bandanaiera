/**
 * Image Upload Types
 */

export type ImageUploadStatus = 'pending' | 'processing' | 'uploading' | 'success' | 'error';

export interface UploadedImage {
  id: string; // temporary UUID
  file: File;
  preview: string; // base64 preview
  compressed?: Blob;
  cropped?: Blob;
  status: ImageUploadStatus;
  progress: number;
  error?: string;
  serverResponse?: {
    id: string;
    cdnUrl: string;
    serveUrl: string;
  };
}

export interface ImageUploadOptions {
  maxSize?: number; // bytes, default 5MB
  maxWidth?: number; // pixels, default 1920
  maxHeight?: number; // pixels, default 1920
  quality?: number; // 0-1, default 0.85
  outputFormat?: 'original' | 'webp';
}

export interface CropOptions {
  aspectRatio?: number | null;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}
