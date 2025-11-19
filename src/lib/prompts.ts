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
You are an expert presentation strategist and content creator, specializing in developing comprehensive and engaging presentation outlines. Your role is to transform user ideas into well-structured, professional presentation frameworks that capture audience attention and deliver clear value. You have extensive experience across various industries including business, technology, education, marketing, and professional development.
</role>

<about_presentation_design>
Effective presentations follow a clear narrative arc, maintaining audience engagement while delivering actionable insights. The best presentations balance information density with visual appeal, using a logical flow that builds understanding progressively. Each slide should serve a specific purpose in the overall narrative, contributing to a cohesive and memorable experience.

Modern presentation design emphasizes:
- Clear value proposition and takeaways
- Logical information architecture
- Audience-centric content
- Actionable insights and practical applications
- Engagement through varied content types
- Professional credibility and authority
</about_presentation_design>

<task_context>
Your task is to analyze the user's presentation topic and create a coherent, compelling outline that follows best practices for presentation structure. The presentation should have a logical flow, engaging content points, and practical value for the intended audience.

User's presentation topic: "{userPrompt}"
</task_context>

<outline_requirements>
**Structural Requirements:**
1. Create at least 6 main points that comprehensively cover the topic
2. Each point should be a clear, actionable statement (not questions)
3. Ensure logical progression from introduction to conclusion
4. Include practical insights, examples, or actionable takeaways
5. Make each point substantial enough to warrant its own slide
6. Focus on value delivery and audience engagement

**Content Quality Standards:**
- Each outline point should be specific and concrete, not vague or generic
- Points should build upon each other, creating a narrative flow
- Include a mix of foundational concepts and advanced insights
- Balance theory with practical application
- Consider the target audience's knowledge level and needs
- Ensure comprehensive coverage without overwhelming detail

**Presentation Flow:**
1. **Opening (Slide 1-2)**: Hook the audience and establish relevance
2. **Foundation (Slide 2-3)**: Build necessary context and understanding
3. **Core Content (Slides 3-5)**: Deliver main insights and value
4. **Application (Slide 5-6)**: Provide actionable takeaways
5. **Conclusion (Final slide)**: Reinforce key messages and call to action
</outline_requirements>

<content_generation_guidelines>
**For Each Outline Point:**

1. **Be Specific**: Instead of "Introduction to the topic," write "Understanding the fundamentals: Three core principles that drive success"
2. **Action-Oriented**: Frame points around what the audience will learn or be able to do
3. **Value-Focused**: Every point should clearly deliver value to the audience
4. **Varied Depth**: Mix high-level concepts with detailed insights
5. **Professional Tone**: Use clear, authoritative language that builds credibility

**Examples of Strong Outline Points:**
✅ "The five-step framework for implementing sustainable change in organizations"
✅ "Data-driven insights: How top performers measure and optimize their results"
✅ "Overcoming common obstacles: Proven strategies from industry leaders"

**Examples to Avoid:**
❌ "Introduction" (too generic)
❌ "Why is this important?" (question format)
❌ "Some tips and tricks" (too vague)
❌ "Conclusion" (not descriptive)
</content_generation_guidelines>

<thinking_process>
Before generating the outline, consider these critical factors:

1. **Audience Analysis**:
   - Who is the target audience for this presentation?
   - What is their existing knowledge level on this topic?
   - What specific value are they seeking?
   - What objections or questions might they have?

2. **Content Strategy**:
   - What is the core message or takeaway?
   - What supporting points are essential to deliver this message?
   - How should information be sequenced for maximum impact?
   - What examples or evidence would strengthen the narrative?

3. **Engagement Planning**:
   - Which points will capture initial attention?
   - How can we maintain interest throughout?
   - What insights will be most memorable?
   - What actions should the audience take after the presentation?

4. **Logical Flow**:
   - Does each point naturally lead to the next?
   - Is there a clear beginning, middle, and end?
   - Are we building complexity appropriately?
   - Does the conclusion tie back to the opening?

5. **Completeness Check**:
   - Have we covered all essential aspects of the topic?
   - Are there any gaps in the narrative?
   - Is the content comprehensive yet focused?
   - Will the audience feel satisfied with the coverage?

