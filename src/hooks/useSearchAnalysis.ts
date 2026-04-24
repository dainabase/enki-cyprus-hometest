import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { trackCustomEvent } from '@/lib/analytics';
import { MockProperty } from '@/types/search.types';
import { useChatMessages } from './useChatMessages';
import { useSearchConsent } from './useSearchConsent';

export const useSearchAnalysis = () => {
  const [agenticQuery, setAgenticQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [mockProperties, setMockProperties] = useState<MockProperty[]>([]);
  const { toast } = useToast();

  const chatMessages = useChatMessages();
  const consent = useSearchConsent();

  // Gestion du transfert depuis le Hero
  useEffect(() => {
    const handleTransfer = () => {
      const pendingSearch = localStorage.getItem('pending-search');

      if (pendingSearch) {
        setAgenticQuery(pendingSearch);

        chatMessages.setMessages([{
          role: 'assistant',
          content: `👋 Bonjour ! J'ai bien reçu votre recherche : "${pendingSearch}". Pour analyser vos besoins et vous proposer les meilleures options, j'ai besoin de votre consentement.`,
          timestamp: new Date()
        }]);

        consent.highlightConsent();
        localStorage.removeItem('pending-search');
      }
    };

    window.addEventListener('hero-search-transferred', handleTransfer);
    return () => window.removeEventListener('hero-search-transferred', handleTransfer);
  }, [chatMessages, consent]);

  const handleAnalysis = useCallback(async () => {
    if (!consent.consent || !agenticQuery.trim()) {
      if (!consent.consent) {
        consent.highlightConsent();
        toast({
          title: "Consentement requis",
          description: "Veuillez accepter le traitement de vos données",
          variant: "destructive",
        });
      }
      return;
    }

    // Marquer le consentement comme donné
    consent.markConsentAsGiven();

    // Message utilisateur
    chatMessages.addUserMessage(agenticQuery);

    // Vider le champ
    const currentQuery = agenticQuery;
    setAgenticQuery('');

    // Message typing
    chatMessages.addTypingMessage();
    chatMessages.setIsAnalyzing(true);

    try {
      trackCustomEvent('search_submitted', { query_length: currentQuery.length });

      // Simuler l'analyse (2 secondes)
      setTimeout(() => {
        // Remplacer le message typing
        chatMessages.replaceLastMessage({
          role: 'assistant',
          content: "J'ai trouvé 3 propriétés correspondant à vos critères. Les résultats s'affichent dans le panneau de droite.",
          timestamp: new Date()
        });

        // OUVRIR LE PANNEAU LATÉRAL (animation slide)
        setShowResults(true);

        // Charger les propriétés mock
        setMockProperties([
          {
            id: 1,
            title: "Appartement Vue Mer Limassol",
            image: "/lovable-uploads/marina-bay-hero.webp",
            price: "245 000",
            location: "Limassol Marina",
            size: 85,
            description: "Magnifique T3 avec vue mer, résidence avec piscine, parking inclus",
            matching: 95,
            missingFeatures: ["Salle de sport"]
          },
          {
            id: 2,
            title: "Penthouse Moderne Paphos",
            image: "/lovable-uploads/marina-bay-interior-1.webp",
            price: "255 000",
            location: "Paphos Centre",
            size: 92,
            description: "Penthouse dernier étage, terrasse 30m², piscine et gym",
            matching: 100,
            missingFeatures: []
          },
          {
            id: 3,
            title: "Studio Investissement Larnaca",
            image: "/lovable-uploads/marina-bay-bedroom.webp",
            price: "180 000",
            location: "Larnaca Beach",
            size: 45,
            description: "Studio front de mer, parfait pour location touristique",
            matching: 85,
            missingFeatures: ["2 chambres", "Parking privé"]
          }
        ]);

        chatMessages.setIsAnalyzing(false);
      }, 2000);

    } catch (error) {
      // Remplacer le message typing par un message d'erreur
      chatMessages.replaceLastMessage({
        role: 'assistant',
        content: "Désolé, une erreur s'est produite lors de l'analyse. Veuillez réessayer.",
        timestamp: new Date()
      });
      chatMessages.setIsAnalyzing(false);
    }
  }, [agenticQuery, consent, chatMessages, toast]);

  const handleConsentChange = useCallback((checked: boolean) => {
    consent.handleConsentChange(checked);

    if (checked) {
      // Message de l'IA
      chatMessages.addAssistantMessage(
        "✅ Merci pour votre consentement ! Cliquez sur 'Lancer l'Analyse IA' pour que je recherche les meilleures propriétés selon vos critères."
      );
    }
  }, [consent, chatMessages]);

  return {
    agenticQuery,
    setAgenticQuery,
    showResults,
    mockProperties,
    handleAnalysis,
    handleConsentChange,
    chatMessages,
    consent,
  };
};
