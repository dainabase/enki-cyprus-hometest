import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string; // storage folder prefix
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, folder = "projects" }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handlePick = () => inputRef.current?.click();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploaded: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Ensure image type
        if (!file.type.startsWith("image/")) {
          toast({ variant: "destructive", title: "Fichier ignoré", description: `${file.name} n'est pas une image` });
          continue;
        }

        const id = crypto.randomUUID();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${folder}/${id}-${sanitizedName}`;

        const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

        if (upErr) {
          console.error("Upload error", upErr);
          toast({ variant: "destructive", title: "Échec de l'upload", description: upErr.message });
          continue;
        }

        const { data } = supabase.storage.from("media").getPublicUrl(path);
        if (data?.publicUrl) uploaded.push(data.publicUrl);
      }

      if (uploaded.length) {
        const next = [...(value || []), ...uploaded];
        onChange(next);
        toast({ title: "Images ajoutées", description: `${uploaded.length} image(s) importée(s)` });
      }
    } catch (e: any) {
      console.error(e);
      toast({ variant: "destructive", title: "Erreur", description: e?.message || "Échec lors de l'upload" });
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = ""; // reset to allow re-selecting same files
    }
  };

  const handleRemove = (url: string) => {
    const next = (value || []).filter((u) => u !== url);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.currentTarget.files)}
        />
        <Button type="button" variant="outline" onClick={handlePick} disabled={isUploading}>
          {isUploading ? "Upload en cours…" : "Sélectionner des images"}
        </Button>
        <p className="text-xs text-muted-foreground">Formats: JPG, PNG, WebP. Taille max recommandée: 5 Mo.</p>
      </div>

      {value?.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {value.map((url) => (
            <div key={url} className="relative group rounded-md overflow-hidden border">
              <img
                src={url}
                alt={`Photo projet - ${url.split("/").pop()}`}
                className="h-24 w-full object-cover"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-1 right-1 inline-flex items-center justify-center rounded-full p-1 bg-background/80 border shadow hover:bg-background"
                aria-label="Supprimer l'image"
                title="Supprimer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
