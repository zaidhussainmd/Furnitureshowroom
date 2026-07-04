'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Catalogue', href: '/catalogue' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-border/20 ${
          isScrolled
            ? 'bg-bg/95 backdrop-blur-md py-4 shadow-lg'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex flex-col">
            <span className="font-cormorant text-2xl md:text-3xl font-medium tracking-[0.3em] text-gold hover:text-gold-light transition-colors duration-300">
              MAISON & CO
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-inter text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                    isActive
                      ? 'text-gold'
                      : 'text-text/75 hover:text-gold'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Nav Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-text/90 hover:text-gold transition-colors duration-300 p-2 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-bg flex flex-col justify-center items-center md:hidden transition-all duration-300">
          {/* Close button at top right */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-text/90 hover:text-gold transition-colors duration-300 p-2"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex flex-col items-center space-y-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-cormorant text-3xl tracking-[0.2em] uppercase transition-all duration-300 ${
                    isActive
                      ? 'text-gold'
                      : 'text-text/80 hover:text-gold'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
