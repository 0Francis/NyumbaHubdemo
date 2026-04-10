import { db } from "../config/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

interface SyncUserInput {
  clerkUserId: string;
  fullName: string;
  email: string;
  phone: string;
  role: "landlord" | "agent" | "tenant";
}

export const authService = {
  async syncUser(input: SyncUserInput) {
    // Check if user already exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, input.clerkUserId))
      .limit(1);

    if (existing) {
      // Update existing user
      const [updated] = await db
        .update(users)
        .set({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
        })
        .where(eq(users.clerkUserId, input.clerkUserId))
        .returning();
      return updated;
    }

    // Create new user
    const [created] = await db.insert(users).values(input).returning();
    return created;
  },

  async getByClerkId(clerkUserId: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);
    return user || null;
  },
};
