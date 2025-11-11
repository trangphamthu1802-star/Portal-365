package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
	_ "modernc.org/sqlite"
)

func main() {
	// Connect to database
	db, err := sql.Open("sqlite", "file:portal.db?_busy_timeout=5000")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Check if admin already exists
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM users WHERE email = ?", "admin@portal365.com").Scan(&count)
	if err != nil {
		log.Fatal(err)
	}

	if count > 0 {
		fmt.Println("Admin user already exists!")

		// Update password anyway
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("Admin123!"), 12)
		_, err = db.Exec("UPDATE users SET password_hash = ? WHERE email = ?",
			string(hashedPassword), "admin@portal365.com")
		if err != nil {
			log.Fatal("Failed to update password:", err)
		}
		fmt.Println("✓ Admin password updated to: Admin123!")
		return
	}

	// Create admin user
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("Admin123!"), 12)
	if err != nil {
		log.Fatal(err)
	}

	now := time.Now()
	result, err := db.Exec(`INSERT INTO users (email, password_hash, full_name, is_active, created_at, updated_at) 
		VALUES (?, ?, ?, ?, ?, ?)`,
		"admin@portal365.com", string(hashedPassword), "Administrator", true, now, now)
	if err != nil {
		log.Fatal("Failed to create user:", err)
	}

	userID, _ := result.LastInsertId()
	fmt.Printf("✓ Created admin user with ID: %d\n", userID)

	// Assign Admin role (role ID = 1)
	_, err = db.Exec("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", userID, 1)
	if err != nil {
		log.Fatal("Failed to assign role:", err)
	}

	fmt.Println("✓ Admin role assigned")
	fmt.Println("\n========================================")
	fmt.Println("Admin credentials:")
	fmt.Println("  Email:    admin@portal365.com")
	fmt.Println("  Password: Admin123!")
	fmt.Println("========================================")
}
