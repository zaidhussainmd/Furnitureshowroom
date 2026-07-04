'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/login');
  }, [router]);

  return (
    <div className="bg-bg min-h-screen flex items-center justify-center text-text">
      <span className="font-inter text-xs tracking-widest text-gold uppercase animate-pulse">
        Redirecting...
      </span>
    </div>
  );
}
