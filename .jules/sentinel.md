## 2025-02-14 - HTML Attribute Sanitization Bypass
**Vulnerability:** The custom `sanitize_html_attributes` function used simplistic string matching (`indexOf("javascript:") === 0`) to block XSS vectors. It failed to account for:
1. Mixed case attribute names (e.g., `ONCLICK` vs `onclick`).
2. Mixed case protocols (e.g., `JavaScript:`).
3. Leading whitespace/control characters in attribute values (e.g., ` javascript:`), which browsers ignore but the check missed.
**Learning:** Blacklist-based sanitization requires normalization (lowercasing, trimming, stripping control chars) to be effective. Simple prefix checks are insufficient against browser parsing leniency.
**Prevention:** Always normalize inputs before checking against a blacklist. Better yet, use established sanitization libraries (like `sanitize-html` which is already in dependencies) instead of custom regex/string matching where possible, though sometimes legacy constraints require patching existing logic.
