// Service de gestion des données du collège avec persistance localStorage
interface SchoolStats {
  graduates: string;
  experience: string;
  teachers: string;
  successRate: string;
}

interface SchoolInfo {
  name: string;
  subtitle: string;
  description: string;
  mission: string;
  stats: SchoolStats;
  advantages: Array<{
    title: string;
    description: string;
  }>;
}

const SCHOOL_DATA_KEY = 'cabmy_school_data';

const defaultSchoolData: SchoolInfo = {
  name: "Collège Adventiste Bilingue",
  subtitle: "Maranatha de Yaoundé",
  description: "Excellence académique • Valeurs chrétiennes • Formation intégrale",
  mission: "Le Collège Adventiste Bilingue Maranatha de Yaoundé s'engage à offrir une éducation de qualité supérieure, alliant excellence académique et valeurs chrétiennes adventistes. Nous formons des jeunes équilibrés, prêts à servir leur communauté et à exceller dans leurs domaines d'études.",
  stats: {
    graduates: "500+",
    experience: "25",
    teachers: "40",
    successRate: "98%"
  },
  advantages: [
    {
      title: "Enseignement bilingue",
      description: "Formation en français et anglais pour une ouverture internationale"
    },
    {
      title: "Encadrement personnalisé", 
      description: "Suivi individuel de chaque apprenant pour sa réussite"
    },
    {
      title: "Valeurs adventistes",
      description: "Éducation basée sur les principes chrétiens adventistes"
    }
  ]
};

class SchoolDataService {
  private data: SchoolInfo;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): SchoolInfo {
    try {
      const stored = localStorage.getItem(SCHOOL_DATA_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        // Merge avec les données par défaut pour s'assurer que toutes les clés existent
        return { ...defaultSchoolData, ...parsedData };
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données du collège:', error);
    }
    
    // Sauvegarder les données par défaut si aucune donnée n'existe
    this.saveData(defaultSchoolData);
    return defaultSchoolData;
  }

  private saveData(data: SchoolInfo): void {
    try {
      localStorage.setItem(SCHOOL_DATA_KEY, JSON.stringify(data));
      this.data = data;
      console.log('Données du collège sauvegardées:', data);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données du collège:', error);
    }
  }

  // Getters
  getSchoolInfo(): SchoolInfo {
    return { ...this.data };
  }

  getStats(): SchoolStats {
    return { ...this.data.stats };
  }

  // Setters
  updateStats(newStats: Partial<SchoolStats>): void {
    const updatedData = {
      ...this.data,
      stats: { ...this.data.stats, ...newStats }
    };
    this.saveData(updatedData);
  }

  updateSchoolInfo(updates: Partial<SchoolInfo>): void {
    const updatedData = { ...this.data, ...updates };
    this.saveData(updatedData);
  }

  updateAdvantages(advantages: Array<{ title: string; description: string }>): void {
    const updatedData = {
      ...this.data,
      advantages
    };
    this.saveData(updatedData);
  }

  // Reset aux données par défaut
  resetToDefault(): void {
    this.saveData(defaultSchoolData);
  }
}

// Instance singleton
export const schoolDataService = new SchoolDataService();
export type { SchoolInfo, SchoolStats };