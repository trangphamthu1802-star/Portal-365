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

	rows, err := db.Query("SELECT `key`, title, group_name FROM pages LIMIT 10")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("Pages with group_name:")
	for rows.Next() {
		var key, title, groupName string
		if err := rows.Scan(&key, &title, &groupName); err != nil {
			log.Printf("Scan error: %v", err)
			continue
		}
		fmt.Printf("  key=%s, group=%s, title=%s\n", key, groupName, title)
	}
}
