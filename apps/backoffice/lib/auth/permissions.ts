/**
 * Permission Check Helpers
 *
 * Helper functions for checking user permissions in API routes
 */

import { auth } from "@/lib/auth/config";
import { hasPermission } from "@/lib/rbac/checker";
import { loadUserPermissions } from "@/lib/rbac-server/loader";

/**
 * Check if a user has a specific permission
 * Throws an error if permission check fails
 *
 * @param userId - User ID to check permissions for
 * @param permission - Permission string to check
 * @throws {Error} If user lacks the required permission
 */
export async function requirePermission(userId: string, permission: string): Promise<void> {
  const userPermissions = await loadUserPermissions(userId);
  const allowed = hasPermission(userPermissions, [permission]);

  if (!allowed) {
    throw new Error(`Forbidden: Missing required permission: ${permission}`);
  }
}

/**
 * Check if a user has any of the specified permissions
 * Throws an error if none of the permissions are granted
 *
 * @param userId - User ID to check permissions for
 * @param permissions - Array of permission strings to check
 * @throws {Error} If user lacks all required permissions
 */
export async function requireAnyPermission(userId: string, permissions: string[]): Promise<void> {
  const userPermissions = await loadUserPermissions(userId);
  const allowed = hasPermission(userPermissions, permissions, { strict: false });

  if (!allowed) {
    throw new Error(`Forbidden: Missing one of required permissions: ${permissions.join(", ")}`);
  }
}

/**
 * Get the current authenticated session
 * Returns the session with user attached
 *
 * @returns Auth session with user info
 * @throws {Error} If not authenticated
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized: Authentication required");
  }

  return session;
}
