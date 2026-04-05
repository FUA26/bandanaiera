// apps/backoffice/lib/image-upload/compression.ts

import imageCompression from 'browser-image-compression';
import type { ImageUploadOptions } from './types';

const DEFAULT_MAX_DIMENSION = 1920;

const DEFAULT_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: DEFAULT_MAX_DIMENSION,
  useWebWorker: true,
  quality: 0.85,
};

/**
 * Compress image on client side
 */
export async function compressImage(
  file: File,
  options: Partial<ImageUploadOptions> = {}
): Promise<Blob> {
  const compressionOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    maxSizeMB: options.maxSize ? options.maxSize / (1024 * 1024) : DEFAULT_OPTIONS.maxSizeMB,
    maxWidthOrHeight: options.maxWidth || options.maxHeight || DEFAULT_MAX_DIMENSION,
  };

  try {
    const compressedFile = await imageCompression(file, compressionOptions);
    return compressedFile;
  } catch (error) {
    console.error('Compression error:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Convert file to blob
 */
export function fileToBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Blob([reader.result], { type: file.type }));
      } else {
        reject(new Error('Failed to convert file to blob'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Generate base64 preview
 */
export function generatePreview(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to generate preview'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
