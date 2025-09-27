import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  Image as ImageIcon,
  Star,
  Quote,
  Save,
  Upload,
  Edit,
  Plus,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    background_image: string;
  };
  featured_projects: string[];
  stats: {
    total_projects: number;
    happy_clients: number;
    years_experience: number;
    properties_sold: number;
  };
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    content: string;
    avatar: string;
  }>;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const AdminContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    content: '',
    avatar: ''
  });

  // Mock content data (in real app, this would come from a content table)
  const [homeContent, setHomeContent] = useState<HomeContent>({
    hero: {
      title: 'Découvrez l\'Excellence Immobilière à Chypre',
      subtitle: 'Investissements premium avec optimisation fiscale IA',
      background_image: '/api/placeholder/1920/1080'
    },
    featured_projects: ['project1', 'project2', 'project3'],
    stats: {
      total_projects: 150,
      happy_clients: 2500,
      years_experience: 15,
      properties_sold: 1200
    },
    testimonials: [
      {
        id: '1',
        name: 'Marie Dubois',
        role: 'Investisseuse française',
        content: 'ENKI-REALTY m\'a accompagnée dans l\'acquisition de ma villa à Paphos. Service exceptionnel et optimisation fiscale parfaite.',
        avatar: '/api/placeholder/64/64'
      },
      {
        id: '2',
        name: 'John Smith',
        role: 'Entrepreneur britannique',
        content: 'Grâce à Lexaia AI, j\'ai économisé 35% d\'impôts sur mon investissement. Une plateforme révolutionnaire!',
        avatar: '/api/placeholder/64/64'
      }
    ]
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveContent = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would save to a content management table
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Contenu sauvegardé",
        description: "Les modifications ont été appliquées avec succès"
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestimonialSave = () => {
    if (!testimonialForm.name || !testimonialForm.content) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires"
      });
      return;
    }

    const newTestimonial = {
      id: editingTestimonial?.id || Date.now().toString(),
      ...testimonialForm
    };

    if (editingTestimonial) {
      setHomeContent(prev => ({
        ...prev,
        testimonials: prev.testimonials.map(t => 
          t.id === editingTestimonial.id ? newTestimonial : t
        )
      }));
    } else {
      setHomeContent(prev => ({
        ...prev,
        testimonials: [...prev.testimonials, newTestimonial]
      }));
    }

    setIsTestimonialModalOpen(false);
    setEditingTestimonial(null);
    setTestimonialForm({ name: '', role: '', content: '', avatar: '' });
    
    toast({
      title: "Témoignage sauvegardé",
      description: "Le témoignage a été ajouté avec succès"
    });
  };

  const openTestimonialModal = (testimonial?: any) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setTestimonialForm(testimonial);
    } else {
      setEditingTestimonial(null);
      setTestimonialForm({ name: '', role: '', content: '', avatar: '' });
    }
    setIsTestimonialModalOpen(true);
  };

  const deleteTestimonial = (testimonialId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      setHomeContent(prev => ({
        ...prev,
        testimonials: prev.testimonials.filter(t => t.id !== testimonialId)
      }));
      
      toast({
        title: "Témoignage supprimé",
        description: "Le témoignage a été supprimé avec succès"
      });
    }
};

