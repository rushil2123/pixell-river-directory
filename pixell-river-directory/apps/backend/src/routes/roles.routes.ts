import { Router } from "express";
import { list, create } from "../controllers/roles.controller";
import { validate } from "../middleware/validate";
import { listRolesSchema, createRoleSchema } from "../validators/roles.validators";

const r = Router();

r.get("/", validate(listRolesSchema), list);
r.post("/", validate(createRoleSchema), create);

export default r;
