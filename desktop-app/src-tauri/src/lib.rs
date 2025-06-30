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
    
    // Try different possible locations for the bundled binary
    let possible_bundled_paths = vec![
        resource_dir.join("binaries").join("analysis-engine.exe"), // Original expected location
        resource_dir.join("analysis-engine.exe"), // MSI puts it in root
    ];
    
    for bundled_path in possible_bundled_paths {
        if bundled_path.exists() {
            binary_path = Some(bundled_path);
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

    let binary_path = binary_path.ok_or_else(|| "Analysis engine binary not found".to_string())?;

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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
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
