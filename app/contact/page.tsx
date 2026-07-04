import type { Metadata } from 'next';
import ContactClient from '@/components/ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | Maison & Co',
  description: 'Reach out to the Maison & Co design showroom in Banjara Hills, Hyderabad. Submit queries or get directions to our showroom.',
};

export default function ContactPage() {
  return <ContactClient />;
}
