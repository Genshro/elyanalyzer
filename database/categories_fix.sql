-- Fix: Insert missing categories (without description column)
INSERT INTO analysis_categories (id, name, display_name, icon) 
VALUES
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
ON CONFLICT (id) DO NOTHING; 