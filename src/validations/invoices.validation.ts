import { z } from "zod";

export const createInvoiceSchema = z.object({
  leaseId: z.string().uuid("Invalid lease ID"),
  amountDue: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  billingPeriod: z.string().regex(/^\d{4}-\d{2}$/, "Use YYYY-MM format"),
});
