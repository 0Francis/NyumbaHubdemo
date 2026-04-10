import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { properties } from "./properties";

export const contactInquiries = pgTable("contact_inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
