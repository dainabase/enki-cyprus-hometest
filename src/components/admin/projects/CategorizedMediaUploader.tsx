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
import { logger } from '@/lib/logger';

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
  { value: 'hero', label: 'Photo\nPrincipale', icon: Star, description: 'Image mise en avant sur les listes' },
  { value: 'exterior_1', label: 'Extérieur 1', icon: Camera, description: 'Façades principales, entrées' },
  { value: 'exterior_2', label: 'Extérieur 2', icon: Camera, description: 'Jardins, terrasses, cours' },
  { value: 'interior_1', label: 'Intérieur 1', icon: ImageIcon, description: 'Salon, séjour, espaces de vie' },
  { value: 'interior_2', label: 'Intérieur 2', icon: ImageIcon, description: 'Chambres, bureaux' },
  { value: 'kitchen', label: 'Cuisine', icon: ImageIcon, description: 'Cuisine équipée, coin repas' },
  { value: 'bedroom', label: 'Chambres', icon: ImageIcon, description: 'Chambres à coucher' },
  { value: 'bathroom', label: 'Salles\nde bain', icon: ImageIcon, description: 'Salles de bain, WC' },
  { value: 'balcony', label: 'Balcons\nTerrasses', icon: Camera, description: 'Balcons, terrasses, loggias' },
  { value: 'garden', label: 'Jardin', icon: Camera, description: 'Espaces verts, piscine' },
  { value: 'panoramic_view', label: 'Vue\nPanoramique', icon: Move, description: 'Vues d\'ensemble, panoramas' },
  { value: 'sea_view', label: 'Vue Mer', icon: Move, description: 'Vues sur la mer' },
  { value: 'mountain_view', label: 'Vue\nMontagne', icon: Move, description: 'Vues sur les montagnes' },
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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // DEBUG: Log what we receive and validate photos
  React.useEffect(() => {
    logger.info('CategorizedMediaUploader received:', {
      field_value: field.value,
      field_value_type: typeof field.value,
      field_value_length: field.value?.length || 0,
      first_photo: field.value?.[0]
    });
    
    // Validate that all photos have valid URLs
    if (field.value && Array.isArray(field.value)) {
      field.value.forEach((photo, index) => {
        if (!photo || !photo.url) {
          console.warn(`Invalid photo at index ${index}:`, photo);
        } else {
          logger.info(`Valid photo ${index}:`, { url: photo.url, category: photo.category });
        }
      });
    }
  }, [field.value]);

  // Enforce one photo per catégorie
  React.useEffect(() => {
    const seen = new Set<string>();
    const normalized = (field.value || []).slice().reverse().filter((p) => {
      if (seen.has(p.category)) return false;
      seen.add(p.category);
      return true;
    }).reverse();
    if (normalized.length !== (field.value || []).length) {
      field.onChange(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(field.value)]);


  const handleUpload = async (files: File[], category: string) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      if (files.length > 1) {
        toast({
          title: "1 photo maximum par type",
          description: "Seule la première image a été prise en compte.",
        });
      }

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
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      const newPhoto: CategorizedPhoto = {
        url: publicUrl,
        category: category as CategorizedPhoto['category'],
        isPrimary: category === 'hero',
        caption: ''
      };

      const withoutCategory = (field.value || []).filter(p => p.category !== category);
      const updatedPhotos = [...withoutCategory, newPhoto];
      field.onChange(updatedPhotos);

      logger.info('🔄 CategorizedMediaUploader: Photos updated', {
        newPhoto,
        totalPhotos: updatedPhotos.length,
        allPhotos: updatedPhotos,
        category,
        publicUrl
      });

      toast({
        title: "Photo mise à jour",
        description: `${PHOTO_CATEGORIES.find(c => c.value === category)?.label} remplacée`,
      });
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
    const files = Array.from(e.dataTransfer.files).slice(0, 1);
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
    logger.info('🗑️ Photo removed:', {
      removedIndex: index,
      oldCount: field.value.length,
      newCount: newPhotos.length,
      remainingPhotos: newPhotos
    });
    field.onChange(newPhotos);
  };

  const setPrimary = (index: number) => {
    const newPhotos = field.value.map((photo, i) => ({
      ...photo,
      isPrimary: i === index
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
    return (field.value || []).filter(photo => photo && photo.url && photo.category === category);
  };

  const renderUploadZone = (category: string) => {
    const categoryInfo = PHOTO_CATEGORIES.find(c => c.value === category);
    const photos = getPhotosByCategory(category);
    const Icon = categoryInfo?.icon || Camera;

    return (
      <div className="space-y-4">
        {/* Upload Zone */}
        <Card className="overflow-hidden">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
              dragOver && selectedCategory === category
                ? 'border-primary bg-primary/5 scale-[1.02]' 
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <Icon className="w-12 h-12 text-muted-foreground" />
                {uploading && selectedCategory === category && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{categoryInfo?.label}</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {categoryInfo?.description}
                </p>
              </div>
              
              <div className="flex flex-col items-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Glissez-déposez vos photos ici
                </p>
                
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="relative bg-background hover:bg-muted"
                    disabled={uploading}
                    onClick={() => document.getElementById(`file-upload-${category}`)?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Parcourir les fichiers
                  </Button>
                  
                  <Input
                    id={`file-upload-${category}`}
                    type="file"
                    accept="image/*"
                    multiple={false}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      setSelectedCategory(category);
                      handleUpload(Array.from(e.target.files || []).slice(0, 1), category);
                    }}
                    disabled={uploading}
                  />
                </div>
                
                {uploading && selectedCategory === category && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Upload en cours...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Photos Grid */}
        {photos.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <h4 className="text-sm font-semibold">
                    {photos.length} photo{photos.length > 1 ? 's' : ''} ajoutée{photos.length > 1 ? 's' : ''}
                  </h4>
                </div>
                {category === 'hero' && photos.length > 1 && (
                  <Badge variant="outline" className="text-xs">
                    Une seule photo principale recommandée
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo, photoIndex) => {
                  const globalIndex = field.value.findIndex(p => p.url === photo.url);
                  return (
                    <Card key={photo.url} className="overflow-hidden group hover:shadow-md transition-all duration-200">
                      <div className="relative aspect-video">
                        <img 
                          src={photo.url} 
                          alt={photo.caption || `${categoryInfo?.label} ${photoIndex + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { 
                            console.warn('🖼️ Image failed to load:', photo.url);
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src = '/placeholder.svg'; 
                          }}
                          onLoad={() => logger.info('Image loaded successfully:', photo.url)}
                        />
                        
                        {/* Actions overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                          <Button
                            size="sm"
                            variant={photo.isPrimary ? "default" : "secondary"}
                            className="h-8 px-3"
                            onClick={() => setPrimary(globalIndex)}
                            title={photo.isPrimary ? "Photo principale" : "Définir comme principale"}
                          >
                            <Star className={`w-3 h-3 mr-1 ${photo.isPrimary ? 'fill-current' : ''}`} />
                            {photo.isPrimary ? 'Principale' : 'Définir'}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 px-3"
                            onClick={() => removePhoto(globalIndex)}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                        
                        {/* Primary badge */}
                        {photo.isPrimary && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-primary text-primary-foreground">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Principale
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-3">
                        <Input
                          placeholder="Légende (optionnel)"
                          value={photo.caption || ''}
                          onChange={(e) => updateCaption(globalIndex, e.target.value)}
                          className="text-sm border-0 bg-muted/30 focus:bg-background transition-colors"
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
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

  // Auto-select first photo when photos are added
  React.useEffect(() => {
    if (field.value.length > 0 && selectedPhotoIndex === null) {
      setSelectedPhotoIndex(0);
    }
  }, [field.value.length, selectedPhotoIndex]);

  const currentPhoto = selectedPhotoIndex !== null ? field.value[selectedPhotoIndex] : null;

  return (
    <div className="space-y-6">
      {/* Gallery View - Large Preview with Thumbnails */}
      {field.value.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Galerie de Photos ({field.value.length})
            </CardTitle>
            <CardDescription>
              Cliquez sur une miniature pour la prévisualiser et la modifier
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Large Preview */}
            {currentPhoto && (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={currentPhoto.url} 
                    alt={currentPhoto.caption || `Photo ${selectedPhotoIndex! + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => { 
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = '/placeholder.svg'; 
                    }}
                  />
                  
                  {/* Primary badge on large preview */}
                  {currentPhoto.isPrimary && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="w-4 h-4 mr-2 fill-current" />
                        Photo Principale
                      </Badge>
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">
                      {PHOTO_CATEGORIES.find(c => c.value === currentPhoto.category)?.label}
                    </Badge>
                  </div>
                </div>

                {/* Photo Actions & Caption */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant={currentPhoto.isPrimary ? "default" : "outline"}
                      onClick={() => setPrimary(selectedPhotoIndex!)}
                    >
                      <Star className={`w-4 h-4 mr-2 ${currentPhoto.isPrimary ? 'fill-current' : ''}`} />
                      {currentPhoto.isPrimary ? 'Principale' : 'Définir principale'}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        removePhoto(selectedPhotoIndex!);
                        setSelectedPhotoIndex(Math.max(0, selectedPhotoIndex! - 1));
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo-caption" className="text-sm font-medium">
                      Légende / Nom de la photo
                    </Label>
                    <Input
                      id="photo-caption"
                      placeholder="Ex: Vue panoramique sur la mer, Cuisine équipée..."
                      value={currentPhoto.caption || ''}
                      onChange={(e) => updateCaption(selectedPhotoIndex!, e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo-category" className="text-sm font-medium">
                      Catégorie
                    </Label>
                    <Select
                      value={currentPhoto.category}
                      onValueChange={(newCategory) => {
                        const newPhotos = field.value.map((photo, i) => 
                          i === selectedPhotoIndex ? { ...photo, category: newCategory as CategorizedPhoto['category'] } : photo
                        );
                        field.onChange(newPhotos);
                      }}
                    >
                      <SelectTrigger id="photo-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PHOTO_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label} - {cat.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* All Categories Grid - Photos + Empty slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Toutes les Catégories
          </CardTitle>
          <CardDescription>
            Cliquez sur une photo pour la modifier ou sur une catégorie vide pour ajouter une photo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {PHOTO_CATEGORIES.map((cat) => {
              const photo = getPhotosByCategory(cat.value)[0]; // One photo per category
              const Icon = cat.icon;
              const photoIndex = photo ? field.value.findIndex(p => p.url === photo.url) : null;
              
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    if (photo) {
                      setSelectedPhotoIndex(photoIndex);
                    } else {
                      setSelectedCategory(cat.value);
                      // Scroll to upload zone
                      setTimeout(() => {
                        document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    photo && selectedPhotoIndex === photoIndex
                      ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                      : photo
                        ? 'border-green-500/50 hover:border-green-500'
                        : 'border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/20'
                  }`}
                >
                  <div className="aspect-video relative">
                    {photo ? (
                      <>
                        <img 
                          src={photo.url} 
                          alt={photo.caption || cat.label}
                          className="w-full h-full object-cover"
                          onError={(e) => { 
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src = '/placeholder.svg'; 
                          }}
                        />
                        
                        {/* Primary indicator */}
                        {photo.isPrimary && (
                          <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                              <Star className="w-4 h-4 text-primary-foreground fill-current" />
                            </div>
                          </div>
                        )}

                        {/* Selection indicator */}
                        {selectedPhotoIndex === photoIndex && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                              <Camera className="w-6 h-6 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                        <Icon className="w-8 h-8 mb-2" />
                        <Upload className="w-5 h-5 opacity-50" />
                      </div>
                    )}
                  </div>
                  
                  {/* Category label */}
                  <div className="p-3 bg-background border-t">
                    <p className="text-sm font-medium text-center truncate">
                      {cat.label.replace('\n', ' ')}
                    </p>
                    {photo && photo.caption && (
                      <p className="text-xs text-muted-foreground text-center truncate mt-1">
                        {photo.caption}
                      </p>
                    )}
                    {!photo && (
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        Aucune photo
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upload Zone for Selected Category */}
      <Card id="upload-zone">
        <CardHeader>
          <div className="flex items-center gap-2">
            {(() => {
              const categoryInfo = PHOTO_CATEGORIES.find(c => c.value === selectedCategory);
              const Icon = categoryInfo?.icon;
              return Icon ? <Icon className="w-5 h-5" /> : null;
            })()}
            <CardTitle>
              Ajouter / Remplacer: {PHOTO_CATEGORIES.find(c => c.value === selectedCategory)?.label}
            </CardTitle>
          </div>
          <CardDescription>
            {PHOTO_CATEGORIES.find(c => c.value === selectedCategory)?.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderUploadZone(selectedCategory)}
        </CardContent>
      </Card>
    </div>
  );
};