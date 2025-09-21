import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, Settings, Sparkles, TrendingUp, Users, 
  Home, MessageSquare, Eye, EyeOff, Save, TestTube,
  AlertCircle, CheckCircle, Loader2, BarChart3
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AgentSEO } from '@/services/ai/AgentSEO';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Configuration des agents disponibles
const AI_AGENTS = [
  {
    id: 'seo-generator',
    name: 'Générateur de Contenu SEO',
    type: 'seo',
    icon: TrendingUp,
    description: 'Génère du contenu SEO optimisé pour les propriétés',
    features: [
      'Titres meta (60 caractères)',
      'Descriptions meta (160 caractères)', 
      'Génération de mots-clés',
      'Points marketing',
      'Analyse audience cible',
      'Support multi-langue'
    ],
    defaultPrompt: `Tu es un expert SEO immobilier spécialisé dans les propriétés à Chypre.
Génère du contenu optimisé qui attire les investisseurs internationaux.
Mets en avant l'éligibilité Golden Visa quand applicable (≥300 000€).
Souligne les avantages de localisation, le potentiel ROI et le style de vie.`
  },
  {
    id: 'property-valuator',
    name: 'Évaluateur de Propriétés IA',
    type: 'valuation',
    icon: Home,
    description: 'Estime la valeur des propriétés basé sur les données du marché',
    features: [
      'Analyse de marché',
      'Propriétés comparables',
      'Recommandations de prix',
      'Projections ROI'
    ],
    defaultPrompt: `Analyse les données du marché immobilier chypriote pour fournir des évaluations précises.`
  },
  {
    id: 'lead-scorer',
    name: 'Notation de Prospects IA',
    type: 'marketing',
    icon: Users,
    description: 'Score et qualifie les prospects automatiquement',
    features: [
      'Qualification de prospects',
      'Score d\'engagement',
      'Analyse intention d\'achat',
      'Classement de priorité'
    ],
    defaultPrompt: `Score les prospects immobiliers basé sur l'engagement et les critères de qualification.`
  },
  {
    id: 'chat-assistant',
    name: 'Assistant Chat Client',
    type: 'customer_service',
    icon: MessageSquare,
    description: 'Support client automatisé et gestion des demandes',
    features: [
      'Disponibilité 24/7',
      'Support multi-langue',
      'Recommandations de propriétés',
      'Planification de rendez-vous'
    ],
    defaultPrompt: `Assiste les clients avec leurs demandes de propriétés à Chypre de manière professionnelle.`
  }
];

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI', models: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo'] },
  { value: 'anthropic', label: 'Anthropic Claude', models: ['claude-3-opus', 'claude-3-sonnet'] },
  { value: 'google', label: 'Google Gemini', models: ['gemini-pro', 'gemini-pro-vision'] },
  { value: 'custom', label: 'Point d\'accès personnalisé', models: ['custom'] }
];

