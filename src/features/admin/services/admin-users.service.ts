import { fail } from "@/features/admin/services/admin-service.shared";
import type { Agent, RoleName } from "@/features/admin/types";
import { supabase } from "@/lib/supabase/client";

interface ProvisionedAccess {
  login_identifier: string;
  initial_password: string | null;
}

interface AgentInput {
  fullName: string;
  email: string;
  role: RoleName;
  agentCode: string;
}

async function getRoleId(role: RoleName) {
  const result = await supabase.from("roles").select("id").eq("code", role.toLowerCase()).single();
  fail(result.error);
  return result.data.id;
}

async function provisionAccess(appUserId: string) {
  const result = await supabase.rpc("provision_app_user_credentials", {
    p_app_user_id: appUserId,
    p_login_identifier: null,
    p_force_reset: false,
  });
  fail(result.error);
  return result.data?.[0] as ProvisionedAccess | undefined;
}

export async function createAgent(input: AgentInput) {
  const result = await supabase
    .from("app_users")
    .insert({
      role_id: await getRoleId(input.role),
      full_name: input.fullName,
      email: input.email,
      agent_code: input.agentCode,
      status: "pending",
      first_login_required: true,
    })
    .select("id,full_name,email,status,agent_code,first_login_required,created_at")
    .single();
  fail(result.error);

  const access = await provisionAccess(result.data.id);
  return {
    id: result.data.id,
    nom: result.data.full_name,
    email: result.data.email,
    role: input.role,
    actif: false,
    statut: result.data.status,
    codeAgent: result.data.agent_code,
    identifiant: access?.login_identifier,
    motDePasseInitial: access?.initial_password ?? result.data.agent_code,
    premierAcces: result.data.first_login_required,
    createdAt: result.data.created_at,
  } as Agent;
}

export async function updateAgent(input: AgentInput & { id: string }) {
  const result = await supabase
    .from("app_users")
    .update({
      role_id: await getRoleId(input.role),
      full_name: input.fullName,
      email: input.email,
      agent_code: input.agentCode,
    })
    .eq("id", input.id)
    .select("id,full_name,email,status,agent_code,first_login_required,last_login_at,created_at")
    .single();
  fail(result.error);

  const access = await provisionAccess(result.data.id);
  return {
    id: result.data.id,
    nom: result.data.full_name,
    email: result.data.email,
    role: input.role,
    actif: result.data.status === "active",
    statut: result.data.status,
    codeAgent: result.data.agent_code,
    identifiant: access?.login_identifier,
    motDePasseInitial: access?.initial_password ?? undefined,
    premierAcces: result.data.first_login_required,
    derniereConnexion: result.data.last_login_at ?? undefined,
    createdAt: result.data.created_at,
  } as Agent;
}

export async function setAgentStatus(id: string, status: Agent["statut"]) {
  const result = await supabase.from("app_users").update({ status }).eq("id", id);
  fail(result.error);
}

export async function deleteAgent(id: string) {
  const result = await supabase.from("app_users").delete().eq("id", id);
  fail(result.error);
}
