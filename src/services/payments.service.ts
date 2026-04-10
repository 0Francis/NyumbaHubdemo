import { db } from "../config/db";
import { payments, invoices } from "../db/schema";
import { eq } from "drizzle-orm";
import { AppError } from "../middleware/error-handler";

export const paymentsService = {
  async record(data: {
    invoiceId: string;
    tenantId: string;
    amount: string;
    paymentMethod: "mpesa" | "bank" | "cash";
    transactionRef?: string;
  }) {
    // Verify invoice exists
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, data.invoiceId))
      .limit(1);

    if (!invoice) throw new AppError(404, "Invoice not found");
    if (invoice.status === "paid") {
      throw new AppError(400, "Invoice is already fully paid");
    }

    const paymentAmount = parseFloat(data.amount);
    const currentBalance = parseFloat(invoice.balance);

    if (paymentAmount > currentBalance) {
      throw new AppError(400, "Payment amount exceeds invoice balance");
    }

    // Record payment
    const [payment] = await db
      .insert(payments)
      .values({
        invoiceId: data.invoiceId,
        tenantId: data.tenantId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        transactionRef: data.transactionRef,
      })
      .returning();

    // Update invoice balance and status
    const newAmountPaid = parseFloat(invoice.amountPaid) + paymentAmount;
    const newBalance = currentBalance - paymentAmount;
    const newStatus = newBalance <= 0 ? "paid" : "partial";

    await db
      .update(invoices)
      .set({
        amountPaid: newAmountPaid.toFixed(2),
        balance: newBalance.toFixed(2),
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, data.invoiceId));

    return payment;
  },

  async list(userId: string, role: string) {
    if (role === "tenant") {
      return db.select().from(payments).where(eq(payments.tenantId, userId));
    }

    return db.select().from(payments);
  },
};
