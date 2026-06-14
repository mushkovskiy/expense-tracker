import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses, categories, and budgets',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
