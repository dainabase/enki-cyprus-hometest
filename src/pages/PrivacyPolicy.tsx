import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <>
      <SEOHead 
        title="Politique de Confidentialité - ENKI-REALTY"
        description="Politique de confidentialité et protection des données personnelles sur ENKI-REALTY."
        url="https://enki-realty.com/privacy-policy"
      />
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-8">
              Politique de Confidentialité
            </h1>
            
            <div className="prose max-w-none text-muted-foreground space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Collecte des Données</h2>
                <p>
                  ENKI-REALTY collecte vos données personnelles dans le cadre de nos services immobiliers à Chypre. 
                  Nous collectons uniquement les informations nécessaires pour vous fournir nos services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Utilisation des Cookies</h2>
                <p>
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site et analyser son usage. 
                  Vous pouvez accepter ou refuser l'utilisation des cookies via notre bannière de consentement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Analytics</h2>
                <p>
                  Nous utilisons Google Analytics pour comprendre comment vous utilisez notre site. 
                  Ces données nous aident à améliorer nos services. Vous pouvez refuser le tracking analytique.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Vos Droits</h2>
                <p>
                  Conformément au RGPD, vous avez le droit d'accéder, rectifier, supprimer vos données personnelles. 
                  Contactez-nous pour exercer vos droits.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Contact</h2>
                <p>
                  Pour toute question concernant cette politique de confidentialité, 
                  contactez-nous à privacy@enki-realty.com
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;