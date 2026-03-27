
import { get_key_display_string, SYMBOLS } from "../keyboard-utils";

describe("get_key_display_string", () => {
  it("converts special keys to symbols", () => {
    expect(get_key_display_string(8)).toBe(SYMBOLS.backspace);
    expect(get_key_display_string(13)).toBe(SYMBOLS.return);
    expect(get_key_display_string(32)).toBe(SYMBOLS.space);
    expect(get_key_display_string(40)).toBe(SYMBOLS.down);
    expect(get_key_display_string(38)).toBe(SYMBOLS.up);
    expect(get_key_display_string(46)).toBe(SYMBOLS.delete);
  });

  it("converts Escape to Esc", () => {
    expect(get_key_display_string(27)).toBe("Esc");
  });

  it("converts ASCII codes to characters", () => {
    expect(get_key_display_string(65)).toBe("A");
    expect(get_key_display_string(90)).toBe("Z");
    expect(get_key_display_string(48)).toBe("0");
    expect(get_key_display_string(57)).toBe("9");
  });
});
