import { z } from "zod";

export const createLeaseSchema = z.object({
  unitId: z.string().uuid("Invalid unit ID"),
  tenantId: z.string().uuid("Invalid tenant ID"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  monthlyRent: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid rent amount"),
  depositAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid deposit amount"),
});

export const updateLeaseSchema = z.object({
  status: z.enum(["active", "ended"]).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
