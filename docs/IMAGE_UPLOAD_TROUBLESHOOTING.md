# Image Upload Troubleshooting Guide

This guide helps you troubleshoot and fix issues with manual image uploads in the presentation editor.

---

## Quick Diagnostics

### **Problem: Upload button freezes or nothing happens**

**Possible Causes:**
1. Missing Uploadcare API key
2. Large file size
3. Network timeout
4. Browser blocking Uploadcare
5. Invalid image format

---

## Step-by-Step Fixes

### **1. Check Uploadcare Configuration**

**Verify your API key is set:**

```bash
# .env.local
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_uploadcare_public_key
```

**Get an Uploadcare key:**
1. Go to [Uploadcare.com](https://uploadcare.com/)
2. Sign up for a free account
3. Go to Dashboard → Project Settings → API Keys
4. Copy your **Public Key** (not the secret key)
5. Add to `.env.local`

**Free tier includes:**
- 3,000 uploads per month
- 3GB storage
- 10GB CDN traffic

---

### **2. File Size Limits**

**Current limit:** 10MB per file

**If your image is too large:**
1. Compress it using [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
2. Resize to max 2000px width (presentations don't need huge images)
3. Convert to JPG if it's PNG (usually smaller)

**Recommended image specs:**
- Format: JPG or PNG
- Max size: 2-5MB
- Dimensions: 1920×1080 or smaller
- Quality: 80-90%

---

### **3. Check Browser Console for Errors**

**Open browser dev tools:**
- Chrome/Edge: `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Firefox: `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
- Safari: `Cmd+Option+C` (Mac)

**Look for errors like:**

```
❌ Uploadcare not configured
→ Add NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY to .env.local

❌ 401 Unauthorized
→ Check your Uploadcare public key is correct

❌ CORS error
→ Uploadcare might be blocked by your network/firewall

❌ File too large
→ Compress your image or use smaller file

❌ Invalid file type
→ Only images are allowed (JPG, PNG, GIF, WebP, SVG)
```

**Expected successful logs:**
```
🟢 Upload started
🟢 Upload progress: 50%
🟢 Upload progress: 100%
🟢 Upload successful: https://ucarecdn.com/...
```

---

### **4. Network Issues**

**Symptoms:**
- Upload gets stuck at 0%
- No progress bar appears
- Page becomes unresponsive

**Solutions:**

1. **Check internet connection**
   ```bash
   ping uploadcare.com
   ```

2. **Disable VPN temporarily**
   - Some VPNs block Uploadcare CDN

3. **Try different network**
   - Mobile hotspot
   - Different WiFi network

4. **Check firewall settings**
   - Allow `*.uploadcare.com`
   - Allow `*.ucarecdn.com`

---

### **5. Browser Compatibility**

**Supported browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**If using older browser:**
- Update to latest version
- Try a different browser

**Clear browser cache:**
- Chrome: `Ctrl+Shift+Delete`
- Select "Cached images and files"
- Clear data

---

### **6. Component Not Appearing**

**If you don't see the upload button:**

1. **Check if image is editable**
   - Hover over the image
   - Upload button should appear in top-left corner
   - Only appears in edit mode, not preview mode

2. **Check component props**
   ```tsx
   <CustomImage
     src="..."
     alt="..."
     contentId="..."
     onContentChange={handleChange}
     isEditable={true} // Must be true!
     isPreview={false}  // Must be false!
   />
   ```

---

### **7. Image Doesn't Update After Upload**

**If upload succeeds but image doesn't change:**

1. **Check `onContentChange` callback**
   ```tsx
   const handleContentChange = (id: string, newUrl: string) => {
     console.log('Image changed:', id, newUrl);
     // Make sure this updates your state/store
     updateContent(id, newUrl);
   };
   ```

2. **Verify state update**
   - Open React DevTools
   - Check component state
   - Verify new URL is in state

3. **Clear browser cache**
   - Old image might be cached
   - Hard refresh: `Ctrl+F5` (Windows) / `Cmd+Shift+R` (Mac)

---

## Common Error Messages

### **"Uploadcare not configured"**

**Problem:** Missing API key

**Solution:**
```bash
# Add to .env.local
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=demopublickey

# Restart dev server
npm run dev
```

---

### **"Upload failed"**

**Generic error - check these:**

1. **File type**
   - Only images allowed
   - Supported: JPG, PNG, GIF, WebP, SVG

2. **File size**
   - Must be under 10MB
   - Compress if needed

3. **Network**
   - Check internet connection
   - Try different network

4. **Uploadcare status**
   - Check [Uploadcare Status](https://status.uploadcare.com/)

---

### **"Failed to update image"**

**Problem:** Upload succeeded but couldn't update component

**Solution:**
1. Check browser console for detailed error
2. Verify `onContentChange` function is working
3. Check for React state update issues

---

## Testing Image Upload

### **Quick Test:**

1. Open your presentation editor
2. Hover over any image
3. Click the upload widget
4. Select a small test image (< 1MB)
5. Watch browser console for logs:
   ```
   🟢 Upload started
   🟢 Upload progress: 100%
   🟢 Upload successful: https://ucarecdn.com/xxx
   ```

---

## Advanced Debugging

### **Enable Verbose Logging:**

Add to your component:
```tsx
<FileUploaderRegular
  // ... other props
  onModalOpen={() => console.log('Modal opened')}
  onModalClose={() => console.log('Modal closed')}
  onFileSelect={() => console.log('File selected')}
  onChange={(e) => console.log('Change event:', e)}
/>
```

---

### **Test Uploadcare Directly:**

Visit [Uploadcare Upload Widget Demo](https://uploadcare.com/widget/)
- If this works, your config is wrong
- If this doesn't work, network issue

---

### **Check Network Requests:**

1. Open DevTools → Network tab
2. Filter by "uploadcare"
3. Try uploading
4. Check request status:
   - 200: Success
   - 401: Invalid API key
   - 403: Forbidden (check domain settings)
   - 413: File too large
   - 500: Uploadcare server error

---

## Uploadcare Alternatives

If Uploadcare continues to have issues, you can use alternative upload methods:

### **1. Cloudinary** (Free tier available)
- Similar to Uploadcare
- 25GB storage free
- [Sign up](https://cloudinary.com/)

### **2. Direct Vercel Blob Upload**
- You already have Vercel Blob configured
- Can implement direct file upload
- Would need custom file picker

### **3. Manual URL Input**
- Upload image anywhere (Imgur, etc.)
- Paste URL directly

---

## Getting Help

If you're still experiencing issues:

1. **Check console logs** - Look for 🔴 error messages
2. **Note the exact error message**
3. **Try with a different image** (small JPG under 1MB)
4. **Check Uploadcare status** - [status.uploadcare.com](https://status.uploadcare.com/)
5. **Verify environment variables** - Restart dev server after changes

---

## Uploadcare Free Tier Limits

**Monthly limits:**
- 3,000 uploads
- 3GB storage
- 10GB CDN traffic

**If you exceed limits:**
1. Upgrade to paid plan ($25/mo)
2. Delete old uploads from dashboard
3. Use alternative image hosting

---

## Environment Variables Checklist

Make sure you have:

```bash
# Required for manual image upload
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_public_key_here

# Required for image storage (AI images)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# All environment variables must start with NEXT_PUBLIC_
# to be accessible in client components
```

---

## Component Improvements (Already Implemented)

✅ Loading indicator with progress bar
✅ Error messages displayed to user
✅ Upload timeout handling
✅ Proper cleanup on unmount
✅ Configuration validation
✅ Image-only restrictions
✅ Console logging for debugging

---

## Support Resources

- [Uploadcare Documentation](https://uploadcare.com/docs/)
- [Uploadcare React Uploader](https://github.com/uploadcare/react-uploader)
- [Uploadcare Support](https://uploadcare.com/support/)
- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)

---

**Last Updated:** After implementing upload freeze fixes with progress indicators and error handling.
