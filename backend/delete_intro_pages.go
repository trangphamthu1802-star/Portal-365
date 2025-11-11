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

	// Delete all intro pages
	result, err := db.Exec("DELETE FROM pages WHERE `key` IN ('lich-su-truyen-thong', 'to-chuc-don-vi', 'lanh-dao-su-doan', 'thanh-tich-don-vi')")
	if err != nil {
		log.Fatal("Error deleting:", err)
	}

	rows, _ := result.RowsAffected()
	fmt.Printf("Deleted %d pages\n", rows)
}
