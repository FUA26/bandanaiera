/**
 * System Settings Page (Admin Only)
 *
 * Allows super admins to configure system-wide settings including:
 * - Registration settings (allow registration, email verification)
 * - Default user role
 * - Password policies
 * - Site information
 */

import { ProtectedRoute } from "@/components/rbac/ProtectedRoute";
import { Permission } from "@/lib/rbac/types";
import { SystemSettingsForm } from "./system-settings-form";

export const metadata = {
  title: "Pengaturan Sistem",
  description: "Konfigurasi pengaturan sistem",
};

export default function SystemSettingsPage() {
  return (
    <ProtectedRoute permissions={["ADMIN_SYSTEM_SETTINGS_MANAGE"] as Permission[]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan Sistem</h1>
          <p className="text-muted-foreground mt-2">
            Konfigurasi pengaturan sistem untuk registrasi, keamanan, dan lainnya.
          </p>
        </div>

        <SystemSettingsForm />
      </div>
    </ProtectedRoute>
  );
}
