package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

func main() {
	// Open database
	db, err := sql.Open("sqlite", "portal.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Assign Admin role (id=1) to all users
	users := []struct {
		id   int
		name string
	}{
		{1, "admin@portal365.com"},
		{2, "thieumtagt95@gmail.com"},
		{3, "admin291@portal365.com"},
		{4, "admin284@portal365.com"},
		{5, "admin228@portal365.com"},
	}

	fmt.Println("=== ASSIGNING ADMIN ROLE TO USERS ===")
	for _, user := range users {
		// Check if already has role
		var count int
		err := db.QueryRow("SELECT COUNT(*) FROM user_roles WHERE user_id = ? AND role_id = 1", user.id).Scan(&count)
		if err != nil {
			log.Printf("Error checking user %d: %v", user.id, err)
			continue
		}

		if count > 0 {
			fmt.Printf("✓ User %d (%s) already has Admin role\n", user.id, user.name)
			continue
		}

		// Assign Admin role
		_, err = db.Exec("INSERT INTO user_roles (user_id, role_id) VALUES (?, 1)", user.id)
		if err != nil {
			log.Printf("✗ Failed to assign Admin role to user %d: %v", user.id, err)
			continue
		}
		fmt.Printf("✓ Assigned Admin role to user %d (%s)\n", user.id, user.name)
	}

	// Verify
	fmt.Println("\n=== VERIFICATION ===")
	rows, err := db.Query(`
		SELECT u.id, u.email, u.full_name, r.name as role_name
		FROM users u
		LEFT JOIN user_roles ur ON u.id = ur.user_id
		LEFT JOIN roles r ON ur.role_id = r.id
		ORDER BY u.id
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var email, fullName string
		var roleName sql.NullString
		if err := rows.Scan(&id, &email, &fullName, &roleName); err != nil {
			log.Fatal(err)
		}

		roleStr := "NO ROLE"
		if roleName.Valid {
			roleStr = roleName.String
		}
		fmt.Printf("User %d: %s (%s) - Role: %s\n", id, email, fullName, roleStr)
	}

	fmt.Println("\n✅ Done! All users should now be able to login.")
}
