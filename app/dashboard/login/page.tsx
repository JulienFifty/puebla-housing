'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const locale = 'es'; // Dashboard usa español por defecto

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Registro de nuevo usuario
        if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              name: name.trim(),
            },
          },
        });

        if (error) {
          console.error('Error de registro:', error);
          setError(error.message || 'Error al crear la cuenta. Intenta nuevamente.');
        } else if (data?.user) {
          // Verificar si el email está confirmado
          const emailConfirmed = data.user.email_confirmed_at !== null;
          
          if (emailConfirmed) {
            setSuccess('¡Cuenta creada exitosamente! Puedes iniciar sesión ahora.');
            // Esperar un momento y redirigir al dashboard
            setTimeout(() => {
              router.push('/dashboard');
            }, 1500);
          } else {
            setSuccess('¡Cuenta creada exitosamente! Si no recibes el email de verificación, puedes confirmar tu cuenta manualmente desde el dashboard de Supabase o contactar al administrador.');
          }
          
          // Limpiar formulario
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setIsSignUp(false);
        } else {
          setError('No se pudo crear la cuenta. Intenta nuevamente.');
        }
      } else {
        // Inicio de sesión
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          console.error('Error de autenticación:', error);
          setError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        } else if (data?.user) {
          console.log('Login exitoso, usuario:', data.user.email);
          // Esperar un momento para que la sesión se establezca en las cookies
          await new Promise(resolve => setTimeout(resolve, 500));
          // Verificar que la sesión esté establecida
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log('Sesión establecida, redirigiendo...');
            window.location.href = '/dashboard';
          } else {
            console.error('No se pudo establecer la sesión');
            setError('Error al establecer la sesión. Intenta nuevamente.');
          }
        } else {
          setError('No se pudo iniciar sesión. Intenta nuevamente.');
        }
      }
    } catch (error: any) {
      console.error('Error inesperado:', error);
      setError(isSignUp ? 'Error al crear la cuenta. Por favor, intenta nuevamente.' : 'Error al iniciar sesión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-gray">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Botón para volver al inicio */}
        <div className="mb-6">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>

        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Puebla Housing"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-2">
            {isSignUp ? 'Crea tu cuenta de propietario' : 'Inicia sesión para continuar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="font-medium">{success}</p>
                  {success.includes('verificación') && (
                    <div className="text-sm mt-2 space-y-1 text-green-600">
                      <p>• Revisa tu bandeja de entrada y spam</p>
                      <p>• Si no recibes el email, el administrador puede confirmar tu cuenta manualmente</p>
                      <p>• También puedes intentar iniciar sesión directamente</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Tu nombre completo"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={isSignUp ? "Mínimo 6 caracteres" : ""}
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={isSignUp}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Repite tu contraseña"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold disabled:opacity-50"
          >
            {loading 
              ? (isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...') 
              : (isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión')
            }
          </button>

          <div className="text-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
                setPassword('');
                setConfirmPassword('');
                setName('');
              }}
              className="text-primary hover:text-primary-hover font-medium text-sm"
            >
              {isSignUp 
                ? '¿Ya tienes cuenta? Inicia sesión' 
                : '¿No tienes cuenta? Crear cuenta de propietario'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
