import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aquakart - Business Management Suite',
  description: 'Manage your business with Aquakart',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans">
      <body>{children}</body>
    </html>
  );
}