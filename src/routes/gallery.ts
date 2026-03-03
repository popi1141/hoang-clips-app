import { Hono } from "hono";
import db from "../lib/db";

const gallery = new Hono();

gallery.get("/", (c) => {
  const rows = db.prepare(`
    SELECT s.id, s.ig_username, s.filename, s.thumbnail, s.original_filename, s.mime_type, s.view_count, s.caption, s.created_at, s.public_url, g.name as gig_name
    FROM submissions s
    JOIN gigs g ON s.gig_id = g.id
    WHERE s.approved = 1
    ORDER BY s.view_count DESC, s.created_at DESC
  `).all();
  return c.json(rows);
});

gallery.post("/view/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() || c.req.header("x-real-ip") || "unknown";
  try {
    db.prepare("INSERT OR IGNORE INTO views (submission_id, viewer_ip) VALUES (?, ?)").run(id, ip);
    db.prepare("UPDATE submissions SET view_count = (SELECT COUNT(*) FROM views WHERE submission_id = ?) WHERE id = ?").run(id, id);
  } catch {}
  const row = db.prepare("SELECT view_count FROM submissions WHERE id = ?").get(id) as any;
  return c.json({ views: row?.view_count || 0 });
});

export default gallery;
