"use client";

/**
 * Permission Dialog Component
 *
 * Dialog for creating and editing permissions
 */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loading01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PermissionRecord {
  id: string;
  name: string;
  category: string;
  description: string | null;
}

interface PermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission?: PermissionRecord | null;
  onSave: (data: { name: string; category: string; description?: string }) => Promise<void>;
}

const DEFAULT_CATEGORIES = ["Pengguna", "Konten", "Pengaturan", "Analitik", "Admin"];

export function PermissionDialog({
  open,
  onOpenChange,
  permission,
  onSave,
}: PermissionDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);

  // Load existing categories when dialog opens
  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  // Reset form when permission changes
  useEffect(() => {
    if (permission) {
      setName(permission.name);
      setCategory(permission.category);
      setDescription(permission.description || "");
      setIsCustomCategory(!DEFAULT_CATEGORIES.includes(permission.category));
      setCustomCategory(
        !DEFAULT_CATEGORIES.includes(permission.category) ? permission.category : ""
      );
    } else {
      setName("");
      setCategory("");
      setDescription("");
      setIsCustomCategory(false);
      setCustomCategory("");
    }
  }, [permission]);

  const loadCategories = async () => {
    try {
      // Get all unique categories from permissions
      const response = await fetch("/api/permissions");
      if (!response.ok) return;

      const data = await response.json();
      const categories = Array.from(
        new Set(data.permissions.map((p: PermissionRecord) => p.category))
      ) as string[];
      setExistingCategories(categories);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const allCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...existingCategories])).sort();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!name.trim()) {
      toast.error("Nama izin diperlukan");
      return;
    }

    if (!category.trim() && !customCategory.trim()) {
      toast.error("Kategori diperlukan");
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : category.trim();

    if (!finalCategory) {
      toast.error("Kategori diperlukan");
      return;
    }

    // Auto-format name to uppercase with underscores
    const formattedName = name
      .toUpperCase()
      .replace(/\s+/g, "_")
      .replace(/[^A-Z0-9_]/g, "");

    if (formattedName !== name) {
      setName(formattedName);
      toast.info("Nama izin otomatis diformat ke huruf kapital dengan garis bawah");
    }

    setSaving(true);

    try {
      await onSave({
        name: formattedName,
        category: finalCategory,
        description: description.trim() || undefined,
      });

      // Reset form
      setName("");
      setCategory("");
      setDescription("");
      setIsCustomCategory(false);
      setCustomCategory("");
    } catch (error) {
      console.error("Failed to save permission:", error);
    } finally {
      setSaving(false);
    }
  };

  const isEditing = !!permission;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Ubah Izin" : "Buat Izin Baru"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update detail izin di bawah ini."
              : "Buat izin baru untuk kontrol akses berbasis peran."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Permission Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nama Izin <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="contoh, USER_READ_OWN"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Akan otomatis diformat ke HURUF_KAPITAL_DENGAN_GARIS_BAWAH
              </p>
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label>
                Kategori <span className="text-destructive">*</span>
              </Label>

              {!isCustomCategory ? (
                <Select value={category} onValueChange={setCategory} disabled={saving}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="__custom__">+ Kategori Kustom</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Masukkan kategori kustom"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    disabled={saving}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCustomCategory(false);
                      setCustomCategory("");
                    }}
                    disabled={saving}
                  >
                    Batal
                  </Button>
                </div>
              )}

              {!isCustomCategory && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-muted-foreground"
                  onClick={() => setIsCustomCategory(true)}
                  disabled={saving}
                >
                  + Buat kategori kustom
                </Button>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Jelaskan singkat apa yang diizinkan oleh izin ini"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={saving}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">{description.length}/500 karakter</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && (
                <HugeiconsIcon icon={Loading01Icon} className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditing ? "Update Izin" : "Buat Izin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
