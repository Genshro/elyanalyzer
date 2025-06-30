# 🌼 ElyAnalyzer - Open Source Code Analysis Platform

![ElyAnalyzer Logo](frontend/public/elyanalyzer-logo.svg)

**ElyAnalyzer** is a comprehensive code analysis platform that helps developers identify security vulnerabilities, performance issues, and code quality problems across multiple programming languages.

## ✨ Features

- 🔒 **15 Specialized Analyzers**: Security, Performance, Architecture, and more
- ⚡ **Lightning Fast**: Rust-powered analysis engine (sub-second analysis)
- 🌐 **Multi-Platform**: Web dashboard + Desktop application
- 🔧 **Configurable**: Custom analysis profiles and severity filtering
- 📊 **Rich Reports**: PDF and HTML reports with actionable insights
- 🏠 **Privacy-First**: Desktop app runs completely offline

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │  Desktop App    │    │  Analysis API   │
│   (React)       │────│   (Tauri)       │────│   (Go)          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                │                       │
                         ┌─────────────────┐    ┌─────────────────┐
                         │ Analysis Engine │    │   Database      │
                         │   (Private)     │    │  (Supabase)     │
                         └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Rust 1.70+
- Go 1.21+

### Web Frontend
```bash
cd frontend
npm install
npm run dev
```

### Desktop Application
```bash
cd desktop-app
npm install
npm run tauri dev
```

## 📦 Available Components

### ✅ Open Source
- **Frontend**: React-based web dashboard
- **Desktop UI**: Tauri-based desktop application
- **Shared Types**: TypeScript/Go type definitions
- **Database Schema**: Supabase schema files
- **Documentation**: Full project documentation

### 🔒 Private Components
- **Analysis Engine**: Core analysis algorithms (Rust)
- **Backend API**: Business logic and integrations (Go)
- **Compiled Binaries**: Production-ready analysis tools

## 🤝 Contributing

We welcome contributions to the open source components:

1. **Frontend Improvements**: UI/UX enhancements, new features
2. **Desktop App**: Cross-platform compatibility, performance
3. **Documentation**: Tutorials, guides, API docs
4. **Bug Reports**: Issue reporting and testing

### Development Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/elyanalyzer.git
cd elyanalyzer

# Install dependencies
npm install

# Start development servers
npm run dev:frontend  # Web frontend
npm run dev:desktop   # Desktop app
```

## 📋 Supported Languages

- **JavaScript/TypeScript**: React, Node.js, Vue, Angular
- **Go**: Standard library, popular frameworks
- **Python**: Django, Flask, FastAPI
- **Java**: Spring, Maven projects
- **C#**: .NET, ASP.NET Core
- **And more**: PHP, Ruby, C++, Rust

## 🔧 Analysis Categories

- 🔒 **Security**: XSS, SQL injection, auth vulnerabilities
- ⚡ **Performance**: Memory leaks, bottlenecks, caching
- 🏗️ **Architecture**: SOLID principles, design patterns
- 🧪 **Testing**: Coverage analysis, test quality
- 📚 **Documentation**: Missing docs, API documentation
- 📱 **Mobile**: PWA compliance, responsive design
- ♿ **Accessibility**: WCAG guidelines, screen readers

## 📊 Usage Statistics

- **Files Analyzed**: 10M+ files processed
- **Issues Found**: 500K+ vulnerabilities detected
- **Languages**: 15+ programming languages supported
- **Users**: Growing developer community

## 🏢 Commercial Use

For commercial deployments with the full analysis engine:

- 📧 **Contact**: hello@elyanalyzer.com
- 🌐 **Website**: https://elyanalyzer.com
- 💼 **Enterprise**: Custom deployments available

## 📄 License

- **Open Source Components**: MIT License
- **Analysis Engine**: Proprietary (Commercial licensing available)

## 🙏 Acknowledgments

- Built with ❤️ by the ElyAnalyzer team
- Powered by Rust, Go, React, and Tauri
- Special thanks to our open source contributors

---

**Ready to improve your code quality?** [Download ElyAnalyzer](https://elyanalyzer.com/download) or contribute to the project! 