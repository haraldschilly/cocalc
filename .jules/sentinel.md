## 2025-02-18 - HTML Attribute Sanitization Bypass
**Vulnerability:** The `sanitize_html_attributes` function in `src/packages/util/misc.ts` could be bypassed using obfuscation techniques like leading whitespace, control characters, or mixed casing in `javascript:` protocols.
**Learning:** Checking for malicious protocols (like `javascript:`) using exact string matching (`indexOf(...) === 0`) is insufficient. Browsers are permissive and will ignore whitespace and control characters in attributes, executing the payload.
**Prevention:** Always normalize input before validation. Convert to lowercase and strip all whitespace and control characters (`[\s\x00-\x1f]`) when checking for restricted protocols.
