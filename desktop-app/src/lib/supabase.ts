// Hybrid Desktop App - Online/Offline Mode Support
// ElyAnalyzer Desktop works both online and offline

export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

// Local storage key for offline user
const OFFLINE_USER_KEY = 'elyanalyzer-offline-user'

// Environment variables with fallbacks
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if we're in online mode (real Supabase credentials available)
const isOnlineMode = () => {
  return SUPABASE_URL !== 'https://placeholder.supabase.co' && 
         SUPABASE_ANON_KEY !== 'placeholder-key' &&
         navigator.onLine
}

// Real Supabase client for online mode
let realSupabaseClient: any = null

// Initialize real Supabase client if online
if (isOnlineMode()) {
  try {
    // Dynamic import for Supabase (only if online)
    import('@supabase/supabase-js').then(({ createClient }) => {
      realSupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    })
  } catch (error) {
    console.warn('Could not initialize Supabase client, falling back to offline mode')
  }
}

// Mock Supabase client for offline use
const mockSupabaseClient = {
  auth: {
    getUser: async () => {
      const storedUser = localStorage.getItem(OFFLINE_USER_KEY)
      const user = storedUser ? JSON.parse(storedUser) : null
      return { data: { user }, error: null }
    },
    
    signInWithPassword: async ({ email }: { email: string, password: string }) => {
      // Offline mode - create mock user (no real validation)
      const user: User = {
        id: 'offline-user-' + Date.now(),
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString()
      }
      
      localStorage.setItem(OFFLINE_USER_KEY, JSON.stringify(user))
      
      return { data: { user }, error: null }
    },
    
    signUp: async ({ email, options }: any) => {
      // Offline mode - create mock user
      const user: User = {
        id: 'offline-user-' + Date.now(),
        email,
        name: options?.data?.name || email.split('@')[0],
        created_at: new Date().toISOString()
      }
      
      localStorage.setItem(OFFLINE_USER_KEY, JSON.stringify(user))
      
      return { data: { user }, error: null }
    },
    
    signOut: async () => {
      localStorage.removeItem(OFFLINE_USER_KEY)
      localStorage.removeItem('elyanalyzer-desktop-preferences')
      localStorage.removeItem('elyanalyzer-desktop-cache')
      localStorage.removeItem('elyanalyzer-analysis-cache')
      localStorage.removeItem('elyanalyzer-offline-data')
      return { error: null }
    }
  },
  
  // Mock database operations for offline use
  from: (_table: string) => {
    // Create a chainable query builder
    const createChainableQuery = (initialData: any[] = []) => {
      return {
        data: initialData,
        error: null,
        eq: (_column: string, _value: any) => createChainableQuery(initialData),
        order: (_column: string) => createChainableQuery(initialData),
        limit: (_count: number) => createChainableQuery(initialData),
        select: (_columns?: string) => createChainableQuery(initialData),
        single: () => ({
          data: initialData.length > 0 ? initialData[0] : null,
          error: null
        })
      }
    }
    
    return {
      select: (_columns?: string) => createChainableQuery([]),
      
      insert: (data: any) => {
        const newData = { ...data, id: Date.now(), created_at: new Date().toISOString() };
        return {
          data: [newData],
          error: null,
          select: (_columns?: string) => createChainableQuery([newData])
        }
      },
      
      update: (data: any) => ({
        data: [data],
        error: null,
        eq: (_column: string, _value: any) => ({ data: [data], error: null })
      }),
      
      delete: () => ({
        data: [],
        error: null,
        eq: (_column: string, _value: any) => ({ data: [], error: null })
      })
    }
  }
}

// Hybrid Supabase client - switches between real and mock based on online status
export const supabase = new Proxy({} as any, {
  get: (_target, prop) => {
    if (isOnlineMode() && realSupabaseClient) {
      return realSupabaseClient[prop]
    }
    return mockSupabaseClient[prop as keyof typeof mockSupabaseClient]
  }
})

// Offline helper functions
export const isAuthenticated = async (): Promise<boolean> => {
  if (isOnlineMode() && realSupabaseClient) {
    const { data: { user } } = await realSupabaseClient.auth.getUser()
    return !!user
  }
  const storedUser = localStorage.getItem(OFFLINE_USER_KEY)
  return !!storedUser
}

export const getCurrentUser = async () => {
  if (isOnlineMode() && realSupabaseClient) {
    const { data: { user } } = await realSupabaseClient.auth.getUser()
    return user
  }
  const storedUser = localStorage.getItem(OFFLINE_USER_KEY)
  return storedUser ? JSON.parse(storedUser) : null
}

export const signOut = async () => {
  if (isOnlineMode() && realSupabaseClient) {
    await realSupabaseClient.auth.signOut()
  }
  localStorage.removeItem(OFFLINE_USER_KEY)
  localStorage.removeItem('elyanalyzer-desktop-preferences')
  localStorage.removeItem('elyanalyzer-desktop-cache')
  localStorage.removeItem('elyanalyzer-analysis-cache')
  localStorage.removeItem('elyanalyzer-offline-data')
  return { success: true }
}

// Hybrid auth helpers
export const authHelpers = {
  isAdmin: async () => false, // No admin in desktop app
  getCurrentUserRole: async () => 'user',
  
  signUp: async (email: string, password: string, name: string) => {
    if (isOnlineMode() && realSupabaseClient) {
      return realSupabaseClient.auth.signUp({ 
        email, 
        password, 
        options: { data: { name } } 
      })
    }
    return mockSupabaseClient.auth.signUp({ email, options: { data: { name } } })
  },

  signIn: async (email: string, password: string) => {
    if (isOnlineMode() && realSupabaseClient) {
      return realSupabaseClient.auth.signInWithPassword({ email, password })
    }
    return mockSupabaseClient.auth.signInWithPassword({ email, password })
  },
  
  signInWithGitHub: async () => {
    if (isOnlineMode() && realSupabaseClient) {
      return realSupabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin }
      })
    }
    return { data: null, error: { message: 'OAuth not supported in offline mode' } }
  },

  getCurrentUser: () => supabase.auth.getUser(),
  signOut: () => signOut()
}

// Desktop app utilities
export const desktopUtils = {
  isDesktop: () => window && (window as any).__TAURI__,
  getAppVersion: () => '1.0.1',
  handleError: (error: any) => console.error('Desktop app error:', error),
  isOffline: () => !isOnlineMode(),
  isOnline: () => isOnlineMode()
}

export const authService = authHelpers

// Development helper
if (import.meta.env.MODE === 'development') {
  (window as any).supabaseDesktopDebug = {
    client: supabase,
    isOffline: !isOnlineMode(),
    isOnline: isOnlineMode(),
    isAuthenticated,
    getCurrentUser,
    authHelpers,
    authService,
    desktopUtils
  }
  console.log(`🔧 ${isOnlineMode() ? 'Online' : 'Offline'} Desktop Supabase debug tools available`)
} 
