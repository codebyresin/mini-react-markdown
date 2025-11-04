[源码](../../../../packages/mini-markdown-editor/src/config/toolbar/index.ts)

## 源码全是逻辑，建议仔细阅读，能长很多知识

┌────────────────────────────────────────────┐
│ defaultToolbar │
│────────────────────────────────────────────│
│ 静态数组，纯数据结构 │
│ 含 onClick 函数 │
│ 没有事件总线 / 状态 / 插件机制 │
└────────────────────────────────────────────┘
│
▼
┌────────────────────────────────────────────┐
│ ToolbarConfig 实例化 │
│────────────────────────────────────────────│
│ 内部拷贝 defaultToolbar 作为初始状态 │
│ Map 管理顺序 + Map 管理插件 │
│ emit 通知变化事件（add/remove/reset） │
│ 支持动态修改、插件注册、事件广播 │
└────────────────────────────────────────────┘
│
▼
┌────────────────────────────────────────────┐
│ UI 层：Toolbar.tsx -> getAllToolbars() │
│ 实时渲染 + 监听 ToolbarConfig 更新 │
└────────────────────────────────────────────┘

1. 先给出高层结论（先看总览，再逐步讲原因）
   ● BaseClass：提供统一的“事件总线 + 生命周期管理 + 日志 + 错误处理”能力。把这些通用能力抽成一个基类，方便其它模块直接继承并复用。
   ● ToolbarConfig：具体的业务模块（工具栏配置/管理器），负责维护工具栏的状态（列表、顺序、插件注册等），并通过 BaseClass 的事件系统对外广播变化（如 TOOLBAR_ADDED、TOOLBAR_REORDERED）。
   ● 为什么类（Class）适合这里：类很自然地把「状态（this.xxx）」「行为（this.method）」「生命周期（destroy）」封装在一起，便于继承和复用。对于需要内部私有状态、方法、及事件（emit/on）的管理，面向对象很直观。
   ● 可替代方案：函数式 store（useReducer + hooks / Redux / Zustand）、Observable（RxJS）、简单 PubSub 对象、或直接在组件内管理。每种都有权衡，下面详细比较。
   ● 如何使用（对应关系）：组件从 ToolbarConfig 读当前工具栏（getAllToolbars），并监听 ToolbarConfig 的事件以在 UI 中实时更新；InsertTextEvent 等通过调用插入工具（或 toolbarConfig.emit）来触发编辑器行为。

2. BaseClass：一步步拆解它“做什么、为什么要做、怎么用”
   2.1 它提供的能力（总结）
   ● 事件机制：.on(event, listener), .once(...), .off(...), .emit(...)
   ● 生命周期：destroy()（会触发 beforeDestroy、destroyed 并移除所有 listener）
   ● 日志：this.error(...)（统一输出错误）
   ● 保护：checkDestroyed() 检查实例是否已销毁
   ● 限制监听器数：用 EventEmitter.setMaxListeners 防止内存泄漏
   2.2 为什么需要这些能力（理由）
3. 解耦：事件机制让模块之间通过「事件」通信，不需要互相知道对方对象的内部实现（只需约定事件名和 payload）。插件系统或 UI 不直接调用核心函数，而是监听事件、或发事件给核心，由核心决定如何处理。
4. 复用与一致性：日志、销毁逻辑、事件接口在多个类上都需要。抽到 BaseClass 中避免重复实现，保证行为一致。
5. 生命周期管理：编辑器、插件、工具栏都有“创建—运行—销毁”的阶段。统一销毁逻辑有助于内存回收（removeAllListeners）和避免悬挂引用。
6. 安全检查：避免在已销毁实例上继续调用方法导致奇怪 bug（checkDestroyed）。
7. 容易测试与调试：集中日志、事件查看与 listenerCount 能快速排查谁订阅了哪个事件。
   2.3 举例（如何用）
   class MyModule extends BaseClass {
   constructor() { super({ name: 'MyModule' }); }
   doSomething() {
   this.emit('didSomething', { ok: true });
   }
   }

// 使用
const m = new MyModule();
m.on('didSomething', data => console.log(data));
m.doSomething(); // => 触发监听
m.destroy(); // => 清理监听器、发 'destroyed'

