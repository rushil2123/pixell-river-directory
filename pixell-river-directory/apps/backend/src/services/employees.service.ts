import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function listEmployees(search?: string) {
  return prisma.employee.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search} },
            { department: { contains: search} }
          ]
        }
      : undefined,
    orderBy: [{ department: "asc" }, { name: "asc" }]
  });
}

export async function createEmployee(input: { name: string; department: string }) {
  return prisma.employee.create({ data: input });
}
