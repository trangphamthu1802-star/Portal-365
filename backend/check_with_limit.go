package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "portal.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Query with LIMIT to see if it helps
	rows, err := db.Query("SELECT `key`, title FROM pages ORDER BY id LIMIT 10")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("Keys in database (with LIMIT 10):")
	count := 0
	for rows.Next() {
		var key, title string
		if err := rows.Scan(&key, &title); err != nil {
			log.Printf("Scan error: %v", err)
			continue
		}
		count++
		fmt.Printf("  %d. %s -> %s\n", count, key, title)
	}

	if err := rows.Err(); err != nil {
		log.Fatal("Rows error:", err)
	}

	fmt.Printf("\nTotal rows fetched: %d\n", count)
}
