import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Mail, Send, FileText, TestTube } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailSettings() {
  const [settings, setSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'contact@enkirealty.com',
    smtpPassword: '',
    fromName: 'Enki Realty',
    fromEmail: 'contact@enkirealty.com',
    replyTo: 'support@enkirealty.com',
    enableTLS: true,
    emailEnabled: true
  });

  const [templates, setTemplates] = useState({
    welcome: {
      subject: 'Bienvenue chez Enki Realty',
      body: `Bonjour {{name}},\n\nBienvenue sur notre plateforme immobilière premium.\n\nCordialement,\nL'équipe Enki Realty`
    },
    propertyInquiry: {
      subject: 'Nouvelle demande pour {{property_title}}',
      body: `Bonjour,\n\nVous avez reçu une nouvelle demande pour la propriété : {{property_title}}\n\nDétails du contact :\nNom: {{contact_name}}\nEmail: {{contact_email}}\nTéléphone: {{contact_phone}}\n\nMessage:\n{{message}}`
    },
    viewingConfirmation: {
      subject: 'Confirmation de visite - {{property_title}}',
      body: `Bonjour {{client_name}},\n\nVotre visite est confirmée :\n\nPropriété : {{property_title}}\nDate : {{viewing_date}}\nHeure : {{viewing_time}}\nAdresse : {{property_address}}\n\nÀ bientôt !`
    }
  });

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Ici on sauvegarderait dans la base de données
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configuration email sauvegardée');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setTesting(true);
    try {
      // Simuler l'envoi d'un email de test
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Email de test envoyé avec succès');
    } catch (error) {
      toast.error('Échec de l\'envoi de l\'email de test');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="smtp" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="smtp" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Configuration SMTP
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="smtp" className="space-y-6">
          {/* Configuration SMTP */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-600" />
                Configuration SMTP
              </CardTitle>
              <CardDescription>Paramètres du serveur d'envoi d'emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Service email activé</Label>
                  <p className="text-sm text-gray-500">Activer l'envoi d'emails automatiques</p>
                </div>
                <Switch 
                  checked={settings.emailEnabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, emailEnabled: checked }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Serveur SMTP</Label>
                  <Input 
                    value={settings.smtpHost}
                    onChange={(e) => setSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Port</Label>
                  <Input 
                    value={settings.smtpPort}
                    onChange={(e) => setSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom d'utilisateur</Label>
                  <Input 
                    value={settings.smtpUser}
                    onChange={(e) => setSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                    placeholder="contact@enkirealty.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mot de passe</Label>
                  <Input 
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => setSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Chiffrement TLS</Label>
                  <p className="text-sm text-gray-500">Utiliser une connexion sécurisée</p>
                </div>
                <Switch 
                  checked={settings.enableTLS}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, enableTLS: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Paramètres d'envoi */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Paramètres d'Envoi</CardTitle>
              <CardDescription>Configuration des adresses d'expédition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom de l'expéditeur</Label>
                  <Input 
                    value={settings.fromName}
                    onChange={(e) => setSettings(prev => ({ ...prev, fromName: e.target.value }))}
                    placeholder="Enki Realty"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email de l'expéditeur</Label>
                  <Input 
                    type="email"
                    value={settings.fromEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                    placeholder="contact@enkirealty.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email de réponse</Label>
                <Input 
                  type="email"
                  value={settings.replyTo}
                  onChange={(e) => setSettings(prev => ({ ...prev, replyTo: e.target.value }))}
                  placeholder="support@enkirealty.com"
                />
                <p className="text-xs text-gray-500">
                  Adresse où seront dirigées les réponses aux emails automatiques
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Template de bienvenue */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email de Bienvenue</CardTitle>
              <CardDescription>Envoyé lors de l'inscription d'un nouveau client</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sujet</Label>
                <Input 
                  value={templates.welcome.subject}
                  onChange={(e) => setTemplates(prev => ({
                    ...prev,
                    welcome: { ...prev.welcome, subject: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Contenu</Label>
                <Textarea 
                  rows={6}
                  value={templates.welcome.body}
                  onChange={(e) => setTemplates(prev => ({
                    ...prev,
                    welcome: { ...prev.welcome, body: e.target.value }
                  }))}
                />
                <p className="text-xs text-gray-500">
                  Variables disponibles: {`{{name}}, {{email}}, {{date}}`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Template de demande de propriété */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Demande de Propriété</CardTitle>
              <CardDescription>Notification interne lors d'une demande</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sujet</Label>
                <Input 
                  value={templates.propertyInquiry.subject}
                  onChange={(e) => setTemplates(prev => ({
                    ...prev,
                    propertyInquiry: { ...prev.propertyInquiry, subject: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Contenu</Label>
                <Textarea 
                  rows={8}
                  value={templates.propertyInquiry.body}
                  onChange={(e) => setTemplates(prev => ({
                    ...prev,
                    propertyInquiry: { ...prev.propertyInquiry, body: e.target.value }
                  }))}
                />
                <p className="text-xs text-gray-500">
                  Variables: {`{{property_title}}, {{contact_name}}, {{contact_email}}, {{contact_phone}}, {{message}}`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Template de confirmation de visite */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Confirmation de Visite</CardTitle>
              <CardDescription>Envoyé lors de la confirmation d'un rendez-vous</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Sujet</Label>
                <Input 
                  value={templates.viewingConfirmation.subject}
                  onChange={(e) => setTemplates(prev => ({
                    ...prev,
                    viewingConfirmation: { ...prev.viewingConfirmation, subject: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Contenu</Label>
                <Textarea 
                  rows={8}
                  value={templates.viewingConfirmation.body}
                  onChange={(e) => setTemplates(prev => ({
                    ...prev,
                    viewingConfirmation: { ...prev.viewingConfirmation, body: e.target.value }
                  }))}
                />
                <p className="text-xs text-gray-500">
                  Variables: {`{{client_name}}, {{property_title}}, {{viewing_date}}, {{viewing_time}}, {{property_address}}`}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TestTube className="w-5 h-5 text-gray-600" />
                Test d'Envoi d'Email
              </CardTitle>
              <CardDescription>Testez votre configuration email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email de test</Label>
                <Input 
                  type="email"
                  placeholder="test@example.com"
                  defaultValue={settings.fromEmail}
                />
                <p className="text-xs text-gray-500">
                  Adresse où envoyer l'email de test
                </p>
              </div>

              <div className="space-y-2">
                <Label>Type de template à tester</Label>
                <Select defaultValue="welcome">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Email de bienvenue</SelectItem>
                    <SelectItem value="propertyInquiry">Demande de propriété</SelectItem>
                    <SelectItem value="viewingConfirmation">Confirmation de visite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleTestEmail}
                disabled={testing || !settings.emailEnabled}
                className="w-full"
              >
                {testing ? (
                  <>
                    <TestTube className="w-4 h-4 mr-2 animate-pulse" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer Email de Test
                  </>
                )}
              </Button>

              {!settings.emailEnabled && (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  ⚠️ Le service email est désactivé. Activez-le dans l'onglet Configuration SMTP.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Sauvegarde...' : 'Enregistrer les paramètres'}
        </Button>
      </div>
    </div>
  );
}