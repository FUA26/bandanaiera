"use client";

/**
 * Service Dialog Component
 *
 * Dialog wrapper for the service form
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceForm } from "@/components/admin/service-form";
import type { ServiceInput, ServiceUpdateInput } from "@/lib/services/validations";
import { useState } from "react";
import { toast } from "sonner";

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  serviceId?: string;
  initialData?: Partial<ServiceInput> | Partial<ServiceUpdateInput>;
  categories: Array<{ id: string; name: string; slug: string }>;
  onSuccess?: () => void;
}

export function ServiceDialog({
  open,
  onOpenChange,
  mode,
  serviceId,
  initialData,
  categories,
  onSuccess,
}: ServiceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ServiceInput | ServiceUpdateInput) => {
    setIsLoading(true);
    try {
      const url = mode === "create" ? "/api/services" : `/api/services/${serviceId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save service");
      }

      toast.success(mode === "create" ? "Service created successfully" : "Service updated successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save service");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] md:max-w-[900px] w-[95vw] sm:w-[90vw] md:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Service" : "Edit Service"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to create a new service."
              : "Update the service details."}
          </DialogDescription>
        </DialogHeader>

        <ServiceForm
          mode={mode}
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
}
