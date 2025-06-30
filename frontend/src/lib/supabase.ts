import { createClient } from '@supabase/supabase-js'

// Supabase project configuration
const supabaseUrl = 'https://hijremakugwwjrgugsrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpanJlbWFrdWd3d2pyZ3Vnc3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NjM5MDEsImV4cCI6MjA2NjUzOTkwMX0.vWerzW7XaAimP3Ew8PRVeH67FbyXk3RAYxJAm75PQzY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for our database
export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  path: string
  created_at: string
}

export interface AnalysisResult {
  id: string
  project_id: string
  issues_found: number
  critical_issues: number
  scan_data: any
  created_at: string
}

// Auth helper functions
export const authHelpers = {
  isAdmin: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user?.user_metadata?.role === 'admin'
  },

  getCurrentUserRole: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user?.user_metadata?.role || 'user'
  },
  
  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // GitHub OAuth giriş
  signInWithGitHub: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        scopes: 'read:user user:email'
      }
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: () => {
    return supabase.auth.getUser()
  }
} 