import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useViewPreference } from '@/hooks/useViewPreference';
import { DeveloperViewSelector } from '@/components/admin/developers/DeveloperViewSelector';
import { DeveloperCardView } from '@/components/admin/developers/DeveloperCardView';
import { DeveloperListView } from '@/components/admin/developers/DeveloperListView';
import { DeveloperTableView } from '@/components/admin/developers/DeveloperTableView';
import { DeveloperCompactView } from '@/components/admin/developers/DeveloperCompactView';
import { DeveloperDetailedView } from '@/components/admin/developers/DeveloperDetailedView';

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
  status: string;
  created_at: string;
  updated_at: string;
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
  main_city: string;
  commission_rate: number;
  founded_year?: number;
  years_experience?: number;
  main_activities: string;
  key_projects: string;
  financial_stability: string;
  payment_terms: string;
  status: 'active' | 'inactive';
  rating_score?: number;
}

export default function AdminDevelopers() {
  const queryClient = useQueryClient();
  const { currentView, changeView } = useViewPreference('developers-view', 'cards');
  
  // Fetch developers
  const { data: developers = [], isLoading } = useQuery({
    queryKey: ['developers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Data normalization and processing
  const normalizedDevelopers = useMemo(() => {
    return developers.map(dev => ({
      ...dev,
      contact_info: {
        email: dev.email_primary || '',
        phone: dev.phone_numbers?.[0] || '',
        address: dev.addresses?.[0] || ''
      }
    }));
  }, [developers]);

  // Logo fallbacks mapping
  const logoFallbacks: Record<string, string> = {
    'leptos estates main': '/lovable-uploads/b5ced174-3c3d-4a14-ac08-3d9c466c25c0.png',
    'leptos': '/lovable-uploads/b5ced174-3c3d-4a14-ac08-3d9c466c25c0.png',
    'aristo developers': '/lovable-uploads/aec5ed87-7930-4b41-954b-9e598b9fcb57.png',
    'aristo': '/lovable-uploads/aec5ed87-7930-4b41-954b-9e598b9fcb57.png',
    'karma group': '/lovable-uploads/9900cf2b-b687-4cb0-b136-afbf6ea3e24a.png',
    'karma': '/lovable-uploads/9900cf2b-b687-4cb0-b136-afbf6ea3e24a.png',
    'karma group cyprus': '/lovable-uploads/9900cf2b-b687-4cb0-b136-afbf6ea3e24a.png',
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
    'olias': '/lovable-uploads/5f250fc3-45af-438f-810b-f701813bdd71.png',
    'olias homes': '/lovable-uploads/5f250fc3-45af-438f-810b-f701813bdd71.png',
    'cyfield': '/lovable-uploads/05694454-206c-437a-8d8f-0f611218a26f.png',
    'cyfiled': '/lovable-uploads/05694454-206c-437a-8d8f-0f611218a26f.png',
    'island blue': '/lovable-uploads/861197ca-75d2-4e8d-aeb1-63050614bece.png',
    'domenica': '/lovable-uploads/96899468-63cb-42e9-90b6-c3aeaf5a51ea.png',
    'domenica group': '/lovable-uploads/96899468-63cb-42e9-90b6-c3aeaf5a51ea.png',
    'dominica': '/lovable-uploads/96899468-63cb-42e9-90b6-c3aeaf5a51ea.png',
    'dominica group': '/lovable-uploads/96899468-63cb-42e9-90b6-c3aeaf5a51ea.png',
    'leptos estates': '/lovable-uploads/86a9b95e-ea6a-47e2-a82e-e9761d09f788.png',
    'pafilia': '/lovable-uploads/3843a2de-ff9f-4d55-98b2-4e5cfaf6958d.png',
    'cybarco': '/lovable-uploads/532a60af-fea7-4b6d-a8ec-c334447e2196.png'
  };

  const getLogo = (d: Developer) => {
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

  // Modal states
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
    main_city: '',
    commission_rate: 3,
    founded_year: undefined,
    years_experience: undefined,
    main_activities: '',
    key_projects: '',
    financial_stability: '',
    payment_terms: '',
    status: 'active',
    rating_score: undefined
  });

  // Form handlers
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      main_city: '',
      commission_rate: 3,
      founded_year: undefined,
      years_experience: undefined,
      main_activities: '',
      key_projects: '',
      financial_stability: '',
      payment_terms: '',
      status: 'active',
      rating_score: undefined
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
      email: developer.contact_info?.email || developer.email_primary || '',
      phone: developer.contact_info?.phone || developer.phone_numbers?.[0] || '',
      address: developer.contact_info?.address || developer.addresses?.[0] || '',
      website: developer.website || '',
      main_city: developer.main_city || '',
      commission_rate: developer.commission_rate || 3,
      founded_year: developer.founded_year,
      years_experience: developer.years_experience,
      main_activities: developer.main_activities || '',
      key_projects: developer.key_projects || '',
      financial_stability: developer.financial_stability || '',
      payment_terms: developer.payment_terms || '',
      status: developer.status as 'active' | 'inactive',
      rating_score: developer.rating_score
    });
    setIsModalOpen(true);
  };

  const openDetailModal = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setIsDetailModalOpen(true);
  };

  // Save developer mutation
  const saveDevMutation = useMutation({
    mutationFn: async (data: DeveloperFormData) => {
      const developerData = {
        name: data.name,
        email_primary: data.email,
        phone_numbers: data.phone ? [data.phone] : [],
        addresses: data.address ? [data.address] : [],
        website: data.website,
        main_city: data.main_city,
        commission_rate: data.commission_rate,
        founded_year: data.founded_year,
        years_experience: data.years_experience,
        main_activities: data.main_activities,
        key_projects: data.key_projects,
        financial_stability: data.financial_stability,
        payment_terms: data.payment_terms,
        status: data.status,
        rating_score: data.rating_score,
        contact_info: {
          email: data.email,
          phone: data.phone,
          address: data.address
        }
      };

      if (editingDeveloper) {
        const { data: result, error } = await supabase
          .from('developers')
          .update(developerData)
          .eq('id', editingDeveloper.id)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      } else {
        const { data: result, error } = await supabase
          .from('developers')
          .insert(developerData)
          .select()
          .single();
        
        if (error) throw error;
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developers'] });
      setIsModalOpen(false);
      resetForm();
      toast.success(
        editingDeveloper 
          ? 'Développeur modifié avec succès' 
          : 'Développeur créé avec succès'
      );
    },
    onError: (error) => {
      console.error('Error saving developer:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  });

  // Delete developer mutation
  const deleteDevMutation = useMutation({
    mutationFn: async (developer: Developer) => {
      const { error } = await supabase
        .from('developers')
        .delete()
        .eq('id', developer.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developers'] });
      toast.success('Développeur supprimé avec succès');
    },
    onError: (error) => {
      console.error('Error deleting developer:', error);
      toast.error('Erreur lors de la suppression');
    }
  });

  const handleSave = () => {
    saveDevMutation.mutate(formData);
  };

  const deleteDeveloper = (developer: Developer) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${developer.name}" ?`)) {
      deleteDevMutation.mutate(developer);
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Développeurs</h1>
        <div className="flex items-center space-x-4">
          <DeveloperViewSelector 
            currentView={currentView}
            onViewChange={changeView}
          />
          <Button onClick={openCreateModal} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Ajouter un développeur</span>
          </Button>
        </div>
      </div>


      {/* Developers Multi-view */}
      <Card>
        <CardHeader>
          <CardTitle>Développeurs</CardTitle>
          <CardDescription>
            {normalizedDevelopers.length} développeur{normalizedDevelopers.length > 1 ? 's' : ''} trouvé{normalizedDevelopers.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {normalizedDevelopers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun développeur trouvé
            </div>
          ) : (
            <>
              {currentView === 'cards' && (
                <DeveloperCardView
                  developers={normalizedDevelopers}
                  getLogo={getLogo}
                  onEdit={openEditModal}
                  onDelete={deleteDeveloper}
                  onViewDetails={openDetailModal}
                />
              )}
              
      {currentView === 'list' && (
        <DeveloperListView 
          developers={normalizedDevelopers}
          getLogo={getLogo}
          onEdit={openEditModal}
          onDelete={deleteDeveloper}
          onViewDetails={openDetailModal}
        />
      )}

      {currentView === 'table' && (
        <DeveloperTableView 
          developers={normalizedDevelopers}
          getLogo={getLogo}
          onEdit={openEditModal}
          onDelete={deleteDeveloper}
          onViewDetails={openDetailModal}
        />
      )}
              
      {currentView === 'compact' && (
        <DeveloperCompactView 
          developers={normalizedDevelopers}
          getLogo={getLogo}
          onEdit={openEditModal}
          onDelete={deleteDeveloper}
          onViewDetails={openDetailModal}
        />
      )}

      {currentView === 'detailed' && (
        <DeveloperDetailedView 
          developers={normalizedDevelopers}
          getLogo={getLogo}
          onEdit={openEditModal}
          onDelete={deleteDeveloper}
          onViewDetails={openDetailModal}
        />
      )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDeveloper ? 'Modifier le développeur' : 'Ajouter un nouveau développeur'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations du développeur ci-dessous.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom du développeur"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contact@developer.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+357 99 123456"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Site Web</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://developer.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="main_city">Ville Principale</Label>
              <Select 
                value={formData.main_city} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, main_city: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Limassol">Limassol</SelectItem>
                  <SelectItem value="Larnaca">Larnaca</SelectItem>
                  <SelectItem value="Paphos">Paphos</SelectItem>
                  <SelectItem value="Famagusta">Famagusta</SelectItem>
                  <SelectItem value="Kyrenia">Kyrenia</SelectItem>
                  <SelectItem value="Nicosia">Nicosia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commission_rate">Taux de Commission (%)</Label>
              <Input
                id="commission_rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.commission_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, commission_rate: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="founded_year">Année de Fondation</Label>
              <Input
                id="founded_year"
                type="number"
                min="1900"
                max="2024"
                value={formData.founded_year || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, founded_year: e.target.value ? parseInt(e.target.value) : undefined }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="years_experience">Années d'Expérience</Label>
              <Input
                id="years_experience"
                type="number"
                min="0"
                max="100"
                value={formData.years_experience || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, years_experience: e.target.value ? parseInt(e.target.value) : undefined }))}
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
              <Label htmlFor="rating_score">Note (1-5)</Label>
              <Input
                id="rating_score"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating_score || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, rating_score: e.target.value ? parseFloat(e.target.value) : undefined }))}
              />
            </div>
          </div>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Adresse complète du développeur"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="main_activities">Activités Principales</Label>
              <Textarea
                id="main_activities"
                value={formData.main_activities}
                onChange={(e) => setFormData(prev => ({ ...prev, main_activities: e.target.value }))}
                placeholder="Description des activités principales"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="key_projects">Projets Clés</Label>
              <Textarea
                id="key_projects"
                value={formData.key_projects}
                onChange={(e) => setFormData(prev => ({ ...prev, key_projects: e.target.value }))}
                placeholder="Liste des projets importants"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="financial_stability">Stabilité Financière</Label>
              <Textarea
                id="financial_stability"
                value={formData.financial_stability}
                onChange={(e) => setFormData(prev => ({ ...prev, financial_stability: e.target.value }))}
                placeholder="Évaluation de la stabilité financière"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment_terms">Conditions de Paiement</Label>
              <Textarea
                id="payment_terms"
                value={formData.payment_terms}
                onChange={(e) => setFormData(prev => ({ ...prev, payment_terms: e.target.value }))}
                placeholder="Conditions et termes de paiement"
                rows={2}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
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
          {selectedDeveloper && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    {getLogo(selectedDeveloper) ? (
                      <img 
                        src={getLogo(selectedDeveloper)} 
                        alt={`${selectedDeveloper.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-primary font-bold">
                        {selectedDeveloper.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedDeveloper.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedDeveloper.main_city}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* General Information */}
                <div>
                  <h3 className="font-semibold mb-3">Informations Générales</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Statut:</span>
                      <span className="ml-2 font-medium">{selectedDeveloper.status === 'active' ? 'Actif' : 'Inactif'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Commission:</span>
                      <span className="ml-2 font-medium">{selectedDeveloper.commission_rate}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Année de fondation:</span>
                      <span className="ml-2 font-medium">{selectedDeveloper.founded_year || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expérience:</span>
                      <span className="ml-2 font-medium">{selectedDeveloper.years_experience ? `${selectedDeveloper.years_experience} ans` : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total projets:</span>
                      <span className="ml-2 font-medium">{selectedDeveloper.total_projects || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Note:</span>
                      <span className="ml-2 font-medium">{selectedDeveloper.rating_score ? `⭐ ${selectedDeveloper.rating_score}/5` : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="font-semibold mb-3">Contact</h3>
                  <div className="space-y-2 text-sm">
                    {selectedDeveloper.contact_info?.email && (
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <span className="ml-2">{selectedDeveloper.contact_info.email}</span>
                      </div>
                    )}
                    {selectedDeveloper.contact_info?.phone && (
                      <div>
                        <span className="text-muted-foreground">Téléphone:</span>
                        <span className="ml-2">{selectedDeveloper.contact_info.phone}</span>
                      </div>
                    )}
                    {selectedDeveloper.website && (
                      <div>
                        <span className="text-muted-foreground">Site web:</span>
                        <a href={selectedDeveloper.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline">
                          {selectedDeveloper.website}
                        </a>
                      </div>
                    )}
                    {selectedDeveloper.contact_info?.address && (
                      <div>
                        <span className="text-muted-foreground">Adresse:</span>
                        <span className="ml-2">{selectedDeveloper.contact_info.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activities */}
                {selectedDeveloper.main_activities && (
                  <div>
                    <h3 className="font-semibold mb-3">Activités Principales</h3>
                    <p className="text-sm">{selectedDeveloper.main_activities}</p>
                  </div>
                )}

                {/* Key Projects */}
                {selectedDeveloper.key_projects && (
                  <div>
                    <h3 className="font-semibold mb-3">Projets Clés</h3>
                    <p className="text-sm">{selectedDeveloper.key_projects}</p>
                  </div>
                )}

                {/* Reputation */}
                {selectedDeveloper.reputation_reviews && (
                  <div>
                    <h3 className="font-semibold mb-3">Réputation</h3>
                    <p className="text-sm">{selectedDeveloper.reputation_reviews}</p>
                  </div>
                )}

                {/* Financial Stability */}
                {selectedDeveloper.financial_stability && (
                  <div>
                    <h3 className="font-semibold mb-3">Stabilité Financière</h3>
                    <p className="text-sm">{selectedDeveloper.financial_stability}</p>
                  </div>
                )}

                {/* Payment Terms */}
                {selectedDeveloper.payment_terms && (
                  <div>
                    <h3 className="font-semibold mb-3">Conditions de Paiement</h3>
                    <p className="text-sm">{selectedDeveloper.payment_terms}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}