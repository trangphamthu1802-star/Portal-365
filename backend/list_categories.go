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

	fmt.Println("=== Danh sách categories hiện tại ===")
	rows, err := db.Query("SELECT id, name, slug, parent_id FROM categories ORDER BY id")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int64
		var name, slug string
		var parentID sql.NullInt64
		rows.Scan(&id, &name, &slug, &parentID)

		if parentID.Valid {
			fmt.Printf("%d: %s (slug: %s, parent_id: %d)\n", id, name, slug, parentID.Int64)
		} else {
			fmt.Printf("%d: %s (slug: %s)\n", id, name, slug)
		}
	}
}
