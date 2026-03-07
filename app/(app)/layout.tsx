import Navbar from '@/components/shared/Navbar';
import TopBar from '@/components/shared/TopBar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar />
      <TopBar />
      <main className="md:ml-20 lg:ml-64 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
}
