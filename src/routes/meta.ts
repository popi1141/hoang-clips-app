import { Hono } from "hono";
import db from "../lib/db";
import { isAdmin } from "../lib/auth";

const meta = new Hono();

// Get current meta settings
meta.get("/", (c) => {
  const settings = db.prepare("SELECT meta_thumbnail_path, meta_description FROM site_settings WHERE id = 1").get() as any;
  return c.json({
    meta_thumbnail_path: settings?.meta_thumbnail_path || '/hoang-og.png',
    meta_description: settings?.meta_description || 'Hoang Memories - A fan community showcase'
  });
});

// Update meta thumbnail and description
meta.patch("/", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);

  const { meta_thumbnail_path, meta_description } = await c.req.json();

  const updates: string[] = [];
  const values: any[] = [];

  if (meta_thumbnail_path !== undefined) {
    updates.push("meta_thumbnail_path = ?");
    values.push(meta_thumbnail_path);
  }
  if (meta_description !== undefined) {
    updates.push("meta_description = ?");
    values.push(meta_description);
  }

  if (updates.length === 0) {
    return c.json({ error: "No fields to update" }, 400);
  }

  values.push(1);
  db.prepare(`UPDATE site_settings SET ${updates.join(", ")} WHERE id = ?`).run(...values);

  return c.json({ success: true });
});

// Generate meta thumbnail from a submission (optional helper)
meta.post("/generate-from-submission/:id", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);

  const id = parseInt(c.req.param("id"));
  const sub = db.prepare("SELECT thumbnail, filename FROM submissions WHERE id = ?").get(id) as any;

  if (!sub) return c.json({ error: "Submission not found" }, 404);

  // Use the submission's thumbnail as the meta thumbnail
  const thumbnailPath = sub.thumbnail ? `/thumbnails/${sub.thumbnail}` : null;

  if (!thumbnailPath) {
    return c.json({ error: "Submission has no thumbnail" }, 400);
  }

  db.prepare("UPDATE site_settings SET meta_thumbnail_path = ? WHERE id = 1").run(thumbnailPath);

  return c.json({ success: true, meta_thumbnail_path: thumbnailPath });
});

export default meta;
