package types

import (
	"fmt"
	"time"
)

// FileInfo represents a scanned file
type FileInfo struct {
	Path      string   `json:"path"`
	Name      string   `json:"name"`
	Extension string   `json:"extension"`
	Content   string   `json:"content,omitempty"`
	Imports   []string `json:"imports"`
	Size      int64    `json:"size"`
}

// ScanResult represents the result of project scanning
type ScanResult struct {
	ProjectPath   string      `json:"project_path"`
	ScanType      string      `json:"scan_type,omitempty"`
	AnalyzersUsed []string    `json:"analyzers_used"`
	Files         []FileInfo  `json:"files"`
	Issues        []Issue     `json:"issues"`
	Summary       ScanSummary `json:"summary"`
	ScannedAt     time.Time   `json:"scanned_at"`
}

// Issue represents a detected problem
type Issue struct {
	Type        string `json:"type"`
	Severity    string `json:"severity"`
	Description string `json:"description"`
	File        string `json:"file"`
	Line        int    `json:"line,omitempty"`
	Suggestion  string `json:"suggestion,omitempty"`
}

// ScanSummary provides overview statistics
type ScanSummary struct {
	TotalFiles     int `json:"total_files"`
	JSFiles        int `json:"js_files"`
	TSFiles        int `json:"ts_files"`
	IssuesFound    int `json:"issues_found"`
	CriticalIssues int `json:"critical_issues"`
	MissingFiles   int `json:"missing_files"`
}

// PatternRule defines detection rules
type PatternRule struct {
	Name        string   `json:"name"`
	FilePattern string   `json:"file_pattern"`
	Missing     []string `json:"missing"`
	Severity    string   `json:"severity"`
	Description string   `json:"description"`
}

// Severity levels
const (
	SeverityLow      = "low"
	SeverityMedium   = "medium"
	SeverityHigh     = "high"
	SeverityCritical = "critical"
	SeverityInfo     = "info"
)