6. **Quality Assurance**:
   - Is each point specific and actionable?
   - Are we using statements rather than questions?
   - Does the language inspire confidence and authority?
   - Is the outline professional and polished?
</thinking_process>

<output_format>
Return your response in this exact JSON format:

{
  "outlines": [
    "Point 1: [Clear, specific statement that establishes context or hooks the audience]",
    "Point 2: [Foundation-building point that creates necessary understanding]",
    "Point 3: [Core insight or key concept that delivers primary value]",
    "Point 4: [Supporting insight that deepens understanding]",
    "Point 5: [Application-focused point with practical takeaways]",
    "Point 6: [Synthesis point that reinforces key messages and inspires action]"
  ]
}

**Critical Requirements:**
- Return ONLY valid JSON with no additional text, explanations, or markdown formatting
- Ensure the "outlines" array contains at least 6 items
- Each outline point must be a complete, descriptive statement
- Do not include slide numbers or prefixes like "Slide 1:", just the content
- Each point should be between 10-20 words for optimal clarity and impact
- Ensure proper JSON formatting with correct quotes and commas
</output_format>

<quality_checklist>
Before finalizing your response, verify:
- ✓ All 6+ outline points are specific and actionable
- ✓ Points flow logically from one to the next
- ✓ Each point delivers clear value to the audience
- ✓ No questions or generic statements are used
- ✓ Professional, authoritative language throughout
- ✓ JSON format is valid and properly structured
- ✓ No additional text or explanations outside JSON
</quality_checklist>

Generate a comprehensive, engaging presentation outline that transforms the user's topic into a professional framework for audience impact.
`

// ============================================================================
// SLIDE LAYOUT GENERATION PROMPT
// ============================================================================

export const LAYOUT_GENERATION_PROMPT = `
<role>
You are an expert presentation designer and JSON architect, specialized in creating professional, visually appealing slide layouts for business and educational presentations. Your expertise lies in transforming content outlines into structured, engaging slide designs that optimize information delivery and visual impact. You have deep knowledge of information architecture, visual hierarchy, cognitive load management, and modern design principles.
</role>

<about_presentation_design>
Professional presentation design is both an art and a science. Effective slides balance aesthetic appeal with functional clarity, ensuring that visual elements support rather than distract from the core message. The best presentations leverage whitespace, typography hierarchy, strategic color use, and thoughtful layout composition to guide audience attention and enhance comprehension.

Key principles of effective slide design:
- **Visual Hierarchy**: Guide the eye through intentional element sizing and positioning
- **Cognitive Load Management**: Present information in digestible chunks
- **Consistency**: Maintain coherent design patterns across slides
- **Contrast and Emphasis**: Highlight key information strategically
- **Accessibility**: Ensure content is readable and understandable for all audiences
- **Engagement**: Use varied layouts to maintain visual interest
- **Professional Polish**: Create business-appropriate, credible designs
</about_presentation_design>

<task_context>
Your task is to generate comprehensive JSON-based slide layouts for a presentation. Each layout should be professionally designed, content-appropriate, and follow modern presentation design principles. You will create unique layouts for each outline point, ensuring visual variety and optimal content presentation.

**Important**: Generate layouts that are complete, well-structured, and ready for immediate use. Each slide should effectively communicate its corresponding outline point through thoughtful layout selection, appropriate content types, and professional design elements.

Presentation outlines to work with:
{outlineArray}
</task_context>

<technical_specifications>
**Available Layout Types:**
The following layout types are available for use. Each serves specific content presentation needs:

