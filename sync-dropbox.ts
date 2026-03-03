#!/usr/bin/env bun
import { Database } from "bun:sqlite";
import path from "path";

const DB_PATH = path.join(import.meta.dir, "data", "clips.db");
const db = new Database(DB_PATH);

const ZO_TOKEN = process.env.ZO_CLIENT_IDENTITY_TOKEN;
if (!ZO_TOKEN) {
  console.error("[Dropbox Sync] Missing ZO_CLIENT_IDENTITY_TOKEN");
  process.exit(1);
}

const MODEL = "byok:5cd65342-d433-459f-984d-e2401fffe6bf";

interface PendingSub {
  id: number;
  filename: string;
  original_filename: string;
  gig_name: string;
  dropbox_synced: number;
}

async function syncAll() {
  const pending = db.prepare(`
    SELECT s.id, s.filename, s.original_filename, g.name as gig_name, s.dropbox_synced
    FROM submissions s
    JOIN gigs g ON s.gig_id = g.id
    WHERE s.dropbox_synced = 0
  `).all() as PendingSub[];

  if (!pending.length) {
    console.log("[Dropbox Sync] No pending uploads");
    return;
  }

  console.log(`[Dropbox Sync] ${pending.length} files to upload`);

  for (const sub of pending) {
    const localPath = path.join(import.meta.dir, "uploads", sub.filename);
    const tmpPath = `/tmp/${sub.filename}`;

    const file = Bun.file(localPath);
    if (!(await file.exists())) {
      console.log(`[Dropbox Sync] Skip missing file: ${sub.filename}`);
      continue;
    }

    await Bun.write(tmpPath, file);

    const prompt = `Upload a file to Dropbox using the dropbox upload tool. 
Use the account email: justin@clouted.com

Tool: dropbox-upload-file
Parameters:
- path: "Hoang Clips/${sub.gig_name}"
- name: "${sub.original_filename}"
- filePath: "${tmpPath}"
- autorename: true
- mute: true

Just do the upload and confirm it worked. If it fails, say "FAILED" with the error.`;

    try {
      console.log(`[Dropbox Sync] Uploading ${sub.original_filename} -> Hoang Clips/${sub.gig_name}/`);
      
      const res = await fetch("https://api.zo.computer/zo/ask", {
        method: "POST",
        headers: {
          authorization: ZO_TOKEN,
          "content-type": "application/json",
        },
        body: JSON.stringify({ input: prompt, model_name: MODEL }),
      });

      const result = await res.json();
      const output = (result as any).output || "";

      if (output.includes("FAILED")) {
        console.error(`[Dropbox Sync] Failed: ${sub.filename} - ${output}`);
      } else {
        db.prepare("UPDATE submissions SET dropbox_synced = 1, dropbox_path = ? WHERE id = ?")
          .run(`/Hoang Clips/${sub.gig_name}/${sub.original_filename}`, sub.id);
        console.log(`[Dropbox Sync] Done: ${sub.original_filename}`);
      }
    } catch (err) {
      console.error(`[Dropbox Sync] Error uploading ${sub.filename}:`, err);
    }
  }
}

syncAll().then(() => {
  console.log("[Dropbox Sync] Complete");
  process.exit(0);
});
