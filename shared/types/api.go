package types

// APIResponse standard API response wrapper
type APIResponse[T any] struct {
	Success bool   `json:"success"`
	Data    T      `json:"data,omitempty"`
	Error   string `json:"error,omitempty"`
	Message string `json:"message,omitempty"`
}

// PaginatedResponse for list endpoints
type PaginatedResponse[T any] struct {
	Data       []T `json:"data"`
	Total      int `json:"total"`
	Page       int `json:"page"`
	PageSize   int `json:"page_size"`
	TotalPages int `json:"total_pages"`
}

// ErrorResponse for error cases
type ErrorResponse struct {
	Error   string            `json:"error"`
	Code    string            `json:"code,omitempty"`
	Details map[string]string `json:"details,omitempty"`
}

// HealthResponse for health check endpoint
type HealthResponse struct {
	Status    string `json:"status"`
	Database  string `json:"database"`
	Timestamp int64  `json:"timestamp"`
	Version   string `json:"version,omitempty"`
}

// Common HTTP status codes
const (
	StatusOK                  = 200
	StatusCreated             = 201
	StatusBadRequest          = 400
	StatusUnauthorized        = 401
	StatusForbidden           = 403
	StatusNotFound            = 404
	StatusInternalServerError = 500
)

// API Error codes
const (
	ErrorCodeValidation     = "VALIDATION_ERROR"
	ErrorCodeAuthentication = "AUTH_ERROR"
	ErrorCodeNotFound       = "NOT_FOUND"
	ErrorCodeInternalServer = "INTERNAL_ERROR"
	ErrorCodeDuplicateEntry = "DUPLICATE_ERROR"
)

// Helper functions for creating responses
func NewSuccessResponse[T any](data T) APIResponse[T] {
	return APIResponse[T]{
		Success: true,
		Data:    data,
	}
}

func NewErrorResponse(error string) APIResponse[any] {
	return APIResponse[any]{
		Success: false,
		Error:   error,
	}
}

func NewPaginatedResponse[T any](data []T, total, page, pageSize int) PaginatedResponse[T] {
	totalPages := (total + pageSize - 1) / pageSize
	return PaginatedResponse[T]{
		Data:       data,
		Total:      total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	}
}
