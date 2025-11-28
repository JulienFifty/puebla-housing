import { Manrope } from 'next/font/google';
import '../app/globals.css';

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={manrope.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

