# NyumbaHub — Backend Architecture

## 1. System Overview

NyumbaHub is a rental/property management API for the Kenyan market. It helps landlords and agents manage properties, units, leases, invoices, payments, and maintenance requests.

**Stack:** Node.js + Express + TypeScript + PostgreSQL (Supabase) + Drizzle ORM + Clerk auth.

**Why this stack:**
- **Clerk** handles auth (Google OAuth, email+password, phone OTP) so we don't build custom JWT infrastructure.
- **PostgreSQL + Drizzle** gives us type-safe SQL with minimal ORM overhead.
- **Express** is the simplest Node.js web framework — perfect for an MVP.
- **Supabase** provides a managed Postgres instance with zero DevOps.

---

## 2. Database Schema

### Tables

| Table | Purpose |
|---|---|
| `users` | Local user profiles synced from Clerk. Role: landlord, agent, tenant |
| `properties` | Rental properties owned by landlords, optionally managed by agents |
| `units` | Individual rentable units within a property |
| `leases` | Agreements linking a tenant to a unit for a time period |
| `invoices` | Monthly billing records generated from leases |
| `payments` | Payment records against invoices |
| `maintenance_requests` | Repair/maintenance tickets created by tenants |
| `contact_inquiries` | Logs when a user expresses interest in a property |

### Relationships

```
users (landlord) ──< properties
users (agent)    ──< properties (optional)
properties       ──< units
units            ──< leases
users (tenant)   ──< leases
leases           ──< invoices
invoices         ──< payments
units            ──< maintenance_requests
users (tenant)   ──< maintenance_requests
users            ──< contact_inquiries
properties       ──< contact_inquiries
```

### Key Constraints

- **One active lease per unit** — enforced in application logic on lease creation.
- **Payment cannot exceed invoice balance** — enforced in payment service.
- **Invoice balance auto-updates** after each payment.
- **Unit status** flips to `occupied` on lease creation, `vacant` on lease end.

---

## 3. Enums

| Enum | Values | Why |
|---|---|---|
| `user_role` | landlord, agent, tenant | Controls RBAC |
| `property_type` | apartment, studio, bedsitter, house, office, shop, warehouse, venue, 1BR, 2BR, 3BR, restaurant, other | Filtering on public browse |
| `unit_status` | vacant, occupied | Quick availability check |
| `lease_status` | active, ended | Lifecycle tracking |
| `invoice_status` | unpaid, paid, partial | Payment state |
| `payment_method` | mpesa, bank, cash | Kenyan market payment methods |
| `maintenance_status` | open, in_progress, resolved | Ticket workflow |

---

## 4. API Endpoints

