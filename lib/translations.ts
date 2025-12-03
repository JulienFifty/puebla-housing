// Traducciones en español - reemplazo de next-intl
import messages from '@/messages/es.json';

type NestedMessages = {
  [key: string]: string | NestedMessages;
};

function getNestedValue(obj: NestedMessages, path: string): string {
  const keys = path.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // Return the path if not found
    }
  }
  
  return typeof current === 'string' ? current : path;
}

// Server-side translation function
export function getTranslations(namespace?: string) {
  const ns = namespace ? (messages as any)[namespace] || {} : messages;
  
  return (key: string, params?: Record<string, string | number>) => {
    let text = namespace ? getNestedValue(ns, key) : getNestedValue(messages as NestedMessages, key);
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    
    return text;
  };
}

// Client-side hook (same implementation for simplicity)
export function useTranslations(namespace?: string) {
  return getTranslations(namespace);
}

// Locale hook - always returns 'es'
export function useLocale() {
  return 'es';
}

