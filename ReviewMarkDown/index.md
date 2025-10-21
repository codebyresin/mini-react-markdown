# markdown 编辑器

这个项目主要分为两个模块，分别是 mini-markdown-ast-parser，mini-markdown-editor,这两个子包用 monmorepo 管理

那么问题来了？什么是 monmorepo?
[monmorepo](./monmorepo.md)

## 项目原图

[原型图](./img/styleshow.png)
[使用](./img/use.png)
[使用代码文件](../packages/mini-markdown-editor/src/App.tsx)

1. 支持语言国际化
2. 支持工具栏扩展
3. 支持快捷键使用
4. 支持图片拖拽上传
5. 支持图片粘贴
6. 支持主题切换

### 如何实现？

> 使用 context 上下文 Provider
> 配置默认属性，定义类型

> 这里基于 codemirror 第三方文本编辑器库实现编辑
> 这里要提到一个类型的获取剔除

[定义类型](../packages/mini-markdown-editor/src/types/global-config.ts)
[图解](./img/global_part.png)

```js
import {
  EditorView,
  ReactCodeMirrorProps,
  ViewUpdate,
} from "@uiw/react-codemirror";

export type GlobalContextConfig = Pick<
  | GlobalConfig
  | "theme"
  | "locale"
  | "value"
  | "toolbars"
  | "status"
  | "local"
  | "autoFocus"
  | "lineNumbers"
  | "enableShortcuts"
  | "onUpload"
  | "onDragUpload"
  | "onPatseUpload"
  | "onSave"
  | "onChange"
>;
**从GlobalConfig选取后面的类型**

export type EditorConfig = Omit<GlobalConfig, keyof GlobalContextConfig>;
**从GlobalConfig剔除GlobalContextConfig类型**

```

## ✨ 最终理解一句话总结

> GlobalConfig 是所有配置的母体
> 它继承自 ReactCodeMirrorProps（外部库定义），
> 然后用 Pick 和 Omit 拆分成：
> GlobalContextConfig（全局共享）
> EditorConfig（局部编辑器实例）

[默认属性](../packages/mini-markdown-editor/src/config/global.ts)

## 工具栏

[工具栏](./img/toolbar.png)

> 这一段用数组遍历渲染
> 图标是用 svg 写的，有关 svg 的配置写法

[svg](./Editor/Toolbar/Svg/svg.md)

## 使用数组遍历数据，数据结构:

> [toolbarItem](./Editor/Toolbar/ToolbarItemDataStructure/index.md)

> 有些工具 item 用下拉菜单，有些只需提示，故封装两个组件
> [dropdown 封装](./Editor/Toolbar/DropDown/index.md)

> 接下来再封装提示框
> [tooltip 封装](./Editor/Toolbar/IconTooltip/index.md)

# 关于工具栏完成渲染相关组件

## 这里还有只有 component 属性的数据结构要单独定义组件写逻辑

## 这个项目很喜欢划分模块，组件就渲染，逻辑放在 hooks 和 utils 里

## 在学接下来的东西，先把这个代码看了

[默认配置](../packages/mini-markdown-editor/src/config/global.ts)
[全局上下文](../packages/mini-markdown-editor/src/components/Providers/config-provider.tsx)

```js
定义一个defaultGlobalConfig默认配置对象;
const ConfigContext = createContext(defaultGlobalConfig); //创建上下文对象
// 定义组件(接受children,config?)
<ConfigContext.Provider
  value={{ ...defaultGlobalConfig, ...config }}
></ConfigContext.Provider>;
因为上下文每次都要使用const context = useContext(ConfigContext);
把它放在usehook文件里面use-global-config.ts

定义global类
class Global {
  private config: GlobalConfig = {};
  private view: EditorView | null = null;

  public setGlobalConfig(config: GlobalConfig, view: EditorView) {
    this.config = config;
    this.view = view;
  }

  public saveHotKeyHandle() {
    if (!this.view) {
      return;
    }
    const content = this.view.state.doc.toString();
    //这个save是外部调用可以添加的逻辑，
    const onSave = this.config.onSave;
    if (content) {
      // onSave回调
      if (onSave) {//全局用户传递的onsavve函数
        onSave(content, this.view!);
      }
    }
  }
}

export const global = new Global();


use-global-config.ts

const context = useContext(ConfigContext);
const editorView = useEditorContentStore((state) => state.editorView);
 global.setGlobalConfig(context, editorView);//初始化global
return context;//这个文件就是返回这个上下文配置对象
```

[主渲染](../packages/mini-markdown-editor/src/components/Toolbar/index.tsx)

## 这里主渲染里有这么一串代码

### const toolbars = toolbarConfig.getAllToolbars();

> 这个地方的作用是获取工具栏配置，为什么不用 **defaultToolbar**
> 我们要让这个 Toolbar 自定义化，可扩展，可删除......
> 因此要把它统一管理状态
> [源码](../packages/mini-markdown-editor/src/config/toolbar/index.ts)

# [解释](./Editor/Toolbar/ToolbarItemDataStructure/toolbarConfig.md)

## 这里还有关于 toolbar 的 crud 操作，建议看下文档 docs 文件里的 api

> 其中直接填写配置的 crud 在[源码](../packages/mini-markdown-editor/src/components/Providers/toolbar-provider.tsx)

```js
对应关系图
挂载组件 →
  useCallback 创建 updateToolbars（缓存函数） →
  useEffect 调用 updateToolbars →
    调用 toolbarManager.getDefaultToolbar()
    → processToolbars(配置处理)
    → setToolbars(更新 state)
  useMemo 缓存 value → 提供给 ToolbarContext.Provider
```

### useSyncEditorView();

> 对于 useSyncEditorVie 的 setEditorView 和 useEditorContentStore 的 setEditorView 区别作用

```js
+------------------+           +------------------+          +------------------+
|                  |           |                  |          |                  |
| Editor 组件      |---------->| editorView        |<---------| 工具函数/其他组件 |
|                  | 调用      | (状态管理中存储    | 读取     |                  |
| handleCreate     |---------->| 编辑器实例)       |----------| insertContent    |
| handleChange     |           |                  |          | handleScroll     |
|                  |           |                  |          | useExposeHandle  |
+------------------+           +------------------+
         |                          ^
         |                          |
         v                          |
+------------------+                |
|                  |                |
| setEditorViewInstance |-----------+ (更新)
|                  |
+------------------+
         |
         v
+------------------+
|                  |
| setEditorView    |
| (Zustand action) |
|                  |
+------------------+

在Editor组件里调用useEditorContentStore获取editorView，setEditorView，然后
创建setEditorViewInstance 函数作为中间层，它既更新状态，也保存到 ref：
```

[分类渲染下拉还是提示](../packages/mini-markdown-editor/src/components/Toolbar/ToolbarItem.tsx)

[Editor 组件](./Editor/Editor_Preview/editor.md)
