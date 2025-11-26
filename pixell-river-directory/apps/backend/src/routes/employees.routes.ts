import { Router } from "express";
import { list, create } from "../controllers/employees.controller";
import { validate } from "../middleware/validate";
import { listEmployeesSchema, createEmployeeSchema } from "../validators/employees.validators";

const r = Router();

r.get("/", validate(listEmployeesSchema), list);
r.post("/", validate(createEmployeeSchema), create);

export default r;
