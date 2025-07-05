import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Enhanced Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-[10%] w-2 h-2 bg-primary-400 rounded-full animate-ping" />
          <div className="absolute top-32 left-[20%] w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
          <div className="absolute top-20 left-[80%] w-3 h-3 bg-cyan-400 rounded-full animate-bounce" />
          <div className="absolute top-40 right-[15%] w-2 h-2 bg-pink-400 rounded-full animate-ping" />
          <div className="absolute bottom-32 left-[30%] w-1 h-1 bg-green-400 rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-[70%] w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
        </div>
        
        {/* Large Glowing Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary-600/30 to-purple-600/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-600/25 to-cyan-600/25 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-full blur-2xl animate-spin-slow" />
        
        {/* Moving Gradient Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse" />
        
        {/* Diagonal Animated Lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent transform rotate-12 animate-pulse" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent transform -rotate-12 animate-pulse" />
        </div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center mb-6"
              >
                <img 
                  src="/elyanalyzer-logo.svg"
                  alt="ElyAnalyzer" 
                  className="h-10 w-10 mr-3"
                />
                <span className="text-2xl font-bold gradient-text">ElyAnalyzer</span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-slate-300 mb-6 max-w-md"
              >
                Comprehensive code analysis platform with 15 specialized analyzers. 
                Secure, fast, and designed for modern development teams.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex space-x-4"
              >
                <a 
                  href="https://github.com/Genshro/elyanalyzer" 
                  className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub"
                >
                  <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/xahmet.cetinx/" 
                  className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                >
                  <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://x.com/ElyAnalyzer" 
                  className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter/X"
                >
                  <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="mailto:genshro@icloud.com" 
                  className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                  title="Email"
                >
                  <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </a>
              </motion.div>
            </div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-slate-300 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="text-slate-300 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/download" className="text-slate-300 hover:text-white transition-colors">
                    Download
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Contact & Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Contact & Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:genshro@icloud.com" className="text-slate-300 hover:text-white transition-colors">
                    Email Support
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Genshro/elyanalyzer" className="text-slate-300 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Genshro/elyanalyzer/issues" className="text-slate-300 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                    Report Issues
                  </a>
                </li>
                <li>
                  <span className="text-slate-300">
                    📍 Belp, Bern, Switzerland
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col md:flex-row justify-between items-center"
            >
              <p className="text-slate-400 text-sm">
                © 2024 ElyAnalyzer. All rights reserved.
              </p>
              <p className="text-slate-400 text-sm mt-2 md:mt-0">
                Made with ❤️ in Belp, Bern, Switzerland 🇨🇭
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 