import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, Eye, X, Image, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DocumentsStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const DocumentsStep: React.FC<DocumentsStepProps> = ({ form }) => {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  // Fonction d'upload
  const uploadFile = async (file: File, fieldName: string) => {
    try {
      setUploading(prev => ({ ...prev, [fieldName]: true }));
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux (max 10MB)');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Type de fichier non supporté. Utilisez JPG, PNG, GIF, WEBP ou PDF');
        return;
      }
      
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `building_${timestamp}_${randomString}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { data, error } = await supabase.storage
        .from('buildings')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        if (error.message.includes('policy') || error.message.includes('RLS')) {
          const { data: mediaData, error: mediaError } = await supabase.storage
            .from('media')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });
          
          if (mediaError) {
            toast.error(`Erreur d'upload: ${mediaError.message}`);
            return;
          }

          const { data: urlData } = supabase.storage
            .from('media')
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            form.setValue(fieldName as any, urlData.publicUrl);
            setPreviews(prev => ({ ...prev, [fieldName]: urlData.publicUrl }));
            toast.success('Document uploadé avec succès !');
          }
        } else {
          toast.error(`Erreur d'upload: ${error.message}`);
        }
        return;
      }

      const { data: urlData } = supabase.storage
        .from('buildings')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        form.setValue(fieldName as any, urlData.publicUrl);
        setPreviews(prev => ({ ...prev, [fieldName]: urlData.publicUrl }));
        toast.success('Document uploadé avec succès !');
      }

    } catch (error) {
      console.error('Upload exception:', error);
      toast.error('Une erreur inattendue s\'est produite');
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file, fieldName);
    }
  };

  const removeFile = (fieldName: string) => {
    form.setValue(fieldName as any, '');
    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldName];
      return newPreviews;
    });
    toast.info('Document supprimé');
  };

  return (
    <div className="space-y-6">
      {/* Titre de l'étape */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-500" />
          Documents et Plans
        </h2>
        <p className="text-slate-500 mt-2">
          Uploadez les documents et plans du bâtiment (PDF ou images)
        </p>
      </div>

      {/* Note importante */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 mt-0.5">ℹ️</div>
            <div className="text-sm text-slate-700">
              <p className="font-medium">Formats acceptés :</p>
              <p>Images : JPG, PNG, GIF, WEBP (max 10MB)</p>
              <p>Documents : PDF (max 10MB)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {/* Plan d'étage type */}
        <Card>
          <CardContent className="p-4">
            <FormField
              control={form.control}
              name="typical_floor_plan_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    Plan d'étage type
                  </FormLabel>
                  <FormDescription>
                    Plan architectural représentatif d'un étage standard
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          {...field}
                          type="text"
                          placeholder="URL du document ou uploadez un fichier"
                          className="flex-1"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileSelect(e, 'typical_floor_plan_url')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploading['typical_floor_plan_url']}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={uploading['typical_floor_plan_url']}
                          >
                            {uploading['typical_floor_plan_url'] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {(field.value || previews['typical_floor_plan_url']) && (
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-slate-500" />
                              <span className="text-sm text-slate-700">Document uploadé</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(field.value || previews['typical_floor_plan_url'], '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile('typical_floor_plan_url')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {(field.value || previews['typical_floor_plan_url'])?.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                            <img 
                              src={field.value || previews['typical_floor_plan_url']} 
                              alt="Plan d'étage"
                              className="mt-3 rounded-md max-h-48 object-contain w-full"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Modèle 3D */}
        <Card>
          <CardContent className="p-4">
            <FormField
              control={form.control}
              name="model_3d_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    Modèle 3D / Visite virtuelle
                  </FormLabel>
                  <FormDescription>
                    Lien vers le modèle 3D ou la visite virtuelle du bâtiment
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          {...field}
                          type="text"
                          placeholder="URL du modèle 3D ou uploadez un fichier"
                          className="flex-1"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileSelect(e, 'model_3d_url')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploading['model_3d_url']}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={uploading['model_3d_url']}
                          >
                            {uploading['model_3d_url'] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {(field.value || previews['model_3d_url']) && (
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Image className="h-4 w-4 text-slate-500" />
                              <span className="text-sm text-slate-700">Modèle uploadé</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(field.value || previews['model_3d_url'], '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile('model_3d_url')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Brochure du bâtiment */}
        <Card>
          <CardContent className="p-4">
            <FormField
              control={form.control}
              name="building_brochure_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">
                    Brochure du bâtiment
                  </FormLabel>
                  <FormDescription>
                    Document PDF de présentation commerciale du bâtiment
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          {...field}
                          type="text"
                          placeholder="URL de la brochure ou uploadez un fichier"
                          className="flex-1"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileSelect(e, 'building_brochure_url')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploading['building_brochure_url']}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={uploading['building_brochure_url']}
                          >
                            {uploading['building_brochure_url'] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {(field.value || previews['building_brochure_url']) && (
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-slate-500" />
                              <span className="text-sm text-slate-700">Brochure uploadée</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(field.value || previews['building_brochure_url'], '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile('building_brochure_url')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
