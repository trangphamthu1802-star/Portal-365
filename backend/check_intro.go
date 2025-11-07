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
		SELECT id, title, slug, group_name, key, status 
		FROM pages 
		WHERE group_name='introduction'
		ORDER BY sort_order
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("\n=== INTRODUCTION PAGES ===")
	fmt.Printf("%-4s %-30s %-25s %-15s %-15s %-10s\n", "ID", "Title", "Slug", "Group", "Key", "Status")
	fmt.Println(strings.Repeat("-", 100))

	for rows.Next() {
		var id int
		var title, slug, groupName, key, status string
		if err := rows.Scan(&id, &title, &slug, &groupName, &key, &status); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%-4d %-30s %-25s %-15s %-15s %-10s\n", id, title, slug, groupName, key, status)
	}
	fmt.Println()
}
