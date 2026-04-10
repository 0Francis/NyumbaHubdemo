# NyumbaHub

A rental and property management system built for the Kenyan market. NyumbaHub helps landlords, agents, and tenants manage properties, leases, invoices, payments, and maintenance requests; all in one place.

This repository contains the **backend API** that is supposed to power the NyumbaHub platform.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (hosted on Supabase)
- **ORM:** Drizzle ORM
- **Auth:** Clerk
- **Validation:** Zod

**V1:**
- **Runtime:** Node.js + JavaScript
- **Framework:** Express.js
- **Database:** SQLite
- **Auth:** None
- **Validation:** None

This is my initial Starter project, to help build the actual one optimised to at least be scalable.

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (for PostgreSQL)
- A [Clerk](https://clerk.com) application (for authentication)

### Setup

```bash
# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# Fill in your Supabase DATABASE_URL, Clerk keys

# Push schema to database
npm run db:push

# Seed sample data
npm run db:seed

# Start development server
npm run dev
```

The API will be running at `http://localhost:3000`. Hit `/health` to verify.

## Documentation

Full architecture docs, API reference, schema design, and sample requests are in [`docs/architecture.md`](docs/architecture.md).

## Acknowledgements

Code cleaned and optimised with the help of **Cascade (Claude Opus 4.6)**.

---

Built by **Francis**, for fun.
