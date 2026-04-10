import { Router } from "express";
import { leasesController } from "../controllers/leases.controller";
import { requireAuth, verifyClerk } from "../middleware/clerk-auth";
import { requireRole } from "../middleware/require-role";
import { validate } from "../middleware/validate";
import { createLeaseSchema, updateLeaseSchema } from "../validations/leases.validation";

const router = Router();

router.post(
  "/",
  verifyClerk, requireAuth, requireRole("landlord", "agent"),
  validate(createLeaseSchema),
  leasesController.create
);

router.get("/", verifyClerk, requireAuth, leasesController.list);
router.get("/:id", verifyClerk, requireAuth, leasesController.getById);

router.put(
  "/:id",
  verifyClerk, requireAuth, requireRole("landlord", "agent"),
  validate(updateLeaseSchema),
  leasesController.update
);

export default router;
