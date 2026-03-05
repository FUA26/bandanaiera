'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Map,
    ChevronRight,
    Search,
    MapPin,
    Star,
    Clock,
    Navigation,
    Grid3X3,
    List,
    Camera,
    Heart,
    ImageIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TourismCategory {
    id: string;
    name: string;
    slug: string;
    color: string;
}

interface TourismDestination {
    id: string;
    name: string;
    slug: string;
    description: string;
    location: string | null;
    rating: number;
    reviews: number;
    price: string | null;
    openHours: string | null;
    facilities: string[];
    featured: boolean;
    category: TourismCategory;
    image: {
        cdnUrl: string;
    } | null;
}

interface DestinasiWisataClientProps {
    initialDestinations: TourismDestination[];
    categories: TourismCategory[];
}

export function DestinasiWisataClient({
    initialDestinations,
    categories,
}: DestinasiWisataClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const featuredDestinations = initialDestinations.filter((d) => d.featured);

    const filteredDestinations = initialDestinations.filter((dest) => {
        const matchesSearch =
            dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dest.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === 'Semua' || dest.category?.slug === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Safe facility parsing since it's stored as Json in DB
    const getFacilities = (dest: TourismDestination) => {
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

    return (
        <>
            <main className="bg-slate-50">
                {/* Hero Section */}
                <section className="from-primary to-primary-hover bg-gradient-to-br py-12 text-white">
                    <div className="container mx-auto max-w-6xl px-4">
                        <nav className="text-primary-lighter mb-4 flex items-center gap-2 text-sm">
                            <Link href="/" className="hover:text-white">
                                Beranda
                            </Link>
                            <ChevronRight size={14} />
                            <Link href="/informasi-publik" className="hover:text-white">
                                Informasi Publik
                            </Link>
                            <ChevronRight size={14} />
                            <span className="text-white">Destinasi Wisata</span>
                        </nav>
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                                <Map size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Destinasi Wisata Naiera</h1>
                                <p className="text-primary-lighter">
                                    Jelajahi keindahan alam dan budaya Kabupaten Naiera
                                </p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="mt-6 flex max-w-xl gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Cari destinasi wisata..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-12 border-0 bg-white pl-12 text-slate-800 shadow-lg"
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 flex flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                                <MapPin size={18} />
                                <span>{initialDestinations.length} Destinasi</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Destinations */}
                {featuredDestinations.length > 0 && (
                    <section className="border-b border-slate-200 bg-white py-8">
                        <div className="container mx-auto max-w-6xl px-4">
                            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-800">
                                <Star className="text-amber-500" size={20} />
                                Destinasi Unggulan
                            </h2>
                            <div className="grid gap-6 md:grid-cols-3">
                                {featuredDestinations.slice(0, 3).map((dest) => (
                                    <Link
                                        key={dest.id}
                                        href={`/informasi-publik/destinasi-wisata/${dest.slug}`}
                                        className="group relative overflow-hidden rounded-2xl"
                                    >
                                        <div className="aspect-[4/3] w-full bg-slate-100 relative">
                                            {dest.image?.cdnUrl ? (
                                                <Image
                                                    src={dest.image.cdnUrl}
                                                    alt={dest.name}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                                                    <ImageIcon className="h-16 w-16 text-primary/30" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute right-0 bottom-0 left-0 p-4">
                                            {dest.category && (
                                                <span className="mb-2 inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                                                    {dest.category.name}
                                                </span>
                                            )}
                                            <h3 className="text-lg font-bold text-white">
                                                {dest.name}
                                            </h3>
                                            <div className="mt-2 flex items-center gap-4 text-sm text-white/80">
                                                {dest.rating > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Star size={14} className="text-amber-400" />
                                                        {dest.rating}
                                                    </span>
                                                )}
                                                {dest.location && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        {dest.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Filters */}
                <section className="border-b border-slate-200 bg-white py-4">
                    <div className="container mx-auto max-w-6xl px-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory('Semua')}
                                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${selectedCategory === 'Semua'
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    <Grid3X3 size={16} />
                                    Semua
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.slug)}
                                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${selectedCategory === cat.slug
                                                ? 'bg-primary text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`rounded-lg p-2 transition-all ${viewMode === 'grid'
                                            ? 'bg-primary-lighter text-primary'
                                            : 'text-slate-400 hover:bg-slate-100'
                                        }`}
                                >
                                    <Grid3X3 size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`rounded-lg p-2 transition-all ${viewMode === 'list'
                                            ? 'bg-primary-lighter text-primary'
                                            : 'text-slate-400 hover:bg-slate-100'
                                        }`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Destinations Grid/List */}
                <section className="py-8">
                    <div className="container mx-auto max-w-6xl px-4">
                        <p className="mb-6 text-sm text-slate-600">
                            Menampilkan {filteredDestinations.length} destinasi
                            {selectedCategory !== 'Semua' &&
                                ` dalam kategori "${categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}"`}
                        </p>

                        {viewMode === 'grid' ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredDestinations.map((dest) => (
                                    <Link
                                        key={dest.id}
                                        href={`/informasi-publik/destinasi-wisata/${dest.slug}`}
                                        className="group hover:border-primary-light flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg"
                                    >
                                        <div className="aspect-video w-full relative bg-slate-100 overflow-hidden">
                                            {dest.image?.cdnUrl ? (
                                                <Image
                                                    src={dest.image.cdnUrl}
                                                    alt={dest.name}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                                                    <ImageIcon className="h-12 w-12 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="mb-2 flex items-center justify-between">
                                                {dest.category && (
                                                    <span className="bg-primary-lighter text-primary-hover rounded-full px-2 py-0.5 text-xs font-medium">
                                                        {dest.category.name}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-1 text-sm">
                                                    {dest.rating > 0 && (
                                                        <>
                                                            <Star size={14} className="text-amber-500" />
                                                            <span className="font-medium text-slate-700">
                                                                {dest.rating}
                                                            </span>
                                                        </>
                                                    )}
                                                    {dest.reviews > 0 && (
                                                        <span className="text-slate-400">
                                                            ({dest.reviews})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <h3 className="group-hover:text-primary mb-1 font-bold text-slate-800">
                                                {dest.name}
                                            </h3>
                                            <p className="mb-3 line-clamp-2 text-sm text-slate-600 flex-1">
                                                {dest.description}
                                            </p>
                                            <div className="flex items-center justify-between text-sm mt-auto pt-3 border-t border-slate-100">
                                                {dest.location ? (
                                                    <span className="flex items-center gap-1 text-slate-500 truncate max-w-[60%]">
                                                        <MapPin size={14} className="flex-shrink-0" />
                                                        <span className="truncate">{dest.location}</span>
                                                    </span>
                                                ) : <span />}
                                                {dest.price && (
                                                    <span className="text-primary font-semibold flex-shrink-0">
                                                        {dest.price}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredDestinations.map((dest) => (
                                    <Link
                                        key={dest.id}
                                        href={`/informasi-publik/destinasi-wisata/${dest.slug}`}
                                        className="group hover:border-primary-light flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-lg"
                                    >
                                        <div className="aspect-video w-48 shrink-0 overflow-hidden rounded-xl bg-slate-100 relative">
                                            {dest.image?.cdnUrl ? (
                                                <Image
                                                    src={dest.image.cdnUrl}
                                                    alt={dest.name}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                                                    <ImageIcon className="h-10 w-10 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="mb-2 flex items-center gap-2">
                                                {dest.category && (
                                                    <span className="bg-primary-lighter text-primary-hover rounded-full px-2 py-0.5 text-xs font-medium">
                                                        {dest.category.name}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-1 text-sm">
                                                    {dest.rating > 0 && (
                                                        <>
                                                            <Star size={14} className="text-amber-500" />
                                                            <span className="font-medium text-slate-700">
                                                                {dest.rating}
                                                            </span>
                                                        </>
                                                    )}
                                                    {dest.reviews > 0 && (
                                                        <span className="text-slate-400">
                                                            ({dest.reviews} ulasan)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <h3 className="group-hover:text-primary mb-1 text-lg font-bold text-slate-800">
                                                {dest.name}
                                            </h3>
                                            <p className="mb-3 text-sm text-slate-600 line-clamp-2">
                                                {dest.description}
                                            </p>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                                {dest.location && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        {dest.location}
                                                    </span>
                                                )}
                                                {dest.openHours && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {dest.openHours}
                                                    </span>
                                                )}
                                                {dest.price && (
                                                    <span className="text-primary font-semibold">
                                                        {dest.price}
                                                    </span>
                                                )}
                                            </div>

                                            {getFacilities(dest).length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {getFacilities(dest).slice(0, 4).map((facility) => (
                                                        <span
                                                            key={facility}
                                                            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                                                        >
                                                            {facility}
                                                        </span>
                                                    ))}
                                                    {getFacilities(dest).length > 4 && (
                                                        <span className="text-xs text-slate-400 border border-slate-200 rounded-full px-2 py-0.5">
                                                            +{getFacilities(dest).length - 4} lainnya
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {filteredDestinations.length === 0 && (
                            <div className="text-center py-12">
                                <Map className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                                <h3 className="text-lg font-medium text-slate-900">Tidak ada destinasi</h3>
                                <p className="text-slate-500">Coba ubah filter atau kata kunci pencarian Anda.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}
