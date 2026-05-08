import type { FastifyPluginAsync } from 'fastify'
import { getDefaultProvider } from '../services/providerRegistry.js'
import type { GenerateWordPackInput } from '../types/provider.js'

function validateInput(body: unknown): GenerateWordPackInput {
  if (!body || typeof body !== 'object') {
    throw new Error('请求体无效')
  }

  const source = body as Record<string, unknown>
  const topic = typeof source.topic === 'string' ? source.topic.trim() : ''
  const scene = typeof source.scene === 'string' ? source.scene.trim() : ''
  const difficulty = typeof source.difficulty === 'string' ? source.difficulty.trim() : ''
  const wordCount = Number(source.wordCount)

  if (!topic) {
    throw new Error('请输入主题')
  }
  if (!scene) {
    throw new Error('请选择场景')
  }
  if (!difficulty) {
    throw new Error('请选择难度')
  }
  if (!Number.isFinite(wordCount) || wordCount < 8 || wordCount > 15) {
    throw new Error('词数必须在 8 到 15 之间')
  }

  return {
    topic,
    scene,
    difficulty,
    wordCount,
  }
}

export const generateRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/api/generate-word-pack', async (request, reply) => {
    try {
      const input = validateInput(request.body)
      const provider = getDefaultProvider()
      const pack = await provider.generateWordPack(input)
      return { pack }
    } catch (error) {
      const message = error instanceof Error ? error.message : '生成词单失败'
      reply.code(400)
      return { message }
    }
  })
}
