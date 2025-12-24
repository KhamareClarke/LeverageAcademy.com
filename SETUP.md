# Leverage Academy - Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your project to be provisioned
3. Go to **Settings** → **API** and copy:
   - Project URL
   - `anon` public key

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 4: Run Database Migrations

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run it in the SQL Editor

This will create:
- All necessary tables (users, courses, applications, enrollments, lessons, lesson_progress)
- Row Level Security (RLS) policies
- Triggers for automatic user profile creation
- Indexes for performance

## Step 5: Create Your First Admin User

After running the migration, you need to create an admin user manually:

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add User** → **Create new user**
3. Enter email and password
4. In **User Metadata**, add:
   ```json
   {
     "role": "admin",
     "full_name": "Your Name"
   }
   ```

The trigger will automatically create a user profile in the `users` table.

## Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## User Roles

### Admin
- Can review applications
- Can create and manage courses
- Can publish/unpublish courses
- Can view all student progress
- Access: `/admin`

### Student
- Can apply to courses
- Can pay after approval
- Can access enrolled courses only
- Can track lesson completion
- Access: `/student`

## Application Flow

1. **Student applies** → Application created with status `pending`
2. **Admin reviews** → Approves or rejects
3. **If approved** → Enrollment created with `payment_status: pending`
4. **Student pays** → Enrollment updated to `payment_status: paid`
5. **Student accesses course** → Can view lessons and track progress

## Database Schema

- **users**: User profiles (linked to Supabase auth.users)
- **courses**: Course catalog
- **applications**: Student applications for courses
- **enrollments**: Student enrollments (after approval)
- **lessons**: Course lessons
- **lesson_progress**: Student progress tracking

## API Routes

- `GET /api/courses` - List courses (published for students, all for admins)
- `POST /api/courses` - Create course (admin only)
- `GET /api/applications` - List applications
- `POST /api/applications` - Create application (student only)
- `PATCH /api/applications/[id]` - Review application (admin only)
- `GET /api/enrollments` - List enrollments
- `GET /api/lessons?course_id=...` - Get course lessons
- `POST /api/lessons` - Create lesson (admin only)
- `GET /api/progress?course_id=...` - Get progress
- `POST /api/progress` - Update progress
- `POST /api/payments` - Process payment

## Payment Integration

Currently, the payment system is a demo. To integrate real payments:

1. Set up Stripe/PayPal account
2. Install payment SDK
3. Update `app/student/payment/[applicationId]/page.tsx`
4. Update `app/api/payments/route.ts`

## Next Steps

- Add email notifications for application status changes
- Implement real payment processing
- Add course content editor (rich text/markdown)
- Add file uploads for course materials
- Add student progress analytics for admins
- Add course completion certificates

