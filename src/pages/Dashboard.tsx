import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  CheckSquare, 
  History, 
  Calculator,
  Plus,
  Trash2,
  MapPin,
  Euro,
  Building,
  Check,
  X
} from 'lucide-react';
import { LexaiaCalculator } from '@/components/LexaiaCalculator';
import { PromotersSection } from '@/components/PromotersSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Favorite {
  id: string;
  project_id: string;
  created_at: string;
  projects: {
    id: string;
    title: string;
    description: string;
    type: string;
    price: number;
    location: any;
    photos: string[];
  };
}

interface ChecklistItem {
  id: string;
  task: string;
  done: boolean;
  category?: string;
}

interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

interface TaxScenario {
  country: string;
  budget: number;
  propertyType: string;
  result?: {
    tax_saved: number;
    laws: string[];
    recommendations: string[];
    effective_rate: number;
    country_benefits: string[];
  };
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  // States
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [taxScenario, setTaxScenario] = useState<TaxScenario>({
    country: '',
    budget: 0,
    propertyType: 'apartment'
  });
  const [isLoadingTax, setIsLoadingTax] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Load favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select(`
          id,
          project_id,
          created_at,
          projects (
            id,
            title,
            description,
            type,
            price,
            location,
            photos
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (favoritesError) throw favoritesError;
      setFavorites(favoritesData || []);

      // Load checklists
      const { data: checklistsData, error: checklistsError } = await supabase
        .from('checklists')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (checklistsError) throw checklistsError;
      setChecklists((checklistsData || []).map(c => ({
        ...c,
        items: (c.items as any) || []
      })));

      // Create default checklist if none exists
      if (!checklistsData || checklistsData.length === 0) {
        await createDefaultChecklist();
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos données"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultChecklist = async () => {
    const defaultItems = [
      { id: '1', task: 'Définir mon budget', done: false, category: 'Préparation' },
      { id: '2', task: 'Contacter un conseiller fiscal', done: false, category: 'Fiscalité' },
      { id: '3', task: 'Visiter les propriétés sélectionnées', done: false, category: 'Visite' },
      { id: '4', task: 'Négocier le prix', done: false, category: 'Négociation' },
      { id: '5', task: 'Organiser le financement', done: false, category: 'Financement' }
    ];

    try {
      const { error } = await supabase
        .from('checklists')
        .insert([{
          user_id: user!.id,
          title: 'Ma checklist d\'achat immobilier',
          items: defaultItems
        }]);

      if (error) throw error;
      loadUserData();
    } catch (error) {
      console.error('Error creating default checklist:', error);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      toast({
        title: "Favori supprimé",
        description: "La propriété a été retirée de vos favoris"
      });

      loadUserData();
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le favori"
      });
    }
  };

  const updateChecklistItem = async (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => {
    try {
      const checklist = checklists.find(c => c.id === checklistId);
      if (!checklist) return;

      const updatedItems = checklist.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      );

      const { error } = await supabase
        .from('checklists')
        .update({ items: updatedItems as any })
        .eq('id', checklistId);

      if (error) throw error;

      setChecklists(prev => prev.map(c => 
        c.id === checklistId ? { ...c, items: updatedItems } : c
      ));
    } catch (error) {
      console.error('Error updating checklist item:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'élément"
      });
    }
  };

  const addChecklistItem = async (checklistId: string) => {
    if (!newChecklistItem.trim()) return;

    try {
      const checklist = checklists.find(c => c.id === checklistId);
      if (!checklist) return;

      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        task: newChecklistItem,
        done: false,
        category: 'Personnel'
      };

      const updatedItems = [...checklist.items, newItem];

      const { error } = await supabase
        .from('checklists')
        .update({ items: updatedItems as any })
        .eq('id', checklistId);

      if (error) throw error;

      setChecklists(prev => prev.map(c => 
        c.id === checklistId ? { ...c, items: updatedItems } : c
      ));

      setNewChecklistItem('');
      
      toast({
        title: "Tâche ajoutée",
        description: "La nouvelle tâche a été ajoutée à votre checklist"
      });
    } catch (error) {
      console.error('Error adding checklist item:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la tâche"
      });
    }
  };

  const calculateTaxScenario = async () => {
    if (!taxScenario.country || !taxScenario.budget) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs"
      });
      return;
    }

    setIsLoadingTax(true);

    try {
      const { data, error } = await supabase.functions.invoke('lexaia-mock', {
        body: {
          country: taxScenario.country,
          budget: taxScenario.budget,
          propertyType: taxScenario.propertyType
        }
      });

      if (error) throw error;

      if (data.success) {
        setTaxScenario(prev => ({ ...prev, result: data.data }));
        toast({
          title: "Analyse terminée",
          description: "Votre scénario fiscal a été calculé"
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error calculating tax scenario:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de calculer le scénario fiscal"
      });
    } finally {
      setIsLoadingTax(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Bonjour {profile?.profile?.name || user?.email?.split('@')[0]} 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez vos favoris, votre checklist et optimisez votre fiscalité
            </p>
          </div>

          <Tabs defaultValue="favorites" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favoris
              </TabsTrigger>
              <TabsTrigger value="checklist" className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Checklist
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Historique
              </TabsTrigger>
              <TabsTrigger value="lexaia" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Lexaia
              </TabsTrigger>
              <TabsTrigger value="promoters" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Promoteurs
              </TabsTrigger>
            </TabsList>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Mes Propriétés Favorites</CardTitle>
                  <CardDescription>
                    Les propriétés que vous avez sauvegardées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {favorites.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Aucune propriété favorite pour le moment
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Parcourez nos projets et ajoutez vos coups de cœur !
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        show: {
                          opacity: 1,
                          transition: { staggerChildren: 0.1 }
                        }
                      }}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {favorites.map((favorite) => (
                        <motion.div
                          key={favorite.id}
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0 }
                          }}
                        >
                          <Card className="card-hover">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-sm">
                                    {favorite.projects.title}
                                  </h3>
                                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {favorite.projects.location?.city}
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFavorite(favorite.id)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                {favorite.projects.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-primary">
                                  €{favorite.projects.price?.toLocaleString()}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {favorite.projects.type}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Checklist Tab */}
            <TabsContent value="checklist">
              <Card>
                <CardHeader>
                  <CardTitle>Ma Checklist d'Achat</CardTitle>
                  <CardDescription>
                    Suivez votre progression dans votre projet immobilier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {checklists.map((checklist) => (
                    <div key={checklist.id} className="space-y-4">
                      <div className="flex items-center gap-4 mb-4">
                        <Input
                          placeholder="Ajouter une tâche..."
                          value={newChecklistItem}
                          onChange={(e) => setNewChecklistItem(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addChecklistItem(checklist.id)}
                        />
                        <Button onClick={() => addChecklistItem(checklist.id)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {checklist.items.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 p-3 border rounded-lg"
                          >
                            <Checkbox
                              checked={item.done}
                              onCheckedChange={(checked) => 
                                updateChecklistItem(checklist.id, item.id, { done: checked as boolean })
                              }
                            />
                            <div className="flex-1">
                              <span className={`${item.done ? 'line-through text-muted-foreground' : ''}`}>
                                {item.task}
                              </span>
                              {item.category && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {item.category}
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedItems = checklist.items.filter(i => i.id !== item.id);
                                updateChecklistItem(checklist.id, item.id, { done: false });
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>

                      {checklist.items.length > 0 && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progression</span>
                            <span>
                              {checklist.items.filter(item => item.done).length} / {checklist.items.length}
                            </span>
                          </div>
                          <div className="w-full bg-background rounded-full h-2 mt-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(checklist.items.filter(item => item.done).length / checklist.items.length) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des Demandes</CardTitle>
                  <CardDescription>
                    Vos demandes d'informations et analyses précédentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Aucun historique pour le moment
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Vos futures demandes et analyses apparaîtront ici
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lexaia Tab */}
            <TabsContent value="lexaia">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse Fiscale Lexaia</CardTitle>
                  <CardDescription>
                    Optimisez votre fiscalité avec nos scénarios personnalisés
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Form */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Pays de résidence</label>
                      <Select 
                        value={taxScenario.country} 
                        onValueChange={(value) => setTaxScenario(prev => ({ ...prev, country: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chypre">Chypre</SelectItem>
                          <SelectItem value="Suisse">Suisse</SelectItem>
                          <SelectItem value="Portugal">Portugal</SelectItem>
                          <SelectItem value="Espagne">Espagne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Budget (€)</label>
                      <Input
                        type="number"
                        placeholder="500000"
                        value={taxScenario.budget || ''}
                        onChange={(e) => setTaxScenario(prev => ({ ...prev, budget: Number(e.target.value) }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Type de bien</label>
                      <Select 
                        value={taxScenario.propertyType} 
                        onValueChange={(value) => setTaxScenario(prev => ({ ...prev, propertyType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Appartement</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={calculateTaxScenario} 
                    disabled={isLoadingTax}
                    className="w-full md:w-auto"
                  >
                    {isLoadingTax ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                        />
                        Calcul en cours...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4 mr-2" />
                        Analyser mon scénario
                      </>
                    )}
                  </Button>

                  {/* Results */}
                  {taxScenario.result && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Euro className="w-4 h-4 text-green-600" />
                              <span className="font-medium">Économies fiscales</span>
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                              €{taxScenario.result.tax_saved?.toLocaleString()}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Building className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">Taux effectif</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                              {taxScenario.result.effective_rate}%
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Recommandations</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {taxScenario.result.recommendations?.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Avantages pays</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {taxScenario.result.country_benefits?.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Références légales</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {taxScenario.result.laws?.map((law, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                • {law}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lexaia Tab */}
            <TabsContent value="lexaia">
              <LexaiaCalculator />
            </TabsContent>

            {/* Promoters Tab */}
            <TabsContent value="promoters">
              <PromotersSection />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;