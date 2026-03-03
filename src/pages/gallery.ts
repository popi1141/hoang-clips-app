import { getCommonHead } from "./shared";

interface SiteSettings {
  logo_path: string;
  subtext: string;
  show_subtext: number;
  share_button_text: string;
  disclaimer_short: string;
  disclaimer_long: string;
  bg_color: string;
  bg_video_url: string;
  bg_video_size: string;
  share_button_bg_color: string;
  share_button_border_radius: number;
  button_color: string;
  button_border_radius: number;
  text_color: string;
  link_color: string;
  disclaimer_text_color: string;
  privacy_agreement_text: string;
  meta_thumbnail_path?: string;
  meta_description?: string;
  meta_page_title?: string;
}

export function galleryPage(settings: SiteSettings): string {
  const bgColor = settings.bg_color || '#000000';
  const bgVideoUrl = settings.bg_video_url || '/Looped-Album-Symbol-Main-Piece.webm';
  const bgVideoSize = settings.bg_video_size || 'cover';
  const shareButtonBgColor = settings.share_button_bg_color || 'transparent';
  const shareButtonBorderRadius = settings.share_button_border_radius ?? 999;
  const buttonColor = settings.button_color || '#ffffff';
  const buttonBorderRadius = settings.button_border_radius || 4;
  const textColor = settings.text_color || '#f0f0f0';
  const linkColor = settings.link_color || '#00e5ff';
  const disclaimerTextColor = settings.disclaimer_text_color || '#777777';
  const privacyAgreement = settings.privacy_agreement_text || settings.disclaimer_long;
  const metaThumbnail = settings.meta_thumbnail_path || '/hoang-og.png';
  const metaDescription = settings.meta_description || 'Hoang Memories - A fan community showcase';
  const metaPageTitle = settings.meta_page_title || 'Hoang - Fan Submissions';

  return `<!DOCTYPE html>
<html lang="en">
<head>
${getCommonHead(settings.logo_path)}
<title>${metaPageTitle}</title>
<meta name="description" content="${metaDescription}">
<meta property="og:title" content="${metaPageTitle}">
<meta property="og:description" content="${metaDescription}">
<meta property="og:image" content="${metaThumbnail}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${metaPageTitle}">
<meta name="twitter:description" content="${metaDescription}">
<meta name="twitter:image" content="${metaThumbnail}">
<style>
  :root {
    --black: ${bgColor};
    --white: ${textColor};
    --accent: ${linkColor};
    --accent-glow: ${linkColor}26;
    --accent2: #7c3aed;
    --gray: ${disclaimerTextColor};
    --card-bg: #111;
    --border: #252525;
    --button-color: ${buttonColor};
    --button-radius: ${buttonBorderRadius}px;
  }

  [data-theme="light"] {
    --black: #f5f5f5;
    --white: #0a0a0a;
    --accent: #0097a7;
    --accent-glow: rgba(0, 151, 167, 0.1);
    --accent2: #6d28d9;
    --gray: #666;
    --card-bg: #ffffff;
    --border: #ddd;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: 'Nexa', sans-serif;
    min-height: 100vh;
  }

  .video-bg {
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: -2; ${bgVideoSize === '488px' ? 'width: 488px; height: 488px;' : 'width: 100vw; height: 100vh;'} object-fit: ${bgVideoSize === '488px' ? 'cover' : bgVideoSize}; opacity: 0.3;
  }

  .noise {
    position: fixed; inset: 0; z-index: -1; pointer-events: none; opacity: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 256px;
  }

  .layout {
    position: relative; z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px 80px;
  }

  .header { text-align: center; margin-bottom: 40px; }

  .header .brand {
    max-width: 300px;
    margin: 0 auto;
  }

  .header .brand img {
    width: 100%;
    height: auto;
    display: block;
  }

  .header .sub {
    font-family: 'Nexa', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 4px;
    color: #000000;
    background: var(--button-color);
    display: inline-block;
    padding: 6px 16px;
    border-radius: var(--button-radius);
    margin-top: 8px;
  }

  .header-actions { text-align: center; margin-top: 20px; }

  .submit-btn {
    background: ${shareButtonBgColor};
    color: var(--button-color);
    border: 3px solid var(--button-color);
    border-radius: ${shareButtonBorderRadius}px;
    padding: 14px 32px;
    font-family: 'Nexa', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .submit-btn:hover { background: var(--button-color); color: #000000; transform: scale(0.95); }

  .controls-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin: 24px 0 36px 0;
    flex-wrap: wrap;
  }

  .filter-control, .sort-control { display: flex; align-items: center; gap: 8px; }

  .filter-label, .sort-label {
    font-family: 'Nexa', sans-serif;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--button-color);
  }

  .event-select, .sort-select {
    background: var(--card-bg);
    border: 1px solid var(--border);
    color: var(--button-color);
    padding: 8px 14px;
    border-radius: 20px;
    font-family: 'Nexa', sans-serif;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23ffffff' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }

  .event-select:hover, .sort-select:hover { border-color: var(--white); color: var(--white); }
  .event-select option, .sort-select option { background: var(--black); color: var(--white); }

  .gallery {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  @keyframes float {
    0%, 100% { transform: rotate(var(--rot, 0deg)) translateY(0px); }
    50% { transform: rotate(var(--rot, 0deg)) translateY(-12px); }
  }

  .polaroid {
    background: var(--white);
    border-radius: var(--button-radius);
    padding: 12px 12px 0 12px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.2);
    animation: float 6s ease-in-out infinite;
    cursor: pointer;
    position: relative;
  }

  .polaroid:hover {
    animation: none;
    transform: rotate(0deg) scale(1.02);
    box-shadow: 0 8px 40px ${linkColor}33;
    z-index: 10;
  }

  .polaroid-media {
    position: relative;
    width: 100%;
    aspect-ratio: 9/16;
    border-radius: calc(var(--button-radius) / 2);
    overflow: hidden;
    background: #222;
  }

  .polaroid-media video, .polaroid-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .polaroid-media img { position: absolute; inset: 0; transition: opacity 0.3s; }
  .polaroid-media video { position: relative; z-index: 1; }

  .go-to-post-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.8);
    color: var(--button-color);
    border: 1px solid var(--button-color);
    border-radius: var(--button-radius);
    padding: 6px 12px;
    font-family: 'Nexa', sans-serif;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    z-index: 5;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .polaroid:hover .go-to-post-btn {
    opacity: 1;
  }

  .go-to-post-btn:hover {
    background: var(--button-color);
    color: #000000;
    transform: scale(1.05);
  }

  .polaroid-footer { padding: 14px 4px 16px; }

  .polaroid-ig {
    font-family: 'Nexa', sans-serif;
    font-size: 0.7rem;
    color: var(--black);
    text-decoration: none;
    font-weight: 700;
  }
  .polaroid-ig:hover { color: #555; }

  .polaroid-event {
    font-family: 'Nexa', sans-serif;
    font-size: 0.6rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: block;
    margin-top: 4px;
  }

  .polaroid-views { font-size: 0.5rem; padding: 2px 6px; }

  .polaroid-caption {
    font-family: 'Nexa', sans-serif;
    font-size: 0.75rem;
    color: #555;
    margin-top: 6px;
    line-height: 1.3;
    font-style: italic;
  }

  .empty-state { text-align: center; padding: 80px 20px; color: #444; grid-column: 1 / -1; }
  .empty-state .icon { width: 80px; height: 80px; margin: 0 auto 16px; }
  .empty-state-btn {
    display: inline-block;
    background: var(--button-color);
    color: #000000;
    border: none;
    border-radius: 999px var(--button-radius) 999px var(--button-radius);
    padding: 12px 28px;
    font-family: 'Nexa', sans-serif;
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: default;
  }

  .disclaimer-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.92);
    z-index: 300;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .disclaimer-overlay.active { display: flex; }
  .disclaimer-box {
    background: var(--black);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 36px 32px;
    max-width: 500px;
    width: 100%;
    text-align: center;
  }
  .disclaimer-box h2 {
    font-family: 'Nexa', sans-serif;
    font-weight: 700;
    font-size: 1.2rem;
    margin-bottom: 16px;
    color: var(--white);
  }
  .disclaimer-box p {
    font-family: 'Nexa', sans-serif;
    font-size: 0.85rem;
    color: var(--gray);
    line-height: 1.6;
    margin-bottom: 24px;
  }
  .disclaimer-accept-btn {
    background: var(--button-color);
    color: #000000;
    border: none;
    border-radius: 999px var(--button-radius) 999px var(--button-radius);
    padding: 14px 32px;
    font-family: 'Nexa', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .disclaimer-accept-btn:hover { background: #000000; color: var(--button-color); border: 3px solid var(--button-color); transform: scale(0.95); }

  .lightbox { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 100; align-items: center; justify-content: center; padding: 24px; }
  .lightbox.active { display: flex; }
  .lightbox video { max-height: 85vh; max-width: 90vw; border-radius: 8px; }
  .lightbox-close { position: absolute; top: 20px; right: 24px; background: none; border: none; color: white; font-size: 2rem; cursor: pointer; opacity: 0.7; }
  .lightbox-close:hover { opacity: 1; }
  .lightbox-info { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); text-align: center; }
  .lightbox-info a { color: var(--white); font-family: 'Nexa', sans-serif; font-size: 0.8rem; text-decoration: none; }
  .lightbox-info a:hover { text-decoration: underline; }
  .lightbox-caption { color: var(--gray); font-family: 'Nexa', sans-serif; font-size: 0.85rem; margin-top: 8px; font-style: italic; }

  .submit-modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 200; align-items: center; justify-content: center; padding: 24px; overflow-y: auto; }
  .submit-modal.active { display: flex; }

  .submit-modal-content {
    background: var(--black);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 36px 32px;
    max-width: 640px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .submit-modal-close { position: absolute; top: 20px; right: 24px; background: none; border: none; color: var(--gray); font-size: 2rem; cursor: pointer; }
  .submit-modal-close:hover { color: var(--white); }

  .form-group { margin-bottom: 24px; }
  label { display: block; font-family: 'Nexa', sans-serif; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; color: var(--gray); margin-bottom: 8px; }
  label .required { color: var(--accent); }

  input, select, textarea {
    width: 100%;
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 16px;
    color: var(--white);
    font-family: 'Nexa', sans-serif;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  textarea { resize: vertical; min-height: 60px; max-height: 120px; }
  input:focus, select:focus, textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
  input::placeholder, textarea::placeholder { color: #444; }
  select { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23777' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px; }
  select option { background: var(--black); color: var(--white); }

  .platform-select {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }

  .platform-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: var(--card-bg);
    border: 2px solid var(--border);
    border-radius: 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Nexa', sans-serif;
    font-weight: 500;
    color: var(--white);
  }

  .platform-option:hover {
    border-color: var(--accent);
    color: var(--white);
    background: var(--accent-glow);
  }

  .platform-option.selected {
    border-color: var(--accent);
    background: linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(124, 58, 237, 0.15));
    color: var(--white);
    font-weight: 600;
  }

  .platform-option .icon {
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
  }

  .platform-option .name {
    font-size: 0.95rem;
  }

  .platform-option.hidden {
    display: none;
  }

  .platform-error {
    color: #ff6b6b;
    font-size: 0.85rem;
    margin-top: 8px;
    display: none;
    font-family: 'DM Sans', sans-serif;
  }

  .platform-error.visible {
    display: block;
  }

  .upload-zone {
    border: 2px dashed var(--border);
    border-radius: 12px;
    padding: 40px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
  }
  .upload-zone:hover, .upload-zone.dragover { border-color: var(--accent); background: var(--accent-glow); }
  .upload-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .upload-icon { font-size: 2.5rem; margin-bottom: 8px; }
  .upload-text { font-size: 0.9rem; color: var(--gray); }
  .upload-text strong { color: var(--white); }
  .upload-hint { font-size: 0.7rem; color: #555; margin-top: 8px; }
  .file-name { font-family: 'Nexa', sans-serif; font-size: 0.75rem; color: var(--white); margin-top: 8px; display: none; }

  .progress-bar { width: 100%; height: 4px; background: var(--border); border-radius: 2px; margin-top: 16px; overflow: hidden; display: none; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent2)); width: 0%; transition: width 0.2s; border-radius: 2px; }

  .form-submit-btn {
    width: 100%;
    background: #000000;
    color: var(--button-color);
    border: 3px solid var(--button-color);
    border-radius: 999px var(--button-radius) 999px var(--button-radius);
    padding: 16px;
    font-family: 'Nexa', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 8px;
  }
  .form-submit-btn:hover { background: var(--button-color); color: #000000; transform: scale(0.95); }
  .form-submit-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .form-disclaimer {
    font-size: 0.75rem;
    line-height: 1.5;
    color: var(--gray);
    text-align: center;
    margin-top: 16px;
    padding: 12px 0;
  }
  .form-disclaimer a {
    color: var(--accent);
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .form-disclaimer a:hover {
    opacity: 0.8;
    text-decoration: underline;
  }

  .success-msg { display: none; text-align: center; padding: 40px 20px; }
  .success-msg .icon { font-size: 3rem; margin-bottom: 12px; }
  .success-msg h2 { font-family: 'Nexa', sans-serif; font-weight: 700; font-size: 1.3rem; margin-bottom: 8px; }
  .success-msg p { color: var(--gray); font-size: 0.9rem; }

  .loader { display: none; text-align: center; padding: 40px 20px; grid-column: 1 / -1; }
  .loader.visible { display: block; }
  .spinner { border: 3px solid var(--border); border-top: 3px solid var(--accent); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  .gallery-preloader {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
    width: 100%;
  }
  .gallery-preloader .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #333;
    border-top-color: var(--button-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .gallery.loaded {
    display: grid !important;
  }

  .page-loader {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: var(--black);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.4s;
  }
  .page-loader.hidden { opacity: 0; pointer-events: none; }
  .page-loader .spinner { border: 3px solid #252525; border-top: 3px solid var(--accent); border-radius: 50%; width: 48px; height: 48px; animation: spin 1s linear infinite; }

  .mobile-sticky-btn {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 30;
    text-align: center;
    padding: 12px 16px 20px;
    background: linear-gradient(transparent, rgba(0,0,0,0.95) 30%);
  }
  .mobile-sticky-btn button {
    background: ${shareButtonBgColor};
    color: var(--button-color);
    border: 3px solid var(--button-color);
    border-radius: ${shareButtonBorderRadius}px;
    padding: 12px 28px;
    font-family: 'Nexa', sans-serif;
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    max-width: 320px;
  }
  .mobile-sticky-btn button:hover { background: var(--button-color); color: #000000; transform: scale(0.95); }

  @media (max-width: 640px) {
    .layout { padding: 20px 12px 80px; }
    .header .brand { max-width: 280px; }
    .submit-btn { font-size: 0.75rem; padding: 10px 20px; }
    .gallery { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .polaroid { padding: 8px 8px 0 8px; }
    .polaroid-footer { padding: 10px 2px 12px; }
    .polaroid-ig { font-size: 0.6rem; }
    .polaroid-event { font-size: 0.5rem; }
    .polaroid-views { font-size: 0.5rem; padding: 2px 6px; }
    .polaroid-caption { font-size: 0.65rem; }
    .submit-modal-content { padding: 24px 20px; }
    .mobile-sticky-btn.visible { display: block; }
    .go-to-post-btn { opacity: 1; }
  }
</style>
</head>
<body>
  <video class="video-bg" autoplay muted loop playsinline>
    <source src="${bgVideoUrl}" type="${bgVideoUrl.endsWith('.mp4') ? 'video/mp4' : 'video/webm'}">
  </video>
  <div class="noise"></div>
  <div class="layout">
    <div class="header">
      <div class="brand"><img src="${settings.logo_path}" alt="Logo"></div>
      ${settings.show_subtext ? `<div class="sub">${settings.subtext}</div>` : ''}
      <div class="header-actions">
        <button class="submit-btn" id="shareBtn">${settings.share_button_text}</button>
      </div>
    </div>

    <div class="controls-bar">
      <div class="filter-control">
        <label class="filter-label">Tour Stop:</label>
        <select id="eventSelect" class="event-select">
          <option value="all">All Events</option>
        </select>
      </div>
      <div class="sort-control">
        <label class="sort-label">Sort:</label>
        <select id="sortSelect" class="sort-select">
          <option value="random">Random</option>
          <option value="views">Top Views</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>

    <div class="gallery-preloader" id="galleryPreloader">
      <div class="spinner"></div>
    </div>
    <div class="gallery" id="gallery" style="display:none"></div>
    <div class="loader" id="loader"><div class="spinner"></div></div>
  </div>

  <div class="mobile-sticky-btn" id="mobileStickyBtn">
    <button onclick="openSubmitModal()">${settings.share_button_text}</button>
  </div>

  <div class="lightbox" id="lightbox">
    <button class="lightbox-close" id="lightboxClose">&times;</button>
    <video id="lightboxVideo" controls></video>
    <div class="lightbox-info" id="lightboxInfo"></div>
  </div>

  <div class="submit-modal" id="submitModal">
    <div class="submit-modal-content">
      <button class="submit-modal-close" onclick="closeSubmitModal()">&times;</button>
      <div id="formCard">
        <form id="uploadForm">
          <div class="form-group">
            <label>Name <span class="required">*</span></label>
            <input type="text" name="name" placeholder="Your name" required>
          </div>
          <div class="form-group">
            <label>Email <span class="required">*</span></label>
            <input type="email" name="email" placeholder="you@email.com" required>
          </div>
          <div class="form-group">
            <label>Platform <span class="required">*</span></label>
            <div class="platform-select" id="platformSelect">
              <div class="platform-option" data-platform="tiktok" onclick="selectPlatform('tiktok')">
                <div class="icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M16.74 3.32c-1.23-.97-1.96-2.49-1.96-4.16V0h-2.8v12.87c0 1.33-1.09 2.42-2.42 2.42-1.33 0-2.42-1.09-2.42-2.42 0-1.33 1.09-2.42 2.42-2.42.27 0 .54.04.8.13V8.06c-.27-.03-.54-.06-.8-.06-3.58 0-6.49 2.91-6.49 6.49s2.91 6.49 6.49 6.49c3.58 0 6.49-2.91 6.49-6.49V6.34c1.33 1 3.02 1.58 4.89 1.58v-2.8c-1.29 0-2.51-.38-3.54-1.04z"/>
                  </svg>
                </div>
                <div class="name">TikTok</div>
              </div>
              <div class="platform-option" data-platform="instagram" onclick="selectPlatform('instagram')">
                <div class="icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 1.8C5.3 1.8 1.8 5.3 1.8 10s3.5 8.2 6.49 8.2 8.2-3.5 8.2-8.2-3.5-8.2-8.2-8.2zm0 10c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm6.5-1.5c0 .8.6 1.4 1.4 1.4s1.4-.6 1.4-1.4-.6-1.4-1.4-1.4-1.4.6-1.4 1.4z"/>
                  </svg>
                </div>
                <div class="name">Instagram</div>
              </div>
            </div>
            <div class="platform-error" id="platformError"></div>
            <input type="hidden" name="platform" id="platformInput" required>
          </div>
          <div class="form-group">
            <label>Post Link <span class="required">*</span></label>
            <input type="url" name="url" id="urlInput" placeholder="https://tiktok.com/@user/video/... or https://instagram.com/reel/..." required>
          </div>
          <div class="form-group">
            <label>Your Handle <span class="required">*</span></label>
            <input type="text" name="ig_username" placeholder="@username" required>
          </div>
          <div class="form-group">
            <label>Event <span class="required">*</span></label>
            <select name="gig_id" id="gigSelect" required>
              <option value="">Select event...</option>
            </select>
          </div>
          <div class="form-group">
            <label>Caption</label>
            <textarea name="caption" placeholder="Add a caption to your clip (optional)" maxlength="200"></textarea>
          </div>
          <div class="progress-bar" id="progressBar"><div class="progress-fill" id="progressFill"></div></div>
          <button type="submit" class="form-submit-btn" id="submitBtn">${settings.share_button_text}</button>
          <div class="form-disclaimer">
            ${privacyAgreement} <a href="/terms" target="_blank">View full terms</a>
          </div>
        </form>
      </div>
      <div id="successMsg" style="display:none; text-align:center">
        <div style="font-size:3rem;margin-bottom:16px">🎉</div>
        <div style="font-family:'Nexa',sans-serif;font-weight:700;font-size:1.2rem;margin-bottom:8px">Submission Received!</div>
        <div style="font-family:'Nexa',sans-serif;color:var(--gray);font-size:0.9rem">Your clip will be reviewed and may appear in the gallery soon.</div>
      </div>
    </div>
  </div>

  <div class="disclaimer-overlay" id="disclaimerOverlay">
    <div class="disclaimer-box">
      <h2>Welcome</h2>
      <p>${settings.disclaimer_short}</p>
      <button class="disclaimer-accept-btn" id="disclaimerAccept">I Understand</button>
    </div>
  </div>

  <script>
    let allItems = [];
    let currentFilter = 'all';
    let displayedItems = [];
    let filteredItems = [];
    const BATCH_SIZE = 10;
    let isLoading = false;
    const BUTTON_TEXT = '${settings.share_button_text}';

    function openSubmitModal() {
      const modal = document.getElementById('submitModal');
      const formCard = document.getElementById('formCard');
      const successMsg = document.getElementById('successMsg');
      const form = document.getElementById('uploadForm');
      formCard.style.display = 'block';
      successMsg.style.display = 'none';
      form.reset();
      document.getElementById('platformInput').value = '';
      document.querySelectorAll('.platform-option').forEach(el => el.classList.remove('selected'));
      clearPlatformError();
      
      // Check if disclaimer has been accepted
      const disclaimerShown = localStorage.getItem('disclaimer_accepted');
      if (!disclaimerShown) {
        // Show ONLY disclaimer, not the modal yet
        const overlay = document.getElementById('disclaimerOverlay');
        overlay.classList.add('active');
      } else {
        // Show modal directly if disclaimer already accepted
        modal.classList.add('active');
      }
    }

    function closeSubmitModal() {
      document.getElementById('submitModal').classList.remove('active');
      document.getElementById('uploadForm').reset();
      document.getElementById('progressBar').style.display = 'none';
      document.getElementById('submitBtn').disabled = false;
      document.getElementById('submitBtn').textContent = BUTTON_TEXT;
    }

    function acceptDisclaimer() {
      localStorage.setItem('disclaimer_accepted', '1');
      document.getElementById('disclaimerOverlay').classList.remove('active');
      // NOW open the submit modal after disclaimer is accepted
      document.getElementById('submitModal').classList.add('active');
    }

    // Wire up disclaimer button
    document.getElementById('disclaimerAccept').addEventListener('click', acceptDisclaimer);

    // Add event listener to share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', openSubmitModal);
    }

    document.getElementById('submitModal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeSubmitModal();
    });

    async function loadGallery() {
      allItems = await fetch('/api/gallery').then(r => r.json());
      const events = [...new Set(allItems.map(i => i.gig_name))].sort();
      const select = document.getElementById('eventSelect');
      select.innerHTML = '<option value="all">All Events</option>';
      events.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e; opt.textContent = e;
        select.appendChild(opt);
      });
      select.addEventListener('change', () => {
        currentFilter = select.value;
        displayedItems = [];
        document.getElementById('gallery').innerHTML = '';
        renderGallery();
      });
      renderGallery();
      setupInfiniteScroll();
      await preloadFirstBatch();
    }

    async function preloadFirstBatch() {
      const gallery = document.getElementById('gallery');
      const preloader = document.getElementById('galleryPreloader');
      const thumbs = gallery.querySelectorAll('.polaroid-media img');
      const first10 = Array.from(thumbs).slice(0, 10);
      if (first10.length > 0) {
        await Promise.all(first10.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
            setTimeout(resolve, 5000);
          });
        }));
      }
      if (preloader) preloader.style.display = 'none';
      gallery.style.display = '';
      gallery.classList.add('loaded');
    }

    function getFilteredItems() {
      let filtered = currentFilter === 'all' ? [...allItems] : allItems.filter(i => i.gig_name === currentFilter);
      const sortBy = document.getElementById('sortSelect')?.value || 'random';
      if (sortBy === 'random') {
        // Fisher-Yates shuffle for true randomization
        for (let i = filtered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
        }
      }
      else if (sortBy === 'views') filtered.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
      else if (sortBy === 'newest') filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return filtered;
    }

    function renderGallery() {
      displayedItems = [];
      filteredItems = getFilteredItems();
      const gallery = document.getElementById('gallery');
      if (!filteredItems.length) {
        gallery.innerHTML = '<div class="empty-state"><div class="icon"><img src="${settings.logo_path || '/hoang-logo.png'}" alt="" style="width:100%;height:auto;max-width:300px;opacity:0.5"></div><button class="empty-state-btn">No memories shared yet</button></div>';
        return;
      }
      loadMoreItems();
    }

    function loadMoreItems() {
      if (isLoading) return;
      isLoading = true;
      const loader = document.getElementById('loader');
      if (displayedItems.length > 0) loader.classList.add('visible');

      const start = displayedItems.length;
      const end = Math.min(start + BATCH_SIZE, filteredItems.length);
      for (let i = start; i < end; i++) displayedItems.push(filteredItems[i]);

      const gallery = document.getElementById('gallery');
      gallery.innerHTML = displayedItems.map((item, i) => {
        const rotation = (Math.random() - 0.5) * 5;
        const delay = (i % 6) * 0.15;
        const thumbSrc = item.thumbnail ? '/uploads/thumbs/' + esc(item.thumbnail) : '';
        const caption = item.caption || '';
        const videoSrc = item.public_url || ('/uploads/' + esc(item.filename));
        const sourceUrl = item.source_url || '';
        const viewCount = item.view_count || 0;
        const goToPostBtn = sourceUrl ? '<a href="' + esc(sourceUrl) + '" target="_blank" rel="noopener noreferrer" class="go-to-post-btn" onclick="event.stopPropagation()">→ Go to post</a>' : '';
        return '<div class="polaroid" style="--rot:' + rotation.toFixed(1) + 'deg;animation-delay:' + delay + 's" data-id="' + item.id + '" data-src="' + esc(videoSrc) + '" data-ig="' + esc(item.ig_username) + '" data-caption="' + esc(caption) + '">' +
          '<div class="polaroid-media">' +
            goToPostBtn +
            (thumbSrc ? '<img src="' + thumbSrc + '" alt="" loading="' + (i < 10 ? 'eager' : 'lazy') + '">' : '') +
            '<video src="' + esc(videoSrc) + '" muted playsinline preload="metadata"></video>' +
          '</div>' +
          '<div class="polaroid-footer">' +
            '<a href="https://instagram.com/' + esc(item.ig_username) + '" target="_blank" class="polaroid-ig" onclick="event.stopPropagation()">@' + esc(item.ig_username) + '</a>' +
            '<span class="polaroid-event">' + esc(item.gig_name) + '</span>' +
            '<span class="polaroid-views">👁 ' + viewCount + '</span>' +
            (caption ? '<div class="polaroid-caption">"' + esc(caption) + '"</div>' : '') +
          '</div></div>';
      }).join('');

      if (displayedItems.length < filteredItems.length) loader.classList.add('visible');
      else loader.classList.remove('visible');

      attachPolaroidListeners();
      isLoading = false;
    }

    function attachPolaroidListeners() {
      document.getElementById('gallery').querySelectorAll('.polaroid').forEach(p => {
        const vid = p.querySelector('video');
        const img = p.querySelector('img');
        p.addEventListener('mouseenter', () => { vid.play().catch(() => {}); if (img) img.style.opacity = '0'; });
        p.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; if (img) img.style.opacity = '1'; });
        p.addEventListener('click', () => { openLightbox(p.dataset.src, p.dataset.ig, p.dataset.id, p.dataset.caption); });
      });
    }

    function setupInfiniteScroll() {
      window.addEventListener('scroll', () => {
        const gallery = document.getElementById('gallery');
        if (!gallery) return;
        const rect = gallery.getBoundingClientRect();
        if (rect.bottom < window.innerHeight + 500 && displayedItems.length < filteredItems.length && !isLoading) loadMoreItems();
      });
    }

    function openLightbox(src, ig, id, caption) {
      const lb = document.getElementById('lightbox');
      const vid = document.getElementById('lightboxVideo');
      const info = document.getElementById('lightboxInfo');
      vid.src = src; vid.play().catch(() => {});
      let h = '<a href="https://instagram.com/' + esc(ig) + '" target="_blank">@' + esc(ig) + '</a>';
      if (caption) h += '<div class="lightbox-caption">"' + esc(caption) + '"</div>';
      info.innerHTML = h;
      lb.classList.add('active');
      if (id) fetch('/api/gallery/view/' + id, { method: 'POST' }).catch(() => {});
    }

    document.getElementById('lightboxClose').addEventListener('click', () => {
      const vid = document.getElementById('lightboxVideo');
      vid.pause(); vid.src = '';
      document.getElementById('lightbox').classList.remove('active');
    });
    document.getElementById('lightbox').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) document.getElementById('lightboxClose').click();
    });

    fetch('/api/gigs').then(r => r.json()).then(gigs => {
      const sel = document.getElementById('gigSelect');
      gigs.forEach(g => { const opt = document.createElement('option'); opt.value = g.id; opt.textContent = g.name; sel.appendChild(opt); });
    });

    let platformAutoDetected = false;

    function selectPlatform(platform) {
      document.getElementById('platformInput').value = platform;
      document.querySelectorAll('.platform-option').forEach(el => {
        el.classList.remove('selected');
      });
      const selected = document.querySelector('[data-platform="' + platform + '"]');
      if (selected) selected.classList.add('selected');
      clearPlatformError();
    }

    function detectPlatformFromUrl(url) {
      if (!url || typeof url !== 'string') return null;
      const urlLower = url.toLowerCase();
      if (urlLower.includes('tiktok.com')) return 'tiktok';
      if (urlLower.includes('instagram.com')) return 'instagram';
      return null;
    }

    function showPlatformError(message) {
      const errorEl = document.getElementById('platformError');
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }

    function clearPlatformError() {
      const errorEl = document.getElementById('platformError');
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }

    function extractUsernameFromUrl(url) {
      if (!url) return null;
      // TikTok: https://www.tiktok.com/@username/video/123
      const tiktokMatch = url.match(/tiktok\\.com\\/@([^\\/\\?]+)/i);
      if (tiktokMatch) return tiktokMatch[1];
      // Instagram: https://www.instagram.com/username/reel/ABC or /reels/ or /p/
      const igUserMatch = url.match(/instagram\\.com\\/([^\\/\\?]+)\\/(reel|reels|p)\\//i);
      if (igUserMatch && igUserMatch[1] !== 'stories') return igUserMatch[1];
      return null;
    }

    function validateVideoUrl(url, platform) {
      if (!url || !platform) return null;
      if (platform === 'tiktok') {
        if (!url.match(/tiktok\\.com\\/@[^\\/]+\\/video\\//i)) {
          return 'TikTok link must be a video (e.g. tiktok.com/@user/video/...)';
        }
      }
      if (platform === 'instagram') {
        // Accept /reel/ID, /reels/ID, /p/ID, or /username/reel/ID, /username/reels/ID, /username/p/ID
        if (!url.match(/instagram\\.com\\/(reel\\/|reels\\/|p\\/|[^\\/]+\\/(reel|reels|p)\\/)/i)) {
          return 'Instagram link must be a reel or post (e.g. instagram.com/reel/... or /p/...)';
        }
      }
      return null;
    }

    document.getElementById('urlInput').addEventListener('input', (e) => {
      const url = e.target.value.trim();
      const detectedPlatform = detectPlatformFromUrl(url);
      if (detectedPlatform) {
        selectPlatform(detectedPlatform);
        platformAutoDetected = true;
        // Validate URL format
        const error = validateVideoUrl(url, detectedPlatform);
        if (error) {
          showPlatformError(error);
        } else {
          clearPlatformError();
        }
        // Auto-populate handle
        const username = extractUsernameFromUrl(url);
        if (username) {
          const handleInput = document.querySelector('input[name="ig_username"]');
          if (handleInput) handleInput.value = '@' + username;
        }
      } else if (platformAutoDetected && !url) {
        document.getElementById('platformInput').value = '';
        document.querySelectorAll('.platform-option').forEach(el => el.classList.remove('selected'));
        platformAutoDetected = false;
        clearPlatformError();
      } else {
        clearPlatformError();
      }
    });

    document.getElementById('uploadForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate URL format before submitting
      const urlVal = document.getElementById('urlInput').value.trim();
      const platformVal = document.getElementById('platformInput').value;
      const urlError = validateVideoUrl(urlVal, platformVal);
      if (urlError) {
        showPlatformError(urlError);
        return;
      }

      const btn = document.getElementById('submitBtn');
      const bar = document.getElementById('progressBar');
      const fill = document.getElementById('progressFill');
      btn.disabled = true; btn.textContent = 'Processing...'; bar.style.display = 'block';

      const formData = new FormData(e.target);
      
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          fill.style.width = pct + '%';
          btn.textContent = 'Submitting... ' + pct + '%';
        }
      });
      
      xhr.addEventListener('load', () => {
        try {
          const resp = JSON.parse(xhr.responseText);
          if (xhr.status === 200 && resp.success) {
            document.getElementById('formCard').style.display = 'none';
            document.getElementById('successMsg').style.display = 'block';
            setTimeout(() => { closeSubmitModal(); loadGallery(); }, 2000);
          } else {
            alert(resp.error || 'Something went wrong');
            btn.disabled = false; btn.textContent = BUTTON_TEXT; bar.style.display = 'none';
          }
        } catch {
          alert('Failed to submit. Please try again.');
          btn.disabled = false; btn.textContent = BUTTON_TEXT; bar.style.display = 'none';
        }
      });

      xhr.addEventListener('error', () => {
        alert('Submission failed. Please check your connection.');
        btn.disabled = false; btn.textContent = BUTTON_TEXT; bar.style.display = 'none';
      });
      
      xhr.open('POST', '/api/submissions');
      xhr.send(formData);
    });

    document.getElementById('sortSelect').addEventListener('change', () => {
      displayedItems = [];
      document.getElementById('gallery').innerHTML = '';
      renderGallery();
    });

    function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

    // Sticky mobile Share Memories button
    (function() {
      const headerBtn = document.getElementById('shareBtn');
      const stickyBtn = document.getElementById('mobileStickyBtn');
      if (headerBtn && stickyBtn && window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              stickyBtn.classList.remove('visible');
            } else {
              stickyBtn.classList.add('visible');
            }
          });
        }, { threshold: 0 });
        observer.observe(headerBtn);
      }
    })();

    loadGallery();
  </script>
</body>
</html>`;
}
