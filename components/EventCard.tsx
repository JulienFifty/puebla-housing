'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Event } from '@/data/events';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const t = useTranslations('events');
  const locale = useLocale() as 'es' | 'en';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title[locale]}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-2 font-medium">
          {new Date(event.date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {event.title[locale]}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
          {event.description[locale]}
        </p>
        <div className="flex items-center gap-2 text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{event.location[locale]}</span>
        </div>
      </div>
    </div>
  );
}
