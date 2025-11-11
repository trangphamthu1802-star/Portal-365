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

	// Try to select page with key thanh-tich-don-vi specifically
	var id int
	var key, title string
	err = db.QueryRow("SELECT id, `key`, title FROM pages WHERE `key` = 'thanh-tich-don-vi'").Scan(&id, &key, &title)
	if err == sql.ErrNoRows {
		fmt.Println("❌ Page 'thanh-tich-don-vi' NOT FOUND in database!")
	} else if err != nil {
		log.Fatal("Query error:", err)
	} else {
		fmt.Printf("✓ Found: ID=%d, key=%s, title=%s\n", id, key, title)
	}

	// Count all pages
	var count int
	db.QueryRow("SELECT COUNT(*) FROM pages").Scan(&count)
	fmt.Printf("\nTotal pages in database: %d\n", count)

	// List all keys
	rows, _ := db.Query("SELECT `key` FROM pages ORDER BY id")
	defer rows.Close()
	fmt.Println("\nAll keys:")
	for rows.Next() {
		var k string
		rows.Scan(&k)
		fmt.Println("  -", k)
	}
}
