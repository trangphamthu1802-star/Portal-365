package main

import (
	"context"
	"database/sql"
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

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}

	// Update admin user password
	result, err := db.ExecContext(context.Background(),
		`UPDATE users SET password_hash = ? WHERE email = ?`,
		string(hashedPassword),
		"admin@portal365.com",
	)
	if err != nil {
		log.Fatalf("Failed to update password: %v", err)
	}

	affected, _ := result.RowsAffected()
	if affected == 0 {
		log.Println("⚠️  No user found with email admin@portal365.com")
	} else {
		log.Printf("✅ Successfully reset password for admin@portal365.com")
		log.Printf("   Email: admin@portal365.com")
		log.Printf("   Password: admin123")
	}
}
