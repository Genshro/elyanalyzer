// TypeScript interfaces that mirror Go structs

export interface FileInfo {
  path: string;
  name: string;
  extension: string;
  content?: string;
  imports: string[];
  size: number;
}

export interface ScanResult {
  project_path: string;
  scan_type?: string;
  files: FileInfo[];
  issues: Issue[];
  summary: ScanSummary;
  scanned_at: string; // ISO 8601 date string
}

export interface Issue {
  type: string;
  severity: string;
  description: string;
  file: string;
  line?: number;
  suggestion?: string;
}

export interface ScanSummary {
  total_files: number;
  js_files: number;
  ts_files: number;
  issues_found: number;
  critical_issues: number;
  missing_files: number;
}

export interface PatternRule {
  name: string;
  file_pattern: string;
  missing: string[];
  severity: string;
  description: string;
}

// Severity levels (matching Go constants)
export const Severity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type SeverityLevel = typeof Severity[keyof typeof Severity];

// Issue types
export const IssueTypes = {
  // Basic AI error patterns
  MISSING_AUTH: 'missing_auth_context',
  API_NO_SCHEMA: 'api_no_schema',
  REDUX_NO_STORE: 'redux_no_store',
  ROUTER_NO_ROUTES: 'router_no_routes',
  MISSING_DEPENDENCY: 'missing_package_dependency',
  
  // AI hallucination patterns
  DUPLICATE_ENTITIES: 'duplicate_entity_files',
  DB_COLUMN_MISMATCH: 'database_column_mismatch',
  INDEX_MISSING: 'database_index_missing',
  MULTIPLE_SERVICES: 'multiple_same_services',
  CONFIG_CONFLICT: 'config_file_conflict',
  
  // Advanced AI error patterns
  WRONG_IMPORT: 'wrong_import_statement',
  MISSING_IMPORT: 'missing_required_import',
  TYPE_ERROR: 'typescript_type_error',
  WRONG_DIRECTORY: 'wrong_directory_structure',
  IGNORED_SHARED_TYPE: 'ignored_shared_types',
  INTEGRATION_ERROR: 'backend_frontend_integration_error',
  UNUSED_DEPENDENCY: 'unused_dependency',

  // 🔒 SECURITY ANALYSIS
  INPUT_VALIDATION: 'input_validation_missing',
  SQL_INJECTION: 'sql_injection_risk',
  XSS_VULNERABILITY: 'xss_vulnerability',
  CSRF_VULNERABILITY: 'csrf_vulnerability',
  AUTH_WEAKNESS: 'authentication_weakness',
  AUTHZ_MISSING: 'authorization_missing',
  INSECURE_STORAGE: 'insecure_data_storage',
  INSECURE_API: 'insecure_api_call',
  HTTPS_MISSING: 'https_missing',
  OUTDATED_DEP: 'outdated_dependency',
  SESSION_ISSUE: 'session_management_issue',
  SECURITY_LOG_MISSING: 'security_logging_missing',
  RATE_LIMIT_MISSING: 'rate_limiting_missing',

  // 🧪 CODE QUALITY ANALYSIS
  CODE_DUPLICATION: 'code_duplication',
  HIGH_COMPLEXITY: 'high_cyclomatic_complexity',
  POOR_READABILITY: 'poor_code_readability',
  SOLID_VIOLATION: 'solid_principle_violation',
  COMMENT_ISSUE: 'comment_issue',
  REFACTOR_NEEDED: 'refactor_needed',
  TESTABILITY_ISSUE: 'testability_issue',
  DESIGN_PATTERN_MISSING: 'design_pattern_missing',
  DEPENDENCY_INJECTION_MISSING: 'dependency_injection_missing',

  // 🧯 PERFORMANCE ANALYSIS
  PERFORMANCE_ISSUE: 'performance_issue',
  CACHING_MISSING: 'caching_missing',
  MEMORY_LEAK: 'memory_leak_risk',
  SLOW_QUERY: 'slow_database_query',
  SLOW_RESPONSE: 'slow_response_time',
  BOTTLENECK: 'performance_bottleneck',

  // 📈 LOGGING & OBSERVABILITY
  LOGGING_INSUFFICIENT: 'insufficient_logging',
  LOG_LEVEL_WRONG: 'wrong_log_level',
  PII_IN_LOGS: 'pii_exposure_in_logs',
  MONITORING_MISSING: 'monitoring_missing',
  TRACING_MISSING: 'distributed_tracing_missing',

  // 🧪 TEST COVERAGE & RELIABILITY
  TEST_MISSING: 'test_missing',
  LOW_TEST_COVERAGE: 'low_test_coverage',
  TEST_NOT_ISOLATED: 'test_not_isolated',
  MOCKING_ISSUE: 'mocking_issue',
  CI_PIPELINE_MISSING: 'ci_pipeline_missing',

  // 📦 DEPENDENCIES & LICENSING
  VULNERABLE_DEP: 'vulnerable_dependency',
  LICENSE_CONFLICT: 'license_conflict',
  LEGAL_RISK: 'legal_risk',

  // 📜 COMPLIANCE & STANDARDS
  GDPR_VIOLATION: 'gdpr_violation',
  COMPLIANCE_ISSUE: 'compliance_issue',
  PRIVACY_POLICY_MISSING: 'privacy_policy_missing',
  VERSIONING_ISSUE: 'versioning_issue',

  // 🔄 DEPLOYMENT & CI/CD
  DEPLOYMENT_SECURITY: 'deployment_security_issue',
  SECRET_EXPOSURE: 'secret_exposure',
  ROLLBACK_MISSING: 'rollback_missing',
  ENVIRONMENT_ISSUE: 'environment_separation_issue',

  // 🔍 UX & ACCESSIBILITY
  UX_ISSUE: 'ux_issue',
  ACCESSIBILITY_ISSUE: 'accessibility_issue',
  MOBILE_COMPATIBILITY: 'mobile_compatibility_issue',
  CONTRAST_ISSUE: 'contrast_issue',

  // 🧠 DOCUMENTATION
  DOCUMENTATION_MISSING: 'documentation_missing',
  API_DOC_MISSING: 'api_documentation_missing',
  USER_DOC_MISSING: 'user_documentation_missing',
  ARCH_DOC_MISSING: 'architecture_documentation_missing',

  // 🏗️ ARCHITECTURE ANALYSIS (New)
  SRP_VIOLATION: 'srp_violation',
  TOO_MANY_METHODS: 'too_many_methods',
  OCP_VIOLATION_SWITCH: 'ocp_violation_switch',
  OCP_VIOLATION_IFELSE: 'ocp_violation_ifelse',
  LSP_VIOLATION_EMPTY_OVERRIDE: 'lsp_violation_empty_override',
  LSP_VIOLATION_TYPE_CHECK: 'lsp_violation_type_check',
  ISP_VIOLATION: 'isp_violation',
  DIP_VIOLATION: 'dip_violation',
  MISSING_DEPENDENCY_INJECTION: 'missing_dependency_injection',
  DOMAIN_DEPENDENCY_VIOLATION: 'domain_dependency_violation',
  APPLICATION_DEPENDENCY_VIOLATION: 'application_dependency_violation',
  HIGH_COUPLING: 'high_coupling',
  LOW_COHESION: 'low_cohesion',
  LAYER_SKIP_VIOLATION: 'layer_skip_violation',
  MISSING_DOMAIN_LAYER: 'missing_domain_layer',
  MISSING_APPLICATION_LAYER: 'missing_application_layer',
  MISSING_DDD_ENTITIES: 'missing_ddd_entities',
  MISSING_DDD_VALUE_OBJECTS: 'missing_ddd_value_objects',
  MISSING_CIRCUIT_BREAKER: 'missing_circuit_breaker',
  EVENTS_WITHOUT_HANDLERS: 'events_without_handlers',
  EVENT_SOURCING_WITHOUT_STORE: 'event_sourcing_without_store',
  K8S_MISSING_RESOURCES: 'k8s_missing_resources',
  K8S_MISSING_HEALTH_CHECKS: 'k8s_missing_health_checks',
  MAIN_PACKAGE_MISUSE: 'main_package_misuse',
  MISSING_GO_INTERFACES: 'missing_go_interfaces',
  MISSING_PYTHON_ABC: 'missing_python_abc',
  MISSING_JAVA_PACKAGE: 'missing_java_package',
  MISSING_CSHARP_NAMESPACE: 'missing_csharp_namespace',
  LARGE_REACT_COMPONENT: 'large_react_component',
  REACT_PROP_DRILLING: 'react_prop_drilling',
  MISSING_TYPESCRIPT_CONTRACTS: 'missing_typescript_contracts',
  OBSERVER_PATTERN_DETECTED: 'observer_pattern_detected',
  STRATEGY_PATTERN_DETECTED: 'strategy_pattern_detected',
  FACTORY_PATTERN_DETECTED: 'factory_pattern_detected',
  COMMAND_PATTERN_DETECTED: 'command_pattern_detected',
  INCOMPLETE_BUILDER_PATTERN: 'incomplete_builder_pattern',
  DECORATOR_WITHOUT_INTERFACE: 'decorator_without_interface',
  OBSERVER_WITHOUT_UNSUBSCRIBE: 'observer_without_unsubscribe',
  COMPLEX_STATE_MANAGEMENT: 'complex_state_management',
  SINGLETON_PATTERN_DETECTED: 'singleton_pattern_detected',

  // 📱 MOBILE & CROSS-PLATFORM ANALYSIS
  // React Native Issues
  MISSING_PLATFORM_CHECK: 'missing_platform_check',
  MISSING_SAFE_AREA: 'missing_safe_area',
  HARDCODED_DIMENSIONS: 'hardcoded_dimensions',
  MISSING_KEYBOARD_HANDLING: 'missing_keyboard_handling',
  
  // PWA Issues
  MISSING_SERVICE_WORKER: 'missing_service_worker',
  MISSING_INSTALL_PROMPT: 'missing_install_prompt',
  MISSING_PWA_MANIFEST: 'missing_pwa_manifest',
  MISSING_MANIFEST_FIELD: 'missing_manifest_field',
  MISSING_ICON_SIZE: 'missing_icon_size',
  MISSING_PWA_DEPENDENCIES: 'missing_pwa_dependencies',
  
  // Responsive Design Issues
  MISSING_RESPONSIVE_HOOKS: 'missing_responsive_hooks',
  DESKTOP_FIRST_APPROACH: 'desktop_first_approach',
  NON_STANDARD_BREAKPOINTS: 'non_standard_breakpoints',
  EXCESSIVE_PX_UNITS: 'excessive_px_units',
  NOT_MOBILE_FIRST: 'not_mobile_first',
  
  // Mobile Performance Issues
  HEAVY_LIBRARY_IMPORT: 'heavy_library_import',
  MISSING_LAZY_LOADING: 'missing_lazy_loading',
  MISSING_VIRTUALIZATION: 'missing_virtualization',
  
  // Touch & Interaction Issues
  MISSING_TOUCH_FEEDBACK: 'missing_touch_feedback',
  MISSING_GESTURE_HANDLING: 'missing_gesture_handling',
  SMALL_TOUCH_TARGET: 'small_touch_target',
  MISSING_ORIENTATION_HANDLING: 'missing_orientation_handling',
  
  // Viewport & Meta Issues
  MISSING_VIEWPORT_META: 'missing_viewport_meta',
  INCORRECT_VIEWPORT_WIDTH: 'incorrect_viewport_width',
  MISSING_INITIAL_SCALE: 'missing_initial_scale',
  MISSING_APPLE_META: 'missing_apple_meta',
  
  // Native Mobile Issues
  MISSING_AUTO_LAYOUT: 'missing_auto_layout',
  MISSING_ACCESSIBILITY_SWIFT: 'missing_accessibility_swift',
  NON_RESPONSIVE_ANDROID_LAYOUT: 'non_responsive_android_layout',
  MISSING_CONTENT_DESCRIPTION: 'missing_content_description',
  NON_RESPONSIVE_FLUTTER_WIDGET: 'non_responsive_flutter_widget',
  MISSING_FLUTTER_SEMANTICS: 'missing_flutter_semantics',
  
  // Cross-Platform Issues
  MISSING_RESPONSIVE_FLUTTER: 'missing_responsive_flutter',
  MISSING_MOBILE_TESTING: 'missing_mobile_testing',

  // Mobile Accessibility Issues
  MISSING_MOBILE_A11Y: 'missing_mobile_a11y',
  MISSING_ARIA_LABELS: 'missing_aria_labels',
  MISSING_SEMANTIC_HTML: 'missing_semantic_html',
  MISSING_FOCUS_MANAGEMENT: 'missing_focus_management',

  // Network & Connectivity Issues
  MISSING_OFFLINE_HANDLING: 'missing_offline_handling',
  MISSING_NETWORK_RETRY: 'missing_network_retry',
  MISSING_CONNECTION_CHECK: 'missing_connection_check',
  MISSING_CACHE_STRATEGY: 'missing_cache_strategy',

  // Battery & Performance Issues
  BATTERY_DRAIN_RISK: 'battery_drain_risk',
  EXCESSIVE_ANIMATIONS: 'excessive_animations',
  MISSING_RAF: 'missing_request_animation_frame',
  BACKGROUND_PROCESSING: 'background_processing_issue',

  // Mobile Security Issues
  MISSING_CSP_MOBILE: 'missing_csp_mobile',
  INSECURE_MOBILE_STORAGE: 'insecure_mobile_storage',
  MISSING_CERT_PINNING: 'missing_cert_pinning',
  MISSING_DATA_ENCRYPTION: 'missing_data_encryption',

  // Cross-Platform State Management
  INCONSISTENT_STATE: 'inconsistent_state_management',
  MISSING_STATE_ABSTRACTION: 'missing_state_abstraction',
  PLATFORM_SPECIFIC_STATE: 'platform_specific_state',
} as const;

