import { getTourismDestinations, getTourismCategories } from '@/lib/tourism-data';
import { DestinasiWisataClient } from './destinasi-wisata-client';

export const metadata = {
  title: 'Destinasi Wisata | Kabupaten Malang',
  description: 'Jelajahi keindahan alam dan budaya Kabupaten Malang',
};

export default async function DestinasiWisataPage() {
  const [destinationsData, categoriesData] = await Promise.all([
    getTourismDestinations(),
    getTourismCategories(),
  ]);

  const destinations = destinationsData?.items || [];
  const categories = categoriesData?.categories || [];

  return (
    <DestinasiWisataClient
      initialDestinations={destinations}
      categories={categories}
    />
  );
}
