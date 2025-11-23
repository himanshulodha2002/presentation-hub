/**
 * Centralized Prompt Library for Presentation Hub
 *
 * This file contains all AI prompts used throughout the application,
 * structured following best practices for prompt engineering with
 * clear roles, context, thinking processes, and output formats.
 */

import { ContentType } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

// ============================================================================
// PRESENTATION OUTLINE GENERATION PROMPT
// ============================================================================

export const OUTLINE_GENERATION_PROMPT = `You are an expert presentation strategist creating professional presentation outlines.

Create a presentation outline for: "{userPrompt}"

Requirements:
- Generate at least 6 specific, actionable outline points
- Each point should be a clear statement (not a question)
- Points should flow logically from introduction to conclusion
- Be specific and concrete, not vague or generic
- Each point should be 10-20 words
- Focus on delivering value to the audience

Examples of good points:
✅ "The five-step framework for implementing sustainable change in organizations"
✅ "Data-driven insights: How top performers measure and optimize their results"

Examples to avoid:
❌ "Introduction" (too generic)
❌ "Why is this important?" (question format)

Return ONLY valid JSON in this exact format with no markdown or extra text:

{
  "outlines": [
    "Point 1 text here",
    "Point 2 text here",
    "Point 3 text here",
    "Point 4 text here",
    "Point 5 text here",
    "Point 6 text here"
  ]
}`

// ============================================================================
// SLIDE LAYOUT GENERATION PROMPT
// ============================================================================

export const LAYOUT_GENERATION_PROMPT = `You are an expert presentation designer creating professional slide layouts in JSON format.

Generate slide layouts for these outlines:
{outlineArray}

Available layout types: accentLeft, accentRight, imageAndText, textAndImage, twoColumns, twoColumnsWithHeadings, threeColumns, threeColumnsWithHeadings, fourColumns, twoImageColumns, threeImageColumns, fourImageColumns, tableLayout, blank-card

Available content types: title, heading1, heading2, heading3, heading4, paragraph, bulletList, numberedList, table, image, divider, column, resizable-column

Requirements:
- Generate ONE layout per outline point
- Every layout MUST start with a "column" type at root
- Each element needs a unique UUID
- Vary layout types across slides
- For images: create descriptive alt text (10-20 words, specific and professional)
- Use professional placeholder text (not "Lorem ipsum")

JSON structure for each slide:

Example simple layout:
{
  "id": "unique-uuid-here",
  "slideName": "Slide Name",
  "type": "blank-card",
  "className": "p-8 mx-auto flex justify-center items-center min-h-[200px]",
  "content": {
    "id": "unique-uuid-here",
    "type": "column",
    "name": "Column",
    "content": [
      {
        "id": "unique-uuid-here",
        "type": "title",
        "name": "Title",
        "content": "",
        "placeholder": "Your title here"
      }
    ]
  }
}

CRITICAL: Return ONLY a valid JSON array with no markdown, no extra text, no code blocks. Just pure JSON.
`

// ============================================================================
// IMAGE GENERATION PROMPT
// ============================================================================

export const IMAGE_GENERATION_PROMPT_TEMPLATE = `Enhance this basic image description into a detailed, professional image generation prompt for business presentations.

Basic description: "{imageDescription}"

Create a 2-4 sentence enhanced prompt (40-80 words) that includes:
- Specific subject details and attributes
- Professional setting/environment
- Visual style (professional photography, modern illustration, etc.)
- Lighting and mood (natural lighting, clean composition, etc.)
- Professional quality markers (high quality, crisp detail, contemporary aesthetic)

Example:
Input: "Team collaboration"
Output: "Professional diverse team of four collaborating around a modern conference table with laptops and digital displays, engaged in focused discussion, contemporary office setting with floor-to-ceiling windows and natural daylight, shot from slightly elevated angle, professional corporate photography with soft natural lighting, clean minimalist aesthetic, warm and inviting atmosphere suggesting productivity and innovation"

Return only the enhanced prompt, no extra text.`

