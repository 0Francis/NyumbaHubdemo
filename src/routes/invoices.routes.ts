import { Router } from "express";
import { invoicesController } from "../controllers/invoices.controller";
import { requireAuth, verifyClerk } from "../middleware/clerk-auth";
import { requireRole } from "../middleware/require-role";
import { validate } from "../middleware/validate";
import { createInvoiceSchema } from "../validations/invoices.validation";

const router = Router();

router.post(
  "/",
  verifyClerk, requireAuth, requireRole("landlord", "agent"),
  validate(createInvoiceSchema),
  invoicesController.create
);

router.get("/", verifyClerk, requireAuth, invoicesController.list);
router.get("/:id", verifyClerk, requireAuth, invoicesController.getById);

export default router;
