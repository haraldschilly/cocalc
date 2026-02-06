## 2025-02-12 - Block Unsafe Data URIs
**Vulnerability:** The HTML sanitizer allowed arbitrary `data:` URIs, enabling XSS via `data:text/html` or `data:application/javascript` attributes in `<a>` tags or `<object>` tags (if allowed).
**Learning:** Sanitizers that rely on protocol blocklists (like blocking `javascript:`) must also block `data:` URIs (or allow-list only specific MIME types like `image/`) because browsers can execute scripts from `data:` URIs.
**Prevention:** Explicitly check for and block `data:` schemes unless they match a safe allow-list (e.g., `data:image/`).
