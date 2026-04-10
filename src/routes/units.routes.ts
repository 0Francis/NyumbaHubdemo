import { Router } from "express";
import { unitsController } from "../controllers/units.controller";
import { requireAuth, verifyClerk } from "../middleware/clerk-auth";
import { requireRole } from "../middleware/require-role";
import { validate } from "../middleware/validate";
import { createUnitSchema, updateUnitSchema } from "../validations/units.validation";

const router = Router();

// Create unit under a property
router.post(
  "/properties/:propertyId/units",
  verifyClerk, requireAuth, requireRole("landlord", "agent"),
  validate(createUnitSchema),
  unitsController.create
);

// Update unit
router.put(
  "/:id",
  verifyClerk, requireAuth, requireRole("landlord", "agent"),
  validate(updateUnitSchema),
  unitsController.update
);

// Delete unit
router.delete(
  "/:id",
  verifyClerk, requireAuth, requireRole("landlord"),
  unitsController.remove
);

export default router;
