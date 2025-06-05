// Représente un utilisateur connecté (apprenant par exemple)
export type User = {
  id: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  role: string;
  profilePicture: string | null;
};

// Représente une session de cours (affichée dans le dashboard)
export type Session = {
  id: number;
  formation: string;
  formateur?: string; // facultatif pour les sessions passées
  salle?: string;     // idem
  horaire: string; 
  active?: boolean; // facultatif selon les données
  
};