'use server'

import { client } from '@/lib/prisma'
import { ContentItem, ContentType, Slide } from '@/lib/types'
import { currentUser } from '@clerk/nextjs/server'
import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'

import {
  GoogleGenAI,
} from '@google/genai'
// import { mkdir, writeFile } from 'fs'
import { put } from '@vercel/blob'
import mime from 'mime'

// saveBinaryFile is no longer needed; using Vercel Blob instead

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://models.inference.ai.azure.com",
})

export const generateCreativePrompt = async (userPrompt: string) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://models.inference.ai.azure.com",
  })

  const finalPrompt = `
<role>
You are an expert presentation strategist and content creator, specializing in developing comprehensive and engaging presentation outlines. Your role is to transform user ideas into well-structured, professional presentation frameworks that capture audience attention and deliver clear value.
</role>

<task_context>
Your task is to analyze the user's presentation topic and create a coherent, compelling outline that follows best practices for presentation structure. The presentation should have a logical flow, engaging content points, and practical value for the intended audience.

User's presentation topic: "${userPrompt}"
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

Ensure the JSON is valid and contains no additional text or explanations.
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

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert presentation strategist and content architect. You specialize in creating compelling, well-structured presentation outlines that engage audiences and deliver clear value. Your expertise lies in transforming ideas into coherent, professional presentation frameworks.',
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

const generateImageUrl = async (prompt: string): Promise<string> => {
  // Gemini Flash 2.0 streaming image generation (user-provided code)
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || 'AIzaSyDea5raRIMEipE3AS7IQ0VjCpmNZq_u6Bc',
    });
    const config = {
      responseModalities: [
        'IMAGE',
        'TEXT',
      ],
    };
    const model = 'gemini-2.0-flash-preview-image-generation';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    let fileIndex = 0;
    let imageFileName = '';
    for await (const chunk of response) {
      if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
        continue;
      }
      if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        const fileName = `generated_image_${Date.now()}_${fileIndex++}`;
        const inlineData = chunk.candidates[0].content.parts[0].inlineData;
        const fileExtension = mime.getExtension(inlineData.mimeType || '');
        const buffer = Buffer.from(inlineData.data || '', 'base64');
        const blobPath = `images/${fileName}.${fileExtension}`;
        try {
          const { url } = await put(blobPath, buffer, { access: 'public' });
          imageFileName = url;
        } catch (err) {
          console.error('Failed to upload image to Vercel Blob:', err);
        }
        // Only return the first image for now
        break;
      }
      // Optionally handle text description here if needed
    }
    if (imageFileName) {
      return imageFileName;
    }
    return 'https://via.placeholder.com/1024';
  } catch (error) {
    console.error('Failed to generate image:', error);
    return 'https://via.placeholder.com/1024';
  }
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
  console.log('🟢 Found image components:', imageComponents)
  for (const component of imageComponents) {
    console.log('🟢 Generating image for component:', component.alt)
    component.content = await generateImageUrl(
      component.alt || 'Placeholder Image'
    )
  }
}

export const generateLayoutsJson = async (outlineArray: string[]) => {
  const prompt = `
<role>
You are an expert presentation designer and JSON architect, specialized in creating professional, visually appealing slide layouts for business and educational presentations. Your expertise lies in transforming content outlines into structured, engaging slide designs that optimize information delivery and visual impact.
</role>

<task_context>
Your task is to generate comprehensive JSON-based slide layouts for a presentation. Each layout should be professionally designed, content-appropriate, and follow modern presentation design principles. You will create unique layouts for each outline point, ensuring visual variety and optimal content presentation.

Presentation outlines to work with:
${JSON.stringify(outlineArray)}
</task_context>

<technical_specifications>
**Available Layout Types:**
"accentLeft", "accentRight", "imageAndText", "textAndImage", "twoColumns", "twoColumnsWithHeadings", "threeColumns", "threeColumnsWithHeadings", "fourColumns", "twoImageColumns", "threeImageColumns", "fourImageColumns", "tableLayout"

**Available Content Types:**
"heading1", "heading2", "heading3", "heading4", "title", "paragraph", "table", "resizable-column", "image", "blockquote", "numberedList", "bulletList", "todoList", "calloutBox", "codeBlock", "tableOfContents", "divider", "column"

**Structure Requirements:**
- Each layout must start with a "column" content type at the root level
- Container elements (column, resizable-column) contain arrays of child elements
- Static elements (title, paragraph, heading) have string content
- Every element must have a unique UUID generated with uuidv4()
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
Generate an array of JSON objects, each representing a complete slide layout. Follow this exact structure:
**Example Single Layout Structure:**
${JSON.stringify([
  {
    slideName: 'Title Slide',
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
          placeholder: 'Slide Title Here',
        },
      ],
    },
  },
], null, 2)}

**Complete Example Output for Multiple Slides:** 
${JSON.stringify([
  {
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

  {
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
              content:
                'https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              alt: 'Title',
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
                  placeholder: 'Heading1',
                },
                {
                  id: uuidv4(),
                  type: 'paragraph' as ContentType,
                  name: 'Paragraph',
                  content: '',
                  placeholder: 'start typing here',
                },
              ],
              className: 'w-full h-full p-8 flex justify-center items-center',
              placeholder: 'Heading1',
            },
          ],
        },
      ],
    },
  },
])}

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
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert presentation designer specializing in creating professional, engaging slide layouts. Generate high-quality JSON layouts that follow modern design principles and maintain visual consistency. Focus on creating layouts that effectively communicate the intended message while maintaining professional standards.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 4000, // Increased for more detailed layouts
      temperature: 0.2, // Reduced for more consistent, professional output
    }, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    const responseContent = completion?.choices?.[0]?.message?.content

    if (!responseContent) {
      return { status: 400, error: 'No content generated' }
    }

    let jsonResponse
    try {
      jsonResponse = JSON.parse(responseContent.replace(/```json|```/g, ''))
      await Promise.all(jsonResponse.map(replaceImagePlaceholders))
    } catch (error) {
      console.log('🔴 ERROR:', error)
      throw new Error('Invalid JSON format received from AI')
    }

    console.log('🟢 Layouts generated successfully')
    return { status: 200, data: jsonResponse }
  } catch (error: any) {
    console.log('🔴 ERROR:', error)
    if (error.name === 'AbortError') {
      return { status: 504, error: 'Request timed out. Try simplifying your presentation content.' }
    }
    throw new Error('Invalid JSON format received from AI')
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