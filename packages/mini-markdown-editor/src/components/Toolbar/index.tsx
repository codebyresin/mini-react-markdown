import { CLASS_PREFIX } from "@/common";
import { toolbarConfig } from "@/config/toolbar";
import { Button } from "antd";
import { type FC } from "react";
import styled from "styled-components";
import { ToolbarItem } from "./ToolbarItem";
import { t } from "@/locales";
import { useSyncEditorView } from "@/hooks/use-sync-editorview";

const ToolbarContent = styled.div/*css*/ `
  width: 100%;
  height: 35px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  padding: 4px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-x: auto;
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
`;
const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  background-color: ${(props) => props.theme.borderColor};
  display: block;
  width: 1px;
  height: 16px;
  position: relative;
  margin: 0 8px;
  top: 0.1em;
`;

const Toolbar: FC = () => {
  const toolbars = toolbarConfig.getAllToolbars();
  useSyncEditorView();

  return (
    <ToolbarContent className={`${CLASS_PREFIX}-toolbar-content`}>
      <ToolbarLeft>
        {toolbars.map((item, index) =>
          item.type === "line" ? (
            <Divider key={`divider-${index}`} />
          ) : (
            <ToolbarItem key={`item-${index}`} {...item} t={t} />
          )
        )}
      </ToolbarLeft>
      <ToolbarRight>
        <Button style={{ height: "20px" }}>复制代码</Button>
      </ToolbarRight>
    </ToolbarContent>
  );
};
export default Toolbar;
