import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  users,
  properties,
  units,
  leases,
  invoices,
  payments,
  maintenanceRequests,
} from "./src/db/schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

async function seed() {
  console.log("Seeding NyumbaHub database...");

  // Users
  const [landlord] = await db
    .insert(users)
    .values({
      clerkUserId: "clerk_landlord_001",
      fullName: "James Mwangi",
      email: "james@nyumbahub.co.ke",
      phone: "+254712345678",
      role: "landlord",
    })
    .returning();

  const [agent] = await db
    .insert(users)
    .values({
      clerkUserId: "clerk_agent_001",
      fullName: "Grace Wanjiku",
      email: "grace@nyumbahub.co.ke",
      phone: "+254723456789",
      role: "agent",
    })
    .returning();

  const [tenant1] = await db
    .insert(users)
    .values({
      clerkUserId: "clerk_tenant_001",
      fullName: "Kevin Odhiambo",
      email: "kevin@gmail.com",
      phone: "+254734567890",
      role: "tenant",
    })
    .returning();

  const [tenant2] = await db
    .insert(users)
    .values({
      clerkUserId: "clerk_tenant_002",
      fullName: "Fatima Hassan",
      email: "fatima@gmail.com",
      phone: "+254745678901",
      role: "tenant",
    })
    .returning();

  // Property
  const [property] = await db
    .insert(properties)
    .values({
      landlordId: landlord.id,
      agentId: agent.id,
      name: "Sunrise Apartments",
      propertyType: "apartment",
      address: "123 Moi Avenue",
      city: "Nairobi",
      description: "Modern apartments in the heart of Nairobi",
    })
    .returning();

  // Units
  const [unit1] = await db
    .insert(units)
    .values({
      propertyId: property.id,
      unitNumber: "A1",
      rentAmount: "25000.00",
      status: "occupied",
      bedrooms: 2,
      bathrooms: 1,
    })
    .returning();

  const [unit2] = await db
    .insert(units)
    .values({
      propertyId: property.id,
      unitNumber: "A2",
      rentAmount: "18000.00",
      status: "vacant",
      bedrooms: 1,
      bathrooms: 1,
    })
    .returning();

  // Lease
  const [lease] = await db
    .insert(leases)
    .values({
      unitId: unit1.id,
      tenantId: tenant1.id,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      monthlyRent: "25000.00",
      depositAmount: "50000.00",
      status: "active",
    })
    .returning();

  // Invoice
  const [invoice] = await db
    .insert(invoices)
    .values({
      leaseId: lease.id,
      tenantId: tenant1.id,
      amountDue: "25000.00",
      amountPaid: "15000.00",
      balance: "10000.00",
      dueDate: "2026-04-05",
      billingPeriod: "2026-04",
      status: "partial",
    })
    .returning();

  // Payment
  await db.insert(payments).values({
    invoiceId: invoice.id,
    tenantId: tenant1.id,
    amount: "15000.00",
    paymentMethod: "mpesa",
    transactionRef: "QKL7H2XRTE",
  });

  // Maintenance request
  await db.insert(maintenanceRequests).values({
    unitId: unit1.id,
    tenantId: tenant1.id,
    title: "Leaking kitchen faucet",
    description: "The kitchen faucet has been dripping constantly for two days.",
    status: "open",
  });

  console.log("Seed complete!");
  console.log({
    landlord: landlord.fullName,
    agent: agent.fullName,
    tenants: [tenant1.fullName, tenant2.fullName],
    property: property.name,
    units: [unit1.unitNumber, unit2.unitNumber],
  });

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