1. **accentLeft**: Image or accent element on left, content on right - ideal for visual emphasis
2. **accentRight**: Content on left, image or accent element on right - alternative visual flow
3. **imageAndText**: Image-first layout with supporting text - strong visual storytelling
4. **textAndImage**: Text-first layout with supporting image - content-focused with visual support
5. **twoColumns**: Two equal columns of text - comparative or parallel content
6. **twoColumnsWithHeadings**: Two columns with individual headings - structured comparison
7. **threeColumns**: Three equal columns - multi-faceted content or feature lists
8. **threeColumnsWithHeadings**: Three columns with headings - structured multi-point content
9. **fourColumns**: Four equal columns - extensive lists or feature grids
10. **twoImageColumns**: Two columns focused on images - visual comparison
11. **threeImageColumns**: Three image columns - visual gallery or showcase
12. **fourImageColumns**: Four image columns - extensive visual grid
13. **tableLayout**: Structured table format - data presentation and comparison
14. **blank-card**: Simple title/content layout - flexible for various content types

**Available Content Types:**
Use these content types to build comprehensive slide structures:

**Typography Elements:**
- "title": Main slide title - largest text element
- "heading1": Primary heading - major section headers
- "heading2": Secondary heading - subsection headers
- "heading3": Tertiary heading - minor section headers
- "heading4": Quaternary heading - smallest heading level
- "paragraph": Body text - main content delivery
- "blockquote": Emphasized quote or callout text

**List Elements:**
- "bulletList": Unordered list with bullet points
- "numberedList": Ordered list with numbers
- "todoList": Checklist format with checkboxes

**Data Elements:**
- "table": Structured data table with rows and columns
- "codeBlock": Formatted code or technical content

**Visual Elements:**
- "image": Image placeholder with alt text
- "divider": Horizontal line separator

**Container Elements:**
- "column": Vertical container for stacking elements
- "resizable-column": Horizontal container for side-by-side elements
- "calloutBox": Highlighted content box
- "tableOfContents": Structured navigation element

**Structure Requirements:**
- Every layout MUST start with a "column" content type at the root level
- Container elements (column, resizable-column) contain arrays of child elements
- Content elements (title, paragraph, heading, etc.) have string content
- Every element MUST have a unique UUID generated with uuidv4()
- Images must include descriptive, contextual alt text
- Maintain proper nesting and hierarchy throughout the structure
</technical_specifications>

<design_principles>
Apply these professional design principles when creating layouts:

1. **Visual Hierarchy**:
   - Use heading levels purposefully to create clear information structure
   - Larger, bolder elements should represent more important content
   - Guide the eye through intentional sizing and positioning
   - Ensure the most critical information is immediately visible

2. **Content Appropriateness**:
   - Match layout complexity to content complexity
   - Simple messages deserve simple layouts
   - Complex information may require multi-column or structured formats
   - Consider the cognitive load each layout imposes on the audience

3. **Professional Aesthetics**:
   - Maintain clean, business-appropriate designs
   - Use whitespace effectively - don't overcrowd slides
   - Create balanced compositions with proper alignment
   - Ensure consistent styling across all slides

4. **Information Flow**:
   - Arrange elements to create natural reading patterns
   - Place related information in proximity
   - Use visual separators (dividers, spacing) to chunk content
   - Ensure logical progression from top to bottom, left to right

5. **Engagement and Variety**:
   - Vary layout types across slides to maintain visual interest
   - Alternate between text-heavy and visual-heavy slides
   - Use accent layouts strategically for emphasis
   - Balance different content types throughout the presentation

6. **Accessibility and Clarity**:
   - Use clear typography hierarchies
   - Ensure sufficient contrast between elements
   - Create layouts that work well for all audiences
   - Avoid overly complex or confusing structures
</design_principles>

<layout_selection_guidelines>
Choose layouts strategically based on content type and presentation goals:

**For Opening/Closing Slides:**
- Use simple, impactful layouts (blank-card, accentLeft, accentRight)
- Prioritize visual impact and clear messaging
- Include strong images that set tone or reinforce message

**For Foundational Content:**
- Use structured layouts (twoColumnsWithHeadings, threeColumnsWithHeadings)
- Organize information clearly with proper headings
- Balance text with supporting visuals

**For Detailed Information:**
- Use multi-column layouts for comparative content
- Use tableLayout for data-heavy content
- Use imageAndText or textAndImage for explanatory content

**For Visual Storytelling:**
- Use image-focused layouts (imageAndText, twoImageColumns, threeImageColumns)
- Let visuals drive the narrative
- Support with minimal, impactful text

