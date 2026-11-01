'use client';

import React, { useState } from 'react';

interface FormData {
  name: string;
  age: string;
  address: string;
  phone: string;
  email: string;
}

interface FormErrors {
  name?: string;
  age?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export default function ResellerApplicationSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    address: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 16 || Number(formData.age) > 99) {
      newErrors.age = 'Enter a valid age (16–99)';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const message = `🔥 *New Reseller Application* 🔥\n\n👤 *Name:* ${formData.name}\n🎂 *Age:* ${formData.age}\n📍 *Address:* ${formData.address}\n📞 *Phone:* ${formData.phone}\n📧 *Email:* ${formData.email}`;
    const encoded = encodeURIComponent(message);
    const waNumber = '60743057846';
    const waUrl = `https://wa.me/${waNumber}?text=${encoded}`;

    setSubmitted(true);
    window.open(waUrl, '_blank');
  };

  const handleReset = () => {
    setFormData({ name: '', age: '', address: '', phone: '', email: '' });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <section id="reseller" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(255,107,0,0.03)] to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,107,0,0.4)] to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.25)] mb-5">
            <span className="text-[#FF6B00] text-xs font-bold tracking-widest uppercase">Partner Program</span>
          </div>
          <h2 className="text-section-title text-[#F0F0F5] mb-4">
            Become a{' '}
            <span className="fire-gradient-text">Reseller</span>
          </h2>
          <p className="text-[#8888AA] text-base max-w-xl mx-auto leading-relaxed">
            Join our reseller network and earn by distributing our premium gaming panels. Fill in your details below and we'll get back to you.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card fire-border rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(255,107,0,0.04)] rounded-full blur-3xl pointer-events-none" />

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#F0F0F5] mb-2">Application Sent!</h3>
              <p className="text-[#8888AA] text-sm mb-6">
                Your details have been forwarded to WhatsApp. We'll review your application and reach out soon.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-[rgba(255,107,0,0.12)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] text-sm font-semibold hover:bg-[rgba(255,107,0,0.2)] transition-all duration-200"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-[#FF6B00]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className={`w-full px-4 py-3 rounded-xl bg-[#1A1A2E] border text-[#F0F0F5] placeholder-[#4A4A6A] text-sm focus:outline-none focus:ring-1 transition-all duration-200 ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500' :'border-[#2A2A3E] focus:border-[rgba(255,107,0,0.5)] focus:ring-[rgba(255,107,0,0.3)]'
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>

              {/* Age + Phone row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-1.5">
                    Age <span className="text-[#FF6B00]">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    min={16}
                    max={99}
                    className={`w-full px-4 py-3 rounded-xl bg-[#1A1A2E] border text-[#F0F0F5] placeholder-[#4A4A6A] text-sm focus:outline-none focus:ring-1 transition-all duration-200 ${
                      errors.age
                        ? 'border-red-500 focus:ring-red-500' :'border-[#2A2A3E] focus:border-[rgba(255,107,0,0.5)] focus:ring-[rgba(255,107,0,0.3)]'
                    }`}
                  />
                  {errors.age && <p className="mt-1 text-xs text-red-400">{errors.age}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-[#FF6B00]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 0743057846"
                    className={`w-full px-4 py-3 rounded-xl bg-[#1A1A2E] border text-[#F0F0F5] placeholder-[#4A4A6A] text-sm focus:outline-none focus:ring-1 transition-all duration-200 ${
                      errors.phone
                        ? 'border-red-500 focus:ring-red-500' :'border-[#2A2A3E] focus:border-[rgba(255,107,0,0.5)] focus:ring-[rgba(255,107,0,0.3)]'
                    }`}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-[#FF6B00]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john@email.com"
                  className={`w-full px-4 py-3 rounded-xl bg-[#1A1A2E] border text-[#F0F0F5] placeholder-[#4A4A6A] text-sm focus:outline-none focus:ring-1 transition-all duration-200 ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500' :'border-[#2A2A3E] focus:border-[rgba(255,107,0,0.5)] focus:ring-[rgba(255,107,0,0.3)]'
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-[#8888AA] uppercase tracking-wider mb-1.5">
                  Address <span className="text-[#FF6B00]">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your full address..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl bg-[#1A1A2E] border text-[#F0F0F5] placeholder-[#4A4A6A] text-sm focus:outline-none focus:ring-1 transition-all duration-200 resize-none ${
                    errors.address
                      ? 'border-red-500 focus:ring-red-500' :'border-[#2A2A3E] focus:border-[rgba(255,107,0,0.5)] focus:ring-[rgba(255,107,0,0.3)]'
                  }`}
                />
                {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-fire-gradient text-white font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[rgba(255,107,0,0.25)] mt-2"
              >
                Submit Application via WhatsApp →
              </button>

              <p className="text-center text-[#4A4A6A] text-xs">
                Clicking submit will open WhatsApp with your details pre-filled.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
