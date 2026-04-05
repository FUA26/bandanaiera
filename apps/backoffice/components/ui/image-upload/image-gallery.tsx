"use client";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { UploadedImage } from '@/lib/image-upload/types';

interface ImageGalleryProps {
  images: UploadedImage[];
  onRemove: (id: string) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
}

function SortableImage({ image, onRemove }: { image: UploadedImage; onRemove: (id: string) => void }) {
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

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <Card className="overflow-hidden">
        <img
          src={image.preview}
          alt="Preview"
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove(image.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-2 left-2 bg-black/50 rounded p-1 cursor-grab">
          <GripVertical className="h-4 w-4 text-white" />
        </div>
        {image.status === 'uploading' && (
          <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-xs p-1 text-center">
            Uploading {Math.round(image.progress)}%
          </div>
        )}
        {image.status === 'error' && (
          <div className="absolute bottom-0 left-0 right-0 bg-destructive/80 text-white text-xs p-1 text-center">
            {image.error || 'Upload failed'}
          </div>
        )}
      </Card>
    </div>
  );
}

export function ImageGallery({ images, onRemove, onReorder }: ImageGalleryProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: { active: { id: string }; over: { id: string } }) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images.map((img) => img.id)} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <SortableImage key={image.id} image={image} onRemove={onRemove} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
