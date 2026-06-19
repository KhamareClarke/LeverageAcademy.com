import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch (error: any) {
    console.error('Error in courses GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