// ============================================================================
// PROMPT GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate the outline creation prompt with user's topic
 *
 * @param userPrompt - The user's presentation topic/request
 * @returns Formatted prompt string ready for LLM consumption
 */
export function generateOutlinePrompt(userPrompt: string): string {
  return OUTLINE_GENERATION_PROMPT.replace('{userPrompt}', userPrompt)
}

/**
 * Generate the layout creation prompt with outlines
 *
 * @param outlineArray - Array of outline points to create layouts for
 * @returns Formatted prompt string ready for LLM consumption
 */
export function generateLayoutPrompt(outlineArray: string[]): string {
  return LAYOUT_GENERATION_PROMPT.replace(
    '{outlineArray}',
    JSON.stringify(outlineArray, null, 2)
  )
}

/**
 * Generate enhanced image generation prompt from basic description
 *
 * This function can work in two modes:
 * 1. Enhanced mode (using LLM): Transforms basic alt text into detailed prompt via LLM
 * 2. Direct mode (default): Uses template-based enhancement for speed
 *
 * @param imageDescription - Basic image description from slide alt text
 * @returns Enhanced, detailed image generation prompt
 */
export function generateImagePrompt(imageDescription: string): string {
  // Direct enhancement mode - fast, template-based approach
  return enhanceImageDescriptionDirect(imageDescription)
}

/**
 * Get the full image enhancement prompt for LLM-based enhancement
 *
 * Use this when you want an LLM to enhance the image description
 * before passing it to the image generation model.
 *
 * @param imageDescription - Basic image description to enhance
 * @returns Formatted prompt for LLM to enhance the image description
 */
export function getImageEnhancementPrompt(imageDescription: string): string {
  return IMAGE_GENERATION_PROMPT_TEMPLATE.replace(
    '{imageDescription}',
    imageDescription
  )
}

/**
 * Direct template-based image description enhancement
 *
 * Enhances basic image descriptions using rule-based approach for speed.
 * Adds professional quality markers, composition guidance, and style specifications.
 *
 * @param description - Basic image description
 * @returns Enhanced image generation prompt
 */
function enhanceImageDescriptionDirect(description: string): string {
  if (!description || description === 'Placeholder Image') {
    return 'Professional business presentation image with clean modern aesthetic, high quality photography, soft natural lighting, minimalist composition, corporate color palette with blues and whites, contemporary office environment'
  }

  // Add professional quality markers and style guidance
  const qualityMarkers = [
    'professional photography',
    'high quality',
    'crisp detail',
    'modern aesthetic',
    'clean composition',
  ]

  const lightingOptions = [
    'soft natural lighting',
    'professional lighting',
    'ambient office lighting',
    'warm natural light',
  ]

  const styleMarkers = [
    'contemporary business style',
    'clean corporate aesthetic',
    'modern professional design',
    'enterprise-grade quality',
  ]

  // Randomly select quality enhancements (using simple hash for consistency)
  const hash = description.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const qualityMarker = qualityMarkers[hash % qualityMarkers.length]
  const lighting = lightingOptions[hash % lightingOptions.length]
  const style = styleMarkers[hash % styleMarkers.length]

  // Construct enhanced prompt
  return `${description}, ${qualityMarker}, ${lighting}, ${style}, uncluttered background, suitable for professional business presentations`
}

// ============================================================================
// SYSTEM MESSAGE CONSTANTS
// ============================================================================

/**
 * System message for outline generation
 */
export const OUTLINE_SYSTEM_MESSAGE =
  'You are an expert presentation strategist and content architect. You specialize in creating compelling, well-structured presentation outlines that engage audiences and deliver clear value. Your expertise lies in transforming ideas into coherent, professional presentation frameworks.'

/**
 * System message for layout generation
 */