3. ToolbarConfig：一步步拆解（职责、为何这样设计、如何与 BaseClass 协作）
   3.1 它的职责（职能清单）
   ● 保存当前工具栏数组（this.toolbars）
   ● 保存初始默认模板（this.defaultToolbars）
   ● 管理工具栏顺序（toolbarOrderMap）
   ● 提供 CRUD 操作：addToolItem / removeToolItem / updateToolbarItem / setToolbarOrder / reorderToolbar / swapToolbarsPosition
   ● 提供插件方法注册与调用：registerMethod / callMethod / unregisterMethod（plugins Map）
   ● 通过事件广播所有重要变更（TOOLBAR_ADDED, TOOLBAR_REMOVED, TOOLBAR_REORDERED, TOOLBAR_UPDATED, TOOLBAR_RESET, METHOD_REGISTERED 等）
   ● 使用 immer（produce）来保持不可变式更新（更安全，便于回溯）
   3.2 为什么按这种方式写（理由）
1. 单一职责：ToolbarConfig 专注于“工具栏状态与规则”，它不渲染 UI、不直接操作 DOM、不处理编辑器视图。把 UI/渲染和业务状态分离是常见的良好架构。
1. 事件广播：当工具栏变化时，UI、快捷键系统、插件等都需要知道。BaseClass 的事件总线是一个轻量、低耦合的分发方式。
1. 可扩展性：registerMethod / plugins Map 允许第三方或插件动态注入功能，而不需要改核心代码。
1. 可测性：把逻辑放在类里，提供明确方法接口，容易单测（调用 addToolItem，然后断言 getAllToolbars 返回正确值并且 emit 事件被触发）。
1. 可回滚 / 不变数据：使用 produce（immer）使得每次修改都返回新数组，便于实现时间旅行 / 比较旧状态 / 避免意外共享引用问题。
1. 顺序快速查询：toolbarOrderMap 让查询顺序或更新顺序快速（O(1) 获取顺序），并避免每次都遍历数组查 index（在某些操作下更高效）。
   3.3 ToolbarConfig 与 BaseClass 的配合
   ● ToolbarConfig extends BaseClass，因此它可以：
   ○ 在 add/remove/reorder 等动作后 this.emit(ToolbarEvents.TOOLBAR_ADDED, item)，通知外部。
   ○ 暴露 on / off 给外部监听者（例如 React 组件或插件）注册监听器。
   ● 这样 UI 无需轮询：它既可以直接 toolbarConfig.getAllToolbars() 取当前状态，也可以 toolbarConfig.on(TOOLBAR_REORDERED, handler) 来响应变化。

1. 事件总线（Event Bus）是什么？为什么要用它？（讲得非常基础）
   4.1 最简单的概念
   事件总线就是「广播-订阅」系统（Publish-Subscribe）：
   ● 模块 A 发出一个事件（publish/emit）
   ● 模块 B 订阅该事件（subscribe/on）
   ● A 与 B 互相不知道对方实现，只约定事件名称和数据格式
   4.2 为什么在编辑器场景常用
   ● 编辑器由很多模块组成（工具栏、快捷键、文档加载、插件），彼此耦合会增加复杂度。事件总线让模块间松耦合。
   ● 一处变更（如工具栏顺序变动）可能要通知多个消费者（UI、快捷键、持久化），事件广播天然适合。
   ● 插件体系需要“插件之间也能互通”——事件是最简单的扩展点。
   4.3 简单类比
   事件总线就像公司前台（event emitter）：
   ● 部门 A（toolbar）放一张便签（emit event）
   ● 有订阅该类型便签的同事（listeners）会看到并处理

1. 交互流程 / 时序（把实际运行时的链路写清楚）
   下面用文字版顺序图解释一个典型流程：用户点击工具栏“加粗”按钮。
1. UI 层渲染工具栏
   ○ React 组件 Toolbar 从 toolbarConfig.getAllToolbars() 取得数组并渲染按钮（或监听 TOOLBAR_RESET 更新）。
1. 用户点击按钮
   ○ 按钮 onClick => 调用 item.onClick（或 toolbarConfig.emit('toolbarClick', item)）
   ○ 例如 InsertTextEvent('bold') 被调用。
1. 插入文本逻辑
   ○ InsertTextEvent 使用 insertContent.insertContent(content, selection) 来修改 EditorView。
