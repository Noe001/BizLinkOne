// Supabaseデータベースの型定義
// 実際のSupabaseプロジェクトから自動生成することも可能:
// npx supabase gen types typescript --project-id your-project-id > client/src/types/supabase.ts

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
          username: string
          password: string
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          password: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          password?: string
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          user_name: string
          content: string
          channel_id: string | null
          channel_type: string
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          user_name: string
          content: string
          channel_id?: string | null
          channel_type: string
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_name?: string
          content?: string
          channel_id?: string | null
          channel_type?: string
          timestamp?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: string
          priority: string
          assignee_id: string | null
          assignee_name: string | null
          due_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status: string
          priority: string
          assignee_id?: string | null
          assignee_name?: string | null
          due_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          assignee_id?: string | null
          assignee_name?: string | null
          due_date?: string | null
          created_at?: string
        }
      }
      knowledge_articles: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string | null
          tags: string[]
          author_id: string
          author_name: string
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt?: string | null
          tags?: string[]
          author_id: string
          author_name: string
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string | null
          tags?: string[]
          author_id?: string
          author_name?: string
          views?: number
          created_at?: string
          updated_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          status: string
          participants: Array<{ id: string; name: string }>
          meeting_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          status: string
          participants?: Array<{ id: string; name: string }>
          meeting_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          status?: string
          participants?: Array<{ id: string; name: string }>
          meeting_url?: string | null
          created_at?: string
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
      [_ in never]: never
    }
  }
}
