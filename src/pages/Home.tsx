import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PublicationCard from "@/components/PublicationCard";
import ContactSection from "@/components/ContactSection";
import collegeLogo from "@/assets/college-logo-official.jpg";
import schoolAssembly from "@/assets/school-assembly.jpg";
import { GraduationCap, BookOpen, Users, Award } from "lucide-react";
import { usePublications } from "@/hooks/usePublications";
import { schoolDataService } from "@/services/schoolDataService";
import { useState, useEffect } from "react";

const Home = () => {
  const { publications } = usePublications();
  const [schoolData, setSchoolData] = useState(schoolDataService.getSchoolInfo());

  useEffect(() => {
    // Recharger les données si elles changent
    const currentData = schoolDataService.getSchoolInfo();
    setSchoolData(currentData);
  }, []);

  const stats = [
    { icon: GraduationCap, label: "Élèves diplômés", value: schoolData.stats.graduates, color: "text-primary" },
    { icon: BookOpen, label: "Années d'expérience", value: schoolData.stats.experience, color: "text-secondary" },
    { icon: Users, label: "Enseignants qualifiés", value: schoolData.stats.teachers, color: "text-primary" },
    { icon: Award, label: "Taux de réussite", value: schoolData.stats.successRate, color: "text-secondary" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section avec image de fond */}
      <section className="relative bg-gradient-hero text-primary-foreground py-20 overflow-hidden">
        {/* Image de fond avec overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${schoolAssembly})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-hero opacity-85"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="flex justify-center mb-8">
              <img 
                src={collegeLogo} 
                alt="Collège Adventiste Bilingue Maranatha" 
                className="h-32 w-32 object-contain animate-scale-in"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {schoolData.name}
              <span className="block text-secondary">{schoolData.subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              {schoolData.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" onClick={() => window.location.href = '#publications'}>
                Découvrir nos actualités
              </Button>
              <Button variant="outline" size="xl" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className={`mx-auto w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4 ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section id="publications" className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Nos Publications
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Restez informés des dernières actualités, événements et annonces de notre établissement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.map((publication, index) => (
              <div key={publication.id} style={{animationDelay: `${index * 0.1}s`}}>
                <PublicationCard publication={publication} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Voir toutes les publications
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="mission" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold text-primary mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {schoolData.mission}
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-foreground">Formation académique rigoureuse et personnalisée</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-foreground">Développement des valeurs chrétiennes et morales</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-foreground">Accompagnement vers l'excellence et le leadership</p>
                </div>
              </div>
            </div>
            <Card className="animate-scale-in shadow-elegant">
              <CardHeader>
                <CardTitle className="text-primary">Pourquoi nous choisir ?</CardTitle>
                <CardDescription>
                  Les avantages de rejoindre notre communauté éducative
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {schoolData.advantages.map((advantage, index) => (
                  <div key={index} className="p-4 bg-accent rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">{advantage.title}</h4>
                    <p className="text-sm text-muted-foreground">{advantage.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
};

export default Home;