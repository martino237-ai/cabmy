import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Tag, User, FileText, Download } from "lucide-react";
import MediaViewer from "./MediaViewer";
import PublicationInteractions from "./PublicationInteractions";

interface Publication {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image?: string;
  file?: File;
  fileUrl?: string;
  fileName?: string;
  media?: Array<{
    type: 'image' | 'video';
    url: string;
    alt?: string;
    name?: string;
  }>;
}

interface PublicationCardProps {
  publication: Publication;
}

const PublicationCard = ({ publication }: PublicationCardProps) => {
  // Préparer les médias pour le MediaViewer
  const mediaItems = [];
  
  // Ajouter l'image principale si elle existe
  if (publication.image) {
    mediaItems.push({
      type: 'image' as const,
      url: publication.image,
      alt: publication.title
    });
  }
  
  // Ajouter les médias supplémentaires
  if (publication.media) {
    mediaItems.push(...publication.media);
  }

  return (
    <Card className="group hover:shadow-elegant transition-smooth animate-fade-in overflow-hidden">
      {/* Header avec catégorie */}
      {mediaItems.length > 0 && (
        <div className="relative">
          <MediaViewer media={mediaItems} />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground shadow-soft">
              <Tag className="w-3 h-3 mr-1" />
              {publication.category}
            </span>
          </div>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-primary group-hover:text-secondary transition-smooth">
          {publication.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {publication.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {publication.author}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {publication.date}
          </div>
        </div>
        
        <p className="text-foreground mb-4 line-clamp-3">
          {publication.content}
        </p>
        
        {/* File attachment display */}
        {(publication.fileName || publication.fileUrl) && (
          <div className="mb-4 p-3 bg-accent rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary truncate">
                  {publication.fileName || 'Fichier attaché'}
                </span>
              </div>
              {publication.fileUrl && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (publication.fileUrl) {
                      const link = document.createElement('a');
                      link.href = publication.fileUrl;
                      link.download = publication.fileName || 'fichier';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                  className="h-8 px-2"
                >
                  <Download className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        )}
        
        <Button variant="outline" className="w-full mb-4">
          Lire la suite
        </Button>
        
        {/* Interactions publiques - Réactions et commentaires */}
        <PublicationInteractions publicationId={publication.id} />
      </CardContent>
    </Card>
  );
};

export default PublicationCard;