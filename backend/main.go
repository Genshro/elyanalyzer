// elyanalyzer Backend API
// Developer: Ahmet Çetin
// AI-powered code analysis tool

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"elyanalyzer/shared/types"

	"github.com/gorilla/websocket"
	_ "github.com/lib/pq"
)

// Constants for CORS headers
const (
	CorsAllowOrigin  = "Access-Control-Allow-Origin"
	CorsAllowMethods = "Access-Control-Allow-Methods"
	CorsAllowHeaders = "Access-Control-Allow-Headers"
)

// Rate limiting storage
type RateLimitEntry struct {
	Count     int
	LastReset time.Time
}

var (
	rateLimitStore = make(map[string]*RateLimitEntry)
	rateLimitMutex sync.RWMutex
)

// Global config instance
var config *Config

// Rate limiting middleware
func rateLimitMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Skip rate limiting for health check only
		if r.URL.Path == "/health" {
			next(w, r)
			return
		}

		clientIP := getClientIP(r)

		// Special rate limit for download info (higher limit for public endpoint)
		rateLimitValue := config.RateLimitRPM
		if r.URL.Path == "/api/download/info" {
			rateLimitValue = config.RateLimitRPM * 3 // 3x higher limit for download info
		}

		rateLimitMutex.Lock()
		entry, exists := rateLimitStore[clientIP]

		now := time.Now()
		if !exists || now.Sub(entry.LastReset) > time.Minute {
			rateLimitStore[clientIP] = &RateLimitEntry{
				Count:     1,
				LastReset: now,
			}
			rateLimitMutex.Unlock()
			next(w, r)
			return
		}

		if entry.Count >= rateLimitValue {
			rateLimitMutex.Unlock()
			w.Header().Set("X-RateLimit-Limit", fmt.Sprintf("%d", rateLimitValue))
			w.Header().Set("X-RateLimit-Remaining", "0")
			w.Header().Set("X-RateLimit-Reset", fmt.Sprintf("%d", entry.LastReset.Add(time.Minute).Unix()))
			http.Error(w, "Rate limit exceeded. Too many requests.", http.StatusTooManyRequests)
			return
		}

		entry.Count++
		remaining := rateLimitValue - entry.Count
		w.Header().Set("X-RateLimit-Limit", fmt.Sprintf("%d", rateLimitValue))
		w.Header().Set("X-RateLimit-Remaining", fmt.Sprintf("%d", remaining))
		w.Header().Set("X-RateLimit-Reset", fmt.Sprintf("%d", entry.LastReset.Add(time.Minute).Unix()))

		rateLimitMutex.Unlock()
		next(w, r)
	}
}

// Get client IP address
func getClientIP(r *http.Request) string {
	// Check X-Forwarded-For header
	forwarded := r.Header.Get("X-Forwarded-For")
	if forwarded != "" {
		// Take the first IP in the chain
		ips := strings.Split(forwarded, ",")
		return strings.TrimSpace(ips[0])
	}

	// Check X-Real-IP header
	realIP := r.Header.Get("X-Real-IP")
	if realIP != "" {
		return realIP
	}

	// Fall back to RemoteAddr
	ip := r.RemoteAddr
	if colonPos := strings.LastIndex(ip, ":"); colonPos != -1 {
		ip = ip[:colonPos]
	}

	return ip
}

// AuthMiddleware validates JWT tokens from Supabase
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Skip auth for health check, download info (public), and OPTIONS requests
		if r.URL.Path == "/health" ||
			r.URL.Path == "/api/download/info" ||
			r.Method == http.MethodOptions {
			next(w, r)
			return
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")

		// Validate token with Supabase
		if !validateSupabaseToken(token) {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// Token is valid, proceed to the next handler
		next(w, r)
	}
}

