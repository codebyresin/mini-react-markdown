import { BaseToolbarType } from "@/types/toolbar";

//!把heading映射为TOOLBAR.HEADING,且要类型判断,用于统一键，做不同翻译

export const TOOLBAR_KEYS = {
  TOOLBAR: {
    [BaseToolbarType.HEADING]: "TOOLBAR.HEADING",
    [BaseToolbarType.BOLD]: "TOOLBAR.BOLD",
    [BaseToolbarType.ITALIC]: "TOOLBAR.ITALIC",
    [BaseToolbarType.UNDERLINE]: "TOOLBAR.UNDERLINE",
    [BaseToolbarType.DELETE]: "TOOLBAR.DELETE",
    [BaseToolbarType.BLOCKQUOTE]: "TOOLBAR.BLOCKQUOTE",
    [BaseToolbarType.UL]: "TOOLBAR.UL",
    [BaseToolbarType.OL]: "TOOLBAR.OL",
    [BaseToolbarType.INLINECODE]: "TOOLBAR.INLINE_CODE",
    [BaseToolbarType.CODE]: "TOOLBAR.CODE",
    [BaseToolbarType.LINK]: "TOOLBAR.LINK",
    [BaseToolbarType.IMAGE]: "TOOLBAR.IMAGE",
    [BaseToolbarType.TABLE]: "TOOLBAR.TABLE",
    [BaseToolbarType.UNDO]: "TOOLBAR.UNDO",
    [BaseToolbarType.REDO]: "TOOLBAR.REDO",
    [BaseToolbarType.FULLSCREEN]: "TOOLBAR.FULLSCREEN",
    [BaseToolbarType.WRITE]: "TOOLBAR.WRITE",
    [BaseToolbarType.PREVIEW]: "TOOLBAR.PREVIEW",
    [BaseToolbarType.CONTENTS]: "TOOLBAR.CONTENTS",
    [BaseToolbarType.HELP]: "TOOLBAR.HELP",
    [BaseToolbarType.OUTPUT]: "TOOLBAR.OUTPUT",
    [BaseToolbarType.EMOJI]: "TOOLBAR.EMOJI",
    [BaseToolbarType.SAVE]: "TOOLBAR.SAVE",
    HEADING_ITEMS: {
      [BaseToolbarType.HEADING_1]: "TOOLBAR.HEADING_ITEMS.H1",
      [BaseToolbarType.HEADING_2]: "TOOLBAR.HEADING_ITEMS.H2",
      [BaseToolbarType.HEADING_3]: "TOOLBAR.HEADING_ITEMS.H3",
      [BaseToolbarType.HEADING_4]: "TOOLBAR.HEADING_ITEMS.H4",
      [BaseToolbarType.HEADING_5]: "TOOLBAR.HEADING_ITEMS.H5",
      [BaseToolbarType.HEADING_6]: "TOOLBAR.HEADING_ITEMS.H6",
    },
    IMAGE_ITEMS: {
      [BaseToolbarType.IMAGE_LINK]: "TOOLBAR.IMAGE_ITEMS.LINK",
      [BaseToolbarType.IMAGE_UPLOAD]: "TOOLBAR.IMAGE_ITEMS.UPLOAD",
    },
  },
  STATUS: {
    WORDS: "STATUS.WORDS",
    SYNC_SCROLL: "STATUS.SYNC_SCROLL",
    SCROLL_TOP: "STATUS.SCROLL_TOP",
  },
} as const;
