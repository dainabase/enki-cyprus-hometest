import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Upload, Image, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function WebsiteSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Enki Realty',
    siteDescription: 'Investissements immobiliers premium à Chypre',
    contactEmail: 'contact@enkirealty.com',
    contactPhone: '+357 25 123 456',
    address: 'Limassol, Chypre',
    socialMediaEnabled: true,
    maintenanceMode: false,
    cookiesEnabled: true,
    analyticsEnabled: true
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Ici on sauvegarderait dans la base de données
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations Générales</CardTitle>
            <CardDescription>Configuration de base du site web</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Nom du site</Label>
                <Input 
                  id="site-name"
                  value={settings.siteName}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email de contact</Label>
                <Input 
                  id="contact-email"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-description">Description du site</Label>
              <Textarea 
                id="site-description"
                rows={3}
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Téléphone de contact</Label>
                <Input 
                  id="contact-phone"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input 
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logos et images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Image className="w-5 h-5 text-gray-600" />
              Logos et Images
            </CardTitle>
            <CardDescription>Gérez les logos et images du site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Logo principal</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <Button variant="outline" size="sm">
                    Télécharger
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Logo mode sombre</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <Button variant="outline" size="sm">
                    Télécharger
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <Button variant="outline" size="sm">
                    Télécharger
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fonctionnalités */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fonctionnalités du Site</CardTitle>
            <CardDescription>Activez ou désactivez les fonctionnalités</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Réseaux sociaux</Label>
                  <p className="text-sm text-gray-500">Afficher les liens vers les réseaux sociaux</p>
                </div>
                <Switch 
                  checked={settings.socialMediaEnabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, socialMediaEnabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Mode maintenance</Label>
                  <p className="text-sm text-gray-500">Afficher une page de maintenance</p>
                </div>
                <Switch 
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, maintenanceMode: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Cookies de consentement</Label>
                  <p className="text-sm text-gray-500">Bannière de consentement aux cookies</p>
                </div>
                <Switch 
                  checked={settings.cookiesEnabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, cookiesEnabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Analytics</Label>
                  <p className="text-sm text-gray-500">Suivi des visiteurs et analytics</p>
                </div>
                <Switch 
                  checked={settings.analyticsEnabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, analyticsEnabled: checked }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localisation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              Localisation
            </CardTitle>
            <CardDescription>Paramètres de localisation et langue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Langue par défaut</Label>
                <Select defaultValue="fr">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="el">Ελληνικά</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fuseau horaire</Label>
                <Select defaultValue="europe/nicosia">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="europe/nicosia">Europe/Nicosia</SelectItem>
                    <SelectItem value="europe/paris">Europe/Paris</SelectItem>
                    <SelectItem value="europe/london">Europe/London</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Devise</Label>
                <Select defaultValue="eur">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Format de date</Label>
                <Select defaultValue="dd/mm/yyyy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Sauvegarde...' : 'Enregistrer les paramètres'}
        </Button>
      </div>
    </div>
  );
}