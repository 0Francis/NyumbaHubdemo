import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "landlord",
  "agent",
  "tenant",
]);

export const propertyTypeEnum = pgEnum("property_type", [
  "apartment",
  "studio",
  "bedsitter",
  "house",
  "office",
  "shop",
  "warehouse",
  "venue",
  "1BR",
  "2BR",
  "3BR",
  "restaurant",
  "other",
]);

export const unitStatusEnum = pgEnum("unit_status", [
  "vacant",
  "occupied",
]);

export const leaseStatusEnum = pgEnum("lease_status", [
  "active",
  "ended",
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "unpaid",
  "paid",
  "partial",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "mpesa",
  "bank",
  "cash",
]);

export const maintenanceStatusEnum = pgEnum("maintenance_status", [
  "open",
  "in_progress",
  "resolved",
]);
