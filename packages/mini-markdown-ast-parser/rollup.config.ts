import { defineConfig } from "rollup";
import path from "node:path";
import { fileURLToPath } from "node:url";
import alias from "@rollup/plugin-alias";
import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
// import { babel } from "@rollup/plugin-babel";
// import { terser } from "rollup-plugin-terser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs",
      format: "cjs",
    },
    {
      file: "dist/index.js",
      format: "esm",
    },
  ],
  external: ["highlight.js"],
  plugins: [
    postcss({
      extract: "style/index.css",
      minimize: true,
    }),
    resolve(),
    // 没有这个插件，Rollup 找不到 lodash
    // import _ from 'lodash'  // ❌ 错误：无法解析 lodash
    commonjs(),
    del({ targets: ["dist"] }),
    // 在每次打包前删除 dist目录
    // 避免旧文件残留导致问题
    alias({
      entries: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
    }),
    typescript({
      tsconfig: path.resolve(__dirname, "./tsconfig.json"),
      declaration: true, // ⭐ 生成 .d.ts 类型声明文件
      declarationDir: path.resolve(__dirname, "./dist/types"), // 声明文件输出目录
    }),
  ],
});
