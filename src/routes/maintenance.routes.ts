import { Router } from "express";
import { maintenanceController } from "../controllers/maintenance.controller";
import { requireAuth, verifyClerk } from "../middleware/clerk-auth";
import { requireRole } from "../middleware/require-role";
import { validate } from "../middleware/validate";
import { createMaintenanceSchema, updateMaintenanceSchema } from "../validations/maintenance.validation";

const router = Router();

router.post(
  "/",
  verifyClerk, requireAuth, requireRole("tenant"),
  validate(createMaintenanceSchema),
  maintenanceController.create
);

router.get("/", verifyClerk, requireAuth, maintenanceController.list);

router.put(
  "/:id",
  verifyClerk, requireAuth, requireRole("landlord", "agent"),
  validate(updateMaintenanceSchema),
  maintenanceController.update
);

export default router;
