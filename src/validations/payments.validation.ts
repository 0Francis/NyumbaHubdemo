import { z } from "zod";

export const createPaymentSchema = z.object({
  invoiceId: z.string().uuid("Invalid invoice ID"),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  paymentMethod: z.enum(["mpesa", "bank", "cash"]),
  transactionRef: z.string().optional(),
});
