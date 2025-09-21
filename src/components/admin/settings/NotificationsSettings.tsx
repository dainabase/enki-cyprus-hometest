import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Bell, Mail, Smartphone, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationsSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    soundEnabled: true,
    newLeads: true,
    newComments: true,
    newBookings: true,
    systemAlerts: true,
    marketingEmails: false,
    weeklyReports: true,
    notificationFrequency: 'immediate',
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Ici on sauvegarderait dans la base de données
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Paramètres de notification sauvegardés');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* Types de notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-600" />
              Types de Notifications
            </CardTitle>
            <CardDescription>Choisissez comment recevoir vos notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  Notifications par email
                </Label>
                <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
              </div>
              <Switch 
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, emailNotifications: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-600" />
                  Notifications push
                </Label>
                <p className="text-sm text-gray-500">Notifications dans le navigateur</p>
              </div>
              <Switch 
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, pushNotifications: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-gray-600" />
                  Notifications SMS
                </Label>
                <p className="text-sm text-gray-500">SMS pour les événements critiques</p>
              </div>
              <Switch 
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, smsNotifications: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-gray-600" />
                  Sons de notification
                </Label>
                <p className="text-sm text-gray-500">Activer les sons d'alerte</p>
              </div>
              <Switch 
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, soundEnabled: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Événements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Événements de Notification</CardTitle>
            <CardDescription>Sélectionnez les événements qui déclenchent des notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Nouveaux prospects</Label>
                <p className="text-sm text-gray-500">Quand un nouveau prospect s'inscrit</p>
              </div>
              <Switch 
                checked={settings.newLeads}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, newLeads: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Nouveaux commentaires</Label>
                <p className="text-sm text-gray-500">Commentaires sur les propriétés</p>
              </div>
              <Switch 
                checked={settings.newComments}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, newComments: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Nouvelles réservations</Label>
                <p className="text-sm text-gray-500">Visites et rendez-vous programmés</p>
              </div>
              <Switch 
                checked={settings.newBookings}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, newBookings: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Alertes système</Label>
                <p className="text-sm text-gray-500">Maintenance, erreurs, mises à jour</p>
              </div>
              <Switch 
                checked={settings.systemAlerts}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, systemAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Emails marketing</Label>
                <p className="text-sm text-gray-500">Newsletters et promotions</p>
              </div>
              <Switch 
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, marketingEmails: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Rapports hebdomadaires</Label>
                <p className="text-sm text-gray-500">Résumé des activités de la semaine</p>
              </div>
              <Switch 
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, weeklyReports: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Fréquence et horaires */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fréquence et Horaires</CardTitle>
            <CardDescription>Configurez quand et à quelle fréquence recevoir les notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Fréquence des notifications</Label>
              <Select 
                value={settings.notificationFrequency}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, notificationFrequency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immédiat</SelectItem>
                  <SelectItem value="hourly">Toutes les heures</SelectItem>
                  <SelectItem value="daily">Une fois par jour</SelectItem>
                  <SelectItem value="weekly">Une fois par semaine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Heures de silence</Label>
                <p className="text-sm text-gray-500">Désactiver les notifications pendant certaines heures</p>
              </div>
              <Switch 
                checked={settings.quietHoursEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, quietHoursEnabled: checked }))
                }
              />
            </div>

            {settings.quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Début heures de silence</Label>
                  <Input 
                    type="time"
                    value={settings.quietHoursStart}
                    onChange={(e) => setSettings(prev => ({ ...prev, quietHoursStart: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fin heures de silence</Label>
                  <Input 
                    type="time"
                    value={settings.quietHoursEnd}
                    onChange={(e) => setSettings(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Canaux d'intégration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Intégrations Externes</CardTitle>
            <CardDescription>Connectez vos outils de communication préférés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Webhook Slack</Label>
                <Input 
                  placeholder="https://hooks.slack.com/..."
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label>Canal Discord</Label>
                <Input 
                  placeholder="ID du canal Discord"
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Webhook Teams</Label>
                <Input 
                  placeholder="https://outlook.office.com/..."
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label>Numéro SMS d'urgence</Label>
                <Input 
                  placeholder="+357 99 123 456"
                  type="tel"
                />
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