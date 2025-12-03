import { getTranslations } from '@/lib/translations';
import EventCard from '@/components/EventCard';
import { events } from '@/data/events';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: 'Eventos - Puebla Housing',
    description: 'Únete a nuestros eventos y conoce a otros estudiantes internacionales',
  };
}

export default async function EventsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('events');

  return (
    <div className="py-16 bg-background-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-main mb-4">{t('title')}</h1>
          <p className="text-lg text-text-secondary">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

