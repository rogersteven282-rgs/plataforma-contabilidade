import Header from './Header';
import BottomNav from './BottomNav';
import Footer from './Footer';
import { useConfig } from '../context/ConfigContext';

export default function Layout({ children, direitaHeader }) {
  const config = useConfig();

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-20">
      <Header config={config} direita={direitaHeader} />
      <main className="mx-auto max-w-md px-4 py-5">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
