"use client";

/**
 * Settings Client Component
 *
 * Displays application settings and preferences
 * Currently a placeholder with links to profile
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings01Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface SettingsClientProps {
  user: {
    id: string;
    name?: string | null;
    email: string;
    avatar?: string | null;
    role: {
      name: string;
    };
  };
}

export function SettingsClient({ user }: SettingsClientProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola preferensi aplikasi dan pengaturan akun Anda
        </p>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Pengaturan dan aksi yang sering digunakan</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Aksi cepat dan pintasan akan ditambahkan di sini segera.
          </p>
        </CardContent>
      </Card>

      {/* Coming Soon Features */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Appearance */}
        <Card className="opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Settings01Icon} className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Tampilan</CardTitle>
            </div>
            <CardDescription>Kustomisasi tampilan aplikasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Tema</p>
                <p className="text-xs text-muted-foreground">Pilih tema favorit Anda</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Sistem
              </Button>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground">🚧 Kustomisasi tema segera hadir</p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Settings02Icon} className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Notifikasi</CardTitle>
            </div>
            <CardDescription>Konfigurasi cara Anda menerima notifikasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Notifikasi Email</p>
                <p className="text-xs text-muted-foreground">Terima update melalui email</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Aktifkan
              </Button>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground">
                🚧 Preferensi notifikasi segera hadir
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Settings01Icon} className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Bahasa & Wilayah</CardTitle>
            </div>
            <CardDescription>Atur preferensi bahasa dan wilayah</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Bahasa</p>
                <p className="text-xs text-muted-foreground">Pilih bahasa favorit Anda</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Indonesia
              </Button>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground">🚧 Dukungan multi-bahasa segera hadir</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
            <CardDescription>Detail akun dan peran Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Nama</span>
              <span className="text-sm">{user.name || "Belum diatur"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Email</span>
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Peran</span>
              <span className="text-sm font-medium">{user.role.name}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
