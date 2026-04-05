export function parseMarkdown(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Fenced code blocks
  html = html.replace(
    /```([\w]*)\n([\s\S]*?)```/gm,
    (_: string, lang: string, code: string) => {
      return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
    },
  );

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headings
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Blockquote
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  // Unordered lists
  html = html.replace(/^[\-*] (.+)$/gm, "<li>$1</li>");
  html = html.replace(
    /(<li>[\s\S]*?<\/li>\n?)+/g,
    (block: string) => `<ul>${block}</ul>`,
  );

  // Ordered lists (simple)
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>',
  );

  // Paragraphs
  const lines = html.split("\n");
  const result: string[] = [];
  let inParagraph = false;
  for (const line of lines) {
    const trimmed = line.trim();
    const isBlock = /^<(h[1-6]|ul|ol|li|pre|blockquote)/.test(trimmed);
    if (trimmed === "") {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
    } else if (isBlock) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
      result.push(trimmed);
    } else {
      if (!inParagraph) {
        result.push("<p>");
        inParagraph = true;
      }
      result.push(trimmed);
    }
  }
  if (inParagraph) result.push("</p>");
  return result.join("\n");
}
