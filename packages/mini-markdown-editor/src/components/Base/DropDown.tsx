import type { TRANSLATION_KEYS } from "@/locales";
import { Dropdown } from "antd";
import type { ToolbarItemListItem } from "@/types/toolbar";
import React, { memo, useMemo } from "react";
import { render, type renderKey } from "@/config/toolbar/base";
import { CLASS_PREFIX } from "@/common";
import type { MenuProps } from "antd";

interface DropDownMenuProps {
  children: React.ReactNode;
  list?: ToolbarItemListItem[]; //二级菜单项
  t?: (key: TRANSLATION_KEYS) => string;
  dropdownRender?: () => React.ReactNode; // 自定义渲染下拉内容
}
export const DropDownMenu = memo(
  //memo包裹组件使其只在props变化时重新渲染
  ({ children, list, t, dropdownRender }: DropDownMenuProps) => {
    const items: MenuProps["items"] = useMemo(() => {
      //useMemo缓存计算结果，依赖项[list]变化时才重新计算
      if (!list) return undefined;
      const renderKeys = Object.keys(render) as renderKey[];
      return list.map((item) => {
        return {
          key: item.title!,
          label: renderKeys.includes(item.type as renderKey)
            ? render[item.type as renderKey]
            : t?.(item.title! as TRANSLATION_KEYS) || item.title!,
        };
      });
    }, [list]);

    // 处理 list 的点击事件
    const handleMenuClick: MenuProps["onClick"] = (e) => {
      if (!list) return;

      const key = e.key;
      const item = list.find((item) => item.title === key);
      //onClick: () => InsertTextEvent("ol")执行回调函数
      if (item?.onClick) {
        item.onClick();
      }
    };
    // 如果提供了自定义渲染函数（组件）
    if (dropdownRender) {
      return (
        <Dropdown popupRender={dropdownRender} placement="bottomLeft">
          {children}
        </Dropdown>
      );
    }

    return (
      <Dropdown
        menu={{
          items,
          onClick: handleMenuClick,
        }}
        placement="bottomLeft"
        className={`${CLASS_PREFIX}-dropdown-menu`}
      >
        {/**这个children就是下拉菜单hoverme */}
        {children}
      </Dropdown>
    );
  }
);
