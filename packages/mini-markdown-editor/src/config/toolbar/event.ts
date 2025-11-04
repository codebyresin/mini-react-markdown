import type { ToolbarType } from "@/types/toolbar";
import { insertContent } from "@/utils/insert-content";
import { template, type TemplateVal } from "./template";

//! 这个文件使用insertContent的方法
//插入到编辑器内容
export const InsertTextEvent = (type: ToolbarType) => {
  const { content, selection } = template[type] as TemplateVal;
  insertContent.insertContent(content, selection);
};

// 上传图片(调用上传接口使用这个即可)
export const InsertImageEvent = (url: string, alt: string) => {
  const content = `![${alt}](${url})\n`;
  const selection = {
    anchor: 2,
    head: 2 + alt.length,
  };
  insertContent.insertContent(content, selection);
};

// 撤销
export const UndoEvent = () => {
  insertContent.undo();
};

// 重做
export const RedoEvent = () => {
  insertContent.redo();
};

// Emoji
export const InsertEmojiEvent = (emoji: any) => {
  insertContent.insertTextAtCursor(emoji.native);
  //完全替换文本
};
