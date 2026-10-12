import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'MediConnect — AI-Powered Digital Clinic Platform',
  description:
    'MediConnect connects patients and healthcare providers through verified doctors, secure consultations, and medical reference libraries.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