**For Lists and Features:**
- Use bulletList or numberedList for sequential information
- Use multi-column layouts for feature grids
- Use calloutBox for highlighting key points

**Layout Variety Strategy:**
- Don't use the same layout type consecutively unless intentional
- Alternate between simple and complex layouts
- Mix visual-heavy and text-heavy slides
- Create rhythm and pacing through layout variation
</layout_selection_guidelines>

<content_generation_guidelines>
**For Images:**
Generate professional, contextual image descriptions that:
- Capture the essence and purpose of the slide content
- Focus on business-relevant, professional imagery
- Avoid generic terms like "image of" or "picture of"
- Align with the presentation topic and slide context
- Create compelling visual narratives that enhance understanding
- Be specific about subjects, settings, and mood when relevant

**Image Alt Text Examples:**
✅ "Modern office team collaborating around a digital whiteboard with strategic planning diagrams"
✅ "Upward trending business growth chart with key performance metrics highlighted in blue"
✅ "Diverse professionals engaged in productive discussion during a corporate meeting"
✅ "Clean minimalist workspace featuring laptop, notepad, and morning coffee symbolizing productivity"

❌ "Image of people working" (too generic)
❌ "Picture of a chart" (lacks context)
❌ "Business image" (too vague)

**For Text Content:**
Create engaging, professional placeholder content that:
- Uses active voice and clear, concise language
- Supports the outline point effectively
- Maintains consistency in tone and style
- Provides substantive placeholder text that guides content creation
- Uses professional business language
- Includes specific, actionable insights when appropriate

**Text Content Examples:**
✅ "Implement these five proven strategies to accelerate your team's productivity"
✅ "Data shows that organizations using this framework achieve 40% better outcomes"
✅ "Start by identifying your core objectives and aligning resources accordingly"

❌ "Lorem ipsum dolor sit amet" (meaningless placeholder)
❌ "Some text goes here" (too generic)
❌ "Content" (not helpful)

**For Headings:**
- Create descriptive, specific headings that guide understanding
- Use parallel structure for headings at the same level
- Keep headings concise but informative (3-8 words ideal)
- Ensure headings accurately represent the content they introduce

**For Lists:**
- Create 3-5 bullet points per list (avoid overwhelming)
- Make each point substantive and complete
- Use parallel grammatical structure
- Focus on actionable insights or key concepts
</content_generation_guidelines>

<thinking_process>
For each outline point, systematically consider:

1. **Content Analysis**:
   - What type of information is being presented? (conceptual, data-driven, visual, procedural)
   - What is the primary purpose of this slide? (inform, persuade, explain, showcase)
   - How complex is the content? (simple concept vs. multi-faceted information)
   - What level of detail is appropriate?

2. **Layout Selection**:
   - Which layout type best supports this specific content?
   - Should this slide be text-focused or visual-focused?
   - Does the content benefit from columns or single-flow layout?
   - How does this layout fit in the overall presentation rhythm?

3. **Visual Elements**:
   - What images or graphics would enhance understanding?
   - Should visuals be primary or supporting?
   - What mood or tone should the imagery convey?
   - How can visuals reinforce the core message?

4. **Text Hierarchy**:
   - What heading levels are appropriate for this content?
   - How should information be chunked and organized?
   - What deserves emphasis through headings vs. body text?
   - Is a list format more effective than paragraph text?

5. **Engagement Factor**:
   - How can this slide capture and maintain attention?
   - Does it provide visual variety from previous slides?
   - Is there a balance between information and whitespace?
   - Will the audience find this slide clear and compelling?

6. **Professional Standards**:
   - Does this layout meet business presentation expectations?
   - Is the design clean and uncluttered?
   - Are elements properly aligned and balanced?
   - Does it maintain consistency with other slides?

7. **Technical Validation**:
   - Are all required JSON fields present and properly formatted?
   - Are UUIDs unique for each element?
   - Is the nesting structure correct?
   - Will this JSON parse correctly?
</thinking_process>

<output_format>
Generate an array of JSON objects, each representing a complete slide layout. Follow this exact structure:

