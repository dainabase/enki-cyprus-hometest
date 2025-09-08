import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, Image as ImageIcon, Star, Move, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CategorizedPhoto {
  url: string;
  category: 'hero' | 'exterior_1' | 'exterior_2' | 'interior_1' | 'interior_2' | 'panoramic_view' | 'sea_view' | 'mountain_view' | 'amenities' | 'plans' | 'kitchen' | 'bedroom' | 'bathroom' | 'balcony' | 'garden';
  isPrimary?: boolean;
  caption?: string;
}

interface CategorizedMediaUploaderProps {
  field: {
    value: CategorizedPhoto[];
    onChange: (value: CategorizedPhoto[]) => void;
  };
  bucketName?: string;
}

const PHOTO_CATEGORIES = [
  { value: 'hero', label: 'Photo Principale', icon: Star, description: 'Image mise en avant sur les listes' },
  { value: 'exterior_1', label: 'Extérieur 1', icon: Camera, description: 'Façades principales, entrées' },
  { value: 'exterior_2', label: 'Extérieur 2', icon: Camera, description: 'Jardins, terrasses, cours' },
  { value: 'interior_1', label: 'Intérieur 1', icon: ImageIcon, description: 'Salon, séjour, espaces de vie' },
  { value: 'interior_2', label: 'Intérieur 2', icon: ImageIcon, description: 'Chambres, bureaux' },
  { value: 'kitchen', label: 'Cuisine', icon: ImageIcon, description: 'Cuisine équipée, coin repas' },
  { value: 'bedroom', label: 'Chambres', icon: ImageIcon, description: 'Chambres à coucher' },
  { value: 'bathroom', label: 'Salles de bain', icon: ImageIcon, description: 'Salles de bain, WC' },
  { value: 'balcony', label: 'Balcons/Terrasses', icon: Camera, description: 'Balcons, terrasses, loggias' },
  { value: 'garden', label: 'Jardin', icon: Camera, description: 'Espaces verts, piscine' },
  { value: 'panoramic_view', label: 'Vue Panoramique', icon: Move, description: 'Vues d\'ensemble, panoramas' },
  { value: 'sea_view', label: 'Vue Mer', icon: Move, description: 'Vues sur la mer' },
  { value: 'mountain_view', label: 'Vue Montagne', icon: Move, description: 'Vues sur les montagnes' },
  { value: 'amenities', label: 'Prestations', icon: Star, description: 'Piscine, gym, espaces communs' },
  { value: 'plans', label: 'Plans', icon: ImageIcon, description: 'Plans d\'étage, techniques' },
];

