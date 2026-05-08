import { env } from '../config/env.js'
import { OpenAICompatibleProvider } from './openaiCompatibleProvider.js'
import type { ProviderConfig, ProviderSummary } from '../types/provider.js'

export function getProviderConfigs(): ProviderConfig[] {
  return [
    {
      id: 'openai-compatible',
      label: 'OpenAI Compatible',
      baseUrl: env.openAIBaseUrl,
      apiKey: env.openAIApiKey,
      model: env.openAIModel,
      configured: Boolean(env.openAIBaseUrl && env.openAIApiKey && env.openAIModel),
    },
  ]
}

export function getProviderSummaries(): ProviderSummary[] {
  return getProviderConfigs().map(({ id, label, model, baseUrl, configured }) => ({
    id,
    label,
    model,
    baseUrl,
    configured,
  }))
}

export function getDefaultProvider() {
  const provider = getProviderConfigs().find((item) => item.id === env.defaultProvider)
  if (!provider) {
    throw new Error(`未找到默认 provider：${env.defaultProvider}`)
  }
  if (!provider.configured) {
    throw new Error(`Provider ${provider.label} 尚未完成配置，请检查 server/.env`)
  }
  return new OpenAICompatibleProvider(provider)
}
