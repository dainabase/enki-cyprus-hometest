import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Plus, Pencil, Trash2, Mail, Phone, Globe, MapPin, Star, Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Developer {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  phone_numbers?: string[];
  addresses?: string[];
  email_primary?: string;
  main_city?: string;
  rating_score?: number;
  commission_rate: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

interface DeveloperFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  commission_rate: number;
  payment_terms: string;
  status: 'active' | 'inactive';
}

const AdminDevelopers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);
  const [formData, setFormData] = useState<DeveloperFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    commission_rate: 3.00,
    payment_terms: '30 jours',
    status: 'active'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch developers
  const { data: developers = [], isLoading } = useQuery({
    queryKey: ['developers'],
    queryFn: async () => {
      console.log('🔄 Fetching developers...');
      const { data, error } = await supabase
        .from('developers')
        .select('id, name, website, phone_numbers, addresses, email_primary, main_city, rating_score, commission_rate, status, created_at, updated_at')
        .order('name', { ascending: true }); // Tri par nom alphabétique au lieu de created_at
      
      if (error) throw error;
      console.log(`✅ Fetched ${data?.length || 0} developers:`, data?.map(d => ({ name: d.name, status: d.status, city: d.main_city })));
      return data as Developer[];
    }
  });

  // Save developer mutation
  const saveDevMutation = useMutation({
    mutationFn: async (data: DeveloperFormData) => {
      const payload = {
        name: data.name,
        contact_info: {
          email: data.email,
          phone: data.phone,
          address: data.address
        },
        website: data.website,
        commission_rate: data.commission_rate,
        payment_terms: data.payment_terms,
        status: data.status
      };

      if (editingDeveloper) {
        const { error } = await supabase
          .from('developers')
          .update(payload)
          .eq('id', editingDeveloper.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('developers')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      console.log('✅ Developer saved successfully, invalidating cache...');
      queryClient.invalidateQueries({ queryKey: ['developers'] });
      setIsModalOpen(false);
      resetForm();
      toast({
        title: editingDeveloper ? 'Développeur modifié' : 'Développeur créé',
        description: 'Les modifications ont été sauvegardées.'
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message
      });
    }
  });

  // Delete developer mutation
  const deleteDevMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('developers')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developers'] });
      toast({
        title: 'Développeur supprimé',
        description: 'Le développeur a été supprimé avec succès.'
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      commission_rate: 3.00,
      payment_terms: '30 jours',
      status: 'active'
    });
    setEditingDeveloper(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (developer: Developer) => {
    setEditingDeveloper(developer);
    setFormData({
      name: developer.name,
      email: developer.email_primary || '',
      phone: developer.phone_numbers?.[0] || '',
      address: developer.addresses?.[0] || '',
      website: developer.website || '',
      commission_rate: developer.commission_rate,
      payment_terms: '',
      status: developer.status
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le nom du développeur est requis.'
      });
      return;
    }
    saveDevMutation.mutate(formData);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Développeurs</h1>
          <p className="text-muted-foreground">Gestion des partenaires développeurs Chypre</p>
        </div>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau Développeur
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Développeurs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{developers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{developers.filter(d => d.status === 'active').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Moyenne</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {developers.length > 0 
                ? (developers.reduce((acc, dev) => acc + dev.commission_rate, 0) / developers.length).toFixed(2)
                : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
            <Building2 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{developers.filter(d => d.status === 'inactive').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Developers by Zone */}
      {(() => {
        // Grouper les développeurs par zone
        const developersByZone = developers.reduce((acc, developer) => {
          const zone = developer.main_city || 'Non assigné';
          if (!acc[zone]) {
            acc[zone] = [];
          }
          acc[zone].push(developer);
          return acc;
        }, {} as Record<string, Developer[]>);

        // Ordre des zones avec priorité
        const zoneOrder = ['Limassol', 'Paphos', 'Les deux', 'Nicosia', 'Larnaca', 'Famagusta', 'Non assigné'];
        const sortedZones = Object.keys(developersByZone).sort((a, b) => {
          const indexA = zoneOrder.indexOf(a);
          const indexB = zoneOrder.indexOf(b);
          if (indexA === -1 && indexB === -1) return a.localeCompare(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

        return (
          <div className="space-y-8">
            {sortedZones.map((zone) => (
              <div key={zone} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-primary">{zone}</h2>
                  <div className="h-px bg-border flex-1"></div>
                  <Badge variant="outline" className="text-sm">
                    {developersByZone[zone].length} développeur{developersByZone[zone].length > 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {developersByZone[zone].map((developer) => (
                    <Card key={developer.id} className="relative">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{developer.name}</CardTitle>
                            <Badge variant={developer.status === 'active' ? 'default' : 'secondary'} className="mt-2">
                              {developer.status === 'active' ? 'Actif' : 'Inactif'}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(developer)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteDevMutation.mutate(developer.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Score de notation */}
                        {developer.rating_score && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="w-4 h-4" />
                            <span>Score: {developer.rating_score}/10</span>
                          </div>
                        )}
                        
                        {/* Numéro de téléphone */}
                        {developer.phone_numbers && developer.phone_numbers.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{developer.phone_numbers[0]}</span>
                          </div>
                        )}
                        
                        {/* Email */}
                        {developer.email_primary && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{developer.email_primary}</span>
                          </div>
                        )}
                        
                        {/* Adresse */}
                        {developer.addresses && developer.addresses.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{developer.addresses[0]}</span>
                          </div>
                        )}
                        
                        {/* Site internet cliquable */}
                        {developer.website && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="w-4 h-4" />
                            <a 
                              href={developer.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline truncate"
                            >
                              {developer.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        )}
                        
                        {/* Commission rate */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Percent className="w-4 h-4" />
                          <span>Commission: {developer.commission_rate}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            
            {developers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun développeur trouvé
              </div>
            )}
          </div>
        );
      })()}

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDeveloper ? 'Modifier le développeur' : 'Nouveau développeur'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Leptos Group"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contact@leptos.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+357 26 820 000"
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Limassol, Chypre"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Site Web</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://leptos.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commission">Commission (%)</Label>
              <Input
                id="commission"
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={formData.commission_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, commission_rate: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="payment_terms">Conditions de paiement</Label>
              <Textarea
                id="payment_terms"
                value={formData.payment_terms}
                onChange={(e) => setFormData(prev => ({ ...prev, payment_terms: e.target.value }))}
                placeholder="Paiement sous 30 jours..."
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saveDevMutation.isPending}>
              {saveDevMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDevelopers;