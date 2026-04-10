import { Router } from "express";
import { propertiesController } from "../controllers/properties.controller";
import { requireAuth, verifyClerk } from "../middleware/clerk-auth";
import { requireRole } from "../middleware/require-role";
import { validate, validateQuery } from "../middleware/validate";
import { createPropertySchema, updatePropertySchema, propertyQuerySchema } from "../validations/properties.validation";

const router = Router();

// Public endpoints
router.get("/", validateQuery(propertyQuerySchema), propertiesController.list);
router.get("/:id", propertiesController.getById);
router.get("/:id/units", propertiesController.getUnits);

// Authenticated endpoints
router.post(
  "/",
  verifyClerk, requireAuth, requireRole("landlord", "agent"),
  validate(createPropertySchema),
  propertiesController.create
);

router.put(
  "/:id",
  verifyClerk, requireAuth, requireRole("landlord", "agent"),
  validate(updatePropertySchema),
  propertiesController.update
);

router.delete(
  "/:id",
  verifyClerk, requireAuth, requireRole("landlord"),
  propertiesController.remove
);

// Contact inquiry — any authenticated user
router.post(
  "/:id/contact",
  verifyClerk, requireAuth,
  propertiesController.contact
);

export default router;
