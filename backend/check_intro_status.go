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

	rows, err := db.Query("SELECT `key`, title, group_name, status FROM pages WHERE group_name = 'introduction' LIMIT 10")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("Introduction pages:")
	for rows.Next() {
		var key, title, groupName, status string
		if err := rows.Scan(&key, &title, &groupName, &status); err != nil {
			log.Printf("Scan error: %v", err)
			continue
		}
		fmt.Printf("  key=%s, group=%s, status=%s, title=%s\n", key, groupName, status, title)
	}

	if err := rows.Err(); err != nil {
		log.Fatal("Rows error:", err)
	}
}
