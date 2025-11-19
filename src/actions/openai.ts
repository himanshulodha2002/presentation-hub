'use server'

import { client } from '@/lib/prisma'
import { ContentItem, ContentType, Slide } from '@/lib/types'
import { currentUser } from '@clerk/nextjs/server'
import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'

// Import centralized image provider system
import { generateImage, processWithRateLimit } from '@/lib/imageProviders'

// Import centralized prompt engineering functions
import {
  generateOutlinePrompt,
  generateLayoutPrompt,
  generateImagePrompt,
  OUTLINE_SYSTEM_MESSAGE,
  LAYOUT_SYSTEM_MESSAGE,
} from '@/lib/prompts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://models.inference.ai.azure.com",
})

export const generateCreativePrompt = async (userPrompt: string) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://models.inference.ai.azure.com",
  })

  const finalPrompt = generateOutlinePrompt(userPrompt)

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        {
          role: 'system',
          content: OUTLINE_SYSTEM_MESSAGE,
        },
        {
          role: 'user',
          content: finalPrompt,
        },
      ],
      max_tokens: 1200,
      temperature: 0.1,
    })

    const responseContent = completion.choices[0].message?.content
    if (responseContent) {
      try {
        // Strip markdown code block markers and any whitespace
        const cleanJson = responseContent.replace(/```json\n?|\n?```/g, '').trim()
        const jsonResponse = JSON.parse(cleanJson)
        return { status: 200, data: jsonResponse }
      } catch (error) {
        console.error('Invalid JSON received:', responseContent, error)
        return { status: 500, error: 'Invalid JSON format received from AI' }
      }
    }

    return { status: 400, error: 'No content generated' }
  } catch (error) {
    console.error('🔴 ERROR', error)
    return { status: 500, error: 'Internal server error' }
  }
}

