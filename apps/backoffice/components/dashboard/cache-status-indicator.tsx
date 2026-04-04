"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Activity } from "lucide-react";

interface CacheStats {
  keyCount: number;
  memoryUsage: number;
  connected: boolean;
  redisVersion: string;
  uptimeSeconds: number;
  uptimeFormatted: string;
  timestamp: string;
}

export function CacheStatusIndicator() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/cache/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch cache stats");
      }
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-sm text-muted-foreground">Error: {error || "Unknown error"}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Cache Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              stats.connected ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <span className="text-sm">
            {stats.connected ? "Connected" : "Disconnected"}
          </span>
          <Badge variant={stats.connected ? "default" : "secondary"} className="ml-2">
            {stats.connected ? "Active" : "Inactive"}
          </Badge>
        </div>

        {stats.connected && (
          <>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  <span className="text-xs">Keys</span>
                </div>
                <p className="text-2xl font-bold">{stats.keyCount.toLocaleString()}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Database className="h-4 w-4" />
                  <span className="text-xs">Memory</span>
                </div>
                <p className="text-2xl font-bold">{stats.memoryUsage.toFixed(2)} MB</p>
              </div>
            </div>

            <div className="space-y-1 border-t pt-4">
              <p className="text-xs text-muted-foreground">Version: {stats.redisVersion}</p>
              <p className="text-xs text-muted-foreground">Uptime: {stats.uptimeFormatted}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
