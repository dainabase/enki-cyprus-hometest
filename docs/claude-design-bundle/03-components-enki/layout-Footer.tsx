import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-20 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* 4 Colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Colonne 1: À Propos */}
          <div>
            <h3 className="text-xl font-light mb-6 tracking-tight">À Propos d'ENKI Reality</h3>
            <p className="text-white/60 font-light mb-6 leading-relaxed text-sm">
              Expert de l'immobilier de prestige à Chypre depuis 15 ans. Nous accompagnons les investisseurs internationaux avec excellence et transparence.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/40">Volume livré</span>
                <span className="text-white font-medium">€2,5Mds</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/40">Familles</span>
                <span className="text-white font-medium">2,500+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Projets actifs</span>
                <span className="text-white font-medium">12+</span>
              </div>
            </div>
          </div>

          {/* Colonne 2: Navigation Projets */}
          <div>
            <h3 className="text-xl font-light mb-6 tracking-tight">Découvrir</h3>
            <ul className="space-y-3">
              {[
                { label: 'Tous les Projets', href: '/projects' },
                { label: 'Projets Vedette', href: '/projects?category=featured' },
                { label: 'Villas de Prestige', href: '/projects?category=villas' },
                { label: 'Limassol', href: '/projects?zone=limassol' },
                { label: 'Paphos', href: '/projects?zone=paphos' },
                { label: 'Larnaca', href: '/projects?zone=larnaca' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.href}
                    className="text-sm font-light text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3: Ressources */}
          <div>
            <h3 className="text-xl font-light mb-6 tracking-tight">Ressources</h3>
            <ul className="space-y-3">
              {[
                { label: 'Blog Investissement', href: '/blog' },
                { label: 'Guide Résidence UE', href: '/residence-guide' },
                { label: 'Rapports de Marché', href: '/market-reports' },
                { label: 'Calculateur ROI', href: '/calculator' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Contact', href: '/contact' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.href}
                    className="text-sm font-light text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4: Contact */}
          <div>
            <h3 className="text-xl font-light mb-6 tracking-tight">Contact</h3>
            <div className="space-y-4 text-sm text-white/60 font-light">
              <div>
                <p className="text-white/40 uppercase tracking-wider text-xs mb-1">Téléphone</p>
                <p>+357 25 123 456</p>
              </div>
              <div>
                <p className="text-white/40 uppercase tracking-wider text-xs mb-1">Email</p>
                <p>info@enki-reality.cy</p>
              </div>
              <div>
                <p className="text-white/40 uppercase tracking-wider text-xs mb-1">Bureau</p>
                <p>Limassol Marina, Cyprus</p>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {['F', 'I', 'L', 'Y'].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-11 h-11 bg-white/10 hover:bg-white hover:text-black flex items-center justify-center transition-all text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40 font-light">
          <p>© 2025 ENKI Reality Cyprus. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Politique de Confidentialité
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              CGV
            </Link>
            <Link to="/legal" className="hover:text-white transition-colors">
              Mentions Légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
