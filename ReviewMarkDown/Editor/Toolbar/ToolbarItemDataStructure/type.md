## 对于 title 统一封装，一一映射,并允许自己添加字段，生成 item

```js
export enum BaseToolbarType={
    HEADING = "heading",
    OUTPUT = "output",
    EMOJI = "emoji",
    ......
}
>等效于
>一个运行对象
>{
  BOLD: "bold",
  ITALIC: "italic"
}
>一个类型
>type ToolbarType = "bold" | "italic";

export type ExtendedToolbarType = string;
export type ToolbarType = BaseToolbarType | ExtendedToolbarType;
//为string,string吸收字面量
//这个类型是默认加扩展类型
```

[具体类型定义](../../../../packages/mini-markdown-editor/src/types/toolbar.ts)

[定义翻译键(统一格式，用于映射)](../../../../packages/mini-markdown-editor/src/locales/keys.ts)

```js 解释内部写法机制
>计算属性名(语法)
>[表达式]:值
>[BaseToolbarType.HEADING]: "TOOLBAR.HEADING"(这个作为统一格式的键用于翻译映射)
```

> 有了这些对应的配置，接下来就是实现**对应的键**生成对应的中英文
> 这里要考虑怎么封装这些，怎么让语言传递为 cn 全部都跟着转化为中文
> 可以用 context 和 zustand

```ts 翻译逻辑
const en = { "TOOLBAR.HEADING": "Heading" };
const cn = { "TOOLBAR.HEADING": "标题" };
interface TranslationStoreType {
  currentLocale: "en" | "cn" | "tw"; //当前语言
  setLocale: (locale: "en" | "cn" | "tw") => void; //设置语言函数
  t: (key: keyof typeof en) => string; //翻译函数
}
const locales = { en, cn, tw } as const;
**把三个翻译对象结合,使用对象键值匹配内容**
export const useTranslation = create<TranslationStoreType>((set, get) => ({
  setLocale: (locale: Language) => set({ currentLocale: locale }),
  currentLocale: "cn",//这个只是字符，要通过字符判断翻译哪个模块
  t: (key) => {
    const currentTranslations = locales[get().currentLocale]
    return currentTranslations[key]||locales.en[key];
  },
}));
```

## **具体如下**

[翻译逻辑](../../../../packages/mini-markdown-editor/src/locales/index.ts)

## 现在翻译相关模块结束了，现在就是快捷键的对应

[快捷键](../../../../packages/mini-markdown-editor/src/common/hotkey.ts)

> 定义一个 Hotkey 类，在该类里实例化
> 定义的两个声明类型
> type Command = string
> type Description = string;
> **toolbar.type === hotkey.description**后期做判断执行函数
> static readonly BOLD = new Hotkey("mod+b", "bold");
