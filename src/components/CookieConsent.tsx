import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Cookie } from 'lucide-react';
import { logger } from '@/lib/logger';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check both localStorage and cookies for consent
    const localConsent = localStorage.getItem('enki-realty-consent');
    const cookieConsent = document.cookie
      .split('; ')
      .find(row => row.startsWith('enki-realty-consent='));
    
    // Only show banner if no consent found in either storage
    if (!localConsent && !cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Store consent in multiple ways for maximum persistence
    localStorage.setItem('enki-realty-consent', 'true');
    sessionStorage.setItem('enki-realty-consent', 'true');
    
    // Set cookie with long expiration
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `enki-realty-consent=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    
    logger.info('✅ Cookies accepted - Analytics enabled');
    
    // Enable analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
    
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Store decline in multiple ways
    localStorage.setItem('enki-realty-consent', 'false');
    sessionStorage.setItem('enki-realty-consent', 'false');
    
    // Set cookie with long expiration
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `enki-realty-consent=false; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    
    logger.info('❌ Cookies declined - Analytics disabled');
    
    // Disable analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
    
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-background border-2 border-border rounded-lg shadow-xl p-6 z-50">
      <div className="flex items-start gap-3">
        <Cookie className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2">
            🍪 Cookies & Confidentialité
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            <strong>ENKI-REALTY</strong> utilise des cookies pour améliorer votre expérience et analyser l'usage du site. 
            En continuant, vous acceptez notre{' '}
            <a 
              href="/privacy-policy" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              politique de confidentialité
            </a>.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleAccept}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              J'accepte
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              className="flex-1"
            >
              Refuser
            </Button>
          </div>
        </div>
        <button
          onClick={handleDecline}
          className="text-muted-foreground hover:text-foreground p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};