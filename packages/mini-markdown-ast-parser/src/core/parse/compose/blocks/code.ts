import type { Tokens } from '@/types/tokens'
import type { ParseFnParams } from '..'
import { TokenTypeVal } from '@/types/tokens-types'

// 转换 code 代码块
export const parseCode = ({
  trimmedLine,
  line,
  index,
  currentOffset,
  root,
  currentStatus,
  lines
}: ParseFnParams) => {
  // 代码块处理
  if (trimmedLine.startsWith('```')) {
    if (!currentStatus.inCodeBlock) {
      currentStatus.inCodeBlock = true
      currentStatus.codeBlockLang = trimmedLine.slice(3).trim()
      currentStatus.codeBlockValue = ''
      currentStatus.codeBlockStartOffset = currentOffset
      currentStatus.codeBlockStartLine = index + 1
    } else {
      currentStatus.inCodeBlock = false
      const codeNode: Tokens = {
        type: 'code' as TokenTypeVal,
        lang: currentStatus.codeBlockLang,
        meta: null,
        value: currentStatus.codeBlockValue.trim(),
        position: {
          start: {
            line: currentStatus.codeBlockStartLine,
            column: 1,
            offset: currentStatus.codeBlockStartOffset
          },
          end: {
            line: index + 1,
            column: trimmedLine.length + 1,
            offset: currentOffset + trimmedLine.length
          }
        }
      }
      root.children.push(codeNode)
    }
    return true
  } else if (currentStatus.inCodeBlock) {
    currentStatus.codeBlockValue += line + '\n'
    // 如果是最后一行且仍在代码块中，强制生成代码块节点
    if (index === lines.length - 1) {
      currentStatus.inCodeBlock = false
      const codeNode: Tokens = {
        type: 'code' as TokenTypeVal,
        lang: currentStatus.codeBlockLang,
        meta: null,
        value: currentStatus.codeBlockValue.trim(),
        position: {
          start: {
            line: currentStatus.codeBlockStartLine,
            column: 1,
            offset: currentStatus.codeBlockStartOffset
          },
          end: {
            line: index + 1,
            column: line.length + 1,
            offset: currentOffset + line.length
          }
        }
      }
      root.children.push(codeNode)
    }
    return true
  }
}
