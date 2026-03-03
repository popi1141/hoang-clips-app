import { Hono } from "hono";
import db from "../lib/db";

const gigs = new Hono();

gigs.get("/", (c) => {
  const rows = db.prepare("SELECT * FROM gigs ORDER BY sort_order ASC, created_at DESC").all();
  return c.json(rows);
});

gigs.post("/", async (c) => {
  const { name, gig_date } = await c.req.json();
  if (!name?.trim()) return c.json({ error: "Name required" }, 400);
  try {
    const maxOrder = db.prepare("SELECT MAX(sort_order) as max_order FROM gigs").get() as any;
    const nextOrder = (maxOrder?.max_order ?? -1) + 1;
    const result = db.prepare("INSERT INTO gigs (name, gig_date, sort_order) VALUES (?, ?, ?)").run(name.trim(), gig_date || null, nextOrder);
    return c.json({ id: result.lastInsertRowid, name: name.trim(), gig_date: gig_date || null, sort_order: nextOrder });
  } catch {
    return c.json({ error: "Gig already exists" }, 409);
  }
});

gigs.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const { gig_date } = await c.req.json();
  db.prepare("UPDATE gigs SET gig_date = ? WHERE id = ?").run(gig_date || null, parseInt(id));
  return c.json({ success: true });
});

gigs.post("/reorder", async (c) => {
  const { order } = await c.req.json();
  if (!Array.isArray(order)) return c.json({ error: "Order array required" }, 400);
  try {
    const stmt = db.prepare("UPDATE gigs SET sort_order = ? WHERE id = ?");
    order.forEach((id, idx) => {
      stmt.run(idx, parseInt(id));
    });
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

export default gigs;