### Public (no auth)
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/properties` | List/filter properties |
| GET | `/api/properties/:id` | Property details |
| GET | `/api/properties/:id/units` | Units for a property |

### Auth
| Method | Route | Purpose | Roles |
|---|---|---|---|
| POST | `/api/auth/sync` | Sync Clerk user to local DB | any authenticated |
| GET | `/api/auth/me` | Get current user profile | any authenticated |

### Properties
| Method | Route | Purpose | Roles |
|---|---|---|---|
| POST | `/api/properties` | Create property | landlord, agent |
| PUT | `/api/properties/:id` | Update property | landlord, agent (owner) |
| DELETE | `/api/properties/:id` | Delete property | landlord (owner) |
| POST | `/api/properties/:id/contact` | Log inquiry + get contact | any authenticated |

### Units
| Method | Route | Purpose | Roles |
|---|---|---|---|
| POST | `/api/units/properties/:propertyId/units` | Create unit | landlord, agent |
| PUT | `/api/units/:id` | Update unit | landlord, agent |
| DELETE | `/api/units/:id` | Delete unit | landlord |

### Leases
| Method | Route | Purpose | Roles |
|---|---|---|---|
| POST | `/api/leases` | Create lease | landlord, agent |
| GET | `/api/leases` | List leases (scoped) | all authenticated |
| GET | `/api/leases/:id` | Lease detail | all authenticated |
| PUT | `/api/leases/:id` | Update/end lease | landlord, agent |

### Invoices
| Method | Route | Purpose | Roles |
|---|---|---|---|
| POST | `/api/invoices` | Create invoice | landlord, agent |
| GET | `/api/invoices` | List invoices (scoped) | all authenticated |
| GET | `/api/invoices/:id` | Invoice detail | all authenticated |

### Payments
| Method | Route | Purpose | Roles |
|---|---|---|---|
| POST | `/api/payments` | Record payment | landlord, agent |
| GET | `/api/payments` | List payments (scoped) | all authenticated |

### Maintenance
| Method | Route | Purpose | Roles |
|---|---|---|---|
| POST | `/api/maintenance` | Create request | tenant |
| GET | `/api/maintenance` | List requests (scoped) | all authenticated |
| PUT | `/api/maintenance/:id` | Update status | landlord, agent |

---

## 5. RBAC Strategy

Simple middleware chain:
1. `verifyClerk` — Clerk session verification
2. `requireAuth` — loads local user from DB, attaches to `req.appUser`
3. `requireRole("landlord", "agent")` — checks `req.appUser.role`

Ownership checks happen in service layer (e.g., landlord can only update their own properties).

---

## 6. Auth Flow

1. User authenticates via Clerk (Google, email, or phone OTP)
2. Frontend calls `POST /api/auth/sync` with profile data (fullName, email, phone, role)
3. Backend verifies Clerk token, creates/updates local user record
4. Subsequent requests use `GET /api/auth/me` and include Clerk session token
5. Backend middleware resolves Clerk userId → local user → role → access control

---

## 7. Validation

Uses **Zod** schemas in `src/validations/`. Middleware applies them:
- `validate(schema)` — validates `req.body`
- `validateQuery(schema)` — validates `req.query`

Key validations:
- Phone: must start with `+254`, max 14 chars
- Role: must be one of `landlord`, `agent`, `tenant`
- Monetary amounts: string format matching `^\d+(\.\d{1,2})?$`
- Dates: `YYYY-MM-DD` format
- UUIDs: validated on foreign key references

---

## 8. Error Handling

Standard format:
```json
{ "error": "Human-readable error message" }
```

With optional details for validation:
```json
{ "error": "Validation failed", "details": { "phone": ["Phone must start with +254"] } }
```

Status codes:
- `400` — validation / business rule violation
- `401` — unauthenticated
- `403` — unauthorized (wrong role or not owner)
- `404` — resource not found
- `409` — conflict (e.g., active lease exists)
- `500` — internal server error

---

## 9. Sample Request/Response

### Create Property
```
POST /api/properties
Authorization: Bearer <clerk_token>

{
  "name": "Sunrise Apartments",
  "propertyType": "apartment",
  "address": "123 Moi Avenue",
  "city": "Nairobi",
  "description": "Modern apartments in CBD"
}

→ 201 { "data": { "id": "uuid", "name": "Sunrise Apartments", ... } }
```

### Create Lease
```
POST /api/leases
Authorization: Bearer <clerk_token>

{
  "unitId": "uuid",
  "tenantId": "uuid",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "monthlyRent": "25000.00",
  "depositAmount": "50000.00"
}

→ 201 { "data": { "id": "uuid", "status": "active", ... } }
```

### Record Payment
```
POST /api/payments
Authorization: Bearer <clerk_token>

{
  "invoiceId": "uuid",
  "amount": "15000.00",
  "paymentMethod": "mpesa",
  "transactionRef": "QKL7H2XRTE"
}

→ 201 { "data": { "id": "uuid", "amount": "15000.00", ... } }
```

### Create Maintenance Request
```
POST /api/maintenance
Authorization: Bearer <clerk_token>

{
  "unitId": "uuid",
  "title": "Leaking kitchen faucet",
  "description": "The kitchen faucet has been dripping for two days."
}

→ 201 { "data": { "id": "uuid", "status": "open", ... } }
```

---

## 10. Future Improvements

- M-Pesa STK push integration
- Scheduled invoice generation (cron)
- Arrears/overdue reporting
- SMS/email notifications
- Utility billing and meter readings
- Document storage (lease agreements, receipts)
- Analytics dashboards
- Vendor assignment for maintenance
- PDF/CSV exports
- Multi-tenant SaaS isolation
