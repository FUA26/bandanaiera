"use client";

/**
 * System Settings Form Component
 *
 * Client component for managing system-wide settings with tabbed interface
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { systemSettingsSchema, type SystemSettingsInput } from "@/lib/validations/system-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { PlusIcon, TrashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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
  siteLogoId?: string | null;
  siteLogo?: { id: string; cdnUrl: string } | null;
  siteSubtitle?: string | null;
  citizenName?: string | null;
  contactAddress?: string | null;
  contactPhones?: string[] | null;
  contactEmails?: string[] | null;
  socialFacebook?: string | null;
  socialTwitter?: string | null;
  socialInstagram?: string | null;
  socialYouTube?: string | null;
  copyrightText?: string | null;
  versionNumber?: string | null;
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
      siteLogoId: "",
      siteSubtitle: "",
      citizenName: "Warga",
      contactAddress: "",
      contactPhones: [],
      contactEmails: [],
      socialFacebook: "",
      socialTwitter: "",
      socialInstagram: "",
      socialYouTube: "",
      copyrightText: "",
      versionNumber: "1.0.0",
    },
  });

  const phonesArray = useFieldArray({
    control: form.control,
    name: "contactPhones" as any,
  });

  const emailsArray = useFieldArray({
    control: form.control,
    name: "contactEmails" as any,
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
            siteLogoId: data.settings.siteLogoId || "",
            siteSubtitle: data.settings.siteSubtitle || "",
            citizenName: data.settings.citizenName || "Warga",
            contactAddress: data.settings.contactAddress || "",
            contactPhones: data.settings.contactPhones || [],
            contactEmails: data.settings.contactEmails || [],
            socialFacebook: data.settings.socialFacebook || "",
            socialTwitter: data.settings.socialTwitter || "",
            socialInstagram: data.settings.socialInstagram || "",
            socialYouTube: data.settings.socialYouTube || "",
            copyrightText: data.settings.copyrightText || "",
            versionNumber: data.settings.versionNumber || "1.0.0",
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
      <Tabs defaultValue="registration" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-lg">
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="site">Site Identity</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {/* Registration Tab */}
        <TabsContent value="registration" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration Settings</CardTitle>
              <CardDescription>Control user registration and email verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure password policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
        </TabsContent>

        {/* Site Identity Tab */}
        <TabsContent value="site" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Identity</CardTitle>
              <CardDescription>Configure your site's basic information and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel htmlFor="siteName">Site Name</FieldLabel>
                <FieldDescription>The name of your site</FieldDescription>
                <FieldContent>
                  <Input id="siteName" {...form.register("siteName")} />
                </FieldContent>
                <FieldError />
              </Field>

              <Field>
                <FieldLabel htmlFor="siteSubtitle">Site Subtitle</FieldLabel>
                <FieldDescription>A subtitle or tagline (optional)</FieldDescription>
                <FieldContent>
                  <Input id="siteSubtitle" {...form.register("siteSubtitle")} />
                </FieldContent>
                <FieldError />
              </Field>

              <Field>
                <FieldLabel htmlFor="siteDescription">Site Description</FieldLabel>
                <FieldDescription>A short description of your site (optional)</FieldDescription>
                <FieldContent>
                  <Textarea id="siteDescription" rows={3} {...form.register("siteDescription")} />
                </FieldContent>
                <FieldError />
              </Field>

              <Field>
                <FieldLabel htmlFor="citizenName">Citizen Name</FieldLabel>
                <FieldDescription>What to call citizens in greetings (e.g., "Warga Naiera")</FieldDescription>
                <FieldContent>
                  <Input id="citizenName" {...form.register("citizenName")} />
                </FieldContent>
                <FieldError />
              </Field>

              <Field>
                <FieldLabel htmlFor="siteLogoId">Site Logo</FieldLabel>
                <FieldDescription>Upload a logo for your site (optional)</FieldDescription>
                <FieldContent>
                  <Input id="siteLogoId" {...form.register("siteLogoId")} />
                </FieldContent>
                <FieldError />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Contact details displayed on the landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel htmlFor="contactAddress">Address</FieldLabel>
                <FieldDescription>Full physical address</FieldDescription>
                <FieldContent>
                  <Textarea id="contactAddress" rows={2} {...form.register("contactAddress")} />
                </FieldContent>
                <FieldError />
              </Field>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Phone Numbers</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => phonesArray.append("")}
                  >
                    <HugeiconsIcon icon={PlusIcon} className="h-4 w-4 mr-1" />
                    Add Phone
                  </Button>
                </div>
                <div className="space-y-2">
                  {phonesArray.fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        {...form.register(`contactPhones.${index}` as const)}
                        placeholder="+62 xxx xxx xxx"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => phonesArray.remove(index)}
                      >
                        <HugeiconsIcon icon={TrashIcon} className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Email Addresses</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => emailsArray.append("")}
                  >
                    <HugeiconsIcon icon={PlusIcon} className="h-4 w-4 mr-1" />
                    Add Email
                  </Button>
                </div>
                <div className="space-y-2">
                  {emailsArray.fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        {...form.register(`contactEmails.${index}` as const)}
                        type="email"
                        placeholder="info@naiera.go.id"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => emailsArray.remove(index)}
                      >
                        <HugeiconsIcon icon={TrashIcon} className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel htmlFor="socialFacebook">Facebook</FieldLabel>
                <FieldDescription>Your Facebook page URL</FieldDescription>
                <FieldContent>
                  <Input id="socialFacebook" placeholder="https://facebook.com/..." {...form.register("socialFacebook")} />
                </FieldContent>
                <FieldError />
              </Field>

              <Field>
                <FieldLabel htmlFor="socialTwitter">Twitter / X</FieldLabel>
                <FieldDescription>Your Twitter profile URL</FieldDescription>
                <FieldContent>
                  <Input id="socialTwitter" placeholder="https://twitter.com/..." {...form.register("socialTwitter")} />
                </FieldContent>
                <FieldError />
              </Field>

              <Field>
                <FieldLabel htmlFor="socialInstagram">Instagram</FieldLabel>
                <FieldDescription>Your Instagram profile URL</FieldDescription>
                <FieldContent>
                  <Input id="socialInstagram" placeholder="https://instagram.com/..." {...form.register("socialInstagram")} />
                </FieldContent>
                <FieldError />
              </Field>

              <Field>
                <FieldLabel htmlFor="socialYouTube">YouTube</FieldLabel>
                <FieldDescription>Your YouTube channel URL</FieldDescription>
                <FieldContent>
                  <Input id="socialYouTube" placeholder="https://youtube.com/..." {...form.register("socialYouTube")} />
                </FieldContent>
                <FieldError />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Tab */}
        <TabsContent value="footer" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Footer Settings</CardTitle>
              <CardDescription>Customize the footer content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel htmlFor="copyrightText">Copyright Text</FieldLabel>
                <FieldDescription>Custom copyright message (optional)</FieldDescription>
                <FieldContent>
                  <Input id="copyrightText" placeholder="© 2026 Pemerintah Kabupaten Naiera" {...form.register("copyrightText")} />
                </FieldContent>
                <FieldError />
              </Field>

              <Field>
                <FieldLabel htmlFor="versionNumber">Version Number</FieldLabel>
                <FieldDescription>Application version (shown in footer)</FieldDescription>
                <FieldContent>
                  <Input id="versionNumber" {...form.register("versionNumber")} />
                </FieldContent>
                <FieldError />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                siteLogoId: currentSettings.siteLogoId || "",
                siteSubtitle: currentSettings.siteSubtitle || "",
                citizenName: currentSettings.citizenName || "Warga",
                contactAddress: currentSettings.contactAddress || "",
                contactPhones: currentSettings.contactPhones || [],
                contactEmails: currentSettings.contactEmails || [],
                socialFacebook: currentSettings.socialFacebook || "",
                socialTwitter: currentSettings.socialTwitter || "",
                socialInstagram: currentSettings.socialInstagram || "",
                socialYouTube: currentSettings.socialYouTube || "",
                copyrightText: currentSettings.copyrightText || "",
                versionNumber: currentSettings.versionNumber || "1.0.0",
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
