import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function listRoles(search?: string) {
  return prisma.role.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { person: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } }
          ]
        }
      : undefined,
    orderBy: [{ title: "asc" }]
  });
}

export async function isTitleFilled(title: string) {
  const role = await prisma.role.findUnique({ where: { title } });
  return !!(role && role.person && role.person.trim().length > 0);
}

export async function createRole(input: { title: string; person?: string; description?: string }) {
  // Lab rule: Prevent creating a role whose title is already filled
  if (await isTitleFilled(input.title)) {
    const err: any = new Error("Role title already filled");
    err.status = 409;
    throw err;
  }
  return prisma.role.create({ data: input });
}
