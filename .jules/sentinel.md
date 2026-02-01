## 2024-05-23 - DOM Attribute Sanitization Bypass
**Vulnerability:** Iterating over a live `NamedNodeMap` (DOM attributes) while removing attributes caused subsequent unsafe attributes to be skipped (e.g., `<img onload=x onerror=y>`).
**Learning:** `jQuery.each` or simple loops over live DOM collections rely on indices. Removing items shifts indices, causing skips. Mocks in tests can mask this if they snapshot the collection (e.g., `[...collection].forEach`) when the real runtime does not.
**Prevention:** Always iterate over a static copy (snapshot) of a live collection when modifying it. Use `Array.from()` or `$.makeArray()` before iteration. Ensure test mocks realistically simulate live collection behavior (index-based access) rather than auto-snapshotting.