1. 工具栏状态更新（可选）
   ○ 某些工具可能会在点击后改变工具栏状态（如切换！），这时会调用 toolbarConfig.updateToolbarItem(...) 或 toolbarConfig.emit('configUpdated', ...)
1. UI 接收变更
   ○ 订阅了 TOOLBAR_UPDATED 的 UI/插件会收到通知并重新渲染或同步状态。
   把它连成一条：
   Toolbar UI → (click) → InsertTextEvent → insertContent → (可能) toolbarConfig.emit → Plugin/UI 收到通知。

1. 方法/事件 对应表（一目了然）
   模块 方法 / 事件 含义 / 用途
   BaseClass on(event, fn) 订阅事件
   BaseClass emit(event, payload) 广播事件
   ToolbarConfig getAllToolbars() 读取当前工具栏（UI 渲染）
   ToolbarConfig addToolItem(item) 增加按钮，emit TOOLBAR_ADDED
   ToolbarConfig removeToolItem(type) 移除按钮，emit TOOLBAR_REMOVED
   ToolbarConfig setToolbarItemOrder 调整单项位置，emit TOOLBAR_REORDERED
   ToolbarConfig reset() 恢复默认，emit TOOLBAR_RESET
   ToolbarConfig registerMethod(name, fn) 插件注入方法，emit METHOD_REGISTERED
   InsertContent insertContent(content, selection) 向编辑器插入文本（来自 toolbar onClick）

1. 可替代实现（给出代码示例与优缺点）
   下面给出 3 种替代设计思路，并比较优缺点。
   方案 A — 继续用类 + EventEmitter（现在的实现）
   ● 优点：
   ○ 清晰、直观、面向对象，适合需要继承与复用的模块；
   ○ 事件机制自带 removeAllListeners、listenerCount，方便管理；
   ○ 生命周期（destroy）集中管理简单直接。
   ● 缺点：
   ○ 对于 React Hooks 风格的代码，类实例的变化需要小心（在组件中要把实例保存在 ref 中）。
   ● 适合场景：中大型、模块化、插件化系统。
   方案 B — Redux / Zustand / useReducer（函数式 store）
   ● 用法：把 toolbar state 放到中央 store，通过 dispatch 修改，UI 通过 subscribe/select 获取状态。
   ● 优点：
   ○ 与 React 更契合（纯函数、可序列化状态、时间旅行、方便 debug）。
   ○ 更适合做跨组件共享状态且需要持久化的场景。
   ● 缺点：
   ○ 事件式广播（例如“某插件希望监听一次 docLoaded”）需要额外机制（middlewares 或自定义事件）。
   ○ 注册/注销插件的生命周期管理需要额外约定。
   ● 适合场景：以 React 为主、状态驱动为核心的应用。
   方案 C — Observable（RxJS）
   ● 用法：把事件/状态建成 Observable 流，订阅者订阅流，next 发布。
   ● 优点：
   ○ 强大的流操作（map/filter/debounce 等），适合复杂异步场景。
   ● 缺点：
   ○ 学习曲线高，代码相对复杂。对简单需求可能过度设计。
   ● 适合场景：复杂事件流、需做复杂组合与时间窗口处理的场景（例如富交互编辑器）。
   方案 D — 简单 PubSub 对象（手写）
   ● 用法：写一个轻量 pubsub（{on, off, emit}）。
   ● 优点：实现简单，易于理解。
   ● 缺点：缺少 EventEmitter 的高级功能（listenerCount、maxListeners、安全性），重复造轮子容易出错。
   ● 适合场景：非常小的项目或临时需求。

1. 为什么你现在的实现（BaseClass + ToolbarConfig）是合理的（逐项理由）
1. 模块分离：ToolbarConfig 只管理工具栏，不关心渲染或编辑器逻辑（单一职责）。
1. 事件即扩展点：事件系统是插件/外部模块的天然切入点 —— 插件只需监听某事件或注册方法即可扩展功能。
1. 生命周期安全：BaseClass 的 destroy 能保证清理事件，防止内存泄漏（尤其插件频繁注册监听时）。
1. 可测性：类方法（add/remove/update）可以单元测试；事件触发也可断言。
1. 性能/复杂度平衡：map + produce + orderMap 能在满足功能的同时保持实现简单与性能可控。
1. 与 UI 解耦：UI 可选择拉取（getAllToolbars）或监听（on TOOLBAR_RESET）两种方式，两者都容易实现。

