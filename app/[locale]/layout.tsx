import Header from '@/components/Header';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return [{ locale: 'es' }];
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