// Commented out unused variable
// const existingLayouts = [
//   {
//     id: uuidv4(),
//     slideName: 'Blank card',
//     type: 'blank-card',
//     className: 'p-8 mx-auto flex justify-center items-center min-h-[200px]',
//     content: {
//       id: uuidv4(),
//       type: 'column' as ContentType,
//       name: 'Column',
//       content: [
//         {
//           id: uuidv4(),
//           type: 'title' as ContentType,
//           name: 'Title',
//           content: '',
//           placeholder: 'Untitled Card',
//         },
//       ],
//     },
//   },
//
//   {
//     id: uuidv4(),
//     slideName: 'Accent left',
//     type: 'accentLeft',
//     className: 'min-h-[300px]',
//     content: {
//       id: uuidv4(),
//       type: 'column' as ContentType,
//       name: 'Column',
//       restrictDropTo: true,
//       content: [
//         {
//           id: uuidv4(),
//           type: 'resizable-column' as ContentType,
//           name: 'Resizable column',
//           restrictToDrop: true,
//           content: [
//             {
//               id: uuidv4(),
//               type: 'image' as ContentType,
//               name: 'Image',
//               content:
//                 'https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//               alt: 'Title',
//             },
//             {
//               id: uuidv4(),
//               type: 'column' as ContentType,
//               name: 'Column',
//               content: [
//                 {
//                   id: uuidv4(),
//                   type: 'heading1' as ContentType,
//                   name: 'Heading1',
//                   content: '',
//                   placeholder: 'Heading1',
//                 },
//                 {
//                   id: uuidv4(),
//                   type: 'paragraph' as ContentType,
//                   name: 'Paragraph',
//                   content: '',
//                   placeholder: 'start typing here',
//                 },
//               ],
//               className: 'w-full h-full p-8 flex justify-center items-center',
//               placeholder: 'Heading1',
//             },
//           ],
//         },
//       ],
//     },
//   },
//
//   {
//     id: uuidv4(),
//     slideName: 'Accent Right',
//     type: 'accentRight',
//     className: 'min-h-[300px]',
//     content: {
//       id: uuidv4(),
//       type: 'column' as ContentType,
//       name: 'Column',
//       content: [
//         {
//           id: uuidv4(),
//           type: 'resizable-column' as ContentType,
//           name: 'Resizable column',
//           restrictToDrop: true,
//           content: [
//             {
//               id: uuidv4(),
//               type: 'column' as ContentType,
//               name: 'Column',
//               content: [
//                 {
//                   id: uuidv4(),
//                   type: 'heading1' as ContentType,
//                   name: 'Heading1',
//                   content: '',
//                   placeholder: 'Heading1',
//                 },
//                 {
//                   id: uuidv4(),
//                   type: 'paragraph' as ContentType,
//                   name: 'Paragraph',
//                   content: '',
//                   placeholder: 'start typing here',
//                 },
//               ],
//               className: 'w-full h-full p-8 flex justify-center items-center',
//               placeholder: 'Heading1',
//             },
//             {
//               id: uuidv4(),
//               type: 'image' as ContentType,
//               name: 'Image',
//               restrictToDrop: true,
//               content:
//                 'https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//               alt: 'Title',
//             },
//           ],
//         },
//       ],
//     },
//   },
//
//   {
//     id: uuidv4(),
//     slideName: 'Image and text',
//     type: 'imageAndText',
//     className: 'min-h-[200px] p-8 mx-auto flex justify-center items-center',
//     content: {
//       id: uuidv4(),
//       type: 'column' as ContentType,
//       name: 'Column',
//       content: [
//         {
//           id: uuidv4(),
//           type: 'resizable-column' as ContentType,
//           name: 'Image and text',
//           className: 'border',
//           content: [
//             {
//               id: uuidv4(),
//               type: 'column' as ContentType,
//               name: 'Column',
//               content: [
//                 {
//                   id: uuidv4(),
//                   type: 'image' as ContentType,
//                   name: 'Image',
//                   className: 'p-3',
//                   content:
//                     'https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//                   alt: 'Title',
//                 },
//               ],
//             },
//             {
//               id: uuidv4(),
//               type: 'column' as ContentType,
//               name: 'Column',
//               content: [
//                 {
//                   id: uuidv4(),
//                   type: 'heading1' as ContentType,
//                   name: 'Heading1',
//                   content: '',
//                   placeholder: 'Heading1',
//                 },
//                 {
//                   id: uuidv4(),
//                   type: 'paragraph' as ContentType,
//                   name: 'Paragraph',
//                   content: '',
//                   placeholder: 'start typing here',
//                 },
//               ],
//               className: 'w-full h-full p-8 flex justify-center items-center',
//               placeholder: 'Heading1',
//             },
//           ],
//         },
//       ],
//     },
//   },
//
//   {
//     id: uuidv4(),
//     slideName: 'Text and image',
//     type: 'textAndImage',
//     className: 'min-h-[200px] p-8 mx-auto flex justify-center items-center',
//     content: {
//       id: uuidv4(),
//       type: 'column' as ContentType,
//       name: 'Column',
//       content: [
//         {
//           id: uuidv4(),
//           type: 'resizable-column' as ContentType,
//           name: 'Text and image',
//           className: 'border',
//           content: [
//             {
//               id: uuidv4(),
//               type: 'column' as ContentType,
//               name: '',
//               content: [
//                 {
//                   id: uuidv4(),
//                   type: 'heading1' as ContentType,
//                   name: 'Heading1',
//                   content: '',
//                   placeholder: 'Heading1',
//                 },
//                 {
//                   id: uuidv4(),
//                   type: 'paragraph' as ContentType,
//                   name: 'Paragraph',
//                   content: '',
//                   placeholder: 'start typing here',
//                 },
//               ],
//               className: 'w-full h-full p-8 flex justify-center items-center',
//               placeholder: 'Heading1',
//             },
//             {
//               id: uuidv4(),
//               type: 'column' as ContentType,
//               name: 'Column',
//               content: [
//                 {
//                   id: uuidv4(),
//                   type: 'image' as ContentType,
//                   name: 'Image',
//                   className: 'p-3',
//                   content:
//                     'https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//                   alt: 'Title',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   },
//
//   {
//     id: uuidv4(),
//     slideName: 'Two columns',
//     type: 'twoColumns',
//     className: 'p-4 mx-auto flex justify-center items-center',
//     content: {
//       id: uuidv4(),
//       type: 'column' as ContentType,
//       name: 'Column',
//       content: [
//         {
//           id: uuidv4(),
//           type: 'title' as ContentType,
//           name: 'Title',
//           content: '',
//           placeholder: 'Untitled Card',
//         },
//         {
//           id: uuidv4(),
//           type: 'resizable-column' as ContentType,
//           name: 'Text and image',
//           className: 'border',
//           content: [
//             {
//               id: uuidv4(),
//               type: 'paragraph' as ContentType,
//               name: 'Paragraph',
//               content: '',
//               placeholder: 'Start typing...',
//             },
//             {
//               id: uuidv4(),
//               type: 'paragraph' as ContentType,
//               name: 'Paragraph',
//               content: '',
//               placeholder: 'Start typing...',
//             },
//           ],
//         },
//       ],
//     },
//   },
//
//   {
//     id: uuidv4(),
//     slideName: 'Two columns with headings',
//     type: 'twoColumnsWithHeadings',
//     className: 'p-4 mx-auto flex justify-center items-center',
//     content: {
//       id: uuidv4(),
//       type: 'column' as ContentType,
//       name: 'Column',
//       content: [
//         {
//           id: uuidv4(),
//           type: 'title' as ContentType,
//           name: 'Title',
//           content: '',
//           placeholder: 'Untitled Card',
//         },
//         {
//           id: uuidv4(),
//           type: 'resizable-column' as ContentType,
//           name: 'Text and image',
//           className: 'border',
//           content: [
//             {
//               id: uuidv4(),
//               type: 'column' as ContentType,
//               name: 'Column',
//               content: [
//                 {
//                   id: uuidv4(),
//                   type: 'heading3' as ContentType,
//                   name: 'Heading3',
//                   content: '',
//                   placeholder: 'Heading 3',
//                 },
//                 {
//                   id: uuidv4(),
//                   type: 'paragraph' as ContentType,
//                   name: 'Paragraph',
//                   content: '',
//                   placeholder: 'Start typing...',
//                 },
//               ],
//             },
//             {
//               id: uuidv4(),
//               type: 'column' as ContentType,
//               name: 'Column',
//               content: [
//                 {
//                   id: uuidv4(),
//                   type: 'heading3' as ContentType,
//                   name: 'Heading3',
//                   content: '',
//                   placeholder: 'Heading 3',
//                 },
//                 {
//                   id: uuidv4(),
//                   type: 'paragraph' as ContentType,
//                   name: 'Paragraph',
//                   content: '',
//                   placeholder: 'Start typing...',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   },
//
//   {
//     id: uuidv4(),
//     slideName: 'Three column',
//     type: 'threeColumns',
//     className: 'p-4 mx-auto flex justify-center items-center',
//     content: {
//       id: uuidv4(),
//       type: 'column' as ContentType,
//       name: 'Column',
//       content: [
//         {
//           id: uuidv4(),
//           type: 'title' as ContentType,
//           name: 'Title',
//           content: '',
//           placeholder: 'Untitled Card',
//         },
//         {
//           id: uuidv4(),
//           type: 'resizable-column' as ContentType,
//           name: 'Text and image',
//           className: 'border',
//           content: [
//             {
//               id: uuidv4(),
//               type: 'paragraph' as ContentType,
//               name: '',
//               content: '',
//               placeholder: 'Start typing...',
//             },
//             {
//               id: uuidv4(),
//               type: 'paragraph' as ContentType,
//               name: '',
//               content: '',
//               placeholder: 'Start typing...',
//             },
//             {
//               id: uuidv4(),
//               type: 'paragraph' as ContentType,
//               name: '',
//               content: '',
//               placeholder: 'Start typing...',
//             },
//           ],
//         },
//       ],
//     },
//   },
// ]

