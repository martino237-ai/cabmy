import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, File, Image, Video, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  currentFile?: File;
  currentFileName?: string;
  currentFileUrl?: string;
  accept?: string;
  maxSizeMB?: number;
}

const FileUpload = ({ 
  onFileSelect, 
  currentFile, 
  currentFileName, 
  currentFileUrl,
  accept = "image/*,video/*,.pdf,.doc,.docx,.txt", 
  maxSizeMB = 10 
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: `Le fichier ne doit pas dépasser ${maxSizeMB} MB`,
        variant: "destructive"
      });
      return;
    }

    onFileSelect(file);
    toast({
      title: "Fichier sélectionné",
      description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
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

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="w-6 h-6" />;
    }
    if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) {
      return <Video className="w-6 h-6" />;
    }
    return <File className="w-6 h-6" />;
  };

  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // We can't actually "clear" the file from parent, but we can signal removal
  };

  const displayFileName = currentFile?.name || currentFileName;
  const hasFile = currentFile || currentFileName;

  return (
    <div className="space-y-3">
      <Label>Fichier (optionnel)</Label>
      
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${hasFile ? 'bg-accent/50' : 'hover:border-primary hover:bg-primary/5'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {hasFile ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-primary">
              {getFileIcon(displayFileName || '')}
              <span className="font-medium">{displayFileName}</span>
            </div>
            
            {currentFileUrl && currentFileUrl.startsWith && currentFileUrl.startsWith('blob:') && (
              <div className="mt-3">
                {currentFile?.type?.startsWith('image/') ? (
                  <img 
                    src={currentFileUrl} 
                    alt="Aperçu"
                    className="max-w-32 max-h-32 object-cover rounded mx-auto"
                  />
                ) : currentFile?.type?.startsWith('video/') ? (
                  <video 
                    src={currentFileUrl}
                    className="max-w-32 max-h-32 rounded mx-auto"
                    controls
                  />
                ) : null}
              </div>
            )}
            
            <div className="flex justify-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Changer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearFile}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                Glissez un fichier ici ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Images, vidéos, documents (max {maxSizeMB} MB)
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Sélectionner un fichier
            </Button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
        className="hidden"
      />
      
      <p className="text-xs text-muted-foreground">
        Formats supportés: Images (JPG, PNG), Vidéos (MP4, AVI), Documents (PDF, DOC, TXT)
      </p>
    </div>
  );
};

export default FileUpload;