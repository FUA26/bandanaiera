"use client";

/**
 * Delete Role Confirmation Dialog Component
 *
 * Dialog for confirming role deletion with user count check
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteRoleConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: string;
  roleName: string;
  userCount: number;
  onSuccess?: () => void;
}

export function DeleteRoleConfirmDialog({
  open,
  onOpenChange,
  roleId,
  roleName,
  userCount,
  onSuccess,
}: DeleteRoleConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (userCount > 0) {
      toast.error("Tidak dapat menghapus peran dengan pengguna yang ditugaskan");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/roles/${roleId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Gagal menghapus peran");
      }

      toast.success("Peran berhasil dihapus");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Gagal menghapus peran:", error);
      toast.error(error instanceof Error ? error.message : "Gagal menghapus peran");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Peran</AlertDialogTitle>
          <AlertDialogDescription>
            {userCount > 0 ? (
              <>
                Tidak dapat menghapus <strong>{roleName}</strong> karena memiliki {userCount} pengguna
                yang ditugaskan. Harap tugaskan pengguna ke peran lain terlebih dahulu.
              </>
            ) : (
              <>
                Apakah Anda yakin ingin menghapus peran <strong>{roleName}</strong>? Tindakan ini
                tidak dapat dibatalkan.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting || userCount > 0}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Menghapus..." : "Hapus Peran"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
