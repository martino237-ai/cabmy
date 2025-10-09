-- Create publications table
CREATE TABLE public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Administration',
  image_url TEXT,
  file_url TEXT,
  file_name TEXT,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can view publications)
CREATE POLICY "Publications are publicly readable" 
ON public.publications 
FOR SELECT 
USING (true);

-- Create policies for admin write access (only authenticated users can manage)
CREATE POLICY "Authenticated users can create publications" 
ON public.publications 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update publications" 
ON public.publications 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete publications" 
ON public.publications 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create storage bucket for publication files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('publications', 'publications', true);

-- Create storage policies for publication files
CREATE POLICY "Publication files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'publications');

CREATE POLICY "Authenticated users can upload publication files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'publications' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update publication files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'publications' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete publication files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'publications' AND auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_publications_updated_at
BEFORE UPDATE ON public.publications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.publications (title, description, content, category, author) VALUES
('Rentrée scolaire 2024-2025', 'Informations importantes pour la nouvelle année scolaire', 'Nous sommes heureux de vous accueillir pour cette nouvelle année scolaire. Les cours commenceront le lundi 9 septembre 2024. Tous les élèves sont priés de se présenter avec leur matériel complet.', 'Annonce', 'Administration'),
('Journée portes ouvertes', 'Venez découvrir notre établissement', 'Le samedi 20 janvier 2024, nous organisons une journée portes ouvertes de 9h à 17h. Venez découvrir nos installations modernes, rencontrer nos enseignants qualifiés et comprendre notre approche pédagogique adventiste.', 'Événement', 'Direction'),
('Excellence académique 2023', 'Nos élèves brillent aux examens nationaux', 'Nous sommes fiers d annoncer que nos élèves ont obtenu un taux de réussite de 98% aux examens du BEPC et 95% au Baccalauréat. Cette performance exceptionnelle témoigne de la qualité de notre enseignement.', 'Actualité', 'Direction Pédagogique');