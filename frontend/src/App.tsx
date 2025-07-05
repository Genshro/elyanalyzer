// ElyAnalyzer Frontend
// Developer: Ahmet Çetin
// React dashboard for code analysis

import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import { lazy, Suspense } from 'react'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const Features = lazy(() => import('./pages/Features'))
const About = lazy(() => import('./pages/About'))
const Download = lazy(() => import('./pages/Download'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p className="text-slate-300 animate-pulse">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route 
              path="/download" 
              element={
                <ProtectedRoute>
                  <Download />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Suspense>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'bg-slate-800 text-slate-100 border border-slate-700',
          }}
        />
      </div>
    </AuthProvider>
  )
}

export default App 

