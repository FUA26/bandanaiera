/**
 * Edit Service Client Component
 *
 * Client component that fetches service data and renders the dialog
 */

"use client";

import { ServiceDialog } from "@/components/admin/service-dialog";
import { prisma } from "@/lib/db/prisma";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Service {
  id: string;
  slug: string;
  icon: string;
  name: string;
  description: string;
  categoryId: string;
  badge?: string | null;
  stats?: string | null;
  showInMenu: boolean;
  order: number;
  isIntegrated: boolean;
  detailedDescription?: string | null;
  requirements?: string[] | null;
  process?: string[] | null;
  duration?: string | null;
  cost?: string | null;
  contactInfo?: {
    office: string;
    phone: string;
    email: string;
  } | null;
  faqs?: {
    question: string;
    answer: string;
  }[] | null;
  downloadForms?: {
    type: "file" | "url";
    name: string;
    value: string;
    fileId?: string;
  }[] | null;
  relatedServices?: string[] | null;
  status: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface EditServiceContentProps {
  serviceId: string;
}

async function fetchServiceData(serviceId: string) {
  const response = await fetch(`/api/services/${serviceId}`);
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data.service as Service;
}

async function fetchCategories() {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.categories as Category[];
}

export function EditServiceContent({ serviceId }: EditServiceContentProps) {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [serviceData, categoriesData] = await Promise.all([
        fetchServiceData(serviceId),
        fetchCategories(),
      ]);

      if (!serviceData) {
        router.push("/services");
        return;
      }

      setService(serviceData);
      setCategories(categoriesData);
      setLoading(false);
    }

    loadData();
  }, [serviceId, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Service</h1>
          <p className="text-muted-foreground">Update service details</p>
        </div>
        <div className="h-64 animate-pulse bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Service</h1>
        <p className="text-muted-foreground">Update service details</p>
      </div>

      {service && (
        <ServiceDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              router.back();
            }
          }}
          mode="edit"
          serviceId={serviceId}
          initialData={{
            name: service.name,
            slug: service.slug,
            icon: service.icon,
            description: service.description,
            categoryId: service.categoryId,
            badge: service.badge ?? undefined,
            stats: service.stats ?? undefined,
            showInMenu: service.showInMenu,
            order: service.order,
            isIntegrated: service.isIntegrated,
            status: service.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
            detailedDescription: service.detailedDescription ?? undefined,
            requirements: service.requirements ?? undefined,
            process: service.process ?? undefined,
            duration: service.duration ?? undefined,
            cost: service.cost ?? undefined,
            contactInfo: service.contactInfo ?? undefined,
            faqs: service.faqs ?? undefined,
            downloadForms: service.downloadForms ?? undefined,
            relatedServices: service.relatedServices ?? undefined,
          }}
          categories={categories}
          onSuccess={() => {
            router.push("/services");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
