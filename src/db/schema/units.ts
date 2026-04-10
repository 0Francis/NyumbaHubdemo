import { pgTable, uuid, varchar, numeric, integer, timestamp } from "drizzle-orm/pg-core";
import { unitStatusEnum } from "./enums";
import { properties } from "./properties";

export const units = pgTable("units", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  unitNumber: varchar("unit_number", { length: 50 }).notNull(),
  rentAmount: numeric("rent_amount", { precision: 12, scale: 2 }).notNull(),
  status: unitStatusEnum("status").default("vacant").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
