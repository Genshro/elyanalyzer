-- Supabase Database Schema for CodeSentinel
-- Run this in Supabase SQL Editor

-- Note: auth.users table is already managed by Supabase
-- We only create our public tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    repository_url VARCHAR(500),
    project_path VARCHAR(500),
    framework VARCHAR(100),
    project_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analysis categories table
CREATE TABLE analysis_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    max_score INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO analysis_categories (id, name, display_name, description, icon) VALUES
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
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'deployment', 'Deployment', 'CI/CD and deployment readiness', '🚀');

-- Analysis scans table (main scan record)
CREATE TABLE analysis_scans (
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

-- Category scores table (detailed category results)
CREATE TABLE category_scores (
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

-- Issues table (individual issues found)
CREATE TABLE analysis_issues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    scan_id UUID REFERENCES analysis_scans(id) ON DELETE CASCADE,
    category_id UUID REFERENCES analysis_categories(id),
    issue_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    line_number INTEGER,
    suggestion TEXT,
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'fixed', 'ignored'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table
CREATE TABLE user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL
);

-- Analysis reports table (for PDF generation)
CREATE TABLE analysis_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    scan_id UUID REFERENCES analysis_scans(id) ON DELETE CASCADE,
    category_id UUID REFERENCES analysis_categories(id),
    report_type VARCHAR(50) DEFAULT 'pdf',
    file_path VARCHAR(500),
    file_size INTEGER,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_analysis_scans_project_id ON analysis_scans(project_id);
CREATE INDEX idx_analysis_scans_created_at ON analysis_scans(created_at);
CREATE INDEX idx_category_scores_scan_id ON category_scores(scan_id);
CREATE INDEX idx_category_scores_category_id ON category_scores(category_id);
CREATE INDEX idx_analysis_issues_scan_id ON analysis_issues(scan_id);
CREATE INDEX idx_analysis_issues_category_id ON analysis_issues(category_id);
CREATE INDEX idx_analysis_issues_severity ON analysis_issues(severity);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);

-- Create a view for category trends
CREATE VIEW category_trends AS
SELECT 
    cs.category_id,
    ac.name as category_name,
    ac.display_name,
    cs.scan_id,
    cs.score,
    cs.issue_count,
    cs.critical_issues,
    cs.created_at,
    p.id as project_id,
    p.name as project_name,
    LAG(cs.score) OVER (PARTITION BY cs.category_id, p.id ORDER BY cs.created_at) as previous_score,
    LAG(cs.issue_count) OVER (PARTITION BY cs.category_id, p.id ORDER BY cs.created_at) as previous_issue_count
FROM category_scores cs
JOIN analysis_scans ascan ON cs.scan_id = ascan.id
JOIN projects p ON ascan.project_id = p.id
JOIN analysis_categories ac ON cs.category_id = ac.id
ORDER BY cs.created_at DESC;

-- Create a function to calculate trend
CREATE OR REPLACE FUNCTION calculate_trend(current_score DECIMAL, previous_score DECIMAL)
RETURNS VARCHAR(20) AS $$
BEGIN
    IF previous_score IS NULL THEN
        RETURN 'new';
    ELSIF current_score > previous_score + 5 THEN
        RETURN 'improving';
    ELSIF current_score < previous_score - 5 THEN
        RETURN 'declining';
    ELSE
        RETURN 'stable';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a function to check achievements
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID, p_project_id UUID, p_scan_id UUID)
RETURNS VOID AS $$
DECLARE
    category_record RECORD;
    achievement_exists BOOLEAN;
BEGIN
    -- Check for category-specific achievements (score >= 90)
    FOR category_record IN 
        SELECT cs.category_id, ac.name, ac.display_name, cs.score
        FROM category_scores cs
        JOIN analysis_categories ac ON cs.category_id = ac.id
        WHERE cs.scan_id = p_scan_id AND cs.score >= 90
    LOOP
        -- Check if achievement already exists
        SELECT EXISTS(
            SELECT 1 FROM user_achievements 
            WHERE user_id = p_user_id 
            AND achievement_type = 'category_master'
            AND category = category_record.name
        ) INTO achievement_exists;
        
        IF NOT achievement_exists THEN
            INSERT INTO user_achievements (user_id, achievement_type, category, title, description, icon, project_id)
            VALUES (
                p_user_id,
                'category_master',
                category_record.name,
                category_record.display_name || ' Master',
                'Achieved 90+ score in ' || category_record.display_name,
                '🏆',
                p_project_id
            );
        END IF;
    END LOOP;
    
    -- Check for "Perfect Security" achievement (security score = 100)
    SELECT EXISTS(
        SELECT 1 FROM category_scores cs
        JOIN analysis_categories ac ON cs.category_id = ac.id
        WHERE cs.scan_id = p_scan_id 
        AND ac.name = 'security' 
        AND cs.score = 100
    ) INTO achievement_exists;
    
    IF achievement_exists THEN
        INSERT INTO user_achievements (user_id, achievement_type, category, title, description, icon, project_id)
        VALUES (
            p_user_id,
            'perfect_security',
            'security',
            'Security Guardian',
            'Achieved perfect security score!',
            '🛡️',
            p_project_id
        )
        ON CONFLICT DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update trends
CREATE OR REPLACE FUNCTION update_category_trend()
RETURNS TRIGGER AS $$
DECLARE
    prev_score DECIMAL;
BEGIN
    -- Get previous score for this category and project
    SELECT cs.score INTO prev_score
    FROM category_scores cs
    JOIN analysis_scans ascan ON cs.scan_id = ascan.id
    JOIN analysis_scans current_scan ON current_scan.project_id = ascan.project_id
    WHERE current_scan.id = NEW.scan_id
    AND cs.category_id = NEW.category_id
    AND cs.created_at < NEW.created_at
    ORDER BY cs.created_at DESC
    LIMIT 1;
    
    -- Update trend
    NEW.trend = calculate_trend(NEW.score, prev_score);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_category_trend
    BEFORE INSERT ON category_scores
    FOR EACH ROW
    EXECUTE FUNCTION update_category_trend();

-- Sample data for testing
-- This would be populated by the application, but here's an example structure

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can view own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own scans" ON analysis_scans FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM projects WHERE id = project_id)
);
CREATE POLICY "Users can view own category scores" ON category_scores FOR ALL USING (
    auth.uid() IN (
        SELECT p.user_id FROM projects p 
        JOIN analysis_scans ascan ON p.id = ascan.project_id
        WHERE ascan.id = scan_id
    )
);
CREATE POLICY "Users can view own issues" ON analysis_issues FOR ALL USING (
    auth.uid() IN (
        SELECT p.user_id FROM projects p 
        JOIN analysis_scans ascan ON p.id = ascan.project_id
        WHERE ascan.id = scan_id
    )
);
CREATE POLICY "Users can view own achievements" ON user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own reports" ON analysis_reports FOR ALL USING (
    auth.uid() IN (
        SELECT p.user_id FROM projects p 
        JOIN analysis_scans ascan ON p.id = ascan.project_id
        WHERE ascan.id = scan_id
    )
);

-- Instructions:
-- 1. Copy this entire SQL code
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Paste and click "Run"
-- 4. All tables and policies will be created automatically 
