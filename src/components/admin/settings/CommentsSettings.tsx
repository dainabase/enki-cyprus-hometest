import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, MessageSquare, Shield, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function CommentsSettings() {
  const [settings, setSettings] = useState({
    commentsEnabled: true,
    autoModeration: false,
    emailNotifications: true,
    bannedWords: 'spam, arnaque, fake',
    confidenceThreshold: 'medium',
    publicationDelay: '0',
    commentsPerPage: 10,
    showAvatars: true,
    allowReplies: true,
    enableRating: false
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Ici on sauvegarderait dans la base de données
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Paramètres des commentaires sauvegardés');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Activation commentaires */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              Activation des Commentaires
            </CardTitle>
            <CardDescription>Configurez les commentaires sur les propriétés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Commentaires sur les propriétés</Label>
                <p className="text-sm text-gray-500">Permettre aux visiteurs de commenter</p>
              </div>
              <Switch 
                checked={settings.commentsEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, commentsEnabled: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Modération automatique</Label>
                <p className="text-sm text-gray-500">Approuver automatiquement les commentaires vérifiés</p>
              </div>
              <Switch 
                checked={settings.autoModeration}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, autoModeration: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications nouveaux commentaires</Label>
                <p className="text-sm text-gray-500">Recevoir un email pour chaque commentaire</p>
              </div>
              <Switch 
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Règles de modération */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-600" />
              Règles de Modération
            </CardTitle>
            <CardDescription>Configurez les filtres et règles de modération</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Mots interdits</Label>
              <Textarea 
                placeholder="Entrez les mots à bloquer, séparés par des virgules"
                rows={3}
                value={settings.bannedWords}
                onChange={(e) => setSettings(prev => ({ ...prev, bannedWords: e.target.value }))}
              />
              <p className="text-xs text-gray-500">
                Les commentaires contenant ces mots seront automatiquement rejetés
              </p>
            </div>

            <div className="space-y-2">
              <Label>Score minimum de confiance</Label>
              <Select 
                value={settings.confidenceThreshold}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, confidenceThreshold: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible (accepter plus)</SelectItem>
                  <SelectItem value="medium">Moyen (équilibré)</SelectItem>
                  <SelectItem value="high">Élevé (strict)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Délai avant publication</Label>
              <Select 
                value={settings.publicationDelay}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, publicationDelay: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Immédiat</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="1440">24 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Widgets commentaires */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Widgets et Affichage</CardTitle>
            <CardDescription>Personnalisez l'affichage des commentaires</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre de commentaires par page</Label>
              <Input 
                type="number" 
                value={settings.commentsPerPage}
                onChange={(e) => setSettings(prev => ({ ...prev, commentsPerPage: parseInt(e.target.value) }))}
                min="5" 
                max="50" 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Afficher les avatars</Label>
                <p className="text-sm text-gray-500">Utiliser Gravatar pour les photos de profil</p>
              </div>
              <Switch 
                checked={settings.showAvatars}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, showAvatars: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Autoriser les réponses</Label>
                <p className="text-sm text-gray-500">Permettre les discussions en fil</p>
              </div>
              <Switch 
                checked={settings.allowReplies}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, allowReplies: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gray-600" />
                  Notation par étoiles
                </Label>
                <p className="text-sm text-gray-500">Permettre aux utilisateurs de noter</p>
              </div>
              <Switch 
                checked={settings.enableRating}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, enableRating: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Intégrations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Intégrations</CardTitle>
            <CardDescription>Connectez des services externes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service de modération</Label>
                <Select defaultValue="akismet">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    <SelectItem value="akismet">Akismet</SelectItem>
                    <SelectItem value="google">Google reCAPTCHA</SelectItem>
                    <SelectItem value="custom">Service personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Système de notification</Label>
                <Select defaultValue="email">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email uniquement</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="discord">Discord</SelectItem>
                    <SelectItem value="webhook">Webhook personnalisé</SelectItem>
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