export default AdminContent;
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light tracking-tight text-primary">
              Gestion du Contenu
            </h1>
            <p className="text-lg text-secondary mt-2">
              Personnalisez le contenu de votre site web
            </p>
          </div>
          <Button 
            onClick={handleSaveContent}
            disabled={isSaving}
            className="btn-premium"
          >
            {isSaving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Section Hero</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
          <TabsTrigger value="media">Médias</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-6 mt-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <FileText className="w-5 h-5" />
                  Section Hero
                </CardTitle>
                <CardDescription>
                  Gérez le contenu de la bannière principale
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero-title">Titre Principal</Label>
                  <Input
                    id="hero-title"
                    value={homeContent.hero.title}
                    onChange={(e) => setHomeContent(prev => ({
                      ...prev,
                      hero: { ...prev.hero, title: e.target.value }
                    }))}
                    placeholder="Titre accrocheur"
                  />
                </div>

                <div>
                  <Label htmlFor="hero-subtitle">Sous-titre</Label>
                  <Textarea
                    id="hero-subtitle"
                    value={homeContent.hero.subtitle}
                    onChange={(e) => setHomeContent(prev => ({
                      ...prev,
                      hero: { ...prev.hero, subtitle: e.target.value }
                    }))}
                    placeholder="Description engageante"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="hero-background">Image d'arrière-plan (URL)</Label>
                  <Input
                    id="hero-background"
                    value={homeContent.hero.background_image}
                    onChange={(e) => setHomeContent(prev => ({
                      ...prev,
                      hero: { ...prev.hero, background_image: e.target.value }
                    }))}
                    placeholder="https://exemple.com/hero-image.jpg"
                  />
                </div>

                {/* Preview */}
                <div className="mt-6 p-4 border rounded-lg bg-accent/30">
                  <h3 className="text-sm font-medium text-secondary mb-2">Aperçu</h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary to-primary/80 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-white p-8">
                      <div className="text-center">
                        <h2 className="text-2xl font-light mb-2">{homeContent.hero.title}</h2>
                        <p className="text-white/90">{homeContent.hero.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="stats" className="space-y-6 mt-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Star className="w-5 h-5" />
                  Statistiques Clés
                </CardTitle>
                <CardDescription>
                  Mettez à jour les chiffres de performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="total-projects">Total Projets</Label>
                    <Input
                      id="total-projects"
                      type="number"
                      value={homeContent.stats.total_projects}
                      onChange={(e) => setHomeContent(prev => ({
                        ...prev,
                        stats: { ...prev.stats, total_projects: Number(e.target.value) }
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="happy-clients">Clients Satisfaits</Label>
                    <Input
                      id="happy-clients"
                      type="number"
                      value={homeContent.stats.happy_clients}
                      onChange={(e) => setHomeContent(prev => ({
                        ...prev,
                        stats: { ...prev.stats, happy_clients: Number(e.target.value) }
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="years-experience">Années d'Expérience</Label>
                    <Input
                      id="years-experience"
                      type="number"
                      value={homeContent.stats.years_experience}
                      onChange={(e) => setHomeContent(prev => ({
                        ...prev,
                        stats: { ...prev.stats, years_experience: Number(e.target.value) }
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="properties-sold">Propriétés Vendues</Label>
                    <Input
                      id="properties-sold"
                      type="number"
                      value={homeContent.stats.properties_sold}
                      onChange={(e) => setHomeContent(prev => ({
                        ...prev,
                        stats: { ...prev.stats, properties_sold: Number(e.target.value) }
                      }))}
                    />
                  </div>
                </div>

                {/* Stats Preview */}
                <div className="mt-6 p-4 border rounded-lg bg-accent/30">
                  <h3 className="text-sm font-medium text-secondary mb-4">Aperçu</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Projets', value: homeContent.stats.total_projects },
                      { label: 'Clients', value: homeContent.stats.happy_clients },
                      { label: 'Années', value: homeContent.stats.years_experience },
                      { label: 'Vendues', value: homeContent.stats.properties_sold }
                    ].map((stat, index) => (
                      <div key={index} className="text-center p-3 bg-white/50 rounded-lg">
                        <div className="text-2xl font-light text-primary">{stat.value.toLocaleString()}</div>
                        <div className="text-xs text-secondary">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Testimonials */}
        <TabsContent value="testimonials" className="space-y-6 mt-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Quote className="w-5 h-5" />
                      Témoignages Clients
                    </CardTitle>
                    <CardDescription>
                      Gérez les avis et retours clients
                    </CardDescription>
                  </div>
                  <Button onClick={() => openTestimonialModal()} className="btn-premium">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter Témoignage
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {homeContent.testimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 border rounded-lg bg-accent/30"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Quote className="w-5 h-5 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-primary">{testimonial.name}</h4>
                            <p className="text-sm text-secondary">{testimonial.role}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openTestimonialModal(testimonial)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteTestimonial(testimonial.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <blockquote className="mt-2 text-sm italic text-secondary">
                          "{testimonial.content}"
                        </blockquote>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Media */}
        <TabsContent value="media" className="space-y-6 mt-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <ImageIcon className="w-5 h-5" />
                  Gestion des Médias
                </CardTitle>
                <CardDescription>
                  Téléchargez et organisez vos images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                  <ImageIcon className="w-12 h-12 text-secondary/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-primary mb-2">
                    Télécharger des Images
                  </h3>
                  <p className="text-secondary mb-4">
                    Glissez et déposez vos fichiers ou cliquez pour parcourir
                  </p>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Choisir des Fichiers
                  </Button>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-secondary mb-3">Formats acceptés</h4>
                  <div className="flex gap-2">
                    {['JPG', 'PNG', 'WebP', 'SVG'].map((format) => (
                      <Badge key={format} variant="outline" className="text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Testimonial Modal */}
      <Dialog open={isTestimonialModalOpen} onOpenChange={setIsTestimonialModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? 'Modifier le Témoignage' : 'Nouveau Témoignage'}
            </DialogTitle>
            <DialogDescription>
              Ajoutez un avis client authentique
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="testimonial-name">Nom *</Label>
              <Input
                id="testimonial-name"
                value={testimonialForm.name}
                onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom du client"
              />
            </div>

            <div>
              <Label htmlFor="testimonial-role">Fonction/Titre</Label>
              <Input
                id="testimonial-role"
                value={testimonialForm.role}
                onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                placeholder="ex: Investisseur, Entrepreneur..."
              />
            </div>

            <div>
              <Label htmlFor="testimonial-content">Témoignage *</Label>
              <Textarea
                id="testimonial-content"
                value={testimonialForm.content}
                onChange={(e) => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Partagez l'expérience du client..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="testimonial-avatar">Avatar (URL)</Label>
              <Input
                id="testimonial-avatar"
                value={testimonialForm.avatar}
                onChange={(e) => setTestimonialForm(prev => ({ ...prev, avatar: e.target.value }))}
                placeholder="https://exemple.com/avatar.jpg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsTestimonialModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleTestimonialSave} className="btn-premium">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};