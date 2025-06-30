package types

import "time"

// User represents a user in the system
type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// CreateUserRequest for user registration
type CreateUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

// LoginRequest for authentication
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse with JWT token
type LoginResponse struct {
	User  User   `json:"user"`
	Token string `json:"token"`
}

// Project represents a user's project
type Project struct {
	ID           string     `json:"id"`
	UserID       string     `json:"user_id"`
	Name         string     `json:"name"`
	Path         string     `json:"path"`
	LastAnalyzed *time.Time `json:"last_analyzed,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
}

// AnalysisRecord represents a saved analysis result
type AnalysisRecord struct {
	ID          string     `json:"id"`
	ProjectID   string     `json:"project_id"`
	ScanType    string     `json:"scan_type"`
	Results     ScanResult `json:"results"`
	IssuesCount int        `json:"issues_count"`
	PDFPath     *string    `json:"pdf_path,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
}

// CreateProjectRequest for new project
type CreateProjectRequest struct {
	Name string `json:"name"`
	Path string `json:"path"`
}

// ScanProjectRequest for analysis
type ScanProjectRequest struct {
	ProjectID string `json:"project_id"`
	ScanType  string `json:"scan_type"` // "full", "dependency", "pattern"
}

// ScanTypes
const (
	ScanTypeFull       = "full"
	ScanTypeDependency = "dependency"
	ScanTypePattern    = "pattern"
)
