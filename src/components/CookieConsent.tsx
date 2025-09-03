import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { Button } from '@/components/ui/button';

export const CookieConsentBanner: React.FC = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="J'accepte"
      declineButtonText="Refuser"
      enableDeclineButton
      cookieName="enki-realty-consent"
      style={{
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        borderTop: "1px solid hsl(var(--border))",
        boxShadow: "0 -4px 12px hsl(var(--shadow))",
      }}
      buttonStyle={{
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        border: "none",
        borderRadius: "6px",
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: "500",
      }}
      declineButtonStyle={{
        background: "transparent",
        color: "hsl(var(--muted-foreground))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "6px",
        padding: "8px 16px",
        fontSize: "14px",
        marginRight: "10px",
      }}
      expires={365}
      onAccept={() => {
        console.log('✅ Cookies accepted - Analytics enabled');
        // Enable analytics tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('consent', 'update', {
            analytics_storage: 'granted'
          });
        }
      }}
      onDecline={() => {
        console.log('❌ Cookies declined - Analytics disabled');
        // Disable analytics tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('consent', 'update', {
            analytics_storage: 'denied'
          });
        }
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            🍪 <strong>ENKI-REALTY</strong> utilise des cookies pour améliorer votre expérience et analyser l'usage du site. 
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
        </div>
      </div>
    </CookieConsent>
  );
};