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

	// Check for NULL category_id
	var countNull int
	db.QueryRow("SELECT COUNT(*) FROM articles WHERE category_id IS NULL").Scan(&countNull)
	fmt.Printf("Articles with NULL category_id: %d\n", countNull)

	// Check for articles with non-existent category
	rows, err := db.Query(`
		SELECT a.id, a.title, a.category_id
		FROM articles a
		LEFT JOIN categories c ON a.category_id = c.id
		WHERE c.id IS NULL
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("\nArticles with invalid category_id:")
	hasInvalid := false
	for rows.Next() {
		hasInvalid = true
		var id, categoryID int64
		var title string
		rows.Scan(&id, &title, &categoryID)
		fmt.Printf("  [%d] %s - category_id: %d (NOT FOUND)\n", id, title, categoryID)
	}

	if !hasInvalid {
		fmt.Println("  (none)")
	}

	// Check all articles
	fmt.Println("\nAll articles with their categories:")
	rows2, err := db.Query(`
		SELECT a.id, a.title, a.category_id, c.name
		FROM articles a
		LEFT JOIN categories c ON a.category_id = c.id
		ORDER BY a.id DESC
		LIMIT 20
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows2.Close()

	for rows2.Next() {
		var id, categoryID int64
		var title string
		var categoryName sql.NullString
		rows2.Scan(&id, &title, &categoryID, &categoryName)
		catName := "NULL"
		if categoryName.Valid {
			catName = categoryName.String
		}
		fmt.Printf("  [%d] %s - category: %s (ID: %d)\n", id, title, catName, categoryID)
	}
}
