'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export default function ContactClient() {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    message: '',
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

    if (!form.message.trim()) {
      newErrors.message = 'Message content is required';
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // 1. Submit general enquiry
      const response = await fetch('/api/submit-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: null,
          productName: 'General Enquiry',
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          message: form.message,
          preferredContact: 'email',
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
          productName: 'General Enquiry',
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          message: form.message,
          preferredContact: 'email',
        }),
      });

      setSubmitStatus('success');
      setForm({
        name: '',
        phone: '',
        email: '',
        message: '',
      });
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bg text-text min-h-screen pt-28 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Title Block */}
        <div className="border-b border-border/40 pb-6 mb-12">
          <span className="font-inter text-xs tracking-[0.2em] text-gold uppercase font-medium">
            Contact
          </span>
          <h1 className="font-cormorant text-4xl md:text-5xl font-light tracking-wide text-text mt-2 uppercase">
            Get in Touch
          </h1>
          <p className="font-inter text-xs md:text-sm text-muted mt-2 max-w-2xl leading-relaxed">
            Have questions about our pieces, custom sizing, or delivery? Reach out to our design consultants or visit our Banjara Hills showroom.
          </p>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* LEFT: Coordinates, Hours, Map */}
          <div className="space-y-10">
            {/* Showroom Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-surface p-8 border border-border/40">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold">
                  <MapPin className="h-5 w-5" />
                  <h3 className="font-inter text-xs uppercase tracking-widest font-semibold">Address</h3>
                </div>
                <p className="font-inter text-xs text-muted leading-relaxed pl-8">
                  Road No. 12, Banjara Hills,<br />
                  Hyderabad, Telangana 500034
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold">
                  <Clock className="h-5 w-5" />
                  <h3 className="font-inter text-xs uppercase tracking-widest font-semibold">Showroom Hours</h3>
                </div>
                <div className="font-inter text-xs text-muted leading-relaxed pl-8 space-y-1">
                  <p>Mon–Sat: 10:00 AM – 8:00 PM</p>
                  <p>Sunday: 11:00 AM – 6:00 PM</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-border/20 pt-6 sm:border-t-0 sm:pt-0">
                <div className="flex items-center gap-3 text-gold">
                  <Phone className="h-5 w-5" />
                  <h3 className="font-inter text-xs uppercase tracking-widest font-semibold">Call Details</h3>
                </div>
                <p className="font-inter text-xs text-muted leading-relaxed pl-8">
                  [OWNER PHONE — placeholder]
                </p>
              </div>

              <div className="space-y-4 border-t border-border/20 pt-6 sm:border-t-0 sm:pt-0">
                <div className="flex items-center gap-3 text-gold">
                  <Mail className="h-5 w-5" />
                  <h3 className="font-inter text-xs uppercase tracking-widest font-semibold">Email Details</h3>
                </div>
                <p className="font-inter text-xs text-muted leading-relaxed pl-8">
                  [OWNER EMAIL — placeholder]
                </p>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4">
              <a
                href="https://wa.me/9100000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-gold text-gold hover:bg-gold hover:text-bg px-6 py-3 font-inter text-xs tracking-wider uppercase transition-colors duration-300 rounded-none w-1/2 justify-center"
              >
                <MessageSquare className="h-4 w-4" />
                WhatsApp Us
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-gold text-gold hover:bg-gold hover:text-bg px-6 py-3 font-inter text-xs tracking-wider uppercase transition-colors duration-300 rounded-none w-1/2 justify-center"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                Instagram
              </a>
            </div>

            {/* Google Map Frame */}
            <div className="border border-border/60 aspect-[16/9] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.039864205561!2d78.4326581!3d17.4107874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb972e3a1f93f7%3A0xebe775ee707f15db!2sBanjara%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1717316972049!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Maison & Co Banjara Hills Map Location"
              />
            </div>
          </div>

          {/* RIGHT: General Inquiry Form */}
          <div className="bg-surface border border-border/60 p-6 md:p-8 space-y-6">
            {submitStatus === 'success' ? (
              <div className="text-center py-12 space-y-6 animate-fade-in">
                <h3 className="font-cormorant text-2xl font-light text-gold uppercase tracking-wider">
                  Enquiry Registered
                </h3>
                <p className="font-inter text-xs text-text/80 leading-relaxed">
                  Thank you for contacting Maison & Co. Your request has been logged under reference:
                  <strong className="text-gold block text-lg font-medium tracking-widest my-2">
                    {refNumber}
                  </strong>
                  Our concierge team will review your message and reply via email within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="font-inter text-xs tracking-widest uppercase border border-gold text-gold hover:bg-gold hover:text-bg py-3 px-8 transition-all duration-300 font-medium rounded-none w-full"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-cormorant text-2xl font-light text-text uppercase tracking-wide">
                    General Enquiry
                  </h3>
                  <p className="font-inter text-xs text-muted mt-1">
                    Send us a direct message and our design team will reply shortly
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
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
                      placeholder="Jane Doe"
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
                      placeholder="jane@example.com"
                    />
                    {errors.email && <span className="font-inter text-[10px] text-gold">{errors.email}</span>}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="font-inter text-[10px] tracking-widest uppercase text-muted">
                      Message <span className="text-gold">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleInput}
                      className={`w-full bg-surface-light border px-4 py-3 font-inter text-sm text-text focus:outline-none focus:border-gold transition-colors duration-300 rounded-none resize-none ${
                        errors.message ? 'border-gold' : 'border-border/60'
                      }`}
                      placeholder="Write your query or question here..."
                    />
                    {errors.message && <span className="font-inter text-[10px] text-gold">{errors.message}</span>}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-transparent text-gold border border-gold hover:bg-gold hover:text-bg py-4 font-inter text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-500 rounded-none disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending Request...' : 'Send Message'}
                  </button>

                  {submitStatus === 'error' && (
                    <div className="text-center font-inter text-xs text-gold mt-2">
                      Something went wrong. Please check your connection and try again.
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
