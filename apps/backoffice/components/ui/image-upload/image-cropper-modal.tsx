"use client";

import { useState, useCallback, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { getCroppedImg } from "@/lib/image-upload/crop-utils";
import { toast } from "sonner";

interface ImageCropperModalProps {
  open: boolean;
  image: File;
  preview: string;
  onCrop: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number | null;
}

export function ImageCropperModal({
  open,
  image,
  preview,
  onCrop,
  onCancel,
  aspectRatio = null,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState<string>(preview);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cleanup effect for blob URLs
  useEffect(() => {
    setImgSrc(preview);
    return () => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = aspectRatio
      ? makeAspectCrop(
          {
            unit: '%' as const,
            width: 90,
          },
          aspectRatio,
          width,
          height
        )
      : {
          unit: '%' as const,
          width: 90,
          height: 90,
          x: 5,
          y: 5,
        };

    setCrop(centerCrop(initialCrop, width, height));
  };

  const handleCrop = useCallback(async () => {
    if (!completedCrop || !imageRef) return;

    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageRef, completedCrop);
      onCrop(croppedBlob);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [completedCrop, imageRef, onCrop]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Adjust the crop area to select the portion you want to keep.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center bg-muted p-4 rounded-lg">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio || undefined}
            keepSelection
          >
            <img
              ref={setImageRef}
              alt="Crop preview"
              src={imgSrc}
              onLoad={onImageLoad}
              className="max-w-full max-h-[500px]"
            />
          </ReactCrop>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleCrop} disabled={!completedCrop || isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
