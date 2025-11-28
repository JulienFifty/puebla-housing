export interface Testimonial {
  id: string;
  name: string;
  country: string;
  image: string;
  text: {
    es: string;
    en: string;
  };
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    country: 'Estados Unidos',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    text: {
      es: 'Mi experiencia en Casa Mariachi fue increíble. El ambiente internacional me ayudó a adaptarme rápidamente a Puebla.',
      en: 'My experience at Casa Mariachi was incredible. The international atmosphere helped me adapt quickly to Puebla.',
    },
  },
  {
    id: '2',
    name: 'Lucas Müller',
    country: 'Alemania',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    text: {
      es: 'Casa Centro es perfecta si te gusta estar en el corazón de la ciudad. Todo está cerca y la comunidad es muy acogedora.',
      en: 'Casa Centro is perfect if you like being in the heart of the city. Everything is close and the community is very welcoming.',
    },
  },
  {
    id: '3',
    name: 'Emma Chen',
    country: 'China',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    text: {
      es: 'Casa Pirámide es tranquila y perfecta para estudiar. La ubicación cerca de UDLAP es ideal.',
      en: 'Casa Pirámide is quiet and perfect for studying. The location near UDLAP is ideal.',
    },
  },
  {
    id: '4',
    name: 'Marco Rossi',
    country: 'Italia',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    text: {
      es: 'La mejor decisión que tomé fue elegir Puebla Housing. El apoyo y la comunidad son excepcionales.',
      en: 'The best decision I made was choosing Puebla Housing. The support and community are exceptional.',
    },
  },
];

