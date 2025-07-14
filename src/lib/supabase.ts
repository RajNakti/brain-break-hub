import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          coins: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          coins?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          coins?: number
          created_at?: string
          updated_at?: string
        }
      }
      game_scores: {
        Row: {
          id: string
          user_id: string
          game_type: string
          score: number
          difficulty: string
          duration: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_type: string
          score: number
          difficulty: string
          duration: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_type?: string
          score?: number
          difficulty?: string
          duration?: number
          created_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          streak: number
          last_completed: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          streak?: number
          last_completed?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          streak?: number
          last_completed?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      focus_sessions: {
        Row: {
          id: string
          user_id: string
          task_name: string
          duration: number
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_name: string
          duration: number
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_name?: string
          duration?: number
          completed?: boolean
          created_at?: string
        }
      }
    }
  }
}
