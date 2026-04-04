"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

type CacheType = "news" | "tourism" | "events" | "services" | "all";

interface ClearCacheButtonProps {
  type: CacheType;
  label?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const typeLabels: Record<CacheType, string> = {
  news: "News Cache",
  tourism: "Tourism Cache",
  events: "Events Cache",
  services: "Services Cache",
  all: "All Cache",
};

const typeDescriptions: Record<CacheType, string> = {
  news: "This will clear all cached news data. The next request will fetch fresh data from the database.",
  tourism: "This will clear all cached tourism data. The next request will fetch fresh data from the database.",
  events: "This will clear all cached events data. The next request will fetch fresh data from the database.",
  services: "This will clear all cached services data. The next request will fetch fresh data from the database.",
  all: "This will clear ALL cached data. The next requests will fetch fresh data from the database.",
};

export function ClearCacheButton({
  type,
  label,
  variant = "outline",
  size = "sm",
}: ClearCacheButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClear = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/cache/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          type === "all" ? { all: true } : { type }
        ),
      });

      if (!response.ok) {
        throw new Error("Failed to clear cache");
      }

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Cache cleared successfully");
        setOpen(false);
      } else {
        toast.error(data.message || "Failed to clear cache");
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast.error(error instanceof Error ? error.message : "Failed to clear cache");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Clearing...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              {label || `Clear ${typeLabels[type]}`}
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear {typeLabels[type]}?</AlertDialogTitle>
          <AlertDialogDescription>
            {typeDescriptions[type]}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleClear();
            }}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Clearing...
              </>
            ) : (
              "Clear Cache"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
