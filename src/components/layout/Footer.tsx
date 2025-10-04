import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="swaarg-large-title text-primary hover:scale-105 transition-transform duration-200">
              ENKI-REALTY
            </div>
            <p className="swaarg-body">
              Votre partenaire de confiance pour l'immobilier premium à Chypre.
              Découvrez des propriétés d'exception avec notre expertise locale.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="swaarg-card-title">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="swaarg-body hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/search" className="swaarg-body hover:text-primary transition-colors">
                  Recherche
                </Link>
              </li>
              <li>
                <Link to="/projects" className="swaarg-body hover:text-primary transition-colors">
                  Projets
                </Link>
              </li>
              <li>
                <Link to="/blog" className="swaarg-body hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="swaarg-body hover:text-primary transition-colors">
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="swaarg-body hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="swaarg-card-title">Services</h3>
            <ul className="space-y-2">
              <li className="swaarg-body">Vente de propriétés</li>
              <li className="swaarg-body">Location saisonnière</li>
              <li className="swaarg-body">Gestion locative</li>
              <li className="swaarg-body">Conseil en investissement</li>
              <li className="swaarg-body">Évaluation immobilière</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="swaarg-card-title">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="swaarg-body">Limassol Marina, Chypre</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="swaarg-body">+357 25 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="swaarg-body">contact@enki-realty.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="swaarg-body">
              © 2025 ENKI-REALTY. Tous droits réservés.
            </div>
            <div className="flex flex-wrap space-x-6">
              <a href="#" className="swaarg-body hover:text-primary transition-colors">
                Mentions légales
              </a>
              <a href="#" className="swaarg-body hover:text-primary transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="swaarg-body hover:text-primary transition-colors">
                RGPD
              </a>
              <a href="#" className="swaarg-body hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;