// validateSupabaseToken validates JWT token with Supabase
func validateSupabaseToken(token string) bool {
	// Create a request to Supabase to validate the token
	url := fmt.Sprintf("%s/auth/v1/user", config.SupabaseURL)
	log.Printf("🔍 Validating token with URL: %s", url)
	log.Printf("🔍 Token (first 20 chars): %s...", token[:min(20, len(token))])

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("❌ Error creating token validation request: %v", err)
		return false
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("apikey", config.SupabaseAnonKey)

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("❌ Error validating token: %v", err)
		return false
	}
	defer resp.Body.Close()

	log.Printf("🔍 Token validation response status: %d", resp.StatusCode)

	// If status is 200, token is valid
	if resp.StatusCode == http.StatusOK {
		log.Printf("✅ Token validation successful")
		return true
	} else {
		// Read response body for debugging
		body, _ := io.ReadAll(resp.Body)
		log.Printf("❌ Token validation failed: %s", string(body))
		return false
	}
}

// adminMiddleware checks if user has admin privileges
func adminMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")

		// Get user info from Supabase
		url := fmt.Sprintf("%s/auth/v1/user", config.SupabaseURL)
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			http.Error(w, "Error validating admin access", http.StatusInternalServerError)
			return
		}

		req.Header.Set("Authorization", "Bearer "+token)
		req.Header.Set("apikey", config.SupabaseAnonKey)

		client := &http.Client{Timeout: 5 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			http.Error(w, "Error validating admin access", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Parse user data to check role
		var userData map[string]interface{}
		if err := json.NewDecoder(resp.Body).Decode(&userData); err != nil {
			http.Error(w, "Error parsing user data", http.StatusInternalServerError)
			return
		}

		// Check if user has admin role
		userMetadata, ok := userData["user_metadata"].(map[string]interface{})
		if !ok {
			http.Error(w, "Access denied: Admin privileges required", http.StatusForbidden)
			return
		}

		role, ok := userMetadata["role"].(string)
		if !ok || role != "admin" {
			http.Error(w, "Access denied: Admin privileges required", http.StatusForbidden)
			return
		}

		// User is admin, proceed
		next(w, r)
	}
}

// Supabase client
type SupabaseClient struct {
	URL     string
	Key     string
	anonKey string
}

func NewSupabaseClient() *SupabaseClient {
	return &SupabaseClient{
		URL:     config.SupabaseURL,
		Key:     config.SupabaseServiceKey,
		anonKey: config.SupabaseAnonKey,
	}
}

func (sc *SupabaseClient) makeRequest(method, endpoint string, data interface{}, useServiceKey bool) ([]byte, error) {
	var body io.Reader
	if data != nil {
		jsonData, err := json.Marshal(data)
		if err != nil {
			return nil, err
		}
		body = bytes.NewBuffer(jsonData)
	}

	url := fmt.Sprintf("%s/rest/v1/%s", sc.URL, endpoint)
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return nil, err
	}

	// Headers
	if useServiceKey {
		req.Header.Set("Authorization", "Bearer "+sc.Key)
	} else {
		req.Header.Set("Authorization", "Bearer "+sc.anonKey)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", sc.anonKey)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("Supabase API error %d: %s", resp.StatusCode, string(responseBody))
	}

	return responseBody, nil
}

// ClientManager manages WebSocket connections for real-time communication
type ClientManager struct {
	clients    map[*websocket.Conn]bool
	broadcast  chan []byte
	register   chan *websocket.Conn
	unregister chan *websocket.Conn
	mutex      sync.RWMutex
}

func NewClientManager() *ClientManager {
	return &ClientManager{
		clients:    make(map[*websocket.Conn]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *websocket.Conn),
		unregister: make(chan *websocket.Conn),
	}
}

func (cm *ClientManager) run() {
	for {
		select {
		case client := <-cm.register:
			cm.mutex.Lock()
			cm.clients[client] = true
			cm.mutex.Unlock()
			log.Printf("🔗 WebSocket client connected. Total: %d", len(cm.clients))

		case client := <-cm.unregister:
			cm.mutex.Lock()
			if _, ok := cm.clients[client]; ok {
				delete(cm.clients, client)
				client.Close()
			}
			cm.mutex.Unlock()
			log.Printf("🔌 WebSocket client disconnected. Total: %d", len(cm.clients))

		case message := <-cm.broadcast:
			cm.mutex.RLock()
			for client := range cm.clients {
				err := client.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					delete(cm.clients, client)
					client.Close()
				}
			}
			cm.mutex.RUnlock()
		}
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		if config.Environment == "development" {
			return true // Allow all origins in development
		}

		origin := r.Header.Get("Origin")
		for _, allowedOrigin := range config.AllowedOrigins {
			if origin == allowedOrigin {
				return true
			}
		}
		return false // Reject unknown origins in production
	},
}

