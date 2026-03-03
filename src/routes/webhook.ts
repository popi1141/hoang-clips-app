import { Hono } from "hono";
import db from "../lib/db";
import { syncToDropbox } from "../lib/dropbox";
import { generateThumbnailFromUrl } from "../lib/thumbnails";

const webhook = new Hono();

webhook.post("/rally", async (c) => {
  const submissionId = c.req.query("submission_id");

  let body: any;
  try {
    body = await c.req.json();
  } catch {
    console.error("[Webhook] Failed to parse body");
    return c.json({ error: "Invalid JSON" }, 400);
  }

  console.log(`[Webhook] Rally callback received:`, JSON.stringify(body));
  console.log(`[Webhook] submission_id from query: ${submissionId}`);

  const { job_id, public_url, success } = body;

  if (!submissionId) {
    console.error("[Webhook] No submission_id in query params");
    return c.json({ error: "Missing submission_id" }, 400);
  }

  const sub = db.prepare("SELECT id, gig_id, filename, dj_name, status FROM submissions WHERE id = ?").get(parseInt(submissionId)) as any;

  if (!sub) {
    console.error(`[Webhook] Submission ${submissionId} not found`);
    return c.json({ error: "Submission not found" }, 404);
  }

  if (!success) {
    console.error(`[Webhook] Rally job failed for submission ${submissionId}`);
    db.prepare("UPDATE submissions SET status = 'failed' WHERE id = ?").run(sub.id);
    return c.json({ received: true, status: "failed" });
  }

  if (!public_url) {
    console.error(`[Webhook] No public_url in callback for submission ${submissionId}`);
    db.prepare("UPDATE submissions SET status = 'failed' WHERE id = ?").run(sub.id);
    return c.json({ received: true, status: "failed" });
  }

  // Update submission with public_url and mark as ready
  db.prepare("UPDATE submissions SET public_url = ?, status = 'ready' WHERE id = ?").run(public_url, sub.id);
  console.log(`[Webhook] Submission ${submissionId} updated with public_url: ${public_url}`);

  // Generate thumbnail from the remote video URL in background
  generateThumbnailFromUrl(public_url, sub.filename).then((thumbName) => {
    if (thumbName) {
      db.prepare("UPDATE submissions SET thumbnail = ? WHERE id = ?").run(thumbName, sub.id);
      console.log(`[Webhook] Thumbnail generated for submission ${submissionId}: ${thumbName}`);
    }
  }).catch((err) => {
    console.error(`[Webhook] Thumbnail generation failed for submission ${submissionId}:`, err);
  });

  // Trigger Dropbox sync in background
  syncToDropbox(sub.id, sub.filename, public_url, sub.gig_id, sub.dj_name).catch((err) => {
    console.error(`[Webhook] Dropbox sync failed for submission ${submissionId}:`, err);
  });

  return c.json({ received: true, status: "ready" });
});

export default webhook;
