import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon, 
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CodeBracketSquareIcon,
  LockClosedIcon,
  ComputerDesktopIcon,
  BeakerIcon,
  GlobeAltIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const HomePage = () => {
  const features = [
    {
      icon: BeakerIcon,
      title: 'AI Hallucination Detection',
      description: 'World\'s first and only AI hallucination analyzer - detect when AI-generated code contains fictional APIs, libraries, or methods that don\'t exist'
    },
    {
      icon: GlobeAltIcon,
      title: 'Dual Output Formats',
      description: 'Beautiful interactive HTML reports for humans and structured JSON data for seamless IDE integration and automation workflows'
    },
    {
      icon: ShieldCheckIcon,
      title: '15 Specialized Analyzers',
      description: 'Comprehensive analysis covering security, performance, architecture, accessibility, compliance, and code quality in one platform'
    }
  ]

  const stats = [
    { label: 'Programming Languages', value: '14+' },
    { label: 'Analysis Types', value: '15' },
    { label: 'Output Formats', value: '2' },
    { label: 'Detection Accuracy', value: '99%' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-hero-pattern opacity-40" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            <div className="absolute top-16 left-[15%] w-3 h-3 bg-primary-400 rounded-full animate-ping" />
            <div className="absolute top-40 left-[25%] w-2 h-2 bg-purple-400 rounded-full animate-particle-float" />
            <div className="absolute top-24 right-[20%] w-4 h-4 bg-cyan-400 rounded-full animate-bounce" />
            <div className="absolute top-60 right-[10%] w-2 h-2 bg-pink-400 rounded-full animate-ping" />
            <div className="absolute bottom-40 left-[20%] w-1 h-1 bg-green-400 rounded-full animate-pulse" />
            <div className="absolute bottom-32 right-[60%] w-3 h-3 bg-yellow-400 rounded-full animate-bounce" />
            <div className="absolute top-32 left-[70%] w-2 h-2 bg-emerald-400 rounded-full animate-particle-float" />
            <div className="absolute bottom-48 left-[80%] w-1 h-1 bg-rose-400 rounded-full animate-ping" />
          </div>
          
          {/* Large Glowing Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary-600/30 to-purple-600/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-600/25 to-cyan-600/25 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-full blur-2xl animate-spin-slow" />
          
          {/* Rotating Conic Gradient */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-transparent via-primary-500/5 to-transparent rounded-full animate-spin" style={{ animationDuration: '20s' }} />
          
          {/* Moving Gradient Lines */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent animate-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse" />
          
          {/* Diagonal Animated Lines */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent transform rotate-12 animate-pulse" />
            <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent transform -rotate-12 animate-pulse" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            {/* Logo and Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center mb-8"
            >
                             <img 
                             src="/elyanalyzer-logo.svg"
            alt="ElyAnalyzer" 
                 className="h-20 w-20 mb-4 drop-shadow-2xl"
               />
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 rounded-full px-6 py-3">
                <SparklesIcon className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium text-green-300">
                  🌼 Accompanies you on your journey
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="gradient-text">
                ElyAnalyzer
              </span>
              <br />
              <span className="text-white">
                Complexity to Clarity
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              100% free and open-source code analysis platform featuring the world's first AI hallucination detector. 
              Transform complex codebases into clear, actionable insights with complete privacy - no cost, no subscriptions.
            </motion.p>

            {/* Unique Features Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 mb-10"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-full px-6 py-3">
                <BeakerIcon className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">
                  🌍 World's First AI Hallucination Detector
                </span>
              </div>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/20 rounded-full px-6 py-3">
                <GlobeAltIcon className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">
                  📊 Dual Output: HTML + JSON
                </span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            >
              <Link
                to="/download"
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-3 group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <span>Download Free Now</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/features"
                className="btn-secondary text-lg px-8 py-4"
              >
                View Features
              </Link>
            </motion.div>

            {/* GitHub Link */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex justify-center items-center mb-16"
            >
              <a
                href="https://github.com/Genshro/elyanalyzer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors group"
              >
                <svg className="h-6 w-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">
                  View on GitHub
                </span>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded-full border border-slate-700 group-hover:border-slate-600 transition-colors">
                  Open Source
                </span>
              </a>
            </motion.div>

            {/* Floating Code Cards */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="relative max-w-4xl mx-auto"
              >
                {/* Main Code Preview */}
                <div className="glass rounded-2xl p-8 backdrop-blur-2xl">
                  <div className="text-left">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-slate-300 text-sm ml-4">analysis-result.json</span>
                    </div>
                    <pre className="text-sm text-slate-200 overflow-x-auto">
{`{
  "issues_found": 5,
  "critical_issues": 2,
  "ai_hallucinations_detected": 1,
  "issues": [
    {
      "type": "ai_hallucination",
      "severity": "critical",
      "description": "Fictional API 'nonExistentLibrary.magicFunction()' detected",
      "suggestion": "Verify API exists in documentation"
    },
    {
      "type": "missing_auth_context",
      "severity": "high",
      "description": "Login component without AuthContext",
      "suggestion": "Create AuthContext.tsx file"
    }
  ]
}`}
                    </pre>
                  </div>
                </div>

                {/* Floating Issue Cards */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 glass rounded-xl p-4 w-64"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <BeakerIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-purple-400">AI Hallucination</p>
                      <p className="text-sm text-slate-300">Fictional API detected</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute -bottom-4 -left-4 glass rounded-xl p-4 w-64"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckCircleIcon className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-400">Smart Solution</p>
                      <p className="text-sm text-slate-300">Verify API documentation</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* World's First AI Hallucination Detection Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-full px-6 py-3 mb-6">
              <StarIcon className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                🌍 World's First Technology
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">AI Hallucination Detection</span>
            </h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              The only code analyzer in the world that can detect when AI-generated code contains fictional APIs, 
              non-existent libraries, or imaginary methods that don't actually exist.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* AI Hallucination Features */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex-shrink-0">
                  <BeakerIcon className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Fictional API Detection</h3>
                  <p className="text-slate-200">
                    Identifies when AI tools suggest APIs, methods, or libraries that don't exist in reality. 
                    Prevents hours of debugging non-existent code.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-xl flex-shrink-0">
                  <ShieldCheckIcon className="h-8 w-8 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Version Mismatch Detection</h3>
                  <p className="text-slate-200">
                    Catches when AI suggests methods or features that don't exist in your specified library versions. 
                    Ensures compatibility across your entire stack.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl flex-shrink-0">
                  <CheckCircleIcon className="h-8 w-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Smart Verification</h3>
                  <p className="text-slate-200">
                    Cross-references your code against real documentation and package registries to verify 
                    authenticity of suggested implementations.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* AI Hallucination Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass rounded-2xl p-8 backdrop-blur-2xl">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                    <BeakerIcon className="h-12 w-12 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Revolutionary Technology</h3>
                  <p className="text-slate-200 mb-6">
                    The first and only analyzer capable of detecting AI-generated fictional code, 
                    saving developers from implementing non-existent solutions.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2 text-purple-400">
                      <CheckCircleIcon className="h-5 w-5" />
                      <span className="text-sm">Detects fictional APIs</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-purple-400">
                      <CheckCircleIcon className="h-5 w-5" />
                      <span className="text-sm">Prevents wasted development time</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-purple-400">
                      <CheckCircleIcon className="h-5 w-5" />
                      <span className="text-sm">Unique in the market</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy First Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Your Code, Your Privacy</span>
            </h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              Complete privacy protection with desktop-first architecture. Your code never leaves your machine.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Privacy Features */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex-shrink-0">
                  <LockClosedIcon className="h-8 w-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Zero Data Collection</h3>
                  <p className="text-slate-200">
                    We never store, transmit, or access your source code. All analysis happens locally on your machine 
                    using our desktop application, ensuring complete confidentiality of your intellectual property.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex-shrink-0">
                  <ComputerDesktopIcon className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Desktop-First Architecture</h3>
                  <p className="text-slate-200">
                    Our analysis engine runs entirely offline on your desktop. No internet connection required for 
                    code scanning, making it perfect for secure environments and sensitive projects.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex-shrink-0">
                  <ShieldCheckIcon className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Secure by Design</h3>
                  <p className="text-slate-200">
                    Only anonymized analytics and summary statistics are shared with our web dashboard. 
                    Your actual code, file names, and project structure remain completely private.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Privacy Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass rounded-2xl p-8 backdrop-blur-2xl">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
                    <LockClosedIcon className="h-12 w-12 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">100% Local Processing</h3>
                  <p className="text-slate-200 mb-6">
                    Your code is analyzed entirely on your machine. No uploads, no cloud processing, no privacy concerns.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2 text-green-400">
                      <CheckCircleIcon className="h-5 w-5" />
                      <span className="text-sm">Source code stays local</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-400">
                      <CheckCircleIcon className="h-5 w-5" />
                      <span className="text-sm">No internet required</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-400">
                      <CheckCircleIcon className="h-5 w-5" />
                      <span className="text-sm">GDPR & HIPAA friendly</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Output Formats Section */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Dual Output Formats</span>
            </h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              Choose the perfect format for your workflow - beautiful interactive HTML reports for humans, 
              structured JSON data for machines and automation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* HTML Format */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="card p-8 hover:bg-slate-800/70 transition-all duration-300 group"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <GlobeAltIcon className="h-8 w-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    Interactive HTML Reports
                  </h3>
                  <p className="text-slate-300">Beautiful & Modern Presentation</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Interactive collapsible sections</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Color-coded severity levels</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Modern responsive design</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Perfect for stakeholder presentations</span>
                </div>
              </div>
            </motion.div>

            {/* JSON Format */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="card p-8 hover:bg-slate-800/70 transition-all duration-300 group"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <CodeBracketSquareIcon className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    Structured JSON Data
                  </h3>
                  <p className="text-slate-300">Machine-Readable & IDE-Friendly</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Drag & drop IDE integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Compatible with all major IDEs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Automated workflow integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">CI/CD pipeline ready</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Analyzers Showcase */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">15 Specialized Analyzers</span>
            </h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              Comprehensive code analysis covering every aspect of modern software development
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: "Security", icon: "🔒", color: "from-red-500/20 to-pink-500/20" },
              { name: "Code Quality", icon: "✨", color: "from-blue-500/20 to-cyan-500/20" },
              { name: "Performance", icon: "⚡", color: "from-yellow-500/20 to-orange-500/20" },
              { name: "Architecture", icon: "🏗️", color: "from-purple-500/20 to-indigo-500/20" },
              { name: "API Design", icon: "🔌", color: "from-green-500/20 to-emerald-500/20" },
              { name: "Dependencies", icon: "📦", color: "from-orange-500/20 to-red-500/20" },
              { name: "Testing", icon: "🧪", color: "from-teal-500/20 to-blue-500/20" },
              { name: "Documentation", icon: "📚", color: "from-indigo-500/20 to-purple-500/20" },
              { name: "Database", icon: "🗄️", color: "from-cyan-500/20 to-blue-500/20" },
              { name: "Error Handling", icon: "❌", color: "from-red-500/20 to-pink-500/20" },
              { name: "Logging", icon: "📝", color: "from-gray-500/20 to-slate-500/20" },
              { name: "Compliance", icon: "📋", color: "from-green-500/20 to-teal-500/20" },
              { name: "AI Hallucinations", icon: "🤖", color: "from-purple-500/20 to-pink-500/20" },
              { name: "Mobile & Cross-Platform", icon: "📱", color: "from-blue-500/20 to-indigo-500/20" },
              { name: "Accessibility", icon: "♿", color: "from-orange-500/20 to-yellow-500/20" }
            ].map((analyzer, index) => (
              <motion.div
                key={analyzer.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="card p-6 text-center hover:bg-slate-800/70 transition-all duration-300 group cursor-pointer"
              >
                <div className={`p-3 bg-gradient-to-r ${analyzer.color} rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{analyzer.icon}</span>
                </div>
                <h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                  {analyzer.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Why Choose ElyAnalyzer?</span>
            </h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              Powerful features designed for modern development teams and educational institutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card p-8 hover:bg-slate-800/70 transition-all duration-300 group cursor-pointer"
              >
                <div className="p-3 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-primary-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default HomePage 