export const LAYOUT_SYSTEM_MESSAGE =
  'You are an expert presentation designer specializing in creating professional, engaging slide layouts. Generate high-quality JSON layouts that follow modern design principles and maintain visual consistency. Focus on creating layouts that effectively communicate the intended message while maintaining professional standards.'

// ============================================================================
// EXAMPLE LAYOUTS FOR REFERENCE
// ============================================================================

/**
 * Example layout structures that can be used for reference or testing
 * These demonstrate the expected JSON structure for various layout types
 */
export const EXAMPLE_LAYOUTS = {
  blankCard: {
    id: uuidv4(),
    slideName: 'Blank card',
    type: 'blank-card',
    className: 'p-8 mx-auto flex justify-center items-center min-h-[200px]',
    content: {
      id: uuidv4(),
      type: 'column' as ContentType,
      name: 'Column',
      content: [
        {
          id: uuidv4(),
          type: 'title' as ContentType,
          name: 'Title',
          content: '',
          placeholder: 'Untitled Card',
        },
      ],
    },
  },

  accentLeft: {
    id: uuidv4(),
    slideName: 'Accent left',
    type: 'accentLeft',
    className: 'min-h-[300px]',
    content: {
      id: uuidv4(),
      type: 'column' as ContentType,
      name: 'Column',
      restrictDropTo: true,
      content: [
        {
          id: uuidv4(),
          type: 'resizable-column' as ContentType,
          name: 'Resizable column',
          restrictToDrop: true,
          content: [
            {
              id: uuidv4(),
              type: 'image' as ContentType,
              name: 'Image',
              content: 'https://placehold.co/1024x768',
              alt: 'Professional workspace with modern technology',
            },
            {
              id: uuidv4(),
              type: 'column' as ContentType,
              name: 'Column',
              content: [
                {
                  id: uuidv4(),
                  type: 'heading1' as ContentType,
                  name: 'Heading1',
                  content: '',
                  placeholder: 'Main Heading',
                },
                {
                  id: uuidv4(),
                  type: 'paragraph' as ContentType,
                  name: 'Paragraph',
                  content: '',
                  placeholder: 'Supporting content goes here',
                },
              ],
              className: 'w-full h-full p-8 flex justify-center items-center',
            },
          ],
        },
      ],
    },
  },

  twoColumnsWithHeadings: {
    id: uuidv4(),
    slideName: 'Two columns with headings',
    type: 'twoColumnsWithHeadings',
    className: 'p-4 mx-auto flex justify-center items-center',
    content: {
      id: uuidv4(),
      type: 'column' as ContentType,
      name: 'Column',
      content: [
        {
          id: uuidv4(),
          type: 'title' as ContentType,
          name: 'Title',
          content: '',
          placeholder: 'Slide Title',
        },
        {
          id: uuidv4(),
          type: 'resizable-column' as ContentType,
          name: 'Resizable column',
          className: 'border',
          content: [
            {
              id: uuidv4(),
              type: 'column' as ContentType,
              name: 'Column',
              content: [
                {
                  id: uuidv4(),
                  type: 'heading3' as ContentType,
                  name: 'Heading3',
                  content: '',
                  placeholder: 'Section One',
                },
                {
                  id: uuidv4(),
                  type: 'paragraph' as ContentType,
                  name: 'Paragraph',
                  content: '',
                  placeholder: 'Content for section one',
                },
              ],
            },
            {
              id: uuidv4(),
              type: 'column' as ContentType,
              name: 'Column',
              content: [
                {
                  id: uuidv4(),
                  type: 'heading3' as ContentType,
                  name: 'Heading3',
                  content: '',
                  placeholder: 'Section Two',
                },
                {
                  id: uuidv4(),
                  type: 'paragraph' as ContentType,
                  name: 'Paragraph',
                  content: '',
                  placeholder: 'Content for section two',
                },
              ],
            },
          ],
        },
      ],
    },
  },
}
