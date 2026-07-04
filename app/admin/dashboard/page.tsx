'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LogOut, Inbox, CheckCircle, Archive, ClipboardList, Database, ArrowRight } from 'lucide-react';

interface Enquiry {
  id: string;
  enquiry_number: string;
  product_name: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  message: string;
  preferred_contact: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
}

const mockEnquiries: Enquiry[] = [
  {
    id: 'e1',
    enquiry_number: 'MC1005',
    product_name: 'Venetian Sofa',
    customer_name: 'Rohan Sharma',
    customer_phone: '9876543210',
    customer_email: 'rohan@example.com',
    message: 'Looking for a custom ivory velvet fabric finish. Is it possible to customize the dimensions?',
    preferred_contact: 'whatsapp',
    status: 'new',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'e2',
    enquiry_number: 'MC1004',
    product_name: 'General Enquiry',
    customer_name: 'Priya Reddy',
    customer_phone: '9988776655',
    customer_email: 'priya@example.com',
    message: 'Do you have catalog catalogs for outdoor rattan lounge collections? Please send over email.',
    preferred_contact: 'email',
    status: 'new',
    created_at: new Date(Date.now() - 10 * 3600000).toISOString(),
  },
  {
    id: 'e3',
    enquiry_number: 'MC1003',
    product_name: 'Palazzo King Bed',
    customer_name: 'Vikram Malhotra',
    customer_phone: '9000112233',
    customer_email: 'vikram@example.com',
    message: 'Need standard dimensions in dark teak wood finish. Please call to confirm shipping dates.',
    preferred_contact: 'call',
    status: 'contacted',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'e4',
    enquiry_number: 'MC1002',
    product_name: 'Monarch Dining Table',
    customer_name: 'Ananya Rao',
    customer_phone: '8877665544',
    customer_email: 'ananya@example.com',
    message: 'Is the polished Carrara top marble pre-treated for stain resistance?',
    preferred_contact: 'whatsapp',
    status: 'closed',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: 'e5',
    enquiry_number: 'MC1001',
    product_name: 'Executive Desk',
    customer_name: 'Siddharth Sen',
    customer_phone: '7766554433',
    customer_email: 'siddharth@example.com',
    message: 'Checking availability for immediate dispatch to Gachibowli office.',
    preferred_contact: 'call',
    status: 'closed',
    created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    closed: 0,
  });

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      // 1. Session authorization check
      const { data: { session } } = await supabase.auth.getSession();
      const isLocalSession = localStorage.getItem('maison_admin_session') === 'active';

      if (!session && !isLocalSession) {
        setIsAuthenticated(false);
        router.replace('/admin/login');
        return;
      }

      setIsAuthenticated(true);

      // 2. Fetch enquiries from Supabase
      try {
        const { data, error } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false });

        let list: Enquiry[] = [];
        if (error || !data || data.length === 0) {
          console.warn('Using fallback mock enquiries on admin dashboard:', error);
          list = mockEnquiries;
        } else {
          list = data as Enquiry[];
        }

        setEnquiries(list);

        // Compute counts
        const total = list.length;
        const newCount = list.filter((e) => e.status === 'new').length;
        const contactedCount = list.filter((e) => e.status === 'contacted').length;
        const closedCount = list.filter((e) => e.status === 'closed').length;

        setStats({ total, new: newCount, contacted: contactedCount, closed: closedCount });
      } catch (err) {
        console.error('Error fetching data on admin dashboard:', err);
        setEnquiries(mockEnquiries);
        // compute mock counts
        setStats({
          total: mockEnquiries.length,
          new: mockEnquiries.filter((e) => e.status === 'new').length,
          contacted: mockEnquiries.filter((e) => e.status === 'contacted').length,
          closed: mockEnquiries.filter((e) => e.status === 'closed').length,
        });
      }
    };

    checkAuthAndFetch();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('maison_admin_session');
    localStorage.removeItem('maison_admin_email');
    router.replace('/admin/login');
  };

  if (isAuthenticated === null) {
    return (
      <div className="bg-bg min-h-screen flex items-center justify-center text-text">
        <span className="font-inter text-xs tracking-widest text-gold uppercase animate-pulse">
          Loading Dashboard...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen text-text pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-10">
        
        {/* Admin Navigation Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border/40 pb-6 gap-4">
          <div>
            <span className="font-inter text-[10px] tracking-[0.2em] text-gold uppercase font-medium">
              Dashboard Overview
            </span>
            <h1 className="font-cormorant text-3xl md:text-4xl font-light text-text uppercase mt-1">
              Maison & Co Owner Console
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-gold/30 hover:border-gold px-5 py-2.5 font-inter text-xs tracking-wider uppercase text-text/90 hover:text-gold transition-colors duration-300 rounded-none"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Quick Route Links Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/enquiries"
            className="flex items-center justify-between bg-surface border border-border/60 hover:border-gold p-6 transition-all duration-300 group rounded-none"
          >
            <div className="flex items-center gap-4">
              <ClipboardList className="h-6 w-6 text-gold" />
              <div>
                <h3 className="font-cormorant text-xl font-medium tracking-wide">Manage Enquiries</h3>
                <p className="font-inter text-[10px] text-muted uppercase mt-0.5">Track quote requests & update statuses</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted group-hover:text-gold group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/catalogue"
            className="flex items-center justify-between bg-surface border border-border/60 hover:border-gold p-6 transition-all duration-300 group rounded-none"
          >
            <div className="flex items-center gap-4">
              <Database className="h-6 w-6 text-gold" />
              <div>
                <h3 className="font-cormorant text-xl font-medium tracking-wide">Manage Catalogue</h3>
                <p className="font-inter text-[10px] text-muted uppercase mt-0.5">Add, edit, or delete furniture pieces</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted group-hover:text-gold group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Stats Matrix Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total */}
          <div className="bg-surface border border-border/60 p-6 flex items-center gap-4 rounded-none">
            <div className="p-3 bg-surface-light border border-border text-gold">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <span className="font-inter text-[9px] uppercase tracking-wider text-muted">Total Enquiries</span>
              <p className="font-cormorant text-3xl font-light text-text mt-1">{stats.total}</p>
            </div>
          </div>

          {/* Card 2: New */}
          <div className="bg-surface border border-border/60 p-6 flex items-center gap-4 rounded-none">
            <div className="p-3 bg-surface-light border border-border text-gold">
              <Inbox className="h-6 w-6" />
            </div>
            <div>
              <span className="font-inter text-[9px] uppercase tracking-wider text-muted">New Alerts</span>
              <p className="font-cormorant text-3xl font-light text-gold mt-1">{stats.new}</p>
            </div>
          </div>

          {/* Card 3: Contacted */}
          <div className="bg-surface border border-border/60 p-6 flex items-center gap-4 rounded-none">
            <div className="p-3 bg-surface-light border border-border text-gold">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="font-inter text-[9px] uppercase tracking-wider text-muted">Contacted</span>
              <p className="font-cormorant text-3xl font-light text-text mt-1">{stats.contacted}</p>
            </div>
          </div>

          {/* Card 4: Closed */}
          <div className="bg-surface border border-border/60 p-6 flex items-center gap-4 rounded-none">
            <div className="p-3 bg-surface-light border border-border text-gold">
              <Archive className="h-6 w-6" />
            </div>
            <div>
              <span className="font-inter text-[9px] uppercase tracking-wider text-muted">Closed Cases</span>
              <p className="font-cormorant text-3xl font-light text-text mt-1">{stats.closed}</p>
            </div>
          </div>
        </div>

        {/* Recent Enquiries Table (Limit 10) */}
        <div className="bg-surface border border-border/60 p-6 md:p-8 space-y-6 rounded-none">
          <div className="flex items-center justify-between border-b border-border/30 pb-4">
            <h2 className="font-cormorant text-2xl font-light text-text uppercase tracking-wide">
              Recent Lead Activity
            </h2>
            <Link
              href="/admin/enquiries"
              className="font-inter text-[10px] tracking-widest text-gold hover:text-gold-light uppercase"
            >
              View All Enquiries
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-inter text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-muted uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-4 px-2">Ref</th>
                  <th className="py-4 px-2">Product / Topic</th>
                  <th className="py-4 px-2">Customer Name</th>
                  <th className="py-4 px-2">Phone</th>
                  <th className="py-4 px-2">Preferred Contact</th>
                  <th className="py-4 px-2">Status</th>
                  <th className="py-4 px-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {enquiries.slice(0, 10).map((enquiry) => {
                  const statusColors = {
                    new: 'text-gold border-gold/40 bg-gold/5',
                    contacted: 'text-text border-text/40 bg-text/5',
                    closed: 'text-muted border-border bg-border/10',
                  };

                  return (
                    <tr key={enquiry.id} className="hover:bg-surface-light transition-colors duration-200">
                      <td className="py-4 px-2 font-medium text-gold">{enquiry.enquiry_number}</td>
                      <td className="py-4 px-2">{enquiry.product_name}</td>
                      <td className="py-4 px-2 font-medium">{enquiry.customer_name}</td>
                      <td className="py-4 px-2">{enquiry.customer_phone}</td>
                      <td className="py-4 px-2 uppercase text-[10px] tracking-wider">{enquiry.preferred_contact}</td>
                      <td className="py-4 px-2">
                        <span className={`inline-block border px-2 py-0.5 text-[9px] uppercase tracking-widest ${statusColors[enquiry.status]}`}>
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right text-muted font-light">
                        {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
