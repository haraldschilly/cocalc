## 2025-02-18 - [Incomplete Style Attribute Sanitization]
**Vulnerability:** The custom `sanitize_html_attributes` function blocked `javascript:` at the start of attributes but missed it inside `style` attributes (e.g., `background: url(javascript:...)`).
**Learning:** Custom sanitizers often miss context-specific vectors like CSS injection. `normalizedValue` stripping whitespace is powerful but simple `startsWith` checks are insufficient for complex attributes like `style`.
**Prevention:** Block `style` attributes entirely if possible, or use a robust CSS parser/sanitizer. For simple regex-based sanitizers, ensure `style` content is checked for dangerous keywords (`javascript:`, `expression`) anywhere in the string, not just the start.
