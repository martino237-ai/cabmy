import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import collegeLogo from "@/assets/college-logo-official.jpg";

const Header = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const isMobile = useIsMobile();

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 3) {
      if (user) {
        navigate("/admin");
      } else {
        navigate("/auth");
      }
      setClickCount(0);
    }
    
    // Reset counter after 5 seconds
    setTimeout(() => {
      setClickCount(0);
    }, 5000);
  };

  const navigationItems = [
    { label: "Accueil", href: "#" },
    { label: "Publications", href: "#publications" },
    { label: "À propos", href: "#mission" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-primary backdrop-blur-md border-b border-primary-light/20 shadow-elegant">
      <div className="container flex h-20 items-center justify-between">
        {/* Sidebar trigger pour mobile */}
        {isMobile && (
          <SidebarTrigger className="text-white hover:bg-white/20" />
        )}
        
        {/* Logo et nom */}
        <div 
          className="flex items-center space-x-4 cursor-pointer transition-spring hover:scale-105" 
          onClick={handleLogoClick}
        >
          <div className="relative">
            <img 
              src={collegeLogo} 
              alt="Collège Adventiste Bilingue Maranatha" 
              className="h-14 w-14 object-contain rounded-full shadow-soft bg-white/90 p-1"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20"></div>
          </div>
          {!isMobile && (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white leading-tight">
                Collège Adventiste Bilingue
              </h1>
              <h2 className="text-sm text-white/90 font-medium">
                Maranatha de Yaoundé
              </h2>
            </div>
          )}
        </div>

        {/* Navigation desktop */}
        {!isMobile && (
          <nav className="flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button 
                key={item.label}
                variant="ghost" 
                onClick={() => window.location.href = item.href}
                className="text-white hover:bg-white/20 hover:text-white transition-smooth px-4 py-2 rounded-lg font-medium"
              >
                {item.label}
              </Button>
            ))}
            <Button 
              variant="secondary"
              onClick={() => window.location.href = '#contact'}
              className="ml-4 bg-white text-primary hover:bg-white/90 shadow-soft font-semibold px-6"
            >
              Nous Contacter
            </Button>
          </nav>
        )}

        {/* Auth section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-white text-primary">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {!isMobile && (
                <Button
                  variant="ghost"
                  onClick={signOut}
                  className="text-white hover:bg-white/20"
                >
                  Se déconnecter
                </Button>
              )}
            </div>
          ) : (
            <Button
              // variant="ghost"
              // onClick={() => navigate('/auth')}
              // className="text-white hover:bg-white/20"
            >
              {/* <LogIn className="h-4 w-4 mr-2" /> */}
              {/* {!isMobile && "Connexion"} */}
            </Button>
          )}
          
          {/* Menu mobile pour les non-connectés */}
          {!user && isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/20"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          )}
        </div>
      </div>

      {/* Menu mobile dropdown - seulement pour les non-connectés */}
      {isMenuOpen && !user && isMobile && (
        <div className="bg-primary-dark/95 backdrop-blur-md border-t border-primary-light/20">
          <nav className="container py-4 space-y-2">
            {navigationItems.map((item) => (
              <Button 
                key={item.label}
                variant="ghost" 
                onClick={() => {
                  window.location.href = item.href;
                  setIsMenuOpen(false);
                }}
                className="w-full justify-start text-white hover:bg-white/20 hover:text-white transition-smooth"
              >
                {item.label}
              </Button>
            ))}
            <Button 
              variant="secondary"
              onClick={() => {
                window.location.href = '#contact';
                setIsMenuOpen(false);
              }}
              className="w-full mt-4 bg-white text-primary hover:bg-white/90"
            >
              Nous Contacter
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;