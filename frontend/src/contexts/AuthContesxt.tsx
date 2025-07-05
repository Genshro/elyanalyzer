import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

// Cache session in sessionStorage for faster initial load
const CACHE_KEY = 'elyanalyzer_session_cache'
const CACHE_EXPIRY = 2 * 60 * 60 * 1000 // 2 hours

const getCachedSession = (): Session | null => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      const { session, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return session
      }
    }
  } catch (error) {
    console.warn('Failed to get cached session:', error)
  }
  return null
}

const setCachedSession = (session: Session | null) => {
  try {
    if (session) {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        session,
        timestamp: Date.now()
      }))
    } else {
      sessionStorage.removeItem(CACHE_KEY)
    }
  } catch (error) {
    console.warn('Failed to cache session:', error)
  }
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize with cached session if available
  useEffect(() => {
    const cachedSession = getCachedSession()
    if (cachedSession) {
      setSession(cachedSession)
      setUser(cachedSession.user)
      setLoading(false)
      
      // Verify cached session in background
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        if (!currentSession || currentSession.access_token !== cachedSession.access_token) {
          // Cache is stale, update
          setSession(currentSession)
          setUser(currentSession?.user ?? null)
          setCachedSession(currentSession)
        }
      })
    } else {
      // No cache, get session normally
      getInitialSession()
    }
  }, [])

  const getInitialSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      }
      setSession(session)
      setUser(session?.user ?? null)
      setCachedSession(session)
    } catch (error) {
      console.error('Failed to get initial session:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        setSession(session)
        setUser(session?.user ?? null)
        setCachedSession(session)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setCachedSession(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }, [])

  const value = {
    user,
    session,
    loading,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 
