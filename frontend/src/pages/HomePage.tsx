import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon, 
  CodeBracketIcon, 
  BoltIcon, 
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  CodeBracketSquareIcon,
  LockClosedIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const features = [
    {
      icon: CodeBracketIcon,
      title: 'Multi-Language Support',
      description: 'Comprehensive analysis for 12+ programming languages including TypeScript, Go, Python, Java, C#, and more'
    },
    {
      icon: BoltIcon,
      title: 'Dual Output Formats',
      description: 'Generate professional PDF reports for stakeholders and structured JSON data for IDE integration'
    },
    {
      icon: ShieldCheckIcon,
      title: '15 Specialized Analyzers',
      description: 'Security, performance, architecture, accessibility, compliance, and code quality analysis in one platform'
    }
  ]

  const stats = [
    { label: 'Programming Languages', value: '12+' },
    { label: 'Analysis Types', value: '15' },
    { label: 'Output Formats', value: '2' },
    { label: 'Detection Accuracy', value: '99%' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-hero-pattern" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-transparent via-primary-500/5 to-transparent rounded-full animate-spin" style={{ animationDuration: '20s' }} />
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
              100% free and open-source code analysis platform that transforms complex codebases into clear, actionable insights. 
              Detect security vulnerabilities, code quality issues, and architectural problems with complete privacy - no cost, no subscriptions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
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
  "issues": [
    {
      "type": "missing_auth_context",
      "severity": "high",
      "description": "Login component without AuthContext",
      "suggestion": "Create AuthContext.tsx file"
    },
    {
      "type": "api_no_schema", 
      "severity": "medium",
      "description": "API endpoints without validation",
      "suggestion": "Add schema validation"
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
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <ShieldCheckIcon className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-red-400">High Priority</p>
                      <p className="text-sm text-slate-300">Missing AuthContext</p>
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
                      <p className="font-semibold text-green-400">Suggestion</p>
                      <p className="text-sm text-slate-300">Create schema validation</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
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
              Choose the perfect format for your workflow - comprehensive reports for humans, structured data for machines
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* PDF Format */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="card p-8 hover:bg-slate-800/70 transition-all duration-300 group"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <DocumentTextIcon className="h-8 w-8 text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                    PDF Reports
                  </h3>
                  <p className="text-slate-300">Professional Documentation</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Executive summaries with visual charts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Detailed issue descriptions with code snippets</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Actionable recommendations for developers</span>
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
                    JSON Data
                  </h3>
                  <p className="text-slate-300">Machine-Readable Format</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Structured data for IDE integrations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Compatible with AI-powered development tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Automated workflow integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">CI/CD pipeline compatibility</span>
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



      
    </div>
  )
}

export default HomePage 
