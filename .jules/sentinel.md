## 2025-02-20 - HTML Attribute Sanitization Gap
**Vulnerability:** `sanitize_html_attributes` in `src/packages/util/misc.ts` allowed `javascript:`, `vbscript:`, and `expression()` within `style` attributes, enabling XSS via CSS injection (e.g., `background-image: url('javascript:alert(1)')`).
**Learning:** The sanitizer focused on attribute values starting with protocols (like `href="javascript:..."`) but missed dangerous content *inside* CSS strings in `style` attributes. CSS injection vectors often don't start with the protocol.
**Prevention:** Explicitly check `style` attributes for dangerous keywords (`javascript:`, `vbscript:`, `expression(`) using `.includes()` rather than just `.startsWith()`.
