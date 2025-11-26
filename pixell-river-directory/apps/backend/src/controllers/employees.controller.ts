import { Request, Response } from "express";
import * as svc from "../services/employees.service";

export async function list(req: Request, res: Response) {
  const search = (req.query.search as string | undefined) ?? undefined;
  const rows = await svc.listEmployees(search);
  res.json(rows);
}

export async function create(req: Request, res: Response) {
  const { name, department } = req.body as { name: string; department: string };
  const row = await svc.createEmployee({ name, department });
  res.status(201).json(row);
}
