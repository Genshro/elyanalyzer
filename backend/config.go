package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Configuration constants
const (
	DefaultPort                = "8080"
	DefaultEnvironment         = "development"
	DefaultRateLimitRPM        = 60
	DefaultRateLimitBurst      = 100
	DefaultMaxFileSize         = 10 * 1024 * 1024 // 10MB
	DefaultSessionTimeout      = 120              // minutes
	DefaultMaxConcurrentSess   = 5
	DefaultDBPoolSize          = 10
	DefaultDBMaxIdleConns      = 5
	DefaultDBConnectionTimeout = 30 // seconds
	DefaultLogLevel            = "info"
	DefaultLogFile             = "./logs/elyanalyzer.log"
	MinJWTSecretLength         = 32
	MaxFileSize                = 100 * 1024 * 1024 // 100MB
)

// Config holds all application configuration
type Config struct {
	// Core settings
	SupabaseURL        string   `json:"supabase_url" validate:"required,url"`
	SupabaseAnonKey    string   `json:"supabase_anon_key" validate:"required,min=32"`
	SupabaseServiceKey string   `json:"supabase_service_key" validate:"required,min=32"`
	Port               string   `json:"port" validate:"required,numeric"`
	Environment        string   `json:"environment" validate:"required,oneof=development staging production"`
	AllowedOrigins     []string `json:"allowed_origins" validate:"required,dive,url"`
	JWTSecret          string   `json:"-"` // Hidden from JSON for security

	// Security settings
	RateLimitRPM        int      `json:"rate_limit_rpm" validate:"min=1,max=10000"`
	RateLimitBurst      int      `json:"rate_limit_burst" validate:"min=1,max=20000"`
	MaxFileSize         int64    `json:"max_file_size" validate:"min=1024,max=104857600"` // 1KB to 100MB
	AllowedFileTypes    []string `json:"allowed_file_types" validate:"required,dive,startswith=."`
	AllowedProjectPaths []string `json:"allowed_project_paths" validate:"required,dive,min=1"`

	// Session settings
	SessionTimeoutMin     int `json:"session_timeout_min" validate:"min=5,max=1440"` // 5 min to 24 hours
	MaxConcurrentSessions int `json:"max_concurrent_sessions" validate:"min=1,max=100"`

	// Database settings
	DBPoolSize          int `json:"db_pool_size" validate:"min=1,max=100"`
	DBMaxIdleConns      int `json:"db_max_idle_conns" validate:"min=1,max=50"`
	DBConnectionTimeout int `json:"db_connection_timeout" validate:"min=5,max=300"` // 5s to 5min

	// Logging
	LogLevel string `json:"log_level" validate:"required,oneof=debug info warn error"`
	LogFile  string `json:"log_file" validate:"required"`

	// Runtime fields
	LoadedAt time.Time `json:"loaded_at"`
}

func LoadConfig() *Config {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Printf("⚠️  .env file not found or couldn't be loaded: %v", err)
		log.Println("📝 Using system environment variables")
	} else {
		log.Println("✅ .env file loaded successfully")
	}

	// Default allowed origins for development
	defaultOrigins := []string{
		"http://localhost:3000",
		"http://localhost:1420",
		"http://localhost:8080",
		"https://www.elyanalyzer.com",
		"https://elyanalyzer.com",
	}

	// Default allowed file types
	defaultFileTypes := []string{".js", ".ts", ".go", ".py", ".java", ".jsx", ".tsx"}

	// Default allowed project paths
	defaultProjectPaths := []string{"/home", "/Users", "/workspace", "C:\\Users", "C:\\Projects"}

	config := &Config{
		// Core settings
		SupabaseURL:        getEnvRequired("SUPABASE_URL"),
		SupabaseAnonKey:    getEnvRequired("SUPABASE_ANON_KEY"),
		SupabaseServiceKey: getEnvRequired("SUPABASE_SERVICE_KEY"),
		Port:               getEnv("PORT", DefaultPort),
		Environment:        getEnv("ENVIRONMENT", DefaultEnvironment),
		AllowedOrigins:     getEnvSlice("ALLOWED_ORIGINS", defaultOrigins),
		JWTSecret:          getOrGenerateJWTSecret(),

		// Security settings
		RateLimitRPM:        getEnvInt("RATE_LIMIT_REQUESTS_PER_MINUTE", DefaultRateLimitRPM),
		RateLimitBurst:      getEnvInt("RATE_LIMIT_BURST", DefaultRateLimitBurst),
		MaxFileSize:         getEnvInt64("MAX_FILE_SIZE", DefaultMaxFileSize),
		AllowedFileTypes:    getEnvSlice("ALLOWED_FILE_TYPES", defaultFileTypes),
		AllowedProjectPaths: getEnvSlice("ALLOWED_PROJECT_PATHS", defaultProjectPaths),

		// Session settings
		SessionTimeoutMin:     getEnvInt("SESSION_TIMEOUT_MINUTES", DefaultSessionTimeout),
		MaxConcurrentSessions: getEnvInt("MAX_CONCURRENT_SESSIONS", DefaultMaxConcurrentSess),

		// Database settings
		DBPoolSize:          getEnvInt("DB_POOL_SIZE", DefaultDBPoolSize),
		DBMaxIdleConns:      getEnvInt("DB_MAX_IDLE_CONNECTIONS", DefaultDBMaxIdleConns),
		DBConnectionTimeout: getEnvInt("DB_CONNECTION_TIMEOUT", DefaultDBConnectionTimeout),

		// Logging
		LogLevel: getEnv("LOG_LEVEL", DefaultLogLevel),
		LogFile:  getEnv("LOG_FILE", DefaultLogFile),

		// Runtime fields
		LoadedAt: time.Now(),
	}

	validateConfig(config)

	return config
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvRequired(key string) string {
	value := os.Getenv(key)
	if value == "" {
		log.Fatalf("❌ Required environment variable %s is not set", key)
	}
	return value
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		} else {
			log.Printf("⚠️  WARNING: Invalid integer value for %s: %s, using default: %d", key, value, defaultValue)
		}
	}
	return defaultValue
}

