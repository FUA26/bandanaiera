"use client";

import { useState, useEffect } from "react";
import { Building2, Search, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { getPublicOpdList, type PublicOpd } from "@/lib/opd-data";


const categories = [
  { value: "all", label: "Semua" },
  { value: "BADAN", label: "Badan" },
  { value: "DINAS", label: "Dinas" },
  { value: "KECAMATAN", label: "Kecamatan" },
  { value: "DESA", label: "Desa" },
];

export default function AgenciesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<string>("all");
  const [agencies, setAgencies] = useState<PublicOpd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchAgencies = async () => {
      setLoading(true);
      try {
        const data = await getPublicOpdList({
          category: activeType !== "all" ? activeType : undefined,
          search: searchQuery || undefined,
          pageSize: 100,
        });

        if (!cancelled) {
          setAgencies(data?.items || []);
        }
      } catch (error) {
        console.error('Error fetching agencies:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchAgencies();

    return () => {
      cancelled = true;
    };
  }, [activeType, searchQuery]);

  return (
    <>
      <main className="bg-muted min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-800 to-blue-900 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Building2 className="h-8 w-8" />
            </div>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              Perangkat Daerah
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/80">
              Daftar seluruh organisasi perangkat daerah pemerintahan
            </p>

            {/* Search */}
            <div className="relative mx-auto mt-8 max-w-xl">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari perangkat daerah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 rounded-xl border-0 bg-white pl-12 text-slate-900 shadow-lg placeholder:text-slate-400"
              />
            </div>
          </div>
        </section>

        {/* Filters & Grid */}
        <section className="container mx-auto px-4 py-12">
          <Tabs
            defaultValue="all"
            value={activeType}
            onValueChange={setActiveType}
            className="mb-8"
          >
            <TabsList className="mx-auto flex h-auto w-full max-w-3xl flex-wrap justify-center gap-2 bg-transparent">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="border-border bg-card rounded-full border px-4 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {agencies.map((agency) => (
                <Card
                  key={agency.id}
                  className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                  onClick={() => router.push(`/perangkat-daerah/${agency.slug}`)}
                >
                  <CardHeader className="border-muted bg-muted/50 border-b pb-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="border-border bg-card text-muted-foreground capitalize"
                      >
                        {agency.category.toLowerCase()}
                      </Badge>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={agency.logo?.cdnUrl || undefined} />
                        <AvatarFallback>{agency.nickname.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-foreground mt-2 text-lg">
                      {agency.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{agency.nickname}</p>
                  </CardHeader>
                  <CardContent className="pt-4 pb-2">
                    {agency.address && (
                      <div className="text-muted-foreground mb-2 flex items-start gap-2 text-sm">
                        <MapPin className="text-muted-foreground/70 mt-0.5 h-4 w-4 shrink-0" />
                        <span className="line-clamp-2">{agency.address}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-blue-600 transition-all group-hover:pl-4 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                    >
                      Lihat Detail
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {agencies.length === 0 && (
            <div className="border-border bg-card text-muted-foreground col-span-full rounded-xl border border-dashed py-12 text-center">
              Tidak ada perangkat daerah yang ditemukan.
            </div>
          )}
        </section>
      </main>
    </>
  );
}