1. 如何在项目中实际使用（推荐实践与示例）
   9.1 初始化（单例）
   通常创建单例：
   export const toolbarConfig = new ToolbarConfig(defaultToolbar);
   然后在 app 启动时，确保 toolbarConfig 已创建并在需要时注入 editor view（例如 insertContent.setEditorView）。
   9.2 在 React 组件中订阅（示例）
   function Toolbar() {
   const [toolbars, setToolbars] = useState(toolbarConfig.getAllToolbars());

useEffect(() => {
const handler = (newList) => setToolbars([...newList]);
toolbarConfig.on('TOOLBAR_REORDERED', handler);
toolbarConfig.on('TOOLBAR_ADDED', () => setToolbars([...toolbarConfig.getAllToolbars()]));
return () => {
toolbarConfig.off('TOOLBAR_REORDERED', handler);
};
}, []);

return <> {toolbars.map(...)} </>;
}
注意：用 useEffect 注册/取消监听，确保组件卸载时清理监听器。
9.3 插件示例（注册方法）
toolbarConfig.registerMethod('exportMarkdown', () => {
const content = getEditorContent();
// do export
});
外部调用：
toolbarConfig.callMethod('exportMarkdown');

10. 调试与测试建议（实用小贴士）
    ● 查看当前监听器：toolbarConfig.getEvents() / toolbarConfig.listenerCount(event) 排查内存泄漏或重复注册。
    ● 在关键方法加入日志：addToolItem、removeToolItem、reorderToolbar 的 try/catch 已有 error 打印，遇到问题先看 console。
    ● 单测：
    ○ 测试 addToolItem -> getAllToolbars 包含新增；
    ○ 测试 removeToolItem -> toolbars 长度减少并 emit TOOLBAR_REMOVED；
    ○ 测试 registerMethod -> callMethod 返回值或行为正确；
    ● 避免内存泄漏：插件注册事件时注意在 destroy 时 off 掉 listener（或使用 once）。
    ● React 渲染性能：组件监听事件时只在必要时 setState，避免每次 emit 都导致全树重渲染；或使用选择器（只取出变化的那一部分）。

11. 把所有关系画成“映射表”方便记忆
    [defaultToolbar (静态模板)]
    ↓ (拷贝到)
    [ToolbarConfig instance] <--- extends BaseClass (提供: on/emit/destroy)

- this.toolbars (当前状态)
- this.defaultToolbars (备份)
- this.toolbarOrderMap (顺序索引)
- this.plugins (可调用的方法)
- methods: add/remove/update/reorder/registerMethod/callMethod
- emits: TOOLBAR_ADDED/REMOVED/REORDERED/UPDATED/RESET/METHOD_REGISTERED
  ↓
  [UI components] (subscribe on events OR pull via getAllToolbars)
- Toolbar.tsx: reads getAllToolbars(), or listens to TOOLBAR_RESET
- ToolbarItem button click -> item.onClick 或 toolbarConfig.emit("toolbarClick", item)
  ↓
  [InsertTextEvent / insertContent]
- 调用编辑器 API 修改 EditorView

12. 如果要我把当前实现改为「函数式 store + hooks」我会怎么做（概要）
    ● 用 useSyncExternalStore 或 Zustand 来实现共享 toolbar state。
    ● 把事件 bus 保留或改为 store 的订阅（中间件）。
    ● 插件接口变成 editor.use(plugin)，插件接受 api（api 包含 getState、setState、on/emit、callMethod）。
    ● 优点：更好和 React 集成；缺点：需要额外实现插件生命周期管理。

最后：给你一个小清单，帮助你判断需要保留现在架构还是替换
● 你需要插件系统、动态增删、生命周期管理吗？保留现在类+事件方案。
● 更倾向于 React 风格、希望状态可序列化并使用 Redux DevTools？考虑函数式 store（Redux/Zustand）。
● 事件流很复杂、需要流式组合（节流、去抖、合并等）？考虑 RxJS。

🧱 一、为什么要有「BaseClass」
假设我们正在写一个 Markdown 编辑器，它有很多功能模块：
● 工具栏（ToolbarConfig）
● 编辑区（EditorView）
● 预览区（Preview）
● 插件系统（Plugins）
这些模块都有一些共同点：

