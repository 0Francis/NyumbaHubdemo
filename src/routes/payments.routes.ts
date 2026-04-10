import { Router } from "express";
import { paymentsController } from "../controllers/payments.controller";
import { requireAuth, verifyClerk } from "../middleware/clerk-auth";
import { requireRole } from "../middleware/require-role";
import { validate } from "../middleware/validate";
import { createPaymentSchema } from "../validations/payments.validation";

const router = Router();

router.post(
  "/",
  verifyClerk, requireAuth, requireRole("landlord", "agent"),
  validate(createPaymentSchema),
  paymentsController.record
);

router.get("/", verifyClerk, requireAuth, paymentsController.list);

export default router;
