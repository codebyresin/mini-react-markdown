import { forwardRef, useEffect, useDeferredValue, type FC } from "react";
import styled from "styled-components";
import { useToolbarStore } from "./store/toolbar";
import Editor from "./components/Editor";
import {
  Row,
  Col,
  ConfigProvider as AntdConfigProvider,
  theme as AntdTheme,
} from "antd";
import { Fragment } from "react";
import GlobalTheme from "./theme/global.-theme";
import type { GlobalConfig } from "./types/global-config";
import type { EditorRef } from "./types/ref";
import { setLocale } from "./locales";
import { useExposeHandle } from "./hooks/use-expose-handle";
import { useEditorContentStore } from "./store/editor";
import { useInitSyncScrollStatus } from "./hooks/use-sync-scroll";
import { defaultConfig } from "antd/es/theme/context";
import { ConfigProvider } from "./components/Providers/config-provider";
import Toolbar from "./components/Toolbar";
import { ToolbarProvider } from "./components/Providers/toolbar-provider";
import Preview from "./components/Preview";
import Status from "./Status";
//style
const Container = styled.div`
  width: 100%;
  min-width: 700px;
  max-width: 1200px;
  min-height: 500px;
  height: 100%;
  /* border: 1px solid #e6e6e6; */
  border: 1px solid ${(props) => props.theme.borderColor};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  /* background-color: #fff; */
  background-color: ${(props) => props.theme.background};
  &.md-editor-fullscreen {
    position: fixed !important;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10000 !important;
    width: auto !important;
    max-width: none !important;
    height: auto !important;
  }
`;
const StyledRow = styled(Row)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  .ant-col {
    height: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar-thumb {
      /* background-color: #d9d9d9; */
      background-color: ${(props) => props.theme.scrollbarThumbBgColor};
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      /* background-color: #f5f5f5; */
      background-color: ${(props) => props.theme.scrollbarTrackBgColor};
    }
  }
`;

const Divider = styled.div/*css*/ `
  background-color: ${(props) => props.theme.borderColor};
  display: inline-block;
  height: 100%;
  width: 1px;
  position: absolute;
  top: 50%;
  z-index: 1;
`;
const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

//布局映射
const LayoutConfig = {
  // 只写模式
  WRITE_ONLY: {
    cols: [24, 0, 0],
    components: ["editor", "preview", "sidebar"],
    // 仅预览模式
    READ_ONLY: {
      cols: [0, 18, 0],
      components: ["editor", "preview", "sidebar"],
    },
  },
  //只读
  READ_ONLY: { cols: [0, 18, 0], components: ["editor", "preview", "sidebar"] },
  // 读写模式
  READ_WRITE: {
    cols: [12, 12, 0],
    components: ["editor", "preview", "sidebar"],
  },
  // 只写+侧边栏
  WRITE_ONLY_SIDEBAR: {
    cols: [18, 0, 6],
    components: ["editor", "preview", "sidebar"],
  },
  // 仅预览+侧边栏
  READ_ONLY_SIDEBAR: {
    cols: [0, 18, 6],
    components: ["editor", "preview", "sidebar"],
  },
  // 读写+侧边栏
  READ_WRITE_SIDEBAR: {
    cols: [9, 9, 6],
    components: ["editor", "preview", "sidebar"],
  },
};

//渲染不同区域
const RenderRow: FC<{
  editor: React.ReactNode;
  preview?: React.ReactNode;
}> = ({ editor, preview }) => {
  const { isOnlyWrite, isOnlyPreview, isSidebar, sidebarComponent } =
    useToolbarStore();
  //根据状态切换布局
  const getLayOutConfig = () => {
    //只写
    if (isOnlyWrite && !isOnlyPreview) {
      return isSidebar
        ? LayoutConfig.WRITE_ONLY_SIDEBAR
        : LayoutConfig.WRITE_ONLY;
    }
    if (!isOnlyWrite && isOnlyPreview) {
      return isSidebar
        ? LayoutConfig.READ_ONLY_SIDEBAR
        : LayoutConfig.READ_ONLY;
    }
    // 处理读写模式（默认模式）
    if (!isOnlyWrite && !isOnlyPreview) {
      return isSidebar
        ? LayoutConfig.READ_WRITE_SIDEBAR
        : LayoutConfig.READ_WRITE;
    }
    // 处理异常情况（都为true的情况），默认返回只写模式
    return isSidebar
      ? LayoutConfig.WRITE_ONLY_SIDEBAR
      : LayoutConfig.WRITE_ONLY;
  };
  const layout = getLayOutConfig();
  //组件
  const components = {
    editor,
    preview,
    sidebar: sidebarComponent,
  };
  const showDivide = layout.cols.filter((col) => col > 0).length > 1;

  return (
    <>
      {layout.cols.map((span, index) => {
        const offset =
          (layout.cols
            .slice(0, index + 1)
            .reduce((acc, curr) => acc + curr, 0) /
            layout.cols.reduce((acc, curr) => acc + curr, 0)) *
          100;
        return (
          <Fragment key={`col-${index}`}>
            <Col span={span}>
              {components[layout.components[index] as keyof typeof components]}
            </Col>
            {showDivide && offset !== 100 && (
              <Divider
                style={{
                  left: `${offset}%`,
                  transform: `translate(-${offset}%,-50%)`,
                }}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
};

const EditorWrapper = forwardRef<EditorRef, GlobalConfig>((config, ref) => {
  const content = useEditorContentStore((state) => state.content);
  const deferredContent = useDeferredValue(content);
  const isFullScreen = useToolbarStore((state) => state.isFullScreen);
  const { isSyncScroll, updateSyncScrollStatus } = useInitSyncScrollStatus();

  //迟更新某些非关键 UI 内容,以避免阻塞主线程，提升用户体验
  //forwardRef允许组件接受一个ref
  // 语言初始化
  useEffect(() => {
    if (config.locale) {
      setLocale(config.locale);
    }
  }, [config.locale]);

  useExposeHandle(ref);
  return (
    <GlobalTheme theme={config.theme}>
      <Container
        className={`md-editor ${isFullScreen ? "md-editor-fullscreen" : ""}`}
        data-theme={{ ...defaultConfig, ...config }.theme}
        data-locale={{ ...defaultConfig, ...config }.locale}
      >
        <ConfigProvider config={config}>
          <AntdConfigProvider
            theme={{
              algorithm:
                { ...defaultConfig, ...config }.theme === "light"
                  ? undefined
                  : AntdTheme.darkAlgorithm,
            }}
          >
            {/*工具栏*/}
            <ToolbarProvider toolbarConfig={config.toolbars}>
              <Toolbar />
              <ContentWrapper className="mini-editor-content">
                <StyledRow>
                  <RenderRow
                    editor={<Editor isSyncScroll={isSyncScroll} {...config} />}
                    preview={
                      <Preview
                        content={deferredContent}
                        isSyncScroll={isSyncScroll}
                      />
                    }
                  />
                </StyledRow>
              </ContentWrapper>
            </ToolbarProvider>
            {{ ...defaultConfig, ...config }.status ? (
              <Status
                isSyncScroll={isSyncScroll}
                updateSyncScrollStatus={updateSyncScrollStatus}
              />
            ) : null}
          </AntdConfigProvider>
        </ConfigProvider>
      </Container>
    </GlobalTheme>
  );
});
export default EditorWrapper;