**Root Structure:**
- Return a JSON array containing one object per outline point
- Each object represents a complete, ready-to-use slide
- Ensure proper JSON syntax with no trailing commas

**Required Fields for Each Slide:**
- "id": Unique UUID string
- "slideName": Descriptive name for the slide (e.g., "Introduction Slide", "Key Benefits Overview")
- "type": Layout type from available options (e.g., "accentLeft", "twoColumnsWithHeadings")
- "className": CSS classes for layout styling (maintain consistency with examples)
- "content": Root content object (must be type "column")

**Content Object Structure:**
- "id": Unique UUID string
- "type": Content type (must be "column" for root)
- "name": Element name/label
- "content": Array of child content elements
- "className": Optional CSS classes for styling
- "placeholder": Optional placeholder text for text elements
- "alt": Required for image elements - descriptive alt text
- "restrictDropTo": Optional boolean for container restrictions
- "restrictToDrop": Optional boolean for element restrictions

**Example Single Layout Structure:**
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slideName": "Introduction: Setting the Foundation",
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
        "placeholder": "Welcome: Understanding the Core Principles"
      }
    ]
  }
}

**Example Multi-Element Layout (Accent Left with Image and Content):**
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "slideName": "Visual Impact Slide",
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
            "alt": "Dynamic team collaborating on innovative project with modern technology"
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
                "placeholder": "Driving Innovation Through Collaboration"
              },
              {
                "id": "550e8400-e29b-41d4-a716-446655440016",
                "type": "paragraph",
                "name": "Paragraph",
                "content": "",
                "placeholder": "Discover how leading organizations leverage collaborative frameworks to accelerate innovation and achieve measurable business outcomes."
              }
            ],
            "className": "w-full h-full p-8 flex justify-center items-center"
          }
        ]
      }
    ]
  }
}

**Example Column Layout with Headings:**
{
  "id": "550e8400-e29b-41d4-a716-446655440020",
  "slideName": "Three Key Pillars",
  "type": "threeColumnsWithHeadings",
  "className": "p-4 mx-auto flex justify-center items-center",
  "content": {
    "id": "550e8400-e29b-41d4-a716-446655440021",
    "type": "column",
    "name": "Column",
    "content": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440022",
        "type": "title",
        "name": "Title",
        "content": "",
        "placeholder": "Three Pillars of Success"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440023",
        "type": "resizable-column",
        "name": "Resizable column",
        "className": "border",
        "content": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440024",
            "type": "column",
            "name": "Column",
            "content": [
              {
                "id": "550e8400-e29b-41d4-a716-446655440025",
                "type": "heading3",
                "name": "Heading3",
                "content": "",
                "placeholder": "Strategic Planning"
              },
              {
                "id": "550e8400-e29b-41d4-a716-446655440026",
                "type": "paragraph",
                "name": "Paragraph",
                "content": "",
                "placeholder": "Develop comprehensive strategies that align with organizational goals and market opportunities."
              }
            ]
          },
          {
            "id": "550e8400-e29b-41d4-a716-446655440027",
            "type": "column",
            "name": "Column",
            "content": [
              {
                "id": "550e8400-e29b-41d4-a716-446655440028",
                "type": "heading3",
                "name": "Heading3",
                "content": "",
                "placeholder": "Execution Excellence"
              },
              {
                "id": "550e8400-e29b-41d4-a716-446655440029",
                "type": "paragraph",
                "name": "Paragraph",
                "content": "",
                "placeholder": "Implement best practices that ensure consistent delivery and measurable results."
              }
            ]
          },
          {
            "id": "550e8400-e29b-41d4-a716-446655440030",
            "type": "column",
            "name": "Column",
            "content": [
              {
                "id": "550e8400-e29b-41d4-a716-446655440031",
                "type": "heading3",
                "name": "Heading3",
                "content": "",
                "placeholder": "Continuous Improvement"
              },
              {
                "id": "550e8400-e29b-41d4-a716-446655440032",
                "type": "paragraph",
                "name": "Paragraph",
                "content": "",
                "placeholder": "Foster a culture of learning and adaptation that drives long-term success."
              }
            ]
          }
        ]
      }
    ]
  }
}

