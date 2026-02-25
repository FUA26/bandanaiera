"use client";

/**
 * Sync Button Component
 *
 * Button to sync services to the landing app
 * Triggers cache invalidation on the landing app
 */

import { Button } from "@/components/ui/button";
import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";

interface SyncButtonProps {
  onSyncComplete?: () => void;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
  className?: string;
}

export function SyncButton({
  onSyncComplete,
  variant = "outline",
  size = "default",
  className,
}: SyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/services/sync", {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to sync services");
      }

      const data = await response.json();
      toast.success(data.message || "Services synced successfully");
      onSyncComplete?.();
    } catch (error) {
      console.error("Error syncing services:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sync services");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSync}
      disabled={isLoading}
      className={className}
    >
      <HugeiconsIcon
        icon={RefreshIcon}
        className={`h-4 w-4 ${size !== "icon" ? "mr-2" : ""} ${isLoading ? "animate-spin" : ""}`}
      />
      {size !== "icon" && (isLoading ? "Syncing..." : "Sync to Landing")}
    </Button>
  );
}
