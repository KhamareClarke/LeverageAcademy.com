# Admin CMS Guide - Leverage Academy

Complete guide for managing courses, modules, and lessons in the Admin Dashboard.

## Table of Contents

1. [Accessing the Admin Dashboard](#accessing-the-admin-dashboard)
2. [Creating a Course](#creating-a-course)
3. [Managing Modules](#managing-modules)
4. [Creating Lessons](#creating-lessons)
5. [Video Upload & URLs](#video-upload--urls)
6. [Publishing Courses](#publishing-courses)
7. [Editing Content](#editing-content)
8. [Deleting Content](#deleting-content)
9. [Content Types](#content-types)

---

## Accessing the Admin Dashboard

1. Go to `/admin` (or click "Dashboard" if logged in as admin)
2. Navigate to **Courses** in the sidebar
3. You'll see all courses (draft and published)

---

## Creating a Course

### Step 1: Open Course Creation Form

1. Click **"New Course"** button (top right)
2. Fill in the form:
   - **Title**: Course name (required)
   - **Description**: Course overview (optional)
   - **Price**: Course price in £ (required)
   - **Status**: 
     - `Draft` - Not visible to students
     - `Published` - Visible to students

### Step 2: Create Course

1. Click **"Create Course"**
2. Course is created (no content yet)
3. Click **"Manage"** to add modules and lessons

---

## Managing Modules

### Creating a Module

1. Open a course (click **"Manage"**)
2. Click **"Add Module"** button
3. Fill in:
   - **Title**: Module name (required)
   - **Description**: Module overview (optional)
4. Click **"Create Module"**
5. Module is created with automatic order (first = 0, second = 1, etc.)

### Viewing Modules

- Modules are listed in order
- Click on a module to expand and see lessons
- Module shows: Title, Description, Lesson count

### Editing a Module

1. Expand the module
2. Click **Edit** icon (pencil)
3. Update title/description
4. Click **"Update Module"**

### Deleting a Module

1. Expand the module
2. Click **Delete** icon (trash)
3. Confirm deletion
4. ⚠️ **Warning**: This deletes ALL lessons in the module!

---

## Creating Lessons

### Step 1: Open Lesson Form

1. Expand a module (click on it)
2. Click **"Add Lesson"** button
3. Lesson form appears

### Step 2: Fill Lesson Details

**Required Fields:**
- **Title**: Lesson name

**Optional Fields:**
- **Description**: Lesson overview
- **Content Type**: Choose one:
  - `Text Only` - Written content only
  - `Video Only` - Video content only
  - `Mixed` - Both text and video

**Based on Content Type:**

#### If "Text Only" or "Mixed":
- **Written Content**: Markdown or plain text
  - Supports formatting
  - Can include code blocks
  - Use for lesson content, notes, etc.

#### If "Video Only" or "Mixed":
- **Video**: Upload file OR paste URL
  - See [Video Upload & URLs](#video-upload--urls) section

### Step 3: Create Lesson

1. Click **"Create Lesson"**
2. Lesson is created with automatic order
3. Order: First lesson = 0, second = 1, etc.

---

## Video Upload & URLs

### Option 1: Upload Video File

1. In lesson form, select "Video Only" or "Mixed"
2. Under **"Option 1: Upload Video"**
3. Click **"Choose Video File"**
4. Select video file from your computer
5. Wait for upload (progress bar shows)
6. ✅ Video URL auto-fills when complete

**Supported Formats:**
- MP4
- WebM
- OGG
- QuickTime

**File Size Limit:** 500MB maximum

**Storage:** Videos are stored in Supabase Storage bucket `course-videos`

### Option 2: Use Video URL

1. In lesson form, select "Video Only" or "Mixed"
2. Under **"Option 2: Video URL"**
3. Paste video URL:
   - YouTube: `https://youtube.com/watch?v=...`
   - Vimeo: `https://vimeo.com/...`
   - Direct video URL: `https://example.com/video.mp4`
   - Supabase Storage URL: `https://...supabase.co/storage/v1/object/public/...`
4. URL is saved with lesson

### Clearing Video URL

- Click **X** button next to URL input to clear
- Or delete the URL text manually

---

## Publishing Courses

### Publishing a Course

1. Open course detail page
2. Click **"Publish"** button (top right)
3. Course status changes to "Published"
4. ✅ Course is now visible to students

### Unpublishing a Course

1. Open course detail page
2. Click **"Unpublish"** button
3. Course status changes to "Draft"
4. ⚠️ Students lose access (if enrolled)

**Note:** Unpublishing doesn't delete content, just hides it.

---

## Editing Content

### Editing a Course

1. Go to `/admin/courses`
2. Click **"Manage"** on any course
3. Course info is shown at top
4. To edit course details, update via API or database

### Editing a Module

1. Expand the module
2. Click **Edit** icon (pencil)
3. Update form appears
4. Change title/description
5. Click **"Update Module"**

### Editing a Lesson

1. Expand the module containing the lesson
2. Find the lesson in the list
3. Click **Edit** icon (pencil)
4. Lesson form appears with current data
5. Update any fields:
   - Title, Description
   - Content Type
   - Written Content
   - Video (upload new or change URL)
6. Click **"Update Lesson"**

**Note:** Changes appear instantly after saving.

---

## Deleting Content

### Deleting a Course

1. Go to `/admin/courses`
2. Click **Delete** icon (trash) on course card
3. Confirm deletion
4. ⚠️ **Warning**: This deletes:
   - The course
   - ALL modules in the course
   - ALL lessons in those modules
   - This action cannot be undone!

### Deleting a Module

1. Expand the module
2. Click **Delete** icon (trash)
3. Confirm deletion
4. ⚠️ **Warning**: This deletes ALL lessons in the module!

### Deleting a Lesson

1. Expand the module
2. Find the lesson
3. Click **Delete** icon (trash)
4. Confirm deletion
5. Lesson is permanently deleted

---

## Content Types

### Text Only
- **Use for:** Written lessons, articles, notes
- **Fields:** Title, Description, Written Content
- **No video** required

### Video Only
- **Use for:** Video tutorials, recordings
- **Fields:** Title, Description, Video (upload or URL)
- **No written content** required

### Mixed
- **Use for:** Comprehensive lessons with both text and video
- **Fields:** All fields available
- **Best for:** Full lessons with video + notes

---

## Content Structure

```
Course
  └── Module 1 (order: 0)
      ├── Lesson 1 (order: 0)
      ├── Lesson 2 (order: 1)
      └── Lesson 3 (order: 2)
  └── Module 2 (order: 1)
      ├── Lesson 1 (order: 0)
      └── Lesson 2 (order: 1)
```

**Order is automatic:**
- Modules: First = 0, Second = 1, Third = 2...
- Lessons: First in module = 0, Second = 1, Third = 2...

---

## Best Practices

### Course Creation
1. ✅ Create course first (draft status)
2. ✅ Add all modules
3. ✅ Add all lessons
4. ✅ Review content
5. ✅ Publish when ready

### Module Organization
- Group related lessons into modules
- Use clear module titles
- Add descriptions for context

### Lesson Content
- Use "Mixed" type for best experience
- Add written content for notes/summaries
- Use video for demonstrations
- Keep lessons focused and concise

### Video Management
- Upload large files to Supabase Storage
- Use YouTube/Vimeo for public videos
- Test video URLs before publishing

---

## Troubleshooting

### Video Upload Fails
- Check file size (max 500MB)
- Verify file format (MP4, WebM, OGG, QuickTime)
- Ensure Supabase Storage bucket exists (see `STORAGE_SETUP.md`)
- Check storage policies are set correctly

### Course Not Visible to Students
- Check course status is "Published"
- Verify student is enrolled and paid
- Check course is not in draft mode

### Module/Lesson Order Wrong
- Order is automatic based on creation time
- First created = lower order number
- Delete and recreate to change order (not recommended)

### Can't Delete Course
- Ensure you're logged in as admin
- Check course has no active enrollments (if needed)
- Verify you have proper permissions

---

## Quick Reference

| Action | Location | Button/Icon |
|--------|----------|-------------|
| Create Course | `/admin/courses` | "New Course" |
| Manage Course | `/admin/courses` | "Manage" |
| Add Module | Course detail page | "Add Module" |
| Add Lesson | Expand module | "Add Lesson" |
| Publish Course | Course detail page | "Publish" |
| Edit Module | Expand module | ✏️ Edit icon |
| Edit Lesson | Expand module | ✏️ Edit icon |
| Delete Course | `/admin/courses` | 🗑️ Delete icon |
| Delete Module | Expand module | 🗑️ Delete icon |
| Delete Lesson | Expand module | 🗑️ Delete icon |

---

## Need Help?

- Check `STORAGE_SETUP.md` for video upload setup
- Review database schema in `supabase/migrations/`
- Check API routes in `app/api/` for technical details

---

**Last Updated:** 2024
**Version:** 1.0



