package main

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "portal.db")
	if err != nil {
		log.Fatal("Failed to open database:", err)
	}
	defer db.Close()

	fmt.Println("=== RECENT DOCUMENTS ===")
	rows, err := db.Query(`
		SELECT id, title, status, file_path, created_at 
		FROM documents 
		ORDER BY created_at DESC 
		LIMIT 10
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Printf("%-5s %-50s %-15s %-30s\n", "ID", "Title", "Status", "Created At")
	fmt.Println(strings.Repeat("-", 110))

	for rows.Next() {
		var id int
		var title, status, filePath, createdAt string
		err := rows.Scan(&id, &title, &status, &filePath, &createdAt)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%-5d %-50s %-15s %-30s\n", id, title, status, createdAt)
	}
}
