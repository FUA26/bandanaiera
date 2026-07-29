"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPublicOpdBySlug, type PublicOpdDetail } from "@/lib/opd-data";
import { MapPin, Phone, Mail, Globe, Clock, ArrowLeft, Users, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AgencyDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [agency, setAgency] = useState<PublicOpdDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicOpdBySlug(slug)
      .then((data) => {
        setAgency(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading agency:', error);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Agency not found</h1>
        <Button onClick={() => router.push('/perangkat-daerah')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Agencies
        </Button>
      </div>
    );
  }

  const ownedServices = agency.servicesAsOwner || [];
  const relatedServices = agency.serviceRelatedOpds?.map((sra) => sra.service) || [];

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-gradient-to-br from-blue-800 to-blue-900 py-16 text-white">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 text-white hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <Avatar className="h-32 w-32 border-4 border-white/20">
                <AvatarImage src={agency.logo?.cdnUrl || undefined} />
                <AvatarFallback className="text-4xl">{agency.nickname.slice(0, 2)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl font-bold">{agency.name}</h1>
                  <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
                    {agency.category.toLowerCase()}
                  </Badge>
                </div>
                <p className="text-xl text-white/80 mb-4">{agency.nickname}</p>
                <p className="text-white/90 max-w-3xl">{agency.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Info */}
            <div className="lg:col-span-1 space-y-6">
              {agency.address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{agency.address}</p>
                  </CardContent>
                </Card>
              )}

              {agency.contactInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {agency.contactInfo.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{agency.contactInfo.phone}</span>
                      </div>
                    )}
                    {agency.contactInfo.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${agency.contactInfo.email}`} className="text-blue-600 hover:underline">
                          {agency.contactInfo.email}
                        </a>
                      </div>
                    )}
                    {agency.contactInfo.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={agency.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {agency.operatingHours && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Operating Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{agency.operatingHours}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Services */}
            <div className="lg:col-span-2 space-y-8">
              {ownedServices.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Layanan yang Diampu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {ownedServices.map((service) => (
                        <div
                          key={service.id}
                          className="p-4 border rounded-lg hover:border-blue-600 cursor-pointer transition-colors"
                          onClick={() => router.push(`/layanan/${service.slug}`)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <span className="text-xl">📋</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{service.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {service.category.name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {relatedServices.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LinkIcon className="h-5 w-5" />
                      Layanan Terkait
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {relatedServices.map((service) => (
                        <div
                          key={service.id}
                          className="p-4 border rounded-lg hover:border-blue-600 cursor-pointer transition-colors"
                          onClick={() => router.push(`/layanan/${service.slug}`)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                              <span className="text-xl">🔗</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{service.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {service.category.name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {ownedServices.length === 0 && relatedServices.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Belum ada layanan terkait instansi ini.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
