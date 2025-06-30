// API response types for TypeScript

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, string>;
}

export interface HealthResponse {
  status: string;
  database: string;
  timestamp: number;
  version?: string;
}

// HTTP status codes (matching Go constants)
export const StatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API Error codes (matching Go constants)
export const ErrorCode = {
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER: 'INTERNAL_ERROR',
  DUPLICATE_ENTRY: 'DUPLICATE_ERROR',
} as const;

export type ErrorCodeKeys = typeof ErrorCode[keyof typeof ErrorCode];

// Helper type for API calls
export type ApiCall<T> = Promise<APIResponse<T>>;

// Helper type for paginated API calls
export type PaginatedApiCall<T> = Promise<APIResponse<PaginatedResponse<T>>>;

// Generic fetch wrapper type
export interface FetchOptions extends RequestInit {
  token?: string;
  params?: Record<string, string | number>;
} 