export type IssueTypeKeys = typeof IssueTypes[keyof typeof IssueTypes];

// Analysis Severity Filter
export interface SeverityFilter {
  includeCritical: boolean;
  includeHigh: boolean;
  includeMedium: boolean;
  includeLow: boolean;
  includeInfo: boolean;
}

// Analysis Strictness Level
export type StrictnessLevel = 
  | 'blocking_only'    // Sadece kritik hatalar
  | 'production'       // Critical + High
  | 'quality'          // Critical + High + Medium
  | 'complete'         // Tüm seviyeler
  | 'custom';          // Özel ayarlar

// Enhanced Analysis Configuration
export interface EnhancedAnalysisConfig {
  // Analyzer Selection (tüm 15 analyzer kullanılabilir)
  enabledAnalyzers: string[];
  
  // Severity Filtering
  strictnessLevel: StrictnessLevel;
  severityFilter: SeverityFilter;
  
  // Performance Settings
  timeLimit?: number;
  maxIssuesPerFile?: number;
  
  // Custom Rules
  customRules?: Record<string, any>;
  
  // Output Preferences
  groupByFile: boolean;
  showFixSuggestions: boolean;
  includeMetrics: boolean;
}

// Predefined Strictness Presets
export const StrictnessPresets: Record<StrictnessLevel, SeverityFilter> = {
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

// Predefined Analysis Profiles
export const AnalysisProfiles: Record<string, EnhancedAnalysisConfig> = {
  blocking_only: {
    enabledAnalyzers: [
      'security', 'error_handling', 'code_quality', 
      'dependencies', 'architecture'
    ],
    strictnessLevel: 'blocking_only',
    severityFilter: StrictnessPresets.blocking_only,
    timeLimit: 60,
    maxIssuesPerFile: 10,
    groupByFile: true,
    showFixSuggestions: true,
    includeMetrics: false,
  },
  production_ready: {
    enabledAnalyzers: [
      'security', 'performance', 'error_handling', 
      'code_quality', 'testing', 'dependencies',
      'architecture', 'database', 'api_design'
    ],
    strictnessLevel: 'production',
    severityFilter: StrictnessPresets.production,
    timeLimit: 300,
    maxIssuesPerFile: 50,
    groupByFile: true,
    showFixSuggestions: true,
    includeMetrics: true,
  },
  quality_focused: {
    enabledAnalyzers: [
      'code_quality', 'testing', 'documentation', 
      'architecture', 'performance', 'error_handling',
      'dependencies', 'logging'
    ],
    strictnessLevel: 'quality',
    severityFilter: StrictnessPresets.quality,
    timeLimit: 600,
    maxIssuesPerFile: 100,
    groupByFile: false,
    showFixSuggestions: true,
    includeMetrics: true,
  },
  comprehensive: {
    enabledAnalyzers: [
      'security', 'performance', 'code_quality', 'testing',
      'documentation', 'error_handling', 'logging', 'dependencies',
      'architecture', 'database', 'api_design', 'accessibility',
      'ai_hallucinations', 'compliance', 'mobile_crossplatform'
    ],
    strictnessLevel: 'complete',
    severityFilter: StrictnessPresets.complete,
    timeLimit: 1200,
    maxIssuesPerFile: -1, // No limit
    groupByFile: false,
    showFixSuggestions: true,
    includeMetrics: true,
  },
};

// Severity Level Descriptions
export const SeverityDescriptions: Record<string, string> = {
  critical: 'Programın çalışmasını engelleyen kritik hatalar',
  high: 'Ciddi sorunlar, production\'da risk oluşturabilir',
  medium: 'Orta seviye sorunlar, kod kalitesini etkiler',
  low: 'Küçük iyileştirmeler ve öneriler',
  info: 'Bilgilendirme amaçlı notlar ve ipuçları',
};

// Strictness Level Descriptions
export const StrictnessDescriptions: Record<StrictnessLevel, string> = {
  blocking_only: '🚨 Sadece Kritik - Programı çökerten hatalar',
  production: '🔥 Production Hazır - Kritik + Yüksek seviye',
  quality: '✨ Kalite Odaklı - Orta seviyeye kadar',
  complete: '🔍 Kapsamlı - Tüm seviyeler dahil',
  custom: '⚙️ Özel - Kullanıcı tanımlı ayarlar',
};

// Helper function to check if issue should be included
export function shouldIncludeIssue(severityFilter: SeverityFilter, severity: string): boolean {
  switch (severity) {
    case 'critical':
      return severityFilter.includeCritical;
    case 'high':
      return severityFilter.includeHigh;
    case 'medium':
      return severityFilter.includeMedium;
    case 'low':
      return severityFilter.includeLow;
    case 'info':
      return severityFilter.includeInfo;
    default:
      return false;
  }
}

// Helper function to get analyzer count by profile
export function getAnalyzerCount(profileName: string): number {
  const profile = AnalysisProfiles[profileName];
  return profile ? profile.enabledAnalyzers.length : 0;
}

// Helper function to get estimated time by profile
export function getEstimatedTime(profileName: string): string {
  const profile = AnalysisProfiles[profileName];
  if (!profile) return 'Bilinmiyor';
  
  const minutes = Math.floor(profile.timeLimit! / 60);
  if (minutes < 1) return '< 1 dakika';
  return `~${minutes} dakika`;
}

// Helper function to filter issues by severity
export function filterIssuesBySeverity(issues: Issue[], severityFilter: SeverityFilter): Issue[] {
  return issues.filter(issue => shouldIncludeIssue(severityFilter, issue.severity));
} 