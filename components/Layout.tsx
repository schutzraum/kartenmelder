import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "text-brand-600 font-semibold" : "text-slate-500 hover:text-slate-800";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-brand-500 text-white p-1.5 rounded-lg">
                <ShieldAlert size={24} />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Karten<span className="text-brand-600">Melder</span></span>
            </Link>
            
            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={isActive('/')}>Startseite</Link>
              <Link to="/rankings" className={isActive('/rankings')}>Städte-Ranking</Link>
              <Link to="/feedback" className={isActive('/feedback')}>Feedback</Link>
              <Link to="/report" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-full font-medium transition-colors shadow-md hover:shadow-lg flex items-center gap-2">
                <AlertTriangle size={18} />
                <span>Karte melden</span>
              </Link>
            </div>

             {/* Mobile Menu Icon - simplified for this demo */}
             <div className="md:hidden flex items-center">
                <Link to="/report" className="text-brand-600 p-2">
                    <AlertTriangle size={24} />
                </Link>
             </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
            <Link to="/rankings" className="hover:text-brand-600 transition-colors">Rankings</Link>
            <Link to="/feedback" className="hover:text-brand-600 transition-colors">Feedback</Link>
            <Link to="/about" className="hover:text-brand-600 transition-colors">Über Kartenmelder</Link>
            <Link to="/admin" className="hover:text-brand-600 transition-colors">Admin Login</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Karten-Melder. Gegen nervige Autohändler-Werbung.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;