// Issue types
const (
	// Basic AI error patterns
	IssueTypeMissingAuth       = "missing_auth_context"
	IssueTypeAPINoSchema       = "api_no_schema"
	IssueTypeReduxNoStore      = "redux_no_store"
	IssueTypeRouterNoRoutes    = "router_no_routes"
	IssueTypeMissingDependency = "missing_package_dependency"

	// AI hallucination patterns
	IssueTypeDuplicateEntities = "duplicate_entity_files"
	IssueTypeDBColumnMismatch  = "database_column_mismatch"
	IssueTypeIndexMissing      = "database_index_missing"
	IssueTypeMultipleServices  = "multiple_same_services"
	IssueTypeConfigConflict    = "config_file_conflict"

	// Advanced AI error patterns
	IssueTypeWrongImport       = "wrong_import_statement"
	IssueTypeMissingImport     = "missing_required_import"
	IssueTypeTypeError         = "typescript_type_error"
	IssueTypeWrongDirectory    = "wrong_directory_structure"
	IssueTypeIgnoredSharedType = "ignored_shared_types"
	IssueTypeIntegrationError  = "backend_frontend_integration_error"
	IssueTypeUnusedDependency  = "unused_dependency"

	// 🔒 SECURITY ANALYSIS
	IssueTypeInputValidation    = "input_validation_missing"
	IssueTypeSQLInjection       = "sql_injection_risk"
	IssueTypeXSSVulnerability   = "xss_vulnerability"
	IssueTypeCSRFVulnerability  = "csrf_vulnerability"
	IssueTypeAuthWeakness       = "authentication_weakness"
	IssueTypeAuthzMissing       = "authorization_missing"
	IssueTypeInsecureStorage    = "insecure_data_storage"
	IssueTypeInsecureAPI        = "insecure_api_call"
	IssueTypeHTTPSMissing       = "https_missing"
	IssueTypeOutdatedDep        = "outdated_dependency"
	IssueTypeSessionIssue       = "session_management_issue"
	IssueTypeSecurityLogMissing = "security_logging_missing"
	IssueTypeRateLimitMissing   = "rate_limiting_missing"

	// 🧪 CODE QUALITY ANALYSIS
	IssueTypeCodeDuplication            = "code_duplication"
	IssueTypeHighComplexity             = "high_cyclomatic_complexity"
	IssueTypePoorReadability            = "poor_code_readability"
	IssueTypeSOLIDViolation             = "solid_principle_violation"
	IssueTypeCommentIssue               = "comment_issue"
	IssueTypeRefactorNeeded             = "refactor_needed"
	IssueTypeTestabilityIssue           = "testability_issue"
	IssueTypeDesignPatternMissing       = "design_pattern_missing"
	IssueTypeDependencyInjectionMissing = "dependency_injection_missing"

	// 🧯 PERFORMANCE ANALYSIS
	IssueTypePerformanceIssue = "performance_issue"
	IssueTypeCachingMissing   = "caching_missing"
	IssueTypeMemoryLeak       = "memory_leak_risk"
	IssueTypeSlowQuery        = "slow_database_query"
	IssueTypeSlowResponse     = "slow_response_time"
	IssueTypeBottleneck       = "performance_bottleneck"

	// 📈 LOGGING & OBSERVABILITY
	IssueTypeLoggingInsufficient = "insufficient_logging"
	IssueTypeLogLevelWrong       = "wrong_log_level"
	IssueTypePIIInLogs           = "pii_exposure_in_logs"
	IssueTypeMonitoringMissing   = "monitoring_missing"
	IssueTypeTracingMissing      = "distributed_tracing_missing"

	// 🧪 TEST COVERAGE & RELIABILITY
	IssueTypeTestMissing       = "test_missing"
	IssueTypeLowTestCoverage   = "low_test_coverage"
	IssueTypeTestNotIsolated   = "test_not_isolated"
	IssueTypeMockingIssue      = "mocking_issue"
	IssueTypeCIPipelineMissing = "ci_pipeline_missing"

	// 📦 DEPENDENCIES & LICENSING
	IssueTypeVulnerableDep   = "vulnerable_dependency"
	IssueTypeLicenseConflict = "license_conflict"
	IssueTypeLegalRisk       = "legal_risk"

	// 📜 COMPLIANCE & STANDARDS
	IssueTypeGDPRViolation        = "gdpr_violation"
	IssueTypeComplianceIssue      = "compliance_issue"
	IssueTypePrivacyPolicyMissing = "privacy_policy_missing"
	IssueTypeVersioningIssue      = "versioning_issue"

	// 🔄 DEPLOYMENT & CI/CD
	IssueTypeDeploymentSecurity = "deployment_security_issue"
	IssueTypeSecretExposure     = "secret_exposure"
	IssueTypeRollbackMissing    = "rollback_missing"
	IssueTypeEnvironmentIssue   = "environment_separation_issue"

	// 🔍 UX & ACCESSIBILITY
	IssueTypeUXIssue             = "ux_issue"
	IssueTypeAccessibilityIssue  = "accessibility_issue"
	IssueTypeMobileCompatibility = "mobile_compatibility_issue"
	IssueTypeContrastIssue       = "contrast_issue"

	// 🧠 DOCUMENTATION
	IssueTypeDocumentationMissing    = "documentation_missing"
	IssueTypeDocumentationQuality    = "documentation_quality_issue"
	IssueTypeAPIDocMissing           = "api_documentation_missing"
	IssueTypeAPIDocumentationMissing = "api_documentation_missing"
	IssueTypeUserDocMissing          = "user_documentation_missing"
	IssueTypeArchDocMissing          = "architecture_documentation_missing"

	// 🚨 ERROR HANDLING
	IssueTypeErrorHandling = "error_handling_issue"

	// 🤖 ENHANCED AI HALLUCINATION PATTERNS
	IssueTypeInconsistentNaming       = "inconsistent_naming_pattern"
	IssueTypeAIPlaceholder            = "ai_generated_placeholder"
	IssueTypeUnusedImport             = "unused_import"
	IssueTypeIncompleteImplementation = "incomplete_implementation"
	IssueTypeFrameworkMismatch        = "framework_mismatch"
	IssueTypeOverEngineering          = "over_engineering"
	IssueTypeMissingAuthContext       = "missing_auth_context"
	IssueTypeDeprecatedImport         = "deprecated_import"

	// 🌐 API DESIGN PATTERNS
	IssueTypeAPIDesign               = "api_design_issue"
	IssueTypeMissingAPIVersioning    = "missing_api_versioning"
	IssueTypeMissingPagination       = "missing_pagination"
	IssueTypeCachingMissingAPI       = "caching_missing_api"
	IssueTypeInsecureAPIDesign       = "insecure_api_design"
	IssueTypePerformanceIssueAPI     = "performance_issue_api"
	IssueTypeArchitectureIssue       = "architecture_issue"
	IssueTypeGraphQLIssue            = "graphql_issue"
	IssueTypeMicroservicesIssue      = "microservices_issue"
	IssueTypeRESTComplianceIssue     = "rest_compliance_issue"
	IssueTypeAPIConsistencyIssue     = "api_consistency_issue"
	IssueTypeContentNegotiationIssue = "content_negotiation_issue"
	IssueTypeAsyncPatternMissing     = "async_pattern_missing"
	IssueTypeSecurityHeadersMissing  = "security_headers_missing"

	// 🏗️ ARCHITECTURE ANALYSIS (New)
	IssueTypeSRPViolation                   = "srp_violation"
	IssueTypeTooManyMethods                 = "too_many_methods"
	IssueTypeOCPViolationSwitch             = "ocp_violation_switch"
	IssueTypeOCPViolationIfElse             = "ocp_violation_ifelse"
	IssueTypeLSPViolationEmptyOverride      = "lsp_violation_empty_override"
	IssueTypeLSPViolationTypeCheck          = "lsp_violation_type_check"
	IssueTypeISPViolation                   = "isp_violation"
	IssueTypeDIPViolation                   = "dip_violation"
	IssueTypeMissingDependencyInjection     = "missing_dependency_injection"
	IssueTypeDomainDependencyViolation      = "domain_dependency_violation"
	IssueTypeApplicationDependencyViolation = "application_dependency_violation"
	IssueTypeHighCoupling                   = "high_coupling"
	IssueTypeLowCohesion                    = "low_cohesion"
	IssueTypeLayerSkipViolation             = "layer_skip_violation"
	IssueTypeMissingDomainLayer             = "missing_domain_layer"
	IssueTypeMissingApplicationLayer        = "missing_application_layer"
	IssueTypeMissingDDDEntities             = "missing_ddd_entities"
	IssueTypeMissingDDDValueObjects         = "missing_ddd_value_objects"
	IssueTypeMissingCircuitBreaker          = "missing_circuit_breaker"
	IssueTypeEventsWithoutHandlers          = "events_without_handlers"
	IssueTypeEventSourcingWithoutStore      = "event_sourcing_without_store"
	IssueTypeK8sMissingResources            = "k8s_missing_resources"
	IssueTypeK8sMissingHealthChecks         = "k8s_missing_health_checks"
	IssueTypeMainPackageMisuse              = "main_package_misuse"
	IssueTypeMissingGoInterfaces            = "missing_go_interfaces"
	IssueTypeMissingPythonABC               = "missing_python_abc"
	IssueTypeMissingJavaPackage             = "missing_java_package"
	IssueTypeMissingCSharpNamespace         = "missing_csharp_namespace"
	IssueTypeLargeReactComponent            = "large_react_component"
	IssueTypeReactPropDrilling              = "react_prop_drilling"
	IssueTypeMissingTypescriptContracts     = "missing_typescript_contracts"
	IssueTypeObserverPatternDetected        = "observer_pattern_detected"
	IssueTypeStrategyPatternDetected        = "strategy_pattern_detected"
	IssueTypeFactoryPatternDetected         = "factory_pattern_detected"
	IssueTypeCommandPatternDetected         = "command_pattern_detected"
	IssueTypeIncompleteBuilderPattern       = "incomplete_builder_pattern"
	IssueTypeDecoratorWithoutInterface      = "decorator_without_interface"
	IssueTypeObserverWithoutUnsubscribe     = "observer_without_unsubscribe"
	IssueTypeComplexStateManagement         = "complex_state_management"
	IssueTypeSingletonPatternDetected       = "singleton_pattern_detected"

	// 📱 MOBILE & CROSS-PLATFORM ANALYSIS
	// React Native Issues
	IssueTypeMissingPlatformCheck    = "missing_platform_check"
	IssueTypeMissingSafeArea         = "missing_safe_area"
	IssueTypeHardcodedDimensions     = "hardcoded_dimensions"
	IssueTypeMissingKeyboardHandling = "missing_keyboard_handling"

	// PWA Issues
	IssueTypeMissingServiceWorker   = "missing_service_worker"
	IssueTypeMissingInstallPrompt   = "missing_install_prompt"
	IssueTypeMissingPWAManifest     = "missing_pwa_manifest"
	IssueTypeMissingManifestField   = "missing_manifest_field"
	IssueTypeMissingIconSize        = "missing_icon_size"
	IssueTypeMissingPWADependencies = "missing_pwa_dependencies"

	// Responsive Design Issues
	IssueTypeMissingResponsiveHooks = "missing_responsive_hooks"
	IssueTypeDesktopFirstApproach   = "desktop_first_approach"
	IssueTypeNonStandardBreakpoints = "non_standard_breakpoints"
	IssueTypeExcessivePxUnits       = "excessive_px_units"
	IssueTypeNotMobileFirst         = "not_mobile_first"

	// Mobile Performance Issues
	IssueTypeHeavyLibraryImport    = "heavy_library_import"
	IssueTypeMissingLazyLoading    = "missing_lazy_loading"
	IssueTypeMissingVirtualization = "missing_virtualization"

	// Touch & Interaction Issues
	IssueTypeMissingTouchFeedback       = "missing_touch_feedback"
	IssueTypeMissingGestureHandling     = "missing_gesture_handling"
	IssueTypeSmallTouchTarget           = "small_touch_target"
	IssueTypeMissingOrientationHandling = "missing_orientation_handling"

	// Viewport & Meta Issues
	IssueTypeMissingViewportMeta    = "missing_viewport_meta"
	IssueTypeIncorrectViewportWidth = "incorrect_viewport_width"
	IssueTypeMissingInitialScale    = "missing_initial_scale"
	IssueTypeMissingAppleMeta       = "missing_apple_meta"

	// Native Mobile Issues
	IssueTypeMissingAutoLayout          = "missing_auto_layout"
	IssueTypeMissingAccessibilitySwift  = "missing_accessibility_swift"
	IssueTypeNonResponsiveAndroidLayout = "non_responsive_android_layout"
	IssueTypeMissingContentDescription  = "missing_content_description"
	IssueTypeNonResponsiveFlutterWidget = "non_responsive_flutter_widget"
	IssueTypeMissingFlutterSemantics    = "missing_flutter_semantics"

	// Cross-Platform Issues
	IssueTypeMissingResponsiveFlutter = "missing_responsive_flutter"
	IssueTypeMissingMobileTesting     = "missing_mobile_testing"

	// Mobile Accessibility Issues
	IssueTypeMissingMobileA11y      = "missing_mobile_a11y"
	IssueTypeMissingAriaLabels      = "missing_aria_labels"
	IssueTypeMissingSemanticHTML    = "missing_semantic_html"
	IssueTypeMissingFocusManagement = "missing_focus_management"

	// Network & Connectivity Issues
	IssueTypeMissingOfflineHandling = "missing_offline_handling"
	IssueTypeMissingNetworkRetry    = "missing_network_retry"
	IssueTypeMissingConnectionCheck = "missing_connection_check"
	IssueTypeMissingCacheStrategy   = "missing_cache_strategy"

	// Battery & Performance Issues
	IssueTypeBatteryDrainRisk     = "battery_drain_risk"
	IssueTypeExcessiveAnimations  = "excessive_animations"
	IssueTypeMissingRAF           = "missing_request_animation_frame"
	IssueTypeBackgroundProcessing = "background_processing_issue"

	// Mobile Security Issues
	IssueTypeMissingCSPMobile      = "missing_csp_mobile"
	IssueTypeInsecureMobileStorage = "insecure_mobile_storage"
	IssueTypeMissingCertPinning    = "missing_cert_pinning"
	IssueTypeMissingDataEncryption = "missing_data_encryption"

	// Cross-Platform State Management
	IssueTypeInconsistentState       = "inconsistent_state_management"
	IssueTypeMissingStateAbstraction = "missing_state_abstraction"
	IssueTypePlatformSpecificState   = "platform_specific_state"

	// 🔒 LANGUAGE-SPECIFIC SECURITY ISSUES
	// JavaScript/TypeScript Security
	IssueTypeCodeInjection      = "code_injection"
	IssueTypePrototypePollution = "prototype_pollution"
	IssueTypeRegexDOS           = "regex_dos"

	// Go Security
	IssueTypePathTraversal = "path_traversal"
	IssueTypeRaceCondition = "race_condition"

	// General Security
	IssueTypeDeserialization  = "unsafe_deserialization"
	IssueTypeXXE              = "xxe_vulnerability"
	IssueTypeReflection       = "reflection_usage"
	IssueTypeFileInclusion    = "file_inclusion"
	IssueTypeSessionFixation  = "session_fixation"
	IssueTypeMassAssignment   = "mass_assignment"
	IssueTypeBufferOverflow   = "buffer_overflow"
	IssueTypeFormatString     = "format_string_vulnerability"
	IssueTypeUnsafeCode       = "unsafe_code"
	IssueTypePanicRisk        = "panic_risk"
	IssueTypeNullPointer      = "null_pointer_risk"
	IssueTypeForceUnwrap      = "force_unwrap_risk"
	IssueTypeCommandInjection = "command_injection"
)

