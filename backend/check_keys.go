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

	rows, err := db.Query("SELECT `key`, title FROM pages ORDER BY id")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("Keys in database:")
	for rows.Next() {
		var key, title string
		if err := rows.Scan(&key, &title); err != nil {
			log.Printf("Scan error: %v", err)
			continue
		}
		fmt.Printf("  %s -> %s\n", key, title)
	}

	if err := rows.Err(); err != nil {
		log.Fatal("Rows error:", err)
	}
}
