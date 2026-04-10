import { pgTable, uuid, numeric, date, varchar, timestamp } from "drizzle-orm/pg-core";
import { invoiceStatusEnum } from "./enums";
import { leases } from "./leases";
import { users } from "./users";

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  leaseId: uuid("lease_id")
    .notNull()
    .references(() => leases.id),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => users.id),
  amountDue: numeric("amount_due", { precision: 12, scale: 2 }).notNull(),
  amountPaid: numeric("amount_paid", { precision: 12, scale: 2 }).default("0").notNull(),
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull(),
  dueDate: date("due_date").notNull(),
  billingPeriod: varchar("billing_period", { length: 20 }).notNull(), // e.g. "2026-04"
  status: invoiceStatusEnum("status").default("unpaid").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
