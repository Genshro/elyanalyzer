// Shared types from Go backend
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
  files: FileInfo[];
  issues: Issue[];
  summary: ScanSummary;
  scanned_at: string;
}

export interface Issue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
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

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Frontend specific types
export interface AnalysisHistory {
  id: string;
  project_name: string;
  scan_result: ScanResult;
  created_at: string;
} 