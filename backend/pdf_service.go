package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"elyanalyzer/shared/types"

	"github.com/jung-kurt/gofpdf"
)

// PDFService handles PDF report generation
type PDFService struct {
	outputDir string
}

// NewPDFService creates a new PDF service
func NewPDFService() *PDFService {
	outputDir := "./reports"
	os.MkdirAll(outputDir, 0o755)
	return &PDFService{
		outputDir: outputDir,
	}
}

// GenerateAnalysisReport creates a PDF report from analysis results
func (ps *PDFService) GenerateAnalysisReport(analysis types.AnalysisRecord, projectName string) (string, error) {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()

	// Header
	pdf.SetFont("Arial", "B", 20)
	pdf.SetTextColor(44, 82, 130)
	pdf.Cell(0, 15, "🌼 ElyAnalyzer Analysis Report")
	pdf.Ln(20)

	// Project Info
	pdf.SetFont("Arial", "B", 14)
	pdf.SetTextColor(0, 0, 0)
	pdf.Cell(0, 10, "Project Information")
	pdf.Ln(12)

	pdf.SetFont("Arial", "", 11)
	pdf.Cell(40, 8, "Project Name:")
	pdf.SetFont("Arial", "B", 11)
	pdf.Cell(0, 8, projectName)
	pdf.Ln(8)

	pdf.SetFont("Arial", "", 11)
	pdf.Cell(40, 8, "Scan Type:")
	pdf.SetFont("Arial", "B", 11)
	pdf.Cell(0, 8, analysis.ScanType)
	pdf.Ln(8)

	pdf.SetFont("Arial", "", 11)
	pdf.Cell(40, 8, "Analysis Date:")
	pdf.SetFont("Arial", "B", 11)
	pdf.Cell(0, 8, time.Now().Format("2006-01-02 15:04:05"))
	pdf.Ln(8)

	// NEW: Analyzers Used Section
	pdf.SetFont("Arial", "", 11)
	pdf.Cell(40, 8, "Analyzers Used:")
	pdf.SetFont("Arial", "B", 11)
	if len(analysis.Results.AnalyzersUsed) > 0 {
		analyzersText := strings.Join(analysis.Results.AnalyzersUsed, ", ")
		pdf.Cell(0, 8, analyzersText)
	} else {
		pdf.Cell(0, 8, "Not specified")
	}
	pdf.Ln(15)

	// Summary Section
	pdf.SetFont("Arial", "B", 14)
	pdf.Cell(0, 10, "Analysis Summary")
	pdf.Ln(12)

	// Summary stats
	summary := analysis.Results.Summary
	ps.addSummaryRow(pdf, "Total Files Scanned:", fmt.Sprintf("%d", summary.TotalFiles))
	ps.addSummaryRow(pdf, "JavaScript Files:", fmt.Sprintf("%d", summary.JSFiles))
	ps.addSummaryRow(pdf, "TypeScript Files:", fmt.Sprintf("%d", summary.TSFiles))
	ps.addSummaryRow(pdf, "Total Issues Found:", fmt.Sprintf("%d", summary.IssuesFound))

	// Issues severity breakdown
	pdf.Ln(5)
	ps.addSummaryRow(pdf, "Critical Issues:", fmt.Sprintf("%d", ps.countIssuesBySeverity(analysis.Results.Issues, "critical")))
	ps.addSummaryRow(pdf, "High Issues:", fmt.Sprintf("%d", ps.countIssuesBySeverity(analysis.Results.Issues, "high")))
	ps.addSummaryRow(pdf, "Medium Issues:", fmt.Sprintf("%d", ps.countIssuesBySeverity(analysis.Results.Issues, "medium")))
	ps.addSummaryRow(pdf, "Low Issues:", fmt.Sprintf("%d", ps.countIssuesBySeverity(analysis.Results.Issues, "low")))

	pdf.Ln(15)

	// Detailed Issues Section
	if len(analysis.Results.Issues) > 0 {
		pdf.SetFont("Arial", "B", 16)
		pdf.SetTextColor(200, 50, 50)
		pdf.Cell(0, 12, "🔍 DETECTED ISSUES")
		pdf.Ln(15)

		for i, issue := range analysis.Results.Issues {
			if pdf.GetY() > 240 { // Check if we need a new page
				pdf.AddPage()
			}

			// Issue number and severity
			pdf.SetFont("Arial", "B", 14)
			severityColor := ps.getSeverityColor(issue.Severity)
			pdf.SetTextColor(int(severityColor[0]), int(severityColor[1]), int(severityColor[2]))

			severityText := strings.ToUpper(issue.Severity)
			pdf.Cell(0, 10, fmt.Sprintf("ISSUE #%d - %s", i+1, severityText))
			pdf.Ln(12)

			// File path
			pdf.SetTextColor(0, 0, 0)
			pdf.SetFont("Arial", "B", 11)
			pdf.Cell(30, 8, "File Path:")
			pdf.SetFont("Arial", "", 10)
			ps.addMultiCell(pdf, issue.File)
			pdf.Ln(2)

			// File name
			pdf.SetFont("Arial", "B", 11)
			pdf.Cell(30, 8, "File Name:")
			pdf.SetFont("Arial", "", 10)
			fileName := filepath.Base(issue.File)
			pdf.Cell(0, 8, fileName)
			pdf.Ln(10)

			// Line number (if available)
			if issue.Line > 0 {
				pdf.SetFont("Arial", "B", 11)
				pdf.Cell(30, 8, "Error Line:")
				pdf.SetFont("Arial", "", 10)
				pdf.Cell(0, 8, fmt.Sprintf("Line %d", issue.Line))
				pdf.Ln(8)
			} else {
				pdf.SetFont("Arial", "B", 11)
				pdf.Cell(30, 8, "Error Area:")
				pdf.SetFont("Arial", "", 10)
				pdf.Cell(0, 8, "Entire file")
				pdf.Ln(8)
			}

			// Problem description
			pdf.SetFont("Arial", "B", 11)
			pdf.SetTextColor(150, 0, 0)
			pdf.Cell(0, 8, "❌ Problem:")
			pdf.Ln(8)
			pdf.SetTextColor(0, 0, 0)
			pdf.SetFont("Arial", "", 10)
			ps.addMultiCell(pdf, issue.Description)
			pdf.Ln(3)

			// Solution suggestion
			if issue.Suggestion != "" {
				pdf.SetFont("Arial", "B", 11)
				pdf.SetTextColor(0, 120, 0)
				pdf.Cell(0, 8, "✅ Solution:")
				pdf.Ln(8)
				pdf.SetTextColor(0, 0, 0)
				pdf.SetFont("Arial", "", 10)
				ps.addMultiCell(pdf, issue.Suggestion)
			}

			// Separator line
			pdf.Ln(5)
			pdf.SetDrawColor(200, 200, 200)
			pdf.Line(10, pdf.GetY(), 200, pdf.GetY())
			pdf.Ln(10)
		}
	}

	// Files Section
	if len(analysis.Results.Files) > 0 {
		if pdf.GetY() > 200 {
			pdf.AddPage()
		}

		pdf.SetFont("Arial", "B", 14)
		pdf.Cell(0, 10, "Scanned Files")
		pdf.Ln(12)

		pdf.SetFont("Arial", "B", 9)
		pdf.Cell(80, 8, "File Path")
		pdf.Cell(30, 8, "Extension")
		pdf.Cell(25, 8, "Size (bytes)")
		pdf.Cell(25, 8, "Imports")
		pdf.Ln(10)

		pdf.SetFont("Arial", "", 8)
		for _, file := range analysis.Results.Files {
			if pdf.GetY() > 270 {
				pdf.AddPage()
				// Re-add headers
				pdf.SetFont("Arial", "B", 9)
				pdf.Cell(80, 8, "File Path")
				pdf.Cell(30, 8, "Extension")
				pdf.Cell(25, 8, "Size (bytes)")
				pdf.Cell(25, 8, "Imports")
				pdf.Ln(10)
				pdf.SetFont("Arial", "", 8)
			}

			pdf.Cell(80, 6, file.Path)
			pdf.Cell(30, 6, file.Extension)
			pdf.Cell(25, 6, fmt.Sprintf("%d", file.Size))
			pdf.Cell(25, 6, fmt.Sprintf("%d", len(file.Imports)))
			pdf.Ln(6)
		}
	}

	// Footer
	pdf.SetY(-20)
	pdf.SetFont("Arial", "I", 8)
	pdf.SetTextColor(128, 128, 128)
	pdf.Cell(0, 10, fmt.Sprintf("Generated by ElyAnalyzer on %s", time.Now().Format("2006-01-02 15:04:05")))

	// Save PDF
	filename := fmt.Sprintf("analysis_report_%s_%s.pdf",
		analysis.ProjectID,
		time.Now().Format("20060102_150405"))
	filepath := filepath.Join(ps.outputDir, filename)

	err := pdf.OutputFileAndClose(filepath)
	if err != nil {
		return "", fmt.Errorf("failed to save PDF: %v", err)
	}

	return filepath, nil
}

// Helper functions
func (ps *PDFService) addSummaryRow(pdf *gofpdf.Fpdf, label, value string) {
	pdf.SetFont("Arial", "", 11)
	pdf.Cell(60, 8, label)
	pdf.SetFont("Arial", "B", 11)
	pdf.Cell(0, 8, value)
	pdf.Ln(8)
}

func (ps *PDFService) addMultiCell(pdf *gofpdf.Fpdf, text string) {
	pdf.MultiCell(0, 6, text, "", "L", false)
}

func (ps *PDFService) countIssuesBySeverity(issues []types.Issue, severity string) int {
	count := 0
	for _, issue := range issues {
		if issue.Severity == severity {
			count++
		}
	}
	return count
}

func (ps *PDFService) getSeverityColor(severity string) [3]uint8 {
	switch severity {
	case "critical":
		return [3]uint8{220, 20, 60} // Crimson
	case "high":
		return [3]uint8{255, 69, 0} // Orange Red
	case "medium":
		return [3]uint8{255, 165, 0} // Orange
	case "low":
		return [3]uint8{34, 139, 34} // Forest Green
	default:
		return [3]uint8{0, 0, 0} // Black
	}
}
