import type { TOKENS_TYPES } from "../common/tokens-types";

// 导出分词类型（也就是区分当前是什么类型的节点）
export type TokensTypes = Record<keyof typeof TOKENS_TYPES, TokenTypeVal>;
// 分词类型的 key
export type TokensTypesKey = keyof TokensTypes;
export type TokensTypesKey1 = keyof typeof TOKENS_TYPES;
// 分词类型的 value
export type TokenTypeVal = (typeof TOKENS_TYPES)[keyof typeof TOKENS_TYPES];
