import React, { useState } from 'react';
import { 
  AnalysisProfiles, 
  StrictnessPresets, 
  StrictnessDescriptions,
  SeverityDescriptions,
  EnhancedAnalysisConfig,
  StrictnessLevel,
  SeverityFilter,
  getAnalyzerCount,
  getEstimatedTime
} from '../../../shared/types/analysis';

interface AnalysisConfigPanelProps {
  onConfigChange: (config: EnhancedAnalysisConfig) => void;
  initialConfig?: EnhancedAnalysisConfig;
}

const AnalysisConfigPanel: React.FC<AnalysisConfigPanelProps> = ({
  onConfigChange,
  initialConfig
}) => {
  const [selectedProfile, setSelectedProfile] = useState<string>('production_ready');
  const [customConfig, setCustomConfig] = useState<EnhancedAnalysisConfig>(
    initialConfig || AnalysisProfiles.production_ready
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleProfileChange = (profileName: string) => {
    setSelectedProfile(profileName);
    const newConfig = AnalysisProfiles[profileName];
    setCustomConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleStrictnessChange = (strictness: StrictnessLevel) => {
    const newFilter = StrictnessPresets[strictness];
    const updatedConfig = {
      ...customConfig,
      strictnessLevel: strictness,
      severityFilter: newFilter
    };
    setCustomConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };

  const handleSeverityFilterChange = (severity: keyof SeverityFilter, value: boolean) => {
    const updatedFilter = {
      ...customConfig.severityFilter,
      [severity]: value
    };
    const updatedConfig = {
      ...customConfig,
      strictnessLevel: 'custom' as StrictnessLevel,
      severityFilter: updatedFilter
    };
    setCustomConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };

  const allAnalyzers = [
    'security', 'performance', 'code_quality', 'testing',
    'documentation', 'error_handling', 'logging', 'dependencies',
    'architecture', 'database', 'api_design', 'accessibility',
    'ai_hallucinations', 'compliance', 'mobile_crossplatform'
  ];

  const analyzerNames: Record<string, string> = {
    security: '🛡️ Güvenlik',
    performance: '⚡ Performans',
    code_quality: '✨ Kod Kalitesi',
    testing: '🧪 Test',
    documentation: '📚 Dokümantasyon',
    error_handling: '🚨 Hata Yönetimi',
    logging: '📝 Loglama',
    dependencies: '📦 Bağımlılıklar',
    architecture: '🏗️ Mimari',
    database: '🗄️ Veritabanı',
    api_design: '🔌 API Tasarımı',
    accessibility: '♿ Erişilebilirlik',
    ai_hallucinations: '🤖 AI Halüsinasyonları',
    compliance: '📋 Uyumluluk',
    mobile_crossplatform: '📱 Mobil/Cross-platform'
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Analiz Konfigürasyonu</h3>
      
      {/* Quick Profiles */}
      <div className="space-y-3">
        <h4 className="text-lg font-medium text-slate-200">Hızlı Profiller</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(AnalysisProfiles).map(([key, profile]) => (
            <button
              key={key}
              onClick={() => handleProfileChange(key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedProfile === key
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-white">
                  {StrictnessDescriptions[profile.strictnessLevel]}
                </h5>
                <span className="text-xs text-slate-400">
                  {getAnalyzerCount(key)} analiz
                </span>
              </div>
              <p className="text-sm text-slate-300 mb-2">
                {getEstimatedTime(key)} • {profile.enabledAnalyzers.length} araç
              </p>
              <div className="flex flex-wrap gap-1">
                {profile.enabledAnalyzers.slice(0, 3).map(analyzer => (
                  <span key={analyzer} className="text-xs bg-slate-600 px-2 py-1 rounded">
                    {analyzerNames[analyzer]?.split(' ')[1] || analyzer}
                  </span>
                ))}
                {profile.enabledAnalyzers.length > 3 && (
                  <span className="text-xs text-slate-400">
                    +{profile.enabledAnalyzers.length - 3} daha
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Severity Level Selection */}
      <div className="space-y-3">
        <h4 className="text-lg font-medium text-slate-200">Katılık Seviyesi</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(StrictnessDescriptions) as StrictnessLevel[]).map(level => (
            <button
              key={level}
              onClick={() => handleStrictnessChange(level)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                customConfig.strictnessLevel === level
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-slate-600 bg-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="text-sm font-medium text-white mb-1">
                {StrictnessDescriptions[level]}
              </div>
              <div className="text-xs text-slate-400">
                {level === 'blocking_only' && 'Sadece kritik'}
                {level === 'production' && 'Kritik + Yüksek'}
                {level === 'quality' && 'Kritik + Yüksek + Orta'}
                {level === 'complete' && 'Tüm seviyeler'}
                {level === 'custom' && 'Özel ayarlar'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Severity Filter */}
      {customConfig.strictnessLevel === 'custom' && (
        <div className="space-y-3">
          <h4 className="text-lg font-medium text-slate-200">Özel Severity Filtreleri</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(SeverityDescriptions).map(([severity, description]) => {
              const filterKey = `include${severity.charAt(0).toUpperCase() + severity.slice(1)}` as keyof SeverityFilter;
              return (
                <label
                  key={severity}
                  className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600"
                >
                  <input
                    type="checkbox"
                    checked={customConfig.severityFilter[filterKey]}
                    onChange={(e) => handleSeverityFilterChange(filterKey, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-white">
                      {severity.toUpperCase()}
                    </div>
                    <div className="text-xs text-slate-400">
                      {description}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
      >
        {showAdvanced ? '▼ Gelişmiş Ayarları Gizle' : '▶ Gelişmiş Ayarları Göster'}
      </button>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="space-y-4 border-t border-slate-600 pt-4">
          <h4 className="text-lg font-medium text-slate-200">Gelişmiş Ayarlar</h4>
          
          {/* Analyzer Selection */}
          <div className="space-y-3">
            <h5 className="text-md font-medium text-slate-300">Analiz Araçları Seçimi</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {allAnalyzers.map(analyzer => (
                <label
                  key={analyzer}
                  className="flex items-center space-x-2 p-2 bg-slate-700 rounded cursor-pointer hover:bg-slate-600"
                >
                  <input
                    type="checkbox"
                    checked={customConfig.enabledAnalyzers.includes(analyzer)}
                    onChange={(e) => {
                      const updatedAnalyzers = e.target.checked
                        ? [...customConfig.enabledAnalyzers, analyzer]
                        : customConfig.enabledAnalyzers.filter(a => a !== analyzer);
                      
                      const updatedConfig = {
                        ...customConfig,
                        enabledAnalyzers: updatedAnalyzers
                      };
                      setCustomConfig(updatedConfig);
                      onConfigChange(updatedConfig);
                    }}
                    className="w-4 h-4 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-white">
                    {analyzerNames[analyzer]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Performance Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Zaman Limiti (saniye)
              </label>
              <input
                type="number"
                value={customConfig.timeLimit || 300}
                onChange={(e) => {
                  const updatedConfig = {
                    ...customConfig,
                    timeLimit: parseInt(e.target.value)
                  };
                  setCustomConfig(updatedConfig);
                  onConfigChange(updatedConfig);
                }}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                min="30"
                max="3600"
                placeholder="300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Dosya Başına Max Sorun (-1 = sınırsız)
              </label>
              <input
                type="number"
                value={customConfig.maxIssuesPerFile || 100}
                onChange={(e) => {
                  const updatedConfig = {
                    ...customConfig,
                    maxIssuesPerFile: parseInt(e.target.value)
                  };
                  setCustomConfig(updatedConfig);
                  onConfigChange(updatedConfig);
                }}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                min="-1"
                placeholder="100"
              />
            </div>
          </div>

          {/* Output Preferences */}
          <div className="space-y-3">
            <h5 className="text-md font-medium text-slate-300">Çıktı Tercihleri</h5>
            <div className="space-y-2">
              {[
                { key: 'groupByFile', label: 'Dosyalara Göre Grupla' },
                { key: 'showFixSuggestions', label: 'Düzeltme Önerilerini Göster' },
                { key: 'includeMetrics', label: 'Metrikleri Dahil Et' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={customConfig[key as keyof EnhancedAnalysisConfig] as boolean}
                    onChange={(e) => {
                      const updatedConfig = {
                        ...customConfig,
                        [key]: e.target.checked
                      };
                      setCustomConfig(updatedConfig);
                      onConfigChange(updatedConfig);
                    }}
                    className="w-4 h-4 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-300">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Current Config Summary */}
      <div className="bg-slate-700 rounded-lg p-4">
        <h5 className="font-medium text-white mb-2">Mevcut Konfigürasyon</h5>
        <div className="text-sm text-slate-300 space-y-1">
          <div>📊 <strong>{customConfig.enabledAnalyzers.length}</strong> analiz aracı seçili</div>
          <div>⏱️ Tahmini süre: <strong>{getEstimatedTime(selectedProfile)}</strong></div>
          <div>🎯 Katılık: <strong>{StrictnessDescriptions[customConfig.strictnessLevel]}</strong></div>
          <div>🔍 Dahil edilen seviyeler: 
            {customConfig.severityFilter.includeCritical && ' Kritik'}
            {customConfig.severityFilter.includeHigh && ' Yüksek'}
            {customConfig.severityFilter.includeMedium && ' Orta'}
            {customConfig.severityFilter.includeLow && ' Düşük'}
            {customConfig.severityFilter.includeInfo && ' Bilgi'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisConfigPanel; 