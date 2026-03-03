import { Hono } from "hono";
import path from "path";
import { mkdirSync } from "fs";
import db from "../lib/db";
import { isAdmin } from "../lib/auth";
import { generateThumbnail } from "../lib/thumbnails";
import { syncToDropbox } from "../lib/dropbox";
import { UPLOAD_DIR, THUMBNAILS_DIR } from "../lib/paths";

const RALLY_API_URL = "https://rally-validation-worker-2wypwab5ea-uw.a.run.app/fetch";
const WEBHOOK_BASE_URL = "https://hoang-clips-popi.zocomputer.io";

const submissions = new Hono();

submissions.post("/", async (c) => {
  const form = await c.req.formData();
  const name = form.get("name") as string;
  const email = (form.get("email") as string) || null;
  const phone = (form.get("phone") as string) || null;
  const igUsername = form.get("ig_username") as string;
  const gigId = form.get("gig_id") as string;
  const url = form.get("url") as string;
  const platform = form.get("platform") as string;
  const caption = (form.get("caption") as string) || null;
  const djName = (form.get("dj_name") as string) || null;

  if (!name?.trim()) return c.json({ error: "Name is required" }, 400);
  if (!email?.trim()) return c.json({ error: "Email is required" }, 400);
  if (!igUsername?.trim()) return c.json({ error: "Handle is required" }, 400);
  if (!gigId) return c.json({ error: "Event selection required" }, 400);
  if (!platform) return c.json({ error: "Platform is required" }, 400);
  if (!url?.trim()) return c.json({ error: "Post URL is required" }, 400);

  const urlPattern = /^https?:\/\/.+/;
  if (!urlPattern.test(url)) {
    return c.json({ error: "Invalid URL format" }, 400);
  }

  // Validate video URL format
  if (platform === "tiktok" && !url.match(/tiktok\.com\/((@[^\/]+\/video\/)|t\/)/i)) {
    return c.json({ error: "TikTok link must be a video (e.g. tiktok.com/@user/video/... or tiktok.com/t/...)" }, 400);
  }
  if (platform === "instagram" && !url.match(/instagram\.com\/(reel\/|reels\/|p\/|[^\/]+\/(reel|reels|p)\/)/i)) {
    return c.json({ error: "Instagram link must be a reel or post (e.g. instagram.com/reel/... or /p/...)" }, 400);
  }

  try {
    const filename = `rally-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const mimeType = "video/mp4";

    // Insert submission with status='processing' — no public_url yet
    const result = db.prepare(`
      INSERT INTO submissions (name, email, phone, ig_username, gig_id, filename, original_filename, mime_type, file_size, caption, dj_name, platform, source_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name.trim(),
      email?.trim() || null,
      phone?.trim() || "",
      igUsername.trim().replace(/^@/, ""),
      parseInt(gigId),
      filename,
      filename,
      mimeType,
      0,
      caption?.trim() || null,
      djName?.trim() || null,
      platform,
      url,
      "processing"
    );

    const submissionId = Number(result.lastInsertRowid);

    // Fire off Rally API in the background — don't await
    fireRallyFetch(submissionId, url).catch((err) => {
      console.error(`[Rally] Failed to initiate fetch for submission ${submissionId}:`, err);
      db.prepare("UPDATE submissions SET status = 'failed' WHERE id = ?").run(submissionId);
    });

    return c.json({ success: true, id: submissionId, status: "processing" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Submission] DB error:", msg);
    return c.json({ error: "Failed to save submission" }, 500);
  }
});

async function fireRallyFetch(submissionId: number, socialUrl: string) {
  const webhookUrl = `${WEBHOOK_BASE_URL}/api/webhook/rally?submission_id=${submissionId}`;

  console.log(`[Rally] Initiating fetch for submission ${submissionId}: ${socialUrl}`);
  console.log(`[Rally] Webhook URL: ${webhookUrl}`);

  const res = await fetch(RALLY_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: socialUrl,
      webhookUrl,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Rally API returned ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json() as any;
  const jobId = data?.jobId;

  if (jobId) {
    db.prepare("UPDATE submissions SET rally_job_id = ? WHERE id = ?").run(jobId, submissionId);
    console.log(`[Rally] Job ${jobId} created for submission ${submissionId}`);
  } else {
    console.warn(`[Rally] No jobId in response for submission ${submissionId}:`, JSON.stringify(data));
  }
}

submissions.get("/", (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);
  const rows = db.prepare(`
    SELECT s.id, s.name, s.email, s.phone, s.ig_username, s.gig_id, s.filename, s.original_filename, s.mime_type, s.file_size, s.approved, s.dropbox_path, s.dropbox_synced, s.created_at, s.thumbnail, s.view_count, s.caption, s.dj_name, s.public_url, s.status, s.rally_job_id, s.source_url, s.platform, g.name as gig_name
    FROM submissions s
    JOIN gigs g ON s.gig_id = g.id
    ORDER BY s.created_at DESC
  `).all();
  return c.json(rows);
});

submissions.patch("/:id", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  const body = await c.req.json();
  if (body.approved !== undefined) {
    db.prepare("UPDATE submissions SET approved = ? WHERE id = ?").run(body.approved ? 1 : 0, parseInt(id));
  }
  if (body.caption !== undefined) {
    db.prepare("UPDATE submissions SET caption = ? WHERE id = ?").run(body.caption?.trim() || null, parseInt(id));
  }
  return c.json({ success: true });
});

submissions.delete("/:id", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);
  const id = parseInt(c.req.param("id"));
  const sub = db.prepare("SELECT filename, thumbnail FROM submissions WHERE id = ?").get(id) as any;
  if (!sub) return c.json({ error: "Not found" }, 404);

  if (sub.thumbnail) {
    try {
      const thumbPath = path.join(THUMBNAILS_DIR, sub.thumbnail);
      const thumbFile = Bun.file(thumbPath);
      if (await thumbFile.exists()) {
        const { unlink } = await import("fs/promises");
        await unlink(thumbPath);
      }
    } catch (err) {
      console.error("[Delete] Failed to remove thumbnail:", err);
    }
  }

  db.prepare("DELETE FROM views WHERE submission_id = ?").run(id);
  db.prepare("DELETE FROM submissions WHERE id = ?").run(id);

  return c.json({ success: true });
});

export default submissions;
