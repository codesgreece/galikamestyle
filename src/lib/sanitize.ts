import sanitizeHtml from "sanitize-html";
import { marked } from "marked";

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "b",
    "i",
    "u",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "a",
    "blockquote",
    "img",
    "code",
    "pre",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer",
      target: "_blank",
    }),
  },
};

export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, sanitizeOptions);
}

export async function markdownToSafeHtml(markdown: string): Promise<string> {
  const raw = await marked.parse(markdown, { gfm: true, breaks: true });
  return sanitizeBlogHtml(typeof raw === "string" ? raw : String(raw));
}

export function looksLikeHtml(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

export async function renderBlogContent(content: string): Promise<string> {
  if (!content.trim()) return "";
  if (looksLikeHtml(content)) return sanitizeBlogHtml(content);
  return markdownToSafeHtml(content);
}
