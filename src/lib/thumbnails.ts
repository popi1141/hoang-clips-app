import path from "path";
import { existsSync } from "node:fs";
import { THUMBNAILS_DIR } from "./paths";

export async function generateThumbnail(videoPath: string, filename: string, remoteUrl?: string): Promise<string | null> {
  const thumbName = filename.includes('.') 
    ? filename.replace(/\.[^.]+$/, ".jpg")
    : filename + ".jpg";
  const thumbPath = path.join(THUMBNAILS_DIR, thumbName);
  try {
    const proc = Bun.spawn(["ffmpeg", "-i", videoPath, "-ss", "00:00:01", "-vframes", "1", "-vf", "scale=320:-2", "-q:v", "4", "-update", "1", "-y", thumbPath], {
      stdout: "ignore",
      stderr: "ignore",
    });
    await proc.exited;
    if (existsSync(thumbPath)) {
      return thumbName;
    }
  } catch (err) {
    console.error("[Thumbnail] Failed:", err);
  }
  return null;
}

export async function generateThumbnailFromUrl(url: string, filename: string): Promise<string | null> {
  const thumbName = filename.includes('.') 
    ? filename.replace(/\.[^.]+$/, ".jpg")
    : filename + ".jpg";
  const thumbPath = path.join(THUMBNAILS_DIR, thumbName);
  try {
    const proc = Bun.spawn([
      "ffmpeg", "-ss", "1", "-i", url,
      "-vframes", "1", "-vf", "scale=320:-2", "-q:v", "4", "-update", "1", "-y", thumbPath
    ], {
      stdout: "ignore",
      stderr: "pipe",
    });
    await proc.exited;
    if (existsSync(thumbPath)) {
      return thumbName;
    }
    const stderr = await new Response(proc.stderr).text();
    console.error("[Thumbnail URL] ffmpeg stderr:", stderr.slice(-200));
  } catch (err) {
    console.error("[Thumbnail URL] Failed:", err);
  }
  return null;
}
