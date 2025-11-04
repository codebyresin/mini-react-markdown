import React, { FC } from "react";
import "highlight.js/styles/atom-one-dark.css";
import "./styles.css";
import { Editor } from "@mini-markdown-resin/editor";
const Layout: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="w-full h-[90vh] px-6 py-4">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold">在线尝试🥳</h1>
      </header>
      <Editor />
    </div>
  );
};

export default Layout;
