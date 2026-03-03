import { Database } from "bun:sqlite";
import path from "path";
import { mkdirSync } from "fs";

const DATA_DIR = path.join(import.meta.dir, "..", "..", "data");
mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, "clips.db");
const db = new Database(DB_PATH, { create: true });

db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS gigs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    gig_date TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    ig_username TEXT NOT NULL,
    gig_id INTEGER NOT NULL REFERENCES gigs(id),
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    approved INTEGER DEFAULT 0,
    dropbox_path TEXT,
    dropbox_synced INTEGER DEFAULT 0,
    thumbnail TEXT,
    view_count INTEGER DEFAULT 0,
    caption TEXT,
    dj_name TEXT,
    platform TEXT,
    source_url TEXT,
    public_url TEXT,
    rally_job_id TEXT,
    status TEXT DEFAULT 'ready',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL REFERENCES submissions(id),
    viewer_ip TEXT NOT NULL,
    viewed_at TEXT DEFAULT (datetime('now')),
    UNIQUE(submission_id, viewer_ip)
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    logo_path TEXT DEFAULT '/hoang-logo.png',
    subtext TEXT DEFAULT 'Hoang Memories',
    show_subtext INTEGER DEFAULT 1,
    share_button_text TEXT DEFAULT '+ Share Memories',
    disclaimer_short TEXT DEFAULT 'By submitting content to this site, you agree that your content may be used by Clouted for organic content, ads and promo campaigns. This is a fan-run community service and is not officially associated with or endorsed by the artist or their team.',
    disclaimer_long TEXT DEFAULT 'By submitting, you agree that your content may be used by Clouted for organic content, ads and promo campaigns. This is a fan-run community service and is not officially associated with or endorsed by the artist or their team.',
    bg_color TEXT DEFAULT '#000000',
    bg_video_url TEXT DEFAULT '/Looped-Album-Symbol-Main-Piece.webm',
    button_color TEXT DEFAULT '#ffffff',
    button_border_radius INTEGER DEFAULT 4,
    text_color TEXT DEFAULT '#f0f0f0',
    link_color TEXT DEFAULT '#00e5ff',
    disclaimer_text_color TEXT DEFAULT '#777777',
    privacy_agreement_text TEXT DEFAULT 'By submitting, you agree that your content may be used by Clouted for organic content, ads and promo campaigns. This is a fan-run community service and is not officially associated with or endorsed by the artist or their team.',
    submission_consent_agreement_text TEXT DEFAULT '# Photo Wall Submission – Content Consent & Data Use Agreement\n\nBy submitting your Instagram/TikTok post to the Hoang Memories page, you (\"Submitter\") agree to the following terms:\n\n## 1. Content License\n\nYou grant Clouted and their respective affiliates, partners, and clients a non-exclusive, royalty-free, worldwide, perpetual license to use, reproduce, distribute, display, and adapt your submitted content (including your username and likeness where applicable) for any purpose, including but not limited to:\n\n- Paid advertising campaigns across any digital platform (Meta, TikTok, YouTube, etc.)\n- Organic social media content and brand storytelling\n- Promotional materials across affiliate and partner channels\n\nYou represent that you own or have the right to submit the content, and that its use as described above does not infringe on any third-party rights.\n\n## 2. Data Collection & Internal Analytics\n\nBy submitting, you acknowledge that information associated with your submission — including your Instagram handle, post metadata, and submission activity — may be collected and used for internal business analytics, campaign performance tracking, and audience insights. This data will not be sold to third parties.\n\n## 3. Photo Wall Featuring\n\nSubmission does not guarantee your post will be featured on the public Photo Wall. All submissions are subject to review and approval.\n\n## 4. Withdrawal\n\nYou may request removal of your content from active use by contacting support@clouted.com. Note that content already published in paid campaigns may not be retroactively removable.\n\n## 5. Acknowledgment\n\nBy clicking \"Submit,\" you confirm you have read and agree to these terms and are at least 18 years of age (or have obtained parental consent if under 18).\n\n## ⚠️ Important Notice\n\nThis is a fan-run, community service and is not officially associated with or endorsed by the artist, their management, or their team. This platform is operated independently by fans and Clouted.\n\nLast Updated: February 27, 2025',
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

