# Image Generation Provider Setup Guide

This application supports multiple AI image generation providers that can be configured via environment variables. Choose the provider that best fits your needs and budget.

## Table of Contents

- [Quick Start](#quick-start)
- [Supported Providers](#supported-providers)
- [Configuration](#configuration)
- [Provider Setup Guides](#provider-setup-guides)
  - [Cloudflare Workers AI](#1-cloudflare-workers-ai-recommended-for-free-tier)
  - [Hugging Face](#2-hugging-face)
  - [Replicate](#3-replicate-great-for-github-students)
  - [Google Gemini (Default)](#4-google-gemini-default)
- [Switching Between Providers](#switching-between-providers)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

1. Choose your preferred image generation provider
2. Get API credentials from the provider
3. Add environment variables to your `.env.local` file
4. Set `IMAGE_GENERATION_PROVIDER` to your chosen provider
5. Restart your development server

---

## Supported Providers

| Provider | Cost | Speed | Quality | Best For |
|----------|------|-------|---------|----------|
| **Cloudflare Workers AI** | Free tier available | Fast (4 steps) | Good | Production, free hosting |
| **Hugging Face** | Free tier with limits | Medium | Good-Excellent | Development, testing |
| **Replicate** | Pay-per-use, free credits | Fast-Medium | Excellent | GitHub Students, quality needs |
| **Google Gemini** | Pay-per-use | Fast | Excellent | Default option, reliable |

---

## Configuration

### Required Environment Variables

Add these to your `.env.local` file:

```bash
# Choose your image generation provider
# Options: cloudflare, huggingface, replicate, gemini
IMAGE_GENERATION_PROVIDER=cloudflare

# Provider-specific credentials (only add what you need)
```

---

## Provider Setup Guides

### 1. Cloudflare Workers AI (Recommended for Free Tier)

**Why choose Cloudflare?**
- ✅ Generous free tier (10,000 requests/day)
- ✅ Fast generation (FLUX.1 Schnell model)
- ✅ No credit card required for free tier
- ✅ Great for production use
- ✅ Student Developer Pack benefits

**Setup Steps:**

1. **Create a Cloudflare Account**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Sign up for a free account

2. **Get Your Account ID**
   - In the dashboard, go to "Workers & Pages" or any overview page
   - Your Account ID is displayed on the right side
   - Copy this value

3. **Generate an API Token**
   - Go to [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Click "Create Token"
   - Use "Create Custom Token" template
   - Set permissions:
     - Account → Workers AI → Edit
   - Click "Continue to summary" → "Create Token"
   - Copy the token (you won't see it again!)

4. **Add to Environment Variables**
   ```bash
   IMAGE_GENERATION_PROVIDER=cloudflare
   CLOUDFLARE_ACCOUNT_ID=your_account_id_here
   CLOUDFLARE_API_TOKEN=your_api_token_here
   ```

5. **Test Configuration**
   - Restart your development server
   - Generate a presentation with AI
   - Check console logs for "Generating image with provider: cloudflare"

**Models Available:**
- Default: `@cf/black-forest-labs/flux-1-schnell` (fast, free)
- Alternative: `@cf/stabilityai/stable-diffusion-xl-base-1.0` (slower, higher quality)

**Pricing:**
- Free tier: 10,000 requests per day
- Paid tier: $0.001 per request after free tier

**Documentation:**
- [Cloudflare Workers AI Docs](https://developers.cloudflare.com/workers-ai/)
- [Image Generation Models](https://developers.cloudflare.com/workers-ai/models/#text-to-image)

---

### 2. Hugging Face

**Why choose Hugging Face?**
- ✅ Free tier available
- ✅ Multiple models to choose from
- ✅ Great for testing and development
- ✅ Active community and support
- ⚠️ Rate limits on free tier
- ⚠️ Models may need to "wake up" (cold start)

**Setup Steps:**

1. **Create a Hugging Face Account**
   - Go to [Hugging Face](https://huggingface.co/)
   - Sign up for a free account

2. **Generate an Access Token**
   - Go to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
   - Click "New token"
   - Name: "Presentation Hub API"
   - Role: "Read" (sufficient for inference)
   - Click "Generate token"
   - Copy the token

3. **Add to Environment Variables**
   ```bash
   IMAGE_GENERATION_PROVIDER=huggingface
   HUGGINGFACE_API_TOKEN=hf_your_token_here

   # Optional: Choose a specific model (default: stabilityai/stable-diffusion-xl-base-1.0)
   HUGGINGFACE_MODEL=stabilityai/stable-diffusion-xl-base-1.0
   ```

4. **Test Configuration**
   - Restart your development server
   - Generate a presentation with AI
   - Note: First request may take 30-60 seconds (model loading)

**Recommended Models:**
- `stabilityai/stable-diffusion-xl-base-1.0` - Best quality (default)
- `runwayml/stable-diffusion-v1-5` - Faster, good quality
- `prompthero/openjourney` - Artistic style
- `stabilityai/stable-diffusion-2-1` - Good balance

**Rate Limits (Free Tier):**
- ~1,000 requests per day
- 30-second timeout per request
- Model loading time: 20-60 seconds (first request)

**Pricing:**
- Free tier: Limited requests
- Pro ($9/month): Higher rate limits, faster inference
- Enterprise: Custom pricing

**Documentation:**
- [Inference API Docs](https://huggingface.co/docs/api-inference/)
- [Available Models](https://huggingface.co/models?pipeline_tag=text-to-image)

---

### 3. Replicate (Great for GitHub Students)

**Why choose Replicate?**
- ✅ Excellent quality (FLUX.1, SDXL)
- ✅ Simple API
- ✅ Free credits for GitHub Student Developer Pack
- ✅ Pay-per-use pricing
- ⚠️ Async API (slight delay)
- ⚠️ Costs after free credits

**Setup Steps:**

1. **Create a Replicate Account**
   - Go to [Replicate](https://replicate.com/)
   - Sign up (use GitHub for student benefits)

2. **Claim Student Credits (Optional)**
   - If you have GitHub Student Developer Pack:
   - Go to [GitHub Education](https://education.github.com/pack)
   - Find Replicate offer
   - Claim your free credits ($100+ value)

3. **Get Your API Token**
   - Go to [Account Settings](https://replicate.com/account/api-tokens)
   - Copy your API token
   - Or create a new one

4. **Add to Environment Variables**
   ```bash
   IMAGE_GENERATION_PROVIDER=replicate
   REPLICATE_API_TOKEN=r8_your_token_here

   # Optional: Choose a specific model (default: black-forest-labs/flux-schnell)
   REPLICATE_MODEL=black-forest-labs/flux-schnell
   ```

5. **Test Configuration**
   - Restart your development server
   - Generate a presentation with AI
   - Note: Replicate is async, may take 3-10 seconds per image

**Recommended Models:**
- `black-forest-labs/flux-schnell` - Fast, high quality (default, $0.003/run)
- `black-forest-labs/flux-pro` - Best quality ($0.055/run)
- `stability-ai/sdxl` - Stable Diffusion XL ($0.0023/run)
- `stability-ai/stable-diffusion` - Classic SD ($0.0006/run)

**Pricing:**
- Free credits: ~$100 with GitHub Student Pack
- Pay-per-use: $0.003-$0.055 per image (model dependent)
- No monthly fees

**GitHub Student Developer Pack:**
- Includes: $100+ in free Replicate credits
- Eligibility: Students with GitHub Education access
- [Learn more](https://education.github.com/pack)

**Documentation:**
- [Replicate Docs](https://replicate.com/docs)
- [Pricing](https://replicate.com/pricing)
- [Image Generation Models](https://replicate.com/collections/text-to-image)

---

### 4. Google Gemini (Default)

**Why choose Gemini?**
- ✅ High quality images
- ✅ Fast generation
- ✅ Integrated with Google Cloud
- ✅ Reliable and stable
- ⚠️ Requires API key
- ⚠️ Pay-per-use pricing

**Setup Steps:**

1. **Get Google AI Studio API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key

2. **Add to Environment Variables**
   ```bash
   IMAGE_GENERATION_PROVIDER=gemini  # or leave blank (default)
   GOOGLE_GENAI_API_KEY=your_api_key_here

   # Optional: Choose which Gemini model to use (defaults to 2.0)
   GEMINI_IMAGE_MODEL=gemini-2.5-flash-image  # or gemini-2.0-flash-preview-image-generation
   ```

3. **Test Configuration**
   - Restart your development server
   - Generate a presentation with AI

**Available Models:**
- `gemini-2.0-flash-preview-image-generation` (default, stable)
- `gemini-2.5-flash-image` (newer, improved quality and capabilities)

**Pricing:**
- Free tier: Limited requests
- Pay-per-use: Check [Google AI Pricing](https://ai.google.dev/pricing)

**Documentation:**
- [Google AI Docs](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api/rest)

---

## Switching Between Providers

You can switch providers at any time by changing the `IMAGE_GENERATION_PROVIDER` environment variable:

```bash
# Switch to Cloudflare
IMAGE_GENERATION_PROVIDER=cloudflare

# Switch to Hugging Face
IMAGE_GENERATION_PROVIDER=huggingface

# Switch to Replicate
IMAGE_GENERATION_PROVIDER=replicate

# Switch to Gemini (or remove the variable)
IMAGE_GENERATION_PROVIDER=gemini
```

**After changing:**
1. Restart your development server
2. The next image generation will use the new provider
3. Check console logs to verify the provider is active

---

## Troubleshooting

### General Issues

**Provider not working?**
1. Check environment variables are set correctly
2. Verify API keys/tokens are valid
3. Check console logs for error messages
4. Ensure `.env.local` is in the root directory
5. Restart your development server

**Images showing placeholders?**
1. Check the console for error messages
2. Verify your API credentials
3. Check rate limits (may be exceeded)
4. Try a different provider

### Provider-Specific Issues

**Cloudflare:**
- ❌ `401 Unauthorized` → Check API token permissions
- ❌ `403 Forbidden` → Verify Account ID is correct
- ❌ `429 Rate Limited` → Free tier limit exceeded (10k/day)

**Hugging Face:**
- ❌ `503 Service Unavailable` → Model is loading (wait 30-60s, retry)
- ❌ `401 Unauthorized` → Check API token
- ❌ `429 Rate Limited` → Free tier limit exceeded

**Replicate:**
- ❌ `401 Unauthorized` → Check API token format (starts with `r8_`)
- ❌ Timeout errors → Increase max wait time in code
- ❌ `402 Payment Required` → Add payment method or use free credits

**Gemini:**
- ❌ `401 Unauthorized` → Check API key from AI Studio
- ❌ `429 Rate Limited` → API quota exceeded

### Getting Help

1. Check console logs for detailed error messages
2. Review provider documentation (links above)
3. Check provider status pages:
   - [Cloudflare Status](https://www.cloudflarestatus.com/)
   - [Hugging Face Status](https://status.huggingface.co/)
   - [Replicate Status](https://status.replicate.com/)

---

## Environment Variables Summary

**Complete `.env.local` example:**

```bash
# ====================================
# IMAGE GENERATION CONFIGURATION
# ====================================

# Choose your provider: cloudflare, huggingface, replicate, or gemini
IMAGE_GENERATION_PROVIDER=cloudflare

# Cloudflare Workers AI (if using cloudflare)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token

# Hugging Face (if using huggingface)
HUGGINGFACE_API_TOKEN=hf_your_token
HUGGINGFACE_MODEL=stabilityai/stable-diffusion-xl-base-1.0  # optional

# Replicate (if using replicate)
REPLICATE_API_TOKEN=r8_your_token
REPLICATE_MODEL=black-forest-labs/flux-schnell  # optional

# Google Gemini (if using gemini or default)
GOOGLE_GENAI_API_KEY=your_api_key

# ====================================
# OTHER REQUIRED VARIABLES
# ====================================

# OpenAI (for presentation outline generation)
OPENAI_API_KEY=your_openai_key

# Vercel Blob Storage (for image hosting)
BLOB_READ_WRITE_TOKEN=your_blob_token

# Database
DATABASE_URL=your_database_url

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_public_key

# Uploadcare (for manual image uploads)
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_uploadcare_key
```

---

## Recommendations

**For Development/Testing:**
- Use **Cloudflare Workers AI** (free tier, no credit card)
- Or **Hugging Face** (free tier, multiple models)

**For Production:**
- Use **Cloudflare Workers AI** (reliable, scalable, free tier)
- Or **Google Gemini** (high quality, reliable)

**For Students:**
- Use **Replicate** with GitHub Student Developer Pack ($100 free credits)
- Or **Cloudflare Workers AI** (free tier)

**For Best Quality:**
- Use **Replicate** with FLUX.1 Pro
- Or **Google Gemini** 2.0 Flash

**For Cost Optimization:**
- Primary: **Cloudflare Workers AI** (free tier)
- Fallback: **Hugging Face** (free tier)
- Premium: **Replicate** or **Gemini** for important presentations

---

## Next Steps

1. Choose your provider based on the recommendations above
2. Follow the setup guide for your chosen provider
3. Add environment variables to `.env.local`
4. Restart your development server
5. Test image generation by creating a presentation

For more help, check the provider documentation or create an issue in the repository.
