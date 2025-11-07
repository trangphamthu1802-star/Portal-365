package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "file:portal.db?_busy_timeout=5000")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	slugs := map[string]string{
		"history":      "intro/history",
		"organization": "intro/organization",
		"leadership":   "intro/leadership",
		"achievements": "intro/achievements",
	}

	tx, err := db.Begin()
	if err != nil {
		log.Fatal(err)
	}

	for oldSlug, newSlug := range slugs {
		result, err := tx.Exec(`
			UPDATE pages 
			SET slug = ? 
			WHERE group_name = 'introduction' AND key = ?
		`, newSlug, oldSlug)

		if err != nil {
			tx.Rollback()
			log.Fatalf("Failed to update %s: %v", oldSlug, err)
		}

		affected, _ := result.RowsAffected()
		fmt.Printf("Updated %s -> %s (%d rows)\n", oldSlug, newSlug, affected)
	}

	if err := tx.Commit(); err != nil {
		log.Fatal(err)
	}

	// Verify
	rows, err := db.Query(`
		SELECT key, slug, status 
		FROM pages 
		WHERE group_name='introduction'
		ORDER BY sort_order
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("\n=== UPDATED INTRODUCTION PAGES ===")
	for rows.Next() {
		var key, slug, status string
		rows.Scan(&key, &slug, &status)
		fmt.Printf("%-15s | %-25s | %s\n", key, slug, status)
	}
}
