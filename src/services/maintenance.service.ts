import { db } from "../config/db";
import { maintenanceRequests, units, properties } from "../db/schema";
import { eq } from "drizzle-orm";
import { AppError } from "../middleware/error-handler";

export const maintenanceService = {
  async create(tenantId: string, data: {
    unitId: string;
    title: string;
    description: string;
  }) {
    // Verify unit exists
    const [unit] = await db
      .select()
      .from(units)
      .where(eq(units.id, data.unitId))
      .limit(1);

    if (!unit) throw new AppError(404, "Unit not found");

    const [request] = await db
      .insert(maintenanceRequests)
      .values({ tenantId, ...data })
      .returning();

    return request;
  },

  async list(userId: string, role: string) {
    if (role === "tenant") {
      return db
        .select()
        .from(maintenanceRequests)
        .where(eq(maintenanceRequests.tenantId, userId));
    }

    // Landlord/agent: return all requests (simplified for MVP)
    return db.select().from(maintenanceRequests);
  },

  async update(id: string, userId: string, role: string, data: {
    status?: string;
    assignedTo?: string | null;
  }) {
    const [request] = await db
      .select()
      .from(maintenanceRequests)
      .where(eq(maintenanceRequests.id, id))
      .limit(1);

    if (!request) throw new AppError(404, "Maintenance request not found");

    // Only landlord/agent can update status
    if (role === "tenant") {
      throw new AppError(403, "Tenants cannot update maintenance requests");
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (data.status) updateData.status = data.status;
    if (data.assignedTo !== undefined) updateData.assignedTo = data.assignedTo;

    const [updated] = await db
      .update(maintenanceRequests)
      .set(updateData)
      .where(eq(maintenanceRequests.id, id))
      .returning();

    return updated;
  },
};
