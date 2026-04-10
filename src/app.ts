import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { getCookie } from "hono/cookie";
import path from "path";
import { ensureDirs } from "./lib/paths";
import { galleryPage } from "./pages/gallery";
import { termsPage } from "./pages/terms";
import { adminPage } from "./pages/admin";
import { adminSettingsPage } from "./pages/admin-settings";
import db from "./lib/db";
import gigsRoutes from "./routes/gigs";
import submissionsRoutes from "./routes/submissions";
import adminRoutes from "./routes/admin";
import galleryRoutes from "./routes/gallery";
import filesRoutes from "./routes/files";
import webhookRoutes from "./routes/webhook";
import metaRoutes from "./routes/meta";

await ensureDirs();

const app = new Hono();

// Serve static files from project root (src is one level up from project root)
const projectRoot = path.join(import.meta.dir, "..");
app.use("/uploads/*", serveStatic({ root: projectRoot }));
app.use("/public/*", serveStatic({ root: projectRoot }));

// Serve logo files (both default and uploaded)
app.get("/hoang-logo.png", async (c) => {
  const file = Bun.file(path.join(projectRoot, "uploads/hoang-logo.png"));
  if (await file.exists()) {
    return new Response(file.stream(), { headers: { "Content-Type": "image/png" } });
  }
  return c.notFound();
});

app.get("/hoang-og.png", async (c) => {
  const file = Bun.file(path.join(projectRoot, "uploads/hoang-og.png"));
  if (await file.exists()) {
    return new Response(file.stream(), { headers: { "Content-Type": "image/png" } });
  }
  return c.notFound();
});

app.get("/logo-*.png", async (c) => {
  const filename = c.req.path.split("/").pop();
  const file = Bun.file(path.join(projectRoot, "uploads", filename || ""));
  if (await file.exists()) {
    return new Response(file.stream(), { headers: { "Content-Type": "image/png" } });
  }
  return c.notFound();
});

app.get("/Looped-Album-Symbol-Main-Piece.webm", async (c) => {
  const file = Bun.file(path.join(projectRoot, "public/Looped-Album-Symbol-Main-Piece.webm"));
  if (await file.exists()) {
    return new Response(file.stream(), { headers: { "Content-Type": "video/webm" } });
  }
  return c.notFound();
});

app.get("/hoang-hero-background.mp4", async (c) => {
  const file = Bun.file(path.join(projectRoot, "public/hoang-hero-background.mp4"));
  if (await file.exists()) {
    return new Response(file.stream(), { headers: { "Content-Type": "video/mp4" } });
  }
  return c.notFound();
});

app.get("/hoang-icon.svg", async (c) => {
  const file = Bun.file(path.join(projectRoot, "public/hoang-icon.svg"));
  if (await file.exists()) {
    return new Response(file.stream(), { headers: { "Content-Type": "image/svg+xml" } });
  }
  return c.notFound();
});

app.route("/api/gigs", gigsRoutes);
app.route("/api/submissions", submissionsRoutes);
app.route("/api/admin", adminRoutes);
app.route("/api/gallery", galleryRoutes);
app.route("/api/meta", metaRoutes);
app.route("/api", filesRoutes);
app.route("/api/webhook", webhookRoutes);

// Admin settings page
app.get("/admin/settings", (c) => {
  const authed = getCookie(c, "admin_auth") === "1";
  if (!authed) {
    return c.redirect("/admin");
  }
  return c.html(adminSettingsPage());
});

app.get("/", (c) => {
  // Load site settings from database
  const settings = db.prepare("SELECT * FROM site_settings WHERE id = 1").get() as any;
  return c.html(galleryPage(settings || {
    logo_path: "/hoang-logo.png",
    subtext: "Hoang Memories",
    show_subtext: 1
  }));
});

app.get("/terms", (c) => {
  // Load site settings from database
  const settings = db.prepare("SELECT * FROM site_settings WHERE id = 1").get() as any;
  return c.html(termsPage(settings || {
    logo_path: "/hoang-logo.png",
    submission_consent_agreement_text: ""
  }));
});

app.get("/admin", (c) => {
  const authed = getCookie(c, "admin_auth") === "1";
  return c.html(adminPage(authed));
});

export default app;
