🛡️ CodeSentinel
==============================

CodeSentinel is an AI-powered code analysis tool designed to detect errors, inconsistencies, and potential issues in AI-generated code. It helps developers maintain code quality and catch problems that might be introduced by AI coding assistants.

🚀 Quick Start
===============

Prerequisites:
- Go 1.21+
- Docker & Docker Compose (optional)
- Node.js 18+ (for frontend)

Development Setup:

1. Start Backend:
   cd backend
   go mod tidy
   go run main.go

2. Test Analysis Engine:
   cd analysis-engine
   go run scanner.go <project-path>

3. Test API:
   curl http://localhost:8080/health

📁 Project Structure
====================

CodeSentinel/
├── backend/           # Go API server (minimal dependencies) ✅
├── frontend/          # React web dashboard (to be created)
├── desktop-app/       # Tauri desktop scanner (to be created)
├── analysis-engine/   # Code analysis core ✅ DONE
├── shared/           # Common types & utilities ✅ DONE
│   ├── types/        # Go structs + TypeScript interfaces ✅
│   └── utils/        # Shared utilities
├── database/         # PostgreSQL schema ✅ DONE
└── scripts/          # Automation scripts

🛠️ Technology Stack
===================

Backend (Minimal Dependencies):
- Language: Go 1.21
- Web Framework: Standard net/http
- Database: PostgreSQL with pgx/v5 driver
- Authentication: Manual JWT with golang-jwt/jwt/v5
- No ORM - Pure SQL queries

Analysis Engine:
- Language: Go (standard library only)
- Pattern Detection: Regex-based
- File Scanning: filepath.Walk
- Output: JSON format
- Integration: Uses shared types ✅

Shared Types:
- Go structs for backend/analysis engine ✅
- TypeScript interfaces for frontend ✅
- Type-safe communication across all components ✅

Database:
- Primary: PostgreSQL 15
- Cache: Redis 7
- Schema: Pure SQL migrations

Current Status:
✅ Database schema
✅ Go backend with basic CRUD
✅ Analysis Engine with pattern detection
✅ Shared Types (Go + TypeScript) ✅ NEW!
✅ Type-safe integration ✅ NEW!
✅ Docker development environment
⏳ Frontend React app
⏳ Desktop Tauri app

📋 MVP Features (In Progress)
=============================

- [x] User management API
- [x] Database setup
- [x] File scanning engine
- [x] Basic pattern detection
- [x] Shared types system ✅ NEW!
- [ ] PDF report generation
- [ ] Web dashboard
- [ ] Desktop app

🎯 Development Philosophy
========================

Minimal Dependencies: Bu proje mümkün olduğunca az external dependency 
kullanarak geliştirilmektedir.

- Go standard library öncelikli
- Pure SQL, ORM yok
- Minimal web framework
- Essential packages only
- Type-safe communication ✅ NEW!

🔧 Commands
===========

# Test Analysis Engine
cd analysis-engine
go run scanner.go ../frontend  # Scan a project

# Start Backend
cd backend
go run main.go

# Check Shared Types
cd shared
go fmt ./... && go vet ./...

# Code Quality
go fmt ./...
go vet ./...

# Database (if Docker available)
docker-compose up -d postgres

🎯 Next Steps:
- Frontend React dashboard
- Backend + Analysis Engine integration
- Desktop Tauri app 

## Features

- 🔍 **Smart Detection**: Identifies common AI coding mistakes
- 🚀 **Fast Analysis**: Quick scanning of entire codebases
- 📊 **Detailed Reports**: Comprehensive analysis with suggestions
- 🎯 **Pattern Recognition**: Learns from common AI-generated code patterns
- 🛠️ **Multi-Language Support**: Works with JavaScript, TypeScript, Python, and more

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Run analysis: `npm run analyze`

## Project Structure

```
codesentinel/
├── frontend/          # React frontend application
├── backend/           # Go backend API
├── analysis-engine/   # Core analysis logic
├── shared/           # Shared types and utilities
└── docs/             # Documentation
```

## Developer

**Ahmet Çetin** - Lead Developer & Creator of CodeSentinel

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## License

MIT License - see LICENSE file for details.

---

© 2024 Ahmet Çetin. All rights reserved. 
