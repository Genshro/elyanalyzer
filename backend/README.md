# 🚀 ElyAnalyzer Backend API

Backend API for ElyAnalyzer - Privacy-first code analysis platform.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │────│  Backend API    │────│  Analysis Engine│
│   (React)       │    │   (Go)          │    │   (Rust)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                │
                         ┌─────────────────┐
                         │   Database      │
                         │  (Supabase)     │
                         └─────────────────┘
```

## 🔧 Tech Stack

- **Language**: Go 1.21+
- **Web Framework**: Gin
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **PDF Generation**: Custom PDF service
- **Analysis Engine**: External Rust binary

## 📦 Installation

### Prerequisites
```bash
# Install Go 1.21+
go version

# Install dependencies
go mod tidy
```

### Environment Setup
```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env
```

### Required Environment Variables
```env
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Server
PORT=8080
GIN_MODE=release

# Analysis Engine
ANALYSIS_ENGINE_PATH=./analysis-engine.exe
REPORTS_DIR=./reports

# CORS
FRONTEND_URL=http://localhost:5173
```

## 🚀 Running the Server

### Development
```bash
go run main.go
```

### Production
```bash
# Build
go build -o backend main.go

# Run
./backend
```

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Analysis
- `POST /api/analyze` - Start code analysis
- `GET /api/analysis/:id` - Get analysis results
- `GET /api/analysis/:id/report` - Download PDF report

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent` - Get recent analyses
- `GET /api/dashboard/issues` - Get current issues

### Admin (Protected)
- `GET /api/admin/users` - Get user statistics
- `GET /api/admin/projects` - Get project statistics
- `GET /api/admin/analytics` - Get system analytics

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **CORS Protection** - Cross-origin request filtering
- **Rate Limiting** - API request throttling
- **Input Validation** - Request payload validation
- **SQL Injection Protection** - Parameterized queries

## 📊 Analysis Flow

1. **Request Reception** - API receives analysis request
2. **Authentication** - Verify user permissions
3. **File Processing** - Prepare files for analysis
4. **Engine Execution** - Call Rust analysis engine
5. **Result Processing** - Parse and store results
6. **Dashboard Update** - Update user dashboard
7. **Report Generation** - Generate PDF reports

## 🔧 Configuration

### Analysis Engine Integration
```go
type AnalysisRequest struct {
    ProjectPath string   `json:"project_path"`
    ScanTypes   []string `json:"scan_types"`
    Files       []string `json:"files,omitempty"`
}

type AnalysisResult struct {
    Success bool                   `json:"success"`
    Message string                 `json:"message"`
    Results map[string]interface{} `json:"results,omitempty"`
}
```

### Database Schema
```sql
-- Analysis scans
CREATE TABLE analysis_scans (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    total_files INTEGER,
    total_issues INTEGER,
    critical_issues INTEGER,
    created_at TIMESTAMP
);

-- Category scores
CREATE TABLE category_scores (
    id UUID PRIMARY KEY,
    scan_id UUID REFERENCES analysis_scans(id),
    category_id UUID REFERENCES analysis_categories(id),
    score DECIMAL(5,2),
    critical_issues INTEGER,
    warning_issues INTEGER,
    info_issues INTEGER
);
```

## 📈 Performance

- **Concurrent Processing** - Multi-threaded analysis
- **Database Optimization** - Supabase indexed queries
- **Memory Management** - Efficient resource usage
- **Connection Pooling** - Optimized database connections

## 🧪 Testing

```bash
# Run tests
go test ./...

# Run with coverage
go test -cover ./...

# Benchmark tests
go test -bench=. ./...
```

## 📝 API Documentation

### Analysis Request Example
```json
{
  "project_path": "/path/to/project",
  "scan_types": [
    "security",
    "code_quality",
    "performance"
  ],
  "files": [
    "src/main.go",
    "src/handlers.go"
  ]
}
```

### Analysis Response Example
```json
{
  "success": true,
  "message": "Analysis completed successfully",
  "results": {
    "summary": {
      "total_files": 25,
      "issues_found": 12,
      "critical_issues": 2
    },
    "issues": [
      {
        "type": "security",
        "severity": "high",
        "description": "SQL injection vulnerability",
        "file": "src/database.go",
        "line": 45,
        "suggestion": "Use parameterized queries"
      }
    ]
  }
}
```

## 🐛 Error Handling

```json
{
  "error": {
    "code": "ANALYSIS_FAILED",
    "message": "Analysis engine execution failed",
    "details": {
      "engine_error": "Permission denied",
      "project_path": "/invalid/path"
    }
  }
}
```

## 📊 Monitoring

- **Health Check**: `GET /health`
- **Metrics**: `GET /metrics`
- **Status**: `GET /status`

## 🔄 Deployment

### Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema from `/database/supabase_schema.sql`
3. Get your project URL and API keys from Settings > API
4. Configure environment variables

### Local Development
```bash
# Setup environment
cp config.example.env .env
# Add your Supabase credentials to .env

# Run the server
go run main.go
```

### Production Deployment
```bash
# Build the binary
go build -o backend main.go

# Run with production environment
export GIN_MODE=release
./backend
```

### Vercel/Railway/Heroku Deployment
The backend can be easily deployed to any Go-supporting platform:
- Set environment variables
- Deploy the Go application
- Ensure Supabase connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🌼 About ElyAnalyzer

ElyAnalyzer is a privacy-first code analysis platform that transforms complex codebases into clear, actionable insights. Built with ❤️ for developers worldwide.

- **Website**: [elyanalyzer.com](https://elyanalyzer.com)
- **GitHub**: [github.com/Genshro/elyanalyzer](https://github.com/Genshro/elyanalyzer)
- **Developer**: Ahmet Çetin

---

*"Accompanies you on your journey" - From complexity to clarity* 🌼 