import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { mediaStorageService } from '@/services/mediaStorageService';
import campusBuilding1 from '@/assets/campus-building-1.jpg';
import campusBuilding2 from '@/assets/campus-building-2.jpg';
import studentsGroup from '@/assets/students-group.jpg';
import campusCourtyard from '@/assets/campus-courtyard.jpg';

export interface Publication {
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
    mediaId?: string;
    file?: File;
  }>;
}

const STORAGE_KEY = 'cabmy_publications';
const STORAGE_VERSION = '2.0'; // Version pour migrer les anciennes données
const VERSION_KEY = 'cabmy_publications_version';

// Initial publications avec médias du campus
const initialPublications: Publication[] = [
  {
    id: "1",
    title: "Découvrez notre campus moderne",
    description: "Visite guidée des infrastructures du Collège Adventiste Bilingue Maranatha",
    content: "Notre campus offre un environnement d'apprentissage exceptionnel avec des bâtiments modernes, des espaces verts et des installations sportives. Découvrez où nos étudiants évoluent chaque jour dans un cadre propice à l'épanouissement académique et personnel.",
    category: "Campus",
    author: "Direction",
    date: "20 septembre 2024",
    media: [
      {
        type: 'image' as const,
        url: campusBuilding1,
        alt: 'Bâtiment principal du campus - vue d\'ensemble'
      },
      {
        type: 'image' as const,
        url: campusBuilding2,
        alt: 'Salles de classe modernes et équipées'
      },
      {
        type: 'image' as const,
        url: campusCourtyard,
        alt: 'Cour principale avec bancs pour les étudiants'
      },
      {
        type: 'image' as const,
        url: studentsGroup,
        alt: 'Rassemblement des étudiants dans la cour'
      }
    ]
  },
  {
    id: "2",
    title: "Rentrée scolaire 2024-2025",
    description: "Accueil des nouveaux élèves dans notre campus modernisé",
    content: "Cette année, nous accueillons plus de 500 élèves dans nos installations rénovées. Le campus dispose de nouvelles salles de classe équipées et d'espaces verts pour le bien-être de nos apprenants.",
    category: "Actualité",
    author: "Direction Pédagogique",
    date: "15 septembre 2024",
    media: [
      {
        type: 'image' as const,
        url: studentsGroup,
        alt: 'Assemblée générale des élèves'
      }
    ]
  },
  {
    id: "3", 
    title: "Journée portes ouvertes",
    description: "Venez découvrir notre établissement le 25 janvier 2025",
    content: "Le samedi 25 janvier 2025, nous organisons une journée portes ouvertes de 9h à 17h. Venez découvrir nos installations modernes, rencontrer nos enseignants qualifiés et comprendre notre approche pédagogique adventiste.",
    category: "Événement",
    author: "Direction",
    date: "10 janvier 2025",
    media: [
      {
        type: 'image' as const,
        url: campusCourtyard,
        alt: 'Cour principale où se dérouleront les activités'
      },
      {
        type: 'image' as const,
        url: campusBuilding1,
        alt: 'Bâtiments que vous pourrez visiter'
      }
    ]
  },
  {
    id: "4",
    title: "Excellence académique reconnue", 
    description: "Nos résultats aux examens officiels témoignent de notre engagement",
    content: "Avec un taux de réussite de 98% aux examens officiels, le Collège Adventiste Bilingue Maranatha confirme son excellence pédagogique et son engagement envers la réussite de chaque apprenant.",
    category: "Éducation",
    author: "Service Académique", 
    date: "25 juillet 2024"
  }
];

