'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LogOut, ArrowLeft, Download, ChevronDown, ChevronUp } from 'lucide-react';

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

// Fallback data for testing
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

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isLocalSession = localStorage.getItem('maison_admin_session') === 'active';

      if (!session && !isLocalSession) {
        setIsAuthenticated(false);
        router.replace('/admin/login');
        return;
      }

      setIsAuthenticated(true);
      fetchEnquiries();
    };

    checkAuthAndFetch();
  }, [router]);

  const fetchEnquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        console.warn('Using fallback enquiries:', error);
        setEnquiries(mockEnquiries);
      } else {
        setEnquiries(data as Enquiry[]);
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      setEnquiries(mockEnquiries);
    }
  };

  // Filter based on selected tab
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredEnquiries(enquiries);
    } else {
      setFilteredEnquiries(enquiries.filter((e) => e.status === activeTab));
    }
  }, [activeTab, enquiries]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('maison_admin_session');
    localStorage.removeItem('maison_admin_email');
    router.replace('/admin/login');
  };

  const handleStatusChange = async (id: string, newStatus: 'new' | 'contacted' | 'closed') => {
    setUpdatingId(id);
    try {
      const response = await fetch('/api/admin/update-enquiry-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('API update failed');
      }

      // Update state locally
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Could not update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Basic CSV Export implementation
  const exportToCSV = () => {
    if (enquiries.length === 0) return;

    const headers = [
      'Ref#',
      'Product/Topic',
      'Customer Name',
      'Phone',
      'Email',
      'Preferred Contact',
      'Status',
      'Date Created',
      'Message',
    ];

    const rows = enquiries.map((e) => [
      e.enquiry_number,
      e.product_name,
      e.customer_name,
      e.customer_phone,
      e.customer_email,
      e.preferred_contact,
      e.status,
      e.created_at,
      e.message.replace(/"/g, '""'), // escape quotes
    ]);

    // Build standard CSV format
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', encodedUri);
    downloadLink.setAttribute(
      'download',
      `maison_enquiries_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if (isAuthenticated === null) {
    return (
      <div className="bg-bg min-h-screen flex items-center justify-center text-text">
        <span className="font-inter text-xs tracking-widest text-gold uppercase animate-pulse">
          Loading Enquiries...
        </span>
      </div>
    );
  }

  const tabOptions = [
    { label: 'All Enquiries', value: 'all' as const },
    { label: 'New', value: 'new' as const },
    { label: 'Contacted', value: 'contacted' as const },
    { label: 'Closed', value: 'closed' as const },
  ];

  return (
    <div className="bg-bg min-h-screen text-text pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-10">
        
        {/* Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border/40 pb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="p-2 border border-border/60 text-muted hover:text-gold hover:border-gold transition-colors duration-300 rounded-none"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <span className="font-inter text-[10px] tracking-[0.2em] text-gold uppercase font-medium">
                Customer Database
              </span>
              <h1 className="font-cormorant text-3xl font-light text-text uppercase mt-0.5">
                Quote Enquiries
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 border border-gold/40 hover:border-gold px-5 py-2.5 font-inter text-xs tracking-wider uppercase text-gold hover:text-bg hover:bg-gold transition-all duration-300 rounded-none"
            >
              <Download className="h-4 w-4" />
              Export to CSV
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-border/60 hover:border-gold px-5 py-2.5 font-inter text-xs tracking-wider uppercase text-muted hover:text-gold transition-colors duration-300 rounded-none"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex border-b border-border/30 gap-6">
          {tabOptions.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`font-inter text-xs tracking-widest uppercase pb-3 transition-colors relative ${
                activeTab === tab.value
                  ? 'text-gold font-medium'
                  : 'text-muted hover:text-text'
              }`}
            >
              {tab.label}
              {activeTab === tab.value && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold" />
              )}
            </button>
          ))}
        </div>

        {/* Database List Table */}
        <div className="bg-surface border border-border/60 p-6 md:p-8 rounded-none">
          {filteredEnquiries.length === 0 ? (
            <div className="text-center py-12 font-cormorant text-xl font-light text-muted">
              No enquiries found under this category.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-inter text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/40 text-muted uppercase tracking-wider font-semibold text-[10px] pb-3">
                    <th className="py-4 px-2 w-12"></th>
                    <th className="py-4 px-2">Ref#</th>
                    <th className="py-4 px-2">Product / Category</th>
                    <th className="py-4 px-2">Customer Name</th>
                    <th className="py-4 px-2">Phone</th>
                    <th className="py-4 px-2">Preferred Contact</th>
                    <th className="py-4 px-2">Status</th>
                    <th className="py-4 px-2">Date Received</th>
                    <th className="py-4 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {filteredEnquiries.map((enquiry) => {
                    const isExpanded = expandedId === enquiry.id;
                    const statusColors = {
                      new: 'text-gold border-gold/40 bg-gold/5',
                      contacted: 'text-text border-text/40 bg-text/5',
                      closed: 'text-muted border-border bg-border/10',
                    };

                    return (
                      <>
                        <tr
                          key={enquiry.id}
                          onClick={() => toggleExpand(enquiry.id)}
                          className={`cursor-pointer hover:bg-surface-light/40 transition-colors duration-200 ${
                            isExpanded ? 'bg-surface-light/35' : ''
                          }`}
                        >
                          <td className="py-4 px-2 text-center">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-gold" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted" />
                            )}
                          </td>
                          <td className="py-4 px-2 font-medium text-gold">{enquiry.enquiry_number}</td>
                          <td className="py-4 px-2">{enquiry.product_name}</td>
                          <td className="py-4 px-2 font-medium">{enquiry.customer_name}</td>
                          <td className="py-4 px-2">{enquiry.customer_phone}</td>
                          <td className="py-4 px-2 uppercase text-[10px] tracking-wider">
                            {enquiry.preferred_contact}
                          </td>
                          <td className="py-4 px-2">
                            <span
                              className={`inline-block border px-2 py-0.5 text-[9px] uppercase tracking-widest ${
                                statusColors[enquiry.status]
                              }`}
                            >
                              {enquiry.status}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-muted font-light">
                            {new Date(enquiry.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-4 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={enquiry.status}
                              disabled={updatingId === enquiry.id}
                              onChange={(e) =>
                                handleStatusChange(enquiry.id, e.target.value as 'new' | 'contacted' | 'closed')
                              }
                              className="bg-surface-light border border-border/80 text-text text-[10px] tracking-widest uppercase p-1.5 focus:outline-none focus:border-gold rounded-none"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                        </tr>

                        {/* Collapsible Row Expansion */}
                        {isExpanded && (
                          <tr className="bg-surface-light/20">
                            <td colSpan={9} className="py-6 px-10">
                              <div className="space-y-4 max-w-3xl">
                                <div className="grid grid-cols-2 gap-4 text-xs font-inter border-b border-border/20 pb-4">
                                  <p>
                                    <strong className="text-gold font-medium">Customer Email:</strong>{' '}
                                    <a
                                      href={`mailto:${enquiry.customer_email}`}
                                      className="hover:underline text-gold/80"
                                    >
                                      {enquiry.customer_email}
                                    </a>
                                  </p>
                                  <p>
                                    <strong className="text-gold font-medium">Preferred Contact Channel:</strong>{' '}
                                    <span className="uppercase text-[10px] tracking-widest">
                                      {enquiry.preferred_contact}
                                    </span>
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-inter text-[10px] uppercase tracking-widest text-gold font-semibold">
                                    Message
                                  </h4>
                                  <p className="font-inter text-xs text-text/90 leading-relaxed bg-surface-light/40 border border-border/30 p-4 whitespace-pre-wrap rounded-none">
                                    {enquiry.message || 'No additional message was submitted.'}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
