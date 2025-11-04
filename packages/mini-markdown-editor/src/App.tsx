import { type FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import EditorWrapper from "./EditorWrapper";
import type { Callback } from "./types/global-config";
import { Button, message } from "antd";
// 可根据需要引入不同的主题
import "highlight.js/styles/atom-one-dark.css";
import { EditorView } from "@uiw/react-codemirror";
import { type EditorRef } from "./types/ref";
import UlIcon from "@/assets/images/ul.svg?raw";

// 正确导入toolbarConfig和相关类型
// import { toolbarConfig } from "./config/toolbar";
// import { ToolbarEvents, type ToolbarItem } from "./types/toolbar";

const AppWrapper = styled.div`
  width: 100%;
  height: 95vh;
  background-color: #fafafa;
  padding: 50px;
  // 修改默认颜色
  .mini-md-h1 {
    color: orange;
  }
`;

const App: FC = () => {
  // 请求测试
  const handleUpload = async (file: File, callback: Callback) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("settimeout 上传成功", file);
        resolve({});
      }, 1500);
    });
    callback({
      url: "https://www.baidu.com/img/flexible/logo/pc/result@2.png",
      alt: "alt",
    });
    message.success("上传成功");
  };

  const [theme, setTheme] = useState("light");
  const changeTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSave = (content: string, view: EditorView) => {
    console.log(content, view);
  };

  const handlePatseUpload = async (file: File, callback: Callback) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("settimeout 上传成功", file);
        resolve({});
      }, 1500);
    });
    callback({
      url: "https://www.baidu.com/img/flexible/logo/pc/result@2.png",
      alt: "123",
    });
    message.success("上传成功");
  };

  const editorRef = useRef<EditorRef>(null);
  useEffect(() => {
    if (editorRef.current) {
      console.log(editorRef.current);
    }
  }, []);

  // 使用事件添加工具栏配置
  // useEffect(() => {
  //   try {
  //     // 监听工具栏添加事件
  //     const handleToolbarAdded = (toolbarItem: ToolbarItem) => {
  //       console.log("工具栏项已添加:", toolbarItem);
  //       message.success(`工具栏项 "${toolbarItem.title}" 添加成功`);
  //     };

  //     // 监听工具栏错误事件
  //     const handleToolbarError = (error: string) => {
  //       console.error("工具栏错误:", error);
  //       message.error(error);
  //     };

  //     // 注册事件监听器
  //     toolbarConfig.on(ToolbarEvents.TOOLBAR_ADDED, handleToolbarAdded);
  //     toolbarConfig.on(ToolbarEvents.TOOLBAR_ERROR, handleToolbarError);

  //     // 添加新的工具栏项
  //     toolbarConfig.addToolItem({
  //       type: "custom-tool",
  //       title: "自定义工具",
  //       icon: UlIcon,
  //       description: "这是一个通过事件添加的自定义工具栏项",
  //       hotkey: {
  //         command: "Mod-l",
  //         description: "触发自定义工具",
  //         handle: () => {
  //           console.log("通过快捷键触发自定义工具");
  //         },
  //       },
  //       onClick: () => {
  //         console.log("自定义工具被点击");
  //         // 可以在这里添加自定义功能逻辑
  //       },
  //     });

  //     // 清理函数
  //     return () => {
  //       toolbarConfig.off(ToolbarEvents.TOOLBAR_ADDED, handleToolbarAdded);
  //       toolbarConfig.off(ToolbarEvents.TOOLBAR_ERROR, handleToolbarError);
  //       // 移除添加的工具栏项（可选）
  //       // toolbarConfig.removeToolItem("custom-tool");
  //     };
  //   } catch (e) {
  //     console.error("添加工具栏项失败:", e);
  //     message.error("添加工具栏项失败");
  //   }
  // }, []);

  return (
    <AppWrapper>
      <Button onClick={changeTheme}>主题切换{theme}</Button>
      <Button
        onClick={() => {
          editorRef.current?.setContent("hello world");
        }}
      >
        插入内容
      </Button>
      <Button
        onClick={() => {
          const text = editorRef.current?.getContent();
          console.log(text);
        }}
      >
        获取内容
      </Button>
      <Button
        onClick={() => {
          editorRef.current?.clear();
        }}
      >
        清空内容
      </Button>
      <Button
        onClick={() => {
          editorRef.current?.setCursor(100, 100);
        }}
      >
        设置光标位置（100，100）
      </Button>
      <Button
        onClick={() => {
          const pos = editorRef.current?.getCursor();
          console.log(pos);
        }}
      >
        获取光标位置
      </Button>
      <Button
        onClick={() => {
          const text = editorRef.current?.getSelection();
          console.log(text);
        }}
      >
        获取选中内容
      </Button>
      <Button
        onClick={() => {
          editorRef.current?.focus();
        }}
      >
        聚焦
      </Button>
      <Button
        onClick={() => {
          const instance = editorRef.current?.getEditorInstance();
          console.log(instance);
        }}
      >
        获取编辑器实例
      </Button>
      <Button
        onClick={() => {
          const instance = editorRef.current?.getPreviewInstance();
          console.log(instance);
        }}
      >
        获取预览区实例
      </Button>
      {/* <EditorWrapper theme={theme as "light" | "dark"} onSave={handleSave} /> */}
      <EditorWrapper
        locale="cn"
        placeholder={"请输入内容..."}
        status={true}
        onUpload={handleUpload}
        local={false}
        lineNumbers={true}
        theme={theme as "light" | "dark"}
        // onChange={handleChange}
        onSave={handleSave}
        onDragUpload={handlePatseUpload}
        onPatseUpload={handlePatseUpload}
        ref={editorRef}
        enableShortcuts={true}
        toolbars={{
          // excludeTools: ["italic"],
          addTools: [
            {
              type: "123",
              title: "我是测试123",
              icon: UlIcon,
              description: "我是描述123",
              hotkey: {
                command: "Mod-p",
                description: "控制台输出123",
                handle: () => {
                  console.log("我是快捷键输出123");
                },
              },
              onClick: () => {
                console.log("我是快捷键输出123");
              },
            },
            {
              type: "12",
              title: "我是测试12",
              icon: UlIcon,
              description: "我是描述12",
              hotkey: {
                command: "Mod-o",
                description: "控制台输出12",
                handle: () => {
                  console.log("我是快捷键输出12");
                },
              },
              onClick: () => {
                console.log("我是快捷键输出12");
              },
            },
          ],
          orderTools: [
            { type: "123", order: 1 },
            { type: "12", order: 0 },
          ],
        }}
        // value="## Hello World."
        autoFocus={true}
      />
    </AppWrapper>
  );
};

export default App;
