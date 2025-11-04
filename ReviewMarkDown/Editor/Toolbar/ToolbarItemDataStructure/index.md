# datastructure

```js
[
    //图标展示，只需点击显示功能
  {
    type: "heading",
    icon: HeadingIcon(svg),
    title: 标题(*),
    list: [
        //递归类型
      {
        title: 一级标题(*),
        type: "heading-1",
        hotkey: {
            command:"Ctrl+1"(*),//快捷键
            description:"heading-1"(*)//介绍
        }
        onClick: () => InsertTextEvent("heading-1"),
        //点击以后运行的对应功能
      },
    ],
  },
  //只读，只写，帮助，目录，全屏，输出，保存，emjo,逻辑复杂，单独封装组件
  {
    type: "emoji",
    component: <Emoji />,
  },
  {
    type: "save",
    hotkey:hotkey: {
            command:"..."(*),
            description:"..."(*)
        },
    component: <Save />,
  },
  //图片有点特殊
 {
    type: "image",
    icon: ImageIcon,
    title: "图片",
    list: [
      {
        title: TOOLBAR_KEYS.TOOLBAR.IMAGE_ITEMS["image-link"](这是我们要封装的),
        type: "image-link",
        hotkey: Hotkey.LINK.toConfig()(同理),
        onClick: () => InsertTextEvent("image-link"),
      },
      {
        title: TOOLBAR_KEYS.TOOLBAR.IMAGE_ITEMS["image-upload"],
        type: "image-upload",
        //这里是二级菜单栏，不适用component(这个是一级显示工具，不适配下拉菜单)
      },
    ],
  },
];

>这里制定特殊节点
const render={
     "image-upload": <Upload />,
}as const
export type renderKey = keyof typeof render
//拿到键名

```

[具体配置](../../../../packages/mini-markdown-editor/src/config/toolbar/base.tsx)

# 记住这个 **defaultToolbar**，后面会用到

> 为了实现语言国际化，ios 与 mac 不同快捷键的显示，需要动态插入(\*)(标记的地方)，故不能写死，后期封装函数实现不同语言，不同系统转化

> **写完 datastructure 配置**就要开始封装对应配置对应 title，快捷键
> [](./type.md)

---

## onClick: () => InsertTextEvent("image-link")

```js
import { EditorView } from "@uiw/react-codemirror";
import { undo, redo } from "@codemirror/commands";
//定义一个事件插入类，点击插入内容
class InsertContent {
  private editorView:EditorView|null=null;
  //这里说个知识点，在ts里，类可以是类型
  编写插入逻辑
  1. 传入插入type进行匹配
  onClick: () => InsertTextEvent("table"),
  2. 匹配封装成对象,结构如下
  {
    'type(heading)':{
        content: `# `,
        selection: {
        anchor: 2,
        head: 2,
      },
    },
  }
  3. 获取数据，执行逻辑，更新数据
   view.dispatch({
      changes: {
        from: range.from,
        to: range.to,
        insert: content,
      },
      selection: {
        anchor: range.from + anchor, // 起点（固定点）
        head: range.from + head, // 终点（移动点）
      },
    });

}

```

> 具体代码
> [](../../../../packages/mini-markdown-editor/src/config/toolbar/event.ts) > [](../../../../packages/mini-markdown-editor/src/config/toolbar/template.ts)
> 插入了(# )后打印结果
> [这里打印了下 view.state](../../../img/view.state.png)

> 这里我来解释下对应属性，achor 是指下标，没过一行含一个\n，算一个下标
> 26 指在标后面那个位置

### 打印 view 大概结构

EditorView (可视层)
├── state: EditorState ✅ ← 公开 API，可直接用
├── plugins: [...] ← 插件列表
├── pluginMap: Map() ← 插件名 -> 插件实例
├── editorAttrs / contentAttrs ← HTML 属性
├── viewState: ViewState ← 内部对象（私有，不直接访问）
│ └── state: EditorState ← 实际引用的文档状态（与 view.state 同步）
└── ...
