import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import LayoutWrapper from '@/components/LayoutWrapper';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Maison & Co | Luxury Furniture Hyderabad',
  description: 'Where Craftsmanship Meets Luxury. Browse our curated collection of luxury furniture pieces in Banjara Hills, Hyderabad.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased font-inter bg-bg text-text">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
