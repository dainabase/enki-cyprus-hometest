import { useState, useCallback } from 'react';

export const useSearchConsent = () => {
  const [consent, setConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [shouldHighlightConsent, setShouldHighlightConsent] = useState(false);

  const handleConsentChange = useCallback((checked: boolean) => {
    setConsent(checked);
    setShouldHighlightConsent(false);
  }, []);

  const markConsentAsGiven = useCallback(() => {
    if (consent) {
      setConsentGiven(true);
    }
  }, [consent]);

  const highlightConsent = useCallback(() => {
    setShouldHighlightConsent(true);
  }, []);

  return {
    consent,
    setConsent,
    consentGiven,
    setConsentGiven,
    shouldHighlightConsent,
    setShouldHighlightConsent,
    handleConsentChange,
    markConsentAsGiven,
    highlightConsent
  };
};
