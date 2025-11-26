import { http } from "./http";
import type { DepartmentGroup } from "../types";

type EmployeeRow = {
  id: number;
  name: string;
  department: string;
  createdAt: string;
};

export async function listEmployees(
  token: string,
  search?: string
): Promise<DepartmentGroup[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  const rows = await http<EmployeeRow[]>(`/employees${q}`, token);

  const byDept = new Map<string, EmployeeRow[]>();
  for (const r of rows) {
    if (!byDept.has(r.department)) byDept.set(r.department, []);
    byDept.get(r.department)!.push(r);
  }

  const groups: DepartmentGroup[] = [];
  for (const [department, members] of byDept.entries()) {
    const id = Math.min(...members.map((m) => m.id));
    const createdAt = members
      .map((m) => m.createdAt)
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))[0];

    groups.push({
      id,
      department,
      employees: members.map((m) => m.name),
      createdAt,
    });
  }

  groups.sort((a, b) => a.department.localeCompare(b.department));
  return groups;
}

export async function addEmployee(
  token: string,
  data: { name: string; department: string }
) {
  return http<EmployeeRow>(`/employees`, token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
