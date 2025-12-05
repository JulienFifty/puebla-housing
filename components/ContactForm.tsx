'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import CustomSelect from './CustomSelect';

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
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    instagram: '',
    career: '',
    country: '',
    university: '',
    house: '',
    room: '',
    arrivingDate: '',
    departureDate: '',
    howDidYouHear: '',
    message: '',
  });
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch properties for house dropdown
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        const data = await response.json();
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  // Country options
  const countryOptions = [
    { value: '', label: t('selectPlaceholder') },
    { value: 'france', label: '🇫🇷 Francia' },
    { value: 'italy', label: '🇮🇹 Italia' },
    { value: 'spain', label: '🇪🇸 España' },
    { value: 'germany', label: '🇩🇪 Alemania' },
    { value: 'brazil', label: '🇧🇷 Brasil' },
    { value: 'colombia', label: '🇨🇴 Colombia' },
    { value: 'argentina', label: '🇦🇷 Argentina' },
    { value: 'chile', label: '🇨🇱 Chile' },
    { value: 'peru', label: '🇵🇪 Perú' },
    { value: 'usa', label: '🇺🇸 Estados Unidos' },
    { value: 'canada', label: '🇨🇦 Canadá' },
    { value: 'uk', label: '🇬🇧 Reino Unido' },
    { value: 'other', label: 'Otro' },
  ];

  // University options
  const universityOptions = [
    { value: '', label: t('selectPlaceholder') },
    { value: 'BUAP', label: 'BUAP' },
    { value: 'UDLAP', label: 'UDLAP' },
    { value: 'IBERO', label: 'IBERO' },
    { value: 'UPAEP', label: 'UPAEP' },
    { value: 'Centro', label: 'Centro' },
    { value: 'other', label: 'Otra' },
  ];

  // House options
  const houseOptions = [
    { value: '', label: t('selectPlaceholder') },
    ...properties.map((prop) => ({
      value: prop.id,
      label: locale === 'es' ? prop.name_es : prop.name_en || prop.name_es,
    })),
  ];

  // How did you hear about us options
  const howDidYouHearOptions = [
    { value: '', label: t('selectPlaceholder') },
    { value: 'instagram', label: t('howDidYouHearOptions.instagram', { defaultValue: 'Instagram' }) },
    { value: 'facebook', label: t('howDidYouHearOptions.facebook', { defaultValue: 'Facebook' }) },
    { value: 'friend', label: t('howDidYouHearOptions.friend', { defaultValue: 'Amigo/Conocido' }) },
    { value: 'university', label: t('howDidYouHearOptions.university', { defaultValue: 'Universidad' }) },
    { value: 'google', label: t('howDidYouHearOptions.google', { defaultValue: 'Google' }) },
    { value: 'other', label: t('howDidYouHearOptions.other', { defaultValue: 'Otro' }) },
  ];

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
          instagram: formData.instagram || undefined,
          career: formData.career || undefined,
          country: formData.country || undefined,
          university: formData.university || undefined,
          house: formData.house || undefined,
          room: formData.room || undefined,
          arrivingDate: formData.arrivingDate || undefined,
          departureDate: formData.departureDate || undefined,
          howDidYouHear: formData.howDidYouHear || undefined,
          message: formData.message,
          type,
          propertyId: propertyId || formData.house || undefined,
          propertySlug: propertySlug || undefined,
          roomId: roomId || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar el formulario');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        instagram: '',
        career: '',
        country: '',
        university: '',
        house: '',
        room: '',
        arrivingDate: '',
        departureDate: '',
        howDidYouHear: '',
        message: '',
      });
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
      {/* Row 1: Full name and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('name')} <span className="text-red-500">{t('required')}</span>
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
            {t('email')} <span className="text-red-500">{t('required')}</span>
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
      </div>

      {/* Row 2: Instagram and Career */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="instagram" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('instagram')}
          </label>
          <input
            type="text"
            id="instagram"
            value={formData.instagram}
            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          />
        </div>
        <div>
          <label htmlFor="career" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('career')}
          </label>
          <input
            type="text"
            id="career"
            value={formData.career}
            onChange={(e) => setFormData({ ...formData, career: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          />
        </div>
      </div>

      {/* Row 3: Country and University */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('country')}
          </label>
          <CustomSelect
            value={formData.country}
            onChange={(value) => setFormData({ ...formData, country: value })}
            placeholder={t('selectPlaceholder')}
            options={countryOptions}
          />
        </div>
        <div>
          <label htmlFor="university" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('university')} <span className="text-red-500">{t('required')}</span>
          </label>
          <CustomSelect
            value={formData.university}
            onChange={(value) => setFormData({ ...formData, university: value })}
            placeholder={t('selectPlaceholder')}
            options={universityOptions}
            required
          />
        </div>
      </div>

      {/* Row 4: House and Room */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="house" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('house')} <span className="text-red-500">{t('required')}</span>
          </label>
          <CustomSelect
            value={formData.house}
            onChange={(value) => setFormData({ ...formData, house: value })}
            placeholder={t('selectPlaceholder')}
            options={houseOptions}
            required
          />
        </div>
        <div>
          <label htmlFor="room" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('room')}
          </label>
          <input
            type="text"
            id="room"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          />
        </div>
      </div>

      {/* Row 5: Arriving Date and Departure Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="arrivingDate" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('arrivingDate')}
          </label>
          <input
            type="date"
            id="arrivingDate"
            value={formData.arrivingDate}
            onChange={(e) => setFormData({ ...formData, arrivingDate: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          />
        </div>
        <div>
          <label htmlFor="departureDate" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('departureDate')}
          </label>
          <input
            type="date"
            id="departureDate"
            value={formData.departureDate}
            onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          />
        </div>
      </div>

      {/* Row 6: How did you hear about us */}
      <div>
        <label htmlFor="howDidYouHear" className="block text-sm font-semibold text-gray-700 mb-2">
          {t('howDidYouHear')}
        </label>
        <CustomSelect
          value={formData.howDidYouHear}
          onChange={(value) => setFormData({ ...formData, howDidYouHear: value })}
          placeholder={t('selectPlaceholder')}
          options={howDidYouHearOptions}
        />
      </div>

      {/* Row 7: Message */}
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
          {t('messageSent')}
        </div>
      )}
      <button
        type="submit"
        disabled={loading || submitted}
        className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
      >
        {loading ? t('sending') : submitted ? '✓ ' + t('send') + '!' : t('send')}
      </button>
    </form>
  );
}
