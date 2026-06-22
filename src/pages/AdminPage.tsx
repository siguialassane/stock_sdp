import { AdminScreen } from "@/features/admin/admin-screen";
import { AdminStoreProvider } from "@/features/admin/store/admin-store";
import { useAuth } from "@/features/auth/auth-context";

/**
 * Wrapper de route leger (regle Projet.md : pages legeres).
 * Instancie le shell AdminScreen qui delegue le contenu aux sous-routes via <Outlet/>.
 */
export default function AdminPage() {
  const { logout } = useAuth();

  return (
    <AdminStoreProvider>
      <AdminScreen onLogout={logout} />
    </AdminStoreProvider>
  );
}