1. 都可能需要监听和触发事件；
2. 都可能需要销毁时清理资源；
3. 都可能需要打印日志；
4. 都可能需要检测是否“已经销毁”。
   如果每个类都自己写一遍这些逻辑：
   const emitter = new EventEmitter();
   就会：
   ● 重复代码；
   ● 难以维护；
   ● 改一处要全改。
   于是我们抽出一个“基础类” → BaseClass
   这个类相当于一个「统一模板」，其他类只要继承它，就自动获得事件系统、日志、销毁机制。

🧩 二、BaseClass 主要功能和设计理由
✅ 1. 统一的事件系统（EventEmitter）
this.eventEmitter = new EventEmitter();
作用：
● 所有继承的类都可以使用 this.emit 发事件；
● 也可以用 this.on 来监听事件。
💡 为什么这样做？
● 它是我们“组件间通信”的核心。
● 不同模块之间不需要直接依赖（解耦）。
👉 举例：
// 插件 A 想监听文档加载完成
editor.on("documentLoaded", () => console.log("加载完成"))

// 编辑器加载完文档后
editor.emit("documentLoaded")
📦 BaseClass 让所有继承者都有事件功能，无需重复写。

✅ 2. 销毁机制 destroy()
为什么要有销毁？
● 比如一个编辑器组件在 React/Vue 中被卸载；
● 你需要清除所有监听器、释放内存、关闭定时器。
destroy() {
this.emit("beforeDestroy")
this.eventEmitter.removeAllListeners()
this.isDestroyed = true
this.emit("destroyed")
}
💡 为什么放到 BaseClass？
● 每个模块都可能被销毁；
● 用统一模式管理更安全。

✅ 3. 错误日志、检查机制
protected error(...args: unknown[]): void {
this.logger.error(`[${this.config.name}]`, ...args);
}
方便调试、统一输出格式。
例如报错时自动带上模块名 [ToolbarConfig]。

🧠 三、ToolbarConfig 与 BaseClass 的关系
ToolbarConfig 继承了 BaseClass：
export class ToolbarConfig extends BaseClass {
...
}
也就是说：
● 它自动拥有事件功能；
● 可以监听/触发事件；
● 可以被销毁；
● 可以打印日志。

🔗 举个实际例子
我们想要让“工具栏点击”能够触发编辑器行为：
toolbar.emit("toolbarClick", { type: "bold" })
在编辑器中：
toolbar.on("toolbarClick", (info) => {
editor.insertContent("**粗体**")
})
💡 这就是**事件总线（EventBus）**的作用：
→ 不同模块之间解耦通信，彼此不直接引用对象。

🔧 四、为什么要用类，而不是函数？
这个问题很关键，也是很多人初学时困惑的点。
1️⃣ 函数方式（容易写但不易扩展）
如果用函数，你可能写成：
let listeners = {}
export function on(event, cb) {...}
export function emit(event, ...args) {...}
这可以工作，但有问题：
● 全局共享同一个事件系统；
● 无法区分多个实例；
● 没有“销毁”概念；
● 日志、配置难以独立。

2️⃣ 类方式（模块化、实例化）
类可以：
● 创建多个互不干扰的实例；
● 为每个实例配置名字；
● 通过继承扩展通用功能；
● 自动包含生命周期。
const toolbar = new ToolbarConfig({ name: "Toolbar" })
const editor = new EditorConfig({ name: "Editor" })
💡 不同模块都继承了 BaseClass，互相独立但可通信。

⚙️ 五、整个关系图（可视化）
BaseClass
├─ 提供 on/emit/off 事件机制
├─ 提供 destroy 生命周期
├─ 提供日志 error/info
└─ 可被任意模块继承

       ↓

ToolbarConfig extends BaseClass
├─ 继承事件系统
├─ 维护 toolbar 列表
├─ 在点击时 emit('toolbarClick')

       ↓

EditorView / Plugin / Preview 也可以继承 BaseClass
├─ 监听 toolbarClick
├─ 监听 documentLoaded
├─ 在销毁时清理资源

🧭 六、插件（Plugin）举例说明对应事件：
插件名 希望做的事 对应事件 由谁发出
插件 A 在文档加载后执行 "documentLoaded" 编辑器
插件 B 在编辑器销毁时清理缓存 "destroyed" BaseClass
插件 C 点击 toolbar 时执行命令 "toolbarClick" ToolbarConfig
插件 D 在配置变化时更新显示 "configUpdated" ConfigManager
它们全靠 BaseClass 的事件机制连接。

