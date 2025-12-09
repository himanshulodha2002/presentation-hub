# AI Provider Setup Guide

This guide explains how to configure and use different AI providers for presentation generation in Presentation Hub.

## 📋 Table of Contents

- [Overview](#overview)
- [Supported Providers](#supported-providers)
- [Setup Instructions](#setup-instructions)
  - [OpenAI Setup](#openai-setup)
  - [Google Gemini Setup](#google-gemini-setup)
- [Switching Between Providers](#switching-between-providers)
- [Model Comparison](#model-comparison)
- [Troubleshooting](#troubleshooting)

## Overview

Presentation Hub supports multiple AI providers for generating presentation outlines and layouts. You can easily switch between providers using environment variables without changing any code.

### Current Providers

- **OpenAI** (GPT-4o, GPT-4 Turbo)
- **Google Gemini** (Gemini 2.0 Flash - Recommended)

## Supported Providers

### OpenAI

**Models Available:**
- `gpt-4o` (Default) - Latest GPT-4 Omni model
- `gpt-4-turbo` - Fast GPT-4 variant
- `gpt-3.5-turbo` - Cost-effective option

**Features:**
- Excellent structured output generation
- Fast response times
- Strong JSON formatting
- Reliable API stability

**Pricing:** [View OpenAI Pricing](https://openai.com/pricing)

### Google Gemini

**Models Available:**
- `gemini-2.5-flash` (Default) - **RECOMMENDED**: Best price-performance, stable production model
- `gemini-2.5-pro` - Advanced thinking model for complex reasoning tasks
- `gemini-2.5-flash-lite` - Ultra-fast and cost-efficient variant
- `gemini-3-pro-preview` - Most intelligent model (preview)
- `gemini-2.0-flash` - Previous generation, still excellent
- `gemini-flash-latest` - Auto-updated alias (with 2-week notice)

**Features:**
- 🚀 **Best Performance**: Gemini 2.5 Flash offers superior quality, speed, and cost
- 📊 Native JSON structured output (no prompt engineering needed)
- 🌍 1M token context window (8x larger than GPT-4)
- 🎨 Multimodal capabilities (text, images, video, audio, documents)
- 💰 Extremely cost-effective (up to 95% cheaper than GPT-4)
- ⚡ Fast inference with low latency
- 🤖 Advanced thinking and agentic capabilities
- 🛡️ Built-in safety settings and content filtering
- 🔧 Tool integration (Google Search, Maps, Code Execution)

**Pricing:** [View Gemini Pricing](https://ai.google.dev/pricing)

## Setup Instructions

### OpenAI Setup

1. **Get API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Sign in or create an account
   - Navigate to API Keys section
   - Click "Create new secret key"
   - Copy the key (you won't be able to see it again)

2. **Configure Environment**
   ```bash
   # .env.local
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
   ```

3. **Verify Setup**
   ```bash
   npm run dev
   ```
   Generate a test presentation to verify the connection.

### Google Gemini Setup

1. **Get API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Select or create a Google Cloud project
   - Copy the API key

2. **Configure Environment**
   ```bash
   # .env.local
   AI_PROVIDER=gemini
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

3. **Verify Setup**
   ```bash
   npm run dev
   ```
   Generate a test presentation to verify the connection.

## Switching Between Providers

### Method 1: Environment Variable (Recommended)

Simply update the `AI_PROVIDER` variable in your `.env.local` file:

```bash
# Use OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key

# Or use Gemini
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_key
```

**No code changes required!** The application automatically uses the configured provider.

### Method 2: Runtime Configuration

You can also set this in your deployment environment:

**Vercel:**
```bash
vercel env add AI_PROVIDER
# Enter: gemini
```

**Railway:**
```bash
railway variables set AI_PROVIDER=gemini
```

**Docker:**
## Model Comparison

| Feature | OpenAI GPT-4o | Gemini 2.5 Flash |
|---------|---------------|------------------|
| **Quality** | Excellent | Excellent ⭐ |
| **Speed** | Fast (2-3s) | Very Fast (1-2s) ⚡ |
| **Context Window** | 128K tokens | 1M tokens (8x larger) 🚀 |
| **JSON Mode** | Native | Native |
| **Multimodal** | Limited | Full Support 🎨 |
| **Cost (Input)** | $2.50/1M tokens | $0.075/1M tokens (97% cheaper) 💰 |
| **Cost (Output)** | $10/1M tokens | $0.30/1M tokens (97% cheaper) 💰 |
| **Reliability** | Very High | Very High |
| **Thinking/Reasoning** | Good | Excellent 🧠 |
| **Tool Use** | Function calling | Native tools + Google Search/Maps |
| **Best For** | General use | Production, Cost-sensitive, Scale |

### Cost Example (10,000 Presentations)
- **GPT-4o**: ~$150 (15K input + 100K output tokens avg)
- **Gemini 2.5 Flash**: ~$3.20 (same usage)
- **Savings**: $146.80 (97% reduction)
**Use Gemini 2.5 Flash if:** ⭐ **Recommended**
- You want the best quality-to-cost ratio (97% cheaper)
- You need faster response times (1-2 seconds)
- You want larger context windows (1M vs 128K tokens)
- You're building for scale (massive cost savings)
- You want the latest AI capabilities and thinking features
- You need document/multimodal processing
- You're cost-conscious or on a budget

**Use OpenAI GPT-4o if:**
- You need maximum reliability
- You already have OpenAI credits
- You're in a region with limited Gemini access

**Use Gemini 2.0 Flash if:** ⭐ **Recommended**
- You want the best quality-to-cost ratio
- You need faster response times
- You want larger context windows
- You're building for scale (lower costs)
- You want the latest AI capabilities

## Troubleshooting

### Error: "API key not configured"

**Solution:**
```bash
# Make sure you've set the correct environment variable
# For OpenAI:
AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-xxxxx

# For Gemini:
AI_PROVIDER=gemini
GEMINI_API_KEY=AIzaSyXXXXX
```

### Error: "Invalid JSON format received from AI"

**Causes:**
- Model returned truncated response
- Network issues during generation

**Solutions:**
1. Try reducing the number of slides
2. Simplify your prompt
3. Try switching to another provider
4. Check your API key is valid and has credits

### Error: Rate limit exceeded

**OpenAI:**
- Check your usage limits at [OpenAI Platform](https://platform.openai.com/usage)
- Upgrade your plan if needed
- Wait for rate limit reset (usually 1 minute)

**Gemini:**
- Free tier: 15 RPM (requests per minute)
- Paid tier: 1000 RPM
- Wait or upgrade at [Google Cloud Console](https://console.cloud.google.com/)

### Provider Performance Issues

**Slow Response Times:**
1. Check your internet connection
2. Try switching providers
3. Reduce max_tokens limit (in `ai-providers.ts`)

**Quality Issues:**
1. Adjust temperature settings
2. Try a different model
3. Enhance your prompts in `prompts.ts`

## Advanced Configuration

### Customizing Models

Edit `/src/lib/ai-providers.ts`:

```typescript
const DEFAULT_MODELS = {
  openai: 'gpt-4o',  // Change to gpt-4-turbo or gpt-3.5-turbo
  gemini: 'gemini-2.0-flash-exp', // Change to gemini-1.5-pro
} as const
```

### Adjusting Temperature

Edit `/src/actions/openai.ts`:

```typescript
// For more creative outputs (0.0 - 2.0)
temperature: 0.7, // Default

// For more consistent outputs
temperature: 0.1, // Current outline generation

// For more creative layouts
temperature: 0.2, // Current layout generation
```

### Custom System Prompts

Edit `/src/lib/prompts.ts`:

```typescript
export const OUTLINE_SYSTEM_MESSAGE = 
  'Your custom system prompt here...'

export const LAYOUT_SYSTEM_MESSAGE = 
  'Your custom layout generation prompt...'
```

## Best Practices

1. **Start with Gemini 2.0 Flash**: Best quality-to-cost ratio
2. **Monitor Usage**: Keep track of API costs and usage
3. **Use JSON Mode**: Always enabled for structured outputs
4. **Set Reasonable Limits**: max_tokens prevents runaway costs
5. **Handle Errors Gracefully**: Always have fallbacks
6. **Test Both Providers**: See which works best for your use case
7. **Keep API Keys Secret**: Never commit to version control

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/your-repo/issues)
- Review the [main README](../README.md)
- Contact support@presentation-hub.com

## References

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini 2.0 Flash Announcement](https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/)
- [AI Provider Implementation](../src/lib/ai-providers.ts)
