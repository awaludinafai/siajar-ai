import { marked } from 'marked';
import { cleanMarkdownForDisplay } from './formatMarkdown';

export function slugifyFilename(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60) || 'perangkat-ajar'
  );
}

export function downloadAsWordDoc(markdown: string, title: string): void {
  const cleaned = cleanMarkdownForDisplay(markdown, { preserveBreakToken: true }).replace(
    /\s*\[\[SIAJAR_BR\]\]\s*/g,
    '<br />'
  );
  const renderedHtml = marked.parse(cleaned, { gfm: true, breaks: true }) as string;

  const htmlDocument = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40"
      lang="id">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  @page {
    size: A4;
    margin: 2.2cm 2.2cm 2.2cm 2.2cm;
  }
  body {
    font-family: "Calibri", "Segoe UI", Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.55;
    color: #1e293b;
  }
  h1 {
    font-size: 16pt;
    color: #1e1b4b;
    border-bottom: 1.5pt solid #4338ca;
    padding-bottom: 6pt;
    margin-top: 0;
    margin-bottom: 12pt;
  }
  h2 {
    font-size: 13pt;
    color: #1e3a8a;
    margin-top: 16pt;
    margin-bottom: 6pt;
  }
  h3 {
    font-size: 11.5pt;
    color: #0f172a;
    margin-top: 12pt;
    margin-bottom: 4pt;
  }
  p {
    margin: 0 0 8pt 0;
  }
  ul, ol {
    margin: 4pt 0 10pt 0;
    padding-left: 18pt;
  }
  li {
    margin-bottom: 3pt;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10pt 0 14pt 0;
    font-size: 10pt;
  }
  th, td {
    border: 1pt solid #cbd5e1;
    padding: 6pt 8pt;
    text-align: left;
    vertical-align: top;
  }
  th {
    background-color: #eef2ff;
    color: #1e1b4b;
    font-weight: bold;
  }
  blockquote {
    border: 1pt solid #cbd5e1;
    background-color: #f8fafc;
    padding: 8pt 12pt;
    margin: 8pt 0;
  }
  code {
    font-family: "Consolas", monospace;
    font-size: 9.5pt;
    background-color: #f1f5f9;
    padding: 1pt 3pt;
  }
</style>
</head>
<body>
${renderedHtml}
</body>
</html>`;

  const blob = new Blob(['\ufeff', htmlDocument], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${slugifyFilename(title)}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
