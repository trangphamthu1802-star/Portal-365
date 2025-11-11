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

	rows, err := db.Query("SELECT id, `key`, title, slug FROM pages ORDER BY id")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("All pages in database:")
	for rows.Next() {
		var id int
		var key, title, slug string
		rows.Scan(&id, &key, &title, &slug)
		fmt.Printf("  ID=%d, key=%s, title=%s, slug=%s\n", id, key, title, slug)
	}
}
