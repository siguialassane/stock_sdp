import { CommercialScreen } from "@/features/commercial/commercial-screen";
import { useAuth } from "@/features/auth/auth-context";

export default function CommercialPage() {
  const { logout } = useAuth();

  return <CommercialScreen onLogout={logout} />;
}