/**
 * Generate image using configured image provider
 *
 * This function uses the centralized image provider system which supports
 * multiple providers (Cloudflare, Hugging Face, Replicate, Gemini) selected
 * via the IMAGE_GENERATION_PROVIDER environment variable.
 *
 * The prompt should be detailed and specific, including:
 * - Subject description with attributes
 * - Visual style (photography, illustration, etc.)
 * - Composition and framing details
 * - Lighting and mood specifications
 * - Professional quality markers
 *
 * @param prompt - Enhanced image generation prompt (detailed description)
 * @returns URL of the generated image, or placeholder on error
 */
const generateImageUrl = async (prompt: string): Promise<string> => {
  return await generateImage(prompt)
}

const findImageComponents = (layout: ContentItem): ContentItem[] => {
  const images = []
  if (layout.type === 'image') {
    images.push(layout)
  }
  if (Array.isArray(layout.content)) {
    layout.content.forEach((child) => {
      images.push(...findImageComponents(child as ContentItem))
    })
  } else if (layout.content && typeof layout.content === 'object') {
    images.push(...findImageComponents(layout.content))
  }
  return images
}

const replaceImagePlaceholders = async (layout: Slide) => {
  const imageComponents = findImageComponents(layout.content)
  console.log('🟢 Found image components:', imageComponents.length)

  // Process images sequentially to avoid overwhelming the API
  for (const component of imageComponents) {
    try {
      const basicDescription = component.alt || 'Placeholder Image'
      console.log('🟢 Generating image for:', basicDescription.substring(0, 50))

      // Enhance the basic alt text into a detailed, professional image generation prompt
      const enhancedPrompt = generateImagePrompt(basicDescription)
      console.log('🟢 Enhanced prompt:', enhancedPrompt.substring(0, 100) + '...')

      component.content = await generateImageUrl(enhancedPrompt)
    } catch (error) {
      console.error('🔴 Failed to generate image:', error)
      // Use placeholder on error instead of failing
      component.content = 'https://placehold.co/1024x768/e2e8f0/64748b?text=Image+Generation+Failed'
    }
  }
}

