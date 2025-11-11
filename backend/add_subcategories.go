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

	// Lấy ID của chuyên mục "Hoạt động" và "Tin tức"
	var hoatDongID, tinTucID int64

	err = db.QueryRow("SELECT id FROM categories WHERE slug = ?", "hoat-dong").Scan(&hoatDongID)
	if err != nil {
		log.Fatal("Không tìm thấy chuyên mục Hoạt động:", err)
	}

	err = db.QueryRow("SELECT id FROM categories WHERE slug = ?", "tin-tuc").Scan(&tinTucID)
	if err != nil {
		log.Fatal("Không tìm thấy chuyên mục Tin tức:", err)
	}

	fmt.Printf("Hoạt động ID: %d\n", hoatDongID)
	fmt.Printf("Tin tức ID: %d\n", tinTucID)

	// Thêm các chuyên mục con cho Hoạt động
	subcategoriesHoatDong := []struct {
		name        string
		slug        string
		description string
	}{
		{"Hoạt động của Sư đoàn", "hoat-dong-su-doan", "Các hoạt động của Sư đoàn"},
		{"Hoạt động của các đơn vị", "hoat-dong-cac-don-vi", "Các hoạt động của các đơn vị trực thuộc"},
		{"Hoạt động của Thủ trưởng Sư đoàn", "hoat-dong-thu-truong", "Các hoạt động của Thủ trưởng Sư đoàn"},
	}

	// Thêm các chuyên mục con cho Tin tức
	subcategoriesTinTuc := []struct {
		name        string
		slug        string
		description string
	}{
		{"Tin trong nước", "tin-trong-nuoc", "Tin tức trong nước"},
		{"Tin quốc tế", "tin-quoc-te", "Tin tức quốc tế"},
		{"Tin quân sự", "tin-quan-su", "Tin tức quân sự"},
		{"Tin hoạt động Sư đoàn", "tin-hoat-dong-su-doan", "Tin hoạt động của Sư đoàn"},
	}

	fmt.Println("\n=== Thêm chuyên mục con cho Hoạt động ===")
	for _, sub := range subcategoriesHoatDong {
		// Kiểm tra xem đã tồn tại chưa
		var existingID int64
		err := db.QueryRow("SELECT id FROM categories WHERE slug = ?", sub.slug).Scan(&existingID)
		if err == nil {
			// Nếu đã tồn tại, update parent_id
			_, err = db.Exec("UPDATE categories SET parent_id = ?, description = ? WHERE slug = ?",
				hoatDongID, sub.description, sub.slug)
			if err != nil {
				log.Printf("Lỗi khi update %s: %v\n", sub.name, err)
			} else {
				fmt.Printf("✓ Đã cập nhật: %s (ID: %d, parent_id: %d)\n", sub.name, existingID, hoatDongID)
			}
		} else {
			// Chưa tồn tại, tạo mới
			result, err := db.Exec(`
				INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
				VALUES (?, ?, ?, ?, 0, 1)
			`, sub.name, sub.slug, sub.description, hoatDongID)
			if err != nil {
				log.Printf("Lỗi khi thêm %s: %v\n", sub.name, err)
			} else {
				id, _ := result.LastInsertId()
				fmt.Printf("✓ Đã tạo: %s (ID: %d, parent_id: %d)\n", sub.name, id, hoatDongID)
			}
		}
	}

	fmt.Println("\n=== Thêm chuyên mục con cho Tin tức ===")
	for _, sub := range subcategoriesTinTuc {
		// Kiểm tra xem đã tồn tại chưa
		var existingID int64
		err := db.QueryRow("SELECT id FROM categories WHERE slug = ?", sub.slug).Scan(&existingID)
		if err == nil {
			// Nếu đã tồn tại, update parent_id
			_, err = db.Exec("UPDATE categories SET parent_id = ?, description = ? WHERE slug = ?",
				tinTucID, sub.description, sub.slug)
			if err != nil {
				log.Printf("Lỗi khi update %s: %v\n", sub.name, err)
			} else {
				fmt.Printf("✓ Đã cập nhật: %s (ID: %d, parent_id: %d)\n", sub.name, existingID, tinTucID)
			}
		} else {
			// Chưa tồn tại, tạo mới
			result, err := db.Exec(`
				INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active)
				VALUES (?, ?, ?, ?, 0, 1)
			`, sub.name, sub.slug, sub.description, tinTucID)
			if err != nil {
				log.Printf("Lỗi khi thêm %s: %v\n", sub.name, err)
			} else {
				id, _ := result.LastInsertId()
				fmt.Printf("✓ Đã tạo: %s (ID: %d, parent_id: %d)\n", sub.name, id, tinTucID)
			}
		}
	}

	// Hiển thị cấu trúc categories
	fmt.Println("\n=== Cấu trúc chuyên mục hiện tại ===")
	rows, err := db.Query(`
		SELECT c1.id, c1.name, c1.slug, c1.parent_id, c2.name as parent_name
		FROM categories c1
		LEFT JOIN categories c2 ON c1.parent_id = c2.id
		ORDER BY COALESCE(c1.parent_id, c1.id), c1.id
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id, parentID sql.NullInt64
		var name, slug string
		var parentName sql.NullString
		rows.Scan(&id, &name, &slug, &parentID, &parentName)

		if parentID.Valid {
			fmt.Printf("  ├─ %s (slug: %s, parent: %s)\n", name, slug, parentName.String)
		} else {
			fmt.Printf("• %s (slug: %s)\n", name, slug)
		}
	}

	fmt.Println("\n✓ Hoàn thành!")
}
