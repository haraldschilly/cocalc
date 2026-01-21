import { sanitize_html_attributes } from "../misc";

describe("sanitize_html_attributes", () => {
  const mockRemoveAttr = jest.fn();
  const mockJQuery = jest.fn((node) => ({
    removeAttr: mockRemoveAttr,
  }));
  mockJQuery.each = (collection, callback) => {
    if (collection) {
      for (let i = 0; i < collection.length; i++) {
        callback.call(collection[i]);
      }
    }
  };

  beforeEach(() => {
    mockRemoveAttr.mockClear();
  });

  test("removes attributes starting with 'on'", () => {
    const node = {
      attributes: [
        { name: "onclick", value: "alert(1)" },
        { name: "class", value: "test" },
      ],
    };

    sanitize_html_attributes(mockJQuery, node);

    expect(mockRemoveAttr).toHaveBeenCalledWith("onclick");
    expect(mockRemoveAttr).not.toHaveBeenCalledWith("class");
  });

  test("removes attributes with javascript: protocol", () => {
    const node = {
      attributes: [
        { name: "href", value: "javascript:alert(1)" },
        { name: "href", value: "http://example.com" },
      ],
    };

    sanitize_html_attributes(mockJQuery, node);

    expect(mockRemoveAttr).toHaveBeenCalledWith("href");
  });

  test("SECURITY FIX: removes mixed case 'ON'", () => {
    const node = {
      attributes: [
        { name: "ONCLICK", value: "alert(1)" },
      ],
    };

    sanitize_html_attributes(mockJQuery, node);

    expect(mockRemoveAttr).toHaveBeenCalledWith("ONCLICK");
  });

  test("SECURITY FIX: removes mixed case 'javascript:'", () => {
    const node = {
      attributes: [
        { name: "href", value: "JaVaScRiPt:alert(1)" },
      ],
    };

    sanitize_html_attributes(mockJQuery, node);

    expect(mockRemoveAttr).toHaveBeenCalledWith("href");
  });

  test("SECURITY FIX: removes 'javascript:' with whitespace", () => {
    const node = {
      attributes: [
        { name: "href", value: "java script:alert(1)" },
      ],
    };

    sanitize_html_attributes(mockJQuery, node);

    expect(mockRemoveAttr).toHaveBeenCalledWith("href");
  });

  test("SECURITY FIX: removes 'javascript:' with newline", () => {
    const node = {
      attributes: [
        { name: "href", value: "java\nscript:alert(1)" },
      ],
    };

    sanitize_html_attributes(mockJQuery, node);

    expect(mockRemoveAttr).toHaveBeenCalledWith("href");
  });
});
