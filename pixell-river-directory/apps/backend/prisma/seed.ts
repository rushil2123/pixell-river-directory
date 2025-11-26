import { PrismaClient } from "@prisma/client";
import employees from "./data/employees.json";
import roles from "./data/org.json";

const prisma = new PrismaClient();

async function main() {
  // Make seeding idempotent
  await prisma.$transaction([
    prisma.employee.deleteMany(),
    prisma.role.deleteMany(),
  ]);

  // Flatten employees: [{department, employees:[...]}] -> [{name, department}, ...]
  const employeeRows: { name: string; department: string }[] = [];
  for (const group of employees as Array<{ department: string; employees: string[] }>) {
    for (const name of group.employees) {
      employeeRows.push({ name, department: group.department });
    }
  }

  if (employeeRows.length) {
    await prisma.employee.createMany({
      data: employeeRows
    });
  }

  const roleRows = (roles as Array<{ title: string; person?: string; description?: string }>).map(r => ({
    title: r.title,
    person: r.person ?? null,
    description: r.description ?? null,
  }));

  if (roleRows.length) {
    await prisma.role.createMany({
      data: roleRows
    });
  }
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
