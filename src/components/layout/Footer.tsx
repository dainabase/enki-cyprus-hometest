import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="text-sm text-white/60">
            © 2025 ENKI-REALTY. Tous droits réservés.
          </div>
          <div className="flex flex-wrap space-x-6">
            <Link to="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link to="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">
              RGPD
            </Link>
            <Link to="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
