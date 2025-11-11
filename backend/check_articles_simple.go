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

	// Count articles
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM articles").Scan(&count)
	if err != nil {
		log.Fatal("Error counting articles:", err)
	}
	fmt.Printf("Total articles: %d\n\n", count)

	// Check first few articles
	rows, err := db.Query(`
		SELECT id, title, slug, author_id, category_id, status 
		FROM articles 
		ORDER BY created_at DESC 
		LIMIT 5
	`)
	if err != nil {
		log.Fatal("Error querying articles:", err)
	}
	defer rows.Close()

	fmt.Println("Recent articles:")
	for rows.Next() {
		var id, authorID, categoryID int64
		var title, slug, status string
		err := rows.Scan(&id, &title, &slug, &authorID, &categoryID, &status)
		if err != nil {
			log.Println("Error scanning row:", err)
			continue
		}
		fmt.Printf("  [%d] %s (status: %s, author: %d, category: %d)\n", id, title, status, authorID, categoryID)
	}

	// Check categories
	fmt.Println("\nCategories:")
	rows2, err := db.Query("SELECT id, name, slug FROM categories ORDER BY id LIMIT 10")
	if err != nil {
		log.Fatal("Error querying categories:", err)
	}
	defer rows2.Close()

	for rows2.Next() {
		var id int64
		var name, slug string
		rows2.Scan(&id, &name, &slug)
		fmt.Printf("  [%d] %s (%s)\n", id, name, slug)
	}
}
