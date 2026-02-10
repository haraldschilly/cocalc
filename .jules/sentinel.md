# Sentinel's Journal

## 2025-02-12 - HTML Sanitization: Blocking data: URIs
**Vulnerability:** The custom `sanitize_html_attributes` function in `src/packages/util/misc.ts` blocked `javascript:` and `vbscript:` protocols but allowed `data:` URIs in HTML attributes. This allowed potential XSS via base64-encoded scripts in `href` or `object` data attributes.
**Learning:** Generic attribute sanitization must explicitly block `data:` URIs unless they are strictly validated (e.g., `data:image/` on `src` attribute only). Assuming "unknown" protocols are safe is a dangerous default for user-generated content.
**Prevention:** Block `data:` protocol by default in `sanitize_html_attributes`. Allow exceptions only for specific, safe attribute/value combinations (like `src="data:image/..."`).
