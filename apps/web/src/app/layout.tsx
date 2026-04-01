import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'NexusAI — AI Model Marketplace',
  description: 'Discover, compare, and deploy the best AI models for your use case.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
