-- Supabase Table Setup Script
-- Bu script'i Supabase SQL Editor'da çalıştırın

-- 1. Users table (zaten var olabilir)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    path TEXT NOT NULL,
    last_analyzed TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Analysis results table (ana tablo)
CREATE TABLE IF NOT EXISTS analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    scan_type VARCHAR(50) NOT NULL DEFAULT 'full',
    results JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Dummy user oluştur (eğer yoksa)
INSERT INTO users (id, email, name, created_at) 
VALUES (
    '00000000-0000-0000-0000-000000000000'::UUID,
    'test@example.com',
    'Test User',
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- 5. Dummy project oluştur (test için)
INSERT INTO projects (id, user_id, name, path, created_at) 
VALUES (
    '00000000-0000-0000-0000-000000000001'::UUID,
    '00000000-0000-0000-0000-000000000000'::UUID,
    'Test Project',
    '/test/path',
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- 6. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_project_id ON analysis_results(project_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON analysis_results(created_at DESC);

-- 7. RLS (Row Level Security) policies
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous access to analysis_results" ON analysis_results;
DROP POLICY IF EXISTS "Allow anonymous access to projects" ON projects;

-- Create new policies (development mode - allow all)
CREATE POLICY "Allow anonymous access to analysis_results" 
ON analysis_results FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow anonymous access to projects" 
ON projects FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

-- 8. Verify tables
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name IN ('analysis_results', 'projects', 'users')
ORDER BY table_name, ordinal_position;

-- Incremental Supabase Setup - Only add missing tables
-- Bu script mevcut tabloları silmez, sadece eksikleri ekler

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID, -- Remove foreign key constraint for now
    name VARCHAR(255) NOT NULL,
    description TEXT,
    repository_url VARCHAR(500),
    project_path VARCHAR(500),
    framework VARCHAR(100),
    project_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analysis_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS analysis_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    max_score INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert categories only if they don't exist
INSERT INTO analysis_categories (id, name, display_name, description, icon) 
SELECT * FROM (VALUES
    ('11111111-1111-1111-1111-111111111111', 'security', 'Security Analysis', 'Security vulnerabilities and best practices', '🔒'),
    ('22222222-2222-2222-2222-222222222222', 'code_quality', 'Code Quality', 'Code maintainability and SOLID principles', '✨'),
    ('33333333-3333-3333-3333-333333333333', 'performance', 'Performance', 'Performance bottlenecks and optimization', '🚀'),
    ('44444444-4444-4444-4444-444444444444', 'maintainability', 'Maintainability', 'Code maintainability and refactoring needs', '🔧'),
    ('55555555-5555-5555-5555-555555555555', 'reliability', 'Reliability', 'System reliability and error handling', '🛡️'),
    ('66666666-6666-6666-6666-666666666666', 'documentation', 'Documentation', 'Code and API documentation quality', '📚'),
    ('77777777-7777-7777-7777-777777777777', 'testing', 'Testing', 'Test coverage and quality assurance', '🧪'),
    ('88888888-8888-8888-8888-888888888888', 'complexity', 'Code Complexity', 'Cyclomatic complexity and code structure', '🧩'),
    ('99999999-9999-9999-9999-999999999999', 'dependencies', 'Dependencies', 'Dependency management and versioning', '📦'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'architecture', 'Architecture', 'Design patterns, SOLID principles, and system architecture', '🏗️'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'error_handling', 'Error Handling', 'Exception handling and error management', '🚨'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'memory_usage', 'Memory Usage', 'Memory leaks and resource management', '💾'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'concurrency', 'Concurrency', 'Thread safety and concurrent programming', '⚡'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'api_design', 'API Design', 'RESTful API design and best practices', '🌐'),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'deployment', 'Deployment', 'CI/CD and deployment readiness', '🚀')
) AS v(id, name, display_name, description, icon)
WHERE NOT EXISTS (
    SELECT 1 FROM analysis_categories WHERE name = v.name
);

-- Create analysis_scans table if it doesn't exist  
CREATE TABLE IF NOT EXISTS analysis_scans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    scan_type VARCHAR(50) DEFAULT 'full',
    total_files INTEGER DEFAULT 0,
    total_issues INTEGER DEFAULT 0,
    critical_issues INTEGER DEFAULT 0,
    overall_score DECIMAL(5,2) DEFAULT 0,
    scan_duration_ms INTEGER,
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create category_scores table if it doesn't exist
CREATE TABLE IF NOT EXISTS category_scores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    scan_id UUID REFERENCES analysis_scans(id) ON DELETE CASCADE,
    category_id UUID REFERENCES analysis_categories(id),
    score DECIMAL(5,2) DEFAULT 0,
    max_score INTEGER DEFAULT 100,
    issue_count INTEGER DEFAULT 0,
    critical_issues INTEGER DEFAULT 0,
    warning_issues INTEGER DEFAULT 0,
    info_issues INTEGER DEFAULT 0,
    improvements JSONB DEFAULT '[]',
    trend VARCHAR(20), -- 'improving', 'declining', 'stable', 'new'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(scan_id, category_id)
);

-- Create dummy project if it doesn't exist
INSERT INTO projects (id, user_id, name, description, project_path)
SELECT '00000000-0000-0000-0000-000000000001', 
       '00000000-0000-0000-0000-000000000002', -- Dummy user ID
       'Test Project', 
       'Test project for development', 
       '/test/path'
WHERE NOT EXISTS (
    SELECT 1 FROM projects WHERE id = '00000000-0000-0000-0000-000000000001'
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_scans_project_id ON analysis_scans(project_id);
CREATE INDEX IF NOT EXISTS idx_analysis_scans_created_at ON analysis_scans(created_at);
CREATE INDEX IF NOT EXISTS idx_category_scores_scan_id ON category_scores(scan_id);
CREATE INDEX IF NOT EXISTS idx_category_scores_category_id ON category_scores(category_id);

-- Grant permissions for anonymous access (development only)
ALTER TABLE analysis_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_scores ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (development only)
DROP POLICY IF EXISTS "Allow anonymous read on analysis_categories" ON analysis_categories;
CREATE POLICY "Allow anonymous read on analysis_categories" ON analysis_categories FOR ALL TO anon USING (true);

DROP POLICY IF EXISTS "Allow anonymous access on projects" ON projects;
CREATE POLICY "Allow anonymous access on projects" ON projects FOR ALL TO anon USING (true);

DROP POLICY IF EXISTS "Allow anonymous access on analysis_scans" ON analysis_scans;
CREATE POLICY "Allow anonymous access on analysis_scans" ON analysis_scans FOR ALL TO anon USING (true);

DROP POLICY IF EXISTS "Allow anonymous access on category_scores" ON category_scores;
CREATE POLICY "Allow anonymous access on category_scores" ON category_scores FOR ALL TO anon USING (true);

-- Show created tables
SELECT 'Tables created successfully!' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('projects', 'analysis_categories', 'analysis_scans', 'category_scores');

-- Show categories
SELECT name, display_name, icon FROM analysis_categories ORDER BY name; 