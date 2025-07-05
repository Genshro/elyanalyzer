-- Check if data exists in Supabase tables

-- 1. Check analysis_scans table
SELECT COUNT(*) as scan_count FROM analysis_scans;
SELECT * FROM analysis_scans ORDER BY created_at DESC LIMIT 5;

-- 2. Check category_scores table  
SELECT COUNT(*) as score_count FROM category_scores;
SELECT * FROM category_scores ORDER BY created_at DESC LIMIT 10;

-- 3. Check projects table
SELECT COUNT(*) as project_count FROM projects;
SELECT * FROM projects ORDER BY created_at DESC LIMIT 5;

-- 4. Check analysis_categories table
SELECT COUNT(*) as category_count FROM analysis_categories;
SELECT name, display_name FROM analysis_categories ORDER BY name; 