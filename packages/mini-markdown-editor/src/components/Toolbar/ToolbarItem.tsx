import { type FC, memo } from "react";
import type { ToolbarItem as ToolbarItemType } from "@/types/toolbar";
import type { TRANSLATION_KEYS } from "@/locales";
import styled from "styled-components";
import { DropDownMenu } from "../Base/DropDown";
import IconToolTip from "../Base/IconToolTip";
import { CLASS_PREFIX } from "@/common";

type t = {
  t: (key: TRANSLATION_KEYS) => string;
};

const ToolbarItemWrapper = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-sizing: content-box;
  padding: 3px;
  border-radius: 3px;
  margin: 0 2px;
  transition: all 0.3s;
  &:hover {
    /* background-color: #e6e6e6; */
    background-color: ${(props) => props.theme.toolbarHoverBg};
  }
  .icon {
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    flex-shrink: 0;
    color: ${(props) => props.theme.color};
    fill: ${(props) => props.theme.color};
  }
`;

const ToolbarItemRender: FC<ToolbarItemType & t> = ({
  list,
  title,
  description,
  icon,
  onClick,
  component,
  t,
}) => {
  if (list && list.length > 0) {
    return (
      <>
        <DropDownMenu list={list} t={t}>
          {/* <img src={icon} alt={title} /> */}
          {icon && (
            <div
              className="icon"
              dangerouslySetInnerHTML={{ __html: icon }}
            ></div>
          )}
        </DropDownMenu>
      </>
    );
  } else if (component) {
    return <>{component}</>;
  } else {
    return (
      <>
        <IconToolTip
          content={t?.(title as TRANSLATION_KEYS) || title}
          description={description}
          onClick={onClick}
        >
          {icon && (
            <div
              className="icon"
              dangerouslySetInnerHTML={{ __html: icon }}
            ></div>
          )}
        </IconToolTip>
      </>
    );
  }
};

export const ToolbarItem: FC<ToolbarItemType & t> = memo((props) => {
  //   对组件进行浅比较（shallow compare），只有当 props 发生变化时才重新渲染
  return (
    <ToolbarItemWrapper
      className={`${CLASS_PREFIX}-toolbar-item ${CLASS_PREFIX}-toolbar-item-${props.type}`}
    >
      <ToolbarItemRender {...props} />
    </ToolbarItemWrapper>
  );
});
