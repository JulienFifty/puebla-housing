import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n-config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocaleHtml from '@/components/LocaleHtml';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Habilitar renderizado estático
  setRequestLocale(locale);
  
  const messages = await getMessages();

  return (
    <LocaleHtml>
      <NextIntlClientProvider messages={messages}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </LocaleHtml>
  );
}

