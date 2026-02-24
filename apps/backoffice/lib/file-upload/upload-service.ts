/**
 * Upload Service
 *
 * Core upload business logic:
 * 1. Validate file (size, type, magic bytes)
 * 2. Upload to MinIO
 * 3. Create database record
 * 4. Return file metadata and URL
 */

import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { getFileById, softDeleteFile } from "@/lib/file-upload/file-crud";
import { validateFile } from "@/lib/storage/file-validator";
import { ensureBucket, getPublicUrl, getS3Client } from "@/lib/storage/minio-client";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { FileCategory } from "@prisma/client";
import { randomUUID } from "crypto";

/**
 * Upload file metadata
 */
export interface UploadFileOptions {
  file: File | Buffer;
  filename: string;
  category: FileCategory;
  userId: string;
  isPublic?: boolean;
  expiresAt?: Date | null;
}

/**
 * Upload result with file metadata and URL
 */
export interface UploadResult {
  id: string;
  originalFilename: string;
  storedFilename: string;
  mimeType: string;
  size: number;
  category: FileCategory;
  storagePath: string;
  cdnUrl: string;
  serveUrl: string; // App's proxied URL (works from any domain)
  isPublic: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}

/**
 * Upload file workflow: validate → upload to MinIO → create DB record
 */
export async function uploadFile(options: UploadFileOptions): Promise<UploadResult> {
  const { file, filename, category, userId, isPublic = false, expiresAt } = options;

  // 1. Validate file
  const validation = await validateFile(file, filename, category);
  if (!validation.valid) {
    throw new Error(validation.error || "File validation failed");
  }

  const { sanitizedFilename, mimeType, detectedType } = validation;
  if (!sanitizedFilename || !mimeType) {
    throw new Error("File validation incomplete");
  }

  // 2. Generate storage path: {userId}/{category}/{uuid}.ext
  const ext = detectedType?.ext || "bin";
  const storedFilename = `${randomUUID()}.${ext}`;
  const storagePath = `${userId}/${category.toLowerCase()}/${storedFilename}`;

  // 3. Get file buffer
  let buffer: Buffer;
  if (file instanceof File) {
    buffer = Buffer.from(await file.arrayBuffer());
  } else {
    buffer = file;
  }

  // 4. Ensure bucket exists
  await ensureBucket();

  // 5. Upload to MinIO
  const s3 = getS3Client();
  await s3.send(
    new PutObjectCommand({
      Bucket: env.MINIO_BUCKET,
      Key: storagePath,
      Body: buffer,
      ContentType: mimeType,
      Metadata: {
        "original-filename": sanitizedFilename,
        "uploaded-by": userId,
        "file-category": category,
      },
    })
  );

  // 6. Generate URLs
  const cdnUrl = getPublicUrl(storagePath);
  const serveUrl = `/api/files/__TEMP_ID__/serve`; // Will be replaced after DB insert

  // 7. Create database record
  const fileRecord = await prisma.file.create({
    data: {
      originalFilename: sanitizedFilename,
      storedFilename,
      mimeType,
      size: buffer.length,
      category,
      bucketName: env.MINIO_BUCKET,
      storagePath,
      cdnUrl,
      uploadedById: userId,
      isPublic,
      expiresAt,
    },
  });

  // Generate actual serve URL with file ID
  const actualServeUrl = `/api/files/${fileRecord.id}/serve`;

  return {
    id: fileRecord.id,
    originalFilename: fileRecord.originalFilename,
    storedFilename: fileRecord.storedFilename,
    mimeType: fileRecord.mimeType,
    size: fileRecord.size,
    category: fileRecord.category,
    storagePath: fileRecord.storagePath,
    cdnUrl: fileRecord.cdnUrl || cdnUrl,
    serveUrl: actualServeUrl,
    isPublic: fileRecord.isPublic,
    expiresAt: fileRecord.expiresAt,
    createdAt: fileRecord.createdAt,
  };
}

/**
 * Delete file with permission check
 */
export async function deleteFile(
  fileId: string,
  requestUserId: string,
  hasAdminPermission: boolean = false
): Promise<void> {
  // 1. Get file with permission check
  const file = await getFileById(fileId, requestUserId);
  if (!file) {
    throw new Error("File not found or access denied");
  }

  // 2. Check permission: user owns it OR has admin permission
  if (file.uploadedById !== requestUserId && !hasAdminPermission) {
    throw new Error("You don't have permission to delete this file");
  }

  // 3. Delete from MinIO
  const s3 = getS3Client();
  await s3.send(
    new DeleteObjectCommand({
      Bucket: env.MINIO_BUCKET,
      Key: file.storagePath,
    })
  );

  // 4. Soft delete from database
  await softDeleteFile(fileId);
}

/**
 * Generate presigned URL for direct upload (client → MinIO)
 * Expires in 15 minutes
 */
export async function generatePresignedUploadUrl(
  userId: string,
  filename: string,
  contentType: string,
  category: FileCategory
): Promise<{ uploadUrl: string; storagePath: string }> {
  // Generate storage path
  const ext = filename.split(".").pop() || "bin";
  const storedFilename = `${randomUUID()}.${ext}`;
  const storagePath = `${userId}/${category.toLowerCase()}/${storedFilename}`;

  // Generate presigned URL (expires in 15 minutes)
  const s3 = getS3Client();
  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: env.MINIO_BUCKET,
      Key: storagePath,
      ContentType: contentType,
    }),
    { expiresIn: 900 } // 15 minutes
  );

  return {
    uploadUrl,
    storagePath,
  };
}

/**
 * Generate presigned URL for download
 * Expires in 1 hour
 */
export async function generatePresignedDownloadUrl(
  fileId: string,
  requestUserId: string,
  hasAdminPermission: boolean = false
): Promise<string> {
  // Get file with permission check
  const file = await getFileById(fileId, requestUserId);
  if (!file) {
    throw new Error("File not found or access denied");
  }

  // Check permission: user owns it OR file is public OR has admin permission
  if (file.uploadedById !== requestUserId && !file.isPublic && !hasAdminPermission) {
    throw new Error("You don't have permission to access this file");
  }

  // Update last accessed
  // await markAsAccessed(fileId); // Can be done asynchronously

  // Generate presigned URL
  const s3 = getS3Client();
  return await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: env.MINIO_BUCKET,
      Key: file.storagePath,
    }),
    { expiresIn: 3600 } // 1 hour
  );
}
