/**
 * @将dom数组树状化为Title结构
 */

export type Title = {
  key: string;
  href: string;
  title: string;
  children: Title[];
  nodeName: string;
};

//将preview标题dom节点数状化
export const formatContents = (rootElement: NodeListOf<HTMLElement>) => {
  const rootElementArr = Array.from(rootElement).map((item) => {
    const dataLine = item.getAttribute("data-line");
    const title = {
      key: dataLine,
      href: `#${dataLine}`,
      title: item.innerText,
      children: [],
      nodeName: item.nodeName,
    };
    return title;
  }) as Title[];

  let result = rootElementArr;
  //! { key: "1", href: "#1", title: "一级标题 1", children: [], nodeName: "H1" },

  let preLength = 0;
  let newLength = result.length;
  while (preLength !== newLength) {
    preLength = result.length;
    const list: Title[] = [];
    let childList: Title[] = [];
    for (let index = result.length - 1; index >= 0; index--) {
      //!只要级数大，不管是否练习，都是找到第一个最大的基数
      if (
        //同级
        result[index - 1] &&
        result[index - 1].nodeName.charAt(1) ===
          result[index].nodeName.charAt(1)
      ) {
        childList.unshift(result[index]);
      } else if (
        //上一级更大
        result[index - 1] &&
        result[index - 1].nodeName.charAt(1) < result[index].nodeName.charAt(1)
      ) {
        childList.unshift(result[index]);
        result[index - 1].children = [
          ...result[index - 1].children,
          ...childList,
        ];
        childList = [];
      } else {
        childList.unshift(result[index]);
        list.unshift(...childList);
        childList = [];
      }
    }
    result = list;
    newLength = result.length;
  }
  return result;
};
