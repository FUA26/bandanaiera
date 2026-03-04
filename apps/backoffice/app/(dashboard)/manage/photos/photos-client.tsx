'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, History } from 'lucide-react';
import { PhotosDataTable } from '@/components/admin/photos-data-table';
import { PhotoDialog } from '@/components/admin/photo-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PhotosClientProps {
  initialPhotos: any[];
  albums: any[];
  tags: any[];
}

export function PhotosClient({
  initialPhotos,
  albums,
  tags,
}: PhotosClientProps) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhoto, setEditingNews] = useState<any>(null);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [selectedPhotoForLogs, setSelectedPhotoForLogs] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const refreshPhotos = async () => {
    try {
      const response = await fetch('/api/photos');
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.items);
      }
    } catch (error) {
      console.error('Failed to refresh photos:', error);
    }
  };

  const handleEdit = (photo: any) => {
    setEditingNews(photo);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingNews(null);
    setIsDialogOpen(true);
  };

  const handleViewLogs = async (photo: any) => {
    setSelectedPhotoForLogs(photo);
    setIsLogsOpen(true);
    setIsLoadingLogs(true);
    try {
      const response = await fetch(`/api/photos/${photo.id}/logs`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Galeri Foto</h1>
          <p className="text-muted-foreground">
            Kelola foto dan album galeri untuk landing page.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Foto
        </Button>
      </div>

      <PhotosDataTable
        data={photos}
        albums={albums}
        onRefresh={refreshPhotos}
        onEdit={handleEdit}
        onViewLogs={handleViewLogs}
      />

      <PhotoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        photo={editingPhoto}
        albums={albums}
        tags={tags}
        onSuccess={refreshPhotos}
      />

      <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Activity Logs: {selectedPhotoForLogs?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              {isLoadingLogs ? (
                <div className="flex justify-center py-8 text-muted-foreground">
                  Loading logs...
                </div>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="border-l-2 border-primary pl-4 py-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm capitalize">
                        {log.action}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      oleh {log.user.name || log.user.email}
                    </div>
                    {log.changes && (
                      <pre className="mt-2 text-[10px] bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.changes, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No activity logs found.
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