export const CategorizedMediaUploader: React.FC<CategorizedMediaUploaderProps> = ({ 
  field, 
  bucketName = 'projects'
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('hero');
  const [activeTab, setActiveTab] = useState('hero');

  const handleUpload = async (files: File[], category: string) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const newPhotos: CategorizedPhoto[] = [];
    
    try {
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file);
        
        if (error) {
          console.error('Upload error:', error);
          toast({
            title: "Erreur d'upload",
            description: `Impossible d'uploader ${file.name}`,
            variant: "destructive"
          });
          continue;
        }
        
        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);
          
          newPhotos.push({
            url: publicUrl,
            category: category as CategorizedPhoto['category'],
            isPrimary: category === 'hero' && !field.value.find(p => p.category === 'hero'),
            caption: ''
          });
        }
      }
      
      field.onChange([...(field.value || []), ...newPhotos]);
      
      if (newPhotos.length > 0) {
        toast({
          title: "Upload réussi",
          description: `${newPhotos.length} photo(s) ajoutée(s) à ${PHOTO_CATEGORIES.find(c => c.value === category)?.label}`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur d'upload",
        description: "Une erreur est survenue lors de l'upload",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleUpload(files, selectedCategory);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removePhoto = (index: number) => {
    const newPhotos = field.value.filter((_, i) => i !== index);
    field.onChange(newPhotos);
  };

  const setPrimary = (index: number) => {
    const newPhotos = field.value.map((photo, i) => ({
      ...photo,
      isPrimary: i === index && photo.category === 'hero'
    }));
    field.onChange(newPhotos);
  };

  const updateCaption = (index: number, caption: string) => {
    const newPhotos = field.value.map((photo, i) => 
      i === index ? { ...photo, caption } : photo
    );
    field.onChange(newPhotos);
  };

  const getPhotosByCategory = (category: string) => {
    return field.value.filter(photo => photo.category === category);
  };

  const renderUploadZone = (category: string) => {
    const categoryInfo = PHOTO_CATEGORIES.find(c => c.value === category);
    const photos = getPhotosByCategory(category);
    const Icon = categoryInfo?.icon || Camera;

    return (
      <div className="space-y-4">
        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragOver && selectedCategory === category
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <Icon className="w-8 h-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">{categoryInfo?.label}</p>
              <p className="text-xs text-muted-foreground mb-2">
                {categoryInfo?.description}
              </p>
              <p className="text-sm text-muted-foreground">
                Glissez-déposez vos photos ici ou
              </p>
              <Label htmlFor={`file-upload-${category}`} className="cursor-pointer">
                <span className="text-primary hover:text-primary/80 font-medium">
                  parcourez vos fichiers
                </span>
                <Input
                  id={`file-upload-${category}`}
                  type="file"
                  accept="image/*"
                  multiple={category !== 'hero'}
                  className="hidden"
                  onChange={(e) => {
                    setSelectedCategory(category);
                    handleUpload(Array.from(e.target.files || []), category);
                  }}
                  disabled={uploading}
                />
              </Label>
            </div>
            {uploading && selectedCategory === category && (
              <Badge variant="secondary" className="animate-pulse">
                Upload en cours...
              </Badge>
            )}
          </div>
        </div>

        {/* Photos Grid */}
        {photos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {photos.length} photo{photos.length > 1 ? 's' : ''}
              </Label>
              {category === 'hero' && photos.length > 1 && (
                <Badge variant="outline" className="text-xs">
                  Une seule photo principale recommandée
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo, photoIndex) => {
                const globalIndex = field.value.findIndex(p => p.url === photo.url);
                return (
                  <Card key={photo.url} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <img 
                        src={photo.url} 
                        alt={photo.caption || `${categoryInfo?.label} ${photoIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {category === 'hero' && (
                        <div className="absolute top-2 left-2">
                          <Button
                            size="sm"
                            variant={photo.isPrimary ? "default" : "secondary"}
                            className="w-8 h-8 p-0 rounded-full"
                            onClick={() => setPrimary(globalIndex)}
                            title={photo.isPrimary ? "Photo principale" : "Définir comme principale"}
                          >
                            <Star className={`w-3 h-3 ${photo.isPrimary ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 w-6 h-6 p-0 rounded-full"
                        onClick={() => removePhoto(globalIndex)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <CardContent className="p-3">
                      <Input
                        placeholder="Légende (optionnel)"
                        value={photo.caption || ''}
                        onChange={(e) => updateCaption(globalIndex, e.target.value)}
                        className="text-xs"
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getTotalByCategory = () => {
    return PHOTO_CATEGORIES.map(cat => ({
      ...cat,
      count: getPhotosByCategory(cat.value).length
    }));
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Gestionnaire de Photos
          </CardTitle>
          <CardDescription>
            Organisez vos photos par catégorie pour un affichage optimal sur le site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            {getTotalByCategory().map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.value} className="text-center p-2 border rounded-lg hover:bg-muted/30 transition-colors">
                  <Icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs font-medium mb-1 leading-tight">{cat.label}</p>
                  <Badge variant="secondary" className="text-xs">
                    {cat.count}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Categories Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8 gap-1">
          {PHOTO_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = getPhotosByCategory(cat.value).length;
            const isActive = activeTab === cat.value;
            return (
              <TabsTrigger 
                key={cat.value} 
                value={cat.value} 
                className={`flex items-center gap-1 text-xs px-2 py-2 transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 scale-105' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline text-xs font-medium">{cat.label}</span>
                {count > 0 && (
                  <Badge 
                    variant={isActive ? "secondary" : "outline"} 
                    className={`text-xs w-4 h-4 p-0 flex items-center justify-center ${
                      isActive ? 'bg-primary-foreground/20 text-primary-foreground' : ''
                    }`}
                  >
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {PHOTO_CATEGORIES.map((cat) => (
          <TabsContent key={cat.value} value={cat.value}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <cat.icon className="w-5 h-5" />
                  <CardTitle>{cat.label}</CardTitle>
                </div>
                <CardDescription>{cat.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderUploadZone(cat.value)}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};