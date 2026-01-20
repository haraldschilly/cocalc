
import $ from "jquery";
import { sanitize_html_safe } from "./sanitize";

(global as any).jQuery = $;
(global as any).$ = $;

describe("sanitize_html_safe", () => {
  it("removes script tags", () => {
    const input = "<div><script>alert(1)</script></div>";
    const output = sanitize_html_safe(input);
    expect(output).not.toContain("<script>");
  });

  it("removes onclick handlers", () => {
    const input = "<div onclick='alert(1)'>Click me</div>";
    const output = sanitize_html_safe(input);
    expect(output).not.toContain("onclick");
  });

  it("removes javascript: hrefs", () => {
    const input = "<a href='javascript:alert(1)'>Click me</a>";
    const output = sanitize_html_safe(input);
    expect(output).not.toContain("javascript:");
  });

  it("removes img onerror", () => {
      const input = "<img src=x onerror=alert(1) />";
      const output = sanitize_html_safe(input);
      expect(output).not.toContain("onerror");
  });

  // Potential bypasses
  it("removes mixed case ONCLICK", () => {
      const input = "<div ONCLICK='alert(1)'>Click me</div>";
      const output = sanitize_html_safe(input);
      expect(output.toLowerCase()).not.toContain("onclick");
  });

  it("removes mixed case JavaScript:", () => {
      const input = "<a href='JavaScript:alert(1)'>Click me</a>";
      const output = sanitize_html_safe(input);
      // We expect the href to be removed or sanitized
      expect(output).not.toContain("JavaScript:");
  });

  it("removes javascript: with whitespace", () => {
      // Browsers might execute this: <a href=" javascript:alert(1)">
      const input = "<a href=' javascript:alert(1)'>Click me</a>";
      const output = sanitize_html_safe(input);
      expect(output).not.toContain("javascript:");
  });

  it("removes javascript: with encoded characters", () => {
      // The browser/parser decodes entities before our sanitization check if we are using a DOM parser.
      // However, sanitize_html uses jquery.parseHTML.
      // Let's ensure the output is safe.
      const input = "<a href='&#106;avascript:alert(1)'>Click me</a>";
      const output = sanitize_html_safe(input);
      // We expect the href to be removed or the protocol to be broken.
      // If the parser decodes it, our new logic should catch it (stripped of non-alphanumeric/control).
      // If it doesn't decode it, it's not a valid protocol for the browser either (usually).
      expect(output).not.toContain("&#106;avascript:");
      expect(output).not.toContain("javascript:");
  });
});
