'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const t = useTranslations();
  const locale = useLocale();

  const values = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: locale === 'es' ? 'Seguridad' : 'Safety',
      description: locale === 'es'
        ? 'Trabajamos únicamente con propiedades verificadas que cumplen con estándares de seguridad y comodidad para estudiantes internacionales.'
        : 'We work exclusively with verified properties that meet safety and comfort standards for international students.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: locale === 'es' ? 'Comunidad' : 'Community',
      description: locale === 'es'
        ? 'Facilitamos la creación de una red de apoyo entre estudiantes internacionales, organizando eventos y actividades para fortalecer los lazos.'
        : 'We facilitate the creation of a support network among international students, organizing events and activities to strengthen bonds.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: locale === 'es' ? 'Soporte 24/7' : '24/7 Support',
      description: locale === 'es'
        ? 'Estamos disponibles en todo momento para ayudarte con cualquier duda o situación durante tu estancia en Puebla.'
        : 'We are available at all times to help you with any questions or situations during your stay in Puebla.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: locale === 'es' ? 'Experiencia Local' : 'Local Experience',
      description: locale === 'es'
        ? 'Conocemos Puebla a fondo y te ayudamos a encontrar el lugar perfecto según tus necesidades y preferencias.'
        : 'We know Puebla thoroughly and help you find the perfect place according to your needs and preferences.',
    },
  ];

  const services = [
    {
      title: locale === 'es' ? 'Asesoría en Búsqueda de Alojamiento' : 'Housing Search Advisory',
      description: locale === 'es'
        ? 'Te ayudamos a encontrar opciones de alojamiento seguras y cómodas que se adapten a tu presupuesto y necesidades.'
        : 'We help you find safe and comfortable housing options that fit your budget and needs.',
      icon: '🏠',
    },
    {
      title: locale === 'es' ? 'Apoyo en tu Llegada' : 'Arrival Support',
      description: locale === 'es'
        ? 'Te recogemos en el terminal de autobuses a tu llegada en Puebla y te acompañamos hasta tu nuevo hogar.'
        : 'We pick you up at the bus terminal upon your arrival in Puebla and accompany you to your new home.',
      icon: '✈️',
    },
    {
      title: locale === 'es' ? 'Integración Cultural' : 'Cultural Integration',
      description: locale === 'es'
        ? 'Organizamos eventos, excursiones y actividades que te permiten conocer la cultura mexicana y conectar con otros estudiantes.'
        : 'We organize events, excursions and activities that allow you to learn about Mexican culture and connect with other students.',
      icon: '🌮',
    },
    {
      title: locale === 'es' ? 'Red de Estudiantes' : 'Student Network',
      description: locale === 'es'
        ? 'Conectamos a estudiantes internacionales entre sí, creando una comunidad de apoyo mutuo durante su estancia en Puebla.'
        : 'We connect international students with each other, creating a community of mutual support during their stay in Puebla.',
      icon: '🤝',
    },
  ];

  const stats = [
    { number: '500+', label: locale === 'es' ? 'Estudiantes ayudados' : 'Students helped' },
    { number: '20+', label: locale === 'es' ? 'Países representados' : 'Countries represented' },
    { number: '4.9', label: locale === 'es' ? 'Calificación promedio' : 'Average rating' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80"
            alt="Students in Puebla"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-6 border border-white/20 text-white">
            {locale === 'es' ? 'Nuestra historia' : 'Our story'}
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {locale === 'es' ? (
              <>
                Tu aliado en<br />
                <span className="text-secondary">Puebla</span>
              </>
            ) : (
              <>
                Your ally in<br />
                <span className="text-secondary">Puebla</span>
              </>
            )}
          </h1>
          
          <p className="text-lg text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            {locale === 'es'
              ? 'Somos una organización dedicada a facilitar la llegada y estancia de estudiantes internacionales en Puebla. Nuestro objetivo es ayudarte a encontrar un lugar seguro y cómodo, y construir una comunidad que te acompañe durante toda tu experiencia.'
              : 'We are an organization dedicated to facilitating the arrival and stay of international students in Puebla. Our goal is to help you find a safe and comfortable place, and build a community that accompanies you throughout your experience.'}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                {locale === 'es' ? 'Nuestra misión' : 'Our mission'}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {locale === 'es'
                  ? 'Ayudar a estudiantes internacionales a encontrar su hogar en Puebla'
                  : 'Helping international students find their home in Puebla'}
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {locale === 'es'
                  ? 'En Puebla Housing, entendemos los desafíos que enfrentan los estudiantes internacionales al llegar a una nueva ciudad. Por eso, nos dedicamos a facilitar su llegada y ayudarles a encontrar alojamiento seguro y cómodo que se adapte a sus necesidades.'
                  : 'At Puebla Housing, we understand the challenges international students face when arriving in a new city. That\'s why we are dedicated to facilitating their arrival and helping them find safe and comfortable accommodation that fits their needs.'}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {locale === 'es'
                  ? 'Somos facilitadores organizando y conectando a estudiantes con locaciones verificadas y creando una gran comunidad.'
                  : 'We are facilitators organizing and connecting students with verified locations and creating a great community.'}
              </p>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                  alt="Students community"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              {locale === 'es' ? 'Nuestros valores' : 'Our values'}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {locale === 'es' ? 'Lo que nos guía' : 'What guides us'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === 'es'
                ? 'Los principios que rigen nuestro trabajo y compromiso con los estudiantes.'
                : 'The principles that guide our work and commitment to students.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-8 border border-gray-100 hover:border-gray-200 transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-secondary/20 text-amber-700 rounded-full text-sm font-semibold mb-4">
              {locale === 'es' ? 'Cómo te ayudamos' : 'How we help you'}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {locale === 'es' ? 'Nuestros servicios' : 'Our services'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === 'es'
                ? 'Todo lo que hacemos está enfocado en facilitar tu experiencia como estudiante internacional en Puebla.'
                : 'Everything we do is focused on facilitating your experience as an international student in Puebla.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-8 border border-gray-100 hover:border-gray-200 transition-all"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-purple-700 to-indigo-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/10 text-white rounded-full text-sm font-semibold mb-6">
                {locale === 'es' ? 'Nuestra comunidad' : 'Our community'}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {locale === 'es'
                  ? 'Más que alojamiento, una comunidad'
                  : 'More than accommodation, a community'}
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                {locale === 'es'
                  ? 'Creemos que la experiencia de estudiar en el extranjero va más allá de encontrar un lugar donde vivir. Por eso, organizamos eventos, excursiones y actividades que te permiten conocer a otros estudiantes internacionales y crear amistades duraderas.'
                  : 'We believe that the experience of studying abroad goes beyond finding a place to live. That\'s why we organize events, excursions and activities that allow you to meet other international students and create lasting friendships.'}
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                {locale === 'es'
                  ? 'Nuestra red de estudiantes te conecta con personas de todo el mundo que están pasando por la misma experiencia que tú, creando un sistema de apoyo mutuo durante tu estancia en Puebla.'
                  : 'Our student network connects you with people from all over the world who are going through the same experience as you, creating a mutual support system during your stay in Puebla.'}
              </p>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                  alt="Student community"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {locale === 'es' ? '¿Listo para comenzar tu aventura en Puebla?' : 'Ready to start your adventure in Puebla?'}
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            {locale === 'es'
              ? 'Estamos aquí para ayudarte en cada paso del camino. Contáctanos y descubre cómo podemos facilitar tu llegada a Puebla.'
              : 'We are here to help you every step of the way. Contact us and discover how we can facilitate your arrival in Puebla.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contacto`}
              className="bg-primary text-white px-8 py-3.5 rounded-lg hover:bg-primary-hover transition-all font-semibold shadow-sm hover:shadow-md"
            >
              {locale === 'es' ? 'Contáctanos' : 'Contact us'}
            </Link>
            <Link
              href={`/${locale}/casas`}
              className="bg-white text-primary px-8 py-3.5 rounded-lg hover:bg-gray-50 transition-all font-semibold border-2 border-primary shadow-sm hover:shadow-md"
            >
              {locale === 'es' ? 'Ver propiedades' : 'View properties'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

