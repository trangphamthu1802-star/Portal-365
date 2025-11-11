package main

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "file:portal.db?_busy_timeout=5000")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT id, title, media_type, url, status, created_at 
		FROM media_items 
		ORDER BY id DESC 
		LIMIT 10
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("\n=== 10 Media Items Mới Nhất ===")
	fmt.Println("ID | Title | Type | URL | Status | Created")
	fmt.Println(strings.Repeat("-", 100))

	for rows.Next() {
		var id int64
		var title, mediaType, url, status, createdAt string
		if err := rows.Scan(&id, &title, &mediaType, &url, &status, &createdAt); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%d | %s | %s | %s | %s | %s\n", id, title, mediaType, url, status, createdAt[:10])
	}

	// Count by status
	var draftCount, publishedCount int
	db.QueryRow(`SELECT COUNT(*) FROM media_items WHERE status='draft'`).Scan(&draftCount)
	db.QueryRow(`SELECT COUNT(*) FROM media_items WHERE status='published'`).Scan(&publishedCount)

	fmt.Println(strings.Repeat("-", 100))
	fmt.Printf("\nTổng số media:\n")
	fmt.Printf("  - Draft: %d\n", draftCount)
	fmt.Printf("  - Published: %d\n", publishedCount)
	fmt.Printf("  - Total: %d\n", draftCount+publishedCount)
}
