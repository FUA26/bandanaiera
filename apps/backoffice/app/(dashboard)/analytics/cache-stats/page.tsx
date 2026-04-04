"use client";

import { CacheStatusIndicator } from "@/components/dashboard/cache-status-indicator";
import { ClearCacheButton } from "@/components/dashboard/clear-cache-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Database, RefreshCw } from "lucide-react";

export default function CacheStatsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cache Statistics</h1>
          <p className="text-muted-foreground">
            Monitor and manage Redis cache performance
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Cache Status */}
        <CacheStatusIndicator />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Clear Cache by Type</p>
              <div className="grid grid-cols-2 gap-2">
                <ClearCacheButton type="news" size="sm" />
                <ClearCacheButton type="tourism" size="sm" />
                <ClearCacheButton type="events" size="sm" />
                <ClearCacheButton type="services" size="sm" />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium">Danger Zone</p>
              <ClearCacheButton
                type="all"
                label="Clear All Cache"
                variant="destructive"
                size="sm"
              />
              <p className="text-xs text-muted-foreground">
                This will clear all cached data across all types
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About Caching</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Redis caching improves performance by storing frequently accessed data
              in memory. This reduces database load and speeds up response times.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">When to Clear</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>After bulk content updates</li>
              <li>When data appears stale</li>
              <li>During troubleshooting</li>
              <li>After schema changes</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4" />
              Cache Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>News:</strong> Articles and categories</li>
              <li><strong>Tourism:</strong> Spots and categories</li>
              <li><strong>Events:</strong> Events and categories</li>
              <li><strong>Services:</strong> Services and categories</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
