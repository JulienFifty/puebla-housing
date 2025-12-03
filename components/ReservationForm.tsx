'use client';

import { useTranslations } from '@/lib/translations';
import { useState } from 'react';
import ContactForm from './ContactForm';

interface ReservationFormProps {
  propertyId: string;
  propertyName: string;
  roomId?: string;
  roomNumber?: string;
}

export default function ReservationForm({
  propertyId,
  propertyName,
  roomId,
  roomNumber,
}: ReservationFormProps) {
  const t = useTranslations('contact');
  const [showForm, setShowForm] = useState(false);

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold text-center shadow-sm hover:shadow-md"
      >
        {t('reserveRoom', { defaultValue: 'Reservar Habitación' })}
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800 font-medium">
          <strong>{propertyName}</strong>
          {roomNumber && ` - Habitación #${roomNumber}`}
        </p>
      </div>
      <ContactForm
        type="reservation"
        propertyId={propertyId}
        roomId={roomId}
      />
      <button
        onClick={() => setShowForm(false)}
        className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
      >
        Cancelar
      </button>
    </div>
  );
}
