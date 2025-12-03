'use client';

import { useTranslations } from '@/lib/translations';
import { useState } from 'react';

interface ContactFormProps {
  type?: 'contact' | 'reservation' | 'property_listing';
  propertyId?: string;
  propertySlug?: string;
  roomId?: string;
}

export default function ContactForm({ 
  type = 'contact', 
  propertyId,
  propertySlug,
  roomId 
}: ContactFormProps = {}) {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          message: formData.message,
          type,
          propertyId: propertyId || undefined,
          propertySlug: propertySlug || undefined,
          roomId: roomId || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar el formulario');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el formulario. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
          {t('name')}
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
          {t('email')}
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
          {t('phone', { defaultValue: 'Teléfono (opcional)' })}
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
          {t('message')}
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={6}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
        />
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {submitted && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t('messageSent', { defaultValue: '¡Mensaje enviado! Te contactaremos pronto.' })}
        </div>
      )}
      <button
        type="submit"
        disabled={loading || submitted}
        className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
      >
        {loading ? t('sending', { defaultValue: 'Enviando...' }) : submitted ? '✓ ' + t('send') + '!' : t('send')}
      </button>
    </form>
  );
}
