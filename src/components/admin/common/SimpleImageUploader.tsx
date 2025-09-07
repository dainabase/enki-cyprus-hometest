import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { uploadImage, BucketType } from "@/lib/supabase/storage";
import { X, Upload } from "lucide-react";

interface SimpleImageUploaderProps {
  bucket: BucketType;
  entityId: string;
  maxFiles: number;
  onUploadComplete: (urls: string[]) => void;
  existingImages?: string[];
}

const SimpleImageUploader: React.FC<SimpleImageUploaderProps> = ({ 
  bucket, 
  entityId, 
  maxFiles, 
  onUploadComplete,
  existingImages = []
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const totalFiles = existingImages.length + selectedFiles.length + fileArray.length;
    
    if (totalFiles > maxFiles) {
      toast({
        variant: "destructive",
        title: "Limite dépassée",
        description: `Maximum ${maxFiles} images autorisées`
      });
      return;
    }
    
    // Filter valid image files
    const validFiles = fileArray.filter(file => {
      const isValid = file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024; // 5MB max
      if (!isValid && file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse 5MB`
        });
      } else if (!isValid) {
        toast({
          variant: "destructive",
          title: "Format non supporté",
          description: `${file.name} n'est pas une image`
        });
      }
      return isValid;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    const uploadedUrls: string[] = [];
    
    try {
      for (const file of selectedFiles) {
        const url = await uploadImage(bucket, file, entityId);
        uploadedUrls.push(url);
      }
      
      onUploadComplete(uploadedUrls);
      setSelectedFiles([]);
      
      toast({
        title: "Upload réussi",
        description: `${uploadedUrls.length} image(s) uploadée(s)`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'upload",
        description: error.message
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-border hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">
          Glissez-déposez vos images ici ou cliquez pour sélectionner
        </p>
        <p className="text-xs text-muted-foreground">
          Formats: JPG, PNG, WebP • Max 5MB par fichier • {existingImages.length + selectedFiles.length}/{maxFiles} images
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded border"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedFile(index);
                  }}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={uploadFiles} 
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? "Upload en cours..." : `Uploader ${selectedFiles.length} image(s)`}
            </Button>
            <Button 
              onClick={() => setSelectedFiles([])} 
              variant="outline"
              disabled={isUploading}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleImageUploader;