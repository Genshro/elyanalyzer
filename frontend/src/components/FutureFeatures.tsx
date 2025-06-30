import { motion } from 'framer-motion'
import { 
  CpuChipIcon,
  SparklesIcon,
  BoltIcon,
  ComputerDesktopIcon,
  CodeBracketIcon,
  LockClosedIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const FutureFeatures = () => {
  const futureFeatures = [
    {
      icon: CpuChipIcon,
      title: "IDE Native Integration",
      description: "Seamless plugins for VSCode, IntelliJ IDEA, and major IDEs. Full compatibility with your existing workflow while maintaining complete privacy.",
      status: "In Development",
      progress: 65,
      estimatedRelease: "Q2 2025",
      priority: "high",
      benefits: [
        "Real-time code analysis within your IDE",
        "Instant error highlighting and suggestions",
        "No context switching required",
        "Full privacy protection"
      ]
    },
    {
      icon: SparklesIcon,
      title: "AI-Powered Enhancement",
      description: "Intelligent code analysis with AI assistance for maximum productivity. Smart suggestions and pattern recognition, all processed locally.",
      status: "Research",
      progress: 25,
      estimatedRelease: "Q4 2025",
      priority: "high",
      benefits: [
        "Smart code completion suggestions",
        "Automated refactoring recommendations",
        "Intelligent bug prediction",
        "Local AI processing for privacy"
      ]
    },
    {
      icon: BoltIcon,
      title: "Shadow Assistant",
      description: "Real-time code companion that analyzes every line as you write. Instant error detection, solution suggestions, and quality improvements without interrupting your flow.",
      status: "Concept",
      progress: 10,
      estimatedRelease: "Q1 2026",
      priority: "high",
      benefits: [
        "Live code analysis while typing",
        "Non-intrusive background processing",
        "Contextual improvement suggestions",
        "Learning from your coding patterns"
      ]
    },
    {
      icon: ComputerDesktopIcon,
      title: "Project Development Suite",
      description: "Complete project lifecycle management from MVP to Enterprise. Automated PRD generation, phase planning, and continuous quality standards elevation.",
      status: "Planned",
      progress: 35,
      estimatedRelease: "Q3 2025",
      priority: "medium",
      benefits: [
        "Automated project requirement documents",
        "Phase-based development planning",
        "Quality gate enforcement",
        "Progress tracking and reporting"
      ]
    },
    {
      icon: CodeBracketIcon,
      title: "Custom Rule Engine",
      description: "Define and enforce your organization's coding standards. Configurable quality gates and team-specific analysis rules.",
      status: "Design",
      progress: 20,
      estimatedRelease: "Q4 2025",
      priority: "medium",
      benefits: [
        "Organization-specific coding standards",
        "Custom quality metrics",
        "Team collaboration features",
        "Compliance reporting"
      ]
    },
    {
      icon: LockClosedIcon,
      title: "Enterprise Security",
      description: "Advanced local encryption, audit trails, and compliance reporting for enterprise environments.",
      status: "Research",
      progress: 15,
      estimatedRelease: "Q1 2026",
      priority: "low",
      benefits: [
        "Advanced encryption protocols",
        "Detailed audit logging",
        "Compliance certifications",
        "Enterprise-grade security"
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Development': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Design': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Research': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'Concept': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'Planned': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-slate-400'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold gradient-text mb-4">Future Features Roadmap</h2>
        <p className="text-slate-200 max-w-2xl mx-auto">
          Exciting new features in development while maintaining our privacy-first approach. 
          Track progress and estimated release dates for upcoming enhancements.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid gap-8">
        {futureFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`card p-6 ${
              feature.priority === 'high' 
                ? 'bg-gradient-to-br from-primary-500/10 to-purple-500/10 border-primary-500/30' 
                : ''
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column - Main Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${
                    feature.priority === 'high' 
                      ? 'bg-gradient-to-r from-primary-500/30 to-purple-500/30' 
                      : 'bg-gradient-to-r from-primary-500/20 to-purple-500/20'
                  }`}>
                    <feature.icon className={`h-6 w-6 ${
                      feature.priority === 'high' ? 'text-primary-300' : 'text-primary-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(feature.status)}`}>
                        {feature.status}
                      </span>
                      <span className={`text-xs font-medium ${getPriorityColor(feature.priority)}`}>
                        {feature.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">Development Progress</span>
                        <span className="text-xs text-slate-300">{feature.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${feature.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>Est. Release: {feature.estimatedRelease}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Benefits */}
              <div className="lg:w-80">
                <h4 className="text-sm font-semibold text-slate-200 mb-3">Key Benefits</h4>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-slate-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Privacy Commitment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-12"
      >
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 rounded-full px-6 py-3">
          <LockClosedIcon className="h-5 w-5 text-green-400" />
          <span className="text-sm font-medium text-green-300">
            All future features maintain our privacy-first commitment and local processing guarantee
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default FutureFeatures 