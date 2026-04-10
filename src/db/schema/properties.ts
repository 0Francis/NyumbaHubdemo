import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { propertyTypeEnum } from "./enums";
import { users } from "./users";

export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  landlordId: uuid("landlord_id")
    .notNull()
    .references(() => users.id),
  agentId: uuid("agent_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  propertyType: propertyTypeEnum("property_type").notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
