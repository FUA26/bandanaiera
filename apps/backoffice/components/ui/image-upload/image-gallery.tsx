"use client";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { UploadedImage } from '@/lib/image-upload/types';

interface ImageGalleryProps {
  uploadedIds: string[];  // Already uploaded (just IDs)
  uploadingImages: UploadedImage[];  // Currently uploading (full objects)
  onRemove: (id: string) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
  multiple?: boolean;
}

function SortableImage({
  image,
  onRemove,
  isUploading
}: {
  image: UploadedImage | { id: string };
  onRemove: (id: string) => void;
  isUploading: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // For uploaded images, we need to fetch the URL from the server
  // For now, we'll use a placeholder with the ID
  const imageSrc = isUploading && 'preview' in image ? image.preview : `/api/files/${image.id}/serve`;

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <Card className="overflow-hidden">
        <img
          src={imageSrc}
          alt="Preview"
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove(image.id)}
            data-testid="remove-image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-2 left-2 bg-black/50 rounded p-1 cursor-grab">
          <GripVertical className="h-4 w-4 text-white" />
        </div>
        {isUploading && 'status' in image && image.status === 'uploading' && (
          <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-xs p-1 text-center">
            Uploading {Math.round(image.progress || 0)}%
          </div>
        )}
        {isUploading && 'status' in image && image.status === 'error' && (
          <div className="absolute bottom-0 left-0 right-0 bg-destructive/80 text-white text-xs p-1 text-center">
            {image.error || 'Upload failed'}
          </div>
        )}
      </Card>
    </div>
  );
}

export function ImageGallery({
  uploadedIds,
  uploadingImages,
  onRemove,
  onReorder,
  multiple = true
}: ImageGalleryProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Combine uploaded IDs and uploading images for display
  // Only allow reordering of uploaded images
  const allItems = [
    ...uploadingImages.map(img => ({ ...img, isUploading: true })),
    ...uploadedIds.map(id => ({ id, isUploading: false }))
  ];

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      // Find the indices in the uploadedIds array (only uploaded images can be reordered)
      const oldIndex = uploadedIds.findIndex((id) => id === active.id);
      const newIndex = uploadedIds.findIndex((id) => id === over.id);

      // Only reorder if both are uploaded images
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={allItems.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allItems.map((item) => (
            <SortableImage
              key={item.id}
              image={item}
              onRemove={onRemove}
              isUploading={item.isUploading}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
