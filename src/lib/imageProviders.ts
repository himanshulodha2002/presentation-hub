'use server'

import { GoogleGenAI } from '@google/genai'
import { put } from '@vercel/blob'
import mime from 'mime'

/**
 * Supported image generation providers
 */
export type ImageProvider = 'cloudflare' | 'huggingface' | 'replicate' | 'gemini'

/**
 * Image generation response interface
 */
export interface ImageGenerationResponse {
  url: string
  error?: string
}

/**
 * Get the configured image provider from environment variables
 * Defaults to 'gemini' if not set
 */
export function getImageProvider(): ImageProvider {
  const provider = process.env.IMAGE_GENERATION_PROVIDER?.toLowerCase()

  switch (provider) {
    case 'cloudflare':
      return 'cloudflare'
    case 'huggingface':
      return 'huggingface'
    case 'replicate':
      return 'replicate'
    case 'gemini':
    default:
      return 'gemini'
  }
}

/**
 * Cloudflare Workers AI Image Generation
 * Uses @cf/black-forest-labs/flux-1-schnell model (free tier)
 */
async function generateImageCloudflare(prompt: string): Promise<ImageGenerationResponse> {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const apiToken = process.env.CLOUDFLARE_API_TOKEN

    if (!accountId || !apiToken) {
      console.error('🔴 ERROR: CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN not set')
      return {
        url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=Cloudflare+API+Not+Configured',
        error: 'Cloudflare API credentials not configured'
      }
    }

    // Use FLUX.1 Schnell model - fast and free on Workers AI
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          num_steps: 4, // Fast generation
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('🔴 Cloudflare API error:', errorText)
      return {
        url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=Cloudflare+Generation+Failed',
        error: `Cloudflare API error: ${response.status}`
      }
    }

    // Cloudflare returns the image as a binary blob
    const imageBuffer = Buffer.from(await response.arrayBuffer())

    // Upload to Vercel Blob
    const fileName = `cloudflare_image_${Date.now()}`
    const blobPath = `images/${fileName}.png`

    const { url } = await put(blobPath, imageBuffer, {
      access: 'public',
      contentType: 'image/png'
    })

    console.log('✅ Cloudflare image generated:', url)
    return { url }
  } catch (error) {
    console.error('🔴 Cloudflare generation error:', error)
    return {
      url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=Cloudflare+Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Hugging Face Inference API Image Generation
 * Uses Stable Diffusion or FLUX models (free tier with rate limits)
 */
async function generateImageHuggingFace(prompt: string): Promise<ImageGenerationResponse> {
  try {
    const apiToken = process.env.HUGGINGFACE_API_TOKEN

    if (!apiToken) {
      console.error('🔴 ERROR: HUGGINGFACE_API_TOKEN not set')
      return {
        url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=HuggingFace+API+Not+Configured',
        error: 'HuggingFace API token not configured'
      }
    }

    // Use model from env or default to Stable Diffusion XL
    const model = process.env.HUGGINGFACE_MODEL || 'stabilityai/stable-diffusion-xl-base-1.0'

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            num_inference_steps: 30,
            guidance_scale: 7.5,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('🔴 HuggingFace API error:', errorText)

      // Check if model is loading
      if (response.status === 503) {
        return {
          url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=Model+Loading',
          error: 'Model is loading, please try again in a few seconds'
        }
      }

      return {
        url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=HuggingFace+Generation+Failed',
        error: `HuggingFace API error: ${response.status}`
      }
    }

    // HuggingFace returns the image as a binary blob
    const imageBuffer = Buffer.from(await response.arrayBuffer())

    // Upload to Vercel Blob
    const fileName = `huggingface_image_${Date.now()}`
    const blobPath = `images/${fileName}.png`

    const { url } = await put(blobPath, imageBuffer, {
      access: 'public',
      contentType: 'image/png'
    })

    console.log('✅ HuggingFace image generated:', url)
    return { url }
  } catch (error) {
    console.error('🔴 HuggingFace generation error:', error)
    return {
      url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=HuggingFace+Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Replicate API Image Generation
 * Uses FLUX or Stable Diffusion models (free tier with credits)
 * Great for students with GitHub Student Developer Pack
 */
async function generateImageReplicate(prompt: string): Promise<ImageGenerationResponse> {
  try {
    const apiToken = process.env.REPLICATE_API_TOKEN

    if (!apiToken) {
      console.error('🔴 ERROR: REPLICATE_API_TOKEN not set')
      return {
        url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=Replicate+API+Not+Configured',
        error: 'Replicate API token not configured'
      }
    }

    // Use FLUX.1 Schnell - fastest and cheapest option
    const model = process.env.REPLICATE_MODEL || 'black-forest-labs/flux-schnell'
    const version = 'bf0a9b4c37e1e64f68c1b1b2a7cce50c8f4e4e0e0c8f4e4e0e0c8f4e4e0e0c8f'

    // Start prediction
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: version,
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: '16:9',
          output_format: 'png',
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('🔴 Replicate API error:', errorText)
      return {
        url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=Replicate+Generation+Failed',
        error: `Replicate API error: ${response.status}`
      }
    }

    const prediction = await response.json()

    // Poll for completion (Replicate is async)
    let result = prediction
    let attempts = 0
    const maxAttempts = 60 // 60 seconds max wait

    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second

      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          'Authorization': `Token ${apiToken}`,
        },
      })

      result = await statusResponse.json()
      attempts++
    }

    if (result.status === 'failed') {
      console.error('🔴 Replicate prediction failed:', result.error)
      return {
        url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=Generation+Failed',
        error: 'Image generation failed'
      }
    }

    if (result.status !== 'succeeded' || !result.output || result.output.length === 0) {
      return {
        url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=Timeout',
        error: 'Image generation timed out'
      }
    }

    // Get the image URL from output
    const imageUrl = result.output[0]

    // Download and upload to Vercel Blob for consistent storage
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())

    const fileName = `replicate_image_${Date.now()}`
    const blobPath = `images/${fileName}.png`

    const { url } = await put(blobPath, imageBuffer, {
      access: 'public',
      contentType: 'image/png'
    })

    console.log('✅ Replicate image generated:', url)
    return { url }
  } catch (error) {
    console.error('🔴 Replicate generation error:', error)
    return {
      url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=Replicate+Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Google Gemini 2.0 Flash Image Generation (original implementation)
 */
async function generateImageGemini(prompt: string): Promise<ImageGenerationResponse> {
  try {
    if (!process.env.GOOGLE_GENAI_API_KEY) {
      console.error('🔴 ERROR: GOOGLE_GENAI_API_KEY not set')
      return {
        url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=Gemini+API+Not+Configured',
        error: 'Google GenAI API key not configured'
      }
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    })

    const config = {
      responseModalities: ['IMAGE', 'TEXT'],
    }

    const model = 'gemini-2.0-flash-preview-image-generation'
    const contents = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ]

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    })

    let fileIndex = 0
    let imageFileName = ''

    for await (const chunk of response) {
      if (!chunk.candidates?.[0]?.content?.parts) {
        continue
      }

      if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        const fileName = `gemini_image_${Date.now()}_${fileIndex++}`
        const inlineData = chunk.candidates[0].content.parts[0].inlineData
        const fileExtension = mime.getExtension(inlineData.mimeType || '')
        const buffer = Buffer.from(inlineData.data || '', 'base64')
        const blobPath = `images/${fileName}.${fileExtension}`

        try {
          const { url } = await put(blobPath, buffer, { access: 'public' })
          imageFileName = url
          console.log('✅ Gemini image generated:', url)
        } catch (err) {
          console.error('🔴 Failed to upload Gemini image to Vercel Blob:', err)
        }

        // Only return the first image
        break
      }
    }

    if (imageFileName) {
      return { url: imageFileName }
    }

    return {
      url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=No+Image+Generated',
      error: 'No image was generated'
    }
  } catch (error) {
    console.error('🔴 Gemini generation error:', error)
    return {
      url: 'https://placehold.co/1024x768/e2e8f0/64748b?text=Gemini+Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Main image generation function that routes to the appropriate provider
 * based on environment configuration
 */
export async function generateImage(prompt: string): Promise<string> {
  const provider = getImageProvider()

  console.log(`🎨 Generating image with provider: ${provider}`)
  console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`)

  let result: ImageGenerationResponse

  switch (provider) {
    case 'cloudflare':
      result = await generateImageCloudflare(prompt)
      break
    case 'huggingface':
      result = await generateImageHuggingFace(prompt)
      break
    case 'replicate':
      result = await generateImageReplicate(prompt)
      break
    case 'gemini':
    default:
      result = await generateImageGemini(prompt)
      break
  }

  if (result.error) {
    console.error(`🔴 Error with ${provider}:`, result.error)
  }

  return result.url
}

/**
 * Get provider-specific configuration info for debugging
 */
export function getProviderInfo(): {
  provider: ImageProvider
  configured: boolean
  message: string
} {
  const provider = getImageProvider()

  let configured = false
  let message = ''

  switch (provider) {
    case 'cloudflare':
      configured = !!(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN)
      message = configured
        ? 'Cloudflare Workers AI is configured and ready'
        : 'Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN'
      break
    case 'huggingface':
      configured = !!process.env.HUGGINGFACE_API_TOKEN
      message = configured
        ? 'Hugging Face is configured and ready'
        : 'Missing HUGGINGFACE_API_TOKEN'
      break
    case 'replicate':
      configured = !!process.env.REPLICATE_API_TOKEN
      message = configured
        ? 'Replicate is configured and ready'
        : 'Missing REPLICATE_API_TOKEN'
      break
    case 'gemini':
      configured = !!process.env.GOOGLE_GENAI_API_KEY
      message = configured
        ? 'Google Gemini is configured and ready'
        : 'Missing GOOGLE_GENAI_API_KEY'
      break
  }

  return { provider, configured, message }
}
