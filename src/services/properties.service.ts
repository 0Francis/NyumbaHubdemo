import { db } from "../config/db";
import { properties, units, users, contactInquiries } from "../db/schema";
import { eq, and, ilike } from "drizzle-orm";
import { AppError } from "../middleware/error-handler";

export const propertiesService = {
  async list(filters?: { propertyType?: string; city?: string }) {
    let query = db.select().from(properties);

    const conditions = [];
    if (filters?.propertyType) {
      conditions.push(eq(properties.propertyType, filters.propertyType as any));
    }
    if (filters?.city) {
      conditions.push(ilike(properties.city, `%${filters.city}%`));
    }

    if (conditions.length > 0) {
      return db.select().from(properties).where(and(...conditions));
    }

    return query;
  },

  async getById(id: string) {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);
    return property || null;
  },

  async getUnitsForProperty(propertyId: string) {
    return db.select().from(units).where(eq(units.propertyId, propertyId));
  },

  async create(landlordId: string, data: {
    name: string;
    propertyType: string;
    address: string;
    city: string;
    description?: string;
    agentId?: string;
  }) {
    const [property] = await db
      .insert(properties)
      .values({
        landlordId,
        name: data.name,
        propertyType: data.propertyType as any,
        address: data.address,
        city: data.city,
        description: data.description,
        agentId: data.agentId,
      })
      .returning();
    return property;
  },

  async update(id: string, landlordId: string, data: Record<string, any>) {
    // Verify ownership
    const property = await this.getById(id);
    if (!property) throw new AppError(404, "Property not found");
    if (property.landlordId !== landlordId && property.agentId !== landlordId) {
      throw new AppError(403, "Not authorized to update this property");
    }

    const [updated] = await db
      .update(properties)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updated;
  },

  async remove(id: string, landlordId: string) {
    const property = await this.getById(id);
    if (!property) throw new AppError(404, "Property not found");
    if (property.landlordId !== landlordId) {
      throw new AppError(403, "Not authorized to delete this property");
    }

    await db.delete(properties).where(eq(properties.id, id));
  },

  async logContactInquiry(userId: string, propertyId: string) {
    const property = await this.getById(propertyId);
    if (!property) throw new AppError(404, "Property not found");

    // Log the inquiry
    await db.insert(contactInquiries).values({ userId, propertyId });

    // Return landlord contact info
    const [landlord] = await db
      .select({ fullName: users.fullName, email: users.email, phone: users.phone })
      .from(users)
      .where(eq(users.id, property.landlordId))
      .limit(1);

    return { landlord, propertyName: property.name };
  },
};
