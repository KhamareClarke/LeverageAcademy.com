# How to Run Database Migration

## Quick Steps

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste Migration**
   - Open the file: `supabase/migrations/009_combined_migrations.sql`
   - Copy ALL the contents
   - Paste into the SQL Editor

4. **Run the Migration**
   - Click "Run" button (or press Ctrl+Enter)
   - Wait for it to complete (should take a few seconds)

5. **Verify Success**
   - You should see "Success. No rows returned" or similar
   - Check that no errors appeared

## What This Migration Creates

✅ `estimated_time` columns for courses, modules, and lessons  
✅ `quizzes` table (for module quizzes)  
✅ `quiz_attempts` table (tracks student quiz attempts)  
✅ `module_progress` table (tracks module completion)  
✅ `status` column for users (active/blocked)  
✅ Assignment tracking for enrollments  
✅ All necessary RLS policies and indexes  

## After Running

Once the migration is complete:
- Refresh your application
- Module progress tracking will work
- Quiz system will be fully functional
- Student status management will work
- All features will be enabled!

## Troubleshooting

If you get an error:
- Make sure you're running it in the correct Supabase project
- Check that previous migrations (001-006) have been run
- Some errors about "already exists" are OK - the migration uses `IF NOT EXISTS`



