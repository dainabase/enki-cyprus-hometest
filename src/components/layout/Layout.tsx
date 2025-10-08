import { ReactNode } from 'react';
import ModernMenu from './ModernMenu';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <ModernMenu />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;