import { sanitize_html_attributes } from "../misc";

describe("sanitize_html_attributes bug repro", () => {
  // Mock jQuery with live collection behavior
  const $ = (node: { attributes: any[] }) => ({
    removeAttr: (name: string) => {
        // Simulates removing from a live collection (array)
        const idx = node.attributes.findIndex((a) => a.name === name);
        if (idx !== -1) {
          node.attributes.splice(idx, 1);
        }
    },
  });

  // Mock $.makeArray to create a static copy
  ($ as any).makeArray = (collection: any) => {
    return Array.from(collection || []);
  };

  // Mock $.each to iterate by index, which exposes the bug when modifying live collections
  ($ as any).each = (collection: any, callback: Function) => {
    if (!collection) return;
    for (let i = 0; i < collection.length; i++) {
        const item = collection[i];
        if (item) {
             callback.call(item);
        }
    }
  };

  test("skips consecutive unsafe attributes when iterating live collection", () => {
    const node = {
      attributes: [
        { name: "onload", value: "alert(1)" },
        { name: "onerror", value: "alert(2)" }, // This might be skipped if fix is not applied
        { name: "class", value: "test" },
      ],
    };

    // We expect both onload and onerror to be removed.
    sanitize_html_attributes($, node);

    const names = node.attributes.map(a => a.name);

    // With the fix, "onerror" should NOT be present.
    expect(names).not.toContain("onerror");
    expect(names).not.toContain("onload");
    expect(names).toContain("class");
  });
});
