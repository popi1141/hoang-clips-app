#!/usr/bin/env bun
import { Database } from "bun:sqlite";
import path from "path";
import { existsSync } from "fs";

const DATA_DIR = path.join(import.meta.dir, "..", "data");
const DB_PATH = path.join(DATA_DIR, "clips.db");
const THUMBNAILS_DIR = path.join(import.meta.dir, "..", "uploads", "thumbs");

const db = new Database(DB_PATH);

interface Submission {
  id: number;
  filename: string;
  thumbnail: string | null;
  public_url: string;
  status: string;
}

async function generateThumbnailFromUrl(url: string, filename: string): Promise<string | null> {
  // Ensure filename has an extension for proper replacement, or just append .jpg
  const thumbName = filename.includes('.') 
    ? filename.replace(/\.[^.]+$/, ".jpg")
    : filename + ".jpg";
  const thumbPath = path.join(THUMBNAILS_DIR, thumbName);
  
  console.log(`  Generating thumbnail for ${filename}...`);
  console.log(`  URL: ${url}`);
  console.log(`  Output: ${thumbPath}`);
  
  try {
    const proc = Bun.spawn([
      "ffmpeg", "-ss", "1", "-i", url,
      "-vframes", "1", "-vf", "scale=320:-2", "-q:v", "4", "-update", "1", "-y", thumbPath
    ], {
      stdout: "pipe",
      stderr: "pipe",
    });
    
    const exitCode = await proc.exited;
    
    if (exitCode !== 0) {
      const stderr = await new Response(proc.stderr).text();
      console.error(`  ❌ ffmpeg failed with exit code ${exitCode}`);
      console.error(`  stderr: ${stderr.slice(-300)}`);
      return null;
    }
    
    if (existsSync(thumbPath)) {
      console.log(`  ✅ Thumbnail created: ${thumbName}`);
      return thumbName;
    } else {
      console.error(`  ❌ Thumbnail file not created`);
      return null;
    }
  } catch (err) {
    console.error(`  ❌ Error:`, err);
    return null;
  }
}

async function main() {
  console.log("🔍 Finding submissions without thumbnails...\n");
  
  const submissions = db.prepare(`
    SELECT id, filename, thumbnail, public_url, status 
    FROM submissions 
    WHERE (thumbnail IS NULL OR thumbnail = '') AND public_url IS NOT NULL AND status = 'ready'
  `).all() as Submission[];
  
  if (submissions.length === 0) {
    console.log("✨ All submissions already have thumbnails!");
    return;
  }
  
  console.log(`Found ${submissions.length} submission(s) without thumbnails:\n`);
  
  for (const sub of submissions) {
    console.log(`📹 Submission #${sub.id}`);
    
    const thumbName = await generateThumbnailFromUrl(sub.public_url, sub.filename);
    
    if (thumbName) {
      db.prepare("UPDATE submissions SET thumbnail = ? WHERE id = ?").run(thumbName, sub.id);
      console.log(`  💾 Database updated\n`);
    } else {
      console.log(`  ⚠️  Failed to generate thumbnail\n`);
    }
  }
  
  console.log("✅ Done!");
}

main().catch(console.error);
