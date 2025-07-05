import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  DocumentTextIcon, 
  ClockIcon,
  FolderIcon,
  BugAntIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'
import { supabase, authHelpers } from '../lib/supabase'
import { adminApi } from '../lib/adminApi'
import { dashboardApi } from '../lib/dashboardApi'
import CategoryDashboard from '../components/CategoryDashboard'
import FutureFeatures from '../components/FutureFeatures'
import BuyMeCoffeeQR from '../components/BuyMeCoffeeQR'
import Footer from '../components/Footer'

const Dashboard = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState('categories')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [, setDashboardData] = useState<any>(null)
  const [realTimeStats, setRealTimeStats] = useState({
    totalFiles: 0,
    issuesFound: 0,
    criticalIssues: 0,
    projectsAnalyzed: 0
  })
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    scansToday: 0,
    systemCritical: 0
  })

  // Load real dashboard data
  const loadDashboardData = async () => {
    try {
      const [stats, recentScans, currentIssues, analysisHistory] = await Promise.all([
        dashboardApi.getDashboardStats(),
        dashboardApi.getRecentScans(),
        dashboardApi.getCurrentIssues(),
        dashboardApi.getAnalysisHistory()
      ])

      setRealTimeStats(stats)
      setDashboardData({
        recentScans,
        issues: currentIssues,
        analysisHistory
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const loadAdminStats = async () => {
    try {
      const [userStats, projectStats, analysisStats] = await Promise.all([
        adminApi.getUserStats(),
        adminApi.getProjectStats(),
        adminApi.getAnalysisStats()
      ])

      setAdminStats({
        totalUsers: userStats.totalUsers,
        activeProjects: projectStats.totalProjects,
        scansToday: analysisStats.scansToday,
        systemCritical: analysisStats.criticalIssues
      })
    } catch (error) {
      console.error('Error loading admin stats:', error)
      // If user is not admin or authentication fails, set default values
      setAdminStats({
        totalUsers: 0,
        activeProjects: 0,
        scansToday: 0,
        systemCritical: 0
      })
      // Don't show admin features if access is denied
      if (error instanceof Error && error.message.includes('Access denied')) {
        setIsAdmin(false)
      }
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          navigate('/login')
          return
        }
        
        setUser(session.user)
        
        // Check if user is admin
        const adminStatus = await authHelpers.isAdmin()
        setIsAdmin(adminStatus)
        
        // Load admin stats if admin
        if (adminStatus) {
          await loadAdminStats()
        }
      } catch (error) {
        console.error('Auth check error:', error)
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    const initializeDashboard = async () => {
      await checkAuth()
      await loadDashboardData()
    }

    initializeDashboard()
  }, [navigate])

  if (loading) {
    return (
      <div className="pt-32 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }
  
  const stats = [
    {
      label: 'Total Files Scanned',
      value: realTimeStats.totalFiles,
      icon: DocumentTextIcon,
      color: 'blue'
    },
    {
      label: 'Issues Found',
      value: realTimeStats.issuesFound,
      icon: BugAntIcon,
      color: 'red'
    },
    {
      label: 'Critical Issues',
      value: realTimeStats.criticalIssues,
      icon: ExclamationTriangleIcon,
      color: 'yellow'
    },
    {
      label: 'Projects Analyzed',
      value: realTimeStats.projectsAnalyzed,
      icon: FolderIcon,
      color: 'green'
    }
  ]

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('tr-TR', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   })
  // }

  return (
    <div className="pt-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <img 
                            src="/elyanalyzer-logo.svg"
            alt="ElyAnalyzer" 
                className="h-12 w-12 drop-shadow-lg"
              />
              <h1 className="text-4xl font-bold gradient-text">
                Welcome back{user ? `, ${user.user_metadata?.name || user.email}` : ''}!
              </h1>
              {isAdmin && (
                <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-full">
                  ADMIN
                </span>
              )}
            </div>
            <Link 
              to="/download"
              className="btn-primary flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Download App</span>
            </Link>
          </div>
          <p className="text-slate-200">Monitor your code analysis reports and insights</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${stat.color}-500/10 mr-4`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg mb-8">
          {[
            { id: 'categories', label: 'Category Analysis', icon: ChartBarIcon },
            { id: 'futures', label: 'Future Features', icon: RocketLaunchIcon },
            ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: FolderIcon }] : [])
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'categories' && (
            <div className="bg-slate-900/50 rounded-lg p-1">
              <CategoryDashboard 
                projectId="demo-project-1" 
                userId={user?.id || 'demo-user'} 
              />
            </div>
          )}

          {selectedTab === 'futures' && (
            <div className="bg-slate-900/50 rounded-lg p-6">
              <FutureFeatures />
            </div>
          )}

          {selectedTab === 'admin' && isAdmin && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Admin Stats */}
              <div className="card p-6">
                <div className="flex items-center mb-6">
                  <ShieldCheckIcon className="h-5 w-5 text-purple-400 mr-2" />
                  <h3 className="text-xl font-semibold text-slate-100">System Overview</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/30 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-slate-100">{adminStats.totalUsers}</p>
                  </div>
                  <div className="bg-slate-800/30 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm">Active Projects</p>
                    <p className="text-2xl font-bold text-slate-100">{adminStats.activeProjects}</p>
                  </div>
                  <div className="bg-slate-800/30 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm">Scans Today</p>
                    <p className="text-2xl font-bold text-slate-100">{adminStats.scansToday}</p>
                  </div>
                  <div className="bg-slate-800/30 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm">Critical Issues</p>
                    <p className="text-2xl font-bold text-red-400">{adminStats.systemCritical}</p>
                  </div>
                </div>
              </div>

              {/* Admin Activity Log */}
              <div className="card p-6">
                <div className="flex items-center mb-6">
                  <ClockIcon className="h-5 w-5 text-green-400 mr-2" />
                  <h3 className="text-xl font-semibold text-slate-100">Admin Activity Log</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { action: 'New analysis completed', user: 'scanner', time: '2 hours ago', type: 'success' },
                    { action: 'Analysis data processed', user: 'scanner', time: '4 hours ago', type: 'info' },
                    { action: 'Critical issue detected', user: 'scanner', time: '6 hours ago', type: 'warning' },
                    { action: 'System maintenance', user: 'admin', time: '1 day ago', type: 'success' }
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          log.type === 'success' ? 'bg-green-500' : 
                          log.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-slate-100">{log.action}</p>
                          <p className="text-sm text-slate-400">{log.user}</p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-400">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
          </div>

          {/* Sidebar with Buy Me a Coffee */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <BuyMeCoffeeQR />
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Dashboard 
