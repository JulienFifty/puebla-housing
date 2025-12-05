'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import UniversitiesBanner from './UniversitiesBanner';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { href: `/${locale}/welcome-pack`, label: t('welcomePack') },
    { href: `/${locale}/quien-somos`, label: t('about') },
    { href: `/${locale}/casas/mariachi`, label: t('mariachi') },
    { href: `/${locale}/casas/centro`, label: t('centro') },
    { href: `/${locale}/casas/piramide`, label: t('piramide') },
  ];

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black/20 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center group flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Puebla Housing"
              width={140}
              height={45}
              className="h-4 sm:h-5 md:h-7 w-auto transition-transform group-hover:scale-105 drop-shadow-lg"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:text-secondary transition-all font-medium text-xs xl:text-sm tracking-wide relative group whitespace-nowrap drop-shadow-lg"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
              </Link>
            ))}
            <div className="ml-2 xl:ml-4 flex-shrink-0">
              <LanguageSwitcher />
            </div>
            {/* Login Dropdown */}
            {user ? (
              <Link
                href="/dashboard"
                className="bg-white/10 text-white px-3 xl:px-5 py-2.5 rounded-lg hover:bg-white/20 transition-all font-semibold text-xs xl:text-sm shadow-lg hover:shadow-xl flex items-center gap-1.5 xl:gap-2 whitespace-nowrap backdrop-blur-sm border border-white/20"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden 2xl:inline">{t('dashboard')}</span>
              </Link>
            ) : (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  className="bg-white/10 text-white px-3 xl:px-5 py-2.5 rounded-lg hover:bg-white/20 transition-all font-semibold text-xs xl:text-sm shadow-lg hover:shadow-xl flex items-center gap-1.5 xl:gap-2 whitespace-nowrap backdrop-blur-sm border border-white/20"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden 2xl:inline">{t('login')}</span>
                  <svg className={`w-4 h-4 flex-shrink-0 transition-transform ${loginDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {loginDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[100]" 
                      onClick={() => setLoginDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-[101] overflow-hidden">
                      <Link
                        href="/dashboard/login"
                        onClick={() => setLoginDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">Acceso Propietario</p>
                          <p className="text-xs text-gray-500">Dashboard de gestión</p>
                        </div>
                      </Link>
                      <Link
                        href="/student/login"
                        onClick={() => setLoginDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">Portal Estudiante</p>
                          <p className="text-xs text-gray-500">Seguimiento de solicitudes</p>
                        </div>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
            <Link
              href={`/${locale}/contacto`}
              className="bg-primary text-white px-4 xl:px-6 py-2.5 rounded-lg hover:bg-primary-hover transition-all font-semibold text-xs xl:text-sm shadow-sm hover:shadow-md ml-2 whitespace-nowrap flex-shrink-0"
            >
              {t('contact')}
            </Link>
          </nav>

          {/* Tablet/Mobile Menu Button */}
          <button
            className="xl:hidden p-2 text-white hover:text-secondary transition-colors flex-shrink-0 drop-shadow-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>

      {/* Mobile/Tablet Full-Page Menu */}
      {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 z-[110] xl:hidden animate-fadeIn"
              onClick={() => setMobileMenuOpen(false)}
            ></div>

            {/* Full-Page Menu */}
            <div className="fixed inset-0 z-[120] xl:hidden bg-gradient-to-br from-primary via-purple-700 to-indigo-800 animate-slideInRight overflow-y-auto">
              <div className="flex flex-col min-h-full">
                {/* Header del menú */}
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                  <Image
                    src="/logo.png"
                    alt="Puebla Housing"
                    width={140}
                    height={45}
                    className="h-10 w-auto brightness-0 invert"
                  />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Contenido del menú */}
                <nav className="flex-1 px-8 py-8 space-y-1 overflow-y-auto">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-white hover:text-secondary transition-all font-semibold text-xl py-3 border-b border-white/10 hover:border-secondary/50 hover:pl-4 animate-slideInRight"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {/* Language Switcher */}
                  <div className="pt-6 pb-4 animate-slideInRight" style={{ animationDelay: '250ms' }}>
                    <LanguageSwitcher />
                  </div>
                </nav>

                {/* Footer del menú - CTAs */}
                <div className="p-6 space-y-4 border-t border-white/10 animate-slideInRight" style={{ animationDelay: '300ms' }}>
                  {user ? (
                    <Link
                      href="/dashboard"
                      className="block w-full bg-white text-primary px-6 py-3.5 rounded-lg hover:bg-gray-100 transition-colors text-center font-bold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{t('dashboard')}</span>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/dashboard/login"
                        className="block w-full bg-white/10 text-white border-2 border-white/30 px-6 py-3.5 rounded-lg hover:bg-white/20 transition-colors text-center font-bold backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>Portal Propietario</span>
                        </div>
                      </Link>
                      <Link
                        href="/student/login"
                        className="block w-full bg-white/10 text-white border-2 border-white/30 px-6 py-3.5 rounded-lg hover:bg-white/20 transition-colors text-center font-bold backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>Portal Estudiante</span>
                        </div>
                      </Link>
                    </>
                  )}
                  <Link
                    href={`/${locale}/contacto`}
                    className="block w-full bg-secondary text-gray-900 px-6 py-3.5 rounded-lg hover:bg-yellow-300 transition-colors text-center font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('contact')}
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
    </>
  );
}
