'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LogOut, ArrowLeft, Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  material: string;
  price: number;
  dimensions: string;
  images: string[];
  featured: boolean;
  in_stock: boolean;
}

// 20 Fallback items for testing (same as catalogue/page.tsx)
const fallbackItems: Product[] = [
  {
    id: '1',
    slug: 'venetian-sofa',
    name: 'Venetian Sofa',
    description: 'Indulge in absolute luxury. The Venetian Sofa is upholstered in premium plush velvet, offering deep-cushioned comfort with a hand-burnished solid beech frame. A timeless classic designed for elite living rooms.',
    category: 'living_room',
    material: 'upholstered',
    price: 185000,
    dimensions: '230cm × 100cm × 85cm',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    in_stock: true
  },
  {
    id: '2',
    slug: 'onyx-coffee-table',
    name: 'Onyx Coffee Table',
    description: 'An exquisite center piece crafted from selected dark Nero Marquina marble, supported by a geometric gold-plated metal base. The perfect statement piece to ground your luxury living layout.',
    category: 'living_room',
    material: 'marble',
    price: 78000,
    dimensions: '110cm × 110cm × 40cm',
    images: [
      'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '3',
    slug: 'havana-lounge-chair',
    name: 'Havana Lounge Chair',
    description: 'A masterpiece of Mid-Century Scandinavian design. Features hand-stitched grain leather draped over a seasoned solid teak wood structure. Offers an ergonomically refined tilt for supreme relaxation.',
    category: 'living_room',
    material: 'solid_wood',
    price: 95000,
    dimensions: '85cm × 90cm × 95cm',
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    in_stock: true
  },
  {
    id: '6',
    slug: 'palazzo-king-bed',
    name: 'Palazzo King Bed',
    description: 'The ultimate sanctuary anchor. Crafted in solid walnut wood with an imposing high headboard, padded and lined with luxury off-white Italian linen. Promises deep comfort and unmatched bedroom stature.',
    category: 'bedroom',
    material: 'solid_wood',
    price: 220000,
    dimensions: '220cm × 210cm × 140cm',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    in_stock: true
  },
  {
    id: '10',
    slug: 'monarch-dining-table',
    name: 'Monarch Dining Table',
    description: 'Dine like royalty. Features a massive 8-seater polished marble slab top with rounded editorial edges, balanced on a structural pillar base made of ebonized solid ash wood.',
    category: 'dining',
    material: 'marble',
    price: 195000,
    dimensions: '240cm × 100cm × 76cm',
    images: [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    in_stock: true
  },
  {
    id: '14',
    slug: 'executive-desk',
    name: 'Executive Desk',
    description: 'The pinnacle of office luxury. Built entirely of seasoned solid oak wood with hand-polished leather writing pad overlay, discrete cable bays, and 4 locking organizer drawers.',
    category: 'office',
    material: 'solid_wood',
    price: 145000,
    dimensions: '180cm × 85cm × 76cm',
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    in_stock: true
  },
];

interface FormState {
  id?: string;
  name: string;
  description: string;
  category: string;
  material: string;
  price: string;
  dimensions: string;
  featured: boolean;
  in_stock: boolean;
  images: string[];
}

const emptyForm: FormState = {
  name: '',
  description: '',
  category: 'living_room',
  material: 'solid_wood',
  price: '',
  dimensions: '',
  featured: false,
  in_stock: true,
  images: ['', '', ''],
};

export default function AdminCataloguePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

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
      fetchProducts();
    };

    checkAuthAndFetch();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('furniture_items')
        .select('*')
        .order('name', { ascending: true });

      if (error || !data || data.length === 0) {
        console.warn('Using fallback products list:', error);
        setProducts(fallbackItems);
      } else {
        setProducts(data as Product[]);
      }
    } catch (err) {
      console.error('Error loading catalogue in admin:', err);
      setProducts(fallbackItems);
    }
  };

  const handleLogout = () => {
    supabase.auth.signOut();
    localStorage.removeItem('maison_admin_session');
    localStorage.removeItem('maison_admin_email');
    router.replace('/admin/login');
  };

  const handleToggleStock = async (id: string, currentStock: boolean) => {
    const nextStock = !currentStock;

    // Optimistic Update
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, in_stock: nextStock } : p)));

    try {
      await supabase.from('furniture_items').update({ in_stock: nextStock }).eq('id', id);
    } catch (err) {
      console.error('Database stock toggle failed, state retained locally:', err);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    const nextFeatured = !currentFeatured;

    // Optimistic Update
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: nextFeatured } : p)));

    try {
      await supabase.from('furniture_items').update({ featured: nextFeatured }).eq('id', id);
    } catch (err) {
      console.error('Database featured toggle failed, state retained locally:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    // Optimistic Update
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      const { error } = await supabase.from('furniture_items').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Failed deleting from database, state updated locally:', err);
    }
  };

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      material: product.material,
      price: product.price.toString(),
      dimensions: product.dimensions,
      featured: product.featured,
      in_stock: product.in_stock,
      // pad image array to min 3 slots
      images: [
        product.images[0] || '',
        product.images[1] || '',
        product.images[2] || '',
        product.images[3] || '',
        product.images[4] || '',
      ].filter((x, index) => index < 3 || x !== ''),
    });
    setErrors({});
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const nextImages = [...form.images];
    nextImages[index] = value;
    setForm((prev) => ({ ...prev, images: nextImages }));
  };

  const handleAddImageField = () => {
    if (form.images.length >= 5) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) newErrors.name = 'Item name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.dimensions.trim()) newErrors.dimensions = 'Dimensions are required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = 'Please enter a valid positive price';
    }

    const filteredImages = form.images.filter((img) => img.trim() !== '');
    if (filteredImages.length < 3) {
      newErrors.images = 'Please enter at least 3 valid image URLs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);

    const filteredImages = form.images.filter((img) => img.trim() !== '');
    const productSlug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      name: form.name,
      slug: productSlug,
      description: form.description,
      category: form.category,
      material: form.material,
      price: Number(form.price),
      dimensions: form.dimensions,
      featured: form.featured,
      in_stock: form.in_stock,
      images: filteredImages,
    };

    try {
      if (modalMode === 'add') {
        const generatedId = Math.random().toString(36).substring(2, 9);
        const { data, error } = await supabase
          .from('furniture_items')
          .insert({ id: generatedId, ...payload })
          .select()
          .single();

        if (error) {
          console.warn('Database write failed, writing locally to state:', error);
          setProducts((prev) => [...prev, { id: generatedId, ...payload }]);
        } else if (data) {
          setProducts((prev) => [...prev, data as Product]);
        }
      } else {
        const { data, error } = await supabase
          .from('furniture_items')
          .update(payload)
          .eq('id', form.id!)
          .select()
          .single();

        if (error) {
          console.warn('Database write failed, writing locally to state:', error);
          setProducts((prev) =>
            prev.map((p) => (p.id === form.id ? { ...p, ...payload } : p))
          );
        } else if (data) {
          setProducts((prev) => prev.map((p) => (p.id === form.id ? (data as Product) : p)));
        }
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Error saving. State was retained locally.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="bg-bg min-h-screen flex items-center justify-center text-text">
        <span className="font-inter text-xs tracking-widest text-gold uppercase animate-pulse">
          Loading Catalogue Admin...
        </span>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    living_room: 'Living Room',
    bedroom: 'Bedroom',
    dining: 'Dining',
    office: 'Office',
    outdoor: 'Outdoor',
  };

  const materialLabels: Record<string, string> = {
    solid_wood: 'Solid Wood',
    metal: 'Metal',
    glass: 'Glass',
    upholstered: 'Upholstered',
    marble: 'Marble',
    rattan: 'Rattan',
  };

  return (
    <div className="bg-bg min-h-screen text-text pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-10">
        
        {/* Header toolbar */}
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
                Showroom Inventory
              </span>
              <h1 className="font-cormorant text-3xl font-light text-text uppercase mt-0.5">
                Catalogue Manager
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 border border-gold bg-gold text-bg hover:bg-transparent hover:text-gold px-5 py-2.5 font-inter text-xs tracking-wider uppercase font-semibold transition-all duration-300 rounded-none"
            >
              <Plus className="h-4 w-4" />
              Add New Item
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

        {/* Database Catalogue Table */}
        <div className="bg-surface border border-border/60 p-6 md:p-8 rounded-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-inter text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-muted uppercase tracking-wider font-semibold text-[10px] pb-3">
                  <th className="py-4 px-2">Name</th>
                  <th className="py-4 px-2">Category</th>
                  <th className="py-4 px-2">Material</th>
                  <th className="py-4 px-2">Price</th>
                  <th className="py-4 px-2 text-center">Featured</th>
                  <th className="py-4 px-2 text-center">In Stock</th>
                  <th className="py-4 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-light/40 transition-colors duration-200">
                    <td className="py-4 px-2 font-medium text-text">{product.name}</td>
                    <td className="py-4 px-2">{categoryLabels[product.category] || product.category}</td>
                    <td className="py-4 px-2">{materialLabels[product.material] || product.material}</td>
                    <td className="py-4 px-2 font-semibold text-gold">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                      }).format(product.price)}
                    </td>
                    {/* Featured toggle */}
                    <td className="py-4 px-2 text-center">
                      <button
                        onClick={() => handleToggleFeatured(product.id, product.featured)}
                        className="p-1 focus:outline-none"
                        aria-label="Toggle Featured"
                      >
                        {product.featured ? (
                          <CheckCircle2 className="h-5 w-5 text-gold mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted/40 mx-auto hover:text-gold/60" />
                        )}
                      </button>
                    </td>
                    {/* Stock toggle */}
                    <td className="py-4 px-2 text-center">
                      <button
                        onClick={() => handleToggleStock(product.id, product.in_stock)}
                        className="p-1 focus:outline-none"
                        aria-label="Toggle Stock"
                      >
                        {product.in_stock ? (
                          <CheckCircle2 className="h-5 w-5 text-gold mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted/40 mx-auto hover:text-gold/60" />
                        )}
                      </button>
                    </td>
                    {/* Edit Delete buttons */}
                    <td className="py-4 px-2 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-2 border border-border/80 text-muted hover:text-gold hover:border-gold transition-colors duration-300 rounded-none inline-flex items-center gap-1"
                        aria-label="Edit item"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 border border-border/80 text-muted hover:text-red-500 hover:border-red-500 transition-colors duration-300 rounded-none inline-flex items-center gap-1"
                        aria-label="Delete item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Editor Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-surface border border-gold w-full max-w-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto rounded-none animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h2 className="font-cormorant text-2xl font-light tracking-wide text-gold uppercase">
                {modalMode === 'add' ? 'Add New Furniture Item' : 'Edit Furniture Item'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text/75 hover:text-gold transition-colors"
              >
                Close
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Form level error readout */}
              {errors.images && (
                <div className="bg-red-950/20 border border-gold/40 text-gold text-xs p-3 text-center">
                  {errors.images}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="font-inter text-[9px] uppercase tracking-wider text-muted">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className={`w-full bg-surface-light border px-3 py-2 font-inter text-sm text-text focus:outline-none focus:border-gold rounded-none ${
                      errors.name ? 'border-gold' : 'border-border/60'
                    }`}
                    placeholder="Venetian Sofa"
                  />
                  {errors.name && <span className="text-[9px] text-gold">{errors.name}</span>}
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="font-inter text-[9px] uppercase tracking-wider text-muted">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    className={`w-full bg-surface-light border px-3 py-2 font-inter text-sm text-text focus:outline-none focus:border-gold rounded-none ${
                      errors.price ? 'border-gold' : 'border-border/60'
                    }`}
                    placeholder="185000"
                  />
                  {errors.price && <span className="text-[9px] text-gold">{errors.price}</span>}
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="font-inter text-[9px] uppercase tracking-wider text-muted">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="w-full bg-surface-light border border-border/60 focus:border-gold px-3 py-2.5 font-inter text-sm text-text focus:outline-none rounded-none"
                  >
                    <option value="living_room">Living Room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="dining">Dining</option>
                    <option value="office">Office</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>

                {/* Material */}
                <div className="space-y-1">
                  <label className="font-inter text-[9px] uppercase tracking-wider text-muted">Material</label>
                  <select
                    name="material"
                    value={form.material}
                    onChange={handleInputChange}
                    className="w-full bg-surface-light border border-border/60 focus:border-gold px-3 py-2.5 font-inter text-sm text-text focus:outline-none rounded-none"
                  >
                    <option value="solid_wood">Solid Wood</option>
                    <option value="metal">Metal</option>
                    <option value="glass">Glass</option>
                    <option value="upholstered">Upholstered</option>
                    <option value="marble">Marble</option>
                    <option value="rattan">Rattan</option>
                  </select>
                </div>

                {/* Dimensions */}
                <div className="space-y-1 md:col-span-2">
                  <label className="font-inter text-[9px] uppercase tracking-wider text-muted">Dimensions (e.g. 230cm × 100cm × 85cm)</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={form.dimensions}
                    onChange={handleInputChange}
                    className={`w-full bg-surface-light border px-3 py-2 font-inter text-sm text-text focus:outline-none focus:border-gold rounded-none ${
                      errors.dimensions ? 'border-gold' : 'border-border/60'
                    }`}
                    placeholder="230cm × 100cm × 85cm"
                  />
                  {errors.dimensions && <span className="text-[9px] text-gold">{errors.dimensions}</span>}
                </div>

                {/* Description */}
                <div className="space-y-1 md:col-span-2">
                  <label className="font-inter text-[9px] uppercase tracking-wider text-muted">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={form.description}
                    onChange={handleInputChange}
                    className={`w-full bg-surface-light border px-3 py-2 font-inter text-sm text-text focus:outline-none focus:border-gold rounded-none resize-none ${
                      errors.description ? 'border-gold' : 'border-border/60'
                    }`}
                    placeholder="Detail the piece's craftsmanship, comfort level, structural details..."
                  />
                  {errors.description && <span className="text-[9px] text-gold">{errors.description}</span>}
                </div>

                {/* Toggles */}
                <div className="flex gap-8 py-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                      className="accent-gold h-4 w-4"
                    />
                    <span className="font-inter text-xs tracking-wider text-muted uppercase">Featured</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.in_stock}
                      onChange={(e) => setForm((prev) => ({ ...prev, in_stock: e.target.checked }))}
                      className="accent-gold h-4 w-4"
                    />
                    <span className="font-inter text-xs tracking-wider text-muted uppercase">In Stock</span>
                  </label>
                </div>
              </div>

              {/* Images Array Inputs */}
              <div className="space-y-3 pt-4 border-t border-border/20">
                <div className="flex items-center justify-between">
                  <h4 className="font-inter text-xs font-semibold tracking-wider text-gold uppercase">
                    Images URLs (Min 3, Max 5)
                  </h4>
                  {form.images.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddImageField}
                      className="font-inter text-[10px] tracking-widest text-gold hover:underline uppercase"
                    >
                      + Add Image Field
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {form.images.map((img, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="font-inter text-xs text-muted/80 self-center w-8">#{index + 1}</span>
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        className="flex-grow bg-surface-light border border-border/60 focus:border-gold px-3 py-2 font-inter text-xs text-text focus:outline-none rounded-none"
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-6 border-t border-border/40 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-border/60 hover:border-gold px-6 py-3 font-inter text-xs tracking-wider uppercase text-muted hover:text-gold transition-colors duration-300 rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gold hover:bg-gold-light border border-gold hover:border-gold-light text-bg px-8 py-3 font-inter text-xs tracking-wider uppercase font-semibold transition-all duration-300 rounded-none disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
