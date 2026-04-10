import express from "express";
import cors from "cors";
import apiRoutes from "./routes";
import { errorHandler } from "./middleware/error-handler";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "NyumbaHub API" });
});

// API routes
app.use("/api", apiRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
