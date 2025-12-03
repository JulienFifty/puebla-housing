import { getTranslations, setRequestLocale } from 'next-intl/server';
import ContactForm from '@/components/ContactForm';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: 'Listar Propiedad - Puebla Housing',
    description: 'Únete a nuestra red de alojamientos para estudiantes internacionales',
  };
}

export default async function ListPropertyPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('listProperty');
  const tContact = await getTranslations('contact');

  return (
    <div className="py-16 bg-background-gray min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-main mb-4">{t('title')}</h1>
          <p className="text-xl text-text-secondary mb-6">{t('subtitle')}</p>
          <p className="text-text-secondary max-w-2xl mx-auto">{t('description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-text-main mb-6">
              {tContact('title')}
            </h2>
            <ContactForm />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-text-main mb-6">
              {t('benefits.title', { defaultValue: 'Beneficios' })}
            </h2>
            <ul className="space-y-4 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-text-main mb-1">
                    {t('benefits.visibility', { defaultValue: 'Mayor visibilidad' })}
                  </h3>
                  <p>
                    {t('benefits.visibilityDesc', {
                      defaultValue: 'Tu propiedad será vista por estudiantes internacionales de todo el mundo.',
                    })}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-text-main mb-1">
                    {t('benefits.support', { defaultValue: 'Soporte completo' })}
                  </h3>
                  <p>
                    {t('benefits.supportDesc', {
                      defaultValue: 'Te ayudamos con el proceso de alquiler y gestión.',
                    })}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <div>
                  <h3 className="font-semibold text-text-main mb-1">
                    {t('benefits.community', { defaultValue: 'Comunidad establecida' })}
                  </h3>
                  <p>
                    {t('benefits.communityDesc', {
                      defaultValue: 'Únete a una red de propietarios confiables.',
                    })}
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 relative h-64 rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
                alt="List your property"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

