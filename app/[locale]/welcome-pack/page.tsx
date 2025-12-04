'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function WelcomePackPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const packIncludes = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      title: locale === 'es' ? 'Servicios Incluidos' : 'Included Services',
      description: locale === 'es' 
        ? 'Servicio de recogida (pick-up) en el terminal de autobuses, ropa de cama completa y servicio de limpieza regular.'
        : 'Pick-up service at the bus terminal, complete bedding and regular cleaning service.',
      color: 'from-primary to-purple-700',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
        </svg>
      ),
      title: locale === 'es' ? 'Experiencia Gastronómica' : 'Gastronomic Experience',
      description: locale === 'es'
        ? 'Tour culinario por los mejores restaurantes de Puebla. Degusta mole poblano, chiles en nogada, cemitas y más delicias de la gastronomía local.'
        : 'Culinary tour through the best restaurants in Puebla. Taste mole poblano, chiles en nogada, cemitas and more local delicacies.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      title: locale === 'es' ? 'Comodidad Total' : 'Total Comfort',
      description: locale === 'es'
        ? 'Ropa de cama de calidad incluida y servicio de limpieza regular. Todo listo para que te sientas como en casa desde el primer día.'
        : 'Quality bedding included and regular cleaning service. Everything ready for you to feel at home from day one.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
      title: locale === 'es' ? 'Descuentos Exclusivos' : 'FiftyFifty Card',
      description: locale === 'es'
        ? 'Tarjeta FiftyFifty Card con 50% de descuento en los mejores restaurantes de CDMX y Puebla.'
        : 'FiftyFifty Card with 50% discount at the best restaurants in CDMX and Puebla.',
      color: 'from-blue-500 to-indigo-600',
      link: 'https://www.fiftyfiftycard.mx/',
    },
  ];

  const journeySteps = [
    {
      step: '01',
      title: locale === 'es' ? 'Recogida en el Aeropuerto' : 'Airport Pickup',
      description: locale === 'es'
        ? 'Te recogemos en el aeropuerto de Puebla o CDMX con un servicio de transporte privado y cómodo.'
        : 'We pick you up at Puebla or CDMX airport with a private and comfortable transportation service.',
      icon: '✈️',
    },
    {
      step: '02',
      title: locale === 'es' ? 'Check-in en tu Casa' : 'Check-in at Your Home',
      description: locale === 'es'
        ? 'Te acompañamos a tu nuevo hogar, te presentamos a tus roommates y te damos el tour de la casa.'
        : 'We accompany you to your new home, introduce you to your roommates and give you a house tour.',
      icon: '🏠',
    },
    {
      step: '03',
      title: locale === 'es' ? 'Orientación Cultural' : 'Cultural Orientation',
      description: locale === 'es'
        ? 'Sesión de orientación sobre la vida en Puebla, transporte, seguridad y tips para estudiantes internacionales.'
        : 'Orientation session about life in Puebla, transportation, safety and tips for international students.',
      icon: '📚',
    },
    {
      step: '04',
      title: locale === 'es' ? 'Integración Social' : 'Social Integration',
      description: locale === 'es'
        ? 'Evento de bienvenida con otros estudiantes internacionales. ¡Conoce a tu nueva comunidad!'
        : 'Welcome event with other international students. Meet your new community!',
      icon: '🎉',
    },
  ];

  const testimonials = [
    {
      name: 'María López',
      university: 'UDLAP',
      country: '🇫🇷 Francia',
      quote: locale === 'es'
        ? 'El Welcome Pack hizo que mi llegada a México fuera increíblemente fácil. Desde que aterricé, me sentí acompañada y bienvenida. ¡Las excursiones son lo mejor!'
        : 'The Welcome Pack made my arrival in Mexico incredibly easy. From the moment I landed, I felt accompanied and welcome. The excursions are the best!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      name: 'Thomas Weber',
      university: 'BUAP',
      country: '🇩🇪 Alemania',
      quote: locale === 'es'
        ? 'Llegué sin conocer a nadie y gracias al Welcome Pack, en menos de una semana ya tenía un grupo de amigos de todo el mundo. La experiencia gastronómica es imperdible.'
        : 'I arrived without knowing anyone and thanks to the Welcome Pack, in less than a week I already had a group of friends from all over the world. The gastronomic experience is a must.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      name: 'Sophie Chen',
      university: 'IBERO',
      country: '🇨🇳 China',
      quote: locale === 'es'
        ? 'La tarjeta de descuentos me ha ahorrado mucho dinero. Y las clases de salsa son super divertidas. Recomiendo 100% el Welcome Pack.'
        : 'The discount card has saved me a lot of money. And the salsa classes are super fun. I 100% recommend the Welcome Pack.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1920"
            alt="Puebla cityscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/20">
            <span className="text-sm">🇲🇽</span>
            <span className="text-white text-xs font-light tracking-wide uppercase">Mexican Welcome Pack</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {locale === 'es' ? (
              <>
                Bienvenido a tu<br />
                <span className="text-secondary">
                  nueva aventura
                </span>
              </>
            ) : (
              <>
                Welcome to your<br />
                <span className="text-secondary">
                  new adventure
                </span>
              </>
            )}
          </h1>
          
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            {locale === 'es'
              ? 'Descubre Puebla desde el primer día. Con nuestro Welcome Pack, tu llegada será inolvidable y llena de experiencias únicas.'
              : 'Discover Puebla from day one. With our Welcome Pack, your arrival will be unforgettable and full of unique experiences.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contacto`}
              className="bg-primary text-white px-8 py-3.5 rounded-lg hover:bg-primary-hover transition-all font-semibold shadow-sm hover:shadow-md"
            >
              {locale === 'es' ? 'Reservar mi Pack' : 'Book my Pack'}
            </Link>
            <a
              href="#que-incluye"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-lg hover:bg-white/20 transition-all font-semibold border border-white/30"
            >
              {locale === 'es' ? 'Ver contenido' : 'See contents'}
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white">500+</div>
              <div className="text-white/70 text-sm mt-1">{locale === 'es' ? 'Estudiantes felices' : 'Happy students'}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white">20+</div>
              <div className="text-white/70 text-sm mt-1">{locale === 'es' ? 'Países representados' : 'Countries represented'}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white">4.9</div>
              <div className="text-white/70 text-sm mt-1">{locale === 'es' ? 'Calificación promedio' : 'Average rating'}</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* What's Included Section */}
      <section id="que-incluye" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              {locale === 'es' ? 'Todo incluido' : 'All inclusive'}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {locale === 'es' ? '¿Qué incluye el Welcome Pack?' : "What's in the Welcome Pack?"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === 'es'
                ? 'Todo lo que necesitas para empezar tu aventura en México con el pie derecho.'
                : 'Everything you need to start your adventure in Mexico on the right foot.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packIncludes.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-lg p-6 border border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${item.color}`}></div>
                
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} text-white mb-4`}>
                  <div className="w-5 h-5">
                    {item.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                {(item as any).link && (
                  <a 
                    href={(item as any).link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    {locale === 'es' ? 'Más información' : 'Learn more'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-purple-700 to-indigo-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-white/10 text-white rounded-full text-sm font-semibold mb-6">
                {locale === 'es' ? 'Nuestra misión' : 'Our mission'}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {locale === 'es'
                  ? 'Tu llegada a Puebla, nuestra misión: hacerla inolvidable'
                  : 'Your arrival in Puebla, our mission: make it unforgettable'}
              </h2>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                {locale === 'es'
                  ? 'En Puebla Housing nos dedicamos a facilitar la integración de estudiantes internacionales. Nuestro objetivo es crear experiencias únicas que conecten a los recién llegados con la cultura local desde el primer día.'
                  : 'At Puebla Housing we are dedicated to facilitating the integration of international students. Our goal is to create unique experiences that connect newcomers with the local culture from day one.'}
              </p>
              
              <div className="space-y-4">
                {[
                  locale === 'es' ? 'Acompañamiento personalizado' : 'Personalized support',
                  locale === 'es' ? 'Eventos de integración semanales' : 'Weekly integration events',
                  locale === 'es' ? 'Red de más de 500 estudiantes' : 'Network of 500+ students',
                  locale === 'es' ? 'Soporte 24/7 en español e inglés' : '24/7 support in Spanish & English',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800"
                  alt="Students together"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              {locale === 'es' ? 'Tu viaje' : 'Your journey'}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {locale === 'es' ? 'Del aeropuerto a nuevas amistades' : 'From airport to new friendships'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === 'es'
                ? 'Un proceso simple y acompañado para que tu llegada sea perfecta.'
                : 'A simple and accompanied process for your perfect arrival.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journeySteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < journeySteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
                )}
                
                <div className="relative bg-white rounded-lg p-6 border border-gray-100 text-center hover:border-gray-200 transition-colors">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/5 flex items-center justify-center">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <div className="inline-block px-2 py-0.5 bg-primary text-white text-xs font-light rounded-full mb-3">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              {locale === 'es' ? 'Testimonios' : 'Testimonials'}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {locale === 'es' ? 'Lo que dicen nuestros estudiantes' : 'What our students say'}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg p-6 md:p-8 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    fill
                    className="object-cover rounded-full"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-lg text-gray-700 italic mb-6 leading-relaxed">
                    &quot;{testimonials[activeTestimonial].quote}&quot;
                  </p>
                  <div>
                    <div className="font-bold text-gray-900">{testimonials[activeTestimonial].name}</div>
                    <div className="text-gray-500 text-sm">
                      {testimonials[activeTestimonial].university} • {testimonials[activeTestimonial].country}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial navigation */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-1 rounded-full transition-all ${
                    activeTestimonial === index ? 'bg-primary w-6' : 'bg-gray-300 w-1 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-indigo-700 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {locale === 'es' ? '¿Listo para tu aventura mexicana?' : 'Ready for your Mexican adventure?'}
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            {locale === 'es'
              ? 'Reserva tu Welcome Pack hoy y empieza a vivir México desde el momento en que aterrices.'
              : 'Book your Welcome Pack today and start living Mexico from the moment you land.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contacto`}
              className="bg-white text-primary px-8 py-3.5 rounded-lg hover:bg-gray-100 transition-all font-semibold shadow-sm hover:shadow-md"
            >
              {locale === 'es' ? 'Reservar ahora' : 'Book now'}
            </Link>
            <a
              href="https://wa.me/522222123456"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-3.5 rounded-lg hover:bg-green-600 transition-all font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