export const usePublications = () => {
  const [publications, setPublications] = useState<Publication[]>([]);

  // Load publications from localStorage on mount avec vérification de version
  useEffect(() => {
    const initializePublications = () => {
      try {
        const storedVersion = localStorage.getItem(VERSION_KEY);
        const stored = localStorage.getItem(STORAGE_KEY);
        
        // Vérifier si on a besoin de migrer ou réinitialiser
        if (!stored || storedVersion !== STORAGE_VERSION) {
          console.log('Initialisation ou migration des publications...');
          const publicationsToSave = stored && storedVersion ? 
            [...JSON.parse(stored), ...initialPublications] : 
            initialPublications;
          
          // Dédupliquer par ID
          const uniquePublications = publicationsToSave.filter((pub, index, arr) => 
            arr.findIndex(p => p.id === pub.id) === index
          );
          
          setPublications(uniquePublications);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(uniquePublications));
          localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
          console.log(`Publications initialisées: ${uniquePublications.length} éléments`);
          return;
        }

        // Charger les publications existantes
        const parsedPublications = JSON.parse(stored);
        if (Array.isArray(parsedPublications) && parsedPublications.length > 0) {
          setPublications(parsedPublications);
          console.log(`Publications chargées: ${parsedPublications.length} éléments`);
        } else {
          throw new Error('Publications vides ou invalides');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des publications:', error);
        // Fallback avec les publications initiales
        setPublications(initialPublications);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPublications));
        localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
      }
    };

    initializePublications();

    // Réhydrater les URLs des médias depuis IndexedDB au chargement
    (async () => {
      try {
        await mediaStorageService.init();
        const stored = localStorage.getItem(STORAGE_KEY);
        const pubs: Publication[] = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(pubs) || pubs.length === 0) return;

        const rehydrated = await Promise.all(
          pubs.map(async (p) => {
            const storedMedia = await mediaStorageService.getAllMediaForPublication(p.id);
            if (storedMedia.length > 0) {
              return {
                ...p,
                media: storedMedia.map((m) => ({
                  type: (m.type === 'image' ? 'image' : 'video') as 'image' | 'video',
                  url: m.url,
                  alt: p.title,
                  name: m.name,
                  mediaId: m.id,
                })),
              } as Publication;
            }
            return p;
          })
        );
        setPublications(rehydrated);
      } catch (e) {
        console.error('Réhydratation des médias échouée', e);
      }
    })();
  }, []);

  // Save publications to localStorage whenever they change
  const savePublications = (newPublications: Publication[]) => {
    try {
      setPublications(newPublications);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPublications));
      console.log('Publications sauvegardées dans localStorage:', newPublications.length);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // Fallback: try to save without problematic data
      const cleanedPublications = newPublications.map(pub => ({
        ...pub,
        file: undefined // Remove file objects that can't be stringified
      }));
      setPublications(cleanedPublications);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedPublications));
    }
  };

  const addPublication = async (publication: Omit<Publication, 'id'>): Promise<Publication> => {
    try {
      const id = Date.now().toString();
      await mediaStorageService.init();
      
      const newPublication: Publication = {
        ...publication,
        id
      };

      // Handle file upload locally
      if (publication.file) {
        const fileUrl = URL.createObjectURL(publication.file);
        newPublication.fileUrl = fileUrl;
        newPublication.fileName = publication.file.name;
        
        // If it's an image, also set it as the main image
        if (publication.file.type?.startsWith('image/')) {
          newPublication.image = fileUrl;
        }
      }

      // Process media uploads and store them persistently
      const processedMedia: Array<{
        type: 'image' | 'video';
        url: string;
        alt?: string;
        name?: string;
        mediaId?: string;
      }> = [];
      
      if (publication.media && publication.media.length > 0) {
        for (const mediaItem of publication.media) {
          if (mediaItem.file) {
            // Stocker le fichier dans IndexedDB et obtenir son identifiant + une URL pour cette session
            const { id: storedId, url: sessionUrl } = await mediaStorageService.storeMedia(mediaItem.file, id);
            processedMedia.push({
              type: mediaItem.type,
              url: sessionUrl,
              alt: mediaItem.alt,
              name: mediaItem.name,
              mediaId: storedId,
            });
          } else {
            processedMedia.push({
              type: mediaItem.type,
              url: mediaItem.url,
              alt: mediaItem.alt,
              name: mediaItem.name,
              mediaId: mediaItem.mediaId
            });
          }
        }
        newPublication.media = processedMedia;
      }

      const newPublications = [newPublication, ...publications];
      savePublications(newPublications);
      
      console.log('Publication ajoutée:', newPublication);
      console.log('Total publications:', newPublications.length);
      toast.success('Publication ajoutée avec succès');
      
      return newPublication;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la publication:', error);
      toast.error('Erreur lors de l\'ajout de la publication');
      throw error;
    }
  };

  const updatePublication = async (id: string, updates: Partial<Publication>): Promise<void> => {
    try {
      const existingPublication = publications.find(p => p.id === id);
      if (!existingPublication) {
        throw new Error('Publication non trouvée');
      }

      await mediaStorageService.init();

      const updatedPublications = await Promise.all(publications.map(async (pub) => {
        if (pub.id === id) {
          const updated = { ...pub, ...updates };
          
          // Handle file upload for updates
          if (updates.file) {
            const fileUrl = URL.createObjectURL(updates.file);
            updated.fileUrl = fileUrl;
            updated.fileName = updates.file.name;
            
            // Clean up old blob URL to prevent memory leaks
            if (pub.fileUrl && pub.fileUrl.startsWith('blob:')) {
              URL.revokeObjectURL(pub.fileUrl);
            }
            
            // If it's an image, also set it as the main image
            if (updates.file.type?.startsWith('image/')) {
              updated.image = fileUrl;
            }
          }

          // Process new media uploads if any
          if (updates.media) {
            const processNewMedia = async () => {
              const processedMedia: Array<{
                type: 'image' | 'video';
                url: string;
                alt?: string;
                name?: string;
                mediaId?: string;
              }> = [];
              
              // Clean up old media from storage if being completely replaced
              if (pub.media) {
                for (const oldMedia of pub.media) {
                  if (oldMedia.mediaId) {
                    try {
                      await mediaStorageService.deleteMedia(oldMedia.mediaId);
                    } catch (error) {
                      console.error('Erreur lors de la suppression du média:', error);
                    }
                  }
                }
              }
              
              for (const mediaItem of updates.media!) {
                if (mediaItem.file) {
                  // Stocker le nouveau fichier dans IndexedDB
                  const { id: storedId, url: sessionUrl } = await mediaStorageService.storeMedia(mediaItem.file, id);
                  processedMedia.push({
                    type: mediaItem.type,
                    url: sessionUrl,
                    alt: mediaItem.alt,
                    name: mediaItem.name,
                    mediaId: storedId
                  });
                } else {
                  processedMedia.push({
                    type: mediaItem.type,
                    url: mediaItem.url,
                    alt: mediaItem.alt,
                    name: mediaItem.name,
                    mediaId: mediaItem.mediaId
                  });
                }
              }
              return processedMedia;
            };
            
            updated.media = await processNewMedia();
          }
          
          console.log('Publication mise à jour:', updated);
          
          return updated;
        }
        return pub;
      }));
      
      savePublications(updatedPublications);
      console.log('Publications après mise à jour:', updatedPublications.length);
      toast.success('Publication mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la publication:', error);
      toast.error('Erreur lors de la mise à jour de la publication');
      throw error;
    }
  };

  const deletePublication = async (id: string): Promise<void> => {
    try {
      const publicationToDelete = publications.find(pub => pub.id === id);
      if (publicationToDelete) {
        await mediaStorageService.init();
        
        // Clean up stored media files
        if (publicationToDelete.media) {
          for (const mediaItem of publicationToDelete.media) {
            if (mediaItem.mediaId) {
              await mediaStorageService.deleteMedia(mediaItem.mediaId);
            }
          }
        }
        
        // Clean up blob URLs
        if (publicationToDelete.fileUrl && publicationToDelete.fileUrl.startsWith('blob:')) {
          URL.revokeObjectURL(publicationToDelete.fileUrl);
        }
        if (publicationToDelete.image && publicationToDelete.image.startsWith('blob:')) {
          URL.revokeObjectURL(publicationToDelete.image);
        }
      }
      
      const updatedPublications = publications.filter(pub => pub.id !== id);
      savePublications(updatedPublications);
      toast.success('Publication supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la publication:', error);
      toast.error('Erreur lors de la suppression de la publication');
      throw error;
    }
  };

  return {
    publications,
    addPublication,
    updatePublication,
    deletePublication
  };
};