import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, Eye, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DocumentsStepProps {
  form: UseFormReturn<BuildingFormData>;
}

export const DocumentsStep: React.FC<DocumentsStepProps> = ({ form }) => {
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  // Fonction d'upload simplifiée et corrigée
  const uploadFile = async (file: File, fieldName: string) => {
    try {
      setUploading({ ...uploading, [fieldName]: true });
      
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `buildings/${fileName}`;

      // Upload du fichier
      const { data, error } = await supabase.storage
        .from('buildings')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error(`Erreur d'upload: ${error.message}`);
        return;
      }

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from('buildings')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        // Mettre à jour le champ du formulaire
        form.setValue(fieldName as any, urlData.publicUrl);
        setPreviews({ ...previews, [fieldName]: urlData.publicUrl });
        toast.success('Document téléchargé avec succès');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploading({ ...uploading, [fieldName]: false });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Le fichier doit faire moins de 10MB');
        return;
      }

      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format non supporté. Utilisez JPG, PNG, GIF, WEBP ou PDF');
        return;
      }

      uploadFile(file, fieldName);
    }
  };

  const removeFile = (fieldName: string) => {
    form.setValue(fieldName as any, '');
    setPreviews({ ...previews, [fieldName]: '' });
    toast.info('Document supprimé');
  };

  return (
    <div className="space-y-6">
      {/* Titre de l'étape */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-500" />
          Documents du bâtiment
        </h2>
        <p className="text-slate-500 mt-2">
          Téléchargez les plans, modèles 3D et brochures
        </p>
      </div>

      {/* Note importante */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Image className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Formats acceptés :</p>
              <p>Images : JPG, PNG, GIF, WEBP (max 10MB)</p>
              <p>Documents : PDF (max 10MB)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {/* Plan d'étage type */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="typical_floor_plan_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Plan d'étage type
                  </FormLabel>
                  <FormDescription>
                    Plan architectural d'un étage standard
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value && previews.typical_floor_plan_url ? (
                        <div className="relative">
                          <img 
                            src={previews.typical_floor_plan_url || field.value} 
                            alt="Plan d'étage"
                            className="w-full max-h-64 object-contain rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeFile('typical_floor_plan_url')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange(e, 'typical_floor_plan_url')}
                            disabled={uploading.typical_floor_plan_url}
                            className="hidden"
                            id="floor-plan-upload"
                          />
                          <label
                            htmlFor="floor-plan-upload"
                            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors"
                          >
                            {uploading.typical_floor_plan_url ? (
                              <span className="text-slate-500">Téléchargement...</span>
                            ) : (
                              <div className="text-center">
                                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                <span className="text-sm text-slate-600">
                                  Cliquez pour télécharger
                                </span>
                              </div>
                            )}
                          </label>
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
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="model_3d_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Modèle 3D / Rendu
                  </FormLabel>
                  <FormDescription>
                    Visualisation 3D ou rendu architectural
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value && previews.model_3d_url ? (
                        <div className="relative">
                          <img 
                            src={previews.model_3d_url || field.value} 
                            alt="Modèle 3D"
                            className="w-full max-h-64 object-contain rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeFile('model_3d_url')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange(e, 'model_3d_url')}
                            disabled={uploading.model_3d_url}
                            className="hidden"
                            id="model-3d-upload"
                          />
                          <label
                            htmlFor="model-3d-upload"
                            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors"
                          >
                            {uploading.model_3d_url ? (
                              <span className="text-slate-500">Téléchargement...</span>
                            ) : (
                              <div className="text-center">
                                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                <span className="text-sm text-slate-600">
                                  Cliquez pour télécharger
                                </span>
                              </div>
                            )}
                          </label>
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
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="building_brochure_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Brochure du bâtiment
                  </FormLabel>
                  <FormDescription>
                    Document de présentation commerciale
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value && previews.building_brochure_url ? (
                        <div className="relative">
                          {field.value.endsWith('.pdf') ? (
                            <div className="p-4 border rounded-lg bg-slate-50">
                              <FileText className="h-12 w-12 text-slate-600 mx-auto mb-2" />
                              <p className="text-sm text-center text-slate-600">
                                Document PDF téléchargé
                              </p>
                              <a 
                                href={field.value} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm block text-center mt-2"
                              >
                                Voir le document
                              </a>
                            </div>
                          ) : (
                            <img 
                              src={previews.building_brochure_url || field.value} 
                              alt="Brochure"
                              className="w-full max-h-64 object-contain rounded-lg border"
                            />
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeFile('building_brochure_url')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange(e, 'building_brochure_url')}
                            disabled={uploading.building_brochure_url}
                            className="hidden"
                            id="brochure-upload"
                          />
                          <label
                            htmlFor="brochure-upload"
                            className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 cursor-pointer transition-colors"
                          >
                            {uploading.building_brochure_url ? (
                              <span className="text-slate-500">Téléchargement...</span>
                            ) : (
                              <div className="text-center">
                                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                <span className="text-sm text-slate-600">
                                  Cliquez pour télécharger
                                </span>
                              </div>
                            )}
                          </label>
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