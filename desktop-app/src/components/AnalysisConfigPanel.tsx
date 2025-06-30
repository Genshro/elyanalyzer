import React, { useState } from 'react';

// Desktop app için simplified types (shared types kullanamayız çünkü import sorunları olabilir)
interface SeverityFilter {
  includeCritical: boolean;
  includeHigh: boolean;
  includeMedium: boolean;
  includeLow: boolean;
  includeInfo: boolean;
}

type StrictnessLevel = 'blocking_only' | 'production' | 'quality' | 'complete' | 'custom';

interface EnhancedAnalysisConfig {
  enabledAnalyzers: string[];
  strictnessLevel: StrictnessLevel;
  severityFilter: SeverityFilter;
  timeLimit?: number;
  maxIssuesPerFile?: number;
  groupByFile: boolean;
  showFixSuggestions: boolean;
  includeMetrics: boolean;
}

interface AnalysisConfigPanelProps {
  onConfigChange: (config: EnhancedAnalysisConfig) => void;
  initialConfig?: EnhancedAnalysisConfig;
}

const AnalysisConfigPanel: React.FC<AnalysisConfigPanelProps> = ({
  onConfigChange,
  initialConfig
}) => {
  const StrictnessPresets: Record<StrictnessLevel, SeverityFilter> = {
    blocking_only: {
      includeCritical: true,
      includeHigh: false,
      includeMedium: false,
      includeLow: false,
      includeInfo: false,
    },
    production: {
      includeCritical: true,
      includeHigh: true,
      includeMedium: false,
      includeLow: false,
      includeInfo: false,
    },
    quality: {
      includeCritical: true,
      includeHigh: true,
      includeMedium: true,
      includeLow: false,
      includeInfo: false,
    },
    complete: {
      includeCritical: true,
      includeHigh: true,
      includeMedium: true,
      includeLow: true,
      includeInfo: true,
    },
    custom: {
      includeCritical: true,
      includeHigh: true,
      includeMedium: true,
      includeLow: true,
      includeInfo: true,
    },
  };

  const AnalysisProfiles: Record<string, EnhancedAnalysisConfig> = {
    blocking_only: {
      enabledAnalyzers: ['security', 'error_handling', 'code_quality', 'dependencies', 'architecture'],
      strictnessLevel: 'blocking_only',
      severityFilter: StrictnessPresets.blocking_only,
      timeLimit: 5,
      maxIssuesPerFile: 10,
      groupByFile: true,
      showFixSuggestions: true,
      includeMetrics: false,
    },
    production_ready: {
      enabledAnalyzers: [
        'security', 'performance', 'error_handling', 'code_quality', 
        'testing', 'dependencies', 'architecture', 'database', 'api_design'
      ],
      strictnessLevel: 'production',
      severityFilter: StrictnessPresets.production,
      timeLimit: 15,
      maxIssuesPerFile: 50,
      groupByFile: true,
      showFixSuggestions: true,
      includeMetrics: true,
    },
    quality_focused: {
      enabledAnalyzers: [
        'code_quality', 'testing', 'documentation', 'architecture', 
        'performance', 'error_handling', 'dependencies', 'logging'
      ],
      strictnessLevel: 'quality',
      severityFilter: StrictnessPresets.quality,
      timeLimit: 30,
      maxIssuesPerFile: 100,
      groupByFile: false,
      showFixSuggestions: true,
      includeMetrics: true,
    },
    comprehensive: {
      enabledAnalyzers: [
        'security', 'performance', 'code_quality', 'testing', 'documentation', 
        'error_handling', 'logging', 'dependencies', 'architecture', 'database', 
        'api_design', 'accessibility', 'ai_hallucinations', 'compliance', 'mobile_crossplatform'
      ],
      strictnessLevel: 'complete',
      severityFilter: StrictnessPresets.complete,
      timeLimit: 60,
      maxIssuesPerFile: -1,
      groupByFile: false,
      showFixSuggestions: true,
      includeMetrics: true,
    },
  };

  const StrictnessDescriptions: Record<StrictnessLevel, string> = {
    blocking_only: '🚨 Blocking Only - Critical errors that break execution',
    production: '🔥 Production Ready - Critical + High severity',
    quality: '✨ Quality Focused - Up to medium severity',
    complete: '🔍 Comprehensive - All severity levels included',
    custom: '⚙️ Custom - User-defined settings',
  };



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

  const allAnalyzers = [
    'security', 'performance', 'code_quality', 'testing',
    'documentation', 'error_handling', 'logging', 'dependencies',
    'architecture', 'database', 'api_design', 'accessibility',
    'ai_hallucinations', 'compliance', 'mobile_crossplatform'
  ];

  const analyzerNames: Record<string, string> = {
    security: '🛡️ Security',
    performance: '⚡ Performance',
    code_quality: '✨ Code Quality',
    testing: '🧪 Testing',
    documentation: '📚 Documentation',
    error_handling: '🚨 Error Handling',
    logging: '📝 Logging',
    dependencies: '📦 Dependencies',
    architecture: '🏗️ Architecture',
    database: '🗄️ Database',
    api_design: '🔌 API Design',
    accessibility: '♿ Accessibility',
    ai_hallucinations: '🤖 AI Hallucinations',
    compliance: '📋 Compliance',
    mobile_crossplatform: '📱 Mobile/Cross-platform'
  };

  const getEstimatedTime = (profileName: string): string => {
    const profile = AnalysisProfiles[profileName];
    if (!profile) return 'Unknown';
    
    const seconds = profile.timeLimit!;
    if (seconds < 10) return '~5-10 seconds';
    if (seconds < 30) return '~10-30 seconds';
    if (seconds < 60) return '~30-60 seconds';
    const minutes = Math.floor(seconds / 60);
    return `~${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  const getAnalyzerCount = (profileName: string): number => {
    const profile = AnalysisProfiles[profileName];
    return profile ? profile.enabledAnalyzers.length : 0;
  };

  return (
    <div style={{
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      borderRadius: '12px',
      padding: '32px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(71, 85, 105, 0.3)',
      color: 'white',
      fontFamily: 'Inter, system-ui, sans-serif',
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto'
    }}>
      <h3 style={{
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textAlign: 'center'
      }}>
        🔧 Analysis Configuration
      </h3>
      
      {/* Privacy Notice */}
      <div style={{
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '20px' }}>🔒</span>
        <span style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.5' }}>
          All analysis is performed locally on your machine. Your code never leaves your system.
        </span>
      </div>

      {/* Quick Profiles */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px', color: 'rgba(255, 255, 255, 0.9)' }}>
          Quick Profiles
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {Object.entries(AnalysisProfiles).map(([key, profile]) => (
            <button
              key={key}
              onClick={() => handleProfileChange(key)}
              style={{
                padding: '20px',
                borderRadius: '12px',
                border: selectedProfile === key ? '2px solid #3b82f6' : '2px solid rgba(71, 85, 105, 0.5)',
                backgroundColor: selectedProfile === key ? 'rgba(59, 130, 246, 0.1)' : 'rgba(51, 65, 85, 0.5)',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                minHeight: '140px'
              }}
              onMouseEnter={(e) => {
                if (selectedProfile !== key) {
                  e.currentTarget.style.borderColor = 'rgba(71, 85, 105, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedProfile !== key) {
                  e.currentTarget.style.borderColor = 'rgba(71, 85, 105, 0.5)';
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h5 style={{ fontWeight: '600', margin: 0, fontSize: '16px', lineHeight: '1.3' }}>
                  {StrictnessDescriptions[profile.strictnessLevel]}
                </h5>
                <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', whiteSpace: 'nowrap' }}>
                  {getAnalyzerCount(key)} analyzers
                </span>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                {getEstimatedTime(key)} • {profile.enabledAnalyzers.length} tools
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {profile.enabledAnalyzers.slice(0, 3).map(analyzer => (
                  <span key={analyzer} style={{
                    fontSize: '11px',
                    backgroundColor: 'rgba(71, 85, 105, 0.6)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    {analyzerNames[analyzer]?.split(' ')[1] || analyzer}
                  </span>
                ))}
                {profile.enabledAnalyzers.length > 3 && (
                  <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    +{profile.enabledAnalyzers.length - 3} more
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Severity Level Selection */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px', color: 'rgba(255, 255, 255, 0.9)' }}>
          Strictness Level
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {(Object.keys(StrictnessDescriptions) as StrictnessLevel[]).map(level => (
            <button
              key={level}
              onClick={() => handleStrictnessChange(level)}
              style={{
                padding: '16px',
                borderRadius: '10px',
                border: customConfig.strictnessLevel === level ? '2px solid #f97316' : '2px solid rgba(71, 85, 105, 0.5)',
                backgroundColor: customConfig.strictnessLevel === level ? 'rgba(249, 115, 22, 0.1)' : 'rgba(51, 65, 85, 0.5)',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                minHeight: '80px'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px', lineHeight: '1.3' }}>
                {StrictnessDescriptions[level]}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.2' }}>
                {level === 'blocking_only' && 'Critical only'}
                {level === 'production' && 'Critical + High'}
                {level === 'quality' && 'Critical + High + Medium'}
                {level === 'complete' && 'All levels'}
                {level === 'custom' && 'Custom settings'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{
          color: '#60a5fa',
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: '20px',
          fontFamily: 'inherit',
          padding: '8px 0'
        }}
      >
        {showAdvanced ? '▼ Hide Advanced Settings' : '▶ Show Advanced Settings'}
      </button>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div style={{
          borderTop: '1px solid rgba(71, 85, 105, 0.5)',
          paddingTop: '24px',
          marginTop: '20px'
        }}>
          <h4 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: 'rgba(255, 255, 255, 0.9)' }}>
            Advanced Settings
          </h4>
          
          {/* Analyzer Selection */}
          <div style={{ marginBottom: '20px' }}>
            <h5 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
              Analyzer Tool Selection
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {allAnalyzers.map(analyzer => (
                <label
                  key={analyzer}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: 'rgba(51, 65, 85, 0.5)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background-color 0.2s ease'
                  }}
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
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ color: 'white', lineHeight: '1.3' }}>
                    {analyzerNames[analyzer]}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Current Config Summary */}
      <div style={{
        backgroundColor: 'rgba(51, 65, 85, 0.5)',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '24px'
      }}>
        <h5 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '16px' }}>Current Configuration</h5>
        <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.5' }}>
          <div style={{ marginBottom: '6px' }}>
            📊 <strong>{customConfig.enabledAnalyzers.length}</strong> analyzer tools selected
          </div>
          <div style={{ marginBottom: '6px' }}>
            ⏱️ Estimated time: <strong>{getEstimatedTime(selectedProfile)}</strong>
          </div>
          <div style={{ marginBottom: '6px' }}>
            🎯 Strictness: <strong>{StrictnessDescriptions[customConfig.strictnessLevel]}</strong>
          </div>
          <div>
            🔍 Included levels: 
            {customConfig.severityFilter.includeCritical && ' Critical'}
            {customConfig.severityFilter.includeHigh && ' High'}
            {customConfig.severityFilter.includeMedium && ' Medium'}
            {customConfig.severityFilter.includeLow && ' Low'}
            {customConfig.severityFilter.includeInfo && ' Info'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisConfigPanel; 