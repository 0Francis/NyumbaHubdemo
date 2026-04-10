import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { maintenanceStatusEnum } from "./enums";
import { units } from "./units";
import { users } from "./users";

export const maintenanceRequests = pgTable("maintenance_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  unitId: uuid("unit_id")
    .notNull()
    .references(() => units.id),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => users.id),
  assignedTo: uuid("assigned_to").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: maintenanceStatusEnum("status").default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
