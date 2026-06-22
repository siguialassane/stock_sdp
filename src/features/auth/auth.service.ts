import { supabase } from "@/lib/supabase/client";

export async function signInAdmin(identifier: string, password: string) {
  const email = identifier.includes("@") ? identifier : `${identifier}@stockflow.app`;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error("Identifiant ou mot de passe incorrect.");

  const { data, error: profileError } = await supabase
    .from("app_users")
    .select("full_name, email, status, roles!inner(code)")
    .eq("email", email)
    .single();

  const role = Array.isArray(data?.roles) ? data.roles[0] : data?.roles;
  if (profileError || data.status !== "active" || role?.code !== "admin") {
    await supabase.auth.signOut();
    throw new Error("Ce compte ne dispose pas d'un acces Admin actif.");
  }

  return { username: identifier, displayName: data.full_name, email: data.email, role: "Admin" as const };
}

export async function signOut() {
  await supabase.auth.signOut();
}
