import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePublications, Publication } from "@/hooks/usePublications";
import FileUpload from "@/components/FileUpload";
import MediaUpload from "@/components/MediaUpload";
import SchoolDataEditor from "@/components/SchoolDataEditor";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { publications, addPublication, updatePublication, deletePublication } = usePublications();

  const [currentPublication, setCurrentPublication] = useState<Partial<Publication>>({
    title: "",
    description: "",
    content: "",
    category: "",
    author: "Administration",
    date: new Date().toISOString().split('T')[0]
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    if (!currentPublication.title || !currentPublication.description || !currentPublication.content) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditing && currentPublication.id) {
        await updatePublication(currentPublication.id, currentPublication);
        toast({
          title: "Succès",
          description: "Publication modifiée avec succès"
        });
      } else {
        await addPublication(currentPublication as Omit<Publication, 'id'>);
        toast({
          title: "Succès", 
          description: "Publication créée avec succès"
        });
      }

      setCurrentPublication({
        title: "",
        description: "",
        content: "",
        category: "",
        author: "Administration",
        date: new Date().toISOString().split('T')[0]
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (publication: Publication) => {
    setCurrentPublication(publication);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePublication(id);
      toast({
        title: "Succès",
        description: "Publication supprimée avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header Admin */}
      <div className="bg-primary shadow-elegant">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="text-primary-foreground hover:bg-primary-light"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au site
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">
                  Administration
                </h1>
                <p className="text-primary-foreground/80">
                  Gestion des publications - Collège Adventiste Bilingue Maranatha
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Éditeur des données du collège */}
        <SchoolDataEditor />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de création/édition */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Plus className="w-5 h-5 mr-2" />
                {isEditing ? "Modifier la publication" : "Nouvelle publication"}
              </CardTitle>
              <CardDescription>
                {isEditing ? "Modifiez les informations ci-dessous" : "Créez une nouvelle publication pour votre établissement"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input 
                  id="title"
                  value={currentPublication.title || ""}
                  onChange={(e) => setCurrentPublication(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de la publication"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input 
                  id="description"
                  value={currentPublication.description || ""}
                  onChange={(e) => setCurrentPublication(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Courte description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select 
                    value={currentPublication.category || ""}
                    onValueChange={(value) => setCurrentPublication(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Annonce">Annonce</SelectItem>
                      <SelectItem value="Événement">Événement</SelectItem>
                      <SelectItem value="Promotion">Promotion</SelectItem>
                      <SelectItem value="Actualité">Actualité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Auteur</Label>
                  <Input 
                    id="author"
                    value={currentPublication.author || ""}
                    onChange={(e) => setCurrentPublication(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Nom de l'auteur"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenu *</Label>
                <Textarea 
                  id="content"
                  value={currentPublication.content || ""}
                  onChange={(e) => setCurrentPublication(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Contenu complet de la publication"
                  rows={6}
                />
              </div>

              {/* Médias multiples */}
              <MediaUpload 
                onMediaChange={(media) => setCurrentPublication(prev => ({ ...prev, media }))}
                currentMedia={currentPublication.media || []}
                maxFiles={10}
                maxSizeMB={50}
              />

              {/* Fichier unique (pour documents) */}
              <FileUpload 
                onFileSelect={(file) => setCurrentPublication(prev => ({ ...prev, file }))}
                currentFile={currentPublication.file}
                currentFileName={currentPublication.fileName}
                currentFileUrl={currentPublication.fileUrl}
                accept=".pdf,.doc,.docx,.txt"
              />

              {isEditing && (
                <Button 
                  onClick={() => {
                    setCurrentPublication({
                      title: "",
                      description: "",
                      content: "",
                      category: "",
                      author: "Administration",
                      date: new Date().toISOString().split('T')[0]
                    });
                    setIsEditing(false);
                  }}
                  variant="outline" 
                  className="w-full mb-4"
                >
                  Annuler la modification
                </Button>
              )}

              <Button onClick={handleSave} variant="publish" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? "Mettre à jour" : "Publier"}
              </Button>
            </CardContent>
          </Card>

          {/* Liste des publications */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="text-primary">Publications existantes</CardTitle>
              <CardDescription>
                Gérez vos publications ({publications.length} publications)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {publications.map((publication) => (
                  <div key={publication.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary">{publication.title}</h3>
                        <p className="text-sm text-muted-foreground">{publication.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                          <span>📁 {publication.category}</span>
                          <span>👤 {publication.author}</span>
                          <span>📅 {publication.date}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(publication)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(publication.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;