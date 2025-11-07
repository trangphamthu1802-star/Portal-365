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

	// Get admin user ID
	var userID int
	err = db.QueryRow(`SELECT id FROM users WHERE email = ?`, "admin@portal365.com").Scan(&userID)
	if err != nil {
		log.Fatalf("Admin user not found: %v", err)
	}

	// Get Admin role ID
	var roleID int
	err = db.QueryRow(`SELECT id FROM roles WHERE name = ?`, "Admin").Scan(&roleID)
	if err != nil {
		log.Fatalf("Admin role not found: %v", err)
	}

	// Assign role
	_, err = db.Exec(`
		INSERT OR IGNORE INTO user_roles (user_id, role_id) 
		VALUES (?, ?)
	`, userID, roleID)
	if err != nil {
		log.Fatalf("Failed to assign role: %v", err)
	}

	fmt.Printf("✅ Successfully assigned Admin role to admin@portal365.com\n")
	fmt.Printf("   User ID: %d\n", userID)
	fmt.Printf("   Role ID: %d\n", roleID)
}
