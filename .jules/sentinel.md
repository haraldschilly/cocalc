## 2024-05-23 - CSS Injection in style attributes
**Vulnerability:** The `sanitize_html_attributes` function allowed `style` attributes to contain `javascript:`, `vbscript:`, and `expression(...)` vectors, leading to potential XSS in older browsers or specific contexts.
**Learning:** Normalization of attribute values (removing whitespace, lowercasing) is crucial but must be paired with comprehensive checks for all dangerous prefixes and keywords within the normalized value, especially for `style` attributes which have complex syntax.
**Prevention:** Explicitly block `javascript:`, `vbscript:`, and `expression(` within `style` attributes after normalization.
