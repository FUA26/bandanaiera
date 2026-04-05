// apps/backoffice/lib/image-upload/validation.ts

import type { ImageValidationResult } from './types';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSIONS = 4000;
const MIN_DIMENSIONS = 100;

/**
 * Validate file type and size
 */
export function validateImageFile(file: File): ImageValidationResult {
  // Check type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Hanya file JPG, PNG, dan WEBP yang diperbolehkan',
    };
  }

  // Check size
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: 'Ukuran file maksimal 5MB',
    };
  }

  return { valid: true };
}

/**
 * Validate image dimensions
 */
export async function validateImageDimensions(
  file: File
): Promise<ImageValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { width, height } = img;

      if (width < MIN_DIMENSIONS || height < MIN_DIMENSIONS) {
        resolve({
          valid: false,
          error: `Ukuran minimal ${MIN_DIMENSIONS}x${MIN_DIMENSIONS}px`,
        });
        return;
      }

      if (width > MAX_DIMENSIONS || height > MAX_DIMENSIONS) {
        resolve({
          valid: false,
          error: `Ukuran maksimal ${MAX_DIMENSIONS}x${MAX_DIMENSIONS}px`,
        });
        return;
      }

      resolve({
        valid: true,
        dimensions: { width, height },
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: 'Gagal memuat gambar. Pastikan file tidak corrupt.',
      });
    };

    img.src = url;
  });
}

/**
 * Get image dimensions
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gagal memuat gambar'));
    };

    img.src = url;
  });
}
