// User and project types for TypeScript

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  path: string;
  last_analyzed?: string; // ISO 8601 date string
  created_at: string; // ISO 8601 date string
}

export interface AnalysisRecord {
  id: string;
  project_id: string;
  scan_type: string;
  results: import('./analysis').ScanResult;
  issues_count: number;
  pdf_path?: string;
  created_at: string; // ISO 8601 date string
}

export interface CreateProjectRequest {
  name: string;
  path: string;
}

export interface ScanProjectRequest {
  project_id: string;
  scan_type: string; // "full" | "dependency" | "pattern"
}

// Scan types (matching Go constants)
export const ScanType = {
  FULL: 'full',
  DEPENDENCY: 'dependency',
  PATTERN: 'pattern',
} as const;

export type ScanTypeKeys = typeof ScanType[keyof typeof ScanType]; 