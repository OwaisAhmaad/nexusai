import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'NexusAI — AI Model Marketplace',
    template: '%s | NexusAI',
  },
  description:
    'Discover, compare, and deploy the best AI models. Find your perfect model with our AI advisor — GPT-4o, Claude, Gemini, and more.',
  keywords: ['AI models', 'GPT-4o', 'Claude', 'Gemini', 'AI marketplace', 'LLM API'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="pt-16 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
