'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const checkCurrentSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isLocalSession = localStorage.getItem('maison_admin_session') === 'active';
      if (session || isLocalSession) {
        router.replace('/admin/dashboard');
      }
    };
    checkCurrentSession();
  }, [router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Attempt Supabase login first
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // 2. If Supabase fails, check for fallback demo developer credentials
        if (email.trim() === 'admin@maisonandco.com' && password === 'admin123') {
          localStorage.setItem('maison_admin_session', 'active');
          localStorage.setItem('maison_admin_email', email);
          router.replace('/admin/dashboard');
          return;
        }
        throw new Error(authError.message);
      }

      if (data.session) {
        router.replace('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Invalid administrative credentials';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bg min-h-screen flex items-center justify-center px-6">
      <div className="bg-surface border border-gold/40 w-full max-w-md p-8 md:p-10 space-y-8">
        
        {/* Branding header */}
        <div className="text-center space-y-3">
          <span className="font-inter text-[10px] tracking-[0.25em] text-muted uppercase">
            Administrative Portal
          </span>
          <h1 className="font-cormorant text-3xl font-light text-gold tracking-[0.2em] uppercase select-none">
            MAISON & CO
          </h1>
        </div>

        {/* Info Alert on demo login */}
        <div className="bg-surface-light border border-border/60 p-4 text-[10px] font-inter text-muted/90 leading-relaxed text-center">
          Demo Credentials: <span className="text-gold font-medium">admin@maisonandco.com</span> / <span className="text-gold font-medium">admin123</span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-950/20 border border-gold/40 text-gold text-xs p-3 text-center">
              {error}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="font-inter text-[10px] tracking-widest uppercase text-muted block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-light border border-border/60 focus:border-gold px-11 py-3.5 font-inter text-sm text-text focus:outline-none transition-colors duration-300 rounded-none"
                placeholder="admin@maisonandco.com"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/80" />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="font-inter text-[10px] tracking-widest uppercase text-muted block">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-light border border-border/60 focus:border-gold px-11 py-3.5 font-inter text-sm text-text focus:outline-none transition-colors duration-300 rounded-none"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/80" />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold hover:bg-gold-light text-bg py-4 font-inter text-xs tracking-[0.25em] uppercase font-semibold transition-all duration-300 rounded-none border border-gold hover:border-gold-light disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>

      </div>
    </div>
  );
}
