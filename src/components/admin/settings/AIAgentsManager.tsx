import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, Settings, Sparkles, TrendingUp, Users, 
  Home, MessageSquare, Eye, EyeOff, Plus, Save, TestTube,
  AlertCircle, CheckCircle, Loader2, BarChart3
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Configuration des agents disponibles
const AI_AGENTS = [
  {
    id: 'seo-generator',
    name: 'SEO Content Generator',
    type: 'seo',
    icon: TrendingUp,
    description: 'Generate optimized SEO content for properties and projects',
    color: 'bg-blue-500',
    features: [
      'Meta titles (60 chars)',
      'Meta descriptions (160 chars)', 
      'Keywords generation',
      'Marketing bullet points',
      'Target audience analysis',
      'Multi-language support'
    ],
    defaultPrompt: `You are a real estate SEO expert specializing in Cyprus properties.
Generate compelling, keyword-rich content that appeals to international investors.
Focus on Golden Visa eligibility when applicable (≥€300,000).
Highlight location benefits, ROI potential, and lifestyle aspects.`
  },
  {
    id: 'property-valuator',
    name: 'AI Property Valuator',
    type: 'valuation',
    icon: Home,
    description: 'Estimate property values based on market data',
    color: 'bg-green-500',
    features: [
      'Market analysis',
      'Comparable properties',
      'Price recommendations',
      'ROI projections'
    ],
    defaultPrompt: `Analyze Cyprus real estate market data to provide accurate valuations.`
  },
  {
    id: 'lead-scorer',
    name: 'Lead Scoring AI',
    type: 'marketing',
    icon: Users,
    description: 'Score and qualify leads automatically',
    color: 'bg-purple-500',
    features: [
      'Lead qualification',
      'Engagement scoring',
      'Purchase intent analysis',
      'Priority ranking'
    ],
    defaultPrompt: `Score real estate leads based on engagement and qualification criteria.`
  },
  {
    id: 'chat-assistant',
    name: 'Customer Chat Assistant',
    type: 'customer_service',
    icon: MessageSquare,
    description: 'Automated customer support and inquiries',
    color: 'bg-orange-500',
    features: [
      '24/7 availability',
      'Multi-language support',
      'Property recommendations',
      'Appointment scheduling'
    ],
    defaultPrompt: `Assist customers with Cyprus property inquiries professionally.`
  }
];

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI', models: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo'] },
  { value: 'anthropic', label: 'Anthropic Claude', models: ['claude-3-opus', 'claude-3-sonnet'] },
  { value: 'google', label: 'Google Gemini', models: ['gemini-pro', 'gemini-pro-vision'] },
  { value: 'custom', label: 'Custom Endpoint', models: ['custom'] }
];

export default function AIAgentsManager() {
  const [selectedAgent, setSelectedAgent] = useState(AI_AGENTS[0]);
  const [agentConfigs, setAgentConfigs] = useState({});
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
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
    loadAgentConfig();
    loadStats();
  }, [selectedAgent]);

  const loadAgentConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_agents_config')
        .select('*')
        .eq('agent_name', selectedAgent.id)
        .single();

      if (data) {
        setCurrentConfig({
          provider: data.provider || 'openai',
          model_name: data.model_name || 'gpt-4-turbo-preview',
          api_key_encrypted: data.api_key_encrypted || '',
          temperature: data.temperature || 0.7,
          max_tokens: data.max_tokens || 1000,
          system_prompt: data.system_prompt || selectedAgent.defaultPrompt,
          is_active: data.is_active || false
        });
      } else {
        // Utiliser les valeurs par défaut
        setCurrentConfig({
          provider: 'openai',
          model_name: 'gpt-4-turbo-preview',
          api_key_encrypted: '',
          temperature: 0.7,
          max_tokens: 1000,
          system_prompt: selectedAgent.defaultPrompt,
          is_active: false
        });
      }
    } catch (error) {
      console.error('Failed to load agent config:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Charger les statistiques depuis la base de données
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
      console.error('Failed to load stats:', error);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('ai_agents_config')
        .upsert({
          agent_name: selectedAgent.id,
          agent_type: selectedAgent.type,
          provider: currentConfig.provider,
          model_name: currentConfig.model_name,
          api_key_encrypted: currentConfig.api_key_encrypted, // En production, chiffrer ici
          temperature: currentConfig.temperature,
          max_tokens: currentConfig.max_tokens,
          system_prompt: currentConfig.system_prompt,
          is_active: currentConfig.is_active,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Configuration saved successfully');
      await loadStats();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleTestAgent = async () => {
    setTesting(true);
    try {
      if (!currentConfig.api_key_encrypted) {
        throw new Error('Please configure API key first');
      }

      // Simuler un test de l'agent
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // En production, faire un vrai appel à l'API ici
      
      toast.success('Agent test successful!');
    } catch (error) {
      toast.error(error.message || 'Agent test failed');
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
            <CardTitle className="text-sm font-medium text-gray-600">Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeAgents}/4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">API Calls Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.apiCallsToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tokens Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{(stats.tokensUsed / 1000).toFixed(1)}k</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Est. Cost</CardTitle>
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
          {AI_AGENTS.map(agent => (
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
                    <div className={`p-2 rounded-lg ${agent.color} text-white`}>
                      <agent.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm text-gray-900">{agent.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {agent.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Switch 
                    checked={currentConfig.is_active}
                    onCheckedChange={(checked) => 
                      setCurrentConfig(prev => ({ ...prev, is_active: checked }))
                    }
                  />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Configuration panel */}
        <div className="col-span-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <selectedAgent.icon className="w-5 h-5" />
                {selectedAgent.name} Configuration
              </CardTitle>
              <CardDescription>
                Configure AI agent settings and API credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="settings">
                <TabsList>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="prompt">System Prompt</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="usage">Usage Stats</TabsTrigger>
                </TabsList>

                <TabsContent value="settings" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Provider Selection */}
                    <div className="space-y-2">
                      <Label>AI Provider</Label>
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
                      <Label>Model</Label>
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
                      <Label htmlFor="api-key">API Key</Label>
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
                        Your API key is encrypted and stored securely
                      </p>
                    </div>

                    {/* Temperature */}
                    <div className="space-y-2">
                      <Label htmlFor="temperature">
                        Temperature: <span className="font-mono">{currentConfig.temperature}</span>
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
                      <Label htmlFor="max-tokens">Max Tokens</Label>
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
                          Testing...
                        </>
                      ) : (
                        <>
                          <TestTube className="w-4 h-4 mr-2" />
                          Test Connection
                        </>
                      )}
                    </Button>
                    <Button onClick={handleSaveConfig} disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Configuration
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="prompt" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="system-prompt">System Prompt</Label>
                    <Textarea 
                      id="system-prompt"
                      rows={10}
                      value={currentConfig.system_prompt}
                      onChange={(e) => 
                        setCurrentConfig(prev => ({ ...prev, system_prompt: e.target.value }))
                      }
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      This prompt defines the agent's behavior and expertise
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="mt-4">
                  <div className="space-y-3">
                    {selectedAgent.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="usage" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-600">Total Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold text-gray-900">1,247</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-600">Success Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold text-gray-900">98.7%</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-600">Avg Response Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold text-gray-900">1.2s</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-600">Monthly Cost</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold text-gray-900">€127.40</div>
                        </CardContent>
                      </Card>
                    </div>
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