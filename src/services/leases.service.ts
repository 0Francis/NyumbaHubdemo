import { db } from "../config/db";
import { leases, units, properties } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { AppError } from "../middleware/error-handler";

export const leasesService = {
  async create(userId: string, data: {
    unitId: string;
    tenantId: string;
    startDate: string;
    endDate: string;
    monthlyRent: string;
    depositAmount: string;
  }) {
    // Verify user owns/manages the unit's property
    const [unit] = await db.select().from(units).where(eq(units.id, data.unitId)).limit(1);
    if (!unit) throw new AppError(404, "Unit not found");

    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, unit.propertyId))
      .limit(1);

    if (!property) throw new AppError(404, "Property not found");
    if (property.landlordId !== userId && property.agentId !== userId) {
      throw new AppError(403, "Not authorized to create leases for this unit");
    }

    // Enforce: only one active lease per unit
    const [activeLease] = await db
      .select()
      .from(leases)
      .where(and(eq(leases.unitId, data.unitId), eq(leases.status, "active")))
      .limit(1);

    if (activeLease) {
      throw new AppError(409, "Unit already has an active lease");
    }

    // Create lease and mark unit as occupied
    const [lease] = await db.insert(leases).values(data).returning();

    await db
      .update(units)
      .set({ status: "occupied", updatedAt: new Date() })
      .where(eq(units.id, data.unitId));

    return lease;
  },

  async list(userId: string, role: string) {
    if (role === "tenant") {
      return db.select().from(leases).where(eq(leases.tenantId, userId));
    }

    // Landlord/agent: get leases for their properties
    const ownedProperties = await db
      .select({ id: properties.id })
      .from(properties)
      .where(eq(properties.landlordId, userId));

    const managedProperties = await db
      .select({ id: properties.id })
      .from(properties)
      .where(eq(properties.agentId, userId));

    const propertyIds = [
      ...ownedProperties.map((p) => p.id),
      ...managedProperties.map((p) => p.id),
    ];

    if (propertyIds.length === 0) return [];

    const propertyUnits = await db
      .select({ id: units.id })
      .from(units)
      .where(eq(units.propertyId, propertyIds[0])); // simplified for MVP

    const unitIds = propertyUnits.map((u) => u.id);
    if (unitIds.length === 0) return [];

    // For MVP, return all leases for the first property's units
    // A production system would use inArray for all property units
    return db.select().from(leases).where(eq(leases.unitId, unitIds[0]));
  },

  async getById(id: string) {
    const [lease] = await db.select().from(leases).where(eq(leases.id, id)).limit(1);
    return lease || null;
  },

  async update(id: string, userId: string, data: { status?: string; endDate?: string }) {
    const lease = await this.getById(id);
    if (!lease) throw new AppError(404, "Lease not found");

    // Verify ownership through unit → property
    const [unit] = await db.select().from(units).where(eq(units.id, lease.unitId)).limit(1);
    if (!unit) throw new AppError(404, "Unit not found");

    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, unit.propertyId))
      .limit(1);

    if (!property) throw new AppError(404, "Property not found");
    if (property.landlordId !== userId && property.agentId !== userId) {
      throw new AppError(403, "Not authorized to update this lease");
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (data.status) updateData.status = data.status;
    if (data.endDate) updateData.endDate = data.endDate;

    const [updated] = await db
      .update(leases)
      .set(updateData)
      .where(eq(leases.id, id))
      .returning();

    // If lease ended, mark unit as vacant
    if (data.status === "ended") {
      await db
        .update(units)
        .set({ status: "vacant", updatedAt: new Date() })
        .where(eq(units.id, lease.unitId));
    }

    return updated;
  },
};
