export interface Property {
  id: string;
  name: {
    es: string;
    en: string;
  };
  slug: string;
  location: {
    es: string;
    en: string;
  };
  address: string;
  rooms: number;
  bathroomTypes: ('private' | 'shared')[];
  roomTypes?: ('private' | 'shared')[]; // Tipos de habitaciones disponibles
  description: {
    es: string;
    en: string;
  };
  zone: 'tres-cruces' | 'centro' | 'cholula';
  university: 'BUAP' | 'Centro' | 'UDLAP';
  images: string[];
  available: boolean;
}

export const properties: Property[] = [
  {
    id: 'mariachi',
    name: {
      es: 'Casa Mariachi',
      en: 'Casa Mariachi',
    },
    slug: 'mariachi',
    location: {
      es: 'Tres Cruces, Puebla',
      en: 'Tres Cruces, Puebla',
    },
    address: 'Fray Andrés de Olmos 2621, Tres Cruces, Puebla',
    rooms: 14,
    bathroomTypes: ['private', 'shared'],
    description: {
      es: 'Ambiente social e internacional. Perfecta para estudiantes que buscan una experiencia comunitaria vibrante cerca de BUAP.',
      en: 'Social and international atmosphere. Perfect for students looking for a vibrant community experience near BUAP.',
    },
    zone: 'tres-cruces',
    university: 'BUAP',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    available: true,
  },
  {
    id: 'centro',
    name: {
      es: 'Casa Centro',
      en: 'Casa Centro',
    },
    slug: 'centro',
    location: {
      es: 'Centro Histórico, Puebla',
      en: 'Historic Center, Puebla',
    },
    address: 'Av 5 Pte 326, Centro Histórico, Puebla',
    rooms: 20,
    bathroomTypes: ['private', 'shared'],
    description: {
      es: 'Vida cultural, museos, excelente movilidad y actividades. Ideal para estudiantes que aman la cultura y la historia.',
      en: 'Cultural life, museums, excellent mobility and activities. Ideal for students who love culture and history.',
    },
    zone: 'centro',
    university: 'Centro',
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
      'https://images.unsplash.com/photo-1560448075-cbc16ba4a9fa?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    ],
    available: true,
  },
  {
    id: 'piramide',
    name: {
      es: 'Casa Pirámide',
      en: 'Casa Pirámide',
    },
    slug: 'piramide',
    location: {
      es: 'San Andrés Cholula, Puebla',
      en: 'San Andrés Cholula, Puebla',
    },
    address: 'San Andrés Cholula, cerca UDLAP',
    rooms: 6,
    bathroomTypes: ['private', 'shared'],
    description: {
      es: 'Ambiente tranquilo y multicultural. Perfecta para estudiantes que buscan un espacio sereno cerca de UDLAP.',
      en: 'Quiet and multicultural atmosphere. Perfect for students looking for a serene space near UDLAP.',
    },
    zone: 'cholula',
    university: 'UDLAP',
    images: [
      'https://images.unsplash.com/photo-1560449752-91594c2a0b0e?w=800',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1560448204-61dc36dc5dde?w=800',
    ],
    available: true,
  },
];

export const getPropertyBySlug = (slug: string): Property | undefined => {
  return properties.find((p) => p.slug === slug);
};

