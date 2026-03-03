import { COMMON_HEAD } from "./shared";

export function adminSettingsPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${COMMON_HEAD}
<title>Admin Settings - Hoang Clips</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    background: #0a0a0a;
    color: #f0f0f0;
    font-family: 'Nexa', sans-serif;
    min-height: 100vh;
    padding: 40px 24px;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 8px;
  }

  .subtitle {
    color: #777;
    font-size: 0.9rem;
    margin-bottom: 40px;
  }

  .card {
    background: #111;
    border: 1px solid #252525;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 24px;
  }

  .card h2 {
    font-size: 1.3rem;
    margin-bottom: 24px;
    color: #00e5ff;
  }

  .form-group {
    margin-bottom: 24px;
  }

  label {
    display: block;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #999;
    margin-bottom: 8px;
  }

  input[type="text"],
  input[type="file"],
  textarea {
    width: 100%;
    background: #0a0a0a;
    border: 1px solid #252525;
    border-radius: 8px;
    padding: 12px 16px;
    color: #f0f0f0;
    font-family: 'Nexa', sans-serif;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  textarea {
    resize: vertical;
    min-height: 80px;
    line-height: 1.5;
  }

  input[type="text"]:focus,
  textarea:focus {
    outline: none;
    border-color: #00e5ff;
  }

  small {
    color: #777;
    font-size: 0.75rem;
    margin-top: 4px;
    display: block;
  }

  .toggle-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .toggle {
    position: relative;
    width: 50px;
    height: 26px;
    background: #252525;
    border-radius: 13px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .toggle.active {
    background: #00e5ff;
  }

  .toggle-knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: left 0.3s;
  }

  .toggle.active .toggle-knob {
    left: 27px;
  }

  .preview {
    margin-top: 16px;
    padding: 24px;
    background: #000;
    border: 1px solid #252525;
    border-radius: 8px;
    text-align: center;
  }

  .preview img {
    max-width: 400px;
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    filter: invert(1) brightness(1.2);
  }

  .preview-subtext {
    margin-top: 12px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 4px;
    color: #000000;
    background: #ffffff;
    display: inline-block;
    padding: 6px 16px;
    border-radius: 4px;
  }

  .btn {
    background: #00e5ff;
    color: #000;
    border: none;
    border-radius: 8px;
    padding: 14px 32px;
    font-family: 'Nexa', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn:hover {
    background: #00d4e6;
    transform: translateY(-2px);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .success-msg {
    background: #00e5ff;
    color: #000;
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 24px;
    font-weight: 600;
    display: none;
  }

  .success-msg.visible {
    display: block;
  }

  .back-link {
    display: inline-block;
    color: #00e5ff;
    text-decoration: none;
    margin-bottom: 24px;
    font-size: 0.9rem;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  .color-input-group {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  input[type="color"] {
    width: 60px;
    height: 40px;
    border: 1px solid #252525;
    border-radius: 8px;
    cursor: pointer;
    background: #0a0a0a;
    padding: 4px;
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }

  .color-preview {
    flex: 1;
    background: #0a0a0a;
    border: 1px solid #252525;
    border-radius: 8px;
    padding: 12px 16px;
    color: #f0f0f0;
    font-family: 'Nexa', sans-serif;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  input[type="number"],
  input[type="range"] {
    width: 100%;
    background: #0a0a0a;
    border: 1px solid #252525;
    border-radius: 8px;
    padding: 12px 16px;
    color: #f0f0f0;
    font-family: 'Nexa', sans-serif;
    font-size: 1rem;
  }

  input[type="range"] {
    padding: 8px 0;
  }

  .range-value {
    display: inline-block;
    min-width: 40px;
    text-align: center;
    color: #00e5ff;
    font-weight: 700;
    font-size: 1rem;
  }
</style>
</head>
<body>
  <div class="container">
    <a href="/admin" class="back-link">← Back to Admin Dashboard</a>
    
    <h1>Admin Settings</h1>
    <div class="subtitle">Customize your site appearance</div>

    <div class="success-msg" id="successMsg">Settings saved successfully!</div>

    <div class="card">
      <h2>Site Branding</h2>
      
      <form id="settingsForm">
        <div class="form-group">
          <label>Logo Image</label>
          <input type="file" id="logoUpload" accept="image/*">
          <div class="preview" id="logoPreview">
            <img src="" alt="Logo Preview" id="logoImg">
          </div>
        </div>

        <div class="form-group">
          <label>Subtext</label>
          <input type="text" id="subtextInput" placeholder="e.g., Hoang Memories" maxlength="100">
        </div>

        <div class="form-group">
          <label>Share Button Text</label>
          <input type="text" id="shareButtonTextInput" placeholder="e.g., + Share Memories" maxlength="50">
          <small>Text displayed on the upload button (50 characters max)</small>
        </div>

        <div class="form-group">
          <label>Show Subtext</label>
          <div class="toggle-group">
            <div class="toggle" id="showSubtextToggle">
              <div class="toggle-knob"></div>
            </div>
            <span id="toggleLabel">Visible</span>
          </div>
        </div>

        <div class="preview">
          <div style="font-weight: 700; font-size: 0.85rem; color: #777; margin-bottom: 12px;">Preview</div>
          <img src="" alt="Preview" id="previewImg">
          <div class="preview-subtext" id="previewSubtext" style="display: block;"></div>
        </div>
      </form>
    </div>

    <div class="card">
      <h2>Visual Customization</h2>
      
      <div class="form-group">
        <label>Background Color</label>
        <div class="color-input-group">
          <input type="color" id="bgColorInput">
          <div class="color-preview" id="bgColorPreview">#000000</div>
        </div>
        <small>Background color for the gallery page</small>
      </div>

      <div class="form-group">
        <label>Background Video/Image URL</label>
        <input type="text" id="bgVideoUrlInput" placeholder="e.g., /video.webm or /background.jpg">
        <small>Optional background video or image (relative path from public folder)</small>
      </div>

      <div class="form-group">
        <label>Background Video Size</label>
        <select id="bgVideoSizeInput" style="width: 100%; background: #0a0a0a; border: 1px solid #252525; border-radius: 8px; padding: 12px 16px; color: #f0f0f0; font-family: 'Nexa', sans-serif; font-size: 1rem;">
          <option value="cover">Fill whole screen (cover)</option>
          <option value="contain">Fit to screen (contain)</option>
          <option value="488px">Original size (488x488px)</option>
        </select>
        <small>How the background video/image should be sized</small>
      </div>

      <div class="form-group">
        <label>Share Button Background Color</label>
        <input type="text" id="shareButtonBgColorInput" placeholder="e.g., transparent, #ff0000, rgba(0,0,0,0.5)">
        <small>Background color for the Share Memories button (supports any CSS color value including "transparent")</small>
      </div>

      <div class="form-group">
        <label>Share Button Border Radius</label>
        <div style="display: flex; align-items: center; gap: 12px;">
          <input type="range" id="shareButtonBorderRadiusInput" min="0" max="999" step="1">
          <span class="range-value" id="shareButtonBorderRadiusValue">999px</span>
        </div>
        <small>Border radius for the Share Memories button (0 = square, 999 = pill shape)</small>
      </div>

      <div class="form-group">
        <label>Button Color</label>
        <div class="color-input-group">
          <input type="color" id="buttonColorInput">
          <div class="color-preview" id="buttonColorPreview">#ffffff</div>
        </div>
        <small>Color for buttons and interactive elements</small>
      </div>

      <div class="form-group">
        <label>Button Border Radius</label>
        <div style="display: flex; align-items: center; gap: 12px;">
          <input type="range" id="buttonBorderRadiusInput" min="0" max="50" step="1">
          <span class="range-value" id="buttonBorderRadiusValue">4px</span>
        </div>
        <small>Border radius for buttons (0px = square, higher = more rounded)</small>
      </div>

      <div class="form-group">
        <label>Text Color</label>
        <div class="color-input-group">
          <input type="color" id="textColorInput">
          <div class="color-preview" id="textColorPreview">#f0f0f0</div>
        </div>
        <small>Main text color throughout the site</small>
      </div>

      <div class="form-group">
        <label>Link Color</label>
        <div class="color-input-group">
          <input type="color" id="linkColorInput">
          <div class="color-preview" id="linkColorPreview">#00e5ff</div>
        </div>
        <small>Color for links and accents</small>
      </div>

      <div class="form-group">
        <label>Disclaimer Text Color</label>
        <div class="color-input-group">
          <input type="color" id="disclaimerTextColorInput">
          <div class="color-preview" id="disclaimerTextColorPreview">#777777</div>
        </div>
        <small>Color for disclaimer and secondary text</small>
      </div>
    </div>

    <div class="card">
      <h2>Legal & Disclaimers</h2>

      <div class="form-group">
        <label>Short Disclaimer (Pop-up)</label>
        <textarea id="disclaimerShortInput" placeholder="Text shown in the first-time visitor pop-up" maxlength="500" rows="3"></textarea>
        <small>Displayed in the welcome pop-up for first-time visitors (500 characters max)</small>
      </div>

      <div class="form-group">
        <label>Long Disclaimer (Form)</label>
        <textarea id="disclaimerLongInput" placeholder="Text shown at the bottom of the submission form" maxlength="1000" rows="4"></textarea>
        <small>Displayed at the bottom of the submission form (1000 characters max)</small>
      </div>

      <div class="form-group">
        <label>Privacy Agreement / Terms Text</label>
        <textarea id="privacyAgreementInput" placeholder="Full privacy and data usage agreement text" maxlength="2000" rows="6"></textarea>
        <small>Full data privacy and submission agreement text (2000 characters max)</small>
      </div>

      <div class="form-group">
        <label>Full Consent Agreement Page (Markdown)</label>
        <textarea id="submissionConsentAgreementInput" placeholder="Full submission consent agreement page content (supports Markdown)" maxlength="5000" rows="12"></textarea>
        <small>Full agreement page text displayed at /terms - supports Markdown formatting (5000 characters max)</small>
      </div>
    </div>

    <div class="card">
      <h2>SEO & Social Sharing</h2>

      <div class="form-group">
        <label>Meta Page Title</label>
        <input type="text" id="metaPageTitleInput" placeholder="e.g., Hoang - Fan Submissions">
        <small>Title shown in browser tab and search results</small>
      </div>

      <div class="form-group">
        <label>Meta Description</label>
        <textarea id="metaDescriptionInput" placeholder="e.g., Hoang Memories - A fan community showcase" maxlength="160" rows="2"></textarea>
        <small>Text shown in search results and social media shares (160 characters max)</small>
      </div>

      <div class="form-group">
        <label>Meta Thumbnail (OG Image)</label>
        <input type="text" id="metaThumbnailInput" placeholder="e.g., /hoang-og.png or /uploads/custom-thumbnail.jpg">
        <small>Image shown when sharing on social media (1200x630px recommended)</small>
      </div>

      <div style="margin-top: 24px;">
        <button type="button" class="btn" id="saveBtn" onclick="document.getElementById('settingsForm').requestSubmit()">Save Changes</button>
      </div>
    </div>
  </div>

  <script>
    let currentSettings = {};
    let uploadedLogoFile = null;

    // Load current settings
    async function loadSettings() {
      const res = await fetch('/api/admin/settings');
      currentSettings = await res.json();

      document.getElementById('logoImg').src = currentSettings.logo_path;
      document.getElementById('previewImg').src = currentSettings.logo_path;
      document.getElementById('subtextInput').value = currentSettings.subtext;
      document.getElementById('previewSubtext').textContent = currentSettings.subtext;
      document.getElementById('shareButtonTextInput').value = currentSettings.share_button_text || '+ Share Memories';
      document.getElementById('disclaimerShortInput').value = currentSettings.disclaimer_short || '';
      document.getElementById('disclaimerLongInput').value = currentSettings.disclaimer_long || '';
      
      // Load new styling fields
      const bgColor = currentSettings.bg_color || '#000000';
      document.getElementById('bgColorInput').value = bgColor;
      document.getElementById('bgColorPreview').textContent = bgColor;
      document.getElementById('bgColorPreview').style.backgroundColor = bgColor;

      document.getElementById('bgVideoUrlInput').value = currentSettings.bg_video_url || '/Looped-Album-Symbol-Main-Piece.webm';

      const bgVideoSize = currentSettings.bg_video_size || 'cover';
      document.getElementById('bgVideoSizeInput').value = bgVideoSize;

      document.getElementById('shareButtonBgColorInput').value = currentSettings.share_button_bg_color || 'transparent';

      const shareButtonBorderRadius = currentSettings.share_button_border_radius ?? 999;
      document.getElementById('shareButtonBorderRadiusInput').value = shareButtonBorderRadius;
      document.getElementById('shareButtonBorderRadiusValue').textContent = shareButtonBorderRadius + 'px';

      const buttonColor = currentSettings.button_color || '#ffffff';
      document.getElementById('buttonColorInput').value = buttonColor;
      document.getElementById('buttonColorPreview').textContent = buttonColor;
      document.getElementById('buttonColorPreview').style.backgroundColor = buttonColor;

      const buttonBorderRadius = currentSettings.button_border_radius || 4;
      document.getElementById('buttonBorderRadiusInput').value = buttonBorderRadius;
      document.getElementById('buttonBorderRadiusValue').textContent = buttonBorderRadius + 'px';

      const textColor = currentSettings.text_color || '#f0f0f0';
      document.getElementById('textColorInput').value = textColor;
      document.getElementById('textColorPreview').textContent = textColor;
      document.getElementById('textColorPreview').style.backgroundColor = textColor;

      const linkColor = currentSettings.link_color || '#00e5ff';
      document.getElementById('linkColorInput').value = linkColor;
      document.getElementById('linkColorPreview').textContent = linkColor;
      document.getElementById('linkColorPreview').style.backgroundColor = linkColor;

      const disclaimerTextColor = currentSettings.disclaimer_text_color || '#777777';
      document.getElementById('disclaimerTextColorInput').value = disclaimerTextColor;
      document.getElementById('disclaimerTextColorPreview').textContent = disclaimerTextColor;
      document.getElementById('disclaimerTextColorPreview').style.backgroundColor = disclaimerTextColor;

      document.getElementById('privacyAgreementInput').value = currentSettings.privacy_agreement_text || '';
      document.getElementById('submissionConsentAgreementInput').value = currentSettings.submission_consent_agreement_text || '';

      document.getElementById('metaPageTitleInput').value = currentSettings.meta_page_title || 'Hoang - Fan Submissions';
      document.getElementById('metaDescriptionInput').value = currentSettings.meta_description || 'Hoang Memories - A fan community showcase';
      document.getElementById('metaThumbnailInput').value = currentSettings.meta_thumbnail_path || '/hoang-og.png';
      
      const toggle = document.getElementById('showSubtextToggle');
      const label = document.getElementById('toggleLabel');
      const previewSubtext = document.getElementById('previewSubtext');
      
      if (currentSettings.show_subtext) {
        toggle.classList.add('active');
        label.textContent = 'Visible';
        previewSubtext.style.display = 'inline-block';
      } else {
        toggle.classList.remove('active');
        label.textContent = 'Hidden';
        previewSubtext.style.display = 'none';
      }
    }

    // Color input change handlers
    document.getElementById('bgColorInput').addEventListener('input', (e) => {
      document.getElementById('bgColorPreview').textContent = e.target.value;
      document.getElementById('bgColorPreview').style.backgroundColor = e.target.value;
    });

    document.getElementById('buttonColorInput').addEventListener('input', (e) => {
      document.getElementById('buttonColorPreview').textContent = e.target.value;
      document.getElementById('buttonColorPreview').style.backgroundColor = e.target.value;
    });

    document.getElementById('textColorInput').addEventListener('input', (e) => {
      document.getElementById('textColorPreview').textContent = e.target.value;
      document.getElementById('textColorPreview').style.backgroundColor = e.target.value;
    });

    document.getElementById('linkColorInput').addEventListener('input', (e) => {
      document.getElementById('linkColorPreview').textContent = e.target.value;
      document.getElementById('linkColorPreview').style.backgroundColor = e.target.value;
    });

    document.getElementById('disclaimerTextColorInput').addEventListener('input', (e) => {
      document.getElementById('disclaimerTextColorPreview').textContent = e.target.value;
      document.getElementById('disclaimerTextColorPreview').style.backgroundColor = e.target.value;
    });

    document.getElementById('buttonBorderRadiusInput').addEventListener('input', (e) => {
      document.getElementById('buttonBorderRadiusValue').textContent = e.target.value + 'px';
    });

    document.getElementById('shareButtonBorderRadiusInput').addEventListener('input', (e) => {
      document.getElementById('shareButtonBorderRadiusValue').textContent = e.target.value + 'px';
    });

    // Toggle handler
    document.getElementById('showSubtextToggle').addEventListener('click', () => {
      const toggle = document.getElementById('showSubtextToggle');
      const label = document.getElementById('toggleLabel');
      const previewSubtext = document.getElementById('previewSubtext');
      
      if (toggle.classList.contains('active')) {
        toggle.classList.remove('active');
        label.textContent = 'Hidden';
        previewSubtext.style.display = 'none';
      } else {
        toggle.classList.add('active');
        label.textContent = 'Visible';
        previewSubtext.style.display = 'inline-block';
      }
    });

    // Subtext input handler
    document.getElementById('subtextInput').addEventListener('input', (e) => {
      document.getElementById('previewSubtext').textContent = e.target.value;
    });

    // Logo upload handler
    document.getElementById('logoUpload').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        uploadedLogoFile = file;
        const reader = new FileReader();
        reader.onload = (ev) => {
          document.getElementById('logoImg').src = ev.target.result;
          document.getElementById('previewImg').src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Form submit handler
    document.getElementById('settingsForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = document.getElementById('saveBtn');
      btn.disabled = true;
      btn.textContent = 'Saving...';
      
      const formData = new FormData();
      formData.append('subtext', document.getElementById('subtextInput').value);
      formData.append('show_subtext', document.getElementById('showSubtextToggle').classList.contains('active') ? '1' : '0');
      formData.append('share_button_text', document.getElementById('shareButtonTextInput').value || '+ Share Memories');
      formData.append('disclaimer_short', document.getElementById('disclaimerShortInput').value);
      formData.append('disclaimer_long', document.getElementById('disclaimerLongInput').value);
      formData.append('bg_color', document.getElementById('bgColorInput').value);
      formData.append('bg_video_url', document.getElementById('bgVideoUrlInput').value);
      formData.append('bg_video_size', document.getElementById('bgVideoSizeInput').value);
      formData.append('share_button_bg_color', document.getElementById('shareButtonBgColorInput').value || 'transparent');
      formData.append('share_button_border_radius', document.getElementById('shareButtonBorderRadiusInput').value);
      formData.append('button_color', document.getElementById('buttonColorInput').value);
      formData.append('button_border_radius', document.getElementById('buttonBorderRadiusInput').value);
      formData.append('text_color', document.getElementById('textColorInput').value);
      formData.append('link_color', document.getElementById('linkColorInput').value);
      formData.append('disclaimer_text_color', document.getElementById('disclaimerTextColorInput').value);
      formData.append('privacy_agreement_text', document.getElementById('privacyAgreementInput').value);
      formData.append('submission_consent_agreement_text', document.getElementById('submissionConsentAgreementInput').value);
      formData.append('meta_page_title', document.getElementById('metaPageTitleInput').value);
      formData.append('meta_description', document.getElementById('metaDescriptionInput').value);
      formData.append('meta_thumbnail_path', document.getElementById('metaThumbnailInput').value);

      if (uploadedLogoFile) {
        formData.append('logo', uploadedLogoFile);
      }
      
      try {
        const res = await fetch('/api/admin/settings', {
          method: 'POST',
          body: formData
        });
        
        if (res.ok) {
          const successMsg = document.getElementById('successMsg');
          successMsg.classList.add('visible');
          setTimeout(() => successMsg.classList.remove('visible'), 3000);
          uploadedLogoFile = null;
          await loadSettings();
        } else {
          alert('Failed to save settings');
        }
      } catch (err) {
        alert('Error saving settings: ' + err.message);
      }
      
      btn.disabled = false;
      btn.textContent = 'Save Changes';
    });

    loadSettings();
  </script>
</body>
</html>`;
}