export const generateLayoutsJson = async (outlineArray: string[]) => {
  const prompt = generateLayoutPrompt(outlineArray)

  //   `
  //   You are a highly creative AI that generates JSON-based layouts for presentations. I will provide you with an array of outlines, and for each outline, you must generate a unique and creative layout. Use the existing layouts as examples for structure and design, and generate unique designs based on the provided outline.

  //   ### Guidelines:
  //   1. Write layouts based on the specific outline provided. Do not use types that are not mentioned in the example layouts.
  //   2. Use diverse and engaging designs, ensuring each layout is unique.
  //   3. Adhere to the structure of existing layouts but add new styles or components if needed.
  //   4. Fill placeholder data into content fields where required.
  //   5. Generate unique image placeholders for the 'content' property of image components and also alt text according to the outline.
  //   6. Ensure proper formatting and schema alignment for the output JSON.

  //   ### Example Layouts:
  //   ${JSON.stringify(existingLayouts, null, 2)}

  //   ### Outline Array:
  //   ${JSON.stringify(outlineArray)}

  //   For each entry in the outline array, generate:
  //   - A unique JSON layout with creative designs.
  //   - Properly filled content, including placeholders for image components.
  //   - Clear and well-structured JSON data.
  //   For Images
  //   - The alt text should describe the image clearly and concisely.
  //   - Focus on the main subject(s) of the image and any relevant details such as colors, shapes, people, or objects.
  //   - Ensure the alt text aligns with the context of the presentation slide it will be used on (e.g., professional, educational, business-related).
  //   - Avoid using terms like "image of" or "picture of," and instead focus directly on the content and meaning.

  //   Output the layouts in JSON format. Ensure there are no duplicate layouts across the array.
  // `

  try {
    console.log('🟢 Generating layouts...')

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000000); // 40 second timeout

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        {
          role: 'system',
          content: LAYOUT_SYSTEM_MESSAGE,
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 16000, // Increased to handle large presentations without truncation
      temperature: 0.2, // Reduced for more consistent, professional output
    }, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const responseContent = completion?.choices?.[0]?.message?.content

    // Log token usage for debugging
    console.log('📊 Token usage:', {
      prompt_tokens: completion?.usage?.prompt_tokens,
      completion_tokens: completion?.usage?.completion_tokens,
      total_tokens: completion?.usage?.total_tokens,
    })

    if (!responseContent) {
      console.log('🔴 ERROR: No content generated from OpenAI')
      return { status: 400, error: 'No content generated' }
    }

    console.log('📄 Raw response length:', responseContent.length)
    console.log('📄 First 200 chars:', responseContent.substring(0, 200))
    console.log('📄 Last 200 chars:', responseContent.substring(responseContent.length - 200))

    // Check if response might be truncated
    const finishReason = completion?.choices?.[0]?.finish_reason
    if (finishReason === 'length') {
      console.log('⚠️ WARNING: Response was truncated due to max_tokens limit')
      return {
        status: 400,
        error: 'AI response was truncated. Try reducing the number of slides or simplifying your content.'
      }
    }

    let jsonResponse
    try {
      // Clean up the response content more thoroughly
      let cleanedContent = responseContent.trim()

      // Remove markdown code blocks
      cleanedContent = cleanedContent.replace(/```json\s*/g, '')
      cleanedContent = cleanedContent.replace(/```\s*/g, '')

      // Remove any leading/trailing whitespace again
      cleanedContent = cleanedContent.trim()

      if (!cleanedContent) {
        console.log('🔴 ERROR: Content is empty after cleaning')
        return { status: 400, error: 'Empty content after cleaning' }
      }

      console.log('🧹 Cleaned content length:', cleanedContent.length)
      console.log('🧹 First 200 chars of cleaned:', cleanedContent.substring(0, 200))

      jsonResponse = JSON.parse(cleanedContent)

      if (!Array.isArray(jsonResponse)) {
        console.log('🔴 ERROR: Response is not an array')
        return { status: 400, error: 'Invalid JSON structure - expected an array' }
      }

      // Process slides with rate limiting (2 slides at a time) to prevent API overload
      console.log(`🟢 Processing ${jsonResponse.length} slides for image generation...`)
      await processWithRateLimit(
        jsonResponse,
        replaceImagePlaceholders,
        2 // Process 2 slides at a time
      )
    } catch (error) {
      console.log('🔴 ERROR parsing JSON:', error)
      console.log('🔴 Content that failed to parse (first 500 chars):', responseContent.substring(0, 500))
      console.log('🔴 Content that failed to parse (last 500 chars):', responseContent.substring(Math.max(0, responseContent.length - 500)))

      // Check if it's a truncation issue
      if (error instanceof SyntaxError && error.message.includes('Unterminated')) {
        return {
          status: 400,
          error: 'AI response was incomplete. Please try again with fewer slides or simpler content.'
        }
      }

      return { status: 400, error: `Invalid JSON format received from AI: ${error instanceof Error ? error.message : 'Unknown error'}` }
    }

    console.log('🟢 Layouts generated successfully')
    return { status: 200, data: jsonResponse }
  } catch (error: any) {
    console.log('🔴 ERROR in generateLayoutsJson:', error)
    if (error.name === 'AbortError') {
      return { status: 504, error: 'Request timed out. Try simplifying your presentation content.' }
    }
    return { status: 500, error: `Failed to generate layouts: ${error.message || 'Unknown error'}` }
  }
}

export const generateLayouts = async (projectId: string, theme: string) => {
  try {
    if (!projectId) {
      return { status: 400, error: 'Project ID is required' }
    }
    const user = await currentUser()
    if (!user) {
      return { status: 403, error: 'User not authenticated' }
    }

    const userExist = await client.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!userExist || !userExist.subscription) {
      return {
        status: 403,
        error: !userExist?.subscription
          ? 'User does not have an active subscription'
          : 'User not found in the database',
      }
    }

    const project = await client.project.findUnique({
      where: { id: projectId, isDeleted: false },
    })

    if (!project) {
      return { status: 404, error: 'Project not found' }
    }

    if (!project.outlines || project.outlines.length === 0) {
      return { status: 400, error: 'Project does not have any outlines' }
    }

    const layouts = await generateLayoutsJson(project.outlines)

    if (layouts.status !== 200) {
      return layouts
    }

    await client.project.update({
      where: { id: projectId },
      data: { slides: layouts.data, themeName: theme },
    })

    return { status: 200, data: layouts.data }
  } catch (error) {
    console.error('🔴 ERROR:', error)
    return { status: 500, error: 'Internal server error', data: [] }
  }
}
