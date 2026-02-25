/**
 * New Service Client Component
 *
 * Client component that fetches categories and renders the dialog
 */

"use client";

import { ServiceDialog } from "@/components/admin/service-dialog";
import { Button } from "@/components/ui/button";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface NewServiceContentProps {
  categories: Array<{ id: string; name: string; slug: string }>;
}

export function NewServiceContent() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Service</h1>
        <p className="text-muted-foreground">Add a new service to the system</p>
      </div>

      <ServiceDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            router.back();
          }
        }}
        mode="create"
        categories={[]}
        onSuccess={() => {
          router.push("/services");
          router.refresh();
        }}
      />
    </div>
  );
}
