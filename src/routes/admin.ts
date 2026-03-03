import { Hono } from "hono";
import db from "../lib/db";
import { adminSettingsPage } from "../pages/admin-settings";
import { loginAdmin, logoutAdmin } from "../lib/auth";
import path from "path";
import { UPLOAD_DIR } from "../lib/paths";
import { unlink } from "fs/promises";

const admin = new Hono();

// Login endpoint
admin.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const { passcode } = body;

    if (!passcode) {
      return c.json({ error: "Passcode required" }, 400);
    }

    console.log("[Login] Attempting login with passcode length:", passcode.length);
    const success = loginAdmin(c, passcode);
    console.log("[Login] Login success:", success);

    if (success) {
      return c.json({ success: true });
    }

    return c.json({ error: "Invalid passcode" }, 401);
  } catch (err) {
    console.error("[Login] Error:", err);
    return c.json({ error: "Login failed: " + (err instanceof Error ? err.message : String(err)) }, 500);
  }
});

// Logout endpoint
admin.post("/logout", (c) => {
  logoutAdmin(c);
  return c.json({ success: true });
});

// Get current settings (API endpoint for JSON data)
admin.get("/settings", (c) => {
  const settings = db.prepare("SELECT * FROM site_settings WHERE id = 1").get() as any;
  return c.json(settings || {
    logo_path: "/hoang-logo.png",
    subtext: "Hoang Memories",
    show_subtext: 1,
    share_button_text: "+ Share Memories",
    disclaimer_short: "By submitting content to this site, you agree that your content may be used by Clouted for organic content, ads and promo campaigns. This is a fan-run community service and is not officially associated with or endorsed by the artist or their team.",
    disclaimer_long: "By submitting, you agree that your content may be used by Clouted for organic content, ads and promo campaigns. This is a fan-run community service and is not officially associated with or endorsed by the artist or their team.",
    bg_color: "#000000",
    bg_video_url: "/Looped-Album-Symbol-Main-Piece.webm",
    bg_video_size: "cover",
    share_button_bg_color: "transparent",
    share_button_border_radius: 999,
    button_color: "#ffffff",
    button_border_radius: 4,
    text_color: "#f0f0f0",
    link_color: "#00e5ff",
    disclaimer_text_color: "#777777",
    privacy_agreement_text: "By submitting, you agree that your content may be used by Clouted for organic content, ads and promo campaigns. This is a fan-run community service and is not officially associated with or endorsed by the artist or their team.",
    submission_consent_agreement_text: ""
  });
});

// Update settings
admin.post("/settings", async (c) => {
  const formData = await c.req.formData();
  const subtext = formData.get("subtext") as string;
  const show_subtext = formData.get("show_subtext") === "1" ? 1 : 0;
  const shareButtonText = (formData.get("share_button_text") as string) || "+ Share Memories";
  const disclaimerShort = (formData.get("disclaimer_short") as string) || "";
  const disclaimerLong = (formData.get("disclaimer_long") as string) || "";
  const bgColor = (formData.get("bg_color") as string) || "#000000";
  const bgVideoUrl = (formData.get("bg_video_url") as string) || "/Looped-Album-Symbol-Main-Piece.webm";
  const bgVideoSize = (formData.get("bg_video_size") as string) || "cover";
  const shareButtonBgColor = (formData.get("share_button_bg_color") as string) || "transparent";
  const shareButtonBorderRadius = parseInt((formData.get("share_button_border_radius") as string) || "999");
  const buttonColor = (formData.get("button_color") as string) || "#ffffff";
  const buttonBorderRadius = parseInt((formData.get("button_border_radius") as string) || "4");
  const textColor = (formData.get("text_color") as string) || "#f0f0f0";
  const linkColor = (formData.get("link_color") as string) || "#00e5ff";
  const disclaimerTextColor = (formData.get("disclaimer_text_color") as string) || "#777777";
  const privacyAgreementText = (formData.get("privacy_agreement_text") as string) || "";
  const submissionConsentAgreementText = (formData.get("submission_consent_agreement_text") as string) || "";
  const metaDescription = (formData.get("meta_description") as string) || "Hoang Memories - A fan community showcase";
  const metaThumbnailPath = (formData.get("meta_thumbnail_path") as string) || "/hoang-og.png";
  const metaPageTitle = (formData.get("meta_page_title") as string) || "Hoang - Fan Submissions";
  const logoFile = formData.get("logo") as File | null;

  let logo_path: string | undefined;

  // Handle logo upload
  if (logoFile && logoFile.size > 0) {
    const ext = logoFile.name.split(".").pop() || "png";
    const filename = `logo-${Date.now()}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Save the new logo
    const buffer = await logoFile.arrayBuffer();
    await Bun.write(filepath, buffer);

    logo_path = `/${filename}`;

    // Delete old logo if it's not the default
    const currentSettings = db.prepare("SELECT logo_path FROM site_settings WHERE id = 1").get() as any;
    if (currentSettings && currentSettings.logo_path && currentSettings.logo_path !== "/hoang-logo.png") {
      const oldPath = path.join(UPLOAD_DIR, path.basename(currentSettings.logo_path));
      try {
        await unlink(oldPath);
      } catch (err) {
        console.error("[Admin] Failed to delete old logo:", err);
      }
    }
  }

  // Update database
  if (logo_path) {
    db.prepare(`
      UPDATE site_settings
      SET logo_path = ?, subtext = ?, show_subtext = ?, share_button_text = ?, disclaimer_short = ?, disclaimer_long = ?, bg_color = ?, bg_video_url = ?, bg_video_size = ?, share_button_bg_color = ?, share_button_border_radius = ?, button_color = ?, button_border_radius = ?, text_color = ?, link_color = ?, disclaimer_text_color = ?, privacy_agreement_text = ?, submission_consent_agreement_text = ?, meta_description = ?, meta_thumbnail_path = ?, meta_page_title = ?, updated_at = datetime('now')
      WHERE id = 1
    `).run(logo_path, subtext, show_subtext, shareButtonText, disclaimerShort, disclaimerLong, bgColor, bgVideoUrl, bgVideoSize, shareButtonBgColor, shareButtonBorderRadius, buttonColor, buttonBorderRadius, textColor, linkColor, disclaimerTextColor, privacyAgreementText, submissionConsentAgreementText, metaDescription, metaThumbnailPath, metaPageTitle);
  } else {
    db.prepare(`
      UPDATE site_settings
      SET subtext = ?, show_subtext = ?, share_button_text = ?, disclaimer_short = ?, disclaimer_long = ?, bg_color = ?, bg_video_url = ?, bg_video_size = ?, share_button_bg_color = ?, share_button_border_radius = ?, button_color = ?, button_border_radius = ?, text_color = ?, link_color = ?, disclaimer_text_color = ?, privacy_agreement_text = ?, submission_consent_agreement_text = ?, meta_description = ?, meta_thumbnail_path = ?, meta_page_title = ?, updated_at = datetime('now')
      WHERE id = 1
    `).run(subtext, show_subtext, shareButtonText, disclaimerShort, disclaimerLong, bgColor, bgVideoUrl, bgVideoSize, shareButtonBgColor, shareButtonBorderRadius, buttonColor, buttonBorderRadius, textColor, linkColor, disclaimerTextColor, privacyAgreementText, submissionConsentAgreementText, metaDescription, metaThumbnailPath, metaPageTitle);
  }

  return c.json({ success: true });
});

export default admin;
