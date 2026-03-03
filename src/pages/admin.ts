import { COMMON_HEAD } from "./shared";

export function adminPage(authed: boolean): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${COMMON_HEAD}
<title>Hoang Clips - Admin</title>
<style>
  :root {
    --black: #0a0a0a;
    --white: #f0f0f0;
    --accent: #00e5ff;
    --accent-glow: rgba(0, 229, 255, 0.15);
    --accent2: #7c3aed;
    --gray: #777;
    --card-bg: #111;
    --border: #252525;
    --green: #2a7d3f;
    --red: #c0392b;
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
  body { background: var(--black); color: var(--white); font-family: 'Nexa', sans-serif; min-height: 100vh; }

  .noise { position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.03; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size: 256px; }

  .layout { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 32px 24px; }

  .login-gate { max-width: 400px; margin: 120px auto; text-align: center; }
  .login-gate .brand { font-family: 'Nexa', sans-serif; font-weight: 800; font-size: 1.8rem; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 8px; }
  .login-gate p { color: var(--gray); font-size: 0.85rem; margin-bottom: 32px; }
  .login-gate input { width: 100%; background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; padding: 14px 16px; color: var(--white); font-family: 'Nexa', sans-serif; font-size: 1rem; text-align: center; letter-spacing: 2px; outline: none; margin-bottom: 16px; }
  .login-gate input:focus { border-color: var(--accent); }
  .login-gate .login-btn { width: 100%; background: #000000; color: #fff; border: 3px solid #ffffff; border-radius: 999px; padding: 14px; font-family: 'Nexa', sans-serif; font-weight: 700; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; }
  .login-gate .login-btn:hover { background: #ffffff; color: #000000; }
  .login-error { color: var(--red); font-size: 0.8rem; margin-top: 12px; display: none; }

  .admin-content { display: none; }
  .admin-content.visible { display: block; }

  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
  .header .header-brand { display: flex; align-items: center; gap: 12px; }
  .header .header-brand .logo { max-width: 80px; height: auto; }
  .header .header-brand .brand { font-family: 'Nexa', sans-serif; font-weight: 800; font-size: 1.4rem; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .header .header-brand span { font-family: 'Nexa', sans-serif; font-weight: 400; font-size: 1.2rem; color: var(--gray); }
  .header-actions { display: flex; gap: 12px; align-items: center; }

  .tab-bar { display: flex; gap: 0; margin-bottom: 28px; border-bottom: 1px solid var(--border); }
  .tab { padding: 10px 20px; font-family: 'Nexa', sans-serif; font-size: 0.75rem; letter-spacing: 1px; text-transform: uppercase; color: var(--gray); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; background: none; border-top: none; border-left: none; border-right: none; }
  .tab:hover { color: var(--white); }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }

  .panel { display: none; }
  .panel.active { display: block; }

  .btn { background: var(--card-bg); border: 1px solid var(--border); color: var(--white); padding: 8px 16px; border-radius: 999px; font-family: 'Nexa', sans-serif; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: all 0.2s; text-decoration: none; }
  .btn:hover { border-color: var(--accent); }
  .btn-accent { background: #000000; color: #fff; border: 3px solid #ffffff; font-weight: 700; }
  .btn-sm { padding: 4px 10px; font-size: 0.65rem; }
  .btn-logout { background: none; border: 1px solid var(--border); color: var(--gray); padding: 6px 12px; border-radius: 999px; font-family: 'Nexa', sans-serif; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; }
  .btn-logout:hover { border-color: var(--red); color: var(--red); }
  .btn-danger { color: var(--red); border-color: var(--red); }
  .btn-danger:hover { background: var(--red); color: var(--white); }

  .stats-bar { display: flex; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
  .stat { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; padding: 16px 24px; min-width: 100px; text-align: center; }
  .stat .num { font-family: 'Nexa', sans-serif; font-weight: 800; font-size: 1.8rem; line-height: 1; margin-bottom: 4px; }
  .stat .label { font-family: 'Nexa', sans-serif; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 1px; color: var(--gray); }

  table { width: 100%; border-collapse: collapse; }
  th { font-family: 'Nexa', sans-serif; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: var(--gray); padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--border); }
  td { padding: 12px; border-bottom: 1px solid var(--border); font-size: 0.85rem; }
  tr:hover { background: rgba(0,229,255,0.02); }

  .status-badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-family: 'Nexa', sans-serif; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.5px; }
  .status-badge.approved { background: rgba(42,125,63,0.15); color: var(--green); }
  .status-badge.pending { background: rgba(255,255,255,0.05); color: var(--gray); }
  .status-badge.processing { background: rgba(255,193,7,0.15); color: #ffc107; }
  .status-badge.failed { background: rgba(192,57,43,0.15); color: var(--red); }

  .ig-link { color: var(--white); text-decoration: none; font-weight: 500; }
  .ig-link:hover { text-decoration: underline; }
  .post-link { color: var(--accent); text-decoration: none; font-weight: 500; font-size: 0.75rem; }
  .post-link:hover { text-decoration: underline; }
  .empty-state { text-align: center; padding: 60px 20px; color: #444; }
  .empty-state .icon { font-size: 3rem; margin-bottom: 12px; }

  .gig-list { list-style: none; margin-top: 16px; }
  .gig-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; background: var(--card-bg); cursor: grab; user-select: none; transition: all 0.2s; }
  .gig-item:active { cursor: grabbing; }
  .gig-item.dragging { opacity: 0.5; }
  .gig-item.drag-over { border-color: var(--accent); background: rgba(0,229,255,0.05); }
  .gig-info { display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .gig-name { font-weight: 500; }
  .gig-date-input { width: 150px; background: var(--black); border: 1px solid var(--border); border-radius: 4px; padding: 4px 8px; color: var(--white); font-family: 'Nexa', sans-serif; font-size: 0.75rem; outline: none; }
  .gig-date-input:focus { border-color: var(--accent); }
  .gig-actions { display: flex; gap: 4px; }
  .add-gig { display: flex; gap: 8px; margin-top: 20px; }
  .add-gig input { flex: 1; background: var(--black); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; color: var(--white); font-family: 'Nexa', sans-serif; outline: none; }
  .add-gig input:focus { border-color: var(--accent); }

  .view-count { font-family: 'Nexa', sans-serif; font-size: 0.75rem; color: var(--gray); }
  .caption-cell { max-width: 150px; font-size: 0.8rem; color: var(--gray); }
  .caption-cell input { width: 100%; background: var(--black); border: 1px solid var(--border); border-radius: 4px; padding: 4px 8px; color: var(--white); font-family: 'Nexa', sans-serif; font-size: 0.8rem; outline: none; }
  .caption-cell input:focus { border-color: var(--accent); }

  .preview-modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 100; align-items: center; justify-content: center; padding: 24px; }
  .preview-modal.active { display: flex; }
  .preview-modal video { max-height: 85vh; max-width: 90vw; border-radius: 8px; }
  .preview-modal .close-btn { position: absolute; top: 20px; right: 24px; background: none; border: none; color: white; font-size: 2rem; cursor: pointer; opacity: 0.7; }
  .preview-modal .close-btn:hover { opacity: 1; }

  @media (max-width: 768px) {
    table { font-size: 0.75rem; }
    td, th { padding: 8px 6px; }
    .stats-bar { gap: 8px; }
    .stat { padding: 12px 16px; min-width: 80px; }
    .stat .num { font-size: 1.3rem; }
    .caption-cell { max-width: 100px; }
  }
</style>
</head>
<body>
  <div class="noise"></div>
  <div class="layout">
    <div class="login-gate" id="loginGate" style="${authed ? 'display:none' : ''}">
      <div class="brand">HOANG</div>
      <p>Admin Dashboard</p>
      <input type="password" id="passcodeInput" placeholder="Enter passcode" onkeydown="if(event.key==='Enter')doLogin()">
      <button class="login-btn" onclick="doLogin()">Enter</button>
      <div class="login-error" id="loginError">Invalid passcode</div>
    </div>

    <div class="admin-content ${authed ? 'visible' : ''}" id="adminContent">
      <div class="header">
        <div class="header-brand">
          <img src="" alt="Logo" class="logo" id="adminLogo">
          <div>
            <div class="brand">HOANG</div>
            <span>Admin</span>
          </div>
        </div>
        <div class="header-actions">
          <a href="/" class="btn">Go Back to Wall</a>
          <button class="btn-logout" onclick="doLogout()">Logout</button>
        </div>
      </div>

      <div class="tab-bar">
        <button class="tab active" data-panel="submissions">Submissions</button>
        <button class="tab" data-panel="events">Events</button>
        <button class="tab" data-panel="settings">Settings</button>
      </div>

      <div class="panel active" id="panel-submissions">
        <div class="stats-bar" id="statsBar"></div>
        <div id="submissionsTable"></div>
      </div>

      <div class="panel" id="panel-events">
        <h3 style="font-family:'Nexa',sans-serif;margin-bottom:4px">Manage Events</h3>
        <p style="color:var(--gray);font-size:0.8rem;margin-bottom:16px">Drag to reorder • Click date to edit</p>
        <ul class="gig-list" id="gigList"></ul>
        <div class="add-gig">
          <input type="text" id="newGigName" placeholder="New event name..." onkeydown="if(event.key==='Enter')document.getElementById('addGigBtn').click()">
          <input type="date" id="newGigDate" style="flex: 0 0 150px; background: var(--black); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; color: var(--white); font-family: 'Nexa', sans-serif; outline: none;">
          <button class="btn btn-accent" id="addGigBtn">Add</button>
        </div>
      </div>

      <div class="panel" id="panel-settings">
        <div style="display: flex; gap: 16px; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 12px; overflow-x: auto;">
          <button class="settings-sub-tab active" data-sub-panel="branding" style="flex-shrink: 0; background: none; border: none; color: var(--gray); font-family: 'Nexa', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; padding: 0 8px; border-bottom: 2px solid transparent; transition: all 0.2s;">Branding</button>
          <button class="settings-sub-tab" data-sub-panel="visual" style="flex-shrink: 0; background: none; border: none; color: var(--gray); font-family: 'Nexa', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; padding: 0 8px; border-bottom: 2px solid transparent; transition: all 0.2s;">Visual</button>
          <button class="settings-sub-tab" data-sub-panel="legal" style="flex-shrink: 0; background: none; border: none; color: var(--gray); font-family: 'Nexa', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; padding: 0 8px; border-bottom: 2px solid transparent; transition: all 0.2s;">Legal</button>
          <button class="settings-sub-tab" data-sub-panel="seo" style="flex-shrink: 0; background: none; border: none; color: var(--gray); font-family: 'Nexa', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; padding: 0 8px; border-bottom: 2px solid transparent; transition: all 0.2s;">SEO</button>
        </div>

        <div class="settings-sub-panel active" id="settings-branding" style="max-width: 600px;">
          <h4 style="font-family:'Nexa',sans-serif;font-size:0.95rem;margin-bottom:16px;color:var(--accent)">Site Branding</h4>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Logo Image</label>
            <input type="file" id="adminLogoUpload" accept="image/*" style="width: 100%; background: var(--black); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; color: var(--white); font-family: 'Nexa', sans-serif; outline: none;">
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Subtext</label>
            <input type="text" id="adminSubtextInput" placeholder="e.g., Hoang Memories" maxlength="100" style="width: 100%; background: var(--black); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; color: var(--white); font-family: 'Nexa', sans-serif; outline: none;">
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Share Button Text</label>
            <input type="text" id="adminShareButtonTextInput" placeholder="e.g., + Share Memories" maxlength="50" style="width: 100%; background: var(--black); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; color: var(--white); font-family: 'Nexa', sans-serif; outline: none;">
            <small style="color: #777; font-size: 0.75rem; margin-top: 4px; display: block;">Text displayed on the upload button (50 characters max)</small>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Show Subtext</label>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="toggle" id="adminShowSubtextToggle" style="position: relative; width: 50px; height: 26px; background: #252525; border-radius: 13px; cursor: pointer; transition: background 0.3s;">
                <div class="toggle-knob" style="position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: left 0.3s;"></div>
              </div>
              <span id="adminToggleLabel">Visible</span>
            </div>
          </div>
        </div>

        <div class="settings-sub-panel" id="settings-visual" style="max-width: 600px; display: none;">
          <h4 style="font-family:'Nexa',sans-serif;font-size:0.95rem;margin-bottom:16px;color:var(--accent)">Visual Customization</h4>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Background Color</label>
            <div style="display: flex; gap: 12px; align-items: center;">
              <input type="color" id="adminBgColorInput" style="width: 60px; height: 40px; border: 1px solid #252525; border-radius: 8px; cursor: pointer; background: #0a0a0a; padding: 4px;">
              <div id="adminBgColorPreview" style="flex: 1; background: #0a0a0a; border: 1px solid #252525; border-radius: 8px; padding: 12px 16px; color: #f0f0f0; font-family: 'Nexa', sans-serif; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">#000000</div>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Background Video/Image URL</label>
            <input type="text" id="adminBgVideoUrlInput" placeholder="e.g., /video.webm or /background.jpg" style="width: 100%; background: var(--black); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; color: var(--white); font-family: 'Nexa', sans-serif; outline: none;">
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Button Color</label>
            <div style="display: flex; gap: 12px; align-items: center;">
              <input type="color" id="adminButtonColorInput" style="width: 60px; height: 40px; border: 1px solid #252525; border-radius: 8px; cursor: pointer; background: #0a0a0a; padding: 4px;">
              <div id="adminButtonColorPreview" style="flex: 1; background: #0a0a0a; border: 1px solid #252525; border-radius: 8px; padding: 12px 16px; color: #f0f0f0; font-family: 'Nexa', sans-serif; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">#ffffff</div>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Button Border Radius</label>
            <div style="display: flex; align-items: center; gap: 12px;">
              <input type="range" id="adminButtonBorderRadiusInput" min="0" max="50" step="1" style="flex: 1; background: #0a0a0a; border: 1px solid #252525; border-radius: 8px; padding: 8px 0; color: #f0f0f0; font-family: 'Nexa', sans-serif; font-size: 1rem;">
              <span id="adminButtonBorderRadiusValue" style="display: inline-block; min-width: 40px; text-align: center; color: #00e5ff; font-weight: 700; font-size: 1rem;">4px</span>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Text Color</label>
            <div style="display: flex; gap: 12px; align-items: center;">
              <input type="color" id="adminTextColorInput" style="width: 60px; height: 40px; border: 1px solid #252525; border-radius: 8px; cursor: pointer; background: #0a0a0a; padding: 4px;">
              <div id="adminTextColorPreview" style="flex: 1; background: #0a0a0a; border: 1px solid #252525; border-radius: 8px; padding: 12px 16px; color: #f0f0f0; font-family: 'Nexa', sans-serif; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">#f0f0f0</div>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Link Color</label>
            <div style="display: flex; gap: 12px; align-items: center;">
              <input type="color" id="adminLinkColorInput" style="width: 60px; height: 40px; border: 1px solid #252525; border-radius: 8px; cursor: pointer; background: #0a0a0a; padding: 4px;">
              <div id="adminLinkColorPreview" style="flex: 1; background: #0a0a0a; border: 1px solid #252525; border-radius: 8px; padding: 12px 16px; color: #f0f0f0; font-family: 'Nexa', sans-serif; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">#00e5ff</div>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Disclaimer Text Color</label>
            <div style="display: flex; gap: 12px; align-items: center;">
              <input type="color" id="adminDisclaimerTextColorInput" style="width: 60px; height: 40px; border: 1px solid #252525; border-radius: 8px; cursor: pointer; background: #0a0a0a; padding: 4px;">
              <div id="adminDisclaimerTextColorPreview" style="flex: 1; background: #0a0a0a; border: 1px solid #252525; border-radius: 8px; padding: 12px 16px; color: #f0f0f0; font-family: 'Nexa', sans-serif; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">#777777</div>
            </div>
          </div>
        </div>

        <div class="settings-sub-panel" id="settings-legal" style="max-width: 600px; display: none;">
          <h4 style="font-family:'Nexa',sans-serif;font-size:0.95rem;margin-bottom:16px;color:var(--accent)">Legal & Disclaimers</h4>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Short Disclaimer (Pop-up)</label>
            <textarea id="adminDisclaimerShortInput" placeholder="Text shown in the first-time visitor pop-up" maxlength="500" rows="3" style="width: 100%; background: var(--black); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; color: var(--white); font-family: 'Nexa', sans-serif; outline: none; resize: vertical;"></textarea>
            <small style="color: #777; font-size: 0.75rem; margin-top: 4px; display: block;">Displayed in the welcome pop-up for first-time visitors (500 characters max)</small>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Long Disclaimer (Form)</label>
            <textarea id="adminDisclaimerLongInput" placeholder="Text shown at the bottom of the submission form" maxlength="1000" rows="4" style="width: 100%; background: var(--black); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; color: var(--white); font-family: 'Nexa', sans-serif; outline: none; resize: vertical;"></textarea>
            <small style="color: #777; font-size: 0.75rem; margin-top: 4px; display: block;">Displayed at the bottom of the submission form (1000 characters max)</small>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Privacy Agreement / Terms Text</label>
            <textarea id="adminPrivacyAgreementInput" placeholder="Full privacy and data usage agreement text" maxlength="2000" rows="6" style="width: 100%; background: var(--black); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; color: var(--white); font-family: 'Nexa', sans-serif; outline: none; resize: vertical;"></textarea>
            <small style="color: #777; font-size: 0.75rem; margin-top: 4px; display: block;">Full data privacy and submission agreement text (2000 characters max)</small>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Full Consent Agreement Page (Markdown)</label>
            <textarea id="adminSubmissionConsentAgreementInput" placeholder="Full submission consent agreement page content (supports Markdown)" maxlength="5000" rows="12" style="width: 100%; background: var(--black); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; color: var(--white); font-family: 'Nexa', sans-serif; outline: none; resize: vertical;"></textarea>
            <small style="color: #777; font-size: 0.75rem; margin-top: 4px; display: block;">Full agreement page text displayed at /terms - supports Markdown formatting (5000 characters max)</small>
          </div>
        </div>

        <div class="settings-sub-panel" id="settings-seo" style="max-width: 600px; display: none;">
          <h4 style="font-family:'Nexa',sans-serif;font-size:0.95rem;margin-bottom:16px;color:var(--accent)">SEO & Social Sharing</h4>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Meta Page Title</label>
            <input type="text" id="adminMetaPageTitleInput" placeholder="e.g., Hoang - Fan Submissions" style="width: 100%; background: var(--black); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; color: var(--white); font-family: 'Nexa', sans-serif; outline: none;">
            <small style="color: #777; font-size: 0.75rem; margin-top: 4px; display: block;">Title shown in browser tab and search results</small>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Meta Description</label>
            <textarea id="adminMetaDescriptionInput" placeholder="e.g., Hoang Memories - A fan community showcase" maxlength="160" rows="2" style="width: 100%; background: var(--black); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; color: var(--white); font-family: 'Nexa', sans-serif; outline: none; resize: vertical;"></textarea>
            <small style="color: #777; font-size: 0.75rem; margin-top: 4px; display: block;">Text shown in search results and social media shares (160 characters max)</small>
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">Meta Thumbnail (OG Image)</label>
            <input type="text" id="adminMetaThumbnailInput" placeholder="e.g., /hoang-og.png or /uploads/custom-thumbnail.jpg" style="width: 100%; background: var(--black); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; color: var(--white); font-family: 'Nexa', sans-serif; outline: none;">
            <small style="color: #777; font-size: 0.75rem; margin-top: 4px; display: block;">Image shown when sharing on social media (1200x630px recommended)</small>
          </div>
        </div>

        <button class="btn btn-accent" id="adminSettingsSaveBtn" style="width: 100%; max-width: 600px; padding: 12px; margin-top: 24px;">Save Settings</button>
      </div>
    </div>
  </div>

  <div class="preview-modal" id="previewModal">
    <button class="close-btn" id="previewClose">&times;</button>
    <video id="previewVideo" controls></video>
  </div>

  <script>
    const isAuthed = ${authed};

    // Load logo
    async function loadLogo() {
      try {
        const res = await fetch('/api/admin/settings');
        const settings = await res.json();
        const logoImg = document.getElementById('adminLogo');
        if (logoImg && settings.logo_path) {
          logoImg.src = settings.logo_path;
        }
      } catch (err) {
        console.error('Failed to load logo:', err);
      }
    }

    if (isAuthed) {
      loadLogo();
    }

    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('panel-' + tab.dataset.panel).classList.add('active');
      });
    });

    async function doLogin() {
      const code = document.getElementById('passcodeInput').value;
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ passcode: code }) });
      if (res.ok) location.reload();
      else document.getElementById('loginError').style.display = 'block';
    }

    async function doLogout() {
      await fetch('/api/admin/logout', { method: 'POST' });
      location.reload();
    }

    async function loadSubmissions() {
      if (!isAuthed) return;
      const res = await fetch('/api/submissions');
      if (res.status === 401) { location.reload(); return; }
      const subs = await res.json();
      const total = subs.length;
      const approved = subs.filter(s => s.approved).length;
      const pending = total - approved;
      const totalViews = subs.reduce((sum, s) => sum + (s.view_count || 0), 0);

      document.getElementById('statsBar').innerHTML = [
        { num: total, label: 'Total' },
        { num: approved, label: 'Approved' },
        { num: pending, label: 'Pending' },
        { num: totalViews, label: 'Total Views' },
      ].map(s => '<div class="stat"><div class="num">' + s.num + '</div><div class="label">' + s.label + '</div></div>').join('');

      if (!total) {
        document.getElementById('submissionsTable').innerHTML = '<div class="empty-state"><div class="icon">&#128249;</div><p>No submissions yet</p></div>';
        return;
      }

      let html = '<table><thead><tr><th>Name</th><th>Handle</th><th>Post Link</th><th>Event</th><th>Caption</th><th>Views</th><th>Email</th><th>Status</th><th>Preview</th><th>Actions</th></tr></thead><tbody>';
      subs.forEach(s => {
        let statusClass, statusLabel;
        if (s.status === 'processing') { statusClass = 'processing'; statusLabel = 'Processing'; }
        else if (s.status === 'failed') { statusClass = 'failed'; statusLabel = 'Failed'; }
        else if (s.approved) { statusClass = 'approved'; statusLabel = 'Approved'; }
        else { statusClass = 'pending'; statusLabel = 'Pending'; }

        const previewSrc = s.public_url || ('/api/preview/' + esc(s.filename));
        const canApprove = s.status === 'ready' && s.public_url;
        const postLink = s.source_url ? '<a href="' + esc(s.source_url) + '" target="_blank" rel="noopener noreferrer" class="post-link">View →</a>' : '—';

        let handleLink = '—';
        if (s.platform === 'tiktok') {
          handleLink = '<a href="https://tiktok.com/@' + esc(s.ig_username) + '" target="_blank" class="ig-link">@' + esc(s.ig_username) + '</a>';
        } else if (s.platform === 'instagram') {
          handleLink = '<a href="https://instagram.com/' + esc(s.ig_username) + '" target="_blank" class="ig-link">@' + esc(s.ig_username) + '</a>';
        }

        html += '<tr>';
        html += '<td>' + esc(s.name) + '</td>';
        html += '<td>' + handleLink + '</td>';
        html += '<td>' + postLink + '</td>';
        html += '<td style="color:var(--gray);font-size:0.8rem">' + esc(s.gig_name) + '</td>';
        html += '<td class="caption-cell"><input type="text" value="' + esc(s.caption || '') + '" placeholder="No caption" onchange="updateCaption(' + s.id + ', this.value)" onkeydown="if(event.key===&#39;Enter&#39;)this.blur()"></td>';
        html += '<td><span class="view-count">' + (s.view_count || 0) + '</span></td>';
        html += '<td style="color:var(--gray);font-size:0.8rem">' + esc(s.email || '\\u2014') + '</td>';
        html += '<td><span class="status-badge ' + statusClass + '">' + statusLabel + '</span></td>';
        html += '<td><button class="btn btn-sm" onclick="previewVideoUrl(&#39;' + esc(previewSrc) + '&#39;)"' + (s.status === 'processing' ? ' disabled style="opacity:0.4;cursor:not-allowed"' : '') + '>Play</button></td>';
        html += '<td>';
        if (s.status === 'processing') {
          html += '<button class="btn btn-sm" disabled style="opacity:0.4;cursor:not-allowed;margin-right:4px">Processing...</button>';
        } else if (s.status === 'failed') {
          html += '<button class="btn btn-sm" disabled style="opacity:0.4;cursor:not-allowed;color:var(--red);margin-right:4px">Failed</button>';
        } else if (!s.approved && canApprove) {
          html += '<button class="btn btn-sm" onclick="approveSubmission(' + s.id + ', true)" style="color:#2a7d3f;border-color:#2a7d3f;margin-right:4px">Approve</button>';
        } else if (!s.approved && !canApprove) {
          html += '<button class="btn btn-sm" disabled style="opacity:0.4;cursor:not-allowed;margin-right:4px" title="Waiting for video processing">Approve</button>';
        } else {
          html += '<button class="btn btn-sm" onclick="approveSubmission(' + s.id + ', false)" style="color:var(--red);border-color:var(--red);margin-right:4px">Reject</button>';
        }
        html += '<a href="/api/download/' + esc(s.filename) + '" class="btn btn-sm" download>DL</a>';
        html += '<button class="btn btn-sm btn-danger" onclick="deleteSubmission(' + s.id + ')" style="margin-left:4px">Del</button>';
        html += '</td></tr>';
      });
      html += '</tbody></table>';
      document.getElementById('submissionsTable').innerHTML = html;
    }

    async function approveSubmission(id, approve) {
      await fetch('/api/submissions/' + id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved: approve }) });
      loadSubmissions();
    }

    async function deleteSubmission(id) {
      if (!confirm('Delete this submission? This cannot be undone.')) return;
      await fetch('/api/submissions/' + id, { method: 'DELETE' });
      loadSubmissions();
    }

    function previewVideo(filename) {
      const modal = document.getElementById('previewModal');
      const vid = document.getElementById('previewVideo');
      vid.src = '/api/preview/' + filename;
      vid.play().catch(() => {});
      modal.classList.add('active');
    }

    function previewVideoUrl(url) {
      const modal = document.getElementById('previewModal');
      const vid = document.getElementById('previewVideo');
      vid.src = url;
      vid.play().catch(() => {});
      modal.classList.add('active');
    }

    document.getElementById('previewClose').addEventListener('click', () => {
      const vid = document.getElementById('previewVideo');
      vid.pause(); vid.src = '';
      document.getElementById('previewModal').classList.remove('active');
    });
    document.getElementById('previewModal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) document.getElementById('previewClose').click();
    });

    async function updateCaption(id, caption) {
      await fetch('/api/submissions/' + id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ caption }) });
    }

    let allGigs = [];

    async function loadGigs() {
      allGigs = await fetch('/api/gigs').then(r => r.json());
      const list = document.getElementById('gigList');
      if (!allGigs.length) {
        list.innerHTML = '<div class="empty-state"><div class="icon">&#127915;</div><p>No events yet</p></div>';
        return;
      }
      list.innerHTML = allGigs.map((g, idx) => {
        const dateVal = g.gig_date || '';
        return '<li class="gig-item" draggable="true" data-gig-id="' + g.id + '"><div class="gig-info"><span class="gig-name">' + esc(g.name) + '</span><input type="date" class="gig-date-input" data-gig-id="' + g.id + '" value="' + dateVal + '" onchange="updateGigDate(' + g.id + ', this.value)"></div></li>';
      }).join('');

      // Setup drag listeners
      const items = list.querySelectorAll('.gig-item');
      items.forEach((item, idx) => {
        item.addEventListener('dragstart', (e) => {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/html', item.innerHTML);
          item.classList.add('dragging');
          dragSourceIdx = idx;
        });

        item.addEventListener('dragend', () => {
          item.classList.remove('dragging');
          items.forEach(i => i.classList.remove('drag-over'));
        });

        item.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          if (item !== items[dragSourceIdx]) item.classList.add('drag-over');
        });

        item.addEventListener('dragleave', () => {
          item.classList.remove('drag-over');
        });

        item.addEventListener('drop', async (e) => {
          e.preventDefault();
          if (dragSourceIdx !== null && dragSourceIdx !== idx) {
            const newGigs = [...allGigs];
            const [movedGig] = newGigs.splice(dragSourceIdx, 1);
            newGigs.splice(idx, 0, movedGig);
            allGigs = newGigs;

            const ids = newGigs.map(g => g.id);
            await fetch('/api/gigs/reorder', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order: ids })
            });
            await loadGigs();
          }
        });
      });
    }

    let dragSourceIdx = null;

    async function updateGigDate(gigId, date) {
      await fetch('/api/gigs/' + gigId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gig_date: date || null })
      });
    }

    document.getElementById('addGigBtn').addEventListener('click', async () => {
      const nameInput = document.getElementById('newGigName');
      const dateInput = document.getElementById('newGigDate');
      const name = nameInput.value.trim();
      if (!name) return;
      const res = await fetch('/api/gigs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, gig_date: dateInput.value || null }) });
      if (res.ok) { nameInput.value = ''; dateInput.value = ''; loadGigs(); }
      else { const err = await res.json(); alert(err.error || 'Failed'); }
    });

    // Settings sub-tab switching
    document.querySelectorAll('.settings-sub-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.settings-sub-tab').forEach(b => {
          b.style.color = 'var(--gray)';
          b.style.borderBottomColor = 'transparent';
        });
        document.querySelectorAll('.settings-sub-panel').forEach(p => p.style.display = 'none');
        btn.style.color = 'var(--accent)';
        btn.style.borderBottomColor = 'var(--accent)';
        document.getElementById('settings-' + btn.dataset.subPanel).style.display = 'block';
      });
    });

    let uploadedLogoFile = null;

    // Load all settings
    async function loadAllSettings() {
      const res = await fetch('/api/admin/settings');
      const settings = await res.json();

      // Branding
      document.getElementById('adminSubtextInput').value = settings.subtext || 'Hoang Memories';
      document.getElementById('adminShareButtonTextInput').value = settings.share_button_text || '+ Share Memories';
      const toggle = document.getElementById('adminShowSubtextToggle').querySelector('.toggle-knob');
      const label = document.getElementById('adminToggleLabel');
      if (settings.show_subtext) {
        document.getElementById('adminShowSubtextToggle').style.background = '#00e5ff';
        toggle.style.left = '27px';
        label.textContent = 'Visible';
      } else {
        document.getElementById('adminShowSubtextToggle').style.background = '#252525';
        toggle.style.left = '3px';
        label.textContent = 'Hidden';
      }

      // Visual
      const bgColor = settings.bg_color || '#000000';
      document.getElementById('adminBgColorInput').value = bgColor;
      document.getElementById('adminBgColorPreview').textContent = bgColor;
      document.getElementById('adminBgColorPreview').style.backgroundColor = bgColor;

      document.getElementById('adminBgVideoUrlInput').value = settings.bg_video_url || '/Looped-Album-Symbol-Main-Piece.webm';

      const buttonColor = settings.button_color || '#ffffff';
      document.getElementById('adminButtonColorInput').value = buttonColor;
      document.getElementById('adminButtonColorPreview').textContent = buttonColor;
      document.getElementById('adminButtonColorPreview').style.backgroundColor = buttonColor;

      const buttonBorderRadius = settings.button_border_radius || 4;
      document.getElementById('adminButtonBorderRadiusInput').value = buttonBorderRadius;
      document.getElementById('adminButtonBorderRadiusValue').textContent = buttonBorderRadius + 'px';

      const textColor = settings.text_color || '#f0f0f0';
      document.getElementById('adminTextColorInput').value = textColor;
      document.getElementById('adminTextColorPreview').textContent = textColor;
      document.getElementById('adminTextColorPreview').style.backgroundColor = textColor;

      const linkColor = settings.link_color || '#00e5ff';
      document.getElementById('adminLinkColorInput').value = linkColor;
      document.getElementById('adminLinkColorPreview').textContent = linkColor;
      document.getElementById('adminLinkColorPreview').style.backgroundColor = linkColor;

      const disclaimerTextColor = settings.disclaimer_text_color || '#777777';
      document.getElementById('adminDisclaimerTextColorInput').value = disclaimerTextColor;
      document.getElementById('adminDisclaimerTextColorPreview').textContent = disclaimerTextColor;
      document.getElementById('adminDisclaimerTextColorPreview').style.backgroundColor = disclaimerTextColor;

      // Legal
      document.getElementById('adminDisclaimerShortInput').value = settings.disclaimer_short || '';
      document.getElementById('adminDisclaimerLongInput').value = settings.disclaimer_long || '';
      document.getElementById('adminPrivacyAgreementInput').value = settings.privacy_agreement_text || '';
      document.getElementById('adminSubmissionConsentAgreementInput').value = settings.submission_consent_agreement_text || '';

      // SEO
      document.getElementById('adminMetaPageTitleInput').value = settings.meta_page_title || 'Hoang - Fan Submissions';
      document.getElementById('adminMetaDescriptionInput').value = settings.meta_description || 'Hoang Memories - A fan community showcase';
      document.getElementById('adminMetaThumbnailInput').value = settings.meta_thumbnail_path || '/hoang-og.png';
    }

    // Color input handlers
    document.getElementById('adminBgColorInput').addEventListener('input', (e) => {
      document.getElementById('adminBgColorPreview').textContent = e.target.value;
      document.getElementById('adminBgColorPreview').style.backgroundColor = e.target.value;
    });

    document.getElementById('adminButtonColorInput').addEventListener('input', (e) => {
      document.getElementById('adminButtonColorPreview').textContent = e.target.value;
      document.getElementById('adminButtonColorPreview').style.backgroundColor = e.target.value;
    });

    document.getElementById('adminTextColorInput').addEventListener('input', (e) => {
      document.getElementById('adminTextColorPreview').textContent = e.target.value;
      document.getElementById('adminTextColorPreview').style.backgroundColor = e.target.value;
    });

    document.getElementById('adminLinkColorInput').addEventListener('input', (e) => {
      document.getElementById('adminLinkColorPreview').textContent = e.target.value;
      document.getElementById('adminLinkColorPreview').style.backgroundColor = e.target.value;
    });

    document.getElementById('adminDisclaimerTextColorInput').addEventListener('input', (e) => {
      document.getElementById('adminDisclaimerTextColorPreview').textContent = e.target.value;
      document.getElementById('adminDisclaimerTextColorPreview').style.backgroundColor = e.target.value;
    });

    document.getElementById('adminButtonBorderRadiusInput').addEventListener('input', (e) => {
      document.getElementById('adminButtonBorderRadiusValue').textContent = e.target.value + 'px';
    });

    // Toggle handler
    document.getElementById('adminShowSubtextToggle').addEventListener('click', () => {
      const toggle = document.getElementById('adminShowSubtextToggle');
      const knob = toggle.querySelector('.toggle-knob');
      const label = document.getElementById('adminToggleLabel');

      if (toggle.style.background === 'rgb(0, 229, 255)' || toggle.style.backgroundColor === '#00e5ff') {
        toggle.style.background = '#252525';
        knob.style.left = '3px';
        label.textContent = 'Hidden';
      } else {
        toggle.style.background = '#00e5ff';
        knob.style.left = '27px';
        label.textContent = 'Visible';
      }
    });

    // Logo upload handler
    document.getElementById('adminLogoUpload').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        uploadedLogoFile = file;
      }
    });

    // Save all settings
    document.getElementById('adminSettingsSaveBtn').addEventListener('click', async () => {
      const btn = document.getElementById('adminSettingsSaveBtn');
      btn.textContent = 'Saving...';
      btn.disabled = true;

      const toggle = document.getElementById('adminShowSubtextToggle');
      const isActive = toggle.style.background === 'rgb(0, 229, 255)' || toggle.style.backgroundColor === '#00e5ff';

      const formData = new FormData();
      formData.append('subtext', document.getElementById('adminSubtextInput').value);
      formData.append('show_subtext', isActive ? '1' : '0');
      formData.append('share_button_text', document.getElementById('adminShareButtonTextInput').value || '+ Share Memories');
      formData.append('bg_color', document.getElementById('adminBgColorInput').value);
      formData.append('bg_video_url', document.getElementById('adminBgVideoUrlInput').value);
      formData.append('button_color', document.getElementById('adminButtonColorInput').value);
      formData.append('button_border_radius', document.getElementById('adminButtonBorderRadiusInput').value);
      formData.append('text_color', document.getElementById('adminTextColorInput').value);
      formData.append('link_color', document.getElementById('adminLinkColorInput').value);
      formData.append('disclaimer_text_color', document.getElementById('adminDisclaimerTextColorInput').value);
      formData.append('disclaimer_short', document.getElementById('adminDisclaimerShortInput').value);
      formData.append('disclaimer_long', document.getElementById('adminDisclaimerLongInput').value);
      formData.append('privacy_agreement_text', document.getElementById('adminPrivacyAgreementInput').value);
      formData.append('submission_consent_agreement_text', document.getElementById('adminSubmissionConsentAgreementInput').value);
      formData.append('meta_page_title', document.getElementById('adminMetaPageTitleInput').value);
      formData.append('meta_description', document.getElementById('adminMetaDescriptionInput').value);
      formData.append('meta_thumbnail_path', document.getElementById('adminMetaThumbnailInput').value);

      if (uploadedLogoFile) {
        formData.append('logo', uploadedLogoFile);
      }

      try {
        const res = await fetch('/api/admin/settings', { method: 'POST', body: formData });
        if (res.ok) {
          alert('Settings saved!');
          uploadedLogoFile = null;
          await loadAllSettings();
        } else {
          alert('Failed to save settings');
        }
      } catch (err) {
        alert('Error: ' + err);
      }

      btn.textContent = 'Save Settings';
      btn.disabled = false;
    });

    function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

    if (isAuthed) { loadSubmissions(); loadGigs(); loadAllSettings(); }
  </script>
</body>
</html>`;
}
