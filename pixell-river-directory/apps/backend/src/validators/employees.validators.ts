import { z } from "zod";

export const listEmployeesSchema = z.object({
  query: z.object({
    search: z.string().optional()
  })
});

export const createEmployeeSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3),
    department: z.string().trim().min(2)
  })
});