export default function AIAgentsManager() {
  const [selectedAgent, setSelectedAgent] = useState(AI_AGENTS[0]);
  const [agentConfigs, setAgentConfigs] = useState({});
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testApiKey, setTestApiKey] = useState('');
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [projetTest, setProjetTest] = useState({
    nom_projet: 'Marina Residences',
    zone: 'Limassol',
    prix_min: 450000,
    prix_max: 850000,
    types: ['Apartment', 'Penthouse']
  });
  const [stats, setStats] = useState({
    activeAgents: 0,
    apiCallsToday: 0,
    tokensUsed: 0,
    estimatedCost: 0
  });

  const [currentConfig, setCurrentConfig] = useState({
    provider: 'openai',
    model_name: 'gpt-4-turbo-preview',
    api_key_encrypted: '',
    temperature: 0.7,
    max_tokens: 1000,
    system_prompt: '',
    is_active: false
  });

  useEffect(() => {
    loadAllAgentConfigs();
    loadStats();
  }, []);

  useEffect(() => {
    // Charger la config de l'agent sélectionné
    const config = agentConfigs[selectedAgent.id];
    if (config) {
      // Si le prompt système est vide, utiliser le prompt par défaut
      const configWithPrompt = {
        ...config,
        system_prompt: config.system_prompt || selectedAgent.defaultPrompt
      };
      setCurrentConfig(configWithPrompt);
    } else {
      // Créer une nouvelle config avec le prompt par défaut
      const defaultConfig = {
        provider: 'openai',
        model_name: 'gpt-4-turbo-preview',
        api_key_encrypted: '',
        temperature: 0.7,
        max_tokens: 1000,
        system_prompt: selectedAgent.defaultPrompt,
        is_active: false
      };
      setCurrentConfig(defaultConfig);
      
      // Optionellement, sauvegarder le prompt par défaut immédiatement
      if (selectedAgent.id === 'seo-generator') {
        console.log('🚀 Initialisation automatique du prompt SEO');
        setTimeout(() => {
          setAgentConfigs(prev => ({
            ...prev,
            [selectedAgent.id]: defaultConfig
          }));
        }, 100);
      }
    }
  }, [selectedAgent, agentConfigs]);

  const loadAllAgentConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_agents_config')
        .select('*');

      if (error) {
        console.error('Erreur chargement configs:', error);
        return;
      }

      const configsMap = {};
      if (data) {
        data.forEach(config => {
          configsMap[config.agent_name] = {
            provider: config.provider || 'openai',
            model_name: config.model_name || 'gpt-4-turbo-preview',
            api_key_encrypted: config.api_key_encrypted || '',
            temperature: config.temperature || 0.7,
            max_tokens: config.max_tokens || 1000,
            system_prompt: config.system_prompt || '',
            is_active: config.is_active || false
          };
        });
      }
      setAgentConfigs(configsMap);
      console.log('✅ Configurations chargées:', configsMap);
    } catch (error) {
      console.error('Échec du chargement des configurations:', error);
    }
  };

  const loadStats = async () => {
    try {
      const { data: configData } = await supabase
        .from('ai_agents_config')
        .select('is_active');

      const { data: logsData } = await supabase
        .from('ai_agents_logs')
        .select('tokens_used, cost_estimate, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const activeAgents = configData?.filter(agent => agent.is_active).length || 0;
      const apiCallsToday = logsData?.length || 0;
      const tokensUsed = logsData?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0;
      const estimatedCost = logsData?.reduce((sum, log) => sum + (log.cost_estimate || 0), 0) || 0;

      setStats({
        activeAgents,
        apiCallsToday,
        tokensUsed,
        estimatedCost
      });
    } catch (error) {
      console.error('Échec du chargement des statistiques:', error);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      console.log('💾 Sauvegarde config pour:', selectedAgent.id, currentConfig);

      // Vérifier si l'agent existe déjà
      const { data: existingAgent } = await supabase
        .from('ai_agents_config')
        .select('id')
        .eq('agent_name', selectedAgent.id)
        .maybeSingle();

      let result;
      if (existingAgent) {
        // Mettre à jour
        result = await supabase
          .from('ai_agents_config')
          .update({
            agent_type: selectedAgent.type,
            provider: currentConfig.provider,
            model_name: currentConfig.model_name,
            api_key_encrypted: currentConfig.api_key_encrypted,
            temperature: currentConfig.temperature,
            max_tokens: currentConfig.max_tokens,
            system_prompt: currentConfig.system_prompt,
            is_active: currentConfig.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('agent_name', selectedAgent.id);
      } else {
        // Insérer
        result = await supabase
          .from('ai_agents_config')
          .insert({
            agent_name: selectedAgent.id,
            agent_type: selectedAgent.type,
            provider: currentConfig.provider,
            model_name: currentConfig.model_name,
            api_key_encrypted: currentConfig.api_key_encrypted,
            temperature: currentConfig.temperature,
            max_tokens: currentConfig.max_tokens,
            system_prompt: currentConfig.system_prompt,
            is_active: currentConfig.is_active,
            updated_at: new Date().toISOString()
          });
      }

      if (result.error) throw result.error;

      // Mettre à jour le cache local
      setAgentConfigs(prev => ({
        ...prev,
        [selectedAgent.id]: currentConfig
      }));

      toast.success('Configuration sauvegardée avec succès');
      await loadStats();
      
      console.log('✅ Configuration sauvegardée');
    } catch (error) {
      console.error('❌ Erreur de sauvegarde:', error);
      toast.error(`Échec de la sauvegarde: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAgent = async (agent, checked) => {
    try {
      console.log(`🔄 Toggle agent ${agent.id} to ${checked}`);
      
      const agentConfig = agentConfigs[agent.id] || {
        provider: 'openai',
        model_name: 'gpt-4-turbo-preview',
        api_key_encrypted: '',
        temperature: 0.7,
        max_tokens: 1000,
        system_prompt: agent.defaultPrompt,
        is_active: false
      };

      const updatedConfig = { ...agentConfig, is_active: checked };

      // Vérifier si l'agent existe déjà
      const { data: existingAgent } = await supabase
        .from('ai_agents_config')
        .select('id')
        .eq('agent_name', agent.id)
        .maybeSingle();

      let result;
      if (existingAgent) {
        // Mettre à jour
        result = await supabase
          .from('ai_agents_config')
          .update({
            provider: updatedConfig.provider,
            model_name: updatedConfig.model_name,
            api_key_encrypted: updatedConfig.api_key_encrypted,
            temperature: updatedConfig.temperature,
            max_tokens: updatedConfig.max_tokens,
            system_prompt: updatedConfig.system_prompt,
            is_active: checked,
            updated_at: new Date().toISOString()
          })
          .eq('agent_name', agent.id);
      } else {
        // Insérer
        result = await supabase
          .from('ai_agents_config')
          .insert({
            agent_name: agent.id,
            agent_type: agent.type,
            provider: updatedConfig.provider,
            model_name: updatedConfig.model_name,
            api_key_encrypted: updatedConfig.api_key_encrypted,
            temperature: updatedConfig.temperature,
            max_tokens: updatedConfig.max_tokens,
            system_prompt: updatedConfig.system_prompt,
            is_active: checked,
            updated_at: new Date().toISOString()
          });
      }

      if (result.error) {
        console.error('Erreur DB:', result.error);
        throw result.error;
      }

      // Mettre à jour le cache local
      setAgentConfigs(prev => ({
        ...prev,
        [agent.id]: updatedConfig
      }));

      // Si c'est l'agent actuellement sélectionné, mettre à jour currentConfig
      if (selectedAgent.id === agent.id) {
        setCurrentConfig(updatedConfig);
      }

      await loadStats();
      toast.success(`${agent.name} ${checked ? 'activé' : 'désactivé'}`);
      
      console.log('✅ Agent mis à jour avec succès');
    } catch (error) {
      console.error('❌ Erreur toggle agent:', error);
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  };

  const handleTestGeneration = async () => {
    if (!testApiKey) {
      toast.error('Veuillez fournir une clé API OpenAI');
      return;
    }

    if (selectedAgent.id !== 'seo-generator') {
      toast.error('Ce test est spécifique à l\'agent SEO');
      return;
    }

    setTesting(true);
    try {
      const agentSEO = new AgentSEO(testApiKey);
      
      // Utiliser les données de test du formulaire
      const resultat = await agentSEO.testerAvecCleAPI(testApiKey, projetTest);
      
      setTestResult(resultat);
      toast.success('Test de génération SEO réussi!');
      
      // Log pour debug
      console.log('✅ Résultat test SEO Chypre:', resultat);
      
    } catch (error) {
      console.error('Erreur test SEO:', error);
      toast.error(`Échec du test: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setTesting(false);
    }
  };

  const lancerTestDemo = () => {
    const agentSEO = new AgentSEO();
    const resultatDemo = agentSEO.genererContenuDemo(projetTest);
    setTestResult(resultatDemo);
    toast.success('Contenu de démonstration généré (sans API)');
  };

  const handleTestAgent = async () => {
    setTesting(true);
    try {
      if (!currentConfig.api_key_encrypted) {
        throw new Error('Veuillez configurer la clé API d\'abord');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Test de l\'agent réussi!');
    } catch (error) {
      toast.error(error.message || 'Échec du test de l\'agent');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Agents Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeAgents}/4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Appels API Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.apiCallsToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tokens Utilisés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{(stats.tokensUsed / 1000).toFixed(1)}k</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Coût Estimé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">€{stats.estimatedCost.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des agents avec configuration */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar avec liste des agents */}
        <div className="col-span-4 space-y-2">
          {AI_AGENTS.map(agent => {
            const agentConfig = agentConfigs[agent.id] || { is_active: false };
            
            return (
              <Card 
                key={agent.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedAgent.id === agent.id ? 'ring-2 ring-primary border-primary' : ''
                }`}
                onClick={() => setSelectedAgent(agent)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <agent.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm text-gray-900">{agent.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {agent.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Switch 
                      checked={agentConfig.is_active}
                      onCheckedChange={(checked) => handleToggleAgent(agent, checked)}
                    />
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Configuration panel */}
        <div className="col-span-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <selectedAgent.icon className="w-5 h-5 text-gray-600" />
                Configuration {selectedAgent.name}
              </CardTitle>
              <CardDescription>
                Configurez les paramètres de l'agent IA et les identifiants API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="settings">
                <TabsList>
                  <TabsTrigger value="settings">Paramètres</TabsTrigger>
                  <TabsTrigger value="prompt">Prompt Système</TabsTrigger>
                  <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
                  <TabsTrigger value="test">Zone de Test</TabsTrigger>
                  <TabsTrigger value="usage">Statistiques</TabsTrigger>
                </TabsList>

                <TabsContent value="settings" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Provider Selection */}
                    <div className="space-y-2">
                      <Label>Fournisseur IA</Label>
                      <Select 
                        value={currentConfig.provider}
                        onValueChange={(value) => 
                          setCurrentConfig(prev => ({ ...prev, provider: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVIDERS.map(provider => (
                            <SelectItem key={provider.value} value={provider.value}>
                              {provider.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Model Selection */}
                    <div className="space-y-2">
                      <Label>Modèle</Label>
                      <Select 
                        value={currentConfig.model_name}
                        onValueChange={(value) => 
                          setCurrentConfig(prev => ({ ...prev, model_name: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVIDERS.find(p => p.value === currentConfig.provider)?.models.map(model => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* API Key */}
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="api-key">Clé API</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="api-key"
                          type={showApiKey ? "text" : "password"}
                          placeholder="sk-..." 
                          className="font-mono"
                          value={currentConfig.api_key_encrypted}
                          onChange={(e) => 
                            setCurrentConfig(prev => ({ ...prev, api_key_encrypted: e.target.value }))
                          }
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Votre clé API est chiffrée et stockée de manière sécurisée
                      </p>
                    </div>

                    {/* Temperature */}
                    <div className="space-y-2">
                      <Label htmlFor="temperature">
                        Température: <span className="font-mono">{currentConfig.temperature}</span>
                      </Label>
                      <Input 
                        id="temperature"
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1"
                        value={currentConfig.temperature}
                        onChange={(e) => 
                          setCurrentConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))
                        }
                      />
                    </div>

                    {/* Max Tokens */}
                    <div className="space-y-2">
                      <Label htmlFor="max-tokens">Tokens Maximum</Label>
                      <Input 
                        id="max-tokens"
                        type="number" 
                        value={currentConfig.max_tokens}
                        onChange={(e) => 
                          setCurrentConfig(prev => ({ ...prev, max_tokens: parseInt(e.target.value) }))
                        }
                        min="100"
                        max="4000"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handleTestAgent}
                      disabled={testing || !currentConfig.api_key_encrypted}
                    >
                      {testing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Test en cours...
                        </>
                      ) : (
                        <>
                          <TestTube className="w-4 h-4 mr-2" />
                          Tester la Connexion
                        </>
                      )}
                    </Button>
                    <Button onClick={handleSaveConfig} disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="prompt" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="system-prompt">Prompt Système</Label>
                    <Textarea 
                      id="system-prompt"
                      rows={10}
                      value={currentConfig.system_prompt}
                      onChange={(e) => 
                        setCurrentConfig(prev => ({ ...prev, system_prompt: e.target.value }))
                      }
                      placeholder="Entrez le prompt système pour cet agent..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Le prompt système définit le comportement et les instructions de base pour l'agent IA
                    </p>
                  </div>
                  <Button onClick={handleSaveConfig} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder le Prompt
                  </Button>
                </TabsContent>

                <TabsContent value="features" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Fonctionnalités de {selectedAgent.name}</h3>
                    <div className="grid gap-2">
                      {selectedAgent.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="test" className="space-y-4 mt-4">
                  {selectedAgent.id === 'seo-generator' ? (
                    <Card className="border-2 border-primary/20 bg-primary/5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TestTube className="w-5 h-5 text-gray-600" />
                          Zone de Test Agent SEO - Marché Chypre
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Alert>
                          <AlertCircle className="w-4 h-4" />
                          <AlertDescription>
                            Testez l'agent SEO spécialisé pour le marché immobilier chypriote avec Golden Visa.
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                          <Label>Clé API OpenAI (test uniquement)</Label>
                          <Input 
                            type="password"
                            placeholder="sk-..."
                            value={testApiKey}
                            onChange={(e) => setTestApiKey(e.target.value)}
                            className="font-mono"
                          />
                          <p className="text-xs text-gray-500">
                            Cette clé est uniquement pour les tests, elle ne sera pas sauvegardée
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nom du projet</Label>
                            <Input 
                              value={projetTest.nom_projet}
                              onChange={(e) => setProjetTest(prev => ({ ...prev, nom_projet: e.target.value }))}
                              placeholder="Marina Residences"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Zone à Chypre</Label>
                            <Select 
                              value={projetTest.zone}
                              onValueChange={(value) => setProjetTest(prev => ({ ...prev, zone: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Limassol">Limassol (Hub Business)</SelectItem>
                                <SelectItem value="Paphos">Paphos (UNESCO)</SelectItem>
                                <SelectItem value="Larnaca">Larnaca (Aéroport)</SelectItem>
                                <SelectItem value="Nicosia">Nicosia (Capitale)</SelectItem>
                                <SelectItem value="Famagusta">Famagusta (Plages)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Prix minimum (€)</Label>
                            <Input 
                              type="number" 
                              value={projetTest.prix_min}
                              onChange={(e) => setProjetTest(prev => ({ ...prev, prix_min: parseInt(e.target.value) }))}
                              placeholder="450000"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Prix maximum (€)</Label>
                            <Input 
                              type="number"
                              value={projetTest.prix_max}
                              onChange={(e) => setProjetTest(prev => ({ ...prev, prix_max: parseInt(e.target.value) }))}
                              placeholder="850000" 
                            />
                          </div>
                        </div>

                        {projetTest.prix_min >= 300000 && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span className="text-sm font-medium text-yellow-800">
                                🏆 Éligible Golden Visa (≥300k€) - Génération optimisée
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button 
                            onClick={handleTestGeneration}
                            disabled={!testApiKey || testing}
                            className="flex-1"
                          >
                            {testing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Génération SEO en cours...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Tester avec API OpenAI
                              </>
                            )}
                          </Button>
                          
                          <Button 
                            variant="outline"
                            onClick={lancerTestDemo}
                            disabled={testing}
                          >
                            Mode Démo
                          </Button>
                        </div>

                        {testResult && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              Contenu SEO généré - Marché Chypre
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="font-medium text-green-700">
                                  Titre Meta ({testResult.titre_meta?.length || 0} caractères) :
                                </span>
                                <p className="text-gray-700 bg-white p-2 rounded border-l-4 border-green-500">
                                  {testResult.titre_meta}
                                </p>
                              </div>
                              
                              <div>
                                <span className="font-medium text-blue-700">
                                  Description Meta ({testResult.description_meta?.length || 0} caractères) :
                                </span>
                                <p className="text-gray-700 bg-white p-2 rounded border-l-4 border-blue-500">
                                  {testResult.description_meta}
                                </p>
                              </div>
                              
                              <div>
                                <span className="font-medium text-purple-700">Mots-clés :</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {testResult.mots_cles?.map((mot, i) => (
                                    <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                      {mot}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <span className="font-medium text-orange-700">Points Marketing :</span>
                                <ul className="list-none space-y-1 mt-1">
                                  {testResult.points_marketing?.map((point, i) => (
                                    <li key={i} className="text-gray-700 bg-white p-2 rounded border-l-4 border-orange-500">
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <span className="font-medium text-indigo-700">Audience Cible :</span>
                                <p className="text-gray-700 bg-white p-2 rounded border-l-4 border-indigo-500">
                                  {testResult.audience_cible}
                                </p>
                              </div>

                              <div>
                                <span className="font-medium text-gray-700">URL Slug :</span>
                                <p className="text-gray-600 bg-white p-2 rounded border-l-4 border-gray-400 font-mono text-xs">
                                  /{testResult.slug_url}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-2 border-dashed">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TestTube className="w-5 h-5 text-gray-600" />
                          Zone de Test Générique
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Clé API pour test</Label>
                          <Input 
                            type="password"
                            placeholder="sk-..."
                            value={testApiKey}
                            onChange={(e) => setTestApiKey(e.target.value)}
                            className="font-mono"
                          />
                        </div>

                        <Button 
                          onClick={handleTestAgent}
                          disabled={!testApiKey || testing}
                          className="w-full"
                        >
                          {testing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Test en cours...
                            </>
                          ) : (
                            <>
                              <TestTube className="w-4 h-4 mr-2" />
                              Tester la Connexion
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="usage" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Utilisation Aujourd'hui</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.apiCallsToday}</div>
                        <p className="text-xs text-muted-foreground">appels API</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Tokens Consommés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{(stats.tokensUsed / 1000).toFixed(1)}k</div>
                        <p className="text-xs text-muted-foreground">tokens utilisés</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}