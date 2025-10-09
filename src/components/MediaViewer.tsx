import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from './ui/button';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  alt?: string;
  name?: string;
}

interface MediaViewerProps {
  media: MediaItem[];
  className?: string;
}

const MediaViewer = ({ media, className = "" }: MediaViewerProps) => {
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!media || media.length === 0) return null;

  const currentMedia = media[selectedMedia];

  // Style Facebook: affichage selon le nombre de médias
  const getMediaLayout = () => {
    if (media.length === 1) {
      return "single";
    } else if (media.length === 2) {
      return "two";
    } else if (media.length === 3) {
      return "three";
    } else {
      return "grid";
    }
  };

  const layout = getMediaLayout();

  // Affichage single media (style Facebook)
  if (layout === "single") {
    return (
      <div className={`relative w-full rounded-lg overflow-hidden bg-accent ${className}`}>
        {currentMedia.type === 'image' ? (
          <img
            src={currentMedia.url}
            alt={currentMedia.alt || 'Publication image'}
            className="w-full h-auto max-h-96 object-cover"
          />
        ) : (
          <div className="relative">
            <video
              src={currentMedia.url}
              className="w-full h-auto max-h-96 object-cover"
              controls
              preload="metadata"
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              style={{ maxHeight: '24rem' }}
            />
          </div>
        )}
      </div>
    );
  }

  // Affichage grille pour plusieurs médias (style Facebook)
  return (
    <div className={`relative w-full ${className}`}>
      {/* Média principal */}
      <div className="relative rounded-lg overflow-hidden bg-accent mb-2">
        {currentMedia.type === 'image' ? (
          <img
            src={currentMedia.url}
            alt={currentMedia.alt || 'Publication image'}
            className="w-full h-64 object-cover"
          />
        ) : (
          <video
            src={currentMedia.url}
            className="w-full h-64 object-cover"
            controls
            preload="metadata"
            muted={isMuted}
            style={{ maxHeight: '16rem' }}
          />
        )}
      </div>

      {/* Grille des médias miniatures */}
      {media.length > 1 && (
        <div className={`grid gap-1 ${
          layout === "two" ? "grid-cols-2" : 
          layout === "three" ? "grid-cols-3" : 
          "grid-cols-4"
        }`}>
          {media.slice(0, layout === "grid" ? 4 : media.length).map((item, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded overflow-hidden aspect-square bg-accent group hover:opacity-75 transition-smooth ${
                selectedMedia === index ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedMedia(index)}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.alt || `Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
              
              {/* Overlay pour médias supplémentaires */}
              {index === 3 && media.length > 4 && layout === "grid" && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold text-lg">
                  +{media.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaViewer;