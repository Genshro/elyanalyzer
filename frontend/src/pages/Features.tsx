import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon, 
  CodeBracketIcon, 
  BoltIcon, 
  SparklesIcon,
  CodeBracketSquareIcon,
  CheckCircleIcon,
  CubeTransparentIcon,
  ClipboardDocumentCheckIcon,
  BeakerIcon,
  GlobeAltIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import Footer from '../components/Footer'

const Features = () => {
  const coreFeatures = [
    {
      icon: BeakerIcon,
      title: 'World\'s First AI Hallucination Detection',
      description: 'Revolutionary technology that detects fictional APIs and non-existent code',
      details: [
        'Detects AI-generated fictional APIs and methods',
        'Identifies non-existent libraries and packages',
        'Catches version mismatches and deprecated features',
        'Prevents hours of debugging imaginary code',
        'Cross-references against real documentation',
        'Validates package registry authenticity',
        'Unique technology - no competitors have this',
        'Saves development time and prevents frustration'
      ]
    },
    {
      icon: CodeBracketIcon,
      title: 'Multi-Language Support',
      description: 'Comprehensive analysis for 14+ programming languages',
      details: [
        'JavaScript & TypeScript (React, Vue, Angular, Node.js)',
        'Go (Gin, Fiber, Echo frameworks)',
        'Python (Django, Flask, FastAPI)',
        'Java (Spring, Spring Boot)',
        'C# (.NET, ASP.NET Core)',
        'PHP (Laravel, Symfony)',
        'Ruby (Rails, Sinatra)',
        'C/C++ (System programming)',
        'Rust (Memory safety)',
        'Kotlin (Android development)',
        'Swift (iOS development)',
        'Dart (Flutter framework)',
        'SQL (Database queries)',
        'HTML/CSS (Web standards)'
      ]
    },
    {
      icon: ShieldCheckIcon,
      title: '15 Specialized Analyzers',
      description: 'Comprehensive analysis covering every aspect of software development',
      details: [
        'Security vulnerabilities and exploits',
        'Code quality and maintainability',
        'Performance bottlenecks and optimization',
        'Architecture patterns and design',
        'API design and REST compliance',
        'Database optimization and queries',
        'Dependencies and package management',
        'Testing coverage and quality',
        'Documentation completeness',
        'Logging and monitoring practices',
        'Error handling patterns',
        'Compliance (GDPR, HIPAA, PCI-DSS)',
        'Accessibility (WCAG guidelines)',
        'AI hallucination detection',
        'Mobile & cross-platform best practices'
      ]
    },
    {
      icon: GlobeAltIcon,
      title: 'Dual Output Formats',
      description: 'Beautiful interactive reports and structured data for different workflows',
      details: [
        'Interactive HTML Reports: Modern, responsive design',
        'Structured JSON Data: Machine-readable for IDE integration',
        'Drag & drop IDE compatibility',
        'Real-time interactive analysis',
        'Color-coded severity levels',
        'Collapsible sections and navigation',
        'CI/CD pipeline integration ready',
        'Export to multiple formats'
      ]
    }
  ]

  const analyzers = [
    {
      icon: BeakerIcon,
      title: 'AI Hallucination Detector',
      description: 'World\'s first AI-generated code verification system',
      features: [
        'Fictional API detection',
        'Non-existent library identification',
        'Version mismatch detection',
        'Package registry verification',
        'Documentation cross-referencing',
        'Prevents debugging imaginary code'
      ],
      color: 'purple'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Security Analyzer',
      description: 'Comprehensive security vulnerability detection',
      features: [
        'SQL injection detection',
        'XSS vulnerability scanning',
        'Authentication bypass detection',
        'Insecure cryptography usage',
        'Hardcoded secrets detection',
        'OWASP Top 10 compliance'
      ],
      color: 'red'
    },
    {
      icon: SparklesIcon,
      title: 'Code Quality',
      description: 'Maintainability and code standards analysis',
      features: [
        'Cyclomatic complexity analysis',
        'Code duplication detection',
        'Naming convention validation',
        'Comment quality assessment',
        'Refactoring opportunities',
        'Design pattern recognition'
      ],
      color: 'blue'
    },
    {
      icon: BoltIcon,
      title: 'Performance',
      description: 'Performance bottlenecks and optimization opportunities',
      features: [
        'Memory leak detection',
        'Slow query identification',
        'Caching strategy analysis',
        'Resource usage optimization',
        'Algorithm efficiency review',
        'Database performance tuning'
      ],
      color: 'yellow'
    },
    {
      icon: CubeTransparentIcon,
      title: 'Architecture',
      description: 'Software architecture and design patterns',
      features: [
        'SOLID principles compliance',
        'Design pattern implementation',
        'Dependency injection analysis',
        'Microservices architecture review',
        'Separation of concerns validation',
        'Architectural debt detection'
      ],
      color: 'purple'
    },
    {
      icon: CodeBracketSquareIcon,
      title: 'API Design',
      description: 'RESTful API and endpoint analysis',
      features: [
        'REST API compliance',
        'HTTP status code usage',
        'API versioning strategies',
        'Request/response validation',
        'Rate limiting implementation',
        'API documentation quality'
      ],
      color: 'green'
    },
    {
      icon: ClipboardDocumentCheckIcon,
      title: 'Testing',
      description: 'Test coverage and quality assessment',
      features: [
        'Unit test coverage analysis',
        'Integration test validation',
        'Test quality assessment',
        'Mocking strategy review',
        'CI/CD pipeline analysis',
        'Test isolation verification'
      ],
      color: 'cyan'
    }
  ]

  return (
    <div className="pt-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-full px-6 py-3 mb-6">
            <StarIcon className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">
              🌍 World's First AI Hallucination Detection
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Complete Feature Overview</span>
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
            Discover all the powerful features that make ElyAnalyzer the most comprehensive 
            privacy-first code analysis platform with revolutionary AI hallucination detection.
          </p>
        </motion.div>

        {/* Core Features */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            <span className="gradient-text">Core Capabilities</span>
          </motion.h2>
          
          <div className="space-y-12">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card p-8"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/3">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-xl mr-4">
                        <feature.icon className="h-8 w-8 text-primary-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {feature.title}
                        </h3>
                        <p className="text-slate-300 mt-2">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-2/3">
                    <div className="grid md:grid-cols-2 gap-3">
                      {feature.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center space-x-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                          <span className="text-slate-200 text-sm">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Analyzers Grid */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            <span className="gradient-text">15 Specialized Analyzers</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {analyzers.map((analyzer, index) => (
              <motion.div
                key={analyzer.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 hover:bg-slate-800/70 transition-all duration-300 group"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 bg-gradient-to-r ${
                    analyzer.color === 'red' ? 'from-red-500/20 to-pink-500/20' :
                    analyzer.color === 'blue' ? 'from-blue-500/20 to-cyan-500/20' :
                    analyzer.color === 'yellow' ? 'from-yellow-500/20 to-orange-500/20' :
                    analyzer.color === 'purple' ? 'from-purple-500/20 to-pink-500/20' :
                    analyzer.color === 'green' ? 'from-green-500/20 to-emerald-500/20' :
                    'from-cyan-500/20 to-blue-500/20'
                  } rounded-xl mr-4 group-hover:scale-110 transition-transform`}>
                    <analyzer.icon className={`h-6 w-6 ${
                      analyzer.color === 'red' ? 'text-red-400' :
                      analyzer.color === 'blue' ? 'text-blue-400' :
                      analyzer.color === 'yellow' ? 'text-yellow-400' :
                      analyzer.color === 'purple' ? 'text-purple-400' :
                      analyzer.color === 'green' ? 'text-green-400' :
                      'text-cyan-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                      {analyzer.title}
                    </h3>
                    <p className="text-slate-300 text-sm">{analyzer.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {analyzer.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-slate-200 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Output Formats Showcase */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            <span className="gradient-text">Dual Output Formats</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-8 hover:bg-slate-800/70 transition-all duration-300 group"
            >
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                  <GlobeAltIcon className="h-8 w-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    Interactive HTML Reports
                  </h3>
                  <p className="text-slate-300">Beautiful & Professional Presentation</p>
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
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Shareable web-based reports</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-8 hover:bg-slate-800/70 transition-all duration-300 group"
            >
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl mr-4 group-hover:scale-110 transition-transform">
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
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">API integration support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">
              <span className="gradient-text">Privacy & Security First</span>
            </h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              Your code never leaves your machine. Complete privacy protection with desktop-first architecture.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Zero Data Collection</h3>
              <p className="text-slate-200">Your source code is never transmitted, stored, or accessed by our servers.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Offline Processing</h3>
              <p className="text-slate-200">All analysis happens locally on your machine, no internet required.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="card p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Compliance Ready</h3>
              <p className="text-slate-200">GDPR, HIPAA, and enterprise security standards compliant.</p>
            </motion.div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  )
}

export default Features 