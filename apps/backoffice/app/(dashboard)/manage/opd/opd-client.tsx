"use client";

/**
 * OPD Client Component
 *
 * Fetches OPD data and renders the data table
 */

import { OpdDataTable } from "@/components/admin/opd-data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Opd {
  id: string;
  name: string;
  nickname: string;
  category: string;
  status: string;
  logo: { cdnUrl: string } | null;
  _count: { servicesAsOwner: number };
}

interface OpdApiResponse {
  id: string;
  name: string;
  nickname: string;
  category: string;
  status: string;
  logo: { cdnUrl: string } | null;
  _count: { servicesAsOwner: number };
}

export function OpdClient() {
  const [opds, setOpds] = useState<Opd[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const fetchOpds = async () => {
    try {
      const res = await fetch("/api/opd");
      if (!res.ok) throw new Error("Failed to fetch OPDs");

      const data = await res.json();
      setOpds((data.items || data || []) as Opd[]);
    } catch (error) {
      console.error("Failed to fetch OPDs:", error);
      toast.error("Gagal memuat data OPD");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpds();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    router.refresh();
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Memuat data OPD...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push("/manage/opd/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah OPD
        </Button>
      </div>

      <OpdDataTable opds={opds} onRefresh={handleRefresh} />
    </div>
  );
}
