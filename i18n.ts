import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales } from './i18n-config';

// Importar mensajes directamente (evita __dirname en Edge Runtime)
import esMessages from './messages/es.json';
import enMessages from './messages/en.json';

const messages = {
  es: esMessages,
  en: enMessages,
};

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: messages[locale as keyof typeof messages],
  };
});

