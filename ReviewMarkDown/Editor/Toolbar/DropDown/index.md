# 基于 antdesign 下拉菜单封装

> [DropDown](../packages/mini-markdown-editor/src/components/Base/DropDown.tsx)

### 这里解释下 dropdown 组件封装和优化

> 组件要接受翻译函数，children，二级菜单数据，自定义渲染函数

```js
import React, { useMemo, memo } from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
```

[dropdown 封装](../packages/mini-markdown-editor/src/components/Base/DropDown.tsx)

## 这里介绍下性能优化

### useMemo

> useMemo 是一个 hook 函数，类似于 vue 的计算属性，缓存计算结果
> const result = useMemo(() => heavyCompute(a, b), [a, b]);
> 只有当[a,b]发生变化才改变

### memo

> 这个包裹高级组件，React.memo 是一个高阶组件（HOC），用于包裹函数组件，使其在 props 没变时跳过重新渲染。

#### 为什么 useMemo 没生效？

1. 依赖写错了
2. 父组件 render 每次都生成新依赖
3. 对象属性变更导致浅比较失效

#### useMemo 和 useCallback 的区别？

useMemo(() => fn, [deps]) // 返回缓存的值
useCallback(fn, [deps]) // 返回缓存的函数

> 这里 onclick 指 onClick: () => InsertTextEvent("heading-1"),
> 依旧是 type 匹配对应 onclick
