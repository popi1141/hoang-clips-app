export function getFaviconLinks(logoUrl?: string): string {
  if (!logoUrl) {
    return '';
  }
  
  return `
<link rel="icon" type="image/png" sizes="32x32" href="${logoUrl}">
<link rel="icon" type="image/png" sizes="16x16" href="${logoUrl}">
<link rel="apple-touch-icon" sizes="180x180" href="${logoUrl}">
`;
}

export function getCommonHead(logoUrl?: string): string {
  return `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${getFaviconLinks(logoUrl)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<link href="https://fonts.cdnfonts.com/css/nexa" rel="stylesheet">
<script>
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
</script>
`;
}

// Keep the old export for backward compatibility, but mark as deprecated
export const COMMON_HEAD = getCommonHead();