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

	// Get table schema
	rows, err := db.Query("PRAGMA table_info(documents)")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("Documents table schema:")
	fmt.Println("CID | Name | Type | NotNull | DefaultValue | PK")
	fmt.Println("----+------+------+---------+--------------+---")

	for rows.Next() {
		var cid int
		var name, typ string
		var notNull, pk int
		var defaultValue sql.NullString

		if err := rows.Scan(&cid, &name, &typ, &notNull, &defaultValue, &pk); err != nil {
			log.Fatal(err)
		}

		defVal := "NULL"
		if defaultValue.Valid {
			defVal = defaultValue.String
		}

		fmt.Printf("%d | %s | %s | %d | %s | %d\n", cid, name, typ, notNull, defVal, pk)
	}
}
