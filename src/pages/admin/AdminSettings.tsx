import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, Key, Globe, Shield, Database, 
  Settings, MessageSquare, Bell, Mail,
  FileText, Users, Building, Search,
  Languages
} from 'lucide-react';
import AIAgentsManager from '@/components/admin/settings/AIAgentsManager';
import WebsiteSettings from '@/components/admin/settings/WebsiteSettings';
import CommentsSettings from '@/components/admin/settings/CommentsSettings';
import NotificationsSettings from '@/components/admin/settings/NotificationsSettings';
import EmailSettings from '@/components/admin/settings/EmailSettings';

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('system');

  const ApiKeysSettings = () => (
    <div className="text-center text-gray-500 py-12">
      <Key className="w-12 h-12 mx-auto mb-4 text-gray-600" />
      <h3 className="text-lg font-medium mb-2">Gestion des Clés API</h3>
      <p>Bientôt disponible - Gestion centralisée des clés API</p>
    </div>
  );

  const LocalizationSettings = () => (
    <div className="text-center text-gray-500 py-12">
      <Languages className="w-12 h-12 mx-auto mb-4 text-gray-600" />
      <h3 className="text-lg font-medium mb-2">Paramètres de Langue</h3>
      <p>Bientôt disponible - Configuration multi-langues</p>
    </div>
  );

  const SecuritySettings = () => (
    <div className="text-center text-gray-500 py-12">
      <Shield className="w-12 h-12 mx-auto mb-4 text-gray-600" />
      <h3 className="text-lg font-medium mb-2">Configuration Sécurité</h3>
      <p>Bientôt disponible - Politiques de sécurité et contrôle d'accès</p>
    </div>
  );

  const DatabaseSettings = () => (
    <div className="text-center text-gray-500 py-12">
      <Database className="w-12 h-12 mx-auto mb-4 text-gray-600" />
      <h3 className="text-lg font-medium mb-2">Gestion Base de Données</h3>
      <p>Bientôt disponible - Santé et maintenance de la base</p>
    </div>
  );

  const ContentSettings = () => (
    <div className="text-center text-gray-500 py-12">
      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
      <h3 className="text-lg font-medium mb-2">Gestion du Contenu</h3>
      <p>Bientôt disponible - Personnalisation du contenu du site</p>
    </div>
  );

  const SEOSettings = () => (
    <div className="text-center text-gray-500 py-12">
      <Search className="w-12 h-12 mx-auto mb-4 text-gray-600" />
      <h3 className="text-lg font-medium mb-2">Configuration SEO</h3>
      <p>Bientôt disponible - Paramètres SEO avancés</p>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-2">
          Configuration complète de la plateforme et du site web
        </p>
      </div>

      {/* Navigation principale */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card 
          className={`cursor-pointer transition-all ${
            activeSection === 'system' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setActiveSection('system')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              Configuration Système
            </CardTitle>
            <CardDescription>
              Agents IA, API, sécurité, base de données
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            activeSection === 'website' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setActiveSection('website')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-600" />
              Paramètres Site Web
            </CardTitle>
            <CardDescription>
              Contenu, commentaires, notifications, emails
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Section Configuration Système */}
      {activeSection === 'system' && (
        <Card>
          <CardHeader>
            <CardTitle>Configuration Système</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ai-agents" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="ai-agents" className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-gray-600" />
                  Agents IA
                </TabsTrigger>
                <TabsTrigger value="api-keys" className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-gray-600" />
                  Clés API
                </TabsTrigger>
                <TabsTrigger value="localization" className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-gray-600" />
                  Langues
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-600" />
                  Sécurité
                </TabsTrigger>
                <TabsTrigger value="database" className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-gray-600" />
                  Base de données
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai-agents" className="mt-6">
                <AIAgentsManager />
              </TabsContent>

              <TabsContent value="api-keys" className="mt-6">
                <ApiKeysSettings />
              </TabsContent>

              <TabsContent value="localization" className="mt-6">
                <LocalizationSettings />
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <SecuritySettings />
              </TabsContent>

              <TabsContent value="database" className="mt-6">
                <DatabaseSettings />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Section Paramètres Site Web */}
      {activeSection === 'website' && (
        <Card>
          <CardHeader>
            <CardTitle>Paramètres Site Web</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-600" />
                  Général
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  Contenu
                </TabsTrigger>
                <TabsTrigger value="comments" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  Commentaires
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-600" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="emails" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  Emails
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-600" />
                  SEO
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-6">
                <WebsiteSettings />
              </TabsContent>

              <TabsContent value="content" className="mt-6">
                <ContentSettings />
              </TabsContent>

              <TabsContent value="comments" className="mt-6">
                <CommentsSettings />
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <NotificationsSettings />
              </TabsContent>

              <TabsContent value="emails" className="mt-6">
                <EmailSettings />
              </TabsContent>

              <TabsContent value="seo" className="mt-6">
                <SEOSettings />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}