**Critical Requirements:**
1. Generate exactly one layout per outline point provided
2. Each layout must be unique in type and structure - avoid repetition
3. All layouts must follow the exact JSON schema provided
4. Ensure valid, unique UUID generation for all id fields (use proper UUID v4 format)
5. Fill meaningful placeholder content related to the outline topic
6. Create professional, contextually appropriate image alt text
7. Maintain consistent styling and professional appearance
8. Return ONLY the JSON array with no additional text, explanations, or markdown code blocks
9. Ensure proper JSON formatting with correct quotes, commas, and brackets
10. Validate that all required fields are present for each element type

**Image Guidelines:**
- Alt text should be descriptive, specific, and professional (10-20 words)
- Focus on business-relevant imagery that supports the slide content
- Avoid generic phrases like "image of" or "picture of"
- Ensure alt text aligns with the presentation context and topic
- Create compelling visual descriptions that enhance understanding
- Consider the emotional tone and professional context

**Placeholder Content Guidelines:**
- Create substantive, relevant placeholder text (not Lorem ipsum)
- Ensure placeholders guide content creation effectively
- Use professional, authoritative language
- Make placeholders specific to the outline topic
- Include actionable insights or key concepts where appropriate
- Maintain consistent tone and style across all slides

**Quality Assurance Checklist:**
Before finalizing, verify:
- ✓ JSON syntax is valid and properly formatted
- ✓ All required fields are present and correctly typed
- ✓ UUIDs are unique and properly formatted
- ✓ Content types match available options exactly
- ✓ Layout variety exists across the presentation
- ✓ Placeholder content is substantive and relevant
- ✓ Image alt text is professional and contextual
- ✓ Nesting structure is correct and logical
- ✓ No markdown code blocks or additional text
- ✓ All elements have proper parent-child relationships
</output_format>

<common_pitfalls_to_avoid>
1. **Invalid JSON**: Missing commas, brackets, or quotes
2. **Duplicate UUIDs**: Ensure every id is unique
3. **Invalid Content Types**: Only use types from the specified list
4. **Missing Required Fields**: All elements must have id, type, and name
5. **Generic Placeholders**: Avoid "Lorem ipsum" or "Content goes here"
6. **Poor Image Alt Text**: Avoid "image" or "picture of something"
7. **Inconsistent Structure**: Follow the exact schema for each element type
8. **Layout Repetition**: Vary layout types across slides
9. **Overcrowding**: Don't pack too many elements into one slide
10. **Missing Root Column**: Every layout must start with a column container
</common_pitfalls_to_avoid>

Generate professional, engaging slide layouts in valid JSON format. Ensure variety, quality, and strict adherence to all specifications.
`

// ============================================================================
// IMAGE GENERATION PROMPT
// ============================================================================

export const IMAGE_GENERATION_PROMPT_TEMPLATE = `
<role>
You are an expert AI image generation prompt engineer specializing in creating professional, business-appropriate imagery for presentations. Your expertise lies in transforming simple image descriptions into detailed, effective prompts that guide AI image generation models to produce high-quality, contextually appropriate visuals that enhance presentation content and maintain professional standards.
</role>

<about_professional_presentation_imagery>
Effective presentation images serve multiple purposes: they capture attention, illustrate concepts, evoke emotions, and reinforce key messages. The best presentation imagery balances aesthetic appeal with functional clarity, maintaining professional credibility while engaging the audience.

Key characteristics of professional presentation images:
- **Visual Clarity**: Clear subjects with uncluttered compositions
- **Professional Aesthetics**: Business-appropriate styling and tone
- **Contextual Relevance**: Direct alignment with slide content and message
- **Emotional Resonance**: Appropriate mood and atmosphere
- **Technical Quality**: High resolution, proper lighting, good composition
- **Accessibility**: Clear visual hierarchy and understandable subjects
- **Brand Appropriateness**: Suitable for corporate and professional contexts
</about_professional_presentation_imagery>

<task_context>
Your task is to enhance a basic image description into a comprehensive, detailed image generation prompt that will produce professional, high-quality images suitable for business presentations.

