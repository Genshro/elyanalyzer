import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hijremakugwwjrgugsrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpanJlbWFrdWd3d2pyZ3Vnc3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NjM5MDEsImV4cCI6MjA2NjUzOTkwMX0.vWerzW7XaAimP3Ew8PRVeH67FbyXk3RAYxJAm75PQzY'

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
  }
}

export interface AuthResponse {
  user: User | null
  error: string | null
}

export const authService = {
  async signUp(email: string, password: string, name?: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0]
          }
        }
      })

      if (error) {
        return { user: null, error: error.message }
      }

      return { user: data.user as User, error: null }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { user: null, error: error.message }
      }

      return { user: data.user as User, error: null }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  },

  // GitHub OAuth için external browser açma
  async signInWithGitHub(): Promise<AuthResponse> {
    try {
      // Tauri'de external browser açacağız
      const { invoke } = await import('@tauri-apps/api/core')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: 'http://localhost:1420/auth/callback',
          scopes: 'read:user user:email'
        }
      })

      if (error) {
        return { user: null, error: error.message }
      }

      // External browser'da OAuth URL'ini aç
      if (data.url) {
        try {
          await invoke('open_url', { url: data.url })
          return { user: null, error: 'Please complete authentication in your browser and return to the app' }
        } catch {
          // Fallback: window.open kullan
          window.open(data.url, '_blank')
          return { user: null, error: 'Please complete authentication in your browser and return to the app' }
        }
      }

      return { user: null, error: 'Failed to initiate OAuth' }
    } catch (error) {
      return { user: null, error: 'An unexpected error occurred' }
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      return { error: error?.message || null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user as User | null
    } catch (error) {
      return null
    }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user as User | null)
    })
  }
} 