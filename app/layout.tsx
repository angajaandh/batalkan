import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Mandiri - Pembatalan Transaksi',
  description: 'Proses pembatalan transaksi aman dan cepat.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body suppressHydrationWarning className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
