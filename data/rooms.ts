export interface Room {
  id: string;
  propertyId: string;
  propertyName: {
    es: string;
    en: string;
  };
  roomNumber: string;
  type: 'private' | 'shared';
  bathroomType: 'private' | 'shared';
  description: {
    es: string;
    en: string;
  };
  images: string[];
  available: boolean;
  semester: 'enero-junio-2026' | 'junio-diciembre-2026' | null;
  amenities: string[];
}

export const rooms: Room[] = [
  {
    id: 'mariachi-1',
    propertyId: 'mariachi',
    propertyName: {
      es: 'Casa Mariachi',
      en: 'Casa Mariachi',
    },
    roomNumber: '101',
    type: 'private',
    bathroomType: 'private',
    description: {
      es: 'Habitación privada con baño privado, amplia y luminosa.',
      en: 'Private room with private bathroom, spacious and bright.',
    },
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    available: true,
    semester: 'enero-junio-2026',
    amenities: ['WiFi', 'Escritorio', 'Closet'],
  },
  {
    id: 'mariachi-2',
    propertyId: 'mariachi',
    propertyName: {
      es: 'Casa Mariachi',
      en: 'Casa Mariachi',
    },
    roomNumber: '102',
    type: 'shared',
    bathroomType: 'shared',
    description: {
      es: 'Habitación compartida ideal para hacer amigos.',
      en: 'Shared room ideal for making friends.',
    },
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    available: true,
    semester: 'junio-diciembre-2026',
    amenities: ['WiFi', 'Escritorio'],
  },
  {
    id: 'centro-1',
    propertyId: 'centro',
    propertyName: {
      es: 'Casa Centro',
      en: 'Casa Centro',
    },
    roomNumber: '201',
    type: 'private',
    bathroomType: 'shared',
    description: {
      es: 'Habitación privada en el corazón del centro histórico.',
      en: 'Private room in the heart of the historic center.',
    },
    images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'],
    available: true,
    semester: 'enero-junio-2026',
    amenities: ['WiFi', 'Escritorio', 'Vista'],
  },
  {
    id: 'centro-2',
    propertyId: 'centro',
    propertyName: {
      es: 'Casa Centro',
      en: 'Casa Centro',
    },
    roomNumber: '202',
    type: 'shared',
    bathroomType: 'private',
    description: {
      es: 'Habitación compartida con baño privado.',
      en: 'Shared room with private bathroom.',
    },
    images: ['https://images.unsplash.com/photo-1560448075-cbc16ba4a9fa?w=800'],
    available: true,
    semester: 'junio-diciembre-2026',
    amenities: ['WiFi', 'Baño privado'],
  },
  {
    id: 'piramide-1',
    propertyId: 'piramide',
    propertyName: {
      es: 'Casa Pirámide',
      en: 'Casa Pirámide',
    },
    roomNumber: '301',
    type: 'private',
    bathroomType: 'private',
    description: {
      es: 'Habitación tranquila perfecta para estudiar.',
      en: 'Quiet room perfect for studying.',
    },
    images: ['https://images.unsplash.com/photo-1560449752-91594c2a0b0e?w=800'],
    available: true,
    semester: 'enero-junio-2026',
    amenities: ['WiFi', 'Escritorio', 'Silenciosa'],
  },
];

export const getRoomsByProperty = (propertyId: string): Room[] => {
  return rooms.filter((room) => room.propertyId === propertyId);
};

export const getRoomsBySemester = (semester: string): Room[] => {
  return rooms.filter((room) => room.semester === semester);
};

