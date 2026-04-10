import { pgTable, uuid, numeric, varchar, timestamp } from "drizzle-orm/pg-core";
import { paymentMethodEnum } from "./enums";
import { invoices } from "./invoices";
import { users } from "./users";

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => users.id),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  transactionRef: varchar("transaction_ref", { length: 100 }),
  paidAt: timestamp("paid_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
