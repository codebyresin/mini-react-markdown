# svg 常用属性

> fill---->填充颜色
> stroke---->边框颜色
> opacity---->透明度
> transform---->变换（rotate, translate, scale）

## 动态插入 svg;

> import HeadingIcon from "@/assets/images/heading.svg?raw";
> ?.raw
> 告诉构建工具，不要把这个文件当作资源文件加载，而是当作纯文本字符串导入。
> 由'/assets/heart-xxxxx.svg'变为'<svg viewBox="0 0 24 24"><path ... /></svg>'

React 默认不会让你直接插入“原始 HTML”或 SVG 字符串，因为可能不安全。
所以必须用这个属性：

> <div dangerouslySetInnerHTML={{ __html: HeadingIcon }}></div>
> <div dangerouslySetInnerHTML={{ __html: '<p>Hello World</p>' }}></div>
