# How to Create a Course Completion Quiz

## Step 1: Run the Migration

First, make sure you've run the migration to enable course completion quizzes:

```sql
-- Run this in Supabase SQL Editor
-- File: supabase/migrations/010_course_completion_quiz.sql
```

## Step 2: Create the Quiz via Admin Dashboard

### Option A: Via Admin CMS (Recommended)

1. Go to Admin Dashboard → Courses
2. Select the course you want to add a completion quiz to
3. Look for "Course Completion Quiz" section (if available)
4. Create quiz with:
   - Title: "Course Completion Quiz"
   - Questions: Add your quiz questions
   - Quiz Type: `course`
   - Module ID: Leave empty/null

### Option B: Via SQL (Direct)

If the admin interface doesn't support course quizzes yet, create it directly via SQL:

```sql
-- Replace these values:
-- course_id: Your course UUID
-- title: Quiz title
-- questions: JSON array of questions

INSERT INTO public.quizzes (
  course_id,
  module_id,
  quiz_type,
  title,
  description,
  questions,
  passing_score
) VALUES (
  'YOUR_COURSE_ID_HERE',  -- Replace with actual course ID
  NULL,                    -- Must be NULL for course quizzes
  'course',                -- Must be 'course' for course completion quiz
  'Course Completion Quiz',
  'Test your knowledge with this optional quiz.',
  '[
    {
      "question": "What did you learn in this course?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct_answer": "Option 1"
    },
    {
      "question": "Another question?",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A"
    }
  ]'::jsonb,
  0  -- Not required to pass
);
```

## Step 3: Verify Quiz Creation

Check if the quiz was created:

```sql
SELECT * FROM public.quizzes 
WHERE course_id = 'YOUR_COURSE_ID' 
  AND quiz_type = 'course' 
  AND module_id IS NULL;
```

## Troubleshooting

### Quiz Not Appearing?

1. **Check Console Logs**: Open browser console and look for:
   - "Course completion quiz data:" - Should show quiz data
   - "Course completion quiz loaded:" - Confirms quiz was loaded
   - "No course completion quiz found" - Quiz doesn't exist

2. **Verify Migration**: Make sure `010_course_completion_quiz.sql` was run

3. **Check Quiz Type**: Ensure `quiz_type = 'course'` and `module_id IS NULL`

4. **Check Course ID**: Make sure the course_id matches exactly

### Quiz Appears But Won't Show?

1. Check browser console for errors
2. Verify quiz has questions: `questions` should be a valid JSON array
3. Check if `showQuiz` state is being set to `'course'`
4. Verify the quiz modal is rendering (check React DevTools)



