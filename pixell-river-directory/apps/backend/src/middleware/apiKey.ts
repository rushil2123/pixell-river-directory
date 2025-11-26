import { Request, Response, NextFunction } from "express";

export function apiKey(requiredKey: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const provided = req.header("X-API-Key");
    if (!provided || provided !== requiredKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };
}
