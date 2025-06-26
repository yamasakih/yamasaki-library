import './globals.css';
import type { ReactNode } from 'react';
import Header from '@/components/Header';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/assets/icon.png" />
      </head>
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 70px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
