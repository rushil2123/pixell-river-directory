import { Request, Response } from "express";
import * as svc from "../services/roles.service";

export async function list(req: Request, res: Response) {
  const search = (req.query.search as string | undefined) ?? undefined;
  const rows = await svc.listRoles(search);
  res.json(rows);
}

export async function create(req: Request, res: Response) {
  const { title, person, description } = req.body as { title: string; person?: string; description?: string };
  try {
    const row = await svc.createRole({ title, person, description });
    res.status(201).json(row);
  } catch (e: any) {
    const status = e?.status ?? 400;
    res.status(status).json({ error: e?.message ?? "Unable to create role" });
  }
}
