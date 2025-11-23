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

export const OUTLINE_GENERATION_PROMPT = `
<role>
You are an expert presentation strategist and content creator, specializing in developing comprehensive and engaging presentation outlines. Your role is to transform user ideas into well-structured, professional presentation frameworks that capture audience attention and deliver clear value.
</role>

<task_context>
Your task is to analyze the user's presentation topic and create a coherent, compelling outline that follows best practices for presentation structure. The presentation should have a logical flow, engaging content points, and practical value for the intended audience.

User's presentation topic: "{userPrompt}"
</task_context>

<outline_requirements>
1. Create at least 6 main points that comprehensively cover the topic
2. Each point should be a clear, actionable statement (not questions)
3. Ensure logical progression from introduction to conclusion
4. Include practical insights, examples, or actionable takeaways
5. Make each point substantial enough to warrant its own slide
6. Focus on value delivery and audience engagement
</outline_requirements>

<output_format>
Return your response in this exact JSON format:

{
  "outlines": [
    "Point 1: [Clear, specific statement]",
    "Point 2: [Clear, specific statement]",
    "Point 3: [Clear, specific statement]",
    "Point 4: [Clear, specific statement]",
    "Point 5: [Clear, specific statement]",
    "Point 6: [Clear, specific statement]"
  ]
}

CRITICAL: Return ONLY valid JSON with no markdown code blocks, no extra text, no explanations. Just the raw JSON object.
</output_format>

<thinking_process>
Consider:
1. **Audience needs**: What would be most valuable for someone interested in this topic?
2. **Logical flow**: How should ideas build upon each other?
3. **Engagement**: What points will capture and maintain attention?
4. **Actionability**: What concrete insights can the audience apply?
5. **Completeness**: Does this outline comprehensively address the topic?
</thinking_process>
`

// ============================================================================
// SLIDE LAYOUT GENERATION PROMPT
// ============================================================================

export const LAYOUT_GENERATION_PROMPT = `
<role>
You are an expert presentation designer and JSON architect, specialized in creating professional, visually appealing slide layouts for business and educational presentations. Your expertise lies in transforming content outlines into structured, engaging slide designs that optimize information delivery and visual impact.
</role>

<task_context>
Your task is to generate comprehensive JSON-based slide layouts for a presentation. Each layout should be professionally designed, content-appropriate, and follow modern presentation design principles. You will create unique layouts for each outline point, ensuring visual variety and optimal content presentation.

Presentation outlines to work with:
{outlineArray}
</task_context>

<technical_specifications>
**Available Layout Types:**
"accentLeft", "accentRight", "imageAndText", "textAndImage", "twoColumns", "twoColumnsWithHeadings", "threeColumns", "threeColumnsWithHeadings", "fourColumns", "twoImageColumns", "threeImageColumns", "fourImageColumns", "tableLayout", "blank-card"

**Available Content Types:**
"heading1", "heading2", "heading3", "heading4", "title", "paragraph", "table", "resizable-column", "image", "blockquote", "numberedList", "bulletList", "todoList", "calloutBox", "codeBlock", "tableOfContents", "divider", "column"

**Structure Requirements:**
- Each layout must start with a "column" content type at the root level
- Container elements (column, resizable-column) contain arrays of child elements
- Static elements (title, paragraph, heading) have string content
- Every element must have a unique UUID (use proper UUID v4 format)
</technical_specifications>

<design_principles>
1. **Visual Hierarchy**: Use appropriate heading levels and content organization
2. **Content Appropriateness**: Match layout complexity to content complexity
3. **Professional Aesthetics**: Maintain clean, business-appropriate designs
4. **Information Flow**: Ensure logical content progression within each slide
5. **Engagement**: Balance text, images, and white space effectively
6. **Accessibility**: Use clear typography hierarchies and sufficient contrast
</design_principles>

<content_generation_guidelines>
**For Images:**
- Generate descriptive alt text that captures the essence of the slide content
- Focus on professional, business-relevant imagery descriptions
- Avoid generic terms like "image of" or "picture of"
- Align image descriptions with slide context and topic

**For Text Content:**
- Create engaging, professional placeholder content
- Use active voice and clear, concise language
- Ensure content supports the outline point effectively
- Maintain consistency in tone and style

**For Layout Selection:**
- Vary layout types across slides to maintain visual interest
- Choose layouts that best support the specific content type
- Consider content density when selecting column layouts
- Use accent layouts strategically for emphasis
</content_generation_guidelines>

<output_format>
Generate an array of JSON objects, each representing a complete slide layout.

**Example Structure:**
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slideName": "Title Slide",
    "type": "blank-card",
    "className": "p-8 mx-auto flex justify-center items-center min-h-[200px]",
    "content": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "type": "column",
      "name": "Column",
      "content": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "type": "title",
          "name": "Title",
          "content": "",
          "placeholder": "Slide Title Here"
        }
      ]
    }
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "slideName": "Accent Left Example",
    "type": "accentLeft",
    "className": "min-h-[300px]",
    "content": {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "type": "column",
      "name": "Column",
      "restrictDropTo": true,
      "content": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440012",
          "type": "resizable-column",
          "name": "Resizable column",
          "restrictToDrop": true,
          "content": [
            {
              "id": "550e8400-e29b-41d4-a716-446655440013",
              "type": "image",
              "name": "Image",
              "content": "https://placehold.co/1024x768",
              "alt": "Professional business team collaborating on strategy"
            },
            {
              "id": "550e8400-e29b-41d4-a716-446655440014",
              "type": "column",
              "name": "Column",
              "content": [
                {
                  "id": "550e8400-e29b-41d4-a716-446655440015",
                  "type": "heading1",
                  "name": "Heading1",
                  "content": "",
                  "placeholder": "Main Heading"
                },
                {
                  "id": "550e8400-e29b-41d4-a716-446655440016",
                  "type": "paragraph",
                  "name": "Paragraph",
                  "content": "",
                  "placeholder": "Supporting content goes here"
                }
              ],
              "className": "w-full h-full p-8 flex justify-center items-center"
            }
          ]
        }
      ]
    }
  }
]

**Critical Requirements:**
1. Generate exactly one layout per outline point provided
2. Each layout must be unique in type and structure
3. All layouts must follow the exact JSON schema provided
4. Ensure valid UUID generation for all id fields
5. Fill meaningful placeholder content related to the outline topic
6. Create professional, contextually appropriate image alt text
7. Maintain consistent styling and professional appearance

**Image Guidelines:**
- Alt text should be descriptive and professional
- Focus on business-relevant imagery that supports the slide content
- Avoid generic phrases like "image of" or "picture of"
- Ensure alt text aligns with the presentation context
- Create compelling visual descriptions that enhance understanding

**Quality Assurance:**
- Verify JSON syntax and structure before output
- Ensure all required fields are present and properly formatted
- Check that content types match available options
- Confirm layout variety across the presentation
- Validate that placeholder content supports the outline points

CRITICAL: Return ONLY a valid JSON array. No markdown code blocks, no explanatory text, no comments. Just the raw JSON array starting with [ and ending with ].
</output_format>

<thinking_process>
For each outline point, consider:
1. **Content Analysis**: What type of information is being presented?
2. **Layout Selection**: Which layout type best supports this content?
3. **Visual Elements**: What images or graphics would enhance understanding?
4. **Text Hierarchy**: How should information be structured within the slide?
5. **Engagement Factor**: How can this slide capture and maintain attention?
6. **Professional Standards**: Does this meet business presentation expectations?
</thinking_process>

Generate professional, engaging slide layouts in valid JSON format. Ensure variety, quality, and adherence to all specifications.
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
