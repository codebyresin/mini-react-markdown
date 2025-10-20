import { defineConfig, type PluginOption } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
// 打包后生成d.ts文件
import dts from "vite-plugin-dts";
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  return {
    plugins: [
      react() as PluginOption,
      ...(isProd
        ? [dts({ tsconfigPath: "./tsconfig.app.json", include: ["src/**"] })]
        : []),
    ],
    //生产构建提供额外类型声明文件
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      terserOptions: {
        //代码压缩
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
        },
      },
      lib: {
        entry: "src/index.tsx",
        name: "mini-markdown-editor",
        fileName: "mini-markdown-editor",
      },
      rollupOptions: {
        external: ["react", "react-dom", "highlight.js"], // 不打包这些依赖
        output: {
          chunkFileNames: `dist/chunks/[name].js`, // 动态导入的 chunk 存放位置
          inlineDynamicImports: true, // 是否内联动态导入（按需）
          globals: {
            // 告诉 Rollup，这些外部库在全局环境中的变量名
            react: "React",
            "react-dom": "ReactDOM",
            "highlight.js": "hljs",
          },
        },
      },
    },
  };
});
