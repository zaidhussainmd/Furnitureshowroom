import type { Metadata } from 'next';
import CatalogueClient from '@/components/CatalogueClient';

export const metadata: Metadata = {
  title: 'Furniture Collection | Maison & Co',
  description: 'Browse our exclusive catalog of luxury furniture. Filter by room type, materials, and pricing to find pieces matching your design aesthetic.',
};

export default function CataloguePage() {
  return <CatalogueClient />;
}
