import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Image, Video, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  alt?: string;
  name?: string;
  file?: File;
}

interface MediaUploadProps {
  onMediaChange: (media: MediaItem[]) => void;
  currentMedia?: MediaItem[];
  accept?: string;
  maxSizeMB?: number;
  maxFiles?: number;
}

const MediaUpload = ({ 
  onMediaChange, 
  currentMedia = [],
  accept = "image/*,video/*", 
  maxSizeMB = 50,
  maxFiles = 10
}: MediaUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFilesSelect = (files: File[]) => {
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse ${maxSizeMB} MB`,
          variant: "destructive"
        });
        return false;
      }

      // Check if we're at max files
      if (currentMedia.length >= maxFiles) {
        toast({
          title: "Limite atteinte",
          description: `Maximum ${maxFiles} fichiers autorisés`,
          variant: "destructive"
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    const newMediaItems: MediaItem[] = validFiles.map(file => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      
      return {
        type: type as 'image' | 'video',
        url,
        name: file.name,
        alt: `${type === 'image' ? 'Image' : 'Vidéo'} - ${file.name}`,
        file
      };
    });

    const updatedMedia = [...currentMedia, ...newMediaItems];
    onMediaChange(updatedMedia);

    toast({
      title: "Médias ajoutés",
      description: `${validFiles.length} fichier(s) ajouté(s) avec succès`
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFilesSelect(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeMedia = (index: number) => {
    const mediaToRemove = currentMedia[index];
    
    // Clean up blob URL if it exists
    if (mediaToRemove.url && mediaToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(mediaToRemove.url);
    }

    const updatedMedia = currentMedia.filter((_, i) => i !== index);
    onMediaChange(updatedMedia);

    toast({
      title: "Média supprimé",
      description: "Le fichier a été retiré de la sélection"
    });
  };

  return (
    <div className="space-y-4">
      <Label>Médias (images et vidéos)</Label>
      
      {/* Current Media Preview */}
      {currentMedia.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 bg-accent/50 rounded-lg">
          {currentMedia.map((item, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-accent">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.alt || 'Image'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
              </div>
              
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeMedia(index)}
              >
                <X className="w-3 h-3" />
              </Button>
              
              <p className="text-xs text-center mt-1 text-muted-foreground truncate">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${currentMedia.length < maxFiles ? 'hover:border-primary hover:bg-primary/5' : 'opacity-50 cursor-not-allowed'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => currentMedia.length < maxFiles && fileInputRef.current?.click()}
      >
        <div className="space-y-3">
          {currentMedia.length < maxFiles ? (
            <>
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <Plus className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">
                  {currentMedia.length === 0 
                    ? "Ajoutez des images et vidéos" 
                    : `Ajouter plus de médias (${currentMedia.length}/${maxFiles})`
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Glissez-déposez ou cliquez pour sélectionner
                </p>
                <p className="text-xs text-muted-foreground">
                  Images et vidéos (max {maxSizeMB} MB par fichier)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Image className="w-4 h-4 mr-2" />
                Sélectionner des fichiers
              </Button>
            </>
          ) : (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Limite de {maxFiles} fichiers atteinte
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supprimez des fichiers pour en ajouter d'autres
              </p>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) {
            handleFilesSelect(files);
          }
        }}
        className="hidden"
      />
      
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Formats supportés: JPG, PNG, WEBP, MP4, AVI, MOV</p>
        <p>• Maximum {maxFiles} fichiers, {maxSizeMB} MB par fichier</p>
        <p>• Les vidéos seront automatiquement optimisées pour le web</p>
      </div>
    </div>
  );
};

export default MediaUpload;