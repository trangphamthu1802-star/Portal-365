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

	// Update all draft media items to published
	result, err := db.Exec(`UPDATE media_items SET status='published' WHERE status='draft'`)
	if err != nil {
		log.Fatal(err)
	}

	rows, _ := result.RowsAffected()
	fmt.Printf("Updated %d media items to published status\n", rows)

	// Show updated media
	queryRows, err := db.Query(`SELECT id, title, media_type, status FROM media_items`)
	if err != nil {
		log.Fatal(err)
	}
	defer queryRows.Close()

	fmt.Println("\nAll media items:")
	for queryRows.Next() {
		var id int64
		var title, mediaType, status string
		if err := queryRows.Scan(&id, &title, &mediaType, &status); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("ID: %d, Title: %s, Type: %s, Status: %s\n", id, title, mediaType, status)
	}
}
