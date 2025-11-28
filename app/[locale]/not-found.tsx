import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-gray">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-main mb-4">Página no encontrada</h2>
        <p className="text-text-secondary mb-8">La página que buscas no existe.</p>
        <Link
          href="/es"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

