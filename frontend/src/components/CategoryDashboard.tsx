import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

interface CategoryDashboardProps {
  projectId: string;
  userId: string;
}

const CategoryDashboard: React.FC<CategoryDashboardProps> = ({ projectId, userId }) => {
  const [categoryScores, setCategoryScores] = useState<CategoryScore[]>([]);
  const [loading, setLoading] = useState(true);

  const createDefaultCategories = (): CategoryScore[] => {
    const categories = [
      { name: 'security', display_name: 'Security Analysis', icon: '🔒' },
      { name: 'code_quality', display_name: 'Code Quality', icon: '✨' },
      { name: 'performance', display_name: 'Performance', icon: '🚀' },
      { name: 'accessibility', display_name: 'Accessibility', icon: '♿' },
      { name: 'documentation', display_name: 'Documentation', icon: '📚' },
      { name: 'testing', display_name: 'Testing Coverage', icon: '🧪' },
      { name: 'dependencies', display_name: 'Dependencies', icon: '📦' },
      { name: 'architecture', display_name: 'Architecture', icon: '🏗️' },
      { name: 'error_handling', display_name: 'Error Handling', icon: '🚨' },
      { name: 'api_design', display_name: 'API Design', icon: '🌐' },
      { name: 'database', display_name: 'Database Analysis', icon: '🗄️' },
      { name: 'compliance', display_name: 'Compliance & Privacy', icon: '⚖️' },
      { name: 'mobile', display_name: 'Mobile & Cross-Platform', icon: '📱' },
      { name: 'logging', display_name: 'Logging & Observability', icon: '📊' },
      { name: 'ai_hallucinations', display_name: 'AI Hallucinations', icon: '🤖' }
    ];

    return categories.map(cat => ({
      category_name: cat.name,
      display_name: cat.display_name,
      score: 0,
      max_score: 100,
      issue_count: 0,
      critical_issues: 0,
      warning_issues: 0,
      info_issues: 0,
      improvements: ['No data available yet'],
      trend: 'new' as const,
      icon: cat.icon,
      created_at: new Date().toISOString()
    }));
  };

  const getCategoryInfoById = (categoryId: string) => {
    const categoryMap: { [key: string]: { name: string, display_name: string, icon: string } } = {
      '11111111-1111-1111-1111-111111111111': { name: 'security', display_name: 'Security Analysis', icon: '🔒' },
      '22222222-2222-2222-2222-222222222222': { name: 'code_quality', display_name: 'Code Quality', icon: '✨' },
      '33333333-3333-3333-3333-333333333333': { name: 'performance', display_name: 'Performance', icon: '🚀' },
      '44444444-4444-4444-4444-444444444444': { name: 'accessibility', display_name: 'Accessibility', icon: '♿' },
      '55555555-5555-5555-5555-555555555555': { name: 'documentation', display_name: 'Documentation', icon: '📚' },
      '66666666-6666-6666-6666-666666666666': { name: 'testing', display_name: 'Testing Coverage', icon: '🧪' },
      '77777777-7777-7777-7777-777777777777': { name: 'dependencies', display_name: 'Dependencies', icon: '📦' },
      '88888888-8888-8888-8888-888888888888': { name: 'architecture', display_name: 'Architecture', icon: '🏗️' },
      '99999999-9999-9999-9999-999999999999': { name: 'error_handling', display_name: 'Error Handling', icon: '🚨' },
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa': { name: 'api_design', display_name: 'API Design', icon: '🌐' },
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb': { name: 'database', display_name: 'Database Analysis', icon: '🗄️' },
      'cccccccc-cccc-cccc-cccc-cccccccccccc': { name: 'compliance', display_name: 'Compliance & Privacy', icon: '⚖️' },
      'dddddddd-dddd-dddd-dddd-dddddddddddd': { name: 'mobile', display_name: 'Mobile & Cross-Platform', icon: '📱' },
      'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee': { name: 'logging', display_name: 'Logging & Observability', icon: '📊' },
      'ffffffff-ffff-ffff-ffff-ffffffffffff': { name: 'ai_hallucinations', display_name: 'AI Hallucinations', icon: '🤖' }
    };
    
    return categoryMap[categoryId] || { name: 'unknown', display_name: 'Unknown Category', icon: '📊' };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching dashboard data...');
      
      // Önce en son scan_id'yi bul
      const { data: latestScan, error: scanError } = await supabase
        .from('analysis_scans')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (scanError || !latestScan || latestScan.length === 0) {
        console.log('📊 No scans found, using default categories');
        setCategoryScores(createDefaultCategories());
        setLoading(false);
        return;
      }
      
      const latestScanId = latestScan[0].id;
      console.log('🔍 Latest scan ID:', latestScanId);
      
      // En son scan'daki tüm category scores'ları çek
      const { data: scoresData, error: scoresError } = await supabase
        .from('category_scores')
        .select('*')
        .eq('scan_id', latestScanId);
      
      console.log('🔍 Direct scores query result:', { data: scoresData, error: scoresError });
      
      if (scoresError) {
        console.error('❌ Failed to fetch scores:', scoresError);
        setCategoryScores(createDefaultCategories());
        return;
      }
      
      if (!scoresData || scoresData.length === 0) {
        console.log('📊 No scores found, using default categories');
        setCategoryScores(createDefaultCategories());
        return;
      }
      
      console.log('✅ Found scores:', scoresData.length);
      
      // Transform data direkt olarak (artık tek scan'dan geldiği için mapping gerekmez)
      const transformedScores: CategoryScore[] = [];
      const defaultCategories = createDefaultCategories();
      
      // Her default kategori için skor var mı kontrol et
      defaultCategories.forEach(defaultCat => {
        const scoreData = scoresData.find((score: any) => {
          const categoryInfo = getCategoryInfoById(score.category_id);
          return categoryInfo.name === defaultCat.category_name;
        });
        
        if (scoreData) {
          const categoryInfo = getCategoryInfoById(scoreData.category_id);
          console.log(`✅ Found data for ${defaultCat.category_name}:`, scoreData);
          transformedScores.push({
            category_name: defaultCat.category_name,
            display_name: categoryInfo.display_name,
            score: scoreData.score || 0,
          max_score: 100,
            issue_count: (scoreData.critical_issues || 0) + (scoreData.warning_issues || 0) + (scoreData.info_issues || 0),
            critical_issues: scoreData.critical_issues || 0,
            warning_issues: scoreData.warning_issues || 0,
            info_issues: scoreData.info_issues || 0,
            improvements: ['Analysis completed'],
            trend: 'new' as const,
            icon: categoryInfo.icon,
            created_at: scoreData.created_at || new Date().toISOString()
          });
        } else {
          console.log(`❌ No data found for ${defaultCat.category_name}, using default`);
          transformedScores.push(defaultCat);
      }
      });
      
      console.log('📊 Final transformed scores:', transformedScores.length);
      setCategoryScores(transformedScores);

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setCategoryScores(createDefaultCategories());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [projectId, userId]);

  // Otomatik yenileme - her 30 saniyede bir kontrol et
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // 30 saniye

    return () => clearInterval(interval);
  }, [projectId, userId]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    if (score >= 20) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(15)].map((_, index) => (
          <div key={index} className="card p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-slate-700 rounded mr-3"></div>
                <div className="w-24 h-4 bg-slate-700 rounded"></div>
              </div>
              <div className="w-12 h-4 bg-slate-700 rounded"></div>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="w-12 h-4 bg-slate-700 rounded"></div>
              <div className="w-12 h-4 bg-slate-700 rounded"></div>
              <div className="w-12 h-4 bg-slate-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryScores.map((category) => (
        <div key={category.category_name} className="card p-6 hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{category.icon}</span>
              <div>
                <h3 className="font-semibold text-slate-100">{category.display_name}</h3>
                <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">new</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                {Math.round(category.score)}
              </div>
              <div className="text-sm text-slate-400">/ {category.max_score}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                className={`h-2 rounded-full transition-all duration-300 ${getScoreBarColor(category.score)}`}
                  style={{ width: `${(category.score / category.max_score) * 100}%` }}
                ></div>
              </div>
            </div>

          <div className="flex justify-between text-sm mb-4">
              <div className="text-center">
              <div className="text-red-400 font-semibold">{category.critical_issues}</div>
                <div className="text-slate-400">Critical</div>
              </div>
              <div className="text-center">
              <div className="text-yellow-400 font-semibold">{category.warning_issues}</div>
                <div className="text-slate-400">Warning</div>
              </div>
              <div className="text-center">
              <div className="text-blue-400 font-semibold">{category.info_issues}</div>
                <div className="text-slate-400">Info</div>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            {category.improvements[0]}
                  </div>
                </div>
              ))}
    </div>
  );
};

export default CategoryDashboard; 