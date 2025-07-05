// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_dialog::DialogExt;
use std::process::Command;
use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
pub struct AnalysisRequest {
    pub project_path: String,
    pub scan_types: Vec<String>,
    pub files: Option<Vec<String>>, // For individual file analysis
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AnalysisResult {
    pub success: bool,
    pub message: String,
    pub results: Option<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CategoryScore {
    pub category_name: String,
    pub display_name: String,
    pub score: f64,
    pub critical_issues: i32,
    pub warning_issues: i32,
    pub info_issues: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DashboardData {
    pub project_name: String,
    pub user_id: String,
    pub category_scores: Vec<CategoryScore>,
}

// DISABLED: Old Rust dashboard sending - now handled by TypeScript in App.tsx
async fn _send_to_dashboard_old(analysis_results: &serde_json::Value, project_path: &str) -> Result<(), Box<dyn std::error::Error>> {
    let _client = reqwest::Client::new();
    
    // Extract project name from path
    let _project_name = std::path::Path::new(project_path)
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("Unknown Project");

    // Extract category scores from analysis results
    let _category_scores = extract_category_scores(analysis_results);
    
    // Count total issues and files from analysis results
    let _total_issues: i32 = _category_scores.iter()
        .map(|cs| cs.critical_issues + cs.warning_issues + cs.info_issues)
        .sum();
    
    let _critical_issues: i32 = _category_scores.iter()
        .map(|cs| cs.critical_issues)
        .sum();
        
    // Get total files from analysis results
    let _total_files = analysis_results
        .get("summary")
        .and_then(|s| s.get("total_files"))
        .and_then(|f| f.as_i64())
        .unwrap_or(0) as i32;
    
    // DISABLED: This was causing issues with hardcoded project_id
    // Now handled properly by TypeScript code in App.tsx with user-specific projects
    
    println!("⚠️ Dashboard sending is now handled by TypeScript frontend");
    Ok(())
}

#[allow(dead_code)]
fn calculate_overall_score(category_scores: &[CategoryScore]) -> f64 {
    if category_scores.is_empty() {
        return 0.0;
    }
    
    let total: f64 = category_scores.iter().map(|cs| cs.score).sum();
    total / category_scores.len() as f64
}

#[allow(dead_code)]
fn get_category_id(category_name: &str) -> String {
    // Hardcoded category IDs based on REAL analyzers from analysis-engine/analyzers/
    match category_name {
        // Core analyzer categories (from real analyzer files)
        "security" => "11111111-1111-1111-1111-111111111111".to_string(),
        "code_quality" => "22222222-2222-2222-2222-222222222222".to_string(),
        "performance" => "33333333-3333-3333-3333-333333333333".to_string(),
        "accessibility" => "44444444-4444-4444-4444-444444444444".to_string(),
        "documentation" => "55555555-5555-5555-5555-555555555555".to_string(),
        "testing" => "66666666-6666-6666-6666-666666666666".to_string(),
        "dependencies" => "77777777-7777-7777-7777-777777777777".to_string(),
        "architecture" => "88888888-8888-8888-8888-888888888888".to_string(),
        "error_handling" => "99999999-9999-9999-9999-999999999999".to_string(),
        "api_design" => "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa".to_string(),
        "database" => "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb".to_string(),
        "compliance" => "cccccccc-cccc-cccc-cccc-cccccccccccc".to_string(),
        "mobile" => "dddddddd-dddd-dddd-dddd-dddddddddddd".to_string(),
        "logging" => "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee".to_string(),
        "ai_hallucinations" => "ffffffff-ffff-ffff-ffff-ffffffffffff".to_string(),
        _ => "00000000-0000-0000-0000-000000000000".to_string(), // fallback
    }
}

#[allow(dead_code)]
fn extract_category_scores(analysis_results: &serde_json::Value) -> Vec<CategoryScore> {
    // Create default empty vector for fallback
    let empty_vec = vec![];
    let issues = analysis_results
        .get("issues")
        .and_then(|i| i.as_array())
        .unwrap_or(&empty_vec);

    let summary = analysis_results.get("summary").unwrap_or(&serde_json::Value::Null);
    
    // Extract total counts (not used but kept for potential future use)
    let _warning_total = summary
        .get("warning_total")
        .and_then(|v| v.as_i64())
        .unwrap_or(0) as i32;
    
    let _info_total = summary
        .get("info_total")
        .and_then(|v| v.as_i64())
        .unwrap_or(0) as i32;

    // Define the 15 categories based on REAL analyzers from analysis-engine/analyzers/
    let categories = [
        ("security", "Security Analysis"),
        ("code_quality", "Code Quality"),
        ("performance", "Performance"),
        ("accessibility", "Accessibility"),
        ("documentation", "Documentation"),
        ("testing", "Testing Coverage"),
        ("dependencies", "Dependencies"),
        ("architecture", "Architecture"),
        ("error_handling", "Error Handling"),
        ("api_design", "API Design"),
        ("database", "Database Analysis"),
        ("compliance", "Compliance & Privacy"),
        ("mobile", "Mobile & Cross-Platform"),
        ("logging", "Logging & Observability"),
        ("ai_hallucinations", "AI Hallucinations")
    ];

    let mut category_scores = Vec::new();

    for (category_name, display_name) in categories.iter() {
        let mut critical_count = 0;
        let mut warning_count = 0;
        let mut info_count = 0;

        // Count issues by category and severity
        for issue in issues {
            if let Some(issue_category) = get_issue_category(issue) {
                if issue_category == *category_name {
                    let severity = get_issue_severity(issue);
                    let issue_type = issue.get("type").and_then(|t| t.as_str()).unwrap_or("unknown");
                    
                    // Code Quality kategorisi için özel debugging
                    if *category_name == "code_quality" {
                        println!("🔍 Code Quality issue: {} -> {} (severity: {})", issue_type, severity, 
                                issue.get("severity").and_then(|s| s.as_str()).unwrap_or("none"));
                    }
                    
                    match severity.as_str() {
                        "error" | "critical" => {
                            critical_count += 1;
                            if critical_count <= 3 || *category_name == "code_quality" { 
                                println!("🔴 Critical issue in {}: {} ({})", category_name, issue_type, severity);
                            }
                        },
                        "warning" => {
                            warning_count += 1;
                            if warning_count <= 3 || *category_name == "code_quality" { 
                                println!("🟡 Warning issue in {}: {} ({})", category_name, issue_type, severity);
                            }
                        },
                        "info" | "note" => {
                            info_count += 1;
                            if *category_name == "code_quality" && info_count <= 3 {
                                println!("🔵 Info issue in {}: {} ({})", category_name, issue_type, severity);
                            }
                        },
                        _ => {
                            info_count += 1;
                            println!("❓ Unknown severity '{}' for {}: {}", severity, category_name, issue_type);
                        }
                    }
                }
            }
        }

        // Calculate score (0-100, higher is better) - REALISTIC ALGORITHM FOR LARGE PROJECTS
        let total_issues = critical_count + warning_count + info_count;
        let score = if total_issues == 0 {
            100.0
        } else {
            // Use logarithmic scaling for very large projects
            let critical_impact = if critical_count == 0 { 
                0.0 
            } else { 
                30.0 - (30.0 / (1.0 + (critical_count as f64 / 100.0)))
            };
            
            let warning_impact = if warning_count == 0 { 
                0.0 
            } else { 
                25.0 - (25.0 / (1.0 + (warning_count as f64 / 1000.0)))
            };
            
            let info_impact = if info_count == 0 { 
                0.0 
            } else { 
                15.0 - (15.0 / (1.0 + (info_count as f64 / 5000.0)))
            };
            
            let total_penalty = critical_impact + warning_impact + info_impact;
            let final_score = 100.0 - total_penalty;
            
            // Ensure score is between 0 and 100
            final_score.max(0.0).min(100.0)
        };

        category_scores.push(CategoryScore {
            category_name: category_name.to_string(),
            display_name: display_name.to_string(),
            score,
            critical_issues: critical_count,
            warning_issues: warning_count,
            info_issues: info_count,
        });
    }

    category_scores
}

#[allow(dead_code)]
fn get_issue_category(issue: &serde_json::Value) -> Option<String> {
    // Get issue type and description
    let issue_type = issue.get("type")
        .and_then(|t| t.as_str())
        .unwrap_or("");
    
    let description = issue.get("description")
        .and_then(|d| d.as_str())
        .unwrap_or("");
    
    let _severity = issue.get("severity")
        .and_then(|s| s.as_str())
        .unwrap_or("");

    // Map based on REAL analyzer issue types from analysis-engine/analyzers/
    match issue_type {
        // SECURITY ANALYZER (security.go)
        "input_validation_missing" | "sql_injection_risk" | "xss_vulnerability" | 
        "csrf_vulnerability" | "authentication_weakness" | "authorization_missing" |
        "insecure_data_storage" | "insecure_api_call" | "https_missing" | 
        "outdated_dependency" | "session_management_issue" | "security_logging_missing" |
        "rate_limiting_missing" | "vulnerable_dependency" | "secret_exposure" |
        "deployment_security_issue" => Some("security".to_string()),
        
        // PERFORMANCE ANALYZER (performance.go)
        "performance_issue" | "caching_missing" | "memory_leak_risk" | 
        "slow_database_query" | "slow_response_time" | "performance_bottleneck" => Some("performance".to_string()),
        
        // CODE QUALITY ANALYZER (code_quality.go)
        "code_duplication" | "high_cyclomatic_complexity" | "poor_code_readability" |
        "solid_principle_violation" | "comment_issue" | "refactor_needed" |
        "testability_issue" | "design_pattern_missing" | "dependency_injection_missing" |
        "inconsistent_naming_pattern" | "ai_generated_placeholder" | "unused_import" |
        "incomplete_implementation" | "framework_mismatch" | "over_engineering" |
        "deprecated_import" | "missing_header_guard" => Some("code_quality".to_string()),
        
        // ACCESSIBILITY ANALYZER (accessibility.go)
        "accessibility_issue" | "ux_issue" | "mobile_compatibility_issue" |
        "contrast_issue" => Some("accessibility".to_string()),
        
        // DOCUMENTATION ANALYZER (documentation.go)
        "documentation_missing" | "documentation_quality_issue" | 
        "api_documentation_missing" | "user_documentation_missing" |
        "architecture_documentation_missing" => Some("documentation".to_string()),
        
        // TESTING ANALYZER (testing.go)
        "test_missing" | "low_test_coverage" | "test_not_isolated" |
        "mocking_issue" | "ci_pipeline_missing" => Some("testing".to_string()),
        
        // DEPENDENCIES ANALYZER (dependencies.go)
        "missing_required_import" | "unused_dependency" | "too_many_dependencies" |
        "singleton_misuse" | "typescript_type_error" | "license_conflict" |
        "legal_risk" | "missing_package_dependency" | "versioning_issue" => Some("dependencies".to_string()),
        
        // ARCHITECTURE ANALYZER (architecture.go)
        "multiple_same_services" | "config_file_conflict" | "wrong_directory_structure" |
        "backend_frontend_integration_error" | "architecture_issue" |
        "dip_violation" | "isp_violation" | "missing_dependency_injection" |
        "lsp_violation_type_check" | "ocp_violation_ifelse" | "ocp_violation_switch" |
        "duplicate_entity_files" | "circular_dependency" => Some("architecture".to_string()),
        
        // ERROR HANDLING ANALYZER (error_handling.go)
        "error_handling_issue" | "insufficient_logging" | "wrong_log_level" |
        "pii_exposure_in_logs" | "monitoring_missing" | "distributed_tracing_missing" => Some("error_handling".to_string()),
        
        // API DESIGN ANALYZER (api_design.go)
        "api_design_issue" | "missing_api_versioning" | "missing_pagination" |
        "caching_missing_api" | "insecure_api_design" | "performance_issue_api" |
        "graphql_issue" | "microservices_issue" | "rest_compliance_issue" |
        "api_consistency_issue" | "content_negotiation_issue" | 
        "async_pattern_missing" | "security_headers_missing" => Some("api_design".to_string()),
        
        // DATABASE ANALYZER (database.go)
        "database_column_mismatch" | "database_index_missing" | "database_issue" => Some("database".to_string()),
        
        // COMPLIANCE ANALYZER (compliance.go)
        "gdpr_violation" | "compliance_issue" | "privacy_policy_missing" => Some("compliance".to_string()),
        
        // MOBILE/CROSS-PLATFORM ANALYZER (mobile_crossplatform.go)
        "missing_expo_config" | "localstorage_in_mobile" => Some("mobile".to_string()),
        
        // LOGGING ANALYZER (logging.go)
        "logging_insufficient" => Some("logging".to_string()),
        
        // AI HALLUCINATIONS ANALYZER (ai_hallucinations.go)
        "ai_hallucination" | "missing_auth_context" => Some("ai_hallucinations".to_string()),
        
        _ => {
            // Fallback: categorize based on description content
            let desc_lower = description.to_lowercase();
            if desc_lower.contains("security") || desc_lower.contains("vulnerability") {
                Some("security".to_string())
            } else if desc_lower.contains("performance") || desc_lower.contains("memory") {
                Some("performance".to_string())
            } else if desc_lower.contains("test") {
                Some("testing".to_string())
            } else if desc_lower.contains("document") {
                Some("documentation".to_string())
            } else if desc_lower.contains("error") {
                Some("error_handling".to_string())
            } else if desc_lower.contains("complex") {
                Some("complexity".to_string())
            } else if desc_lower.contains("architect") {
                Some("architecture".to_string())
            } else if desc_lower.contains("depend") {
                Some("dependencies".to_string())
            } else if desc_lower.contains("compliance") || desc_lower.contains("gdpr") {
                Some("reliability".to_string())
            } else {
                // Default to code_quality for unmatched issues
                Some("code_quality".to_string())
            }
        }
    }
}

#[allow(dead_code)]
fn get_issue_severity(issue: &serde_json::Value) -> String {
    let original_severity = issue.get("severity")
        .and_then(|s| s.as_str())
        .unwrap_or("info");
    
    // Map analysis engine severity levels to our expected format
    match original_severity {
        "high" | "error" | "critical" => "critical".to_string(),
        "medium" | "warning" | "warn" => "warning".to_string(),
        "low" | "info" | "note" | "informational" => "info".to_string(),
        _ => "info".to_string(), // Default fallback
    }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn select_folder(app: tauri::AppHandle) -> Result<String, String> {
    use std::sync::{Arc, Mutex};
    use std::sync::mpsc;
    
    let (tx, rx) = mpsc::channel();
    let tx = Arc::new(Mutex::new(Some(tx)));
    
    app.dialog().file().pick_folder(move |folder_path| {
        if let Ok(mut sender) = tx.lock() {
            if let Some(sender) = sender.take() {
                let _ = sender.send(folder_path);
            }
        }
    });
    
    match rx.recv() {
        Ok(Some(path)) => Ok(path.to_string()),
        Ok(None) => Err("No folder selected".to_string()),
        Err(_) => Err("Error receiving folder selection".to_string()),
    }
}

#[tauri::command]
async fn select_files(app: tauri::AppHandle) -> Result<Vec<String>, String> {
    use std::sync::{Arc, Mutex};
    use std::sync::mpsc;
    
    let (tx, rx) = mpsc::channel();
    let tx = Arc::new(Mutex::new(Some(tx)));
    
    app.dialog().file()
        .add_filter("Code Files", &["ts", "tsx", "js", "jsx", "go", "py", "java", "cs", "php", "rb", "cpp", "c", "h", "hpp"])
        .add_filter("Web Files", &["html", "css", "scss", "sass", "less"])
        .add_filter("Config Files", &["json", "yaml", "yml", "toml", "xml"])
        .add_filter("All Files", &["*"])
        .pick_files(move |file_paths| {
            if let Ok(mut sender) = tx.lock() {
                if let Some(sender) = sender.take() {
                    let _ = sender.send(file_paths);
                }
            }
        });
    
    match rx.recv() {
        Ok(Some(paths)) => Ok(paths.into_iter().map(|p| p.to_string()).collect()),
        Ok(None) => Err("No files selected".to_string()),
        Err(_) => Err("Error receiving file selection".to_string()),
    }
}

#[tauri::command]
async fn run_analysis(app: tauri::AppHandle, request: AnalysisRequest) -> Result<AnalysisResult, String> {
    use std::path::PathBuf;
    // Try to find the bundled binary first
    let mut binary_path = None;
    
    // First try to get the bundled binary using Tauri's resource resolver
    let resource_dir = app.path().resource_dir().map_err(|e| format!("Failed to get resource dir: {}", e))?;
    println!("🔍 Resource dir: {:?}", resource_dir);
    
    // Try different possible locations for the bundled binary
    let possible_bundled_paths = vec![
        resource_dir.join("analysis-engine.exe"), // MSI puts it in root
        resource_dir.join("analysis-engine.exe-x86_64-pc-windows-msvc.exe"), // Platform specific
        resource_dir.join("binaries").join("analysis-engine.exe"), // Original expected location
        app.path().app_local_data_dir().unwrap_or_default().join("analysis-engine.exe"), // App data dir
        app.path().app_data_dir().unwrap_or_default().join("analysis-engine.exe"), // App data dir
    ];
    
    for bundled_path in &possible_bundled_paths {
        println!("🔍 Checking path: {:?} - exists: {}", bundled_path, bundled_path.exists());
        if bundled_path.exists() {
            binary_path = Some(bundled_path.clone());
            println!("🔍 Found bundled binary: {:?}", binary_path);
            break;
        }
    }
    
    // If bundled binary not found, try alternative paths (for development)
    if binary_path.is_none() {
        let possible_paths = vec![
            // Dev mode paths
            PathBuf::from("../../analysis-engine/scanner.exe"),
            PathBuf::from("../../../analysis-engine/scanner.exe"),
            PathBuf::from("../../analysis-engine/analysis-engine.exe"),
            // Current directory
            PathBuf::from("scanner.exe"),
            PathBuf::from("analysis-engine.exe"),
            // Binaries directory
            PathBuf::from("binaries/analysis-engine.exe"),
            PathBuf::from("src-tauri/binaries/analysis-engine.exe"),
            // Production paths (next to executable)
            PathBuf::from("./analysis-engine.exe"),
            PathBuf::from("../analysis-engine.exe"),
        ];

        for path in possible_paths {
            if path.exists() {
                binary_path = Some(path);
                break;
            }
        }
    }

    let binary_path = binary_path.ok_or_else(|| {
        let error_msg = format!("Analysis engine binary not found. Searched paths:\n{}", 
            possible_bundled_paths.iter()
                .map(|p| format!("  - {:?}", p))
                .collect::<Vec<_>>()
                .join("\n"));
        println!("🚨 {}", error_msg);
        error_msg
    })?;

    // Debug: Print which binary is being used
    println!("🔍 Using binary: {:?}", binary_path);
    println!("🔍 Project path: {}", request.project_path);
    println!("🔍 Scan types: {:?}", request.scan_types);
    println!("🔍 Files: {:?}", request.files);

    // Analysis engine'i project path ve scan types ile çalıştır
    let mut command = Command::new(&binary_path);
    
    // Scan types'ları parametre olarak ekle (project path'ten ÖNCE)
    if !request.scan_types.is_empty() {
        command.arg("--analyzers");
        command.arg(request.scan_types.join(","));
        
        // If specific files are provided, use them instead of project path
        if let Some(files) = &request.files {
            if !files.is_empty() {
                // For multiple files, pass them as separate arguments
                for file in files {
                    command.arg(file);
                }
                println!("🔍 Analyzing specific files: {:?}", files);
            } else {
                command.arg(&request.project_path);
            }
        } else {
            command.arg(&request.project_path);
        }
        
        println!("🔍 Command: {:?}", command);
    } else {
        // If no scan types provided, still handle files vs folder
        if let Some(files) = &request.files {
            if !files.is_empty() {
                for file in files {
                    command.arg(file);
                }
            } else {
                command.arg(&request.project_path);
            }
        } else {
            command.arg(&request.project_path);
        }
        println!("⚠️ No scan types provided!");
    }
    
    let output = command
        .output()
        .map_err(|e| format!("Failed to execute analysis engine: {}", e))?;

    // Debug: Print stderr output
    let stderr = String::from_utf8_lossy(&output.stderr);
    if !stderr.is_empty() {
        println!("🚨 Analysis engine stderr: {}", stderr);
    }
    
    println!("🔍 Exit status: {:?}", output.status);
    println!("🔍 Stdout length: {}", output.stdout.len());

    // Debug: Print stdout when there's an error
    if !output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        println!("🚨 Analysis engine failed!");
        println!("🚨 Stdout: {}", stdout);
        return Ok(AnalysisResult {
            success: false,
            message: format!("Analysis failed: {}", stdout),
            results: None,
        });
    }

    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        
        // Try to find JSON output (skip initial log messages)
        let lines: Vec<&str> = stdout.lines().collect();
        let mut json_start = 0;
        
        // Find where JSON starts (look for the first '{')
        for (i, line) in lines.iter().enumerate() {
            if line.trim_start().starts_with('{') {
                json_start = i;
                break;
            }
        }
        
        // Extract JSON part
        let json_lines = &lines[json_start..];
        let json_output = json_lines.join("\n");
        
        // Debug: Print JSON output for troubleshooting
        println!("🔍 JSON Output Length: {}", json_output.len());
        println!("🔍 JSON First 500 chars: {}", &json_output.chars().take(500).collect::<String>());
        
        // Debug: Save raw output to file for MSI debugging
        if let Ok(app_dir) = app.path().app_local_data_dir() {
            let debug_file = app_dir.join("debug_analysis_output.txt");
            if let Ok(mut file) = std::fs::File::create(&debug_file) {
                use std::io::Write;
                let _ = writeln!(file, "Raw stdout:\n{}\n\nJSON part:\n{}", stdout, json_output);
            }
        }
        
        // Try to parse JSON
        if let Ok(results) = serde_json::from_str::<serde_json::Value>(&json_output) {
            // Debug: Print the structure
            println!("🔍 JSON Keys: {:?}", results.as_object().map(|o| o.keys().collect::<Vec<_>>()));
            
            // Clean up the results for better display
            let summary = results.get("summary");
            let issues = results.get("issues").and_then(|i| i.as_array());
            let files = results.get("files").and_then(|f| f.as_array());
            
            // Get file count from files array or summary
            let file_count = if let Some(files_array) = files {
                files_array.len() as i64
            } else {
                summary.and_then(|s| s.get("total_files")).and_then(|f| f.as_i64()).unwrap_or(0)
            };
            
            // Get issue count from issues array or summary
            let issue_count = if let Some(issues_array) = issues {
                issues_array.len()
            } else {
                summary.and_then(|s| s.get("issues_found")).and_then(|i| i.as_i64()).unwrap_or(0) as usize
            };
            
            let clean_message = if issue_count > 0 {
                format!("✅ Analysis completed successfully!\n📁 {} files scanned\n🔍 {} issues found", file_count, issue_count)
            } else {
                format!("✅ Analysis completed successfully!\n📁 {} files scanned\n🎉 No issues found!", file_count)
            };
            
            Ok(AnalysisResult {
                success: true,
                message: clean_message,
                results: Some(results),
            })
        } else {
            // If JSON parsing fails, create clean fallback
            println!("🚨 JSON parsing failed! Raw JSON: {}", &json_output.chars().take(1000).collect::<String>());
            
            let mut file_count = 0;
            let mut issue_count = 0;
            
            // Extract counts from log output
            for line in lines.iter() {
                if line.contains("Found") && line.contains("files to analyze") {
                    if let Some(captures) = regex::Regex::new(r"(\d+) files").unwrap().captures(line) {
                        file_count = captures[1].parse().unwrap_or(0);
                    }
                }
                if line.contains("Summary:") && line.contains("issues") {
                    if let Some(captures) = regex::Regex::new(r"(\d+) issues").unwrap().captures(line) {
                        issue_count = captures[1].parse().unwrap_or(0);
                    }
                }
            }
            
            let clean_message = if issue_count > 0 {
                format!("✅ Analysis completed!\n📁 {} files scanned\n🔍 {} issues found", file_count, issue_count)
            } else {
                format!("✅ Analysis completed!\n📁 {} files scanned\n🎉 No issues found!", file_count)
            };
            
            Ok(AnalysisResult {
                success: true,
                message: clean_message,
                results: Some(serde_json::json!({
                    "summary": {
                        "total_files": file_count,
                        "issues_found": issue_count
                    },
                    "issues": [],
                    "message": "Analysis completed but detailed results not available in JSON format"
                })),
            })
        }
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Ok(AnalysisResult {
            success: false,
            message: format!("Analysis failed: {}", stderr),
            results: None,
        })
    }
}

#[tauri::command]
async fn run_accessibility_analysis(app: tauri::AppHandle, project_path: String) -> Result<AnalysisResult, String> {
    let request = AnalysisRequest {
        project_path,
        scan_types: vec!["accessibility".to_string()],
        files: None, // For folder-based analysis
    };
    run_analysis(app, request).await
}

#[tauri::command]
async fn generate_pdf_report(app: tauri::AppHandle, analysis_results: serde_json::Value, project_name: String) -> Result<String, String> {
    use std::fs;
    
    // Generate default filename
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    let default_filename = format!("ElyAnalyzer-Report-{}.pdf", timestamp);
    
    // Use async dialog for Tauri 2.0
    use std::sync::{Arc, Mutex};
    use std::sync::mpsc;
    
    let (tx, rx) = mpsc::channel();
    let tx = Arc::new(Mutex::new(Some(tx)));
    
    app.dialog().file()
        .set_title("Save ElyAnalyzer Report")
        .set_file_name(&default_filename)
        .add_filter("PDF Files", &["pdf"])
        .save_file(move |file_path| {
            if let Ok(mut sender) = tx.lock() {
                if let Some(sender) = sender.take() {
                    let _ = sender.send(file_path);
                }
            }
        });
    
    let file_path = match rx.recv() {
        Ok(Some(path)) => path,
        Ok(None) => return Err("Save operation cancelled by user".to_string()),
        Err(_) => return Err("Error receiving save path".to_string()),
    };
    
    // Convert FilePath to PathBuf
    let path_buf = std::path::PathBuf::from(file_path.to_string());
    
    // Extract the actual results from the wrapper and pass the full context
    let actual_results = if let Some(results) = analysis_results.get("results") {
        results
    } else {
        &analysis_results
    };
    
    // Create a combined object with both wrapper info and actual results
    let combined_data = serde_json::json!({
        "success": analysis_results.get("success").and_then(|v| v.as_bool()).unwrap_or(false),
        "message": analysis_results.get("message").and_then(|v| v.as_str()).unwrap_or("No message"),
        "results": actual_results
    });
    
    // Generate PDF content (HTML to PDF conversion)
    let html_content = generate_html_report(&combined_data, &project_name)?;
    
    // For now, save as HTML (we can add proper PDF generation later)
    let html_path = path_buf.with_extension("html");
    fs::write(&html_path, html_content)
        .map_err(|e| format!("Failed to write HTML report: {}", e))?;
    
    // Also save JSON data alongside
    let json_path = path_buf.with_extension("json");
    let json_content = serde_json::to_string_pretty(actual_results)
        .map_err(|e| format!("Failed to serialize JSON: {}", e))?;
    fs::write(&json_path, json_content)
        .map_err(|e| format!("Failed to write JSON report: {}", e))?;
    
    // DISABLED: Dashboard sending now handled by TypeScript in App.tsx
    // This ensures user-specific project creation and proper data flow
    println!("⚠️ Dashboard sending is now handled by TypeScript frontend");
    // Old Rust code was using hardcoded project_id which caused data isolation issues
    
    Ok(format!("Reports saved:\n- HTML: {}\n- JSON: {}", 
        html_path.to_string_lossy(), 
        json_path.to_string_lossy()))
}

fn generate_html_report(analysis_results: &serde_json::Value, project_name: &str) -> Result<String, String> {
    let timestamp = chrono::Utc::now().format("%Y-%m-%d %H:%M:%S UTC");
    
    let html = format!(r#"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ElyAnalyzer Analysis Report - {}</title>
    <style>
        body {{ 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px;
            background: #f8f9fa;
        }}
        .header {{ 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 30px; 
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }}
        .header h1 {{ margin: 0; font-size: 2.5em; }}
        .header p {{ margin: 10px 0 0 0; opacity: 0.9; }}
        .section {{ 
            background: white; 
            padding: 25px; 
            margin-bottom: 20px; 
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        .section h2 {{ 
            color: #4a5568; 
            border-bottom: 3px solid #667eea; 
            padding-bottom: 10px;
            margin-top: 0;
        }}
        .success {{ color: #48bb78; font-weight: bold; }}
        .error {{ color: #f56565; font-weight: bold; }}
        .warning {{ color: #ed8936; font-weight: bold; }}
        .info {{ color: #4299e1; font-weight: bold; }}
        pre {{ 
            background: #f7fafc; 
            padding: 15px; 
            border-radius: 5px; 
            border-left: 4px solid #667eea;
            overflow-x: auto;
            font-size: 0.9em;
        }}
        .footer {{ 
            text-align: center; 
            color: #718096; 
            margin-top: 40px; 
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
        }}
        .status-badge {{
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
        }}
        .status-success {{ background: #c6f6d5; color: #22543d; }}
        .status-error {{ background: #fed7d7; color: #742a2a; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🌼 ElyAnalyzer Analysis Report</h1>
        <p>Project: <strong>{}</strong></p>
        <p>Generated: {}</p>
    </div>
    
    <div class="section">
        <h2>📊 Analysis Summary</h2>
        <p><strong>Status:</strong> 
            <span class="status-badge {}">
                {}
            </span>
        </p>
        <p><strong>Message:</strong> {}</p>
    </div>
    
    <div class="section">
        <h2>🔍 Analysis Results</h2>
        {}
    </div>
    
    <div class="section">
        <h2>📋 Raw Data</h2>
        <details>
            <summary>Click to view raw JSON data</summary>
            <pre>{}</pre>
        </details>
    </div>
    
    <div class="footer">
        <p>Generated by <strong>ElyAnalyzer</strong> - Advanced Code Analysis Tool</p>
        <p>Report generated at {}</p>
    </div>
</body>
</html>
"#, 
        project_name,
        project_name,
        timestamp,
        if analysis_results.get("success").and_then(|v| v.as_bool()).unwrap_or(false) { "status-success" } else { "status-error" },
        if analysis_results.get("success").and_then(|v| v.as_bool()).unwrap_or(false) { "SUCCESS" } else { "FAILED" },
        analysis_results.get("message").and_then(|v| v.as_str()).unwrap_or("No message"),
        generate_results_html(analysis_results.get("results").unwrap_or(analysis_results)),
        serde_json::to_string_pretty(analysis_results).unwrap_or_else(|_| "Error serializing data".to_string()),
        timestamp
    );
    
    Ok(html)
}

fn generate_results_html(analysis_results: &serde_json::Value) -> String {
    let mut html = String::new();
    
    // Get summary info
    let summary = analysis_results.get("summary");
    let files = analysis_results.get("files").and_then(|f| f.as_array());
    let issues = analysis_results.get("issues").and_then(|i| i.as_array());
    
    let files_scanned = if let Some(files_array) = files {
        files_array.len() as i64
    } else {
        summary.and_then(|s| s.get("total_files")).and_then(|f| f.as_i64()).unwrap_or(0)
    };
    
    let issues_found = if let Some(issues_array) = issues {
        issues_array.len() as i64
    } else {
        summary.and_then(|s| s.get("issues_found")).and_then(|i| i.as_i64()).unwrap_or(0)
    };
    
    // Debug: Print what we found for HTML report
    println!("🔍 HTML Report Debug - Files: {}, Issues: {}", files_scanned, issues_found);
    println!("🔍 Summary object: {:?}", summary);
    if let Some(files_array) = files {
        println!("🔍 Files array length: {}", files_array.len());
    }
    if let Some(issues_array) = issues {
        println!("🔍 Issues array length: {}", issues_array.len());
        if !issues_array.is_empty() {
            println!("🔍 First issue keys: {:?}", issues_array[0].as_object().map(|o| o.keys().collect::<Vec<_>>()));
        }
    }
    
    // Add CSS styles
    html.push_str(r#"
        <style>
        .summary-stats {
            display: flex;
            gap: 30px;
            margin: 20px 0;
            justify-content: center;
        }
        .stat-item {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            min-width: 150px;
        }
        .stat-number {
            display: block;
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            color: #6c757d;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .issue-item {
            margin: 15px 0;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #dc3545;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .issue-item.critical { border-left-color: #8b5cf6; }
        .issue-item.high { border-left-color: #dc3545; }
        .issue-item.medium { border-left-color: #f59e0b; }
        .issue-item.low { border-left-color: #10b981; }
        .issue-header {
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
            font-size: 1.1em;
        }
        .issue-description {
            color: #4b5563;
            margin-bottom: 12px;
            line-height: 1.6;
        }
        .issue-suggestion {
            background: #f3f4f6;
            padding: 12px;
            border-radius: 6px;
            font-size: 0.9em;
            color: #374151;
            border-left: 3px solid #6b7280;
        }
        .issue-meta {
            font-size: 0.85em;
            color: #9ca3af;
            margin-top: 10px;
            font-style: italic;
        }
        .severity-section {
            margin: 30px 0;
        }
        .severity-title {
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 15px;
            padding: 10px 0;
            border-bottom: 2px solid #e5e7eb;
        }
        .no-issues {
            text-align: center;
            padding: 40px;
            color: #10b981;
            background: #f0fdf4;
            border-radius: 8px;
            margin: 20px 0;
        }
        </style>
    "#);
    
    // Add summary stats
    html.push_str(&format!(r#"
        <div class="summary-stats">
            <div class="stat-item">
                <span class="stat-number">{}</span>
                <span class="stat-label">Files Scanned</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">{}</span>
                <span class="stat-label">Issues Found</span>
            </div>
        </div>
    "#, files_scanned, issues_found));

    // NEW: Add analyzers used section
    if let Some(analyzers_used) = analysis_results.get("analyzers_used").and_then(|a| a.as_array()) {
        if !analyzers_used.is_empty() {
            html.push_str(r#"
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <h3 style="margin-top: 0; color: #155724;">🔧 Analyzers Used</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            "#);
            
            for analyzer in analyzers_used {
                if let Some(analyzer_name) = analyzer.as_str() {
                    // Convert analyzer name to display name
                    let display_name = match analyzer_name {
                        "security" => "🔒 Security",
                        "code_quality" => "✨ Code Quality",
                        "performance" => "⚡ Performance",
                        "accessibility" => "♿ Accessibility",
                        "compliance" => "🏛️ Compliance",
                        "architecture" => "🏗️ Architecture",
                        "testing" => "🧪 Testing",
                        "documentation" => "📚 Documentation",
                        "dependencies" => "📦 Dependencies",
                        "logging" => "📝 Logging",
                        "error_handling" => "🚨 Error Handling",
                        "api_design" => "🔌 API Design",
                        "database" => "🗄️ Database",
                        "ai_hallucinations" => "🤖 AI Hallucinations",
                        "mobile_crossplatform" => "📱 Mobile & Cross-Platform",
                        _ => analyzer_name,
                    };
                    
                    html.push_str(&format!(r#"
                        <span style="background: #28a745; color: white; padding: 5px 12px; border-radius: 15px; font-size: 0.9em; font-weight: bold;">
                            {}
                        </span>
                    "#, display_name));
                }
            }
            
            html.push_str(r#"
                    </div>
                </div>
            "#);
        }
    }
    
    // Check if we have detailed issues
    if let Some(issues_array) = issues {
        if !issues_array.is_empty() {
            // Group issues by severity
            let mut critical_issues = Vec::new();
            let mut high_issues = Vec::new();
            let mut medium_issues = Vec::new();
            let mut low_issues = Vec::new();
            
            for issue in issues_array {
                let severity = issue.get("severity").and_then(|s| s.as_str()).unwrap_or("medium");
                match severity {
                    "critical" => critical_issues.push(issue),
                    "high" => high_issues.push(issue),
                    "medium" => medium_issues.push(issue),
                    "low" => low_issues.push(issue),
                    _ => medium_issues.push(issue),
                }
            }
            
            // Display issues by severity
            let all_groups = vec![
                ("🚨 Critical Issues", &critical_issues, "critical"),
                ("🔥 High Priority", &high_issues, "high"),
                ("⚠️ Medium Priority", &medium_issues, "medium"),
                ("ℹ️ Low Priority", &low_issues, "low"),
            ];
            
            for (severity_name, issues_group, css_class) in all_groups {
                if !issues_group.is_empty() {
                    html.push_str(&format!(r#"
                        <div class="severity-section">
                            <div class="severity-title">{} ({} issues)</div>
                    "#, severity_name, issues_group.len()));
                    
                    for issue in issues_group {
                        let description = issue.get("description").and_then(|d| d.as_str()).unwrap_or("No description");
                        let file = issue.get("file").and_then(|f| f.as_str()).unwrap_or("Unknown file");
                        let _line = issue.get("line").and_then(|l| l.as_i64()).unwrap_or(0);
                        let suggestion = issue.get("suggestion").and_then(|s| s.as_str()).unwrap_or("No suggestion available");
                        let issue_type = issue.get("type").and_then(|t| t.as_str()).unwrap_or("General Issue");
                        
                        // Extract filename from full path
                        let filename = file.split('/').last().or_else(|| file.split('\\').last()).unwrap_or(file);
                        
                        html.push_str(&format!(r#"
                            <div class="issue-item {}">
                                <div class="issue-header">📁 {}</div>
                                <div class="issue-description"><strong>🔍 Problem:</strong> {}</div>
                                <div class="issue-suggestion"><strong>💡 Solution:</strong> {}</div>
                                <div class="issue-meta">📂 File: {} | Type: {}</div>
                            </div>
                        "#, css_class, filename, description, suggestion, file, issue_type.replace("_", " ")));
                    }
                    
                    html.push_str("</div>");
                }
            }
        } else {
            html.push_str(r#"
                <div class="no-issues">
                    <h3>🎉 Congratulations!</h3>
                    <p>No issues found in your code. Great job!</p>
                </div>
            "#);
        }
    } else if issues_found == 0 {
        html.push_str(r#"
            <div class="no-issues">
                <h3>🎉 Congratulations!</h3>
                <p>No issues found in your code. Great job!</p>
            </div>
        "#);
    } else {
        html.push_str(r#"
            <div style="text-align: center; padding: 20px; color: #6b7280;">
                <p>Analysis completed but detailed issue information is not available.</p>
            </div>
        "#);
    }
    
    html
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            greet, 
            select_folder,
            select_files,
            run_analysis, 
            run_accessibility_analysis,
            generate_pdf_report
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

