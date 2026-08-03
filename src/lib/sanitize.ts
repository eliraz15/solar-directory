import sanitizeHtml from "sanitize-html";

// Matches what the Tiptap toolbar in RichTextEditor can actually produce.
const ARTICLE_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "em", "h2", "h3", "ul", "ol", "li", "a", "blockquote"],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
};

export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, ARTICLE_SANITIZE_OPTIONS);
}
