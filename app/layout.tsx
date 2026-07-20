import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'DeluxePower Electrical | Canberra & ACT Electrician',
  description:
    'Book a licensed Canberra electrician online. Transparent pricing, secure escrow payments — you only pay when the job is done to your satisfaction.',
  keywords: 'electrician Canberra, ACT electrician, electrical services Canberra, book electrician online',
  openGraph: {
    title: 'DeluxePower Electrical | Canberra & ACT',
    description: 'Book a licensed Canberra electrician online with secure escrow payments.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
