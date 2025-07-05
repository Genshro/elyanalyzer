package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"
	"time"
	"unicode"

	"elyanalyzer/shared/types"
)

// CategoryScore represents a category-specific analysis result
type CategoryScore struct {
	CategoryID     string    `json:"category_id"`
	CategoryName   string    `json:"category_name"`
	DisplayName    string    `json:"display_name"`
	Score          float64   `json:"score"`
	MaxScore       int       `json:"max_score"`
	IssueCount     int       `json:"issue_count"`
	CriticalIssues int       `json:"critical_issues"`
	WarningIssues  int       `json:"warning_issues"`
	InfoIssues     int       `json:"info_issues"`
	Improvements   []string  `json:"improvements"`
	Trend          string    `json:"trend"`
	Icon           string    `json:"icon"`
	CreatedAt      time.Time `json:"created_at"`
}

// AnalysisScan represents a complete analysis scan
type AnalysisScan struct {
	ID             string          `json:"id"`
	ProjectID      string          `json:"project_id"`
	ScanType       string          `json:"scan_type"`
	TotalFiles     int             `json:"total_files"`
	TotalIssues    int             `json:"total_issues"`
	CriticalIssues int             `json:"critical_issues"`
	OverallScore   float64         `json:"overall_score"`
	CategoryScores []CategoryScore `json:"category_scores"`
	ScanDuration   int             `json:"scan_duration_ms"`
	Status         string          `json:"status"`
	CreatedAt      time.Time       `json:"created_at"`
}

