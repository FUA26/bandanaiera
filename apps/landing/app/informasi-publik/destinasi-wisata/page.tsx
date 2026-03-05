import { getTourismDestinations, getTourismCategories } from '@/lib/tourism-data';
import { DestinasiWisataClient } from './destinasi-wisata-client';

export const metadata = {
  title: 'Destinasi Wisata | Kabupaten Naiera',
  description: 'Jelajahi keindahan alam dan budaya Kabupaten Naiera',
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