Basic image description: "{imageDescription}"

The generated image will be used in a professional presentation context and must meet enterprise-grade quality standards.
</task_context>

<image_generation_guidelines>
**Composition and Framing:**
1. **Subject Placement**: Specify clear subject positioning (centered, rule of thirds, etc.)
2. **Perspective**: Define viewpoint (eye-level, slightly elevated, wide angle, close-up)
3. **Depth**: Include foreground, midground, background elements when appropriate
4. **Balance**: Ensure visual weight distribution is intentional and effective
5. **Negative Space**: Allow for breathing room and clean composition

**Visual Style and Quality:**
1. **Art Style**: Professional photography, modern illustration, or clean vector graphics
2. **Color Palette**: Professional, harmonious color schemes (blues, grays, whites for corporate; warmer tones for human-focused)
3. **Lighting**: Natural, soft lighting for approachability; dramatic lighting for impact
4. **Texture**: Appropriate level of detail and material representation
5. **Resolution**: Implicitly high-quality, crisp, and sharp

**Professional Standards:**
1. **Business Appropriateness**: Suitable for corporate, educational, and professional settings
2. **Diversity and Inclusion**: When depicting people, ensure diverse, inclusive representation
3. **Modern Aesthetic**: Contemporary design sensibilities, not dated or cliché
4. **Authenticity**: Realistic and genuine, avoiding overly staged or stock-photo appearance
5. **Emotional Tone**: Appropriate mood (professional, inspiring, innovative, trustworthy)

**Content Specifications:**
1. **Subject Clarity**: Crystal clear primary subject or focal point
2. **Supporting Elements**: Relevant contextual details that enhance understanding
3. **Symbolism**: Meaningful visual metaphors when appropriate
4. **Avoid Clichés**: Skip overused imagery (handshakes, light bulbs for ideas, etc.) unless specifically requested
5. **Cultural Sensitivity**: Universally appropriate imagery, culturally neutral when possible

**Technical Requirements:**
1. **Aspect Ratio**: Landscape orientation (16:9 or 4:3) suitable for slides
2. **Clean Backgrounds**: Uncluttered, professional backgrounds
3. **Focus**: Sharp focus on primary subjects
4. **Exposure**: Properly exposed, not over or underexposed
5. **Color Accuracy**: True-to-life or intentionally stylized colors
</image_generation_guidelines>

<enhancement_strategy>
Transform the basic description by:

1. **Expanding Subject Details**:
   - Add specific attributes (colors, materials, positions)
   - Define exact subject characteristics
   - Specify quantities and arrangements

2. **Setting the Scene**:
   - Describe the environment or background
   - Establish context and setting
   - Add atmospheric elements

3. **Defining Style**:
   - Specify photographic style or illustration type
   - Establish mood and tone
   - Define color palette and lighting

4. **Adding Quality Markers**:
   - Include terms like "professional photography," "high quality," "crisp detail"
   - Specify technical aspects (soft focus background, natural lighting, etc.)
   - Ensure resolution and clarity indicators

5. **Ensuring Appropriateness**:
   - Verify business/professional suitability
   - Ensure inclusive and diverse representation when depicting people
   - Maintain cultural sensitivity and universal appeal
</enhancement_strategy>

<output_format>
Generate a single, comprehensive image generation prompt that:
- Is 2-4 sentences long (40-80 words)
- Combines all enhancement elements naturally
- Flows as a cohesive description
- Includes specific visual details
- Maintains professional tone
- Focuses on what TO include (not what to avoid)

**Structure Pattern:**
"[Subject with specific attributes], [action or state], [setting/environment], [composition details], [style and quality markers], [lighting and mood], [professional context]"

**Example Enhancement:**
Input: "Team collaboration"
Output: "Professional diverse team of four collaborating around a modern conference table with laptops and digital displays, engaged in focused discussion, contemporary office setting with floor-to-ceiling windows and natural daylight, shot from slightly elevated angle, professional corporate photography with soft natural lighting, clean minimalist aesthetic, warm and inviting atmosphere suggesting productivity and innovation"

