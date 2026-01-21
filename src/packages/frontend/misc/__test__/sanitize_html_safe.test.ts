import { sanitize_html_safe } from "../sanitize";
import $ from "jquery";

// Mock jQuery global
(global as any).jQuery = $;

describe("sanitize_html_safe", () => {
  it("removes onclick handlers", () => {
    const html = '<div onclick="alert(1)">Click me</div>';
    const sanitized = sanitize_html_safe(html);
    expect(sanitized).toBe('<div>Click me</div>');
  });

  it("removes mixed case ONCLICK handlers", () => {
    const html = '<div ONCLICK="alert(1)">Click me</div>';
    const sanitized = sanitize_html_safe(html);
    expect(sanitized).toBe('<div>Click me</div>');
  });

  it("removes javascript: protocol", () => {
    const html = '<a href="javascript:alert(1)">Link</a>';
    const sanitized = sanitize_html_safe(html);
    expect(sanitized).toBe('<a>Link</a>');
  });

  it("removes mixed case JaVaScRiPt: protocol", () => {
    const html = '<a href="JaVaScRiPt:alert(1)">Link</a>';
    const sanitized = sanitize_html_safe(html);
    expect(sanitized).toBe('<a>Link</a>');
  });

  it("removes javascript: protocol with whitespace", () => {
     const html = '<a href="java script:alert(1)">Link</a>';
     const sanitized = sanitize_html_safe(html);
     expect(sanitized).toBe('<a>Link</a>');
  });

   it("removes javascript: protocol with newline", () => {
     const html = '<a href="java\nscript:alert(1)">Link</a>';
     const sanitized = sanitize_html_safe(html);
     expect(sanitized).toBe('<a>Link</a>');
  });
});
