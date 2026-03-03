import { getCommonHead } from "./shared";

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
  if (!markdown) return "";
  
  let html = markdown;
  
  // Convert headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Convert bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" style="color: var(--accent); text-decoration: none;">$1</a>');
  
  // Convert unordered lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Convert paragraphs (lines separated by blank lines)
  const lines = html.split('\n');
  let inList = false;
  let result: string[] = [];
  let currentParagraph: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we're in a list
    if (line.startsWith('<ul>') || line.startsWith('<li>')) {
      if (currentParagraph.length > 0) {
        result.push('<p>' + currentParagraph.join(' ') + '</p>');
        currentParagraph = [];
      }
      inList = true;
      result.push(line);
      continue;
    }
    
    if (line === '</ul>') {
      inList = false;
      result.push(line);
      continue;
    }
    
    // Skip if it's already a header or empty
    if (line.startsWith('<h') || line === '') {
      if (currentParagraph.length > 0 && !inList) {
        result.push('<p>' + currentParagraph.join(' ') + '</p>');
        currentParagraph = [];
      }
      if (line) result.push(line);
      continue;
    }
    
    // If we're in a list, just add the line
    if (inList) {
      result.push(line);
      continue;
    }
    
    // Accumulate paragraph text
    currentParagraph.push(line);
  }
  
  // Add any remaining paragraph
  if (currentParagraph.length > 0) {
    result.push('<p>' + currentParagraph.join(' ') + '</p>');
  }
  
  return result.join('\n');
}

export function termsPage(settings: { logo_path: string; submission_consent_agreement_text: string }): string {
  const agreementHtml = markdownToHtml(settings.submission_consent_agreement_text || "");
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
${getCommonHead(settings.logo_path)}
<title>Terms & Agreements</title>
<meta name="description" content="Content Consent & Data Use Agreement for Fan Clips">
<meta property="og:title" content="Terms & Conditions - Fan Clips">
<meta property="og:description" content="Content Consent & Data Use Agreement">
<meta property="og:type" content="website">
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
    background: #000000;
    color: var(--white);
    font-family: 'Nexa', sans-serif;
    min-height: 100vh;
  }

  .video-bg {
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: -2; width: 488px; height: 488px; object-fit: cover; opacity: 0.3;
  }

  .noise {
    position: fixed; inset: 0; z-index: -1; pointer-events: none; opacity: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 256px;
  }

  .layout {
    position: relative; z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  .header { text-align: center; margin-bottom: 40px; }

  .header .brand {
    max-width: 250px;
    margin: 0 auto 24px;
  }

  .header .brand img {
    width: 100%;
    height: auto;
    display: block;
  }

  .back-link {
    display: inline-block;
    margin-bottom: 24px;
    font-family: 'Nexa', sans-serif;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--accent);
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .back-link:hover {
    opacity: 0.8;
    text-decoration: underline;
  }

  .terms-container {
    background: rgba(17, 17, 17, 0.6);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 40px 32px;
    line-height: 1.8;
  }

  .terms-container h1 {
    font-family: 'Nexa', sans-serif;
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 24px;
    margin-top: 32px;
    color: var(--white);
  }

  .terms-container h1:first-child {
    margin-top: 0;
  }

  .terms-container h2 {
    font-family: 'Nexa', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 12px;
    margin-top: 24px;
    color: var(--accent);
  }

  .terms-container h3 {
    font-family: 'Nexa', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 10px;
    margin-top: 20px;
    color: var(--white);
  }

  .terms-container p {
    color: var(--gray);
    margin-bottom: 12px;
    font-size: 0.95rem;
  }

  .terms-container ul {
    margin-left: 20px;
    margin-bottom: 12px;
    color: var(--gray);
    font-size: 0.95rem;
  }

  .terms-container li {
    margin-bottom: 8px;
    list-style-type: disc;
  }

  .terms-container a {
    color: var(--accent);
    text-decoration: none;
  }

  .terms-container a:hover {
    text-decoration: underline;
  }

  .terms-container strong {
    color: var(--white);
    font-weight: 600;
  }

  .terms-footer {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    text-align: center;
  }

  .cta-button {
    display: inline-block;
    margin-top: 24px;
    background: #000000;
    color: #fff;
    border: 3px solid #ffffff;
    border-radius: 999px;
    padding: 12px 28px;
    font-family: 'Nexa', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
  }

  .cta-button:hover {
    background: #ffffff;
    color: #000000;
  }

  @media (max-width: 768px) {
    .layout { padding: 24px 16px 60px; }
    .header .brand { max-width: 180px; }
    .terms-container { padding: 24px 20px; }
    .terms-container h1 { font-size: 1.4rem; }
    .terms-container h2 { font-size: 1.1rem; }
  }
</style>
</head>
<body>
  <video class="video-bg" autoplay muted loop playsinline>
    <source src="/Looped-Album-Symbol-Main-Piece.webm" type="video/webm">
  </video>
  <div class="noise"></div>
  <div class="layout">
    <div class="header">
      <a href="/" class="back-link">&larr; Back to Gallery</a>
      ${settings.logo_path ? `<div class="brand"><img src="${settings.logo_path}" alt="Logo"></div>` : ''}
    </div>

    <div class="terms-container">
      ${agreementHtml || '<h1>Terms & Conditions</h1><p>No agreement text has been configured yet.</p>'}
      
      <div class="terms-footer">
        <a href="/" class="cta-button">Return to Gallery</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}
