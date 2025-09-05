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
          title: `Analyse Lexaia - ${new Date().toLocaleDateString()}`,
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
      <div className="min-h-screen pt-16 flex items-center justify-center bg-muted/30">
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
      
      <div className="min-h-screen pt-16 bg-gradient-to-br from-muted/30 to-background">
        {/* Background Premium Overlays - même style que la homepage */}
        <motion.div 
          className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 pointer-events-none"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.div 
          className="fixed top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          {/* Header - Style homepage */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h1 
                className="text-5xl md:text-7xl font-bold text-primary"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Conseil Fiscal IA
              </motion.h1>
              <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg text-sm px-4 py-2">
                Agent Spécialisé
              </Badge>
            </div>
            
            <motion.p 
              className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Agent fiscal spécialisé dans l'investissement immobilier à Chypre avec connaissance complète des bases fiscales de tous les pays d'Europe et d'autres juridictions
            </motion.p>
            
            {/* Disclaimer - Style premium homepage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl p-6 max-w-5xl mx-auto shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.19-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-yellow-800">
                  <p className="font-bold text-base mb-2">Disclaimer Important</p>
                  <p className="leading-relaxed">
                    Tous les résultats et réponses de notre agent fiscal ne sont que des scénarios indicatifs. 
                    Ces scénarios sont obligatoirement à vérifier et à confirmer avec des avocats d'affaires 
                    pour valider les recommandations et s'assurer de leur conformité avec votre situation spécifique.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Chat Interface - Style premium homepage */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <Card className="h-[70vh] flex flex-col shadow-2xl border-border/20 bg-card/95 backdrop-blur-sm overflow-hidden">
                  {/* Premium background overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                  
                  <CardHeader className="border-b border-border relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Consultation Fiscale
                      </CardTitle>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        En ligne
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPropertySelector(true)}
                        disabled={userProperties.length === 0}
                      >
                        <Building className="w-4 h-4 mr-2" />
                        Sélectionner biens ({selectedProperties.filter(p => p.selected).length})
                      </Button>
                      {messages.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generatePDFMutation.mutate()}
                          disabled={generatePDFMutation.isPending}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-6 relative z-10">
                  <AnimatePresence>
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <Sparkles className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">Prêt à optimiser votre fiscalité ?</h3>
                        <p className="text-muted-foreground mb-6">
                          Posez votre première question à notre agent fiscal pour commencer
                        </p>
                        
                        {/* Predefined Questions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                          {predefinedQuestions.map((item, index) => (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              onClick={() => setCurrentQuery(item.question)}
                              className="p-4 text-left border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                            >
                              <div className="flex items-start gap-3">
                                <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                                <div>
                                  <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                                    {item.question}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
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
                                  <User className="w-5 h-5 text-primary" />
                                ) : (
                                  <Bot className="w-5 h-5 text-purple-600" />
                                )}
                                <span className="text-sm font-medium">
                                  {message.type === 'user' ? 'Vous' : 'Agent Fiscal IA'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                              
                              <div className={`p-4 rounded-lg ${
                                message.type === 'user' 
                                  ? 'bg-primary text-white' 
                                  : 'bg-muted border border-border'
                              }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                  {message.content}
                                </p>
                                
                                {/* Analysis Section for AI responses */}
                                {message.type === 'assistant' && message.analysis && (
                                  <div className="mt-4 pt-4 border-t border-border/20">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setExpandedMessage(
                                        expandedMessage === message.id ? null : message.id
                                      )}
                                      className="mb-3 h-auto p-0 text-xs"
                                    >
                                      <span className="flex items-center gap-1">
                                        Analyse détaillée
                                        {expandedMessage === message.id ? (
                                          <ChevronUp className="w-3 h-3" />
                                        ) : (
                                          <ChevronDown className="w-3 h-3" />
                                        )}
                                      </span>
                                    </Button>
                                    
                                    <AnimatePresence>
                                      {expandedMessage === message.id && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="space-y-3"
                                        >
                                          {message.analysis.tax_optimization && (
                                            <div>
                                              <h5 className="text-xs font-semibold mb-2 text-green-600">
                                                💰 Optimisations fiscales:
                                              </h5>
                                              <ul className="text-xs space-y-1">
                                                {message.analysis.tax_optimization.map((item: string, i: number) => (
                                                  <li key={i} className="flex items-start gap-2">
                                                    <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                                    {item}
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                          
                                          {message.analysis.recommendations && (
                                            <div>
                                              <h5 className="text-xs font-semibold mb-2 text-blue-600">
                                                🎯 Recommandations:
                                              </h5>
                                              <ul className="text-xs space-y-1">
                                                {message.analysis.recommendations.map((item: string, i: number) => (
                                                  <li key={i} className="flex items-start gap-2">
                                                    <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                                    {item}
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                          
                                          {message.analysis.savings_potential && (
                                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                              <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                                                💡 Potentiel d'économie: €{message.analysis.savings_potential.toLocaleString()}
                                              </p>
                                            </div>
                                          )}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )}
                                
                                {/* Action buttons for AI responses */}
                                {message.type === 'assistant' && (
                                  <div className="flex gap-2 mt-3">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => navigator.clipboard.writeText(message.content)}
                                      className="h-auto p-1 text-xs"
                                    >
                                      <Copy className="w-3 h-3 mr-1" />
                                      Copier
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={handleSaveConversation}
                                      disabled={saveQueryMutation.isPending}
                                      className="h-auto p-1 text-xs"
                                    >
                                      <Save className="w-3 h-3 mr-1" />
                                      Sauvegarder
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        {lexaiaQueryMutation.isPending && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                          >
                            <div className="max-w-[80%]">
                              <div className="flex items-center gap-2 mb-2">
                                <Bot className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-medium">Agent Fiscal IA</span>
                              </div>
                              <div className="bg-muted border border-border p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    Analyse en cours...
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t border-border p-6 relative z-10">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Textarea
                        value={currentQuery}
                        onChange={(e) => setCurrentQuery(e.target.value)}
                        placeholder="Posez votre question fiscale... (ex: 'Scénarios optimisation pour investissement Chypre depuis Suisse')"
                        className="min-h-[60px] resize-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmitQuery();
                          }
                        }}
                      />
                      {selectedProperties.filter(p => p.selected).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {selectedProperties.filter(p => p.selected).map(property => (
                            <Badge key={property.id} variant="secondary" className="text-xs">
                              {property.title}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleSubmitQuery}
                      disabled={!currentQuery.trim() || lexaiaQueryMutation.isPending}
                      className="btn-premium h-[60px] px-6"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar - Style premium homepage */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Saved Queries */}
              <Card className="shadow-lg border-border/20 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Analyses Sauvegardées</CardTitle>
                  <CardDescription>Vos consultations précédentes</CardDescription>
                </CardHeader>
                <CardContent>
                  {savedQueries.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune analyse sauvegardée
                    </p>
                  ) : (
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {savedQueries.map((query) => (
                          <motion.div
                            key={query.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => setCurrentQuery(query.query)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-xs font-medium line-clamp-2">
                                {query.query}
                              </p>
                              {query.starred && (
                                <Star className="w-3 h-3 text-yellow-500 flex-shrink-0 ml-1" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(query.created_at).toLocaleDateString()}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-lg border-border/20 bg-card/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Consultations:</span>
                    <Badge variant="secondary">{savedQueries.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Cette session:</span>
                    <Badge variant="secondary">{messages.filter(m => m.type === 'user').length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Biens sélectionnés:</span>
                    <Badge variant="secondary">{selectedProperties.filter(p => p.selected).length}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Property Selector Modal */}
        <Dialog open={showPropertySelector} onOpenChange={setShowPropertySelector}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Sélectionner vos biens</DialogTitle>
              <DialogDescription>
                Choisissez les propriétés à inclure dans l'analyse
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {userProperties.map((property) => (
                <div key={property.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                  <Checkbox
                    checked={selectedProperties.find(p => p.id === property.id)?.selected || false}
                    onCheckedChange={(checked) => handlePropertySelection(property.id, !!checked)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{property.title}</p>
                    <p className="text-xs text-muted-foreground">{property.location}</p>
                    <p className="text-xs text-primary font-semibold">{property.price}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowPropertySelector(false)}>
                Fermer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default LexaiaPage;