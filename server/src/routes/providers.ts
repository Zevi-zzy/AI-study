import type { FastifyPluginAsync } from 'fastify'
import { env } from '../config/env.js'
import { getProviderSummaries } from '../services/providerRegistry.js'

export const providerRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/api/providers', async () => {
    return {
      defaultProvider: env.defaultProvider,
      providers: getProviderSummaries(),
    }
  })
}
