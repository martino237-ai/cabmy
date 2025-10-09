import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageCircle, Facebook, Phone, MapPin } from "lucide-react";

const ContactSection = () => {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Discussion rapide et instantanée",
      action: "Contacter sur WhatsApp",
      link: "https://wa.me/237000000000", // À remplacer par le vrai numéro
      color: "text-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      description: "Requêtes formelles et informations détaillées",
      action: "Envoyer un email",
      link: "mailto:contact@maranatha-yaounde.cm",
      color: "text-blue-600"
    },
    {
      icon: Facebook,
      title: "Facebook",
      description: "Suivre nos annonces et partager",
      action: "Visiter notre page",
      link: "https://facebook.com/maranatha-yaounde",
      color: "text-blue-800"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Contactez-nous
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nous sommes là pour vous aider. Choisissez le moyen de communication qui vous convient le mieux.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {contactMethods.map((method, index) => (
            <Card key={method.title} className="group hover:shadow-elegant transition-smooth animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
              <CardHeader className="text-center">
                <div className={`mx-auto w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4 group-hover:bg-secondary transition-smooth ${method.color}`}>
                  <method.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-primary">{method.title}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(method.link, '_blank')}
                >
                  {method.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary text-primary-foreground animate-slide-up">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Adresse</h3>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 mt-1 text-secondary" />
                  <div>
                    <p className="font-medium">Collège Adventiste Bilingue Maranatha</p>
                    <p>Yaoundé, Cameroun</p>
                    <p>BP: [À compléter]</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-secondary" />
                    <span>+237 XXX XXX XXX</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-secondary" />
                    <span>contact@maranatha-yaounde.cm</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContactSection;