package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "file:portal.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	query := `
		SELECT c.name, c.slug, COUNT(a.id) as article_count
		FROM categories c
		LEFT JOIN articles a ON c.id = a.category_id
		WHERE c.parent_id IS NOT NULL
		GROUP BY c.id, c.name, c.slug
		ORDER BY c.id
	`

	rows, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("\n=== Articles per Category ===")
	for rows.Next() {
		var name, slug string
		var count int
		if err := rows.Scan(&name, &slug, &count); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%-40s (%s): %d articles\n", name, slug, count)
	}
}
