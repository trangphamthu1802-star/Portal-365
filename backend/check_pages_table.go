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

	rows, err := db.Query("PRAGMA table_info(pages)")
	if err != nil {
		log.Fatal("Failed to query:", err)
	}
	defer rows.Close()

	fmt.Println("Columns in pages table:")
	for rows.Next() {
		var cid int
		var name, typ string
		var notnull, pk int
		var dfltValue sql.NullString
		rows.Scan(&cid, &name, &typ, &notnull, &dfltValue, &pk)
		fmt.Printf("%d: %s (%s)\n", cid, name, typ)
	}
}
