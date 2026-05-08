import type { GenerateWordPackInput } from '../types/provider.js'

export const systemPrompt = `你是一个严谨的英语学习内容生成器。请只输出 JSON，不要输出解释、Markdown、前后缀说明。

你的任务是为中文用户生成旅游英语或商务英语学习词单。输出必须适合单词记忆场景，内容自然、准确、实用、不过度学术化。`

export function buildUserPrompt(input: GenerateWordPackInput) {
  return `请基于以下要求生成一份英语学习词单，并严格输出 JSON：

主题：${input.topic}
场景：${input.scene}
难度：${input.difficulty}
词数：${input.wordCount}

JSON 结构必须为：
{
  "topic": "string",
  "scene": "string",
  "level": "string",
  "cards": [
    {
      "word": "string",
      "phonetic": "string",
      "partOfSpeech": "string",
      "meaningZh": "string",
      "exampleEn": "string",
      "exampleZh": "string",
      "memoryTip": "string",
      "tags": ["string"]
    }
  ]
}

额外要求：
1. 每个单词都必须是高频、真实可用的旅游英语或商务英语词汇。
2. 所有中文释义和中文例句解释必须自然、简洁。
3. 英文例句必须符合真实语境，长度适中。
4. tags 使用小写英文词。
5. 不要返回重复单词。
6. 不要输出 JSON 以外的任何字符。`
}
