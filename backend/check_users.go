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

	// Check users
	rows, err := db.Query(`SELECT id, email, full_name, is_active FROM users`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("\n=== USERS ===")
	count := 0
	for rows.Next() {
		var id int
		var email, fullName string
		var isActive bool
		rows.Scan(&id, &email, &fullName, &isActive)
		fmt.Printf("ID: %d | Email: %s | Name: %s | Active: %v\n", id, email, fullName, isActive)
		count++
	}

	if count == 0 {
		fmt.Println("⚠️  NO USERS FOUND! Need to run seed.")
	}
	fmt.Printf("\nTotal users: %d\n", count)
}
