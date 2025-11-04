/**
 * @收集preview 区域的标题并生成目录，支持点击锚点和滚动高亮）
 */

import { useEditorContentStore } from "@/store/editor";
import { Anchor } from "antd";
import { formatContents, type Title } from "@/utils/format-contents";
import { useEffect, useMemo, useState, type FC } from "react";
import { CLASS_PREFIX } from "@/common";

const Contents: FC = () => {
  const previewView = useEditorContentStore((state) => state.previewView);
  const [titles, setTitles] = useState<Title[]>([]);
  const [activeLink, setActiveLink] = useState<string>("");

  const preview = document.querySelector(
    ".markdown-editor-preview"
  ) as HTMLElement | null;
  //html
  // <div class="markdown-editor-preview" data-line="1">
  //   <h1>标题</h1>
  //   <p>这是一个段落...</p>
  // </div>;

  const getRootElement = () => {
    return preview?.querySelectorAll(
      "h1, h2, h3, h4, h5, h6"
    ) as NodeListOf<HTMLElement>;
  };
  //? querySelectorAll是 DOM 操作，相对耗时。如果 preview未变化,避免每次渲染都重新查询 DOM。

  const rootElement = useMemo(getRootElement, [preview]); //H标签dom形式数组

  //!addAnchor函数为标题添加 id,并生成目录供用户点击跳转。
  const addAnchor = () => {
    if (!rootElement) return [];
    rootElement.forEach((node) => {
      const line = node.getAttribute("data-line");
      //dom元素是否包含该属性
      if (!line) return;
      node.setAttribute("id", line);
    });
    return formatContents(rootElement);
  };

  //更新目录
  useEffect(() => {
    if (!preview) return;
    if (rootElement.length > 0) {
      const initialTitles = addAnchor();
      setTitles(initialTitles);
      if (initialTitles.length) {
        setActiveLink(initialTitles[0].href);
      }
    }
    // 浏览器原生 API,用来监听 DOM 的变化（增删子节点、文本内容、属性变化）
    const observer = new MutationObserver(() => {
      // 用户操作md,及时更新目录
      const elements = getRootElement();
      if (elements && elements.length > 0) {
        requestAnimationFrame(() => {
          const newTitles = formatContents(elements);
          setTitles(newTitles);
          if (newTitles.length > 0 && !activeLink) {
            setActiveLink(newTitles[0].href);
          }
        });
      }
    });
    observer.observe(preview, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
    return () => {
      observer.disconnect();
    };
  }, [preview, rootElement]);

  // 监听滚动更新高亮
  useEffect(() => {
    if (!preview) return;
    const handleScroll = () => {
      const elements = getRootElement();
      if (!elements) return;
      // 记录最近的标题和最小距离
      let closestTitle = null;
      let minDistance = Infinity;
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        if (distance < minDistance) {
          minDistance = distance;
          closestTitle = element;
        }
      });
      if (closestTitle) {
        const line = (closestTitle as HTMLElement).getAttribute("data-line");
        if (line) {
          setActiveLink(`#${line}`);
        }
      }
    };
    preview.addEventListener("scroll", handleScroll);
    return () => preview.removeEventListener("scroll", handleScroll);
  });
  // 自定义高亮锚点
  const getCurrentAnchor = () => {
    return activeLink;
  };
  //描点
  const handleClickAnchor = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    link: {
      title: React.ReactNode;
      href: string;
    }
  ) => {
    e.preventDefault();
    if (link && previewView) {
      const dataLine = link.href.replace("#", "");
      const targetElement = previewView.querySelector(
        `[data-line]=${dataLine}`
      );
      if (targetElement) {
        setActiveLink(link.href);
        //点击平滑滚动到对应dom
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
  };

  return titles.length > 0 && preview ? (
    <Anchor
      getCurrentAnchor={getCurrentAnchor}
      onClick={handleClickAnchor}
      affix={false}
      items={titles}
      getContainer={() => preview}
      className={`${CLASS_PREFIX}-sidebar-contents`}
    />
  ) : null;
};
export default Contents;

//*  <a class="ant-anchor-link-title ant-anchor-link-title-active" href="#88" title="h1 code bolang">
//*   h1 code bolang
//* </a>;
