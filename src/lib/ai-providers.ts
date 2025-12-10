/**
 * AI Provider Abstraction Layer
 * Based on official Google Gemini API documentation
 * Reference: https://ai.google.dev/gemini-api/docs
 */

import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai'
import OpenAI from 'openai'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type AIProvider = 'openai' | 'gemini'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AICompletionOptions {
  model?: string
  messages: AIMessage[]
  max_tokens?: number
  temperature?: number
  response_format?: { type: 'json_object' | 'text' }
}

export interface AICompletionResponse {
  content: string | null
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
  finish_reason?: string
}

// ============================================================================
// PROVIDER CONFIGURATION
// ============================================================================

const AI_PROVIDER = (process.env.AI_PROVIDER || 'openai') as AIProvider

// OpenAI Configuration
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://models.inference.ai.azure.com",
})

// Gemini Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const geminiClient = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

// Default models (based on official docs Dec 2024)
const DEFAULT_MODELS = {
  openai: 'gpt-4.1',
  gemini: 'gemini-2.5-flash', // Stable, recommended
} as const

// ============================================================================
// OPENAI PROVIDER IMPLEMENTATION
// ============================================================================

async function generateWithOpenAI(
  options: AICompletionOptions
): Promise<AICompletionResponse> {
  const model = options.model || DEFAULT_MODELS.openai

  const completion = await openaiClient.chat.completions.create({
    model,
    messages: options.messages.map((msg) => ({
      role: msg.role === 'system' ? 'system' : msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })),
    max_tokens: options.max_tokens,
    temperature: options.temperature,
    response_format: options.response_format,
  })

  return {
    content: completion.choices[0]?.message?.content || null,
    usage: {
      prompt_tokens: completion.usage?.prompt_tokens,
      completion_tokens: completion.usage?.completion_tokens,
      total_tokens: completion.usage?.total_tokens,
    },
    finish_reason: completion.choices[0]?.finish_reason,
  }
}

// ============================================================================
// GEMINI PROVIDER IMPLEMENTATION
// ============================================================================

/**
 * Convert OpenAI-style messages to Gemini format
 * Per official docs: https://ai.google.dev/api/generate-content
 */
function convertMessagesToGemini(messages: AIMessage[]): {
  systemInstruction?: string
  history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>
  userMessage: string
} {
  const systemMessages = messages.filter((m) => m.role === 'system')
  const conversationMessages = messages.filter((m) => m.role !== 'system')

  const systemInstruction = systemMessages.map((m) => m.content).join('\n\n')

  const history = conversationMessages.slice(0, -1).map((msg) => ({
    role: (msg.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
    parts: [{ text: msg.content }],
  }))

  const userMessage = conversationMessages[conversationMessages.length - 1]?.content || ''

  return { systemInstruction, history, userMessage }
}

/**
 * Generate completion using Gemini API
 * Per official docs: https://ai.google.dev/api/generate-content
 */
async function generateWithGemini(
  options: AICompletionOptions
): Promise<AICompletionResponse> {
  if (!geminiClient) {
    throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY environment variable.')
  }

  const modelName = options.model || DEFAULT_MODELS.gemini
  const { systemInstruction, history, userMessage } = convertMessagesToGemini(options.messages)

  // Per official GenerationConfig spec
  const generationConfig: GenerationConfig = {
    temperature: options.temperature ?? 0.7,
    maxOutputTokens: options.max_tokens ?? 8192,
    responseMimeType: options.response_format?.type === 'json_object' 
      ? "application/json" 
      : "text/plain",
  }

  const model: GenerativeModel = geminiClient.getGenerativeModel({
    model: modelName,
    generationConfig,
    systemInstruction: systemInstruction || undefined,
  })

  let result
  
  if (history.length > 0) {
    const chat = model.startChat({ history })
    result = await chat.sendMessage(userMessage)
  } else {
    result = await model.generateContent(userMessage)
  }

  const response = result.response
  const text = response.text()
  const usageMetadata = response.usageMetadata

  return {
    content: text,
    usage: {
      prompt_tokens: usageMetadata?.promptTokenCount,
      completion_tokens: usageMetadata?.candidatesTokenCount,
      total_tokens: usageMetadata?.totalTokenCount,
    },
    finish_reason: response.candidates?.[0]?.finishReason || 'stop',
  }
}

// ============================================================================
// UNIFIED API
// ============================================================================

export async function generateAICompletion(
  options: AICompletionOptions
): Promise<AICompletionResponse> {
  try {
    console.log(`🤖 Using AI Provider: ${AI_PROVIDER}`)
    
    if (AI_PROVIDER === 'gemini') {
      return await generateWithGemini(options)
    } else {
      return await generateWithOpenAI(options)
    }
  } catch (error) {
    console.error(`🔴 Error generating AI completion with ${AI_PROVIDER}:`, error)
    throw error
  }
}

export function getCurrentProvider(): AIProvider {
  return AI_PROVIDER
}

export function getDefaultModel(): string {
  return DEFAULT_MODELS[AI_PROVIDER]
}

export function isProviderConfigured(): boolean {
  if (AI_PROVIDER === 'gemini') {
    return !!GEMINI_API_KEY
  } else {
    return !!process.env.OPENAI_API_KEY
  }
}

export { openaiClient, geminiClient }
