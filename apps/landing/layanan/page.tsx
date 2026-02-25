import { LayananPageClient } from "./layanan-page-client";
import { getServiceCategories, getAllServices } from "@/lib/services-data";

export default async function LayananPage() {
  // Fetch data from directories
  const categories = await getServiceCategories();
  const allServices = await getAllServices();

  return (
    <LayananPageClient categories={categories} services={allServices} />
  );
}
