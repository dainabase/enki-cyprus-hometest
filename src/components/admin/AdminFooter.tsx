import { Link } from 'react-router-dom';

const AdminFooter = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="text-sm text-slate-600">
            © 2025 ENKI-REALTY. Tous droits réservés.
          </div>
          <div className="flex flex-wrap space-x-6">
            <Link to="/privacy" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Mentions légales
            </Link>
            <Link to="/privacy" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/privacy" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              RGPD
            </Link>
            <Link to="/privacy" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;