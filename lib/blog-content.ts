import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "p", "br", "h2", "h3", "h4", "strong", "em", "u", "s", "blockquote",
  "ul", "ol", "li", "a", "code", "pre", "hr",
];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function convertLegacyHeadingParagraphs(value: string) {
  return value
    .replace(/<p>\s*###\s*([\s\S]*?)<\/p>/gi, "<h3>$1</h3>")
    .replace(/<p>\s*##\s*([\s\S]*?)<\/p>/gi, "<h2>$1</h2>")
    .replace(/<(h[2-4])>\s*#{1,6}\s*/gi, "<$1>");
}

function legacyContentToHtml(value: string) {
  return value
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      const content = escapeHtml(trimmed).replace(/\n/g, "<br>");
      if (trimmed.startsWith("### ")) return `<h3>${content.slice(4)}</h3>`;
      if (trimmed.startsWith("## ")) return `<h2>${content.slice(3)}</h2>`;
      return `<p>${content}</p>`;
    })
    .join("");
}

export function sanitizeBlogContent(value: string) {
  return sanitizeHtml(convertLegacyHeadingParagraphs(value), {
    allowedTags,
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attributes) => ({
        tagName: "a",
        attribs: {
          ...attributes,
          rel: "noopener noreferrer nofollow",
          ...(attributes.target === "_blank" ? { target: "_blank" } : {}),
        },
      }),
    },
  });
}

export function blogContentToHtml(value: string) {
  const content = /<(?:p|h[1-6]|ul|ol|blockquote|pre|hr)\b/i.test(value)
    ? value
    : legacyContentToHtml(value);
  return sanitizeBlogContent(content);
}
