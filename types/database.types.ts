export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'student'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role: 'admin' | 'student'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'student'
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          status: 'draft' | 'published'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          status?: 'draft' | 'published'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          status?: 'draft' | 'published'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          course_id: string
          status: 'pending' | 'approved' | 'rejected'
          message: string | null
          created_at: string
          updated_at: string
          reviewed_by: string | null
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          status?: 'pending' | 'approved' | 'rejected'
          message?: string | null
          created_at?: string
          updated_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          message?: string | null
          created_at?: string
          updated_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          payment_status: 'pending' | 'paid' | 'failed'
          payment_id: string | null
          enrolled_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          payment_status?: 'pending' | 'paid' | 'failed'
          payment_id?: string | null
          enrolled_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          payment_status?: 'pending' | 'paid' | 'failed'
          payment_id?: string | null
          enrolled_at?: string
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          content: string | null
          lesson_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          content?: string | null
          lesson_order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          content?: string | null
          lesson_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          course_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          course_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          course_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'student'
      application_status: 'pending' | 'approved' | 'rejected'
      payment_status: 'pending' | 'paid' | 'failed'
      course_status: 'draft' | 'published'
    }
  }
}

