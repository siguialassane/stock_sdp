import { MagasinScreen } from "@/features/magasin/magasin-screen";
import { useAuth } from "@/features/auth/auth-context";

/**
 * Wrapper de route leger (regle Projet.md : pages legeres).
 * Instancie le shell MagasinScreen qui delegue le contenu aux sous-routes
 * via <Outlet/>. Pas de store dedie pour ce jet front.
 */
export default function MagasinPage() {
  const { logout } = useAuth();

  return <MagasinScreen onLogout={logout} />;
}