// Achievement represents user achievements
type Achievement struct {
	ID              string    `json:"id"`
	UserID          string    `json:"user_id"`
	AchievementType string    `json:"achievement_type"`
	Category        string    `json:"category"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	Icon            string    `json:"icon"`
	EarnedAt        time.Time `json:"earned_at"`
	ProjectID       string    `json:"project_id"`
}

// MotivationalMessage represents encouraging messages for users
type MotivationalMessage struct {
	Type        string  `json:"type"`
	Category    string  `json:"category"`
	Message     string  `json:"message"`
	Icon        string  `json:"icon"`
	ScoreChange float64 `json:"score_change,omitempty"`
}

// CategoryDefinitions maps category names to their metadata
var CategoryDefinitions = map[string]CategoryScore{
	"security": {
		CategoryName: "security",
		DisplayName:  "Security Analysis",
		Icon:         "🔒",
		MaxScore:     100,
	},
	"code_quality": {
		CategoryName: "code_quality",
		DisplayName:  "Code Quality",
		Icon:         "🧪",
		MaxScore:     100,
	},
	"performance": {
		CategoryName: "performance",
		DisplayName:  "Performance",
		Icon:         "🚀",
		MaxScore:     100,
	},
	"compliance": {
		CategoryName: "compliance",
		DisplayName:  "Compliance",
		Icon:         "⚖️",
		MaxScore:     100,
	},
	"accessibility": {
		CategoryName: "accessibility",
		DisplayName:  "Accessibility",
		Icon:         "♿",
		MaxScore:     100,
	},
	"mobile_crossplatform": {
		CategoryName: "mobile_crossplatform",
		DisplayName:  "Mobile & Cross-Platform",
		Icon:         "📱",
		MaxScore:     100,
	},
	"documentation": {
		CategoryName: "documentation",
		DisplayName:  "Documentation",
		Icon:         "📚",
		MaxScore:     100,
	},
	"testing": {
		CategoryName: "testing",
		DisplayName:  "Testing",
		Icon:         "🧪",
		MaxScore:     100,
	},
	"logging": {
		CategoryName: "logging",
		DisplayName:  "Logging",
		Icon:         "📝",
		MaxScore:     100,
	},
}

// AnalysisService handles project analysis with category scoring
type AnalysisService struct {
	supabaseClient *SupabaseClient
}

// NewAnalysisService creates a new analysis service
func NewAnalysisService(supabase *SupabaseClient) *AnalysisService {
	return &AnalysisService{
		supabaseClient: supabase,
	}
}

// RunAnalysis executes the analysis engine and processes results
func (as *AnalysisService) RunAnalysis(projectPath string, projectID string, userID string) (*AnalysisScan, error) {
	startTime := time.Now()

	// Validate project path first
	if err := as.ValidateProjectPath(projectPath); err != nil {
		return nil, fmt.Errorf("invalid project path: %v", err)
	}

	// Run the analysis engine
	log.Printf("🔍 Starting analysis for project: %s", SanitizeLogData(projectPath))
	cmd := exec.Command("./analysis-engine/analysis-engine.exe", projectPath)
	output, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf("analysis engine failed: %v", err)
	}

	// Parse the analysis result
	var result types.ScanResult
	if err := json.Unmarshal(output, &result); err != nil {
		return nil, fmt.Errorf("failed to parse analysis result: %v", err)
	}

	// Calculate category scores
	categoryScores := as.calculateCategoryScores(result.Issues)

	// Calculate overall score
	overallScore := as.calculateOverallScore(categoryScores)

	// Create analysis scan record
	scan := &AnalysisScan{
		ProjectID:      projectID,
		ScanType:       "full",
		TotalFiles:     result.Summary.TotalFiles,
		TotalIssues:    result.Summary.IssuesFound,
		CriticalIssues: result.Summary.CriticalIssues,
		OverallScore:   overallScore,
		CategoryScores: categoryScores,
		ScanDuration:   int(time.Since(startTime).Milliseconds()),
		Status:         "completed",
		CreatedAt:      time.Now(),
	}

	// Save to database
	scanID, err := as.saveScanToDatabase(scan, result.Issues, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to save scan: %v", err)
	}
	scan.ID = scanID

	// Check for achievements
	achievements, err := as.checkAchievements(userID, projectID, scanID, categoryScores)
	if err != nil {
		log.Printf("Warning: Failed to check achievements: %v", err)
	} else {
		log.Printf("🏆 Checked achievements: %d new achievements", len(achievements))
	}

	log.Printf("✅ Analysis completed: %d issues found, overall score: %.1f",
		scan.TotalIssues, scan.OverallScore)

	return scan, nil
}

// calculateCategoryScores calculates scores for each category
func (as *AnalysisService) calculateCategoryScores(issues []types.Issue) []CategoryScore {
	categoryIssues := make(map[string][]types.Issue)

	// Group issues by category
	for _, issue := range issues {
		category := as.mapIssueTypeToCategory(issue.Type)
		categoryIssues[category] = append(categoryIssues[category], issue)
	}

	var categoryScores []CategoryScore

	// Calculate score for each category
	for categoryName, definition := range CategoryDefinitions {
		issues := categoryIssues[categoryName]
		score := as.calculateCategoryScore(issues, definition.MaxScore)

		criticalCount := 0
		warningCount := 0
		infoCount := 0

		for _, issue := range issues {
			switch issue.Severity {
			case types.SeverityCritical, types.SeverityHigh:
				criticalCount++
			case types.SeverityMedium:
				warningCount++
			case types.SeverityLow:
				infoCount++
			}
		}

		categoryScore := CategoryScore{
			CategoryName:   categoryName,
			DisplayName:    definition.DisplayName,
			Score:          score,
			MaxScore:       definition.MaxScore,
			IssueCount:     len(issues),
			CriticalIssues: criticalCount,
			WarningIssues:  warningCount,
			InfoIssues:     infoCount,
			Icon:           definition.Icon,
			Improvements:   as.generateImprovements(issues),
			CreatedAt:      time.Now(),
		}

		categoryScores = append(categoryScores, categoryScore)
	}

	return categoryScores
}

// mapIssueTypeToCategory maps issue types to categories
func (as *AnalysisService) mapIssueTypeToCategory(issueType string) string {
	categoryMap := map[string]string{
		// Security issues
		"input_validation_missing": "security",
		"sql_injection_risk":       "security",
		"xss_vulnerability":        "security",
		"csrf_vulnerability":       "security",
		"insecure_data_storage":    "security",
		"secret_exposure":          "security",
		"https_missing":            "security",

		// Code quality issues
		"code_duplication":           "code_quality",
		"high_cyclomatic_complexity": "code_quality",
		"solid_principle_violation":  "code_quality",
		"refactor_needed":            "code_quality",
		"typescript_type_error":      "code_quality",

		// Performance issues
		"performance_issue":      "performance",
		"memory_leak_risk":       "performance",
		"slow_database_query":    "performance",
		"caching_missing":        "performance",
		"performance_bottleneck": "performance",

		// Compliance issues
		"gdpr_violation":         "compliance",
		"compliance_issue":       "compliance",
		"privacy_policy_missing": "compliance",
		"legal_risk":             "compliance",

		// Accessibility issues
		"accessibility_issue": "accessibility",
		"contrast_issue":      "accessibility",

		// Mobile & Cross-Platform issues
		"missing_platform_check":        "mobile_crossplatform",
		"missing_safe_area":             "mobile_crossplatform",
		"hardcoded_dimensions":          "mobile_crossplatform",
		"missing_keyboard_handling":     "mobile_crossplatform",
		"missing_service_worker":        "mobile_crossplatform",
		"missing_install_prompt":        "mobile_crossplatform",
		"missing_pwa_manifest":          "mobile_crossplatform",
		"missing_manifest_field":        "mobile_crossplatform",
		"missing_icon_size":             "mobile_crossplatform",
		"missing_pwa_dependencies":      "mobile_crossplatform",
		"missing_responsive_hooks":      "mobile_crossplatform",
		"desktop_first_approach":        "mobile_crossplatform",
		"non_standard_breakpoints":      "mobile_crossplatform",
		"excessive_px_units":            "mobile_crossplatform",
		"not_mobile_first":              "mobile_crossplatform",
		"heavy_library_import":          "mobile_crossplatform",
		"missing_lazy_loading":          "mobile_crossplatform",
		"missing_virtualization":        "mobile_crossplatform",
		"missing_touch_feedback":        "mobile_crossplatform",
		"missing_gesture_handling":      "mobile_crossplatform",
		"small_touch_target":            "mobile_crossplatform",
		"missing_orientation_handling":  "mobile_crossplatform",
		"missing_viewport_meta":         "mobile_crossplatform",
		"incorrect_viewport_width":      "mobile_crossplatform",
		"missing_initial_scale":         "mobile_crossplatform",
		"missing_apple_meta":            "mobile_crossplatform",
		"missing_auto_layout":           "mobile_crossplatform",
		"missing_accessibility_swift":   "mobile_crossplatform",
		"non_responsive_android_layout": "mobile_crossplatform",
		"missing_content_description":   "mobile_crossplatform",
		"non_responsive_flutter_widget": "mobile_crossplatform",
		"missing_flutter_semantics":     "mobile_crossplatform",
		"missing_responsive_flutter":    "mobile_crossplatform",
		"missing_mobile_testing":        "mobile_crossplatform",
		"mobile_compatibility_issue":    "mobile_crossplatform",

		// Mobile Accessibility Issues
		"missing_mobile_a11y":      "mobile_crossplatform",
		"missing_aria_labels":      "mobile_crossplatform",
		"missing_semantic_html":    "mobile_crossplatform",
		"missing_focus_management": "mobile_crossplatform",

		// Network & Connectivity Issues
		"missing_offline_handling": "mobile_crossplatform",
		"missing_network_retry":    "mobile_crossplatform",
		"missing_connection_check": "mobile_crossplatform",
		"missing_cache_strategy":   "mobile_crossplatform",

		// Battery & Performance Issues
		"battery_drain_risk":              "mobile_crossplatform",
		"excessive_animations":            "mobile_crossplatform",
		"missing_request_animation_frame": "mobile_crossplatform",
		"background_processing_issue":     "mobile_crossplatform",

		// Mobile Security Issues
		"missing_csp_mobile":      "mobile_crossplatform",
		"insecure_mobile_storage": "mobile_crossplatform",
		"missing_cert_pinning":    "mobile_crossplatform",
		"missing_data_encryption": "mobile_crossplatform",

		// Cross-Platform State Management
		"inconsistent_state_management": "mobile_crossplatform",
		"missing_state_abstraction":     "mobile_crossplatform",
		"platform_specific_state":       "mobile_crossplatform",

		// Documentation issues
		"documentation_missing":       "documentation",
		"api_documentation_missing":   "documentation",
		"documentation_quality_issue": "documentation",

		// Testing issues
		"test_missing":        "testing",
		"low_test_coverage":   "testing",
		"ci_pipeline_missing": "testing",

		// Logging issues
		"insufficient_logging": "logging",
		"pii_exposure_in_logs": "logging",
		"wrong_log_level":      "logging",
		"monitoring_missing":   "logging",
	}

	if category, exists := categoryMap[issueType]; exists {
		return category
	}

	// Default to code_quality if not mapped
	return "code_quality"
}

// calculateCategoryScore calculates score based on issues
func (as *AnalysisService) calculateCategoryScore(issues []types.Issue, maxScore int) float64 {
	if len(issues) == 0 {
		return float64(maxScore) // Perfect score if no issues
	}

	// Weight issues by severity
	penalty := 0.0
	for _, issue := range issues {
		switch issue.Severity {
		case types.SeverityCritical:
			penalty += 15.0
		case types.SeverityHigh:
			penalty += 10.0
		case types.SeverityMedium:
			penalty += 5.0
		case types.SeverityLow:
			penalty += 2.0
		}
	}

	// Calculate score (ensure it doesn't go below 0)
	score := float64(maxScore) - penalty
	if score < 0 {
		score = 0
	}

	return math.Round(score*100) / 100 // Round to 2 decimal places
}

// calculateOverallScore calculates the overall project score
func (as *AnalysisService) calculateOverallScore(categoryScores []CategoryScore) float64 {
	if len(categoryScores) == 0 {
		return 0
	}

	totalScore := 0.0
	for _, score := range categoryScores {
		totalScore += score.Score
	}

	return math.Round((totalScore/float64(len(categoryScores)))*100) / 100
}

// generateImprovements generates improvement suggestions for a category
func (as *AnalysisService) generateImprovements(issues []types.Issue) []string {
	const maxImprovements = 5
	improvements := make(map[string]bool)

	// Early exit if no issues
	if len(issues) == 0 {
		return []string{}
	}

	for _, issue := range issues {
		if issue.Suggestion != "" && len(improvements) < maxImprovements*2 { // Buffer for deduplication
			improvements[issue.Suggestion] = true
		}
	}

	// Pre-allocate slice with known capacity
	result := make([]string, 0, min(len(improvements), maxImprovements))
	count := 0
	for improvement := range improvements {
		if count >= maxImprovements {
			break
		}
		result = append(result, improvement)
		count++
	}

	return result
}

// Helper function for min
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// GetCategoryHistory gets historical data for a specific category
func (as *AnalysisService) GetCategoryHistory(projectID string, categoryName string, days int) ([]CategoryScore, error) {
	// Query Supabase for category history
	endpoint := fmt.Sprintf("category_scores?project_id=eq.%s&category_name=eq.%s&created_at=gte.%s&order=created_at.desc",
		projectID, categoryName, time.Now().AddDate(0, 0, -days).Format(time.RFC3339))

	data, err := as.supabaseClient.makeRequest("GET", endpoint, nil, false)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch category history: %v", err)
	}

	var history []CategoryScore
	if err := json.Unmarshal(data, &history); err != nil {
		return nil, fmt.Errorf("failed to parse category history: %v", err)
	}

	return history, nil
}

// GetMotivationalMessages generates motivational messages based on progress
func (as *AnalysisService) GetMotivationalMessages(projectID string, categoryScores []CategoryScore) ([]MotivationalMessage, error) {
	var messages []MotivationalMessage

	for _, current := range categoryScores {
		// Get previous score for comparison
		history, err := as.GetCategoryHistory(projectID, current.CategoryName, 7)
		if err != nil || len(history) < 2 {
			continue
		}

		previous := history[1] // Second item is previous scan
		scoreChange := current.Score - previous.Score

		// Generate motivational messages based on progress
		if scoreChange > 10 {
			messages = append(messages, MotivationalMessage{
				Type:        "improvement",
				Category:    current.CategoryName,
				Message:     fmt.Sprintf("🎉 Amazing! Your %s score improved by %.1f points!", current.DisplayName, scoreChange),
				Icon:        "🎉",
				ScoreChange: scoreChange,
			})
		} else if scoreChange > 5 {
			messages = append(messages, MotivationalMessage{
				Type:        "improvement",
				Category:    current.CategoryName,
				Message:     fmt.Sprintf("💪 Great progress! %s is getting better!", current.DisplayName),
				Icon:        "💪",
				ScoreChange: scoreChange,
			})
		} else if scoreChange < -5 {
			messages = append(messages, MotivationalMessage{
				Type:        "encouragement",
				Category:    current.CategoryName,
				Message:     fmt.Sprintf("🔧 Focus needed: %s score decreased. Let's fix those issues!", current.DisplayName),
				Icon:        "🔧",
				ScoreChange: scoreChange,
			})
		}

		// Milestone messages
		if current.Score >= 90 {
			messages = append(messages, MotivationalMessage{
				Type:     "milestone",
				Category: current.CategoryName,
				Message:  fmt.Sprintf("🏆 Excellent! You've mastered %s with a score of %.1f!", current.DisplayName, current.Score),
				Icon:     "🏆",
			})
		} else if current.Score >= 75 {
			messages = append(messages, MotivationalMessage{
				Type:     "milestone",
				Category: current.CategoryName,
				Message:  fmt.Sprintf("🎯 You're doing great! %s score is %.1f - almost there!", current.DisplayName, current.Score),
				Icon:     "🎯",
			})
		}
	}

	return messages, nil
}

// checkAchievements checks and awards new achievements
func (as *AnalysisService) checkAchievements(userID, projectID, _ string, categoryScores []CategoryScore) ([]Achievement, error) {
	var newAchievements []Achievement

	for _, score := range categoryScores {
		// Check for category mastery (score >= 90)
		if score.Score >= 90 {
			achievement := Achievement{
				UserID:          userID,
				AchievementType: "category_master",
				Category:        score.CategoryName,
				Title:           score.DisplayName + " Master",
				Description:     fmt.Sprintf("Achieved 90+ score in %s", score.DisplayName),
				Icon:            "🏆",
				EarnedAt:        time.Now(),
				ProjectID:       projectID,
			}

			// Check if already earned
			exists, err := as.checkAchievementExists(userID, achievement.AchievementType, achievement.Category)
			if err == nil && !exists {
				newAchievements = append(newAchievements, achievement)
			}
		}

		// Check for perfect scores
		if score.Score == 100 {
			achievementType := "perfect_" + score.CategoryName
			achievement := Achievement{
				UserID:          userID,
				AchievementType: achievementType,
				Category:        score.CategoryName,
				Title:           "Perfect " + score.DisplayName,
				Description:     fmt.Sprintf("Achieved perfect score in %s!", score.DisplayName),
				Icon:            "🌟",
				EarnedAt:        time.Now(),
				ProjectID:       projectID,
			}

			exists, err := as.checkAchievementExists(userID, achievement.AchievementType, achievement.Category)
			if err == nil && !exists {
				newAchievements = append(newAchievements, achievement)
			}
		}
	}

	// Save new achievements to database
	for _, achievement := range newAchievements {
		err := as.saveAchievement(achievement)
		if err != nil {
			log.Printf("Failed to save achievement: %v", err)
		}
	}

	return newAchievements, nil
}

// saveScanToDatabase saves scan results to Supabase
func (as *AnalysisService) saveScanToDatabase(scan *AnalysisScan, issues []types.Issue, userID string) (string, error) {
	scanData := map[string]interface{}{
		"project_id":      scan.ProjectID,
		"scan_type":       scan.ScanType,
		"total_files":     scan.TotalFiles,
		"total_issues":    scan.TotalIssues,
		"critical_issues": scan.CriticalIssues,
		"overall_score":   scan.OverallScore,
		"category_scores": scan.CategoryScores,
		"scan_duration":   scan.ScanDuration,
		"status":          scan.Status,
		"user_id":         userID,
	}

	data, err := as.supabaseClient.makeRequest("POST", "analysis_scans", scanData, false)
	if err != nil {
		return "", fmt.Errorf("failed to save scan: %v", err)
	}

	var result []map[string]interface{}
	if err := json.Unmarshal(data, &result); err != nil || len(result) == 0 {
		return "", fmt.Errorf("failed to parse scan result")
	}

	scanID := result[0]["id"].(string)
	return scanID, nil
}

func (as *AnalysisService) checkAchievementExists(userID, achievementType, category string) (bool, error) {
	endpoint := fmt.Sprintf("achievements?user_id=eq.%s&achievement_type=eq.%s&category=eq.%s",
		userID, achievementType, category)

	data, err := as.supabaseClient.makeRequest("GET", endpoint, nil, false)
	if err != nil {
		return false, err
	}

	var achievements []Achievement
	if err := json.Unmarshal(data, &achievements); err != nil {
		return false, err
	}

	return len(achievements) > 0, nil
}

func (as *AnalysisService) saveAchievement(achievement Achievement) error {
	achievementData := map[string]interface{}{
		"user_id":          achievement.UserID,
		"achievement_type": achievement.AchievementType,
		"category":         achievement.Category,
		"title":            achievement.Title,
		"description":      achievement.Description,
		"icon":             achievement.Icon,
		"project_id":       achievement.ProjectID,
	}

	_, err := as.supabaseClient.makeRequest("POST", "achievements", achievementData, false)
	return err
}

// RunAsyncAnalysis runs analysis in background and submits results
func (as *AnalysisService) RunAsyncAnalysis(server *Server, projectID, projectPath, scanType string) {
	go func() {
		// Recover from panics to prevent goroutine crashes
		defer func() {
			if r := recover(); r != nil {
				log.Printf("❌ Analysis goroutine panic for project %s: %v", projectID, r)
			}
		}()

		log.Printf("🔍 Starting analysis for project %s (type: %s)", projectID, scanType)

		// Run analysis
		result, err := as.RunAnalysis(projectPath, projectID, "")
		if err != nil {
			log.Printf("❌ Analysis failed for project %s: %v", projectID, err)
			return
		}

		log.Printf("✅ Analysis completed for project %s: %d issues found", projectID, result.TotalIssues)

		// Create analysis record - convert AnalysisScan to ScanResult
		scanResult := types.ScanResult{
			ProjectPath: result.ProjectID, // Using ProjectID as path for now
			ScanType:    scanType,
			Files:       []types.FileInfo{}, // Empty for now, would be populated from actual scan
			Issues:      []types.Issue{},    // Empty for now, would be populated from actual scan
			Summary: types.ScanSummary{
				TotalFiles:     result.TotalFiles,
				IssuesFound:    result.TotalIssues,
				CriticalIssues: result.CriticalIssues,
			},
			ScannedAt: result.CreatedAt,
		}

		analysis := types.AnalysisRecord{
			ProjectID:   projectID,
			ScanType:    scanType,
			Results:     scanResult,
			IssuesCount: result.TotalIssues,
		}

		// Submit to database
		if err := as.submitAnalysisToDatabase(server, analysis); err != nil {
			log.Printf("❌ Failed to save analysis results to database: %v", err)
			return
		}

		log.Printf("💾 Analysis results saved to database for project %s", projectID)

		// Generate PDF report
		projectName := fmt.Sprintf("Project-%s", projectID)
		pdfPath, err := server.pdfService.GenerateAnalysisReport(analysis, projectName)
		if err != nil {
			log.Printf("⚠️ Failed to generate PDF report: %v", err)
		} else {
			log.Printf("📄 PDF report generated: %s", pdfPath)
		}

		// Trigger real-time notification (if WebSocket is implemented)
		server.notifyAnalysisComplete(projectID, analysis)
	}()
}

// submitAnalysisToDatabase saves analysis results to Supabase
func (as *AnalysisService) submitAnalysisToDatabase(server *Server, analysis types.AnalysisRecord) error {
	analysisData := map[string]interface{}{
		"project_id":   analysis.ProjectID,
		"scan_type":    analysis.ScanType,
		"results":      analysis.Results,
		"issues_count": analysis.IssuesCount,
	}

	_, err := server.supabase.makeRequest("POST", "analysis_results", analysisData, false)
	if err != nil {
		return fmt.Errorf("supabase insertion failed: %v", err)
	}

	log.Printf("✅ Analysis results saved to Supabase for project %s", analysis.ProjectID)
	return nil
}

// ValidateAndSanitizeInput validates and sanitizes user input
func ValidateAndSanitizeInput(input string, inputType string) (string, error) {
	// Remove null bytes and control characters
	sanitized := strings.ReplaceAll(input, "\x00", "")

	// Remove or escape potentially dangerous characters
	var validChars *regexp.Regexp

	switch inputType {
	case "project_name":
		// Allow alphanumeric, spaces, hyphens, underscores
		validChars = regexp.MustCompile(`[^a-zA-Z0-9\s\-_]`)
		sanitized = validChars.ReplaceAllString(sanitized, "")
		if len(sanitized) == 0 || len(sanitized) > 100 {
			return "", fmt.Errorf("project name must be 1-100 characters and contain only letters, numbers, spaces, hyphens, and underscores")
		}

	case "file_path":
		// More restrictive for file paths
		if strings.Contains(sanitized, "..") {
			return "", fmt.Errorf("path traversal not allowed")
		}
		if strings.ContainsAny(sanitized, "<>:\"|?*") {
			return "", fmt.Errorf("invalid characters in file path")
		}

	case "email":
		// Basic email validation
		emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
		if !emailRegex.MatchString(sanitized) {
			return "", fmt.Errorf("invalid email format")
		}

	case "scan_type":
		// Only allow predefined scan types
		validScanTypes := []string{"full", "security", "performance", "quality"}
		isValid := false
		for _, validType := range validScanTypes {
			if sanitized == validType {
				isValid = true
				break
			}
		}
		if !isValid {
			return "", fmt.Errorf("invalid scan type")
		}

	default:
		// General sanitization
		// Remove control characters except tab, newline, carriage return
		sanitized = strings.Map(func(r rune) rune {
			if unicode.IsControl(r) && r != '\t' && r != '\n' && r != '\r' {
				return -1
			}
			return r
		}, sanitized)
	}

	// Trim whitespace
	sanitized = strings.TrimSpace(sanitized)

	return sanitized, nil
}

// ValidateProjectPath checks if a path is valid for analysis
func (as *AnalysisService) ValidateProjectPath(path string) error {
	// Sanitize the path first
	cleanPath, err := ValidateAndSanitizeInput(path, "file_path")
	if err != nil {
		return err
	}

	cleanPath = filepath.Clean(cleanPath)

	// Basic security checks
	if strings.Contains(cleanPath, "..") {
		return fmt.Errorf("path traversal not allowed")
	}

	// Check against allowed project paths from config
	if len(config.AllowedProjectPaths) > 0 {
		allowed := false
		for _, allowedPath := range config.AllowedProjectPaths {
			if strings.HasPrefix(cleanPath, allowedPath) {
				allowed = true
				break
			}
		}
		if !allowed {
			return fmt.Errorf("path not in allowed directories")
		}
	}

	// Additional restrictions for absolute paths
	if strings.HasPrefix(cleanPath, "/") {
		restrictedPaths := []string{"/etc", "/proc", "/sys", "/dev", "/root", "/boot"}
		for _, restricted := range restrictedPaths {
			if strings.HasPrefix(cleanPath, restricted) {
				return fmt.Errorf("access to system directories not allowed")
			}
		}
	}

	return nil
}

// SanitizeLogData removes sensitive information from log data
func SanitizeLogData(data interface{}) interface{} {
	switch v := data.(type) {
	case string:
		// Remove potential tokens or keys
		tokenRegex := regexp.MustCompile(`(token|key|secret|password|bearer)\s*[:=]\s*\S+`)
		return tokenRegex.ReplaceAllString(v, "${1}=***REDACTED***")

	case map[string]interface{}:
		sanitized := make(map[string]interface{})
		for key, value := range v {
			lowerKey := strings.ToLower(key)
			if strings.Contains(lowerKey, "token") ||
				strings.Contains(lowerKey, "key") ||
				strings.Contains(lowerKey, "secret") ||
				strings.Contains(lowerKey, "password") {
				sanitized[key] = "***REDACTED***"
			} else {
				sanitized[key] = SanitizeLogData(value)
			}
		}
		return sanitized

	default:
		return v
	}
}

// GetSupportedScanTypes returns available scan types
func (as *AnalysisService) GetSupportedScanTypes() []string {
	return []string{
		types.ScanTypeFull,
		types.ScanTypeDependency,
		types.ScanTypePattern,
	}
}
