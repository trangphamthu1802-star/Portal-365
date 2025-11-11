package main

import (
	"database/sql"
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "file:portal.db?_busy_timeout=5000")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	var email, passwordHash string
	var id int64
	err = db.QueryRow("SELECT id, email, password_hash FROM users WHERE email = ?", "admin@portal365.com").
		Scan(&id, &email, &passwordHash)
	if err != nil {
		log.Fatal("User not found:", err)
	}

	fmt.Printf("User ID: %d\n", id)
	fmt.Printf("Email: %s\n", email)
	fmt.Printf("Password hash length: %d\n", len(passwordHash))

	// Test password
	testPassword := "Admin123!"
	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(testPassword))
	if err != nil {
		fmt.Printf("✗ Password verification failed: %v\n", err)
	} else {
		fmt.Printf("✓ Password '%s' is correct!\n", testPassword)
	}

	// Check roles
	rows, err := db.Query(`SELECT r.name FROM roles r 
		INNER JOIN user_roles ur ON r.id = ur.role_id 
		WHERE ur.user_id = ?`, id)
	if err != nil {
		log.Fatal("Failed to get roles:", err)
	}
	defer rows.Close()

	fmt.Println("\nUser roles:")
	for rows.Next() {
		var roleName string
		rows.Scan(&roleName)
		fmt.Printf("  - %s\n", roleName)
	}
}
