import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Plus, Pencil, Trash2, Mail, Phone, Globe, MapPin, Star, MoreVertical, Eye, Calendar, Building, Award, TrendingUp } from 'lucide-react';
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
  // Champs détaillés supplémentaires
  founded_year?: number;
  years_experience?: number;
  total_projects?: number;
  main_activities?: string;
  key_projects?: string;
  rating_justification?: string;
  reputation_reviews?: string;
  financial_stability?: string;
  history?: string;
  payment_terms?: string;
  contact_info?: any;
}

interface DeveloperFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  logo?: string;
  commission_rate: number;
  payment_terms: string;
  status: 'active' | 'inactive';
}

const AdminDevelopers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);
  const [formData, setFormData] = useState<DeveloperFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    logo: '',
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
        .select('*') // Récupérer toutes les colonnes pour les détails complets
        .order('name', { ascending: true }); // Tri par nom alphabétique au lieu de created_at
      
      if (error) throw error;
      console.log(`✅ Fetched ${data?.length || 0} developers:`, data);
      console.log('🔍 Developers details:', data?.map(d => ({ 
        name: d.name, 
        status: d.status, 
        main_city: d.main_city,
        phone_numbers: d.phone_numbers,
        email_primary: d.email_primary,
        contact_info: d.contact_info
      })));
      return data as Developer[];
    }
  });

  // Normalize developers for display
  const normalizedDevelopers = (developers as any[]).map((d: any) => {
    const ci = d.contact_info || {};
    const phone_numbers = (Array.isArray(d.phone_numbers) && d.phone_numbers.length) ? d.phone_numbers : (ci.phone ? [ci.phone] : []);
    const addresses = (Array.isArray(d.addresses) && d.addresses.length) ? d.addresses : (ci.address ? [ci.address] : []);
    const email_primary = d.email_primary || ci.email || ci.email_primary || null;
    const status = d.status === 'inactive' ? 'inactive' : 'active';
    const main_city = d.main_city || ci.city || ci.location || null;
    
    console.log(`🔧 Normalizing developer ${d.name}:`, {
      original: { main_city: d.main_city, phone_numbers: d.phone_numbers, email_primary: d.email_primary },
      normalized: { main_city, phone_numbers, email_primary, addresses }
    });
    
    return { ...d, phone_numbers, addresses, email_primary, status, main_city } as Developer;
  });

  console.log('📊 Final normalized developers:', normalizedDevelopers?.map(d => ({
    name: d.name,
    main_city: d.main_city,
    phone_numbers: d.phone_numbers,
    email_primary: d.email_primary
  })));

  // Logo fallbacks for known developers (for immediate display if DB missing logo)
  const logoFallbacks: Record<string, string> = {
    'lemon maria developers': '/lovable-uploads/9900cf2b-b687-4cb0-b136-afbf6ea3e24a.png',
    'lemon maria developer': '/lovable-uploads/9900cf2b-b687-4cb0-b136-afbf6ea3e24a.png',
    'lemon maria': '/lovable-uploads/9900cf2b-b687-4cb0-b136-afbf6ea3e24a.png',
    'aristo developers': '/lovable-uploads/451fcc7c-10f6-44de-958b-7d7bebd86ac4.png',
    'aristo developer': '/lovable-uploads/451fcc7c-10f6-44de-958b-7d7bebd86ac4.png',
    'aristo': '/lovable-uploads/451fcc7c-10f6-44de-958b-7d7bebd86ac4.png',
    'karma group': '/lovable-uploads/aec5ed87-7930-4b41-954b-9e598b9fcb57.png',
    'karma': '/lovable-uploads/aec5ed87-7930-4b41-954b-9e598b9fcb57.png',
    // Nouveaux fallback pour cohérence cartes ↔ base de données
    'prime property group (incl. bbf)': '/lovable-uploads/b5ced174-3c3d-4a14-ac08-3d9c466c25c0.png',
    'prime property group': '/lovable-uploads/b5ced174-3c3d-4a14-ac08-3d9c466c25c0.png',
    'bbf': '/lovable-uploads/b5ced174-3c3d-4a14-ac08-3d9c466c25c0.png',
    'd. zavos group': '/lovable-uploads/ecbada79-fdcc-4174-9a11-f5d951be818f.png',
    'zavos group': '/lovable-uploads/ecbada79-fdcc-4174-9a11-f5d951be818f.png',
    'zavos': '/lovable-uploads/ecbada79-fdcc-4174-9a11-f5d951be818f.png',
    'agg luxury homes ltd': '/lovable-uploads/da9e2335-cbce-4b91-91e9-9ab0079032c6.png',
    'agg luxury homes': '/lovable-uploads/da9e2335-cbce-4b91-91e9-9ab0079032c6.png',
    'agg': '/lovable-uploads/da9e2335-cbce-4b91-91e9-9ab0079032c6.png',
    'korantina homes': '/lovable-uploads/9d71fef3-c2c7-487a-ba21-6d18749b8b3b.png',
    'korantina': '/lovable-uploads/9d71fef3-c2c7-487a-ba21-6d18749b8b3b.png',
    'kuutio homes': '/lovable-uploads/8acce094-0212-4562-9dff-42bd9d25efb0.png',
    'kuutio': '/lovable-uploads/8acce094-0212-4562-9dff-42bd9d25efb0.png',
    'quality group': '/lovable-uploads/2a8288f1-3cc0-4f74-8b35-98081859219e.png',
    'quality': '/lovable-uploads/2a8288f1-3cc0-4f74-8b35-98081859219e.png',
    'inex': '/lovable-uploads/5f250fc3-45af-438f-810b-f701813bdd71.png',
    'medousa': '/lovable-uploads/edb7101f-e806-45b7-ae7b-9ec23b49eb91.png',
    'property gallery': '/lovable-uploads/bfdd449f-6c80-4e3b-a300-b4450619c6c7.png'
  };
  const getLogo = (d: Partial<Developer>) => {
    const byName = (d.name || '').toLowerCase().trim();
    // If a valid custom logo is set, use it first
    if (d.logo && d.logo.trim()) return d.logo;
    // Try exact match
    const exact = logoFallbacks[byName];
    if (exact) return exact;
    // Try partial match (e.g., "karma group cyprus" should match "karma" or "karma group")
    const matchKey = Object.keys(logoFallbacks).find((k) => byName.includes(k));
    return matchKey ? logoFallbacks[matchKey] : undefined;
  };
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
        logo: data.logo,
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
      logo: '',
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
      logo: developer.logo || '',
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

  const openDetailModal = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setIsDetailModalOpen(true);
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
            <div className="text-2xl font-bold">{normalizedDevelopers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{normalizedDevelopers.filter(d => d.status === 'active').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Moyenne</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {normalizedDevelopers.length > 0 
                ? (normalizedDevelopers.reduce((acc, dev) => acc + (dev.commission_rate || 0), 0) / normalizedDevelopers.length).toFixed(2)
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
            <div className="text-2xl font-bold">{normalizedDevelopers.filter(d => d.status === 'inactive').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Developers by Zone */}
      {(() => {
        // Grouper les développeurs par zone
        const developersByZone = normalizedDevelopers.reduce((acc, developer) => {
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
                       <CardHeader className="pb-4">
                         <div className="flex justify-between items-start">
                           <div className="flex-1 min-w-0">
                             {/* Logo en haut à gauche */}
                             <div className="flex justify-start mb-4">
                               <div className="w-32 h-32 rounded-md overflow-hidden bg-card border border-border/50 flex items-center justify-center shrink-0">
                                  {getLogo(developer) ? (
                                    <img
                                      src={getLogo(developer) || ''}
                                      alt={`Logo ${developer.name}`}
                                      className="max-w-full max-h-full object-contain"
                                      onError={(e) => {
                                        const byName = (developer.name || '').toLowerCase().trim();
                                        const exact = logoFallbacks[byName];
                                        const matchKey = Object.keys(logoFallbacks).find((k) => byName.includes(k));
                                        const fallback = exact || (matchKey ? logoFallbacks[matchKey] : undefined) || '/placeholder.svg';
                                        if (e.currentTarget.src !== fallback) {
                                          e.currentTarget.src = fallback;
                                        }
                                      }}
                                    />
                                  ) : (
                                    <div className="text-xs font-semibold text-muted-foreground">
                                      {developer.name?.split(' ').slice(0,2).map(w => w[0]).join('')}
                                    </div>
                                  )}
                               </div>
                             </div>
                             
                             {/* Nom aligné à gauche */}
                             <div className="text-left mb-2">
                               <CardTitle className="text-lg">{developer.name}</CardTitle>
                             </div>
                             
                             {/* Lieu aligné à gauche */}
                             {developer.main_city && (
                               <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                 <MapPin className="w-4 h-4" />
                                 <span>{developer.main_city}</span>
                               </div>
                             )}
                           </div>
                           
                           {/* Badge et menu en haut à droite */}
                           <div className="flex items-center gap-2 absolute top-4 right-4">
                             <Badge variant={developer.status === 'active' ? 'default' : 'secondary'} className="shrink-0">
                               {developer.status === 'active' ? 'Actif' : 'Inactif'}
                             </Badge>
                             
                             {/* Menu à trois points */}
                             <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                   <MoreVertical className="w-4 h-4" />
                                 </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end">
                                 <DropdownMenuItem onClick={() => openDetailModal(developer)}>
                                   <Eye className="w-4 h-4 mr-2" />
                                   Voir détails
                                 </DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => openEditModal(developer)}>
                                   <Pencil className="w-4 h-4 mr-2" />
                                   Modifier
                                 </DropdownMenuItem>
                                 <DropdownMenuItem 
                                   onClick={() => deleteDevMutation.mutate(developer.id)}
                                   className="text-destructive focus:text-destructive"
                                 >
                                   <Trash2 className="w-4 h-4 mr-2" />
                                   Supprimer
                                 </DropdownMenuItem>
                               </DropdownMenuContent>
                             </DropdownMenu>
                           </div>
                         </div>
                       </CardHeader>
                      <CardContent className="space-y-3 pt-0">
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            
            {normalizedDevelopers.length === 0 && (
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
              <Label htmlFor="logo">Logo (URL)</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                placeholder="https://cdn.exemple.com/logo.png"
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

      {/* Developer Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex items-center gap-4">
                {/* Logo du développeur */}
                 {getLogo(selectedDeveloper || {}) ? (
                   <div className="w-32 h-32 rounded-lg overflow-hidden bg-card border border-border/20 flex items-center justify-center p-2">
                     <img 
                       src={getLogo(selectedDeveloper || {})!} 
                       alt={`Logo ${selectedDeveloper?.name}`}
                       className="max-w-full max-h-full object-contain"
                       onError={(e) => {
                         e.currentTarget.style.display = 'none';
                         e.currentTarget.nextElementSibling?.classList.remove('hidden');
                       }}
                     />
                     <div className="hidden w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 rounded flex items-center justify-center">
                       <Building2 className="w-16 w-16 text-primary/60" />
                     </div>
                   </div>
                 ) : (
                   <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                     <Building2 className="w-16 w-16 text-primary/60" />
                   </div>
                 )}
                
                <div>
                  <h2 className="text-xl font-semibold">Fiche complète</h2>
                  <p className="text-lg font-medium text-primary">{selectedDeveloper?.name}</p>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedDeveloper && (
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Informations générales
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nom</Label>
                      <p className="text-sm">{selectedDeveloper.name}</p>
                    </div>
                    
                    {selectedDeveloper.founded_year && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Année de fondation</Label>
                        <p className="text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {selectedDeveloper.founded_year}
                        </p>
                      </div>
                    )}
                    
                    {selectedDeveloper.years_experience && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Années d'expérience</Label>
                        <p className="text-sm">{selectedDeveloper.years_experience} ans</p>
                      </div>
                    )}
                    
                    {selectedDeveloper.total_projects && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Nombre total de projets</Label>
                        <p className="text-sm">{selectedDeveloper.total_projects}</p>
                      </div>
                    )}
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                      <Badge variant={selectedDeveloper.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                        {selectedDeveloper.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contact et localisation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact & Localisation
                  </h3>
                  
                  <div className="space-y-3">
                    {selectedDeveloper.main_city && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Ville principale</Label>
                        <p className="text-sm flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {selectedDeveloper.main_city}
                        </p>
                      </div>
                    )}
                    
                    {selectedDeveloper.email_primary && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Email principal</Label>
                        <p className="text-sm flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {selectedDeveloper.email_primary}
                        </p>
                      </div>
                    )}
                    
                    {selectedDeveloper.phone_numbers && selectedDeveloper.phone_numbers.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Téléphones</Label>
                        {selectedDeveloper.phone_numbers.map((phone, index) => (
                          <p key={index} className="text-sm flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {phone}
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {selectedDeveloper.addresses && selectedDeveloper.addresses.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Adresses</Label>
                        {selectedDeveloper.addresses.map((address, index) => (
                          <p key={index} className="text-sm flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {address}
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {selectedDeveloper.website && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Site web</Label>
                        <a 
                          href={selectedDeveloper.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-2"
                        >
                          <Globe className="w-4 h-4" />
                          {selectedDeveloper.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Activités et projets */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Activités & Projets
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDeveloper.main_activities && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Activités principales</Label>
                      <p className="text-sm mt-1">{selectedDeveloper.main_activities}</p>
                    </div>
                  )}
                  
                  {selectedDeveloper.key_projects && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Projets clés</Label>
                      <p className="text-sm mt-1">{selectedDeveloper.key_projects}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Évaluation et réputation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Évaluation & Réputation
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDeveloper.rating_score && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Score de notation</Label>
                      <p className="text-sm flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {selectedDeveloper.rating_score}/10
                      </p>
                    </div>
                  )}
                  
                  {selectedDeveloper.commission_rate && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Taux de commission</Label>
                      <p className="text-sm flex items-center gap-2 mt-1">
                        <TrendingUp className="w-4 h-4" />
                        {selectedDeveloper.commission_rate}%
                      </p>
                    </div>
                  )}
                </div>
                
                {selectedDeveloper.rating_justification && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Justification du score</Label>
                    <p className="text-sm mt-1 p-3 bg-muted/50 rounded-md">{selectedDeveloper.rating_justification}</p>
                  </div>
                )}
                
                {selectedDeveloper.reputation_reviews && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Réputation et avis</Label>
                    <p className="text-sm mt-1 p-3 bg-muted/50 rounded-md">{selectedDeveloper.reputation_reviews}</p>
                  </div>
                )}
              </div>

              {/* Stabilité financière et historique */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Stabilité & Historique
                </h3>
                
                {selectedDeveloper.financial_stability && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Stabilité financière</Label>
                    <p className="text-sm mt-1 p-3 bg-muted/50 rounded-md">{selectedDeveloper.financial_stability}</p>
                  </div>
                )}
                
                {selectedDeveloper.history && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Historique</Label>
                    <p className="text-sm mt-1 p-3 bg-muted/50 rounded-md">{selectedDeveloper.history}</p>
                  </div>
                )}
                
                {selectedDeveloper.payment_terms && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Conditions de paiement</Label>
                    <p className="text-sm mt-1">{selectedDeveloper.payment_terms}</p>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Créé le</Label>
                  <p className="text-sm">{new Date(selectedDeveloper.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Modifié le</Label>
                  <p className="text-sm">{new Date(selectedDeveloper.updated_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDevelopers;