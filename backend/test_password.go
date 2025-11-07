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
	err = db.QueryRow(`SELECT email, password_hash FROM users WHERE email = ?`, "admin@portal365.com").Scan(&email, &passwordHash)
	if err != nil {
		log.Fatalf("User not found: %v", err)
	}

	fmt.Printf("\nEmail: %s\n", email)
	fmt.Printf("Hash length: %d\n", len(passwordHash))
	fmt.Printf("Hash: %s...\n\n", passwordHash[:20])

	// Test password
	testPassword := "admin123"
	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(testPassword))
	if err != nil {
		fmt.Printf("❌ Password verification FAILED: %v\n", err)

		// Try to create a new hash and test
		newHash, _ := bcrypt.GenerateFromPassword([]byte(testPassword), bcrypt.DefaultCost)
		fmt.Printf("\nTrying with fresh hash...\n")
		err2 := bcrypt.CompareHashAndPassword(newHash, []byte(testPassword))
		if err2 == nil {
			fmt.Printf("✅ Fresh hash works! Bcrypt is functioning correctly.\n")
			fmt.Printf("Issue might be with stored hash in database.\n")
		}
	} else {
		fmt.Printf("✅ Password verification SUCCESS!\n")
	}
}
