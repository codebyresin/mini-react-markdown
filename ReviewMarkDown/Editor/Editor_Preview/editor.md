# editor

[源码](../../../packages/mini-markdown-editor/src/components/Editor/index.tsx)

## 核心渲染组件

<CodeMirror
onCreateEditor={handleCreate}
theme={theme}
value={content}
extensions={extensions}
basicSetup={{
          lineNumbers: lineNumbers || false,
          foldGutter: false,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          searchKeymap: false,
          autocompletion: false,
          defaultKeymap: true,
        }}
onChange={handleChange}
onMouseEnter={handleMouseEnter}
/>

> 让父组件上面的按钮获取子组件的 api，用 ref 暴露
> **const editorRef = useRef<EditorView>()**

## handleCreate

```js
//  onCreateEditor 创建后将 editorview 传递出去
const setEditorViewInstance = useCallback(
  (view: EditorView) => {
    setEditorView(view);
    editorViewRef.current = view;
  },
  [editorViewRef]
);
```

### 关于 useCallback 使用场景

> 函数传给子组件
> 函数放在 useEffect/useMemo 依赖中
> 函数依赖复杂的外部变量
> **函数只在组件内部使用，不依赖外部**这个不用

## 有关于 CodeMirror 6 的 extensions

const extensions = [
markdown(), // Markdown 支持
oneDark, // 主题
keymap.of(defaultKeymap), // 键盘快捷键
events.scroll(...), // 滚动监听扩展
myCustomExtension(), // 自定义扩展
]

也就是说得建一个数组，添加对应的逻辑,因此封装

> **createEditorExtensions**这个函数用来集成这些需要用的配置，返回一个数组，用 usemoemo 缓存，绑定到 cm 的 extension

## extension

extension
├── event.ts(图片处理)
├── hotkeys(快捷键)
├── index(集成返回数组)
└── markdown

## event

ImageHandler 是一个封装类，用于处理编辑器中的图片插入与上传。
它的核心功能包括：

> **两个方法 destroy(销毁)handleImageFile(处理上传)**
> 接收一个图片 File 对象（通常来自拖拽或选择文件）。
> 创建一个临时预览 URL，让用户马上看到图片效果。
> 调用上传函数，把图片上传到服务器。
> 上传成功后，用服务器返回的图片地址替换掉临时图片链接。
> 管理内存（清理旧的 ObjectURL，防止内存泄漏）
