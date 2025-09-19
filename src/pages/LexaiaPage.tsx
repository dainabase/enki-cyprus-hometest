import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Brain, FileText, Download, MessageCircle, Sparkles, 
  TrendingUp, Calculator, PiggyBank, Target, Shield, Zap,
  User, Bot, Copy, Save, Trash2, Star, ChevronDown, ChevronUp, Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trackCustomEvent } from '@/lib/analytics';
import { SEOHead } from '@/components/SEOHead';

interface LexaiaMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  analysis?: {
    tax_optimization: string[];
    recommendations: string[];
    savings_potential: number;
    risk_level: 'low' | 'medium' | 'high';
  };
}

interface SavedQuery {
  id: string;
  query: string;
  response: string;
  analysis: any;
  created_at: string;
  starred: boolean;
}

interface PropertySelection {
  id: string;
  title: string;
  price: string;
  location: string;
  selected: boolean;
}

const LexaiaPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [currentQuery, setCurrentQuery] = useState('');
  const [messages, setMessages] = useState<LexaiaMessage[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<PropertySelection[]>([]);
  const [showPropertySelector, setShowPropertySelector] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load user's saved queries/dossiers
  const { data: savedQueries = [], refetch: refetchSavedQueries } = useQuery({
    queryKey: ['lexaia-queries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('dossiers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(d => ({
        id: d.id,
        query: d.query,
        response: (d.lexaia_outputs as any)?.summary || 'Analyse en cours...',
        analysis: d.lexaia_outputs,
        created_at: d.created_at,
        starred: (d.lexaia_outputs as any)?.starred || false
      })) || [];
    },
    enabled: isAuthenticated
  });

  // Load user's properties/dossiers for selection
  const { data: userProperties = [] } = useQuery({
    queryKey: ['user-properties', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: dossiers } = await supabase
        .from('dossiers')
        .select('biens')
        .eq('user_id', user.id);
      
      const propertyIds = dossiers?.flatMap(d => d.biens || []) || [];
      
      if (propertyIds.length === 0) return [];
      
      const { data: properties } = await supabase
        .from('projects')
        .select('id, title, price, location')
        .in('id', propertyIds);
      
      return properties?.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        location: typeof p.location === 'string' ? p.location : (p.location as any)?.city || p.location,
        selected: false
      })) || [];
    },
    enabled: isAuthenticated
  });

  // Lexaia query mutation
  const lexaiaQueryMutation = useMutation({
    mutationFn: async (query: string) => {
      const { data, error } = await supabase.functions.invoke('lexaia-qna', {
        body: { 
          query,
          context: selectedProperties.filter(p => p.selected)
        }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data, query) => {
      const assistantMessage: LexaiaMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: data.response || 'Analyse complétée avec succès.',
        timestamp: new Date(),
        analysis: data.analysis
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "Analyse complétée",
        description: "Votre question fiscale a été analysée avec succès"
      });
      
      trackCustomEvent('lexaia_query', {
        query_length: query.length,
        has_properties: selectedProperties.some(p => p.selected),
        user_id: user?.id
      });
    },
    onError: (error) => {
      console.error('Lexaia query error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de l'analyse. Veuillez réessayer."
      });
    }
  });

  // Save query mutation
  const saveQueryMutation = useMutation({
    mutationFn: async ({ query, response, analysis }: { query: string; response: string; analysis: any }) => {
      const { data, error } = await supabase
        .from('dossiers')
        .insert({
          user_id: user?.id,
          title: `Analyse Conseil Fiscal - ${new Date().toLocaleDateString()}`,
          query,
          lexaia_outputs: { 
            summary: response, 
            analysis,
            timestamp: new Date().toISOString()
          },
          biens: selectedProperties.filter(p => p.selected).map(p => p.id)
        });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Analyse sauvegardée",
        description: "Votre consultation a été ajoutée à vos dossiers"
      });
      refetchSavedQueries();
    }
  });

  // Generate PDF mutation
  const generatePDFMutation = useMutation({
    mutationFn: async () => {
      const conversationData = {
        messages: messages.filter(m => m.type === 'assistant'),
        properties: selectedProperties.filter(p => p.selected),
        user_profile: {
          email: user?.email,
          consultation_date: new Date().toISOString()
        }
      };
      
      // Mock PDF generation - in real app would call edge function
      const { data, error } = await supabase.functions.invoke('generate-lexaia-pdf', {
        body: conversationData
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.pdf_url) {
        window.open(data.pdf_url, '_blank');
        trackCustomEvent('lexaia_pdf_generated', {
          user_id: user?.id,
          messages_count: messages.length
        });
      }
    }
  });

  const handleSubmitQuery = () => {
    if (!currentQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez saisir votre question"
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Connexion requise",
        description: "Veuillez vous connecter pour utiliser notre Conseil Fiscal IA"
      });
      return;
    }

    // Add user message
    const userMessage: LexaiaMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentQuery,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    lexaiaQueryMutation.mutate(currentQuery);
    setCurrentQuery('');
  };

  const handleSaveConversation = () => {
    const lastAssistantMessage = messages.filter(m => m.type === 'assistant').pop();
    if (!lastAssistantMessage) return;

    const lastUserMessage = messages.filter(m => m.type === 'user').pop();
    if (!lastUserMessage) return;

    saveQueryMutation.mutate({
      query: lastUserMessage.content,
      response: lastAssistantMessage.content,
      analysis: lastAssistantMessage.analysis
    });
  };

  const handlePropertySelection = (propertyId: string, selected: boolean) => {
    setSelectedProperties(prev => 
      prev.map(p => p.id === propertyId ? { ...p, selected } : p)
    );
  };

  const predefinedQuestions = [
    {
      question: "Scénarios optimisation pour investissement Chypre depuis Suisse",
      icon: Calculator,
      description: "Analyse fiscale complète pour investisseurs suisses"
    },
    {
      question: "Avantages fiscaux résidence fiscale Chypre vs France",
      icon: TrendingUp,
      description: "Comparatif des régimes fiscaux"
    },
    {
      question: "Structures holding optimales pour immobilier Chypre",
      icon: Shield,
      description: "Optimisation via structures juridiques"
    },
    {
      question: "Exit tax et plus-values immobilières internationales",
      icon: PiggyBank,
      description: "Gestion des plus-values et exit tax"
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-secondary">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Accès Conseil Fiscal IA</h2>
            <p className="text-muted-foreground mb-4">
              Connectez-vous pour accéder à notre agent fiscal spécialisé
            </p>
            <Button className="btn-premium" asChild>
              <a href="/login">Se connecter</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="Conseil Fiscal IA - Agent Fiscal Spécialisé Chypre | ENKI-REALTY"
        description="Consultez notre agent fiscal IA spécialisé dans l'investissement immobilier à Chypre. Analyses personnalisées, scénarios d'optimisation fiscale et recommandations expertes pour tous les pays d'Europe."
        keywords="conseil fiscal IA, agent fiscal Chypre, optimisation fiscale, investissement immobilier, fiscalité européenne, intelligence artificielle fiscale"
        url="https://enki-realty.com/lexaia"
      />
      
      {/* Section Conseil Fiscal IA - Style exact "Commencer l'Expérience" */}
      <motion.section 
        className="bg-secondary py-40 md:py-50 px-4 md:px-8 relative overflow-hidden min-h-screen"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        {/* Premium background overlays - exactement comme homepage */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/15"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Titre section - même style que "Commencer l'Expérience" */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-primary text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Conseil Fiscal IA
          </motion.h1>

          {/* Texte intro - même style */}
          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto text-center mb-12 leading-loose"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Agent fiscal spécialisé dans l'investissement immobilier à Chypre avec connaissance complète des bases fiscales de tous les pays d'Europe et d'autres juridictions.
          </motion.p>

          {/* Disclaimer - style intégré */}
          <motion.div
            className="max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-yellow-50/80 border border-yellow-200/50 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.19-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Disclaimer Important</p>
                  <p className="leading-relaxed">
                    Tous les résultats et réponses de notre agent fiscal ne sont que des scénarios indicatifs. 
                    Ces scénarios sont obligatoirement à vérifier et à confirmer avec des avocats d'affaires.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interface Chat - exact style de la homepage */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1, 
              delay: 0.6, 
              type: "spring",
              damping: 15 
            }}
          >
            {/* Container principal avec hover glow - exactement comme homepage */}
            <motion.div
              className="relative group"
              whileHover={{
                scale: 1.02,
                transition: { 
                  type: "spring", 
                  damping: 15 
                }
              }}
            >
              {/* Glow effect on hover - exactement comme homepage */}
              <motion.div
                className="absolute -inset-2 z-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
              />
              
              <motion.div
                className="relative z-10 bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Messages Area */}
                <div className="h-96 overflow-y-auto p-6">
                  <AnimatePresence>
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Brain className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Prêt à optimiser votre fiscalité ?</h3>
                        <p className="text-gray-600 mb-6">
                          Posez votre première question à notre agent fiscal pour commencer
                        </p>
                        
                        {/* Questions prédéfinies */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
                          {predefinedQuestions.map((item, index) => (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              onClick={() => setCurrentQuery(item.question)}
                              className="p-3 text-left border border-gray-200 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                            >
                              <div className="flex items-start gap-3">
                                <item.icon className="w-4 h-4 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                                <div>
                                  <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors text-gray-800">
                                    {item.question}
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message, index) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                {message.type === 'user' ? (
                                  <User className="w-4 h-4 text-primary" />
                                ) : (
                                  <Brain className="w-4 h-4 text-purple-600" />
                                )}
                                <span className="text-sm font-medium text-gray-700">
                                  {message.type === 'user' ? 'Vous' : 'Agent Fiscal IA'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                              
                              <div className={`p-3 rounded-lg ${
                                message.type === 'user' 
                                  ? 'bg-primary text-white' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                <p className="text-sm leading-relaxed">{message.content}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie - style exact homepage */}
                <div className="p-6 border-t border-gray-100">
                  <Textarea
                    value={currentQuery}
                    onChange={(e) => setCurrentQuery(e.target.value)}
                    placeholder="Décrivez votre situation fiscale : ex. 'Français, investissement 500k € à Chypre – meilleures structures d'optimisation fiscale ?'"
                    className="w-full border-0 bg-transparent resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px] text-gray-800 placeholder:text-gray-500 text-lg leading-relaxed"
                  />
                  
                  {/* Barre d'actions - style exact homepage */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Brain className="w-4 h-4" />
                      <span>Consultation confidentielle et sécurisée</span>
                    </div>
                    <motion.button
                      className="px-8 py-3 bg-primary text-white rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!currentQuery.trim() || lexaiaQueryMutation.isPending}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmitQuery}
                    >
                      {lexaiaQueryMutation.isPending ? 'Analyse en cours...' : 'Analyser'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
};

export default LexaiaPage;