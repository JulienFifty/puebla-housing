import { getTranslations, setRequestLocale } from 'next-intl/server';
import ContactForm from '@/components/ContactForm';
import { properties } from '@/data/properties';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: 'Contacto - Puebla Housing',
    description: 'Contáctanos para más información sobre nuestras casas',
  };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('contact');
  const localeKey = locale as 'es' | 'en';

  const whatsappNumber = '522215774552';
  const whatsappMessage = encodeURIComponent('Hola, estoy interesado en reservar una habitación');

  return (
    <div className="py-16 bg-background-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-main mb-4">{t('title')}</h1>
          <p className="text-lg text-text-secondary">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-text-main mb-6">
              {t('sendMessage')}
            </h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* WhatsApp Button */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-text-main mb-6">
                {t('whatsapp')}
              </h2>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-600 transition-colors font-semibold text-center text-lg"
              >
                💬 {t('whatsapp')}
              </a>
              <p className="text-text-secondary text-sm mt-4 text-center">
                {t('whatsappNote')}
              </p>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-text-main mb-4">{t('emailTitle')}</h2>
              <a
                href="mailto:contacto@pueblahousing.com"
                className="text-primary hover:text-primary-hover text-lg"
              >
                contacto@pueblahousing.com
              </a>
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-text-main mb-6">{t('addresses')}</h2>
              <div className="space-y-6">
                {properties.map((property) => (
                  <div key={property.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <h3 className="font-semibold text-text-main mb-2">
                      {property.name[localeKey]}
                    </h3>
                    <p className="text-text-secondary">{property.address}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-text-main mb-4">
                {t('map')}
              </h2>
              <div className="bg-background-gray rounded-lg h-64 flex items-center justify-center">
                <p className="text-text-secondary">
                  {t('mapPlaceholder')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

