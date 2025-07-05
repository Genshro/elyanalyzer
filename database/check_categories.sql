-- Check if categories exist
SELECT COUNT(*) as category_count FROM analysis_categories;
 
-- Show all categories
SELECT id, name, display_name, icon FROM analysis_categories ORDER BY name; 