// Analysis Severity Filter
type SeverityFilter struct {
	IncludeCritical bool `json:"include_critical"`
	IncludeHigh     bool `json:"include_high"`
	IncludeMedium   bool `json:"include_medium"`
	IncludeLow      bool `json:"include_low"`
	IncludeInfo     bool `json:"include_info"`
}

// Analysis Strictness Level
type StrictnessLevel string

const (
	StrictnessBlockingOnly StrictnessLevel = "blocking_only" // Sadece kritik hatalar
	StrictnessProduction   StrictnessLevel = "production"    // Critical + High
	StrictnessQuality      StrictnessLevel = "quality"       // Critical + High + Medium
	StrictnessComplete     StrictnessLevel = "complete"      // Tüm seviyeler
	StrictnessCustom       StrictnessLevel = "custom"        // Özel ayarlar
)

// Predefined Strictness Presets
var StrictnessPresets = map[StrictnessLevel]SeverityFilter{
	StrictnessBlockingOnly: {
		IncludeCritical: true,
		IncludeHigh:     false,
		IncludeMedium:   false,
		IncludeLow:      false,
		IncludeInfo:     false,
	},
	StrictnessProduction: {
		IncludeCritical: true,
		IncludeHigh:     true,
		IncludeMedium:   false,
		IncludeLow:      false,
		IncludeInfo:     false,
	},
	StrictnessQuality: {
		IncludeCritical: true,
		IncludeHigh:     true,
		IncludeMedium:   true,
		IncludeLow:      false,
		IncludeInfo:     false,
	},
	StrictnessComplete: {
		IncludeCritical: true,
		IncludeHigh:     true,
		IncludeMedium:   true,
		IncludeLow:      true,
		IncludeInfo:     true,
	},
}

// Enhanced Analysis Configuration
type EnhancedAnalysisConfig struct {
	// Analyzer Selection (tüm 15 analyzer kullanılabilir)
	EnabledAnalyzers []string `json:"enabled_analyzers"`

	// Severity Filtering
	StrictnessLevel StrictnessLevel `json:"strictness_level"`
	SeverityFilter  SeverityFilter  `json:"severity_filter"`

	// Performance Settings
	TimeLimit        int `json:"time_limit_seconds,omitempty"`
	MaxIssuesPerFile int `json:"max_issues_per_file,omitempty"`

	// Custom Rules
	CustomRules map[string]interface{} `json:"custom_rules,omitempty"`

	// Output Preferences
	GroupByFile        bool `json:"group_by_file"`
	ShowFixSuggestions bool `json:"show_fix_suggestions"`
	IncludeMetrics     bool `json:"include_metrics"`
}

// Predefined Analysis Profiles
var AnalysisProfiles = map[string]EnhancedAnalysisConfig{
	"blocking_only": {
		EnabledAnalyzers: []string{
			"security", "error_handling", "code_quality",
			"dependencies", "architecture",
		},
		StrictnessLevel:    StrictnessBlockingOnly,
		SeverityFilter:     StrictnessPresets[StrictnessBlockingOnly],
		TimeLimit:          60,
		MaxIssuesPerFile:   10,
		GroupByFile:        true,
		ShowFixSuggestions: true,
		IncludeMetrics:     false,
	},
	"production_ready": {
		EnabledAnalyzers: []string{
			"security", "performance", "error_handling",
			"code_quality", "testing", "dependencies",
			"architecture", "database", "api_design",
		},
		StrictnessLevel:    StrictnessProduction,
		SeverityFilter:     StrictnessPresets[StrictnessProduction],
		TimeLimit:          300,
		MaxIssuesPerFile:   50,
		GroupByFile:        true,
		ShowFixSuggestions: true,
		IncludeMetrics:     true,
	},
	"quality_focused": {
		EnabledAnalyzers: []string{
			"code_quality", "testing", "documentation",
			"architecture", "performance", "error_handling",
			"dependencies", "logging",
		},
		StrictnessLevel:    StrictnessQuality,
		SeverityFilter:     StrictnessPresets[StrictnessQuality],
		TimeLimit:          600,
		MaxIssuesPerFile:   100,
		GroupByFile:        false,
		ShowFixSuggestions: true,
		IncludeMetrics:     true,
	},
	"comprehensive": {
		EnabledAnalyzers: []string{
			"security", "performance", "code_quality", "testing",
			"documentation", "error_handling", "logging", "dependencies",
			"architecture", "database", "api_design", "accessibility",
			"ai_hallucinations", "compliance", "mobile_crossplatform",
		},
		StrictnessLevel:    StrictnessComplete,
		SeverityFilter:     StrictnessPresets[StrictnessComplete],
		TimeLimit:          1200,
		MaxIssuesPerFile:   -1, // No limit
		GroupByFile:        false,
		ShowFixSuggestions: true,
		IncludeMetrics:     true,
	},
}

