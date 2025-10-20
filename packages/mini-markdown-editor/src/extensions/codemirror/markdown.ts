import { markdown } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { markdownLanguage } from "@codemirror/lang-markdown";
import type { Extension } from "@codemirror/state";

export const createMarkdownExtension = (): Extension => {
  return markdown({
    base: markdownLanguage,
    codeLanguages: languages,
  });
};
