import React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface ProjectFormStepsProps {
  form: UseFormReturn<any>;
  currentStep: string;
}

export const ProjectFormSteps: React.FC<ProjectFormStepsProps> = ({ form, currentStep }) => {
  switch (currentStep) {
    case 'basics':
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Informations de base</h3>
          <p className="text-muted-foreground">Définissez les informations principales du projet</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Titre du projet *
              </label>
              <input
                type="text"
                id="title"
                {...form.register('title')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nom du projet"
              />
            </div>
            
            <div>
              <label htmlFor="project_code" className="block text-sm font-medium mb-2">
                Code projet
              </label>
              <input
                type="text"
                id="project_code"
                {...form.register('project_code')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Code unique"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                {...form.register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Description du projet"
              />
            </div>
          </div>
        </div>
      );
      
    case 'location':
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Localisation</h3>
          <p className="text-muted-foreground">Définissez l'emplacement du projet</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                Ville *
              </label>
              <input
                type="text"
                id="city"
                {...form.register('city')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ville"
              />
            </div>
            
            <div>
              <label htmlFor="region" className="block text-sm font-medium mb-2">
                Région
              </label>
              <input
                type="text"
                id="region"
                {...form.register('region')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Région"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="full_address" className="block text-sm font-medium mb-2">
                Adresse complète
              </label>
              <input
                type="text"
                id="full_address"
                {...form.register('full_address')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Adresse complète"
              />
            </div>
          </div>
        </div>
      );
      
    case 'specifications':
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Spécifications</h3>
          <p className="text-muted-foreground">Détails techniques du projet</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="total_units" className="block text-sm font-medium mb-2">
                Total unités
              </label>
              <input
                type="number"
                id="total_units"
                {...form.register('total_units')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
              />
            </div>
            
            <div>
              <label htmlFor="price_from" className="block text-sm font-medium mb-2">
                Prix à partir de (€)
              </label>
              <input
                type="number"
                id="price_from"
                {...form.register('price_from')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
              />
            </div>
            
            <div>
              <label htmlFor="price_to" className="block text-sm font-medium mb-2">
                Prix jusqu'à (€)
              </label>
              <input
                type="number"
                id="price_to"
                {...form.register('price_to')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      );
      
    case 'amenities':
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Équipements</h3>
          <p className="text-muted-foreground">Sélectionnez les équipements disponibles</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'piscine', 'gym', 'spa', 'parking', 'securite_24_7', 
              'conciergerie', 'restaurant', 'jardin', 'tennis', 'playground'
            ].map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...form.register(`amenities.${amenity}`)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm capitalize">{amenity.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>
      );
      
    case 'timeline':
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Calendrier</h3>
          <p className="text-muted-foreground">Dates importantes du projet</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="launch_date" className="block text-sm font-medium mb-2">
                Date de lancement
              </label>
              <input
                type="date"
                id="launch_date"
                {...form.register('launch_date')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="completion_date" className="block text-sm font-medium mb-2">
                Date de livraison
              </label>
              <input
                type="date"
                id="completion_date"
                {...form.register('completion_date')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="project_phase" className="block text-sm font-medium mb-2">
                Phase du projet
              </label>
              <select
                id="project_phase"
                {...form.register('project_phase')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="planning">Planification</option>
                <option value="off-plan">Avant construction</option>
                <option value="under-construction">En construction</option>
                <option value="completed">Terminé</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-2">
                Statut
              </label>
              <select
                id="status"
                {...form.register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
                <option value="paused">En pause</option>
                <option value="completed">Terminé</option>
              </select>
            </div>
          </div>
        </div>
      );
      
    case 'media':
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Médias</h3>
          <p className="text-muted-foreground">Images et vidéos du projet</p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="video_url" className="block text-sm font-medium mb-2">
                URL vidéo
              </label>
              <input
                type="url"
                id="video_url"
                {...form.register('video_url')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            
            <div>
              <label htmlFor="virtual_tour_url" className="block text-sm font-medium mb-2">
                Visite virtuelle
              </label>
              <input
                type="url"
                id="virtual_tour_url"
                {...form.register('virtual_tour_url')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://..."
              />
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500">Zone de téléchargement d'images</p>
              <p className="text-sm text-gray-400">Cette fonctionnalité sera disponible prochainement</p>
            </div>
          </div>
        </div>
      );
      
    case 'seo':
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">SEO & Marketing</h3>
          <p className="text-muted-foreground">Optimisation pour les moteurs de recherche</p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="meta_title" className="block text-sm font-medium mb-2">
                Titre SEO
              </label>
              <input
                type="text"
                id="meta_title"
                {...form.register('meta_title')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Titre optimisé pour les moteurs de recherche"
              />
            </div>
            
            <div>
              <label htmlFor="meta_description" className="block text-sm font-medium mb-2">
                Description SEO
              </label>
              <textarea
                id="meta_description"
                {...form.register('meta_description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Description pour les résultats de recherche"
              />
            </div>
            
            <div>
              <label htmlFor="url_slug" className="block text-sm font-medium mb-2">
                URL Slug
              </label>
              <input
                type="text"
                id="url_slug"
                {...form.register('url_slug')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="nom-du-projet"
              />
            </div>
          </div>
        </div>
      );
      
    default:
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Étape "{currentStep}" non trouvée</p>
        </div>
      );
  }
};