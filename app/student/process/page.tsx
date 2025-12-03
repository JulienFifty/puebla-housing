'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'completed' | 'current' | 'pending';
  details?: string[];
}

interface Inquiry {
  id: string;
  status: string;
  created_at: string;
  property: {
    name_es: string;
  } | null;
}

export default function ProcessPage() {
  const [currentInquiry, setCurrentInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiryStatus();
  }, []);

  const fetchInquiryStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('inquiries')
        .select(`
          id,
          status,
          created_at,
          property:properties(name_es)
        `)
        .or(`student_id.eq.${user.id},email.eq.${user.email}`)
        .not('status', 'in', '("rejected","archived")')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setCurrentInquiry(data as any);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepKey: string): 'completed' | 'current' | 'pending' => {
    if (!currentInquiry) return 'pending';
    
    const statusOrder = ['new', 'contacted', 'documents', 'reviewing', 'approved', 'payment', 'confirmed'];
    const currentIndex = statusOrder.indexOf(currentInquiry.status);
    const stepIndex = statusOrder.indexOf(stepKey);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const processSteps: ProcessStep[] = [
    {
      id: 'new',
      title: 'Solicitud Enviada',
      description: 'Tu solicitud ha sido recibida y está siendo procesada.',
      icon: '📝',
      status: getStepStatus('new'),
      details: [
        'Revisa tu correo electrónico para confirmación',
        'El propietario revisará tu solicitud',
        'Tiempo estimado: 1-2 días hábiles',
      ],
    },
    {
      id: 'contacted',
      title: 'Contacto Inicial',
      description: 'El propietario se ha comunicado contigo.',
      icon: '📞',
      status: getStepStatus('contacted'),
      details: [
        'Responde a los mensajes del propietario',
        'Aclara cualquier duda sobre la propiedad',
        'Confirma tu interés en la habitación',
      ],
    },
    {
      id: 'documents',
      title: 'Documentación',
      description: 'Es momento de enviar los documentos requeridos.',
      icon: '📄',
      status: getStepStatus('documents'),
      details: [
        'Identificación oficial (pasaporte o INE)',
        'Carta de aceptación de tu universidad',
        'Comprobante de seguro médico (si aplica)',
        'Contacto de emergencia',
      ],
    },
    {
      id: 'reviewing',
      title: 'En Revisión',
      description: 'Estamos verificando tu documentación.',
      icon: '🔍',
      status: getStepStatus('reviewing'),
      details: [
        'Verificación de documentos',
        'Confirmación de disponibilidad',
        'Preparación del contrato',
      ],
    },
    {
      id: 'approved',
      title: 'Solicitud Aprobada',
      description: '¡Felicidades! Tu solicitud ha sido aprobada.',
      icon: '✅',
      status: getStepStatus('approved'),
      details: [
        'Revisa los términos del contrato',
        'Confirma las fechas de check-in/check-out',
        'Prepara el pago de reserva',
      ],
    },
    {
      id: 'payment',
      title: 'Pago de Reserva',
      description: 'Realiza el pago para confirmar tu reserva.',
      icon: '💳',
      status: getStepStatus('payment'),
      details: [
        'Pago del depósito de seguridad',
        'Primer mes de renta (si aplica)',
        'Conserva tu comprobante de pago',
      ],
    },
    {
      id: 'confirmed',
      title: '¡Reserva Confirmada!',
      description: 'Tu habitación está lista para ti.',
      icon: '🎉',
      status: getStepStatus('confirmed'),
      details: [
        'Recibirás información de check-in',
        'Coordina tu llegada con el propietario',
        '¡Bienvenido a tu nuevo hogar!',
      ],
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Proceso de Ingreso</h1>
        <p className="text-gray-500 mt-1">Sigue los pasos para completar tu reserva de alojamiento</p>
      </div>

      {/* Current Status Banner */}
      {currentInquiry && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Solicitud activa</p>
              <h3 className="text-xl font-bold">{currentInquiry.property?.name_es || 'Propiedad'}</h3>
              <p className="text-blue-100 text-sm mt-1">
                Iniciada el {new Date(currentInquiry.created_at).toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <Link
              href="/student/applications"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
            >
              Ver detalles →
            </Link>
          </div>
        </div>
      )}

      {/* Process Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="relative">
          {processSteps.map((step, index) => (
            <div key={step.id} className="relative flex gap-6 pb-12 last:pb-0">
              {/* Line */}
              {index < processSteps.length - 1 && (
                <div
                  className={`absolute left-6 top-14 w-0.5 h-full -ml-px ${
                    step.status === 'completed' ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl text-2xl shrink-0 transition-all ${
                  step.status === 'completed'
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/30'
                    : step.status === 'current'
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 ring-4 ring-blue-100'
                    : 'bg-gray-100'
                }`}
              >
                {step.status === 'completed' ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={step.status === 'pending' ? 'grayscale opacity-50' : ''}>
                    {step.icon}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3
                    className={`text-lg font-semibold ${
                      step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'
                    }`}
                  >
                    {step.title}
                  </h3>
                  {step.status === 'current' && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      Actual
                    </span>
                  )}
                </div>
                <p
                  className={`mb-4 ${
                    step.status === 'pending' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {step.description}
                </p>

                {/* Details */}
                {step.status === 'current' && step.details && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Qué necesitas hacer:</h4>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
                          <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {step.status === 'completed' && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Completado
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No Active Request */}
      {!currentInquiry && (
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">No tienes solicitudes activas</h3>
              <p className="text-amber-700 text-sm mb-4">
                Para iniciar el proceso de alojamiento, primero debes enviar una solicitud para una de nuestras propiedades.
              </p>
              <Link
                href="/es/casas"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explorar Propiedades
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-900">¿Cuánto tiempo tarda el proceso?</span>
              <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="p-4 text-gray-600 text-sm">
              El proceso completo generalmente toma entre 5 y 10 días hábiles, dependiendo de qué tan rápido 
              envíes la documentación y realices el pago.
            </p>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-900">¿Qué documentos necesito?</span>
              <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="p-4 text-gray-600 text-sm">
              Generalmente necesitarás: identificación oficial (pasaporte), carta de aceptación de tu universidad, 
              comprobante de seguro médico y datos de un contacto de emergencia.
            </p>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-900">¿Cuánto es el depósito?</span>
              <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="p-4 text-gray-600 text-sm">
              El depósito de seguridad generalmente equivale a un mes de renta. Este se te devuelve al final 
              de tu estancia, sujeto a las condiciones del contrato.
            </p>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-900">¿Puedo cancelar mi solicitud?</span>
              <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="p-4 text-gray-600 text-sm">
              Sí, puedes cancelar tu solicitud en cualquier momento antes de realizar el pago. Una vez 
              confirmada la reserva, aplican las políticas de cancelación del propietario.
            </p>
          </details>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">¿Tienes dudas sobre el proceso?</h3>
            <p className="text-blue-100 text-sm">
              Nuestro equipo está disponible para ayudarte en cada paso.
            </p>
          </div>
          <Link
            href="/es/contacto"
            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg shrink-0"
          >
            Contactar
          </Link>
        </div>
      </div>
    </div>
  );
}



