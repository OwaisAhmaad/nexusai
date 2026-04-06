import { Footer } from '@/components/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </div>
  );
}
