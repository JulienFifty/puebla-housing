'use client';

import { useLocale } from '@/lib/translations';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n-config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            locale === loc
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:text-primary hover:bg-background-gray'
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

