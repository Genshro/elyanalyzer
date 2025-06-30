import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface CategoryScore {
  category_name: string;
  display_name: string;
  score: number;
  max_score: number;
  issue_count: number;
  critical_issues: number;
  warning_issues: number;
  info_issues: number;
  improvements: string[];
  trend: 'improving' | 'declining' | 'stable' | 'new';
  icon: string;
  created_at: string;
}

interface MotivationalMessage {
  type: 'improvement' | 'milestone' | 'encouragement';
  category: string;
  message: string;
  icon: string;
  score_change?: number;
}

interface Achievement {
  id: string;
  achievement_type: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  earned_at: string;
}

interface CategoryDashboardProps {
  projectId: string;
  userId: string;
}

const CategoryDashboard: React.FC<CategoryDashboardProps> = ({ projectId, userId }) => {
  const [categoryScores, setCategoryScores] = useState<CategoryScore[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('security');
  const [categoryHistory, setCategoryHistory] = useState<CategoryScore[]>([]);
  const [motivationalMessages, setMotivationalMessages] = useState<MotivationalMessage[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16', '#8B5A2B', '#6B7280', '#DC2626', '#7C3AED', '#059669'];

  useEffect(() => {
    fetchDashboardData();
  }, [projectId, userId]);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryHistory(selectedCategory);
    }
  }, [selectedCategory, projectId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch latest scan data (mock for now)
      const mockCategoryScores: CategoryScore[] = [
        {
          category_name: 'security',
          display_name: 'Security Analysis',
          score: 75.0,
          max_score: 100,
          issue_count: 7,
          critical_issues: 2,
          warning_issues: 3,
          info_issues: 2,
          improvements: ['Add input validation', 'Implement HTTPS', 'Use password hashing'],
          trend: 'improving',
          icon: '🔒',
          created_at: new Date().toISOString(),
        },
        {
          category_name: 'code_quality',
          display_name: 'Code Quality',
          score: 68.5,
          max_score: 100,
          issue_count: 12,
          critical_issues: 1,
          warning_issues: 6,
          info_issues: 5,
          improvements: ['Reduce complexity', 'Add comments', 'Follow SOLID principles'],
          trend: 'stable',
          icon: '🧪',
          created_at: new Date().toISOString(),
        },
        {
          category_name: 'performance',
          display_name: 'Performance',
          score: 82.0,
          max_score: 100,
          issue_count: 5,
          critical_issues: 0,
          warning_issues: 2,
          info_issues: 3,
          improvements: ['Add caching', 'Optimize queries', 'Implement lazy loading'],
          trend: 'improving',
          icon: '🚀',
          created_at: new Date().toISOString(),
        },
        {
          category_name: 'accessibility',
          display_name: 'Accessibility',
          score: 55.0,
          max_score: 100,
          issue_count: 8,
          critical_issues: 3,
          warning_issues: 3,
          info_issues: 2,
          improvements: ['Add ARIA labels', 'Improve contrast', 'Add keyboard navigation'],
          trend: 'declining',
          icon: '♿',
          created_at: new Date().toISOString(),
        },
        {
          category_name: 'documentation',
          display_name: 'Documentation',
          score: 45.0,
          max_score: 100,
          issue_count: 15,
          critical_issues: 5,
          warning_issues: 7,
          info_issues: 3,
          improvements: ['Add README', 'Document APIs', 'Add code comments'],
          trend: 'new',
          icon: '📚',
          created_at: new Date().toISOString(),
        },
        {
          category_name: 'architecture',
          display_name: 'Architecture',
          score: 78.0,
          max_score: 100,
          issue_count: 6,
          critical_issues: 1,
          warning_issues: 2,
          info_issues: 3,
          improvements: ['Improve separation of concerns', 'Add design patterns', 'Reduce coupling'],
          trend: 'improving',
          icon: '🏗️',
          created_at: new Date().toISOString(),
        },
        {
          category_name: 'testing',
          display_name: 'Testing',
          score: 62.0,
          max_score: 100,
          issue_count: 10,
          critical_issues: 2,
          warning_issues: 4,
          info_issues: 4,
          improvements: ['Add unit tests', 'Improve test coverage', 'Add integration tests'],
          trend: 'stable',
          icon: '🧪',
          created_at: new Date().toISOString(),
        },
        {
          category_name: 'logging',
          display_name: 'Logging',
          score: 58.5,
          max_score: 100,
          issue_count: 9,
          critical_issues: 1,
          warning_issues: 5,
          info_issues: 3,
          improvements: ['Add structured logging', 'Implement log levels', 'Add error tracking'],
          trend: 'declining',
          icon: '📝',
          created_at: new Date().toISOString(),
        },
        {
          category_name: 'dependencies',
          display_name: 'Dependencies',
          score: 85.0,
          max_score: 100,
          issue_count: 4,
          critical_issues: 0,
          warning_issues: 2,
          info_issues: 2,
          improvements: ['Update outdated packages', 'Remove unused dependencies', 'Check security vulnerabilities'],
          trend: 'improving',
          icon: '📦',
          created_at: new Date().toISOString(),
        },
        {
          category_name: 'compliance',
          display_name: 'Compliance',
          score: 72.0,
          max_score: 100,
          issue_count: 8,
          critical_issues: 2,
          warning_issues: 3,
          info_issues: 3,
          improvements: ['Add license headers', 'Implement GDPR compliance', 'Add privacy policies'],
          trend: 'stable',
          icon: '⚖️',
          created_at: new Date().toISOString(),
        },
        {
          category_name: 'ai_hallucinations',
          display_name: 'AI Hallucinations',
          score: 88.0,
          max_score: 100,
          issue_count: 3,
          critical_issues: 1,
          warning_issues: 1,
          info_issues: 1,
          improvements: ['Validate AI outputs', 'Add human review', 'Implement fact checking'],
          trend: 'improving',
          icon: '🤖',
          created_at: new Date().toISOString(),
        },
        {
          category_name: 'mobile_crossplatform',
          display_name: 'Mobile & Cross-Platform',
          score: 74.0,
          max_score: 100,
          issue_count: 8,
          critical_issues: 1,
          warning_issues: 4,
          info_issues: 3,
          improvements: ['Add responsive design', 'Implement PWA features', 'Optimize for mobile performance'],
          trend: 'improving',
          icon: '📱',
          created_at: new Date().toISOString(),
        },
        {
          category_name: 'error_handling',
          display_name: 'Error Handling',
          score: 73.0,
          max_score: 100,
          issue_count: 8,
          critical_issues: 1,
          warning_issues: 4,
          info_issues: 3,
          improvements: ['Add try-catch blocks', 'Improve error messages', 'Add error logging'],
          trend: 'stable',
          icon: '🚨',
          created_at: new Date().toISOString(),
        },
        {
          category_name: 'api_design',
          display_name: 'API Design',
          score: 81.5,
          max_score: 100,
          issue_count: 6,
          critical_issues: 0,
          warning_issues: 3,
          info_issues: 3,
          improvements: ['Follow REST principles', 'Add API documentation', 'Implement rate limiting'],
          trend: 'improving',
          icon: '🌐',
          created_at: new Date().toISOString(),
        },
        {
          category_name: 'database',
          display_name: 'Database',
          score: 69.0,
          max_score: 100,
          issue_count: 9,
          critical_issues: 2,
          warning_issues: 3,
          info_issues: 4,
          improvements: ['Optimize queries', 'Add indexes', 'Implement connection pooling'],
          trend: 'declining',
          icon: '🗄️',
          created_at: new Date().toISOString(),
        },
      ];

      setCategoryScores(mockCategoryScores);

      // Fetch motivational messages
      const response = await fetch(`/api/projects/${projectId}/motivational-messages`);
      if (response.ok) {
        const data = await response.json();
        setMotivationalMessages(data.messages || []);
      }

      // Fetch achievements
      const achievementsResponse = await fetch(`/api/users/${userId}/achievements`);
      if (achievementsResponse.ok) {
        const achievementsData = await achievementsResponse.json();
        setAchievements(achievementsData.achievements || []);
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryHistory = async (category: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/categories/${category}/history?days=30`);
      if (response.ok) {
        const data = await response.json();
        setCategoryHistory(data.history || []);
      }
    } catch (error) {
      console.error('Failed to fetch category history:', error);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      case 'new': return '🆕';
      default: return '➡️';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-blue-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const chartData = categoryHistory.map((item, index) => ({
    name: `Scan ${categoryHistory.length - index}`,
    score: item.score,
    issues: item.issue_count,
    date: new Date(item.created_at).toLocaleDateString(),
  }));

  const pieData = categoryScores.map((category, index) => ({
    name: category.display_name,
    value: category.score,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">Category Analysis Dashboard</h1>
        <p className="text-slate-400">Track your project's progress across different quality categories</p>
      </div>

      {/* Motivational Messages */}
      {motivationalMessages.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">🎉 Your Progress</h2>
          <div className="space-y-2">
            {motivationalMessages.map((message, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-2xl">{message.icon}</span>
                <span>{message.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryScores.map((category) => (
          <div
            key={category.category_name}
            className={`card p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 ${
              selectedCategory === category.category_name ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedCategory(category.category_name)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-lg font-semibold text-slate-100">{category.display_name}</h3>
              </div>
              <div className="flex items-center space-x-1">
                <span>{getTrendIcon(category.trend)}</span>
                <span className="text-sm text-slate-400">{category.trend}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-3xl font-bold ${getScoreColor(category.score)}`}>
                  {category.score.toFixed(1)}
                </span>
                <span className="text-sm text-slate-400">/ {category.max_score}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    category.score >= 75 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 
                    category.score >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' : 
                    'bg-gradient-to-r from-red-500 to-pink-400'
                  }`}
                  style={{ width: `${(category.score / category.max_score) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <div className="font-semibold text-red-400">{category.critical_issues}</div>
                <div className="text-slate-400">Critical</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-yellow-400">{category.warning_issues}</div>
                <div className="text-slate-400">Warning</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-400">{category.info_issues}</div>
                <div className="text-slate-400">Info</div>
              </div>
            </div>


          </div>
        ))}
      </div>

      {/* Detailed Category Analysis */}
      {selectedCategory && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text">
              {categoryScores.find(c => c.category_name === selectedCategory)?.display_name} Trends
            </h2>
            <div className="text-sm text-slate-400">Last 30 days</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Trend Chart */}
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Score History</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis domain={[0, 100]} stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="url(#scoreGradient)" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Issues Trend Chart */}
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Issues Count</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }} 
                  />
                  <Bar dataKey="issues" fill="url(#issueGradient)" />
                  <defs>
                    <linearGradient id="issueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#F87171" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Improvements Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">💡 Recommended Improvements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryScores.find(c => c.category_name === selectedCategory)?.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <span className="text-blue-400 mt-1">•</span>
                  <span className="text-sm text-slate-300">{improvement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Overall Progress Chart */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold gradient-text mb-6">Overall Progress</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Category Scores Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">🏆 Recent Achievements</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <div className="font-semibold text-slate-100">{achievement.title}</div>
                    <div className="text-sm text-slate-300">{achievement.description}</div>
                    <div className="text-xs text-slate-400">
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {achievements.length === 0 && (
                <div className="text-slate-400 text-center py-8">
                  Keep improving your code to earn achievements! 🎯
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDashboard; 
