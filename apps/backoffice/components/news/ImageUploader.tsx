"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
    value: string | null;
    onChange: (fileId: string | null) => void;
    onError?: (error: string) => void;
    /** Optional existing CDN URL to show as preview (for editing) */
    previewSrc?: string | null;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function ImageUploader({ value, onChange, onError, previewSrc }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(previewSrc ?? null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return "Hanya file JPG, PNG, dan WEBP yang diperbolehkan";
        }
        if (file.size > MAX_SIZE) {
            return "Ukuran file maksimal 5MB";
        }
        return null;
    };

    const uploadFile = async (file: File) => {
        const error = validateFile(file);
        if (error) {
            onError?.(error);
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "IMAGE");
        formData.append("isPublic", "true");

        try {
            const res = await fetch("/api/files", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Upload gagal");
            }

            const data = await res.json();
            onChange(data.file.id);
            setPreviewUrl(data.file.cdnUrl);
        } catch (err) {
            onError?.(err instanceof Error ? err.message : "Upload gagal");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files?.[0]) {
            uploadFile(files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files?.[0]) {
            uploadFile(files[0]);
        }
    };

    const handleRemove = () => {
        onChange(null);
        setPreviewUrl(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const hasImage = value || previewUrl;

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">Gambar Unggulan (Featured Image)</label>

            {!hasImage ? (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                        dragActive
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-primary/50"
                    )}
                    onClick={() => !isUploading && inputRef.current?.click()}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Mengunggah gambar...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm font-medium">Drag &amp; drop gambar di sini</p>
                            <p className="text-xs text-muted-foreground">atau klik untuk memilih file</p>
                            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP (maks 5MB)</p>
                        </div>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleChange}
                        className="hidden"
                        disabled={isUploading}
                    />
                </div>
            ) : (
                <div className="relative rounded-lg overflow-hidden border bg-muted">
                    {previewUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                        />
                    )}
                    {!previewUrl && value && (
                        <div className="w-full h-48 flex items-center justify-center text-sm text-muted-foreground">
                            <Upload className="h-6 w-6 mr-2" />
                            Gambar tersimpan (ID: {value.slice(0, 8)}…)
                        </div>
                    )}
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
