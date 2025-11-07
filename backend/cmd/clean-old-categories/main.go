package main

import (
	"context"
	"log"

	"github.com/thieugt95/portal-365/backend/internal/config"
	"github.com/thieugt95/portal-365/backend/internal/database"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Initialize(cfg.DatabaseDSN)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	ctx := context.Background()

	// Delete old categories
	oldSlugs := []string{"politics", "economy", "technology", "sports", "entertainment"}

	for _, slug := range oldSlugs {
		result, err := db.ExecContext(ctx, "DELETE FROM categories WHERE slug = ?", slug)
		if err != nil {
			log.Printf("Failed to delete category %s: %v", slug, err)
		} else {
			rows, _ := result.RowsAffected()
			if rows > 0 {
				log.Printf("Deleted category: %s", slug)
			} else {
				log.Printf("Category not found: %s", slug)
			}
		}
	}

	// Display remaining categories
	rows, err := db.QueryContext(ctx, "SELECT name, slug FROM categories ORDER BY sort_order")
	if err != nil {
		log.Fatalf("Failed to query categories: %v", err)
	}
	defer rows.Close()

	log.Println("\nRemaining categories:")
	for rows.Next() {
		var name, slug string
		if err := rows.Scan(&name, &slug); err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}
		log.Printf("  - %s (%s)", name, slug)
	}

	log.Println("\nCleanup completed!")
}
