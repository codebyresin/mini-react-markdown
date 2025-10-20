/**
 * @基于EditorView插入内容类封装
 * @导出一个具有对应方法的实例
 */

import { EditorView } from "@uiw/react-codemirror";
import { undo, redo } from "@codemirror/commands";

class InsertContent {
  private editorView: EditorView | null = null;
  public setEditorView(view: EditorView | null) {
    this.editorView = view;
  }
  //插入内容,可以将选中文本整合到新内容中
  public insertContent(
    content: string,
    selection: {
      //选区start/end
      anchor: number;
      head: number;
    }
  ) {
    const view = this.editorView;
    if (!view) return;
    //获取光标
    view.focus();
    const range = view.state.selection.ranges[0]; //获取第一个选区

    console.log(view.state);

    let { head } = selection;
    const { anchor } = selection;

    // console.log(anchor, head);

    //不相等则选区状态
    if (range.from !== range.to) {
      //获取选区内容
      const selectedText = view.state.sliceDoc(range.from, range.to);
      content = content.slice(0, anchor) + selectedText + content.slice(head);
      head = anchor + selectedText.length;
    }
    //插入内容
    view.dispatch({
      changes: {
        from: range.from,
        to: range.to,
        insert: content,
      },
      selection: {
        anchor: range.from + anchor,
        head: range.from + head,
      },
    });
    console.log(view.state);
    // console.log(range);
    // console.log(view);
  }

  //模拟输入,直接替换选中文本
  public insertTextAtCursor(content: string) {
    const view = this.editorView;
    if (!view) return;
    view.focus();
    const range = view.state.selection.ranges[0];
    //插入内容，光标位置在内容末尾
    view.dispatch({
      changes: {
        from: range.from,
        to: range.to,
        insert: content,
      },
      // 将光标移动到插入内容的末尾
      selection: {
        anchor: range.from + content.length,
        head: range.from + content.length,
      },
    });
  }

  //撤销
  public undo() {
    const view = this.editorView;
    if (!view) return;
    undo(view);
  }
  //重做
  public redo() {
    const view = this.editorView;
    if (!view) return;
    redo(view);
  }
}
const insertContent = new InsertContent();

export { insertContent };
