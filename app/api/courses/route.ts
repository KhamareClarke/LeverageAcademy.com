export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get published courses
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching courses:', error)
      // Return mock courses if database fails
      return NextResponse.json({
        courses: [
          {
            id: '1',
            title: 'AI Agent Development',
            description: 'Learn to build AI agents that work autonomously',
            price: 299,
            status: 'published',
          },
          {
            id: '2',
            title: 'Full Stack Web Development',
            description: 'Master modern web development with React and Node.js',
            price: 199,
            status: 'published',
          },
          {
            id: '3',
            title: 'Data Science Fundamentals',
            description: 'Introduction to data analysis and machine learning',
            price: 249,
            status: 'published',
          },
        ],
      })
    }

    // If no courses, return mock courses
    if (!courses || courses.length === 0) {
      return NextResponse.json({
        courses: [
          {
            id: 'mock-1',
            title: 'AI Agent Development',
            description: 'Learn to build AI agents that work autonomously and solve real-world problems',
            price: 299,
            status: 'published',
          },
          {
            id: 'mock-2',
            title: 'Full Stack Web Development',
            description: 'Master modern web development with React, Next.js, and Node.js',
            price: 199,
            status: 'published',
          },
          {
            id: 'mock-3',
            title: 'Data Science Fundamentals',
            description: 'Introduction to data analysis, visualization, and machine learning',
            price: 249,
            status: 'published',
          },
        ],
      })
    }

    return NextResponse.json({ courses })
  } catch (error: any) {
    console.error('Error in courses GET:', error)
    // Return mock courses on error
    return NextResponse.json({
      courses: [
        {
          id: 'mock-1',
          title: 'AI Agent Development',
          description: 'Learn to build AI agents that work autonomously',
          price: 299,
          status: 'published',
        },
        {
          id: 'mock-2',
          title: 'Full Stack Web Development',
          description: 'Master modern web development',
          price: 199,
          status: 'published',
        },
        {
          id: 'mock-3',
          title: 'Data Science Fundamentals',
          description: 'Introduction to data analysis and machine learning',
          price: 249,
          status: 'published',
        },
      ],
    })
  }
}
