import { db } from "../config/db";
import { units, properties } from "../db/schema";
import { eq } from "drizzle-orm";
import { AppError } from "../middleware/error-handler";

export const unitsService = {
  async create(propertyId: string, userId: string, data: {
    unitNumber: string;
    rentAmount: string;
    bedrooms?: number;
    bathrooms?: number;
  }) {
    // Verify user owns/manages property
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (!property) throw new AppError(404, "Property not found");
    if (property.landlordId !== userId && property.agentId !== userId) {
      throw new AppError(403, "Not authorized to add units to this property");
    }

    const [unit] = await db
      .insert(units)
      .values({ propertyId, ...data })
      .returning();
    return unit;
  },

  async getById(id: string) {
    const [unit] = await db
      .select()
      .from(units)
      .where(eq(units.id, id))
      .limit(1);
    return unit || null;
  },

  async update(id: string, userId: string, data: Record<string, any>) {
    const unit = await this.getById(id);
    if (!unit) throw new AppError(404, "Unit not found");

    // Verify ownership via property
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, unit.propertyId))
      .limit(1);

    if (!property) throw new AppError(404, "Property not found");
    if (property.landlordId !== userId && property.agentId !== userId) {
      throw new AppError(403, "Not authorized to update this unit");
    }

    const [updated] = await db
      .update(units)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(units.id, id))
      .returning();
    return updated;
  },

  async remove(id: string, userId: string) {
    const unit = await this.getById(id);
    if (!unit) throw new AppError(404, "Unit not found");

    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, unit.propertyId))
      .limit(1);

    if (!property) throw new AppError(404, "Property not found");
    if (property.landlordId !== userId) {
      throw new AppError(403, "Not authorized to delete this unit");
    }

    await db.delete(units).where(eq(units.id, id));
  },
};
