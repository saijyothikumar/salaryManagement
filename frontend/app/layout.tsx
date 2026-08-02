import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Salary Management',
  description: 'Phase 1 skeleton',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
