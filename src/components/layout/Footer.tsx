import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    navigation: [
      { name: 'Accueil', href: '/' },
      { name: 'Projets', href: '/projects' },
      { name: 'Recherche IA', href: '/search' },
      { name: 'Conseil Fiscal IA', href: '/lexaia' },
      { name: 'Blog', href: '/blog' },
      { name: 'À Propos', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Mentions légales', href: '/legal' },
      { name: 'Politique de confidentialité', href: '/privacy-policy' },
      { name: 'RGPD', href: '/gdpr' },
      { name: 'Cookies', href: '/cookies' },
    ],
    social: [
      { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
      { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
      { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    ],
  };

  return (
    <footer className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="w-full py-16 px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Link to="/" className="inline-block group">
              <h3 className="swaarg-large-title text-white group-hover:text-primary transition-colors">
                ENKI-REALTY
              </h3>
            </Link>
            <p className="swaarg-body text-white/70 leading-relaxed">
              Votre partenaire de confiance pour l'immobilier premium à Chypre.
              Découvrez des propriétés d'exception avec notre expertise locale.
            </p>
            <div className="flex space-x-3">
              {links.social.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="swaarg-card-title mb-6">Navigation</h4>
            <ul className="space-y-3">
              {links.navigation.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="swaarg-body text-white/70 hover:text-white hover:translate-x-1 inline-flex items-center group transition-all"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="swaarg-card-title mb-6">Contact</h4>
            <div className="space-y-4">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-start space-x-3 text-white/70 hover:text-white transition-colors"
              >
                <MapPin className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                <span className="swaarg-body">
                  Limassol Marina<br />
                  Chypre
                </span>
              </motion.div>
              <motion.a
                href="tel:+35725123456"
                whileHover={{ x: 4 }}
                className="flex items-center space-x-3 text-white/70 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="swaarg-body">+357 25 123 456</span>
              </motion.a>
              <motion.a
                href="mailto:contact@enki-realty.com"
                whileHover={{ x: 4 }}
                className="flex items-center space-x-3 text-white/70 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="swaarg-body">contact@enki-realty.com</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="swaarg-card-title mb-6">Newsletter</h4>
            <p className="swaarg-body text-white/70">
              Restez informé de nos derniers programmes immobiliers
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-primary transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
              >
                S'inscrire
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="swaarg-body text-white/60 text-center md:text-left"
          >
            © {currentYear} ENKI-REALTY. Tous droits réservés.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6"
          >
            {links.legal.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="swaarg-body text-white/60 hover:text-white transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Design Accent */}
      <div className="w-full h-1 bg-gradient-to-r from-primary via-cyan-500 to-primary" />
    </footer>
  );
};

export default Footer;
