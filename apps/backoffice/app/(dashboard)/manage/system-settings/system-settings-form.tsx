"use client";

/**
 * System Settings Form Component
 *
 * Client component for managing system-wide settings
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { systemSettingsSchema, type SystemSettingsInput } from "@/lib/validations/system-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Role {
  id: string;
  name: string;
}

interface SystemSettingsData {
  id: string;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  defaultUserRoleId: string;
  emailVerificationExpiryHours: number;
  minPasswordLength: number;
  requireStrongPassword: boolean;
  siteName: string;
  siteDescription: string | null;
  defaultUserRole: {
    id: string;
    name: string;
  };
}

export function SystemSettingsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentSettings, setCurrentSettings] = useState<SystemSettingsData | null>(null);

  const form = useForm<SystemSettingsInput>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      allowRegistration: true,
      requireEmailVerification: true,
      defaultUserRoleId: "",
      emailVerificationExpiryHours: 24,
      minPasswordLength: 8,
      requireStrongPassword: false,
      siteName: "Naiera",
      siteDescription: "",
    },
  });

  // Fetch roles and settings on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch roles
        const rolesRes = await fetch("/api/roles");
        if (rolesRes.ok) {
          const rolesData = await rolesRes.json();
          setRoles(rolesData.roles || []);
        }

        // Fetch settings
        const settingsRes = await fetch("/api/system-settings/full");
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setCurrentSettings(data.settings);

          // Populate form
          form.reset({
            allowRegistration: data.settings.allowRegistration,
            requireEmailVerification: data.settings.requireEmailVerification,
            defaultUserRoleId: data.settings.defaultUserRoleId,
            emailVerificationExpiryHours: data.settings.emailVerificationExpiryHours,
            minPasswordLength: data.settings.minPasswordLength,
            requireStrongPassword: data.settings.requireStrongPassword,
            siteName: data.settings.siteName,
            siteDescription: data.settings.siteDescription || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [form]);

  const onSubmit = async (data: SystemSettingsInput) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/system-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update settings");
      }

      toast.success("Settings updated successfully");

      // Update current settings
      if (result.settings) {
        setCurrentSettings(result.settings);
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  const formState = form.formState;
  const isDirty = Object.keys(formState.dirtyFields).length > 0;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Registration Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Settings</CardTitle>
          <CardDescription>Control user registration and email verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Allow Registration */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allowRegistration">Allow Registration</Label>
              <p className="text-xs text-muted-foreground">Enable public user registration</p>
            </div>
            <Switch
              id="allowRegistration"
              checked={form.watch("allowRegistration")}
              onCheckedChange={(checked) =>
                form.setValue("allowRegistration", checked, { shouldDirty: true })
              }
            />
          </div>

          {/* Require Email Verification */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
              <p className="text-xs text-muted-foreground">
                Users must verify their email before accessing
              </p>
            </div>
            <Switch
              id="requireEmailVerification"
              checked={form.watch("requireEmailVerification")}
              onCheckedChange={(checked) =>
                form.setValue("requireEmailVerification", checked, { shouldDirty: true })
              }
            />
          </div>

          {/* Default User Role */}
          <Field>
            <FieldLabel htmlFor="defaultUserRoleId">Default User Role</FieldLabel>
            <FieldDescription>The role assigned to newly registered users</FieldDescription>
            <FieldContent>
              <select
                id="defaultUserRoleId"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...form.register("defaultUserRoleId")}
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </FieldContent>
            <FieldError />
          </Field>

          {/* Email Verification Expiry */}
          <Field>
            <FieldLabel htmlFor="emailVerificationExpiryHours">
              Email Verification Expiry (Hours)
            </FieldLabel>
            <FieldDescription>
              How long verification links remain valid (1-168 hours)
            </FieldDescription>
            <FieldContent>
              <Input
                id="emailVerificationExpiryHours"
                type="number"
                min="1"
                max="168"
                {...form.register("emailVerificationExpiryHours", { valueAsNumber: true })}
              />
            </FieldContent>
            <FieldError />
          </Field>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Configure password policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Minimum Password Length */}
          <Field>
            <FieldLabel htmlFor="minPasswordLength">Minimum Password Length</FieldLabel>
            <FieldDescription>Minimum number of characters required (6-128)</FieldDescription>
            <FieldContent>
              <Input
                id="minPasswordLength"
                type="number"
                min="6"
                max="128"
                {...form.register("minPasswordLength", { valueAsNumber: true })}
              />
            </FieldContent>
            <FieldError />
          </Field>

          {/* Require Strong Password */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="requireStrongPassword">Require Strong Password</Label>
              <p className="text-xs text-muted-foreground">Enforce complex password requirements</p>
            </div>
            <Switch
              id="requireStrongPassword"
              checked={form.watch("requireStrongPassword")}
              onCheckedChange={(checked) =>
                form.setValue("requireStrongPassword", checked, { shouldDirty: true })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Site Information */}
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>Basic site configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Site Name */}
          <Field>
            <FieldLabel htmlFor="siteName">Site Name</FieldLabel>
            <FieldDescription>The name of your site</FieldDescription>
            <FieldContent>
              <Input id="siteName" {...form.register("siteName")} />
            </FieldContent>
            <FieldError />
          </Field>

          {/* Site Description */}
          <Field>
            <FieldLabel htmlFor="siteDescription">Site Description</FieldLabel>
            <FieldDescription>A short description of your site (optional)</FieldDescription>
            <FieldContent>
              <Textarea id="siteDescription" rows={3} {...form.register("siteDescription")} />
            </FieldContent>
            <FieldError />
          </Field>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSaving || !isDirty}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (currentSettings) {
              form.reset({
                allowRegistration: currentSettings.allowRegistration,
                requireEmailVerification: currentSettings.requireEmailVerification,
                defaultUserRoleId: currentSettings.defaultUserRoleId,
                emailVerificationExpiryHours: currentSettings.emailVerificationExpiryHours,
                minPasswordLength: currentSettings.minPasswordLength,
                requireStrongPassword: currentSettings.requireStrongPassword,
                siteName: currentSettings.siteName,
                siteDescription: currentSettings.siteDescription || "",
              });
            }
          }}
          disabled={!isDirty}
        >
          Reset
        </Button>
      </div>

      {formState.errors.root && (
        <div className="text-sm text-destructive">{formState.errors.root.message}</div>
      )}
    </form>
  );
}
