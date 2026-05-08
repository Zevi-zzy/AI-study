import dotenv from 'dotenv'

dotenv.config()

const DEFAULT_PORT = 8787

function toPort(value: string | undefined) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PORT
}

export const env = {
  port: toPort(process.env.PORT),
  defaultProvider: process.env.DEFAULT_PROVIDER?.trim() || 'openai-compatible',
  openAIBaseUrl: process.env.OPENAI_BASE_URL?.trim() || 'https://api.openai.com/v1',
  openAIApiKey: process.env.OPENAI_API_KEY?.trim() || '',
  openAIModel: process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini',
}
