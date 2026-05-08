import type { FastifyPluginAsync } from 'fastify'
import { getProviderSummaries } from '../services/providerRegistry.js'

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/api/health', async () => {
    const providers = getProviderSummaries()
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      configuredProviders: providers.filter((item) => item.configured).length,
    }
  })
}
