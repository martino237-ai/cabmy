import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { schoolDataService, type SchoolInfo } from "@/services/schoolDataService";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, RotateCcw } from "lucide-react";

const SchoolDataEditor = () => {
  const { toast } = useToast();
  const [schoolData, setSchoolData] = useState(schoolDataService.getSchoolInfo());
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    try {
      schoolDataService.updateSchoolInfo(schoolData);
      setIsEditing(false);
      toast({
        title: "Succès",
        description: "Les informations du collège ont été mises à jour."
      });
      // Recharger la page pour voir les changements
      window.location.reload();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde des informations.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    schoolDataService.resetToDefault();
    setSchoolData(schoolDataService.getSchoolInfo());
    toast({
      title: "Réinitialisé",
      description: "Les informations ont été réinitialisées aux valeurs par défaut."
    });
    window.location.reload();
  };

  const updateStats = (field: keyof typeof schoolData.stats, value: string) => {
    setSchoolData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [field]: value
      }
    }));
  };

  const updateAdvantage = (index: number, field: 'title' | 'description', value: string) => {
    setSchoolData(prev => ({
      ...prev,
      advantages: prev.advantages.map((adv, i) => 
        i === index ? { ...adv, [field]: value } : adv
      )
    }));
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <CardTitle>Informations du Collège</CardTitle>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Modifier
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Annuler
                </Button>
              </>
            )}
            <Button onClick={handleReset} variant="destructive" size="sm">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Gérez les informations générales du collège affichées sur le site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom du collège</Label>
            <Input
              id="name"
              value={schoolData.name}
              onChange={(e) => setSchoolData(prev => ({ ...prev, name: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Sous-titre</Label>
            <Input
              id="subtitle"
              value={schoolData.subtitle}
              onChange={(e) => setSchoolData(prev => ({ ...prev, subtitle: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description courte</Label>
          <Input
            id="description"
            value={schoolData.description}
            onChange={(e) => setSchoolData(prev => ({ ...prev, description: e.target.value }))}
            disabled={!isEditing}
          />
        </div>

        <div>
          <Label htmlFor="mission">Mission (description longue)</Label>
          <Textarea
            id="mission"
            value={schoolData.mission}
            onChange={(e) => setSchoolData(prev => ({ ...prev, mission: e.target.value }))}
            disabled={!isEditing}
            rows={4}
          />
        </div>

        {/* Statistiques */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4">Statistiques</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="graduates">Élèves diplômés</Label>
              <Input
                id="graduates"
                value={schoolData.stats.graduates}
                onChange={(e) => updateStats('graduates', e.target.value)}
                disabled={!isEditing}
                placeholder="500+"
              />
            </div>
            <div>
              <Label htmlFor="experience">Années d'expérience</Label>
              <Input
                id="experience"
                value={schoolData.stats.experience}
                onChange={(e) => updateStats('experience', e.target.value)}
                disabled={!isEditing}
                placeholder="25"
              />
            </div>
            <div>
              <Label htmlFor="teachers">Enseignants qualifiés</Label>
              <Input
                id="teachers"
                value={schoolData.stats.teachers}
                onChange={(e) => updateStats('teachers', e.target.value)}
                disabled={!isEditing}
                placeholder="40"
              />
            </div>
            <div>
              <Label htmlFor="successRate">Taux de réussite</Label>
              <Input
                id="successRate"
                value={schoolData.stats.successRate}
                onChange={(e) => updateStats('successRate', e.target.value)}
                disabled={!isEditing}
                placeholder="98%"
              />
            </div>
          </div>
        </div>

        {/* Avantages */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4">Avantages du collège</h3>
          <div className="space-y-4">
            {schoolData.advantages.map((advantage, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor={`advantage-title-${index}`}>Titre</Label>
                  <Input
                    id={`advantage-title-${index}`}
                    value={advantage.title}
                    onChange={(e) => updateAdvantage(index, 'title', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor={`advantage-desc-${index}`}>Description</Label>
                  <Input
                    id={`advantage-desc-${index}`}
                    value={advantage.description}
                    onChange={(e) => updateAdvantage(index, 'description', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolDataEditor;