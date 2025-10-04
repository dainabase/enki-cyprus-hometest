'use client';

import React, { useState } from 'react';
import { formatPrice } from '@/lib/utils/formatters';

interface ContactFormProps {
  project: any;
}

export default function ContactForm({ project }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const price = project.price_from_new || project.price_from || project.price;
  const city = project.location?.city || project.location?.address || 'Cyprus';

  if (isSubmitted) {
    return (
      <section id="contact-form" className="bg-black py-32 lg:py-48">
        <div className="max-w-[600px] mx-auto px-6 text-center text-white">
          <h3 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
            Thank You
          </h3>
          <p className="text-lg text-white/60 font-light mb-12">
            We'll be in touch soon.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
              });
            }}
            className="px-8 py-3 bg-white text-black text-sm uppercase tracking-wider font-medium hover:bg-white/90 transition-all duration-300"
          >
            Send Another
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact-form" className="bg-black py-32 lg:py-48">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-32">
          {/* Left: Form */}
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-12 tracking-tight">
              Get in Touch
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-all duration-300 font-light text-lg"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-all duration-300 font-light text-lg"
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-all duration-300 font-light text-lg"
                />
              </div>

              <div>
                <textarea
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-all duration-300 font-light text-lg resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-4 bg-white text-black text-sm tracking-wider uppercase font-medium hover:bg-white/90 transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          </div>

          {/* Right: Project Info */}
          <div className="space-y-12 text-white lg:pt-32">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/40 mb-2 font-medium">
                Property
              </p>
              <p className="text-xl font-light">{project.title}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-white/40 mb-2 font-medium">
                Location
              </p>
              <p className="text-xl font-light">{city}</p>
            </div>

            {price && (
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40 mb-2 font-medium">
                  Price From
                </p>
                <p className="text-xl font-light">{formatPrice(price)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
