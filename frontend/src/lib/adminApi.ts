import { supabase, authHelpers } from './supabase'

// Admin API functions for fetching system data
export const adminApi = {
  // Get all users count
  getUserStats: async () => {
    try {
      // Check if user is authenticated and is admin
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      const isAdmin = await authHelpers.isAdmin()
      if (!isAdmin) {
        throw new Error('Access denied: Admin privileges required')
      }

      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      return { totalUsers: count || 0 }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      throw error
    }
  },

  // Get all projects count
  getProjectStats: async () => {
    try {
      // Check if user is authenticated and is admin
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      const isAdmin = await authHelpers.isAdmin()
      if (!isAdmin) {
        throw new Error('Access denied: Admin privileges required')
      }

      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      return { totalProjects: count || 0 }
    } catch (error) {
      console.error('Error fetching project stats:', error)
      throw error
    }
  },

  // Get analysis results stats
  getAnalysisStats: async () => {
    try {
      // Check if user is authenticated and is admin
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      const isAdmin = await authHelpers.isAdmin()
      if (!isAdmin) {
        throw new Error('Access denied: Admin privileges required')
      }

      // Total scans
      const { count: totalScans } = await supabase
        .from('analysis_results')
        .select('*', { count: 'exact', head: true })

      // Scans today
      const today = new Date().toISOString().split('T')[0]
      const { count: scansToday } = await supabase
        .from('analysis_results')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)

      // Critical issues
      const { data: criticalIssues } = await supabase
        .from('analysis_results')
        .select('critical_issues')
        .gt('critical_issues', 0)

      const totalCritical = criticalIssues?.reduce((sum, result) => sum + result.critical_issues, 0) || 0

      return {
        totalScans: totalScans || 0,
        scansToday: scansToday || 0,
        criticalIssues: totalCritical
      }
    } catch (error) {
      console.error('Error fetching analysis stats:', error)
      throw error
    }
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      // Check if user is authenticated and is admin
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      const isAdmin = await authHelpers.isAdmin()
      if (!isAdmin) {
        throw new Error('Access denied: Admin privileges required')
      }

      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, created_at')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Get recent system activity
  getSystemActivity: async () => {
    try {
      // Check if user is authenticated and is admin
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      const isAdmin = await authHelpers.isAdmin()
      if (!isAdmin) {
        throw new Error('Access denied: Admin privileges required')
      }

      // Get recent user registrations
      const { data: newUsers } = await supabase
        .from('users')
        .select('email, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      // Get recent analysis results
      const { data: recentScans } = await supabase
        .from('analysis_results')
        .select('id, created_at, issues_found, critical_issues')
        .order('created_at', { ascending: false })
        .limit(5)

      const activity: Array<{
        action: string
        user: string
        time: string
        type: 'success' | 'warning' | 'info'
      }> = []

      // Add user registrations to activity
      newUsers?.forEach(user => {
        activity.push({
          action: 'User account created',
          user: user.email,
          time: formatTimeAgo(user.created_at),
          type: 'success'
        })
      })

      // Add scan results to activity
      recentScans?.forEach(scan => {
        activity.push({
          action: scan.critical_issues > 0 ? 'Critical issues detected' : 'Analysis completed',
          user: 'system',
          time: formatTimeAgo(scan.created_at),
          type: scan.critical_issues > 0 ? 'warning' : 'info'
        })
      })

      // Sort by time and return latest 10
      return activity
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 10)

    } catch (error) {
      console.error('Error fetching system activity:', error)
      throw error
    }
  }
}

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} hours ago`
  } else {
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }
} 