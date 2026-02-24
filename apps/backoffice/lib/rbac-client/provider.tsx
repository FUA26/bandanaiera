"use client";

/**
 * RBAC Permission Provider
 *
 * React Context Provider for client-side permission management.
 * Fetches permissions from the API and provides them to all child components.
 */

import { getClientCache } from "@/lib/rbac/cache";
import type { Permission, UserPermissionsContext } from "@/lib/rbac/types";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface PermissionContextValue {
  permissions: UserPermissionsContext | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  can: (requiredPermissions: Permission[]) => boolean;
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

interface PermissionProviderProps {
  children: React.ReactNode;
  /** Initial permissions from server-side (prevents client fetching) */
  initialPermissions?: UserPermissionsContext | null;
  endpoint?: string;
  enableCache?: boolean;
  cacheTTL?: number;
  /** Polling interval in milliseconds (default: 60 seconds). Set to null to disable polling. */
  pollingInterval?: number | null;
}

export function PermissionProvider({
  children,
  initialPermissions = null,
  endpoint = "/api/rbac/permissions",
  enableCache = true,
  cacheTTL = 5 * 60 * 1000,
  pollingInterval = 60000, // Default: 60 seconds
}: PermissionProviderProps) {
  // Use initial permissions if provided, otherwise start with null
  const [permissions, setPermissions] = useState<UserPermissionsContext | null>(initialPermissions);
  const [isLoading, setIsLoading] = useState(initialPermissions === null);
  const [error, setError] = useState<Error | null>(null);

  const configRef = useRef({ endpoint, enableCache, cacheTTL, pollingInterval });
  configRef.current = { endpoint, enableCache, cacheTTL, pollingInterval };

  const refreshRef = useRef<(() => Promise<void>) | null>(null);
  const permissionsRef = useRef<UserPermissionsContext | null>(permissions);
  permissionsRef.current = permissions;

  // Create refresh function once
  if (!refreshRef.current) {
    refreshRef.current = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { endpoint: currentEndpoint } = configRef.current;
        const response = await fetch(currentEndpoint);

        if (!response.ok) {
          if (response.status === 401) {
            setPermissions(null);
            setIsLoading(false);
            return;
          }
          throw new Error(`Failed to fetch permissions: ${response.statusText}`);
        }

        const data: UserPermissionsContext = await response.json();
        setPermissions(data);

        const { enableCache: currentEnableCache, cacheTTL: currentCacheTTL } = configRef.current;
        if (currentEnableCache && data.userId) {
          const cache = getClientCache();
          cache.set(data.userId, data, currentCacheTTL);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        console.error("Failed to load permissions:", error);
      } finally {
        setIsLoading(false);
      }
    };
  }

  // can function uses ref to access current permissions
  const canRef = useRef<((requiredPermissions: Permission[]) => boolean) | null>(null);
  if (!canRef.current) {
    canRef.current = (requiredPermissions: Permission[]): boolean => {
      const currentPermissions = permissionsRef.current;
      if (!currentPermissions) return false;
      return requiredPermissions.some((p) => currentPermissions.permissions.includes(p));
    };
  }

  // Set up polling interval for periodic permission updates
  useEffect(() => {
    // If we have initial permissions, no initial fetch needed
    if (initialPermissions) {
      return;
    }

    let mounted = true;
    let pollTimer: NodeJS.Timeout | null = null;

    async function loadPermissions() {
      // Try cache first
      try {
        const sessionResponse = await fetch("/api/auth/session");
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();
          if (session?.user?.id) {
            const cache = getClientCache();
            const cached = cache.get(session.user.id);
            if (cached && mounted) {
              setPermissions(cached);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch {
        // Ignore cache errors, proceed to fetch
      }

      // Fetch from API
      if (mounted && refreshRef.current) {
        await refreshRef.current();
      }
    }

    // Initial load
    loadPermissions();

    // Set up polling interval if enabled
    const { pollingInterval: currentPollingInterval } = configRef.current;
    if (currentPollingInterval !== null && currentPollingInterval > 0) {
      console.log(`[PermissionProvider] Setting up polling every ${currentPollingInterval}ms`);

      pollTimer = setInterval(() => {
        if (mounted && refreshRef.current) {
          console.log("[PermissionProvider] Refreshing permissions...");
          refreshRef.current();
        }
      }, currentPollingInterval);
    }

    return () => {
      mounted = false;
      if (pollTimer) {
        console.log("[PermissionProvider] Clearing polling interval");
        clearInterval(pollTimer);
      }
    };
  }, []); // Empty deps - run once on mount

  const value: PermissionContextValue = React.useMemo(
    () => ({
      permissions,
      isLoading,
      error,
      refresh: refreshRef.current!,
      can: canRef.current!,
    }),
    [permissions, isLoading, error]
  );

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermissionContext(): PermissionContextValue {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissionContext must be used within a PermissionProvider");
  }
  return context;
}

export function usePermissions(): UserPermissionsContext | null {
  const { permissions } = usePermissionContext();
  return permissions;
}

export function useCan(requiredPermissions: Permission[]): boolean {
  const { permissions } = usePermissionContext();
  if (!permissions) return false;
  return requiredPermissions.some((p) => permissions.permissions.includes(p));
}

export function useRole(): string | null {
  const { permissions } = usePermissionContext();
  return permissions?.roleName ?? null;
}

export function usePermissionsLoading(): boolean {
  const { isLoading } = usePermissionContext();
  return isLoading;
}

export function usePermissionsError(): Error | null {
  const { error } = usePermissionContext();
  return error;
}

export function useRefreshPermissions(): () => Promise<void> {
  const { refresh } = usePermissionContext();
  return refresh;
}
