import { sanitize_html_attributes } from "../misc";

describe("sanitize_html_attributes", () => {
  // Mock jQuery
  const $ = (node: { attributes?: { name: string; value: string }[] }) => ({
    removeAttr: (name: string) => {
      if (node.attributes) {
        const idx = node.attributes.findIndex((a) => a.name === name);
        if (idx !== -1) {
          node.attributes.splice(idx, 1);
        }
      }
    },
  });

  // Cast to any to add the static 'each' method
  ($ as any).each = (collection: any, callback: Function) => {
    if (!collection) return;
    // Iterate using index and checking length dynamically,
    // mimicking behavior on live collections without snapshotting.
    // This ensures that if the code doesn't snapshot (e.g. using makeArray),
    // the test will fail on consecutive removals.
    for (let i = 0; i < collection.length; i++) {
        callback.call(collection[i], i, collection[i]);
    }
  };

  // Add makeArray mock to support the fix
  ($ as any).makeArray = (arr: any) => [...arr];

  test("removes standard onload attribute", () => {
    const node = {
      attributes: [
        { name: "onload", value: "alert(1)" },
        { name: "class", value: "test" },
      ],
    };
    sanitize_html_attributes($, node);
    expect(node.attributes).toHaveLength(1);
    expect(node.attributes[0].name).toBe("class");
  });

  test("removes ONLOAD attribute (case insensitivity)", () => {
    const node = {
      attributes: [
        { name: "ONLOAD", value: "alert(1)" },
        { name: "class", value: "test" },
      ],
    };
    sanitize_html_attributes($, node);
    expect(node.attributes).toHaveLength(1);
    expect(node.attributes[0].name).toBe("class");
  });

  test("removes javascript: href", () => {
    const node = {
      attributes: [{ name: "href", value: "javascript:alert(1)" }],
    };
    sanitize_html_attributes($, node);
    expect(node.attributes).toHaveLength(0);
  });

  test("removes JaVaScRiPt: href (case insensitivity)", () => {
    const node = {
      attributes: [{ name: "href", value: "JaVaScRiPt:alert(1)" }],
    };
    sanitize_html_attributes($, node);
    expect(node.attributes).toHaveLength(0);
  });

  test("removes javascript: with whitespace", () => {
    const node = {
      attributes: [{ name: "href", value: " javascript:alert(1)" }],
    };
    sanitize_html_attributes($, node);
    expect(node.attributes).toHaveLength(0);
  });

  test("removes javascript: with control characters", () => {
    const node = {
      attributes: [{ name: "href", value: "java\tscript:alert(1)" }],
    };
    sanitize_html_attributes($, node);
    expect(node.attributes).toHaveLength(0);
  });

  test("removes vbscript: href", () => {
    const node = {
      attributes: [{ name: "href", value: "vbscript:msgbox(1)" }],
    };
    sanitize_html_attributes($, node);
    expect(node.attributes).toHaveLength(0);
  });

  test("keeps safe href values", () => {
    const node = {
      attributes: [{ name: "href", value: "https://example.com" }],
    };
    sanitize_html_attributes($, node);
    expect(node.attributes).toHaveLength(1);
    expect(node.attributes[0].name).toBe("href");
  });

  test("handles consecutive unsafe attributes correctly (regression test for skipping bug)", () => {
    const node = {
      attributes: [
        { name: "onload", value: "alert(1)" },
        { name: "onerror", value: "alert(2)" },
        { name: "class", value: "test" },
      ],
    };
    sanitize_html_attributes($, node);

    // Ensure all unsafe attributes are removed
    expect(node.attributes).toHaveLength(1);
    expect(node.attributes[0].name).toBe("class");

    const onerror = node.attributes.find(a => a.name === "onerror");
    expect(onerror).toBeUndefined();
  });
});
