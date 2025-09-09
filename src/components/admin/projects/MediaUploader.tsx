import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MediaUploaderProps {
  field: {
    value: string[];
    onChange: (value: string[]) => void;
  };
  label: string;
  accept: string;
  bucketName?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({ 
  field, 
  label, 
  accept,
  bucketName = 'projects'
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const valueArray = Array.isArray(field.value) ? field.value : [];

  const handleUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const urls: string[] = [];
    
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
          urls.push(publicUrl);
        }
      }
      
      field.onChange([...(valueArray), ...urls]);
      
      if (urls.length > 0) {
        toast({
          title: "Upload réussi",
          description: `${urls.length} fichier(s) uploadé(s)`,
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
    handleUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = (index: number) => {
    const newFiles = valueArray.filter((_, i) => i !== index);
    field.onChange(newFiles);
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <Upload className="w-8 h-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Glissez-déposez vos fichiers ici ou
            </p>
            <Label htmlFor={`file-upload-${label}`} className="cursor-pointer">
              <span className="text-primary hover:text-primary/80 font-medium">
                parcourez vos fichiers
              </span>
              <Input
                id={`file-upload-${label}`}
                type="file"
                accept={accept}
                multiple
                className="hidden"
                onChange={(e) => handleUpload(Array.from(e.target.files || []))}
                disabled={uploading}
              />
            </Label>
          </div>
          {uploading && (
            <Badge variant="secondary" className="animate-pulse">
              Upload en cours...
            </Badge>
          )}
        </div>
      </div>

      {/* File List */}
      {valueArray.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Fichiers uploadés ({valueArray.length})
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {valueArray.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                  {isImage(url) ? (
                    <img 
                      src={url} 
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};