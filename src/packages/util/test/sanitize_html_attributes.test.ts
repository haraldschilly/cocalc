
import { sanitize_html_attributes } from "../misc";

describe("sanitize_html_attributes", () => {
  // Mock jQuery-like object
  const mockJQuery = (node: any) => ({
    removeAttr: (name: string) => {
      if (!node.removedAttributes) node.removedAttributes = [];
      node.removedAttributes.push(name);
    }
  });

  // Mock $.each
  mockJQuery.each = (collection: any, callback: Function) => {
    // collection is node.attributes.
    // In DOM node.attributes is array-like.
    // Let's assume it's an array of objects {name, value}.
    for (let i = 0; i < collection.length; i++) {
        // In jQuery $.each, 'this' is the value.
        callback.call(collection[i], i, collection[i]);
    }
  };

  test("removes standard on* attributes", () => {
    const node = {
        attributes: [
            { name: "onload", value: "alert(1)" },
            { name: "class", value: "test" }
        ],
        removedAttributes: [] as string[]
    };
    sanitize_html_attributes(mockJQuery, node);
    expect(node.removedAttributes).toContain("onload");
    expect(node.removedAttributes).not.toContain("class");
  });

  test("removes standard javascript: href", () => {
    const node = {
        attributes: [
            { name: "href", value: "javascript:alert(1)" },
        ],
        removedAttributes: [] as string[]
    };
    sanitize_html_attributes(mockJQuery, node);
    expect(node.removedAttributes).toContain("href");
  });

  // Security bypass tests - these are expected to fail before the fix
  test("removes uppercase ON* attributes", () => {
    const node = {
        attributes: [
            { name: "ONLOAD", value: "alert(1)" },
        ],
        removedAttributes: [] as string[]
    };
    sanitize_html_attributes(mockJQuery, node);
    expect(node.removedAttributes).toContain("ONLOAD");
  });

  test("removes MixedCase ON* attributes", () => {
     const node = {
         attributes: [
             { name: "onClick", value: "alert(1)" },
         ],
         removedAttributes: [] as string[]
     };
     sanitize_html_attributes(mockJQuery, node);
     expect(node.removedAttributes).toContain("onClick");
   });

  test("removes uppercase JavaScript: href", () => {
    const node = {
        attributes: [
            { name: "href", value: "JavaScript:alert(1)" },
        ],
        removedAttributes: [] as string[]
    };
    sanitize_html_attributes(mockJQuery, node);
    expect(node.removedAttributes).toContain("href");
  });

  test("removes javascript: with whitespace", () => {
     const node = {
         attributes: [
             { name: "href", value: " javascript:alert(1)" }, // leading space
         ],
         removedAttributes: [] as string[]
     };
     sanitize_html_attributes(mockJQuery, node);
     expect(node.removedAttributes).toContain("href");
   });

   test("removes javascript: with control characters", () => {
      const node = {
          attributes: [
              { name: "href", value: "\x01javascript:alert(1)" },
          ],
          removedAttributes: [] as string[]
      };
      sanitize_html_attributes(mockJQuery, node);
      expect(node.removedAttributes).toContain("href");
    });
});