func getEnvInt64(key string, defaultValue int64) int64 {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.ParseInt(value, 10, 64); err == nil {
			return intVal
		} else {
			log.Printf("⚠️  WARNING: Invalid int64 value for %s: %s, using default: %d", key, value, defaultValue)
		}
	}
	return defaultValue
}

func getEnvSlice(key string, defaultValue []string) []string {
	if value := os.Getenv(key); value != "" {
		// Split and trim whitespace from each element
		parts := strings.Split(value, ",")
		result := make([]string, 0, len(parts))
		for _, part := range parts {
			trimmed := strings.TrimSpace(part)
			if trimmed != "" {
				result = append(result, trimmed)
			}
		}
		if len(result) > 0 {
			return result
		}
		log.Printf("⚠️  WARNING: Empty slice for %s, using defaults", key)
	}
	return defaultValue
}

func getOrGenerateJWTSecret() string {
	if secret := os.Getenv("JWT_SECRET"); secret != "" {
		if len(secret) < MinJWTSecretLength {
			log.Printf("⚠️  WARNING: JWT_SECRET is too short (%d chars). Should be at least %d characters.",
				len(secret), MinJWTSecretLength)
		}
		return secret
	}

	log.Println("🔐 Generating random JWT secret. Set JWT_SECRET environment variable for production.")
	secret := make([]byte, MinJWTSecretLength)
	if _, err := rand.Read(secret); err != nil {
		log.Fatalf("❌ Failed to generate random JWT secret: %v", err)
	}
	return base64.URLEncoding.EncodeToString(secret)
}

func validateConfig(config *Config) {
	var errors []string
	var warnings []string

	// Validate core settings
	if config.Environment == "production" {
		if config.JWTSecret == "" || len(config.JWTSecret) < MinJWTSecretLength {
			errors = append(errors, fmt.Sprintf("Production environment requires a strong JWT_SECRET (%d+ characters)", MinJWTSecretLength))
		}

		// Check HTTPS origins in production
		for _, origin := range config.AllowedOrigins {
			if !strings.HasPrefix(origin, "https://") && !strings.HasPrefix(origin, "http://localhost") {
				warnings = append(warnings, fmt.Sprintf("Non-HTTPS origin in production: %s", origin))
			}
		}
	}

	// Validate file size limits
	if config.MaxFileSize > MaxFileSize {
		warnings = append(warnings, fmt.Sprintf("Max file size is very large: %d bytes (max recommended: %d)",
			config.MaxFileSize, MaxFileSize))
	}
	if config.MaxFileSize < 1024 {
		errors = append(errors, "Max file size too small (minimum: 1KB)")
	}

	// Validate rate limiting
	if config.RateLimitRPM <= 0 || config.RateLimitRPM > 10000 {
		warnings = append(warnings, fmt.Sprintf("Rate limit RPM seems unusual: %d", config.RateLimitRPM))
	}

	// Validate database settings
	if config.DBPoolSize <= 0 || config.DBPoolSize > 100 {
		warnings = append(warnings, fmt.Sprintf("DB pool size seems unusual: %d", config.DBPoolSize))
	}

	// Print warnings
	for _, warning := range warnings {
		log.Printf("⚠️  WARNING: %s", warning)
	}

	// Handle errors
	if len(errors) > 0 {
		for _, err := range errors {
			log.Printf("❌ ERROR: %s", err)
		}
		log.Fatal("❌ Configuration validation failed")
	}

	log.Printf("✅ Configuration loaded successfully for %s environment", config.Environment)
}
