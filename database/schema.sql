-- TechSentinel Database Schema
-- Minimal MVP Schema

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    path TEXT NOT NULL,
    last_analyzed TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analysis results table
CREATE TABLE analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    scan_type VARCHAR(50) NOT NULL, -- 'full', 'dependency', 'pattern'
    results JSONB NOT NULL,
    issues_count INTEGER DEFAULT 0,
    pdf_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Patterns table (for pattern detection)
CREATE TABLE ai_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_name VARCHAR(255) NOT NULL,
    description TEXT,
    detection_rule JSONB NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default AI patterns
INSERT INTO ai_patterns (pattern_name, description, detection_rule, severity) VALUES
('missing_auth_context', 'Login component without AuthContext', 
 '{"files": ["Login.tsx", "login.tsx"], "missing": ["AuthContext.ts", "AuthContext.tsx"]}', 'high'),
('useEffect_no_cleanup', 'useEffect with async but no cleanup', 
 '{"pattern": "useEffect.*async.*", "missing_cleanup": true}', 'medium'),
('api_no_schema', 'API endpoints without schema validation', 
 '{"files": ["api/*"], "missing": ["schema.ts", "types.ts"]}', 'medium'),
('redux_no_store', 'Redux usage without store configuration', 
 '{"imports": ["redux", "@reduxjs/toolkit"], "missing": ["store.ts", "store.js"]}', 'high');

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_analysis_results_project_id ON analysis_results(project_id);
CREATE INDEX idx_analysis_results_created_at ON analysis_results(created_at DESC); 
