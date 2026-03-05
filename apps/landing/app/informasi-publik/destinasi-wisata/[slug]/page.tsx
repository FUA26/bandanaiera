import { getTourismDestinationBySlug, getTourismDestinations } from '@/lib/tourism-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    ChevronRight,
    MapPin,
    Star,
    Clock,
    Calendar,
    Share2,
    Phone,
    Globe,
    ImageIcon,
    Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const data = await getTourismDestinationBySlug(params.slug);
    if (!data?.destination) return { title: 'Not Found' };

    return {
        title: `${data.destination.name} | Destinasi Wisata Naiera`,
        description: data.destination.description,
    };
}

export default async function DestinasiWisataDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    const data = await getTourismDestinationBySlug(params.slug);

    if (!data?.destination) {
        notFound();
    }

    const dest = data.destination;

    // Render facilities safely from JSON
    const getFacilities = () => {
        if (!dest.facilities) return [];
        if (typeof dest.facilities === 'string') {
            try {
                return JSON.parse(dest.facilities) as string[];
            } catch {
                return [];
            }
        }
        if (Array.isArray(dest.facilities)) {
            return dest.facilities as string[];
        }
        return [];
    };

    const facilities = getFacilities();

    return (
        <main className="bg-slate-50 min-h-screen pb-12">
            {/* Hero Image Section */}
            <section className="relative h-[50vh] min-h-[400px] w-full bg-slate-200">
                {dest.image?.cdnUrl ? (
                    <Image
                        src={dest.image.cdnUrl}
                        alt={dest.name}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                        <ImageIcon className="h-24 w-24 text-slate-400" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute inset-0 flex items-end pb-12">
                    <div className="container mx-auto max-w-4xl px-4">
                        <nav className="text-white/80 mb-6 flex items-center gap-2 text-sm">
                            <Link href="/" className="hover:text-white">
                                Beranda
                            </Link>
                            <ChevronRight size={14} />
                            <Link href="/informasi-publik" className="hover:text-white">
                                Informasi Publik
                            </Link>
                            <ChevronRight size={14} />
                            <Link href="/informasi-publik/destinasi-wisata" className="hover:text-white">
                                Destinasi
                            </Link>
                            <ChevronRight size={14} />
                            <span className="text-white truncate max-w-[200px]">{dest.name}</span>
                        </nav>

                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            {dest.category && (
                                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                                    {dest.category.name}
                                </span>
                            )}
                            {dest.rating > 0 && (
                                <span className="flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs text-white">
                                    <Star size={14} className="text-amber-400 fill-amber-400" />
                                    {dest.rating} ({dest.reviews} ulasan)
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {dest.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            {dest.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} />
                                    <span>{dest.location}</span>
                                </div>
                            )}
                            {dest.price && (
                                <div className="flex items-center gap-2 font-medium">
                                    <span className="bg-primary/20 backdrop-blur-sm px-2 py-1 rounded text-primary-lighter">
                                        {dest.price}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto max-w-4xl px-4 -mt-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column (Content) */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Tentang Destinasi</h2>
                            <p className="text-slate-700 text-lg leading-relaxed font-medium mb-6">
                                {dest.description}
                            </p>

                            {dest.content && (
                                <div
                                    className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-primary hover:prose-a:text-primary-hover"
                                    dangerouslySetInnerHTML={{ __html: dest.content }}
                                />
                            )}
                        </div>

                        {facilities.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Fasilitas Tersedia</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {facilities.map((fac: string) => (
                                        <div key={fac} className="flex items-center gap-2 text-slate-700">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <span>{fac}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Sidebar Info) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                            <h3 className="font-bold text-slate-900">Informasi Penting</h3>

                            {dest.openHours && (
                                <div className="flex items-start gap-4">
                                    <div className="rounded-full bg-slate-100 p-2 text-slate-600">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-slate-500 mb-1">Jam Buka</p>
                                        <p className="text-slate-900">{dest.openHours}</p>
                                    </div>
                                </div>
                            )}

                            {dest.location && (
                                <div className="flex items-start gap-4">
                                    <div className="rounded-full bg-slate-100 p-2 text-slate-600">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-slate-500 mb-1">Alamat</p>
                                        <p className="text-slate-900 text-sm leading-relaxed">{dest.location}</p>
                                    </div>
                                </div>
                            )}

                            {dest.locationUrl && (
                                <Button className="w-full" asChild>
                                    <a href={dest.locationUrl} target="_blank" rel="noopener noreferrer">
                                        <Navigation className="mr-2 h-4 w-4" />
                                        Buka di Google Maps
                                    </a>
                                </Button>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                            <h3 className="font-bold text-slate-900 mb-2">Pusat Bantuan Wisata</h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Butuh informasi lebih lanjut mengenai destinasi ini?
                            </p>
                            <Button variant="outline" className="w-full">
                                Hubungi Dinas Pariwisata
                            </Button>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
