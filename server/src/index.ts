import Fastify from 'fastify'
import cors from '@fastify/cors'
import { env } from './config/env.js'
import { generateRoutes } from './routes/generate.js'
import { healthRoutes } from './routes/health.js'
import { providerRoutes } from './routes/providers.js'

export function buildServer() {
  const server = Fastify({ logger: true })

  server.register(cors, {
    origin: true,
  })
  server.register(healthRoutes)
  server.register(providerRoutes)
  server.register(generateRoutes)

  return server
}

async function start() {
  const server = buildServer()
  try {
    await server.listen({ port: env.port, host: '0.0.0.0' })
  } catch (error) {
    server.log.error(error)
    process.exit(1)
  }
}

if (process.env.VITEST !== 'true') {
  start()
}
