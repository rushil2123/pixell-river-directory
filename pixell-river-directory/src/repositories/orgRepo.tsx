import { http } from "./http";
import type { OrgRole } from "../types";

type RoleRow = {
  id: number;
  title: string;
  person?: string | null;
  description?: string | null;
  createdAt: string;
};

export async function listRoles(
  token: string,
  search?: string
): Promise<OrgRole[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  const rows = await http<RoleRow[]>(`/roles${q}`, token);

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    person: r.person ?? undefined,
    description: r.description ?? undefined,
    createdAt: r.createdAt,
  }));
}

export async function addRole(
  token: string,
  data: { title: string; person?: string; description?: string }
): Promise<OrgRole> {
  const r = await http<RoleRow>(`/roles`, token, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return {
    id: r.id,
    title: r.title,
    person: r.person ?? undefined,
    description: r.description ?? undefined,
    createdAt: r.createdAt,
  };
}

