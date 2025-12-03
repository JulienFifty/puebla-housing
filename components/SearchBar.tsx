'use client';

import { useTranslations, useLocale } from '@/lib/translations';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from './CustomSelect';

export default function SearchBar() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const router = useRouter();
  const [filters, setFilters] = useState({
    zone: '',
    university: '',
    roomType: '',
    bathroomType: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.zone) params.append('zone', filters.zone);
    if (filters.university) params.append('university', filters.university);
    if (filters.roomType) params.append('roomType', filters.roomType);
    if (filters.bathroomType) params.append('bathroomType', filters.bathroomType);
    
    router.push(`/${locale}/casas?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4"
    >
      <CustomSelect
        label={t('zone')}
        value={filters.zone}
        onChange={(value) => setFilters({ ...filters, zone: value })}
        placeholder={t('allZones')}
        options={[
          { value: '', label: t('allZones') },
          { value: 'tres-cruces', label: 'Tres Cruces' },
          { value: 'centro', label: 'Centro Histórico' },
          { value: 'cholula', label: 'Cholula' },
        ]}
      />

      <CustomSelect
        label={t('university')}
        value={filters.university}
        onChange={(value) => setFilters({ ...filters, university: value })}
        placeholder={t('allUniversities')}
        options={[
          { value: '', label: t('allUniversities') },
          { value: 'BUAP', label: 'BUAP' },
          { value: 'Centro', label: 'Centro' },
          { value: 'UDLAP', label: 'UDLAP' },
        ]}
      />

      <CustomSelect
        label={t('roomType')}
        value={filters.roomType}
        onChange={(value) => setFilters({ ...filters, roomType: value })}
        placeholder={t('allRoomTypes')}
        options={[
          { value: '', label: t('allRoomTypes') },
          { value: 'private', label: t('private') },
          { value: 'shared', label: t('shared') },
        ]}
      />

      <CustomSelect
        label={t('bathroomType')}
        value={filters.bathroomType}
        onChange={(value) => setFilters({ ...filters, bathroomType: value })}
        placeholder={t('allBathroomTypes')}
        options={[
          { value: '', label: t('allBathroomTypes') },
          { value: 'private', label: t('private') },
          { value: 'shared', label: t('shared') },
        ]}
      />

      <div className="md:col-span-4 flex justify-center mt-4">
        <button
          type="submit"
          className="bg-secondary text-text-main px-8 py-2.5 rounded-lg hover:bg-secondary/90 transition-colors font-normal text-base w-full md:w-auto flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {t('search')}
        </button>
      </div>
    </form>
  );
}

