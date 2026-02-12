## 2025-02-18 - Unsanitized Style Attributes
**Vulnerability:** The `sanitize_html_attributes` function sanitized `javascript:` protocols only at the start of attribute values, leaving `style` attributes vulnerable to XSS via `background-image: url(javascript:...)`.
**Learning:** Sanitizers must treat `style` attributes differently than URL attributes (like `href`), as dangerous payloads can be embedded anywhere within the CSS string, not just at the start.
**Prevention:** Explicitly block `style` attributes containing `javascript:`, `vbscript:`, or `expression` unless a full CSS parser/sanitizer is used.
