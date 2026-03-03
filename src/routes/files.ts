import { Hono } from "hono";
import path from "path";
import db from "../lib/db";
import { isAdmin } from "../lib/auth";
import { UPLOAD_DIR } from "../lib/paths";

const files = new Hono();

files.get("/download/:filename", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);
  const filename = c.req.param("filename");
  const filePath = path.join(UPLOAD_DIR, filename);
  const file = Bun.file(filePath);
  if (!(await file.exists())) return c.json({ error: "File not found" }, 404);
  const sub = db.prepare("SELECT original_filename, mime_type FROM submissions WHERE filename = ?").get(filename) as any;
  return new Response(file.stream(), {
    headers: {
      "Content-Type": sub?.mime_type || "video/mp4",
      "Content-Disposition": `attachment; filename="${sub?.original_filename || filename}"`,
    },
  });
});

files.get("/preview/:filename", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);
  const filename = c.req.param("filename");
  const filePath = path.join(UPLOAD_DIR, filename);
  const file = Bun.file(filePath);
  if (!(await file.exists())) return c.json({ error: "File not found" }, 404);
  const sub = db.prepare("SELECT mime_type FROM submissions WHERE filename = ?").get(filename) as any;
  return new Response(file.stream(), {
    headers: {
      "Content-Type": sub?.mime_type || "video/mp4",
      "Accept-Ranges": "bytes",
    },
  });
});

export default files;
