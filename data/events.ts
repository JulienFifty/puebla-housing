export interface Event {
  id: string;
  title: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  date: string;
  image: string;
  location: {
    es: string;
    en: string;
  };
}

export const events: Event[] = [
  {
    id: '1',
    title: {
      es: 'Noche de Bienvenida',
      en: 'Welcome Night',
    },
    description: {
      es: 'Únete a nuestra noche de bienvenida para conocer a otros estudiantes internacionales.',
      en: 'Join our welcome night to meet other international students.',
    },
    date: '2024-09-15',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
    location: {
      es: 'Casa Mariachi',
      en: 'Casa Mariachi',
    },
  },
  {
    id: '2',
    title: {
      es: 'Tour Cultural por Puebla',
      en: 'Cultural Tour of Puebla',
    },
    description: {
      es: 'Explora los lugares históricos más importantes de Puebla con otros estudiantes.',
      en: 'Explore the most important historical places in Puebla with other students.',
    },
    date: '2024-09-22',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=600',
    location: {
      es: 'Centro Histórico',
      en: 'Historic Center',
    },
  },
  {
    id: '3',
    title: {
      es: 'Intercambio de Idiomas',
      en: 'Language Exchange',
    },
    description: {
      es: 'Practica español e inglés mientras conoces nuevas culturas.',
      en: 'Practice Spanish and English while learning about new cultures.',
    },
    date: '2024-10-05',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600',
    location: {
      es: 'Casa Centro',
      en: 'Casa Centro',
    },
  },
];

