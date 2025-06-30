import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { FolderOpenIcon, PlayIcon, DocumentArrowDownIcon, ArrowRightOnRectangleIcon, CogIcon } from '@heroicons/react/24/outline';
import { authService, User } from "./lib/supabase";
import Login from "./components/Login";
import AnalysisConfigPanel from "./components/AnalysisConfigPanel";
import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [analysisMode, setAnalysisMode] = useState<"folder" | "files">("folder");
  const [analysisTypes, setAnalysisTypes] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [analysisConfig, setAnalysisConfig] = useState<any>(null);

  const availableAnalysisTypes = [
    "Security Analysis",
    "Code Quality", 
    "Performance",
    "API Design",
    "Architecture", // 🏗️ Enhanced with SOLID, Clean Architecture, DDD
    "Dependencies",
    "Error Handling",
    "Testing",
    "Documentation",
    "Database",
    "Logging",
    "Compliance",
    "AI Hallucinations",
    "Mobile & Cross-Platform", // 📱 PWA, Responsive Design, Mobile Performance
    "Accessibility"
  ];

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    checkAuth();

    // Disable automatic auth state changes for desktop app
    // This prevents auto-logout when session expires
    // Desktop apps should maintain login state until manual logout
    
    // Note: We're not setting up auth state listener to prevent auto-logout
    // The user will remain logged in until they manually sign out
    
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoginLoading(true);
    setLoginError(null);

    const { user, error } = await authService.signIn(email, password);
    
    if (error) {
      setLoginError(error);
    } else {
      setUser(user);
    }
    
    setIsLoginLoading(false);
  };



  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div 
        className="bg-gray-50" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return (
      <Login 
        onLogin={handleLogin}
        isLoading={isLoginLoading}
        error={loginError}
      />
    );
  }

  async function selectFolder() {
    try {
      // Use Tauri's native file dialog
      const folder = await invoke("select_folder");
      setSelectedFolder(folder as string);
      setSelectedFiles([]); // Clear files when folder is selected
    } catch (error) {
      console.error("Error selecting folder:", error);
      // Show error message to user
      alert("Could not select folder. Please try again.");
    }
  }

  async function selectFiles() {
    try {
      // Use Tauri's native file dialog for multiple files
      const files = await invoke("select_files") as string[];
      setSelectedFiles(files);
      setSelectedFolder(""); // Clear folder when files are selected
    } catch (error) {
      console.error("Error selecting files:", error);
      // Show error message to user
      alert("Could not select files. Please try again.");
    }
  }

  async function startAnalysis() {
    const hasTarget = analysisMode === "folder" ? selectedFolder : selectedFiles.length > 0;
    
    // Use analysis config if available, otherwise fallback to old method
    let analyzersToUse: string[] = [];
    
    if (analysisConfig) {
      analyzersToUse = analysisConfig.enabledAnalyzers;
    } else if (analysisTypes.length > 0) {
      // Map display names to backend analyzer names (fallback)
      const analyzerMapping: { [key: string]: string } = {
        "Security Analysis": "security",
        "Code Quality": "code_quality", 
        "Performance": "performance",
        "Architecture": "architecture",
        "API Design": "api_design",
        "Dependencies": "dependencies",
        "Error Handling": "error_handling",
        "Testing": "testing",
        "Documentation": "documentation",
        "Database": "database",
        "Logging": "logging",
        "Compliance": "compliance",
        "AI Hallucinations": "ai_hallucinations",
        "Mobile & Cross-Platform": "mobile_crossplatform",
        "Accessibility": "accessibility"
      };
      analyzersToUse = analysisTypes.map(type => analyzerMapping[type]).filter(Boolean);
    }

    if (!hasTarget || analyzersToUse.length === 0) {
      const targetType = analysisMode === "folder" ? "folder" : "files";
      alert(`Please select ${targetType} and configure analysis settings`);
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log("Selected analyzers:", analyzersToUse);
      console.log("Analysis config:", analysisConfig);

      // Use embedded analysis engine (offline)
      const result = await invoke("run_analysis", {
        request: {
          project_path: analysisMode === "folder" ? selectedFolder : ".",
          scan_types: analyzersToUse,
          files: analysisMode === "files" ? selectedFiles : undefined,
          config: analysisConfig // Pass the enhanced config
        }
      }) as { success: boolean; message: string; results?: any };
      
      console.log("Analysis completed:", result);
      
      // Store results for report generation
      setAnalysisResults(result);
      
      if (!result.success) {
        alert(`Analysis failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error starting analysis:", error);
      alert("Failed to start analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  const toggleAnalysisType = (type: string) => {
    setAnalysisTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  async function generateReport() {
    if (!analysisResults) {
      alert("Please run an analysis first before generating a report.");
      return;
    }

    setIsGeneratingReport(true);
    try {
      // Extract project name based on analysis mode
      let projectName = "Unknown Project";
      
      if (analysisMode === "folder" && selectedFolder) {
        projectName = selectedFolder.split(/[/\\]/).pop() || "Unknown Project";
      } else if (analysisMode === "files" && selectedFiles.length > 0) {
        // For files mode, use the parent directory name or "Selected Files"
        const firstFile = selectedFiles[0];
        const parentDir = firstFile.split(/[/\\]/).slice(-2, -1)[0];
        projectName = parentDir || `Selected Files (${selectedFiles.length})`;
      }
      
      const reportPath = await invoke("generate_pdf_report", {
        analysisResults: analysisResults,
        projectName: projectName
      }) as string;
      
      alert(`Report generated successfully!\n\n${reportPath}`);
    } catch (error) {
      console.error("Error generating report:", error);
      if (error === "Save operation cancelled by user") {
        // User cancelled, don't show error
        return;
      }
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer glow */}
                  <defs>
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="40%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8"/>
                      <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6"/>
                      <stop offset="100%" stopColor="#d97706" stopOpacity="0.3"/>
                    </radialGradient>
                    <radialGradient id="petalGradient" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
                      <stop offset="70%" stopColor="#fce7f3" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#f3e8ff" stopOpacity="0.6"/>
                    </radialGradient>
                  </defs>
                  
                  {/* Sparkles */}
                  <circle cx="20" cy="25" r="1" fill="#fbbf24" opacity="0.7">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="80" cy="30" r="1.5" fill="#f59e0b" opacity="0.6">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="75" cy="70" r="1" fill="#fbbf24" opacity="0.8">
                    <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="25" cy="75" r="1.2" fill="#f59e0b" opacity="0.5">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Petals */}
                  <g transform="translate(50,50)">
                    {/* Petal 1 - Top */}
                    <ellipse cx="0" cy="-20" rx="6" ry="16" fill="url(#petalGradient)" transform="rotate(0)"/>
                    {/* Petal 2 - Top Right */}
                    <ellipse cx="0" cy="-20" rx="6" ry="16" fill="url(#petalGradient)" transform="rotate(45)"/>
                    {/* Petal 3 - Right */}
                    <ellipse cx="0" cy="-20" rx="6" ry="16" fill="url(#petalGradient)" transform="rotate(90)"/>
                    {/* Petal 4 - Bottom Right */}
                    <ellipse cx="0" cy="-20" rx="6" ry="16" fill="url(#petalGradient)" transform="rotate(135)"/>
                    {/* Petal 5 - Bottom */}
                    <ellipse cx="0" cy="-20" rx="6" ry="16" fill="url(#petalGradient)" transform="rotate(180)"/>
                    {/* Petal 6 - Bottom Left */}
                    <ellipse cx="0" cy="-20" rx="6" ry="16" fill="url(#petalGradient)" transform="rotate(225)"/>
                    {/* Petal 7 - Left */}
                    <ellipse cx="0" cy="-20" rx="6" ry="16" fill="url(#petalGradient)" transform="rotate(270)"/>
                    {/* Petal 8 - Top Left */}
                    <ellipse cx="0" cy="-20" rx="6" ry="16" fill="url(#petalGradient)" transform="rotate(315)"/>
                  </g>
                  
                  {/* Center */}
                  <circle cx="50" cy="50" r="8" fill="url(#centerGlow)"/>
                  <circle cx="50" cy="50" r="6" fill="#fbbf24"/>
                  <circle cx="50" cy="50" r="3" fill="#f59e0b"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">ElyAnalyzer Desktop</h1>
                <p className="text-sm text-gray-500">Welcome, {user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowConfigPanel(!showConfigPanel)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  showConfigPanel 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
                title="Analysis Configuration"
              >
                <CogIcon className="w-5 h-5" />
                <span className="text-sm">Config</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                title="Sign out"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="text-sm">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Analysis Configuration Panel */}
          {showConfigPanel && (
            <AnalysisConfigPanel
              onConfigChange={setAnalysisConfig}
              initialConfig={analysisConfig}
            />
          )}
          
          {/* Project Selection */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select Target for Analysis</h2>
            
            {/* Mode Selector */}
            <div className="mb-4">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setAnalysisMode("folder")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    analysisMode === "folder" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FolderOpenIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Folder</span>
                </button>
                <button
                  onClick={() => setAnalysisMode("files")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    analysisMode === "files" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Files</span>
                </button>
              </div>
            </div>

            {/* Folder Selection */}
            {analysisMode === "folder" && (
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={selectFolder}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FolderOpenIcon className="w-5 h-5" />
                    <span>Browse Folder</span>
                  </button>
                  {selectedFolder && (
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Selected:</p>
                      <p className="font-medium text-gray-900 truncate">{selectedFolder}</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  📁 Analyze all files in a project folder
                </p>
              </div>
            )}

            {/* File Selection */}
            {analysisMode === "files" && (
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={selectFiles}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    <span>Select Files</span>
                  </button>
                  {selectedFiles.length > 0 && (
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Selected {selectedFiles.length} file(s):</p>
                      <div className="max-h-20 overflow-y-auto">
                        {selectedFiles.map((file, index) => (
                          <p key={index} className="text-sm text-gray-900 truncate">
                            📄 {file.split(/[/\\]/).pop()}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  📄 Analyze specific files only (supports: .ts, .tsx, .js, .jsx, .go, .py, .java, .cs, .html, .css, etc.)
                </p>
              </div>
            )}
          </div>

          {/* Configuration Guide - Always visible when config panel is closed */}
          {!showConfigPanel && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <CogIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-900 mb-1">
                    🔧 Configure Your Analysis Tools
                  </h3>
                  <p className="text-sm text-blue-700">
                    Access advanced analysis tools and configurations through the Config panel. 
                    Choose from pre-built profiles or create custom analysis settings.
                  </p>
                </div>
                <button
                  onClick={() => setShowConfigPanel(true)}
                  className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Open Config
                </button>
              </div>
            </div>
          )}

          {/* Analysis Types - Legacy Mode (only show if config panel is not used) */}
          {!analysisConfig && !showConfigPanel && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Analysis Types (Legacy Mode)</h2>
                <button
                  onClick={() => setShowConfigPanel(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Use Advanced Config →
                </button>
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableAnalysisTypes.map((type) => {
                const getTypeDescription = (type: string) => {
                  switch (type) {
                    case "Architecture": 
                      return "🏗️ SOLID principles, Clean Architecture, DDD, Design Patterns, Coupling & Cohesion";
                    case "Security Analysis":
                      return "🔒 SQL injection, XSS, authentication, authorization vulnerabilities";
                    case "Code Quality":
                      return "🎯 Code duplication, complexity, readability, maintainability";
                    case "Performance":
                      return "⚡ Memory leaks, slow queries, bottlenecks, caching issues";
                    case "API Design":
                      return "🔌 REST compliance, versioning, error handling, documentation";
                    case "Dependencies":
                      return "📦 Outdated packages, vulnerabilities, license conflicts";
                    case "AI Hallucinations":
                      return "🤖 AI-generated code issues, inconsistencies, placeholders";
                    case "Testing":
                      return "🧪 Test coverage, quality, isolation, mocking";
                    case "Documentation":
                      return "📚 Missing docs, API documentation, code comments";
                    case "Database":
                      return "🗄️ Schema design, indexing, query optimization";
                    case "Error Handling":
                      return "❌ Exception handling, error propagation, logging";
                    case "Logging":
                      return "📝 Log levels, PII exposure, monitoring";
                    case "Compliance":
                      return "📋 GDPR, privacy policies, legal requirements";
                    case "Mobile & Cross-Platform":
                      return "📱 PWA compliance, responsive design, mobile performance, touch handling";
                    case "Accessibility":
                      return "♿ Web accessibility standards and best practices";
                    default:
                      return "";
                  }
                };

                return (
                  <label
                    key={type}
                    className="flex flex-col space-y-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all"
                    title={getTypeDescription(type)}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={analysisTypes.includes(type)}
                        onChange={() => toggleAnalysisType(type)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {type}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 pl-7">
                      {getTypeDescription(type)}
                    </div>
                  </label>
                );
              })}
            </div>

            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {analysisConfig ? (
                <span>{analysisConfig.enabledAnalyzers.length} analyzer(s) configured • {analysisConfig.strictnessLevel} mode</span>
              ) : showConfigPanel ? (
                <span>Please configure analysis settings in the Config panel</span>
              ) : (
                analysisTypes.length > 0 && (
                  <span>{analysisTypes.length} analysis type(s) selected</span>
                )
              )}
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={generateReport}
                disabled={!analysisResults || isGeneratingReport}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span>{isGeneratingReport ? "Generating..." : "Generate Report"}</span>
              </button>
              <button
                onClick={startAnalysis}
                disabled={
                  !(analysisMode === "folder" ? selectedFolder : selectedFiles.length > 0) || 
                  (analysisConfig 
                    ? analysisConfig.enabledAnalyzers.length === 0 
                    : (!showConfigPanel && analysisTypes.length === 0)
                  ) || 
                  isAnalyzing
                }
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <PlayIcon className="w-5 h-5" />
                <span>{isAnalyzing ? "Analyzing..." : "Start Analysis"}</span>
              </button>
            </div>
          </div>

          {/* Status/Progress Area */}
          {isAnalyzing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Analysis in progress...</p>
                  <p className="text-xs text-blue-700">
                    {analysisMode === "folder" 
                      ? `Scanning ${selectedFolder}` 
                      : `Analyzing ${selectedFiles.length} file(s)`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysisResults && analysisResults.success && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Analysis Summary
              </h2>
              
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  <span className="text-green-800 font-medium">SUCCESS</span>
                </div>
                <div className="mt-2 text-sm text-green-700 whitespace-pre-line">
                  {analysisResults.message}
                </div>
              </div>

              {analysisResults.results && (
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900 flex items-center">
                    <span className="mr-2">🔍</span>
                    Analysis Results
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div className="text-3xl font-bold text-blue-600">
                        {analysisResults.results.files ? analysisResults.results.files.length : 
                         (analysisResults.results.summary?.total_files || 0)}
                      </div>
                      <div className="text-sm text-blue-700 uppercase tracking-wide">Files Scanned</div>
                    </div>
                    
                    <div className="text-center p-6 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <div className="text-3xl font-bold text-red-600">
                        {analysisResults.results.issues ? analysisResults.results.issues.length : 
                         (analysisResults.results.summary?.issues_found || 0)}
                      </div>
                      <div className="text-sm text-red-700 uppercase tracking-wide">Issues Found</div>
                    </div>
                  </div>

                  {analysisResults.results.issues && analysisResults.results.issues.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">🚨 Issues Overview</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {analysisResults.results.issues.slice(0, 10).map((issue: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded border-l-4 border-orange-400">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  📁 {issue.file ? issue.file.split(/[/\\]/).pop() : 'Unknown file'}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  🔍 {issue.description || issue.Description || 'No description'}
                                </div>
                                {(issue.suggestion || issue.Suggestion) && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    💡 {issue.suggestion || issue.Suggestion}
                                  </div>
                                )}
                              </div>
                              <span className={`px-2 py-1 text-xs rounded font-medium ${
                                (issue.severity || issue.Severity) === 'critical' ? 'bg-purple-100 text-purple-800' :
                                (issue.severity || issue.Severity) === 'high' ? 'bg-red-100 text-red-800' :
                                (issue.severity || issue.Severity) === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {(issue.severity || issue.Severity || 'medium').toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                        {analysisResults.results.issues.length > 10 && (
                          <div className="text-center p-3 text-gray-500 text-sm">
                            ... and {analysisResults.results.issues.length - 10} more issues
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(!analysisResults.results.issues || analysisResults.results.issues.length === 0) && (
                    <div className="text-center p-8 bg-green-50 rounded-lg">
                      <div className="text-4xl mb-2">🎉</div>
                      <h3 className="text-lg font-medium text-green-800 mb-2">Congratulations!</h3>
                      <p className="text-green-600">No issues found in your code. Great job!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
