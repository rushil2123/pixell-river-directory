import { z } from "zod";

export const listRolesSchema = z.object({
  query: z.object({
    search: z.string().optional()
  })
});

export const createRoleSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3),
    person: z.string().trim().min(3).optional(),
    description: z.string().trim().optional()
  })
});
