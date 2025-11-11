package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "file:portal.db?_busy_timeout=5000")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	categories := []struct {
		Name        string
		Slug        string
		Description string
	}{
		{"Tin tức", "tin-tuc", "Tin tức tổng hợp"},
		{"Thời sự", "thoi-su", "Thời sự trong nước và quốc tế"},
		{"Giáo dục", "giao-duc", "Tin tức giáo dục"},
		{"Kinh tế", "kinh-te", "Tin tức kinh tế"},
		{"Văn hóa", "van-hoa", "Tin tức văn hóa"},
		{"Thể thao", "the-thao", "Tin tức thể thao"},
		{"Công nghệ", "cong-nghe", "Tin tức công nghệ"},
		{"Giải trí", "giai-tri", "Tin tức giải trí"},
		{"Sức khỏe", "suc-khoe", "Tin tức sức khỏe"},
		{"Du lịch", "du-lich", "Tin tức du lịch"},
		{"Kho văn bản", "kho-van-ban", "Văn bản, tài liệu"},
	}

	now := time.Now()
	for _, cat := range categories {
		var count int
		err := db.QueryRow("SELECT COUNT(*) FROM categories WHERE slug = ?", cat.Slug).Scan(&count)
		if err != nil {
			log.Printf("Error checking category %s: %v", cat.Slug, err)
			continue
		}

		if count > 0 {
			fmt.Printf("⊙ Category '%s' already exists\n", cat.Name)
			continue
		}

		_, err = db.Exec(`INSERT INTO categories (name, slug, description, is_active, created_at, updated_at) 
			VALUES (?, ?, ?, ?, ?, ?)`,
			cat.Name, cat.Slug, cat.Description, true, now, now)
		if err != nil {
			log.Printf("✗ Failed to create category %s: %v", cat.Name, err)
		} else {
			fmt.Printf("✓ Created category: %s\n", cat.Name)
		}
	}

	fmt.Println("\n========================================")
	fmt.Println("Categories setup complete!")
	fmt.Println("========================================")
}
