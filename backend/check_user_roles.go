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

	// Check admin user roles
	rows, err := db.Query(`
		SELECT u.email, r.name 
		FROM users u
		LEFT JOIN user_roles ur ON u.id = ur.user_id
		LEFT JOIN roles r ON ur.role_id = r.id
		WHERE u.email = 'admin@portal365.com'
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("\n=== ADMIN USER ROLES ===")
	count := 0
	for rows.Next() {
		var email string
		var roleName sql.NullString
		rows.Scan(&email, &roleName)
		if roleName.Valid {
			fmt.Printf("Email: %s | Role: %s\n", email, roleName.String)
		} else {
			fmt.Printf("Email: %s | Role: (no roles assigned!)\n", email)
		}
		count++
	}

	if count == 0 {
		fmt.Println("⚠️  User not found!")
	}
}
