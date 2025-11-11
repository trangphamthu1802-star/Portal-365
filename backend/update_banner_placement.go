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

	// Update home-top to banner-1
	result1, err := db.Exec("UPDATE banners SET placement = 'banner-1' WHERE placement = 'home-top'")
	if err != nil {
		log.Fatal(err)
	}
	rows1, _ := result1.RowsAffected()
	fmt.Printf("Updated %d banners from 'home-top' to 'banner-1'\n", rows1)

	// Update sidebar to banner-2
	result2, err := db.Exec("UPDATE banners SET placement = 'banner-2' WHERE placement = 'sidebar'")
	if err != nil {
		log.Fatal(err)
	}
	rows2, _ := result2.RowsAffected()
	fmt.Printf("Updated %d banners from 'sidebar' to 'banner-2'\n", rows2)

	// Show all banners
	rows, err := db.Query("SELECT id, title, placement, is_active FROM banners")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("\nCurrent banners:")
	for rows.Next() {
		var id int
		var title, placement string
		var isActive bool
		if err := rows.Scan(&id, &title, &placement, &isActive); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("ID: %d, Title: %s, Placement: %s, Active: %t\n", id, title, placement, isActive)
	}
}
