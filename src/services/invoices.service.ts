import { db } from "../config/db";
import { invoices, leases } from "../db/schema";
import { eq } from "drizzle-orm";
import { AppError } from "../middleware/error-handler";

export const invoicesService = {
  async create(data: {
    leaseId: string;
    amountDue: string;
    dueDate: string;
    billingPeriod: string;
  }) {
    // Verify lease exists and is active
    const [lease] = await db
      .select()
      .from(leases)
      .where(eq(leases.id, data.leaseId))
      .limit(1);

    if (!lease) throw new AppError(404, "Lease not found");
    if (lease.status !== "active") {
      throw new AppError(400, "Cannot create invoice for inactive lease");
    }

    const [invoice] = await db
      .insert(invoices)
      .values({
        leaseId: data.leaseId,
        tenantId: lease.tenantId,
        amountDue: data.amountDue,
        amountPaid: "0",
        balance: data.amountDue,
        dueDate: data.dueDate,
        billingPeriod: data.billingPeriod,
      })
      .returning();

    return invoice;
  },

  async list(userId: string, role: string) {
    if (role === "tenant") {
      return db.select().from(invoices).where(eq(invoices.tenantId, userId));
    }

    // For landlord/agent — simplified: return all invoices
    // Production would scope to their properties' leases
    return db.select().from(invoices);
  },

  async getById(id: string) {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id))
      .limit(1);
    return invoice || null;
  },
};
