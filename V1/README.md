# NyumbaHub V1 — The Amateur Version

Bare-bones rental management API. One file, SQLite, no auth, no TypeScript.

## Run

```bash
npm install
npm start
```

Server runs on `http://localhost:3001`.

## Endpoints

| Method | Route | What it does |
|--------|-------|-------------|
| GET | /properties | List all properties |
| GET | /properties/:id | Get one property |
| POST | /properties | Add a property |
| PUT | /properties/:id | Update a property |
| DELETE | /properties/:id | Delete a property |
| GET | /tenants | List all tenants |
| POST | /tenants | Add a tenant |
| DELETE | /tenants/:id | Delete a tenant |
| GET | /payments | List all payments |
| POST | /payments | Record a payment |
| GET | /maintenance | List all requests |
| POST | /maintenance | Create a request |
| PUT | /maintenance/:id | Update request status |

## Limitations

- No auth — anyone can do anything
- No roles or ownership
- No leases or invoices
- No validation beyond "field required"
- SQLite — local only
- Everything in one file
