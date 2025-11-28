'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function LocaleHtml({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const locale = params?.locale as string || 'es';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return <>{children}</>;
}




