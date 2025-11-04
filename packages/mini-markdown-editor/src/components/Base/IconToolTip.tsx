import { type FC } from "react";
import { Tooltip } from "antd";
import type { TooltipPlacement } from "antd/es/tooltip";
import React from "react";

const IconTooltip: FC<{
  content: string | React.ReactNode;
  placement?: TooltipPlacement;
  description?: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ content, placement = "top", description, children, onClick }) => {
  const title = (
    <div
      style={{
        textAlign: "center",
        whiteSpace: "pre-line",
      }}
    >
      <div>{content}</div>
      <div>{description}</div>
    </div>
  );
  return (
    <Tooltip title={title} placement={placement}>
      <div onClick={onClick}>{children}</div>
    </Tooltip>
  );
};
export default React.memo(IconTooltip);
