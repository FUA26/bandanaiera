'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, History } from 'lucide-react';
import { DestinationsDataTable } from '@/components/admin/destinations-data-table';
import { DestinationDialog } from '@/components/admin/destination-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DestinationsClientProps {
  initialDestinations: any[];
  categories: any[];
  facilities: any[];
}

export function DestinationsClient({
  initialDestinations,
  categories,
  facilities,
}: DestinationsClientProps) {
  const [destinations, setDestinations] = useState(initialDestinations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<any>(null);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [selectedDestinationForLogs, setSelectedDestinationForLogs] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const refreshDestinations = async () => {
    try {
      const response = await fetch('/api/destinations');
      if (response.ok) {
        const data = await response.json();
        setDestinations(data.items);
      }
    } catch (error) {
      console.error('Failed to refresh destinations:', error);
    }
  };

  const handleEdit = (destination: any) => {
    setEditingDestination(destination);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingDestination(null);
    setIsDialogOpen(true);
  };

  const handleViewLogs = async (destination: any) => {
    setSelectedDestinationForLogs(destination);
    setIsLogsOpen(true);
    setIsLoadingLogs(true);
    try {
      const response = await fetch(`/api/destinations/${destination.id}/logs`);
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
          <h1 className="text-3xl font-bold tracking-tight">Destinasi Wisata</h1>
          <p className="text-muted-foreground">
            Kelola destinasi wisata dan fasilitas yang tersedia.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Destinasi
        </Button>
      </div>

      <DestinationsDataTable
        data={destinations}
        categories={categories}
        onRefresh={refreshDestinations}
        onEdit={handleEdit}
        onViewLogs={handleViewLogs}
      />

      <DestinationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        destination={editingDestination}
        categories={categories}
        facilities={facilities}
        onSuccess={refreshDestinations}
      />

      <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Activity Logs: {selectedDestinationForLogs?.name}</DialogTitle>
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
