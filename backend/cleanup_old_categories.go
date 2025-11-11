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

	fmt.Println("=== Cleaning up old categories and keeping only Hoạt động + Tin tức ===\n")

	// Step 1: Delete old articles (keeping only the 14 new ones)
	result, err := db.Exec(`
		DELETE FROM articles 
		WHERE id NOT IN (
			SELECT id FROM articles 
			WHERE category_id IN (
				SELECT id FROM categories 
				WHERE slug LIKE 'hoat-dong-%' OR slug LIKE 'tin-%'
			)
		)
	`)
	if err != nil {
		log.Fatal("Error deleting old articles:", err)
	}
	deleted, _ := result.RowsAffected()
	fmt.Printf("✓ Deleted %d old articles\n", deleted)

	// Step 2: Delete old categories (keep only the new 7)
	result, err = db.Exec(`
		DELETE FROM categories 
		WHERE slug NOT LIKE 'hoat-dong-%' 
		AND slug NOT LIKE 'tin-%'
		AND slug != 'hoat-dong'
		AND slug != 'tin-tuc'
	`)
	if err != nil {
		log.Fatal("Error deleting old categories:", err)
	}
	deletedCats, _ := result.RowsAffected()
	fmt.Printf("✓ Deleted %d old categories\n", deletedCats)

	// Step 3: Show remaining categories
	fmt.Println("\n=== Remaining Categories ===")
	rows, err := db.Query(`
		SELECT id, name, slug, parent_id 
		FROM categories 
		ORDER BY CASE WHEN parent_id IS NULL THEN 0 ELSE 1 END, id
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int64
		var name, slug string
		var parentID sql.NullInt64
		rows.Scan(&id, &name, &slug, &parentID)

		if parentID.Valid {
			fmt.Printf("  ├─ [%d] %s (%s) - parent: %d\n", id, name, slug, parentID.Int64)
		} else {
			fmt.Printf("  [%d] %s (%s)\n", id, name, slug)
		}
	}

	// Step 4: Show remaining articles
	var articleCount int
	db.QueryRow("SELECT COUNT(*) FROM articles").Scan(&articleCount)
	fmt.Printf("\n=== Total Articles: %d ===\n", articleCount)

	rows2, err := db.Query(`
		SELECT a.id, a.title, c.name, a.status
		FROM articles a
		JOIN categories c ON a.category_id = c.id
		ORDER BY a.created_at DESC
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows2.Close()

	for rows2.Next() {
		var id int64
		var title, categoryName, status string
		rows2.Scan(&id, &title, &categoryName, &status)
		fmt.Printf("  [%d] %s - %s (%s)\n", id, title, categoryName, status)
	}

	fmt.Println("\n✅ Cleanup complete!")
}
