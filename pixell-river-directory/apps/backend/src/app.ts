import express from "express";
import helmet from "helmet";
import cors from "cors";
import employees from "./routes/employees.routes";
import roles from "./routes/roles.routes";
import { apiKey } from "./middleware/apiKey";
import { clerkMiddleware, getAuth } from "@clerk/express";

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const API_KEY = process.env.API_KEY || "dev-secret-key";

app.use(helmet());

const corsConfig = {
  origin: [FRONTEND_ORIGIN],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-API-Key", "Authorization"],
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(express.json());

app.use(clerkMiddleware());

app.use("/api", (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized (no Clerk user)" });
  }
  return next();
});

app.use(apiKey(API_KEY));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/employees", employees);
app.use("/api/roles", roles);

app.use((req, res) => res.status(404).json({ error: "Not Found" }));

export default app;