// Severity Level Descriptions
var SeverityDescriptions = map[string]string{
	SeverityCritical: "Programın çalışmasını engelleyen kritik hatalar",
	SeverityHigh:     "Ciddi sorunlar, production'da risk oluşturabilir",
	SeverityMedium:   "Orta seviye sorunlar, kod kalitesini etkiler",
	SeverityLow:      "Küçük iyileştirmeler ve öneriler",
	SeverityInfo:     "Bilgilendirme amaçlı notlar ve ipuçları",
}

// Strictness Level Descriptions
var StrictnessDescriptions = map[StrictnessLevel]string{
	StrictnessBlockingOnly: "🚨 Sadece Kritik - Programı çökerten hatalar",
	StrictnessProduction:   "🔥 Production Hazır - Kritik + Yüksek seviye",
	StrictnessQuality:      "✨ Kalite Odaklı - Orta seviyeye kadar",
	StrictnessComplete:     "🔍 Kapsamlı - Tüm seviyeler dahil",
	StrictnessCustom:       "⚙️ Özel - Kullanıcı tanımlı ayarlar",
}

// Helper function to check if issue should be included
func (sf SeverityFilter) ShouldInclude(severity string) bool {
	switch severity {
	case SeverityCritical:
		return sf.IncludeCritical
	case SeverityHigh:
		return sf.IncludeHigh
	case SeverityMedium:
		return sf.IncludeMedium
	case SeverityLow:
		return sf.IncludeLow
	case SeverityInfo:
		return sf.IncludeInfo
	default:
		return false
	}
}

// Helper function to get analyzer count by profile
func GetAnalyzerCount(profileName string) int {
	if profile, exists := AnalysisProfiles[profileName]; exists {
		return len(profile.EnabledAnalyzers)
	}
	return 0
}

// Helper function to get estimated time by profile
func GetEstimatedTime(profileName string) string {
	if profile, exists := AnalysisProfiles[profileName]; exists {
		minutes := profile.TimeLimit / 60
		if minutes < 1 {
			return "< 1 dakika"
		}
		return fmt.Sprintf("~%d dakika", minutes)
	}
	return "Bilinmiyor"
}
