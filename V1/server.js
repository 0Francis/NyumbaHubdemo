const express = require("express");
const Database = require("better-sqlite3");

const app = express();
app.use(express.json());

const db = new Database("data.db");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    address TEXT,
    city TEXT,
    rent INTEGER
  );
  CREATE TABLE IF NOT EXISTS tenants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    property_id INTEGER
  );
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id INTEGER,
    amount INTEGER,
    method TEXT,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS maintenance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id INTEGER,
    property_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open',
    date TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// ---- Properties ----

app.get("/properties", (req, res) => {
  const rows = db.prepare("SELECT * FROM properties").all();
  res.json(rows);
});

app.get("/properties/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM properties WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Property not found" });
  res.json(row);
});

app.post("/properties", (req, res) => {
  const { name, type, address, city, rent } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });

  const result = db.prepare(
    "INSERT INTO properties (name, type, address, city, rent) VALUES (?, ?, ?, ?, ?)"
  ).run(name, type || null, address || null, city || null, rent || 0);

  res.status(201).json({ id: result.lastInsertRowid, name, type, address, city, rent });
});

app.put("/properties/:id", (req, res) => {
  const { name, type, address, city, rent } = req.body;
  const existing = db.prepare("SELECT * FROM properties WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Property not found" });

  db.prepare(
    "UPDATE properties SET name = ?, type = ?, address = ?, city = ?, rent = ? WHERE id = ?"
  ).run(
    name || existing.name,
    type || existing.type,
    address || existing.address,
    city || existing.city,
    rent || existing.rent,
    req.params.id
  );

  res.json({ message: "Updated" });
});

app.delete("/properties/:id", (req, res) => {
  const result = db.prepare("DELETE FROM properties WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Property not found" });
  res.json({ message: "Deleted" });
});

// ---- Tenants ----

app.get("/tenants", (req, res) => {
  const rows = db.prepare("SELECT * FROM tenants").all();
  res.json(rows);
});

app.post("/tenants", (req, res) => {
  const { name, phone, email, property_id } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });

  const result = db.prepare(
    "INSERT INTO tenants (name, phone, email, property_id) VALUES (?, ?, ?, ?)"
  ).run(name, phone || null, email || null, property_id || null);

  res.status(201).json({ id: result.lastInsertRowid, name, phone, email, property_id });
});

app.delete("/tenants/:id", (req, res) => {
  const result = db.prepare("DELETE FROM tenants WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Tenant not found" });
  res.json({ message: "Deleted" });
});

// ---- Payments ----

app.get("/payments", (req, res) => {
  const rows = db.prepare("SELECT * FROM payments").all();
  res.json(rows);
});

app.post("/payments", (req, res) => {
  const { tenant_id, amount, method } = req.body;
  if (!tenant_id || !amount) return res.status(400).json({ error: "tenant_id and amount required" });

  const tenant = db.prepare("SELECT * FROM tenants WHERE id = ?").get(tenant_id);
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  const result = db.prepare(
    "INSERT INTO payments (tenant_id, amount, method) VALUES (?, ?, ?)"
  ).run(tenant_id, amount, method || "cash");

  res.status(201).json({ id: result.lastInsertRowid, tenant_id, amount, method: method || "cash" });
});

// ---- Maintenance ----

app.get("/maintenance", (req, res) => {
  const rows = db.prepare("SELECT * FROM maintenance").all();
  res.json(rows);
});

app.post("/maintenance", (req, res) => {
  const { tenant_id, property_id, title, description } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });

  const result = db.prepare(
    "INSERT INTO maintenance (tenant_id, property_id, title, description) VALUES (?, ?, ?, ?)"
  ).run(tenant_id || null, property_id || null, title, description || null);

  res.status(201).json({ id: result.lastInsertRowid, title, status: "open" });
});

app.put("/maintenance/:id", (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "status is required" });

  const result = db.prepare("UPDATE maintenance SET status = ? WHERE id = ?").run(status, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Request not found" });
  res.json({ message: "Updated", status });
});

// ---- Start ----

app.listen(3001, () => {
  console.log("NyumbaHub V1 running on http://localhost:3001");
});
