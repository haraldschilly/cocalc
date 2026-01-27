/*
 *  This file is part of CoCalc: Copyright © 2020 Sagemath, Inc.
 *  License: MS-RSL – see LICENSE.md for details
 */

// See http://xahlee.info/comp/unicode_computing_symbols.html
export const SYMBOLS = {
  meta: "⌘",
  ctrl: "⌃",
  alt: "⌥",
  shift: "⇧",
  return: "⏎",
  space: "⌴",
  tab: "↹",
  down: "⬇",
  up: "⬆",
  backspace: "⌫",
  delete: "DEL",
};

export function get_key_display_string(keyCode: number): string {
  switch (keyCode) {
    case 8:
      return SYMBOLS.backspace;
    case 13:
      return SYMBOLS.return;
    case 32:
      return SYMBOLS.space;
    case 27:
      return "Esc";
    case 40:
      return SYMBOLS.down;
    case 38:
      return SYMBOLS.up;
    case 46:
      return SYMBOLS.delete;
    default:
      // This replicates legacy keyCode_to_chr behavior for backward compatibility
      // with existing command definitions that rely on 'which'
      const chrCode = keyCode % 48;
      return String.fromCharCode(keyCode >= 96 ? chrCode : keyCode);
  }
}