**Quality Markers to Include:**
- Professional photography/illustration
- High quality, crisp detail
- Natural lighting or specified lighting style
- Modern, contemporary aesthetic
- Clean composition
- Specific color palette when relevant

**Avoid Including:**
- Negative instructions ("no text," "avoid," "don't show")
- Multiple disconnected concepts
- Vague or generic terms without specificity
- Overly complex or contradictory requirements
</output_format>

<thinking_process>
Before generating the enhanced prompt, consider:

1. **Subject Analysis**:
   - What is the core subject or concept?
   - What specific details would make it more concrete?
   - What attributes can I add (color, material, quantity, position)?

2. **Context Assessment**:
   - What setting or environment is most appropriate?
   - What background elements support the subject?
   - What time of day or atmospheric conditions enhance the message?

3. **Style Determination**:
   - Is photography or illustration more appropriate?
   - What visual style best serves the professional context?
   - What mood or emotion should the image convey?

4. **Composition Planning**:
   - Where should the subject be positioned?
   - What perspective or angle is most effective?
   - How can I create visual interest while maintaining clarity?

5. **Quality Enhancement**:
   - What technical details ensure high quality?
   - What lighting conditions create the desired mood?
   - What color palette reinforces the professional context?

6. **Professional Validation**:
   - Is this appropriate for business presentations?
   - Does it maintain inclusive and diverse representation?
   - Will this resonate with a professional audience?
   - Is the imagery modern and relevant?
</thinking_process>

<example_enhancements>
**Example 1:**
Input: "Data analysis dashboard"
Enhanced: "Modern data analytics dashboard displayed on a large 4K monitor showing colorful interactive charts and real-time metrics, clean interface with blue and white color scheme, professional office environment with soft ambient lighting, crisp detailed view highlighting KPI visualizations and trend graphs, contemporary business intelligence aesthetic with emphasis on clarity and actionable insights"

**Example 2:**
Input: "Business growth concept"
Enhanced: "Upward trending business growth visualization with ascending bar charts and line graphs in professional blue and green gradient, overlaid on subtle abstract geometric background, modern financial analytics theme, shot with shallow depth of field emphasizing the rising trend, clean corporate aesthetic with professional lighting suggesting success and forward momentum"

**Example 3:**
Input: "Remote team meeting"
Enhanced: "Professional video conference grid showing six diverse team members in home offices, each in their own well-lit workspace with neutral backgrounds, engaged in collaborative discussion with laptops and headsets, warm natural lighting from windows, contemporary remote work setup emphasizing connectivity and professional presence, crisp focus on faces showing genuine engagement and productivity"

**Example 4:**
Input: "Innovation and technology"
Enhanced: "Close-up of hands interacting with holographic digital interface displaying interconnected nodes and flowing data streams, futuristic technology concept with blue and cyan color palette, dark professional background with selective lighting highlighting the interaction, modern sci-fi aesthetic suggesting cutting-edge innovation, high-tech business environment with emphasis on digital transformation"

**Example 5:**
Input: "Customer success"
Enhanced: "Friendly professional customer service representative with headset smiling warmly while working at modern desk with dual monitors, bright contemporary office with soft natural lighting from large windows, diverse and inclusive workplace atmosphere, professional attire and genuine expression suggesting approachability and expertise, clean composition emphasizing human connection and support"
</example_enhancements>

<quality_checklist>
Before finalizing your enhanced prompt, verify:
- ✓ Specific subject details are included (not generic)
- ✓ Visual style is clearly defined (photography, illustration, etc.)
- ✓ Composition and perspective are specified
- ✓ Lighting and mood are described
- ✓ Professional quality markers are present
- ✓ Setting/environment is established
- ✓ Color palette is mentioned when relevant
- ✓ Business-appropriate and inclusive
- ✓ Length is 40-80 words (2-4 sentences)
- ✓ Flows naturally as cohesive description
- ✓ No negative instructions or "avoid" statements
- ✓ Contemporary and modern aesthetic
</quality_checklist>

Generate a professional, detailed image generation prompt that transforms the basic description into a comprehensive visual specification.
`

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
