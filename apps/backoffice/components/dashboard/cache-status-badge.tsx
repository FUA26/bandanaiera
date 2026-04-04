"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CacheStats {
  keyCount: number;
  memoryUsage: number;
  connected: boolean;
  redisVersion?: string;
  uptimeFormatted?: string;
  timestamp: string;
}

export function CacheStatusBadge() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/cache/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
          setError(false);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Cache
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Loading cache status...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (error || !stats) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="destructive" className="gap-1">
              <WifiOff className="h-3 w-3" />
              Cache
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redis cache is unavailable</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!stats.connected) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="gap-1">
              <WifiOff className="h-3 w-3" />
              Cache
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redis caching is disabled via REDIS_ENABLED flag</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
            <Wifi className="h-3 w-3" />
            Cache
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">Redis Cache Connected</p>
            <p className="text-xs text-muted-foreground">
              Version: {stats.redisVersion || "unknown"}
            </p>
            <p className="text-xs text-muted-foreground">
              Uptime: {stats.uptimeFormatted || "unknown"}
            </p>
            <p className="text-xs text-muted-foreground">
              Keys: {stats.keyCount}
            </p>
            <p className="text-xs text-muted-foreground">
              Memory: {stats.memoryUsage}MB
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
