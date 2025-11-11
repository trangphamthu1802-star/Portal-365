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
		log.Fatal("Failed to open database:", err)
	}
	defer db.Close()

	// Update all draft documents to published
	result, err := db.Exec(`
		UPDATE documents 
		SET status = 'published' 
		WHERE status = 'draft'
	`)
	if err != nil {
		log.Fatal(err)
	}

	rowsAffected, _ := result.RowsAffected()
	fmt.Printf("✅ Updated %d documents from draft to published\n", rowsAffected)

	// Show all documents
	fmt.Println("\n=== ALL DOCUMENTS ===")
	rows, err := db.Query(`
		SELECT id, title, status, created_at 
		FROM documents 
		ORDER BY created_at DESC
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var title, status, createdAt string
		err := rows.Scan(&id, &title, &status, &createdAt)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("ID: %d | Title: %s | Status: %s | Created: %s\n", id, title, status, createdAt)
	}
}
