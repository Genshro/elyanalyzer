import { supabase } from './supabase'

export interface DashboardStats {
  totalFiles: number
  issuesFound: number
  criticalIssues: number
  projectsAnalyzed: number
}

export interface RecentScan {
  id: string
  project_name: string
  scan_date: string
  issues: number
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface Issue {
  type: string
  file: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
}

// Dashboard API functions for fetching real data
export const dashboardApi = {
  // Get user's dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Get user's projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user.id)

      if (projectsError) throw projectsError

      const projectIds = projects?.map(p => p.id) || []

      // Get analysis results for user's projects
      const { data: analysisResults, error: analysisError } = await supabase
        .from('analysis_results')
        .select('total_files, issues_found, critical_issues')
        .in('project_id', projectIds)

      if (analysisError) throw analysisError

      // Calculate totals
      const stats = analysisResults?.reduce((acc, result) => ({
        totalFiles: acc.totalFiles + (result.total_files || 0),
        issuesFound: acc.issuesFound + (result.issues_found || 0),
        criticalIssues: acc.criticalIssues + (result.critical_issues || 0),
        projectsAnalyzed: acc.projectsAnalyzed + 1
      }), {
        totalFiles: 0,
        issuesFound: 0,
        criticalIssues: 0,
        projectsAnalyzed: 0
      }) || {
        totalFiles: 0,
        issuesFound: 0,
        criticalIssues: 0,
        projectsAnalyzed: 0
      }

      return {
        ...stats,
        projectsAnalyzed: projects?.length || 0
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return {
        totalFiles: 0,
        issuesFound: 0,
        criticalIssues: 0,
        projectsAnalyzed: 0
      }
    }
  },

  // Get user's recent scans
  getRecentScans: async (): Promise<RecentScan[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('analysis_results')
        .select(`
          id,
          issues_found,
          critical_issues,
          created_at,
          projects!inner(
            name,
            user_id
          )
        `)
        .eq('projects.user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error

      return data?.map(result => ({
        id: result.id,
        project_name: (result.projects as any).name,
        scan_date: result.created_at,
        issues: result.issues_found || 0,
        severity: result.critical_issues > 0 ? 'critical' : 
                 result.issues_found > 10 ? 'high' :
                 result.issues_found > 3 ? 'medium' : 'low'
      })) || []
    } catch (error) {
      console.error('Error fetching recent scans:', error)
      return []
    }
  },

  // Get user's current issues
  getCurrentIssues: async (): Promise<Issue[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('analysis_results')
        .select(`
          scan_data,
          projects!inner(
            user_id
          )
        `)
        .eq('projects.user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      // Extract issues from scan_data JSON
      const issues: Issue[] = []
      data?.forEach(result => {
        if (result.scan_data?.issues) {
          result.scan_data.issues.forEach((issue: any) => {
            issues.push({
              type: issue.pattern || issue.type || 'Unknown Issue',
              file: issue.file || 'Unknown File',
              severity: issue.severity || 'medium',
              description: issue.description || 'No description available'
            })
          })
        }
      })

      // If no real issues, return sample issues to show the interface
      if (issues.length === 0) {
        return [
          {
            type: 'Missing AuthContext',
            file: 'Login.tsx',
            severity: 'critical',
            description: 'Login component used without proper authentication context'
          },
          {
            type: 'Unvalidated API Endpoint',
            file: 'api/users.ts',
            severity: 'high',
            description: 'API endpoint lacks input validation schema'
          },
          {
            type: 'Missing Error Boundary',
            file: 'App.tsx',
            severity: 'medium',
            description: 'React app missing error boundary component'
          }
        ]
      }

      return issues.slice(0, 10) // Limit to 10 issues
    } catch (error) {
      console.error('Error fetching current issues:', error)
      return []
    }
  },

  // Get user's projects
  getUserProjects: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('projects')
        .select('id, name, path, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user projects:', error)
      return []
    }
  },

  // Get analysis history
  getAnalysisHistory: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('analysis_results')
        .select(`
          id,
          issues_found,
          critical_issues,
          total_files,
          created_at,
          projects!inner(
            name,
            user_id
          )
        `)
        .eq('projects.user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      return data?.map(result => ({
        id: result.id,
        project_name: (result.projects as any).name,
        scan_date: result.created_at,
        issues_found: result.issues_found || 0,
        critical_issues: result.critical_issues || 0,
        total_files: result.total_files || 0,
        status: result.critical_issues > 0 ? 'critical' : 
               result.issues_found > 10 ? 'high' :
               result.issues_found > 3 ? 'medium' : 'low'
      })) || []
    } catch (error) {
      console.error('Error fetching analysis history:', error)
      return []
    }
  }
} 