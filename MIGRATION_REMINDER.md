# Migration Reminder

## Important: Run Database Migrations

The following migrations need to be run in your Supabase database:

1. **007_estimated_time_and_quizzes.sql** - Creates:
   - `estimated_time` columns for courses, modules, lessons
   - `quizzes` table
   - `quiz_attempts` table
   - `module_progress` table

2. **008_student_management.sql** - Creates:
   - `status` column for users (active/blocked)
   - Assignment tracking for enrollments
   - Triggers for linking approved applications

## How to Run Migrations

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of each migration file
4. Run them in order (007 first, then 008)

## Current Status

The application will work without these migrations, but some features will be limited:
- ✅ Lesson completion tracking works
- ❌ Module progress tracking (table missing)
- ❌ Quiz system (table missing)
- ❌ Student status management (table missing)

After running the migrations, all features will work fully.



