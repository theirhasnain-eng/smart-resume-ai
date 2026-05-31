import { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { getSession } from '@/lib/auth';
import { Navbar, NavbarFallback } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SmoothScroll } from '@/components/SmoothScroll';

export const metadata: Metadata = {
  title: 'Smart Resume AI — AI-Powered Resume Screening',
  description: 'AI-powered resume screening and job matching',
};

async function NavbarWithSession() {
  const user = await getSession();
  return <Navbar user={user} />;
}

async function FooterWithSession() {
  const user = await getSession();
  return <Footer user={user} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="bg-gradient-body site-body antialiased">
        <SmoothScroll />
        <Suspense fallback={<NavbarFallback />}>
          <NavbarWithSession />
        </Suspense>
        <main className="site-main">{children}</main>
        <Suspense fallback={null}>
          <FooterWithSession />
        </Suspense>
      </body>
    </html>
  );
}
