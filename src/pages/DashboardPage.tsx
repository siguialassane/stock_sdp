import { DashboardScreen } from "@/features/dashboard/dashboard-screen";
import { useAuth } from "@/features/auth/auth-context";

export default function DashboardPage() {
  const { logout } = useAuth();
  return <DashboardScreen onLogout={logout} />;
}