// Run migrations for existing databases
try { db.exec("ALTER TABLE gigs ADD COLUMN gig_date TEXT"); } catch {}
try { db.exec("ALTER TABLE gigs ADD COLUMN sort_order INTEGER DEFAULT 0"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN meta_thumbnail_path TEXT DEFAULT '/hoang-og.png'"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN meta_description TEXT DEFAULT 'Hoang Memories - A fan community showcase'"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN meta_page_title TEXT DEFAULT 'Hoang - Fan Submissions'"); } catch {}
try { db.exec("ALTER TABLE submissions ADD COLUMN public_url TEXT"); } catch {}
try { db.exec("ALTER TABLE submissions ADD COLUMN rally_job_id TEXT"); } catch {}
try { db.exec("ALTER TABLE submissions ADD COLUMN status TEXT DEFAULT 'ready'"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN share_button_text TEXT DEFAULT '+ Share Memories'"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN disclaimer_short TEXT DEFAULT 'By submitting content to this site, you agree that your content may be used by Clouted for organic content, ads and promo campaigns. This is a fan-run community service and is not officially associated with or endorsed by the artist or their team.'"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN disclaimer_long TEXT DEFAULT 'By submitting, you agree that your content may be used by Clouted for organic content, ads and promo campaigns. This is a fan-run community service and is not officially associated with or endorsed by the artist or their team.'"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN bg_color TEXT DEFAULT '#000000'"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN bg_video_url TEXT DEFAULT '/Looped-Album-Symbol-Main-Piece.webm'"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN button_color TEXT DEFAULT '#ffffff'"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN button_border_radius INTEGER DEFAULT 4"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN text_color TEXT DEFAULT '#f0f0f0'"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN link_color TEXT DEFAULT '#00e5ff'"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN disclaimer_text_color TEXT DEFAULT '#777777'"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN privacy_agreement_text TEXT DEFAULT 'By submitting, you agree that your content may be used by Clouted for organic content, ads and promo campaigns. This is a fan-run community service and is not officially associated with or endorsed by the artist or their team.'"); } catch {}
try { db.exec("ALTER TABLE site_settings ADD COLUMN submission_consent_agreement_text TEXT"); } catch {}

// Insert default settings if not exists
db.prepare(`
  INSERT OR IGNORE INTO site_settings (id, logo_path, subtext, show_subtext, share_button_text, disclaimer_short, disclaimer_long, bg_color, bg_video_url, button_color, button_border_radius, text_color, link_color, disclaimer_text_color, privacy_agreement_text, submission_consent_agreement_text)
  VALUES (1, '/hoang-logo.png', 'Hoang Memories', 1, '+ Share Memories', 'By submitting content to this site, you agree that your content may be used by Clouted for organic content, ads and promo campaigns. This is a fan-run community service and is not officially associated with or endorsed by the artist or their team.', 'By submitting, you agree that your content may be used by Clouted for organic content, ads and promo campaigns. This is a fan-run community service and is not officially associated with or endorsed by the artist or their team.', '#000000', '/Looped-Album-Symbol-Main-Piece.webm', '#ffffff', 4, '#f0f0f0', '#00e5ff', '#777777', 'By submitting, you agree that your content may be used by Clouted for organic content, ads and promo campaigns. This is a fan-run community service and is not officially associated with or endorsed by the artist or their team.', '# Photo Wall Submission – Content Consent & Data Use Agreement

By submitting your Instagram/TikTok post to the Hoang Memories page, you ("Submitter") agree to the following terms:

## 1. Content License

You grant Clouted and their respective affiliates, partners, and clients a non-exclusive, royalty-free, worldwide, perpetual license to use, reproduce, distribute, display, and adapt your submitted content (including your username and likeness where applicable) for any purpose, including but not limited to:

- Paid advertising campaigns across any digital platform (Meta, TikTok, YouTube, etc.)
- Organic social media content and brand storytelling
- Promotional materials across affiliate and partner channels

You represent that you own or have the right to submit the content, and that its use as described above does not infringe on any third-party rights.

## 2. Data Collection & Internal Analytics

By submitting, you acknowledge that information associated with your submission — including your Instagram handle, post metadata, and submission activity — may be collected and used for internal business analytics, campaign performance tracking, and audience insights. This data will not be sold to third parties.

## 3. Photo Wall Featuring

Submission does not guarantee your post will be featured on the public Photo Wall. All submissions are subject to review and approval.

## 4. Withdrawal

You may request removal of your content from active use by contacting support@clouted.com. Note that content already published in paid campaigns may not be retroactively removable.

## 5. Acknowledgment

By clicking "Submit," you confirm you have read and agree to these terms and are at least 18 years of age (or have obtained parental consent if under 18).

## ⚠️ Important Notice

This is a fan-run, community service and is not officially associated with or endorsed by the artist, their management, or their team. This platform is operated independently by fans and Clouted.

Last Updated: February 27, 2025')
`).run();

// Clean up old seed data if no submissions reference it
db.prepare("DELETE FROM gigs WHERE name = 'Hoang Tour 2026' AND id NOT IN (SELECT DISTINCT gig_id FROM submissions)").run();

export default db;
