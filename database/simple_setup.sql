-- Minimal Supabase Setup - Only essential tables
-- Bu script sadece gerekli tabloları oluşturur

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fix existing projects table if it has user_id constraint
ALTER TABLE projects ALTER COLUMN user_id DROP NOT NULL;

-- 1. Projects table (basit)
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Analysis categories table
CREATE TABLE IF NOT EXISTS analysis_categories (
    id UUID PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    icon VARCHAR(10)
);

-- 3. Analysis scans table
CREATE TABLE IF NOT EXISTS analysis_scans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    total_files INTEGER DEFAULT 0,
    total_issues INTEGER DEFAULT 0,
    critical_issues INTEGER DEFAULT 0,
    overall_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Category scores table
CREATE TABLE IF NOT EXISTS category_scores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    scan_id UUID REFERENCES analysis_scans(id),
    category_id UUID REFERENCES analysis_categories(id),
    score DECIMAL(5,2) DEFAULT 0,
    critical_issues INTEGER DEFAULT 0,
    warning_issues INTEGER DEFAULT 0,
    info_issues INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert categories
INSERT INTO analysis_categories (id, name, display_name, icon) VALUES
('11111111-1111-1111-1111-111111111111', 'security', 'Security Analysis', '🔒'),
('22222222-2222-2222-2222-222222222222', 'code_quality', 'Code Quality', '✨'),
('33333333-3333-3333-3333-333333333333', 'performance', 'Performance', '🚀'),
('44444444-4444-4444-4444-444444444444', 'maintainability', 'Maintainability', '🔧'),
('55555555-5555-5555-5555-555555555555', 'reliability', 'Reliability', '🛡️'),
('66666666-6666-6666-6666-666666666666', 'documentation', 'Documentation', '📚'),
('77777777-7777-7777-7777-777777777777', 'testing', 'Testing', '🧪'),
('88888888-8888-8888-8888-888888888888', 'complexity', 'Code Complexity', '🧩'),
('99999999-9999-9999-9999-999999999999', 'dependencies', 'Dependencies', '📦'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'architecture', 'Architecture', '🏗️'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'error_handling', 'Error Handling', '🚨'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'memory_usage', 'Memory Usage', '💾'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'concurrency', 'Concurrency', '⚡'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'api_design', 'API Design', '🌐'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'deployment', 'Deployment', '🚀')
ON CONFLICT (name) DO NOTHING;

-- Insert dummy project
INSERT INTO projects (id, name) VALUES 
('00000000-0000-0000-0000-000000000001', 'Test Project')
ON CONFLICT (id) DO NOTHING;

-- Enable anonymous access (development only)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_scores ENABLE ROW LEVEL SECURITY;

-- Create simple policies
DROP POLICY IF EXISTS "anon_projects" ON projects;
CREATE POLICY "anon_projects" ON projects FOR ALL TO anon USING (true);

DROP POLICY IF EXISTS "anon_categories" ON analysis_categories;
CREATE POLICY "anon_categories" ON analysis_categories FOR ALL TO anon USING (true);

DROP POLICY IF EXISTS "anon_scans" ON analysis_scans;
CREATE POLICY "anon_scans" ON analysis_scans FOR ALL TO anon USING (true);

DROP POLICY IF EXISTS "anon_scores" ON category_scores;
CREATE POLICY "anon_scores" ON category_scores FOR ALL TO anon USING (true);

-- Show results
SELECT 'Setup completed!' as status;
SELECT name, display_name FROM analysis_categories ORDER BY name; 