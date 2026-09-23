import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Geneva & Ken Wedding',
  description: 'Wedding website for Geneva & Ken',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
