import { Router } from "express";
import authRoutes from "./auth.routes";
import propertiesRoutes from "./properties.routes";
import unitsRoutes from "./units.routes";
import leasesRoutes from "./leases.routes";
import invoicesRoutes from "./invoices.routes";
import paymentsRoutes from "./payments.routes";
import maintenanceRoutes from "./maintenance.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/properties", propertiesRoutes);
router.use("/units", unitsRoutes);
router.use("/leases", leasesRoutes);
router.use("/invoices", invoicesRoutes);
router.use("/payments", paymentsRoutes);
router.use("/maintenance", maintenanceRoutes);

export default router;
