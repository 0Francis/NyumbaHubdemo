import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { requireAuth, verifyClerk } from "../middleware/clerk-auth";
import { validate } from "../middleware/validate";
import { syncUserSchema } from "../validations/auth.validation";

const router = Router();

// POST /api/auth/sync — sync Clerk user to local DB (profile completion)
router.post("/sync", verifyClerk, validate(syncUserSchema), authController.sync);

// GET /api/auth/me — get current user profile
router.get("/me", verifyClerk, requireAuth, authController.me);

export default router;
