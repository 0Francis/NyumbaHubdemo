import { pgTable, uuid, numeric, date, timestamp } from "drizzle-orm/pg-core";
import { leaseStatusEnum } from "./enums";
import { units } from "./units";
import { users } from "./users";

export const leases = pgTable("leases", {
  id: uuid("id").defaultRandom().primaryKey(),
  unitId: uuid("unit_id")
    .notNull()
    .references(() => units.id),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => users.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  monthlyRent: numeric("monthly_rent", { precision: 12, scale: 2 }).notNull(),
  depositAmount: numeric("deposit_amount", { precision: 12, scale: 2 }).notNull(),
  status: leaseStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
