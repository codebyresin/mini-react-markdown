import type { FC } from "react";
import styled from "styled-components";
import { t, type TRANSLATION_KEYS } from "@/locales";
import { TOOLBAR_KEYS } from "@/locales/keys";
import { useToolbarStore } from "@/store/toolbar";

//svg
import WriteIcon from "@/assets/images/write.svg?raw";
import PreviewIcon from "@/assets/images/perview.svg?raw";
import ContentsIcon from "@/assets/images/contents.svg?raw";
import HelpIcon from "@/assets/images/help.svg?raw";
import OutputIcon from "@/assets/images/output.svg?raw";
//组件
import IconToolTip from "../Base/IconToolTip";
import SidebarHelp from "@/components/Sidebar/Help";
import SidebarContents from "@/components/Sidebar/Contents";
import SidebarOutput from "@/components/Sidebar/Output";

const Wrapper = styled.div<{ $isSelect: boolean }>/*css*/ `
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${(props) => (props.$isSelect ? "#0366d6" : props.theme.color)};
`;

//!只写模式
export const Write: FC = () => {
  const { isOnlyWrite, setIsOnlyWrite } = useToolbarStore();
  return (
    <IconToolTip
      content={t(TOOLBAR_KEYS.TOOLBAR.write as TRANSLATION_KEYS)}
      onClick={() => setIsOnlyWrite()}
    >
      <Wrapper
        $isSelect={isOnlyWrite}
        dangerouslySetInnerHTML={{ __html: WriteIcon }}
      />
    </IconToolTip>
  );
};

//!只读
export const Read: FC = () => {
  const { isOnlyPreview, setIsOnlyPreview } = useToolbarStore();
  return (
    <>
      <IconToolTip
        content={t(TOOLBAR_KEYS.TOOLBAR.preview as TRANSLATION_KEYS)}
        onClick={() => setIsOnlyPreview()}
      >
        <Wrapper
          $isSelect={isOnlyPreview}
          dangerouslySetInnerHTML={{ __html: PreviewIcon }}
        ></Wrapper>
      </IconToolTip>
    </>
  );
};

//!工具栏目录
export const Contents: FC = () => {
  const ComponentsMark = "Contents";
  const { isSidebar, componentMark, setSidebar } = useToolbarStore();
  return (
    <>
      <IconToolTip
        content={t(TOOLBAR_KEYS.TOOLBAR.contents as TRANSLATION_KEYS)}
        onClick={() => setSidebar(<SidebarContents />, ComponentsMark)}
      >
        <Wrapper
          $isSelect={isSidebar && componentMark === ComponentsMark}
          dangerouslySetInnerHTML={{ __html: ContentsIcon }}
        />
      </IconToolTip>
    </>
  );
};

//!帮助
export const Help: FC = () => {
  const ComponentsMark = "Help";
  const { isSidebar, componentMark, setSidebar } = useToolbarStore();
  return (
    <>
      <IconToolTip
        content={t(TOOLBAR_KEYS.TOOLBAR.help as TRANSLATION_KEYS)}
        onClick={() => {
          setSidebar(<SidebarHelp />, ComponentsMark);
        }}
      >
        <Wrapper
          $isSelect={isSidebar && componentMark === ComponentsMark}
          dangerouslySetInnerHTML={{ __html: HelpIcon }}
        ></Wrapper>
      </IconToolTip>
    </>
  );
};
//导出
export const Output: FC = () => {
  const ComponentsMark = "Output";
  const { isSidebar, componentMark, setSidebar } = useToolbarStore();
  return (
    <>
      <IconToolTip
        content={t(TOOLBAR_KEYS.TOOLBAR.output as TRANSLATION_KEYS)}
        onClick={() => setSidebar(<SidebarOutput />, ComponentsMark)}
      >
        <Wrapper
          $isSelect={isSidebar && componentMark === ComponentsMark}
          dangerouslySetInnerHTML={{ __html: OutputIcon }}
        />
      </IconToolTip>
    </>
  );
};
