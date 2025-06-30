import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon, 
  CodeBracketIcon, 
  BoltIcon, 
  SparklesIcon,
  CodeBracketSquareIcon,
  CheckCircleIcon,
  CubeTransparentIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline'

const Features = () => {
  const coreFeatures = [
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
      icon: BoltIcon,
      title: 'Dual Output Formats',
      description: 'Professional reports and structured data for different use cases',
      details: [
        'PDF Reports: Executive summaries with visual charts',
        'JSON Data: Machine-readable for IDE integration',
        'HTML Reports: Interactive web-based analysis',
        'Real-time WebSocket updates',
        'Customizable report templates',
        'Export to multiple formats'
      ]
    }
  ]

  const analyzers = [
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Complete Feature Overview</span>
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
            Discover all the powerful features that make ElyAnalyzer the most comprehensive 
            privacy-first code analysis platform for modern development teams.
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
                        <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                        <p className="text-slate-300">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-2/3">
                    <div className="grid md:grid-cols-2 gap-3">
                      {feature.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-start gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                          <span className="text-sm text-slate-200">{detail}</span>
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
                <div className={`p-3 bg-${analyzer.color}-500/10 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <analyzer.icon className={`h-6 w-6 text-${analyzer.color}-400`} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary-400 transition-colors">
                  {analyzer.title}
                </h3>
                <p className="text-slate-300 text-sm mb-4">{analyzer.description}</p>
                <div className="space-y-2">
                  {analyzer.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 bg-${analyzer.color}-400 rounded-full mt-2 flex-shrink-0`} />
                      <span className="text-xs text-slate-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>





        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-16"
        >
          <div className="card p-12 bg-gradient-to-br from-primary-500/10 to-purple-500/10 border-primary-500/20">
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              Ready to Transform Your Code Analysis?
            </h2>
            <p className="text-slate-200 mb-8 max-w-2xl mx-auto">
              Experience the power of comprehensive, privacy-first code analysis. 
              Start detecting issues, improving quality, and maintaining security with ElyAnalyzer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4">
                Start Free Analysis
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                View Documentation
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default Features 