🧩 七、总结一句话
BaseClass 是所有模块的“基础骨架”；ToolbarConfig 是继承它的一个功能模块。
● BaseClass 管生命周期与事件通信；
● ToolbarConfig 管 toolbar 数据与触发事件；
● 插件系统用事件总线实现模块间解耦。

如果你想，我可以接下来帮你：

1. 💡 用可视化图展示事件流；
2. 🧪 写一个 demo 展示插件监听与触发事件的全过程（含代码输出）。
   要我继续哪种？
   您说：
   第一个
   ChatGPT 说：
   非常好 👍 那我们来做一个可视化图，帮你直观地理解整个事件流架构。

🧭 一、整体关系总览图
┌────────────────────────────────────────────────┐
│ BaseClass │
│────────────────────────────────────────────────│
│ 🔸 提供事件系统（on / emit / off） │
│ 🔸 提供销毁机制（destroy / beforeDestroy） │
│ 🔸 提供日志功能（error / logger） │
│ 🔸 所有模块继承它 │
└────────────────────────────────────────────────┘
▲
│
┌──────────────┼───────────────────────┐
│ │ │
▼ ▼ ▼
ToolbarConfig EditorConfig PluginA/B/C/D
(工具栏模块) (编辑器模块) (插件系统)

🧩 二、事件流交互图
下面是一个具体事件流的过程（例如你点击工具栏的“粗体”按钮）：
[用户点击 Bold 按钮]
│
▼
┌──────────────────┐
│ ToolbarConfig │
│ emit("toolbarClick", {type:"bold"}) │
└──────────────────┘
│
▼
┌──────────────────┐
│ EditorConfig │
│ on("toolbarClick")│ ← 监听
│ insertContent("**粗体**") │
└──────────────────┘
│
▼
┌──────────────────┐
│ 插件 PluginA/B/C │
│ 也可以监听同样事件 │
│ 例如统计点击次数 │
└──────────────────┘
💡 特点：
● Toolbar 并不知道谁会监听事件；
● Editor 和插件都能收到同样事件；
● 模块之间完全解耦，不需要互相 import。

⚙️ 三、生命周期事件流
另一个例子：当编辑器被销毁时。
用户关闭编辑器窗口
│
▼
┌──────────────────┐
│ EditorConfig │
│ destroy() │
│ ├─ emit("beforeDestroy") │
│ ├─ 清除事件监听 │
│ ├─ 标记 isDestroyed=true │
│ └─ emit("destroyed") │
└──────────────────┘
│
▼
┌──────────────────┐
│ PluginB │
│ on("destroyed") │ ← 收到通知
│ 清理缓存、保存状态 │
└──────────────────┘

🔗 四、BaseClass 如何串起来
功能 提供方法 被谁使用 举例说明
注册事件 on(event, callback) Toolbar、Editor、Plugin 监听 toolbarClick
触发事件 emit(event, ...args) Toolbar 点击按钮发事件
一次监听 once(event, callback) Plugin 只执行一次初始化逻辑
移除监听 off(event, callback) Editor 销毁时清除监听
销毁实例 destroy() Editor、Plugin 页面卸载时调用
检查销毁状态 checkDestroyed() 各模块 防止重复操作

🧠 五、事件流核心思路总结
目标 传统写法（耦合） BaseClass 写法（解耦）
点击按钮触发粗体 Toolbar 调用 Editor.insertContent Toolbar.emit("toolbarClick")
插件要知道销毁 Plugin 直接引用 Editor Plugin.on("destroyed")
更新配置时通知所有模块 多处调用 update() emit("configUpdated")
插件注册监听 插件必须 import 编辑器 Plugin.on("documentLoaded")
👉 通过事件系统，每个模块就像“独立部件”，
用 emit / on 连接起来，像搭积木一样灵活。

🧩 六、一句话总结
BaseClass 是所有模块的“事件基因”；
ToolbarConfig、EditorConfig、Plugin 等模块通过继承它来：
● 发事件（emit）
● 听事件（on）
● 清理（destroy）
从而形成一个松耦合、可扩展的事件驱动系统架构。
