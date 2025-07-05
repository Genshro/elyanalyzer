import { createClient, AuthChangeEvent, Session } from '@supabase/supabase-js'

// ✅ SECURE: Environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch {
  throw new Error('❌ VITE_SUPABASE_URL must be a valid URL')
}

// Validate that we're not using hardcoded development keys in production
if (import.meta.env.PROD) {
  if (supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')) {
    console.warn('⚠️  WARNING: Using localhost Supabase URL in production build')
  }
  
  // Check for obviously test/demo keys
  if (supabaseAnonKey.length < 100) {
    console.warn('⚠️  WARNING: Supabase key seems too short for production')
  }
}

// Input validation and sanitization
export const validateAndSanitizeInput = (input: string, type: 'email' | 'name' | 'general' = 'general'): string => {
  if (!input) return ''
  
  // Remove null bytes and dangerous characters
  let sanitized = input.replace(/\0/g, '').trim()
  
  switch (type) {
    case 'email':
      // Basic email sanitization
      sanitized = sanitized.toLowerCase()
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(sanitized)) {
        throw new Error('Invalid email format')
      }
      break
      
    case 'name':
      // Allow only alphanumeric, spaces, hyphens, apostrophes
      sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-']/g, '')
      if (sanitized.length < 2 || sanitized.length > 50) {
        throw new Error('Name must be 2-50 characters long')
      }
      break
      
    case 'general':
      // Remove dangerous characters but allow most text
      sanitized = sanitized.replace(/[<>"\0]/g, '')
      break
  }
  
  return sanitized
}

// Create Supabase client with security-focused configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Security settings
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    
    // Enhanced security configuration
    flowType: 'pkce', // Use PKCE for better security
    
    // Storage configuration with validation
    storage: {
      getItem: (key: string) => {
        if (typeof window !== 'undefined') {
          const value = window.localStorage.getItem(key)
          // Basic validation of stored auth data
          if (value && key.includes('supabase.auth.token')) {
            try {
              JSON.parse(value)
              return value
            } catch {
              // Invalid JSON, remove corrupted data
              window.localStorage.removeItem(key)
              return null
            }
          }
          return value
        }
        return null
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
          try {
            // Validate JSON before storing
            if (key.includes('supabase.auth.token')) {
              JSON.parse(value)
            }
            window.localStorage.setItem(key, value)
          } catch (error) {
            console.error('Failed to store auth data:', error)
          }
        }
      },
      removeItem: (key: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key)
        }
      }
    }
  },
  
  // Global fetch options for security
  global: {
    headers: {
      'X-Client-Info': 'elyanalyzer-frontend',
      'X-Requested-With': 'XMLHttpRequest'
    },
    // Add timeout to prevent hanging requests
    fetch: (url: RequestInfo | URL, options: RequestInit = {}) => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      return fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
          'X-Client-Info': 'elyanalyzer-frontend',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).finally(() => clearTimeout(timeoutId))
    }
  },
  
  // Database connection settings
  db: {
    schema: 'public'
  },
  
  // Additional security headers
  // Note: Realtime connections are handled separately if needed
})

// Enhanced error handling for auth operations
const handleAuthError = (error: any) => {
  // Sanitize error messages to prevent information leakage
  if (error?.message) {
    const sanitizedMessage = error.message.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]')
    return { ...error, message: sanitizedMessage }
  }
  return error
}

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return !error && !!user
  } catch {
    return false
  }
}

// Helper function to get current user safely
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch {
    return null
  }
}

// Auth helper functions with development fallbacks
export const authHelpers = {
  isAdmin: async () => {
    if (import.meta.env.DEV) return false
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user?.user_metadata?.role === 'admin'
    } catch (error) {
      console.warn('Auth check failed:', error)
      return false
    }
  },

  getCurrentUserRole: async () => {
    if (import.meta.env.DEV) return 'user'
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user?.user_metadata?.role || 'user'
    } catch (error) {
      console.warn('Role check failed:', error)
      return 'user'
    }
  },
  
  signUp: async (email: string, password: string, name?: string) => {
    if (import.meta.env.DEV) {
      console.warn('Sign up attempted in development mode')
      return { data: null, error: { message: 'Development mode - no auth available' } }
    }
    
    try {
      const sanitizedEmail = validateAndSanitizeInput(email, 'email')
      const sanitizedName = name ? validateAndSanitizeInput(name, 'name') : undefined
      
      // Password strength validation
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: sanitizedName ? { name: sanitizedName } : undefined
        }
      })
      
      return { data, error: error ? handleAuthError(error) : null }
    } catch (error) {
      return { data: null, error: handleAuthError(error) }
    }
  },

  signIn: async (email: string, password: string) => {
    if (import.meta.env.DEV) {
      console.warn('Sign in attempted in development mode')
      return { data: null, error: { message: 'Development mode - no auth available' } }
    }
    
    try {
      const sanitizedEmail = validateAndSanitizeInput(email, 'email')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      })
      
      return { data, error: error ? handleAuthError(error) : null }
    } catch (error) {
      return { data: null, error: handleAuthError(error) }
    }
  },

  // GitHub OAuth giriş
  signInWithGitHub: async () => {
    if (import.meta.env.DEV) {
      console.warn('GitHub sign in attempted in development mode')
      return { data: null, error: { message: 'Development mode - no auth available' } }
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      return { data, error: error ? handleAuthError(error) : null }
    } catch (error) {
      return { data: null, error: handleAuthError(error) }
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error: error ? handleAuthError(error) : null }
    } catch (error) {
      return { error: handleAuthError(error) }
    }
  },

  getCurrentUser: () => {
    if (import.meta.env.DEV) {
      return Promise.resolve({ data: { user: null }, error: null })
    }
    
    try {
      return supabase.auth.getUser()
    } catch (error) {
      return Promise.resolve({ data: { user: null }, error })
    }
  },

  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Enhanced API helpers with input validation
export const apiHelpers = {
  // Secure API request wrapper
  secureRequest: async (endpoint: string, options: RequestInit = {}) => {
    const { data: { session } } = await supabase.auth.getSession()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(options.headers as Record<string, string>)
    }
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)
    
    try {
      const response = await fetch(endpoint, {
        ...options,
        headers,
        signal: controller.signal
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

// Development helper (only available in dev mode)
if (import.meta.env.DEV) {
  (window as any).supabaseDebug = {
    client: supabase,
    url: supabaseUrl,
    keyLength: supabaseAnonKey.length,
    isAuthenticated,
    getCurrentUser
  }
  
  console.log('🔧 Supabase debug tools available at window.supabaseDebug')
}

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

export default supabase 