type Server struct {
	supabase        *SupabaseClient
	analysisService *AnalysisService
	clientManager   *ClientManager
	pdfService      *PDFService
}

// notifyAnalysisComplete sends real-time notification to connected clients
func (s *Server) notifyAnalysisComplete(projectID string, analysis types.AnalysisRecord) {
	notification := map[string]interface{}{
		"type":         "analysis_complete",
		"project_id":   projectID,
		"scan_type":    analysis.ScanType,
		"issues_found": analysis.IssuesCount,
		"timestamp":    time.Now().Unix(),
	}

	message, err := json.Marshal(notification)
	if err != nil {
		log.Printf("❌ Failed to marshal notification: %v", err)
		return
	}

	select {
	case s.clientManager.broadcast <- message:
		log.Printf("📡 Real-time notification sent for project %s", projectID)
	default:
		log.Printf("⚠️ No WebSocket clients to notify")
	}
}

// handleWebSocket handles WebSocket connections
func (s *Server) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("❌ WebSocket upgrade failed: %v", err)
		return
	}

	s.clientManager.register <- conn

	// Handle client disconnection
	defer func() {
		s.clientManager.unregister <- conn
	}()

	// Keep connection alive and handle ping/pong
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}

type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Test Supabase connection
	_, err := s.supabase.makeRequest("GET", "projects?limit=1", nil, false)

	response := Response{Success: true}
	if err != nil {
		response.Success = false
		response.Error = "Supabase connection failed: " + err.Error()
	} else {
		response.Data = map[string]interface{}{
			"status":    "healthy",
			"database":  "supabase_connected",
			"timestamp": time.Now().Unix(),
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) handleUsers(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		s.getUsers(w, r)
	case http.MethodPost:
		s.createUser(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (s *Server) getUsers(w http.ResponseWriter, _ *http.Request) {
	data, err := s.supabase.makeRequest("GET", "users?limit=10", nil, true)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var users []map[string]interface{}
	if err := json.Unmarshal(data, &users); err != nil {
		http.Error(w, "Failed to parse users", http.StatusInternalServerError)
		return
	}

	response := Response{
		Success: true,
		Data:    users,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) createUser(w http.ResponseWriter, r *http.Request) {
	var user struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if user.Email == "" {
		http.Error(w, "Email required", http.StatusBadRequest)
		return
	}

	userData := map[string]interface{}{
		"email": user.Email,
		"name":  user.Name,
	}

	data, err := s.supabase.makeRequest("POST", "users", userData, true)
	if err != nil {
		http.Error(w, "Failed to create user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var createdUser map[string]interface{}
	if err := json.Unmarshal(data, &createdUser); err != nil {
		http.Error(w, "Failed to parse created user", http.StatusInternalServerError)
		return
	}

	response := Response{
		Success: true,
		Data:    createdUser,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		// Check if origin is allowed
		allowed := false
		if config.Environment == "development" {
			// Allow all origins in development
			w.Header().Set(CorsAllowOrigin, "*")
			allowed = true
		} else {
			// If no origin header (direct API calls), allow it
			if origin == "" {
				allowed = true
			} else {
				// Check whitelist in production for browser requests
				for _, allowedOrigin := range config.AllowedOrigins {
					if origin == allowedOrigin {
						w.Header().Set(CorsAllowOrigin, origin)
						allowed = true
						break
					}
				}
			}
		}

		if !allowed && config.Environment != "development" {
			http.Error(w, "Origin not allowed", http.StatusForbidden)
			return
		}

		allowedMethods := "GET, POST, PUT, DELETE, OPTIONS"
		w.Header().Set(CorsAllowMethods, allowedMethods)
		w.Header().Set(CorsAllowHeaders, "Content-Type, Authorization")

		// Comprehensive Security Headers
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "SAMEORIGIN")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()")

		// Content Security Policy
		csp := "default-src 'self'; " +
			"script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
			"style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
			"font-src 'self' fonts.gstatic.com; " +
			"img-src 'self' data: blob: https:; " +
			"connect-src 'self' https://www.elyanalyzer.com https://elyanalyzer.com " + config.SupabaseURL + " wss: ws:; " +
			"frame-ancestors 'self'; " +
			"base-uri 'self'; " +
			"form-action 'self'"
		w.Header().Set("Content-Security-Policy", csp)

		// HTTPS enforcement in production
		if config.Environment == "production" {
			w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
		}

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// handleProjects manages project CRUD operations
func (s *Server) handleProjects(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		s.getProjects(w, r)
	case http.MethodPost:
		s.createProject(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (s *Server) getProjects(w http.ResponseWriter, r *http.Request) {
	data, err := s.supabase.makeRequest("GET", "projects?order=created_at.desc&limit=50", nil, false)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var projects []types.Project
	if err := json.Unmarshal(data, &projects); err != nil {
		http.Error(w, "Failed to parse projects", http.StatusInternalServerError)
		return
	}

	response := types.NewSuccessResponse(projects)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) createProject(w http.ResponseWriter, r *http.Request) {
	var req types.CreateProjectRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Name == "" || req.Path == "" {
		http.Error(w, "Name and path required", http.StatusBadRequest)
		return
	}

	projectData := map[string]interface{}{
		"name": req.Name,
		"path": req.Path,
	}

	data, err := s.supabase.makeRequest("POST", "projects", projectData, false)
	if err != nil {
		http.Error(w, "Failed to create project: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var projects []types.Project
	if err := json.Unmarshal(data, &projects); err != nil {
		http.Error(w, "Failed to parse created project", http.StatusInternalServerError)
		return
	}

	if len(projects) == 0 {
		http.Error(w, "No project returned", http.StatusInternalServerError)
		return
	}

	response := types.NewSuccessResponse(projects[0])
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handleAnalysis manages analysis operations
func (s *Server) handleAnalysis(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		s.submitAnalysis(w, r)
	case http.MethodGet:
		s.getAnalysisHistory(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (s *Server) submitAnalysis(w http.ResponseWriter, r *http.Request) {
	var analysis types.AnalysisRecord
	if err := json.NewDecoder(r.Body).Decode(&analysis); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if analysis.ProjectID == "" {
		http.Error(w, "ProjectID required", http.StatusBadRequest)
		return
	}

	analysisData := map[string]interface{}{
		"project_id":   analysis.ProjectID,
		"scan_type":    analysis.ScanType,
		"results":      analysis.Results,
		"issues_count": analysis.IssuesCount,
	}

	data, err := s.supabase.makeRequest("POST", "analysis_results", analysisData, false)
	if err != nil {
		log.Printf("Database error: %v", err)
		http.Error(w, "Failed to save analysis: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var results []types.AnalysisRecord
	if err := json.Unmarshal(data, &results); err != nil {
		http.Error(w, "Failed to parse analysis result", http.StatusInternalServerError)
		return
	}

	if len(results) == 0 {
		http.Error(w, "No analysis result returned", http.StatusInternalServerError)
		return
	}

	response := types.NewSuccessResponse(results[0])
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) getAnalysisHistory(w http.ResponseWriter, r *http.Request) {
	endpoint := "analysis_results?select=*,projects(name)&order=created_at.desc&limit=100"
	data, err := s.supabase.makeRequest("GET", endpoint, nil, false)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var rawResults []map[string]interface{}
	if err := json.Unmarshal(data, &rawResults); err != nil {
		http.Error(w, "Failed to parse analysis history", http.StatusInternalServerError)
		return
	}

	var history []map[string]interface{}
	for _, result := range rawResults {
		projectData, ok := result["projects"].(map[string]interface{})
		projectName := "Unknown"
		if ok {
			if name, exists := projectData["name"]; exists {
				projectName = name.(string)
			}
		}

		history = append(history, map[string]interface{}{
			"id":           result["id"],
			"project_id":   result["project_id"],
			"project_name": projectName,
			"scan_type":    result["scan_type"],
			"scan_result":  result["results"],
			"issues_found": result["issues_count"],
			"created_at":   result["created_at"],
		})
	}

	response := types.NewSuccessResponse(history)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handleScan initiates a new scan
func (s *Server) handleScan(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req types.ScanProjectRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.ProjectID == "" {
		http.Error(w, "ProjectID required", http.StatusBadRequest)
		return
	}

	// Get project path from Supabase
	endpoint := fmt.Sprintf("projects?select=path&id=eq.%s", req.ProjectID)
	data, err := s.supabase.makeRequest("GET", endpoint, nil, false)
	if err != nil {
		http.Error(w, "Project not found: "+err.Error(), http.StatusNotFound)
		return
	}

	var projects []map[string]interface{}
	if err := json.Unmarshal(data, &projects); err != nil || len(projects) == 0 {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	projectPath, ok := projects[0]["path"].(string)
	if !ok {
		http.Error(w, "Invalid project path", http.StatusBadRequest)
		return
	}

	// Validate project path
	if err := s.analysisService.ValidateProjectPath(projectPath); err != nil {
		http.Error(w, fmt.Sprintf("Invalid project path: %v", err), http.StatusBadRequest)
		return
	}

	// Start async analysis
	s.analysisService.RunAsyncAnalysis(s, req.ProjectID, projectPath, req.ScanType)

	// Return immediate response
	response := types.NewSuccessResponse(map[string]interface{}{
		"status":     "scan_initiated",
		"project_id": req.ProjectID,
		"scan_type":  req.ScanType,
		"message":    "Analysis started in background. Results will be available shortly.",
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handlePDFGeneration generates PDF reports for analysis results
func (s *Server) handlePDFGeneration(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		AnalysisID string `json:"analysis_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.AnalysisID == "" {
		http.Error(w, "AnalysisID required", http.StatusBadRequest)
		return
	}

	// Get analysis result from Supabase
	endpoint := fmt.Sprintf("analysis_results?select=*,projects(name)&id=eq.%s", req.AnalysisID)
	data, err := s.supabase.makeRequest("GET", endpoint, nil, false)
	if err != nil {
		http.Error(w, "Analysis not found: "+err.Error(), http.StatusNotFound)
		return
	}

	var results []map[string]interface{}
	if err := json.Unmarshal(data, &results); err != nil || len(results) == 0 {
		http.Error(w, "Analysis not found", http.StatusNotFound)
		return
	}

	result := results[0]

	// Convert to AnalysisRecord
	var analysis types.AnalysisRecord
	analysis.ID = req.AnalysisID
	analysis.ProjectID = result["project_id"].(string)
	analysis.ScanType = result["scan_type"].(string)
	analysis.IssuesCount = int(result["issues_count"].(float64))

	// Parse results JSON
	resultsData, _ := json.Marshal(result["results"])
	json.Unmarshal(resultsData, &analysis.Results)

	// Get project name
	projectName := "Unknown Project"
	if projects, ok := result["projects"].(map[string]interface{}); ok {
		if name, exists := projects["name"]; exists {
			projectName = name.(string)
		}
	}

	// Generate PDF
	pdfPath, err := s.pdfService.GenerateAnalysisReport(analysis, projectName)
	if err != nil {
		log.Printf("PDF generation error: %v", err)
		http.Error(w, "Failed to generate PDF: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Update analysis record with PDF path
	updateData := map[string]interface{}{
		"pdf_path": pdfPath,
	}
	updateEndpoint := fmt.Sprintf("analysis_results?id=eq.%s", req.AnalysisID)
	_, err = s.supabase.makeRequest("PATCH", updateEndpoint, updateData, false)
	if err != nil {
		log.Printf("Warning: Failed to update PDF path: %v", err)
	}

	// Return PDF download info
	response := types.NewSuccessResponse(map[string]interface{}{
		"pdf_path":     pdfPath,
		"download_url": fmt.Sprintf("/api/pdf/download/%s", req.AnalysisID),
		"message":      "PDF report generated successfully",
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// New category-based handlers
func (s *Server) handleProjectRoutes(w http.ResponseWriter, r *http.Request) {
	// Parse URL to extract project ID and action
	path := r.URL.Path[len("/api/projects/"):]
	parts := strings.Split(path, "/")

	if len(parts) < 1 {
		http.Error(w, "Invalid project route", http.StatusBadRequest)
		return
	}

	projectID := parts[0]

	if len(parts) >= 2 && parts[1] == "scans" {
		s.handleProjectScans(w, r, projectID)
	} else if len(parts) >= 4 && parts[1] == "categories" && parts[3] == "history" {
		category := parts[2]
		s.handleCategoryHistory(w, r, projectID, category)
	} else if len(parts) >= 2 && parts[1] == "motivational-messages" {
		s.handleMotivationalMessages(w, r, projectID)
	} else {
		http.Error(w, "Unknown project route", http.StatusNotFound)
	}
}

func (s *Server) handleUserRoutes(w http.ResponseWriter, r *http.Request) {
	// Parse URL to extract user ID and action
	path := r.URL.Path[len("/api/users/"):]
	parts := strings.Split(path, "/")

	if len(parts) >= 2 && parts[1] == "achievements" {
		userID := parts[0]
		s.handleUserAchievements(w, r, userID)
	} else {
		http.Error(w, "Unknown user route", http.StatusNotFound)
	}
}

func (s *Server) handleReportRoutes(w http.ResponseWriter, r *http.Request) {
	// Parse URL for report actions
	path := r.URL.Path[len("/api/reports/"):]

	if path == "generate" {
		s.handleGenerateReport(w, r)
	} else if strings.HasSuffix(path, "/download") {
		reportID := strings.TrimSuffix(path, "/download")
		s.handleDownloadReport(w, r, reportID)
	} else {
		http.Error(w, "Unknown report route", http.StatusNotFound)
	}
}

func (s *Server) handleProjectScans(w http.ResponseWriter, _ *http.Request, projectID string) {
	// Mock response for now
	response := map[string]interface{}{
		"scans": []map[string]interface{}{
			{
				"id":              "scan_1",
				"project_id":      projectID,
				"total_issues":    96,
				"critical_issues": 34,
				"overall_score":   67.5,
				"created_at":      time.Now().AddDate(0, 0, -1),
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) handleCategoryHistory(w http.ResponseWriter, _ *http.Request, projectID, category string) {
	// Mock response for now
	response := map[string]interface{}{
		"category": category,
		"history": []map[string]interface{}{
			{
				"score":           75.0,
				"issue_count":     7,
				"critical_issues": 2,
				"created_at":      time.Now().AddDate(0, 0, -1),
			},
			{
				"score":           60.0,
				"issue_count":     10,
				"critical_issues": 4,
				"created_at":      time.Now().AddDate(0, 0, -3),
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) handleMotivationalMessages(w http.ResponseWriter, _ *http.Request, projectID string) {
	messages := []map[string]interface{}{
		{
			"type":     "improvement",
			"category": "security",
			"message":  "�� Amazing! Your Security score improved by 15.0 points!",
			"icon":     "🎉",
		},
		{
			"type":     "milestone",
			"category": "performance",
			"message":  "🎯 You're doing great! Performance score is 82.0 - almost there!",
			"icon":     "🎯",
		},
	}

	response := map[string]interface{}{
		"messages":     messages,
		"project_id":   projectID,
		"generated_at": time.Now(),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) handleUserAchievements(w http.ResponseWriter, _ *http.Request, userID string) {
	achievements := []map[string]interface{}{
		{
			"id":               "ach_1",
			"achievement_type": "category_master",
			"category":         "security",
			"title":            "Security Master",
			"description":      "Achieved 90+ score in Security Analysis",
			"icon":             "🏆",
			"earned_at":        time.Now().AddDate(0, 0, -2),
		},
	}

	response := map[string]interface{}{
		"achievements": achievements,
		"total":        len(achievements),
		"user_id":      userID,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) handleGenerateReport(w http.ResponseWriter, r *http.Request) {
	var request struct {
		ScanID     string `json:"scan_id"`
		CategoryID string `json:"category_id,omitempty"`
		UserID     string `json:"user_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Generate PDF report using existing PDF service
	reportPath := fmt.Sprintf("./reports/report_%d.pdf", time.Now().Unix())

	response := map[string]interface{}{
		"report_id":    "report_" + fmt.Sprintf("%d", time.Now().Unix()),
		"report_path":  reportPath,
		"generated_at": time.Now(),
		"scan_id":      request.ScanID,
		"category_id":  request.CategoryID,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *Server) handleDownloadReport(w http.ResponseWriter, r *http.Request, reportID string) {
	reportPath := fmt.Sprintf("./reports/%s.pdf", reportID)
	http.ServeFile(w, r, reportPath)
}

// Download endpoint for desktop app - requires authentication
func (s *Server) handleDesktopAppDownload(w http.ResponseWriter, r *http.Request) {
	// Authentication is handled by middleware, user is already authenticated here
	log.Printf("🔽 Desktop app download requested by authenticated user")

	// Get platform from query parameter
	platform := r.URL.Query().Get("platform")
	if platform == "" {
		platform = "windows" // Default to Windows
	}

	// Log download attempt
	log.Printf("🔽 Desktop app download for platform: %s", platform)

	var installerPath string
	var filename string
	var contentType string

	switch platform {
	case "windows":
		installerPath = "../desktop-app/src-tauri/binaries/ElyAnalyzer-Desktop-v1.0.1-FINALL.msi"
		filename = "ElyAnalyzer-Desktop-v1.0.1-FINALL.msi"
		contentType = "application/x-msi"
	case "macos":
		installerPath = "../desktop-app/src-tauri/target/release/bundle/dmg/ElyAnalyzer Desktop_1.0.0_x64.dmg"
		filename = "ElyAnalyzer-Desktop.dmg"
		contentType = "application/octet-stream"
	case "linux":
		installerPath = "../desktop-app/src-tauri/target/release/bundle/appimage/ElyAnalyzer Desktop_1.0.0_amd64.AppImage"
		filename = "ElyAnalyzer-Desktop.AppImage"
		contentType = "application/octet-stream"
	default:
		http.Error(w, "Unsupported platform", http.StatusBadRequest)
		return
	}

	// Check if file exists
	if _, err := os.Stat(installerPath); os.IsNotExist(err) {
		log.Printf("❌ Installer file not found for %s: %s", platform, installerPath)
		http.Error(w, fmt.Sprintf("Desktop app installer not available for %s", platform), http.StatusNotFound)
		return
	}

	// Set headers for file download
	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))
	w.Header().Set("Content-Description", "ElyAnalyzer Desktop Application Installer")

	log.Printf("✅ Serving desktop app installer for %s: %s", platform, installerPath)
	http.ServeFile(w, r, installerPath)
}

// Download info endpoint
func (s *Server) handleDesktopAppInfo(w http.ResponseWriter, _ *http.Request) {
	info := map[string]interface{}{
		"platforms": map[string]interface{}{
			"windows": map[string]interface{}{
				"version":     "1.0.1",
				"platform":    "Windows",
				"size":        "7.4 MB",
				"filename":    "ElyAnalyzer-Desktop-v1.0.1-FINALL.msi",
				"description": "ElyAnalyzer Desktop Application with 15 Code Analyzers and Config Panel (MSI Installer)",
				"requirements": []string{
					"Windows 10 or later",
					"100 MB free disk space",
					"Internet connection for initial setup",
				},
				"available": true,
			},
			"macos": map[string]interface{}{
				"version":     "1.0.0",
				"platform":    "macOS",
				"size":        "4.2 MB",
				"filename":    "ElyAnalyzer-Desktop.dmg",
				"description": "ElyAnalyzer Desktop Application with 15 Code Analyzers",
				"requirements": []string{
					"macOS 10.13 or later",
					"100 MB free disk space",
					"Internet connection for initial setup",
				},
				"available": false, // Will be available when macOS build is ready
			},
			"linux": map[string]interface{}{
				"version":     "1.0.0",
				"platform":    "Linux",
				"size":        "3.5 MB",
				"filename":    "ElyAnalyzer-Desktop.AppImage",
				"description": "ElyAnalyzer Desktop Application with 15 Code Analyzers",
				"requirements": []string{
					"Ubuntu 18.04+ / CentOS 7+ / Debian 10+",
					"100 MB free disk space",
					"Internet connection for initial setup",
				},
				"available": false, // Will be true when we build for Linux
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(info)
}

func main() {
	// Load configuration
	config = LoadConfig()

	log.Printf("🚀 Starting ElyAnalyzer Backend with Supabase integration")

	supabaseClient := NewSupabaseClient()
	server := &Server{
		supabase:        supabaseClient,
		analysisService: NewAnalysisService(supabaseClient),
		clientManager:   NewClientManager(),
		pdfService:      NewPDFService(),
	}

	// Routes - Apply rate limiting, CORS, and authentication middleware
	http.HandleFunc("/health", corsMiddleware(server.handleHealth))

	// Protected API endpoints - require rate limiting and authentication
	http.HandleFunc("/api/users", corsMiddleware(rateLimitMiddleware(authMiddleware(server.handleUsers))))
	http.HandleFunc("/api/projects", corsMiddleware(rateLimitMiddleware(authMiddleware(server.handleProjects))))
	http.HandleFunc("/api/analysis", corsMiddleware(rateLimitMiddleware(authMiddleware(server.handleAnalysis))))
	http.HandleFunc("/api/scan", corsMiddleware(rateLimitMiddleware(authMiddleware(server.handleScan))))
	http.HandleFunc("/api/pdf/", corsMiddleware(rateLimitMiddleware(authMiddleware(server.handlePDFGeneration))))

	// Category-based analysis routes - require rate limiting and authentication
	http.HandleFunc("/api/projects/", corsMiddleware(rateLimitMiddleware(authMiddleware(server.handleProjectRoutes))))
	http.HandleFunc("/api/users/", corsMiddleware(rateLimitMiddleware(authMiddleware(server.handleUserRoutes))))
	http.HandleFunc("/api/reports/", corsMiddleware(rateLimitMiddleware(authMiddleware(server.handleReportRoutes))))

	// WebSocket - require rate limiting and authentication
	http.HandleFunc("/ws", corsMiddleware(rateLimitMiddleware(authMiddleware(server.handleWebSocket))))

	// Download endpoints
	http.HandleFunc("/api/download/desktop-installer", corsMiddleware(rateLimitMiddleware(authMiddleware(server.handleDesktopAppDownload)))) // Requires auth
	http.HandleFunc("/api/download/desktop", corsMiddleware(rateLimitMiddleware(authMiddleware(server.handleDesktopAppDownload))))           // Requires auth (alias for frontend compatibility)
	http.HandleFunc("/api/download/info", corsMiddleware(rateLimitMiddleware(server.handleDesktopAppInfo)))                                  // Public

	port := config.Port

	fmt.Printf("🚀 Server starting on port %s\n", port)
	fmt.Printf("🏥 Health check: http://localhost:%s/health\n", port)
	fmt.Printf("👥 Users API: http://localhost:%s/api/users\n", port)
	fmt.Printf("🏗 Projects API: http://localhost:%s/api/projects\n", port)
	fmt.Printf("📊 Analysis API: http://localhost:%s/api/analysis\n", port)
	fmt.Printf("🔍 Scan API: http://localhost:%s/api/scan\n", port)
	fmt.Printf("🔗 WebSocket API: http://localhost:%s/ws\n", port)
	fmt.Printf("🗄️ Database: Supabase REST API\n")

	go server.clientManager.run()

	log.Fatal(http.ListenAndServe(":"+port, nil))
}

