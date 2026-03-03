import path from "path";
import { mkdir } from "fs/promises";

const ROOT_DIR = path.join(import.meta.dir, "..", "..");

export const UPLOAD_DIR = path.join(ROOT_DIR, "uploads");
export const THUMBNAILS_DIR = path.join(ROOT_DIR, "uploads", "thumbs");

export async function ensureDirs() {
  await mkdir(UPLOAD_DIR, { recursive: true });
  await mkdir(THUMBNAILS_DIR, { recursive: true });
}
