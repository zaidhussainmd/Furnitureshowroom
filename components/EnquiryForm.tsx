'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

interface EnquiryFormProps {
  productName: string;
  productId: string;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
  preferredContact: 'whatsapp' | 'call' | 'email';
}

export default function EnquiryForm({ productName, productId }: EnquiryFormProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    message: '',
    preferredContact: 'whatsapp',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [refNumber, setRefNumber] = useState('');

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(form.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectContact = (method: 'whatsapp' | 'call' | 'email') => {
    setForm((prev) => ({ ...prev, preferredContact: method }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // 1. Submit enquiry to local endpoint
      const response = await fetch('/api/submit-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productName,
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          message: form.message,
          preferredContact: form.preferredContact,
        }),
      });

      if (!response.ok) {
        throw new Error('Enquiry submission failed');
      }

      const resData = await response.json();
      const generatedRef = resData.enquiry_number || 'MC1001';
      setRefNumber(generatedRef);

      // 2. Trigger notifications via /api/send-notifications
      await fetch('/api/send-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryNumber: generatedRef,
          productName,
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          message: form.message,
          preferredContact: form.preferredContact,
        }),
      });

      setSubmitStatus('success');
      // Reset form fields
      setForm({
        name: '',
        phone: '',
        email: '',
        message: '',
        preferredContact: 'whatsapp',
      });
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    const displayContactMethod = {
      whatsapp: 'WhatsApp',
      call: 'Call',
      email: 'Email',
    };

    return (
      <div className="bg-surface-light border border-gold p-8 text-center space-y-6 animate-fade-in">
        <h3 className="font-cormorant text-2xl font-light text-gold uppercase tracking-wider">
          Enquiry Received
        </h3>
        <p className="font-inter text-xs text-text/90 leading-relaxed">
          Thank you. Your enquiry has been registered under reference:
          <strong className="text-gold block text-lg font-medium tracking-widest my-2">
            {refNumber}
          </strong>
          A representative from our Banjara Hills showroom will contact you via{' '}
          <strong className="text-gold">{displayContactMethod[form.preferredContact]}</strong> within 24
          hours.
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="font-inter text-xs tracking-widest uppercase border border-gold text-gold hover:bg-gold hover:text-bg py-3 px-8 transition-all duration-300 font-medium rounded-none w-full"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border/60 p-6 md:p-8 space-y-6">
      <div>
        <h3 className="font-cormorant text-2xl font-light text-text uppercase tracking-wide">
          Request a Quote
        </h3>
        <p className="font-inter text-xs text-muted mt-1">
          Our team will contact you within 24 hours
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="font-inter text-[10px] tracking-widest uppercase text-muted">
            Full Name <span className="text-gold">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleInput}
            className={`w-full bg-surface-light border px-4 py-3 font-inter text-sm text-text focus:outline-none focus:border-gold transition-colors duration-300 rounded-none ${
              errors.name ? 'border-gold' : 'border-border/60'
            }`}
            placeholder="John Doe"
          />
          {errors.name && <span className="font-inter text-[10px] text-gold">{errors.name}</span>}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="font-inter text-[10px] tracking-widest uppercase text-muted">
            Phone Number <span className="text-gold">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleInput}
            className={`w-full bg-surface-light border px-4 py-3 font-inter text-sm text-text focus:outline-none focus:border-gold transition-colors duration-300 rounded-none ${
              errors.phone ? 'border-gold' : 'border-border/60'
            }`}
            placeholder="10-digit mobile number"
          />
          {errors.phone && <span className="font-inter text-[10px] text-gold">{errors.phone}</span>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="font-inter text-[10px] tracking-widest uppercase text-muted">
            Email Address <span className="text-gold">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleInput}
            className={`w-full bg-surface-light border px-4 py-3 font-inter text-sm text-text focus:outline-none focus:border-gold transition-colors duration-300 rounded-none ${
              errors.email ? 'border-gold' : 'border-border/60'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && <span className="font-inter text-[10px] text-gold">{errors.email}</span>}
        </div>

        {/* Product Name (Pre-filled, Read only) */}
        <div className="space-y-1.5">
          <label className="font-inter text-[10px] tracking-widest uppercase text-muted">
            Selected Piece
          </label>
          <div className="w-full bg-surface-light border border-border/40 px-4 py-3 font-cormorant text-base text-gold font-medium select-none">
            {productName}
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label htmlFor="message" className="font-inter text-[10px] tracking-widest uppercase text-muted">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={form.message}
            onChange={handleInput}
            className="w-full bg-surface-light border border-border/60 px-4 py-3 font-inter text-sm text-text focus:outline-none focus:border-gold transition-colors duration-300 rounded-none resize-none"
            placeholder="Tell us about your space, preferred finish, or any customisation needs"
          />
        </div>

        {/* Preferred Contact Method */}
        <div className="space-y-2">
          <label className="font-inter text-[10px] tracking-widest uppercase text-muted block">
            Preferred Contact Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['whatsapp', 'call', 'email'] as const).map((method) => {
              const isSelected = form.preferredContact === method;
              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => handleSelectContact(method)}
                  className={`py-3 text-center font-inter text-xs tracking-wider uppercase border transition-all duration-300 rounded-none ${
                    isSelected
                      ? 'border-gold bg-gold text-bg font-semibold'
                      : 'border-border/60 text-text/80 hover:border-gold/50'
                  }`}
                >
                  {method === 'whatsapp' ? 'WhatsApp' : method}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-transparent text-gold border border-gold hover:bg-gold hover:text-bg py-4 font-inter text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-500 rounded-none disabled:opacity-50"
        >
          {isSubmitting ? 'Registering Enquiry...' : 'Submit Enquiry'}
        </button>

        {submitStatus === 'error' && (
          <div className="text-center font-inter text-xs text-gold mt-2">
            Something went wrong. Please check your connection and try again.
          </div>
        )}
      </form>
    </div>
  );
}
