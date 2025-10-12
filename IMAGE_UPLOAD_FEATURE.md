# Image Upload Feature Added ✅

## What's New

The service form now supports **image uploads** in addition to URL input!

## Features

### 1. **Upload from Computer**
- Click "Upload Image" button
- Select image from your device
- Automatic upload to Supabase Storage
- Image preview after upload

### 2. **Paste External URL**
- Still supports external URLs (Unsplash, etc.)
- Just paste the URL in the input field

### 3. **Image Preview**
- Shows preview of current image
- Remove button (X) to clear image

### 4. **Validation**
- ✅ Only image files allowed
- ✅ Max 5MB file size
- ✅ Loading state during upload

## How It Works

### Upload Flow
1. User selects image file
2. Validates file type and size
3. Generates unique filename
4. Uploads to `media/services/` bucket
5. Gets public URL
6. Updates form with URL
7. Shows preview

### Storage Structure
```
media/
  └── services/
      ├── abc123-1234567890.jpg
      ├── def456-1234567891.png
      └── ...
```

## UI/UX

**Image Section:**
```
┌─────────────────────────────────┐
│ Service Image                   │
├─────────────────────────────────┤
│ [Image Preview with X button]   │ ← Shows if image exists
├─────────────────────────────────┤
│ ┌───────────────────────────┐   │
│ │  📤 Upload Image          │   │ ← Click to upload
│ └───────────────────────────┘   │
│                                 │
│ ──────── or paste URL ────────  │
│                                 │
│ [URL input field]               │
│ Upload an image or paste URL    │
└─────────────────────────────────┘
```

## Code Changes

### Updated File
`components/admin/service-form.tsx`

**Added:**
- `isUploading` state
- `handleImageUpload` function
- Image preview component
- Upload button with loading state
- File input (hidden)
- Remove image button

**Features:**
- File validation (type & size)
- Unique filename generation
- Supabase Storage upload
- Public URL retrieval
- Error handling

## Storage Requirements

### Supabase Storage Bucket
**Name:** `media`
**Path:** `services/`

**Policies Needed:**
1. **Upload** - Authenticated users can upload
2. **Read** - Public can view images

### Create Bucket (if not exists)
```sql
-- In Supabase Dashboard > Storage
-- Create bucket: media
-- Make it public
```

## Usage

### For Admins
1. Go to `/admin/services`
2. Click "Add Service" or "Edit"
3. In the image section:
   - **Option A:** Click "Upload Image" → Select file
   - **Option B:** Paste external URL
4. Preview appears automatically
5. Click X to remove image
6. Save service

### Benefits
✅ **No external dependencies** - Images stored in your Supabase
✅ **Fast loading** - CDN-backed storage
✅ **Easy management** - Upload directly from admin
✅ **Flexible** - Still supports external URLs
✅ **User-friendly** - Drag & drop ready (can be added)

## Next Steps

**Optional Enhancements:**
1. Add drag & drop support
2. Add image cropping/resizing
3. Add multiple image upload
4. Add image optimization
5. Add progress bar for large files

## Storage Costs

Supabase Storage pricing:
- **Free tier:** 1GB storage
- **Pro tier:** 100GB included
- Images are typically 100-500KB each
- ~2,000-10,000 images in free tier

All set! Users can now upload images directly from the admin panel! 🎉
