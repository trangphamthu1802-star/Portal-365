package main

import (
	"context"
	"database/sql"
	"log"

	"github.com/thieugt95/portal-365/backend/internal/config"
	"github.com/thieugt95/portal-365/backend/internal/database"
	"github.com/thieugt95/portal-365/backend/internal/models"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Initialize(cfg.DatabaseDSN)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	repos := database.NewRepositories(db)
	ctx := context.Background()

	log.Println("Starting menu categories seeding...")

	// Delete existing categories (careful!)
	// db.Exec("DELETE FROM categories")

	// 1. HOẠT ĐỘNG
	hoatDong := &models.Category{
		Name:        "Hoạt động",
		Slug:        "hoat-dong",
		Description: "Hoạt động của Sư đoàn và các đơn vị",
		IsActive:    true,
		SortOrder:   1,
	}
	if err := repos.Categories.Create(ctx, hoatDong); err != nil {
		log.Fatalf("Failed to create Hoạt động: %v", err)
	}
	log.Printf("✓ Created: %s (ID: %d)", hoatDong.Name, hoatDong.ID)

	hoatDongSubs := []models.Category{
		{Name: "Hoạt động của Sư đoàn", Slug: "hoat-dong-su-doan", ParentID: &hoatDong.ID, IsActive: true, SortOrder: 1},
		{Name: "Hoạt động của các đơn vị", Slug: "hoat-dong-cac-don-vi", ParentID: &hoatDong.ID, IsActive: true, SortOrder: 2},
		{Name: "Hoạt động của Thủ trưởng", Slug: "hoat-dong-thu-truong", ParentID: &hoatDong.ID, IsActive: true, SortOrder: 3},
	}
	for _, cat := range hoatDongSubs {
		c := cat
		if err := repos.Categories.Create(ctx, &c); err != nil {
			log.Printf("  Failed to create %s: %v", c.Name, err)
		} else {
			log.Printf("  ✓ Created: %s (ID: %d)", c.Name, c.ID)
		}
	}

	// 2. TIN TỨC
	tinTuc := &models.Category{
		Name:        "Tin tức",
		Slug:        "tin-tuc",
		Description: "Tin tức trong nước, quốc tế và quân sự",
		IsActive:    true,
		SortOrder:   2,
	}
	if err := repos.Categories.Create(ctx, tinTuc); err != nil {
		log.Fatalf("Failed to create Tin tức: %v", err)
	}
	log.Printf("✓ Created: %s (ID: %d)", tinTuc.Name, tinTuc.ID)

	tinTucSubs := []models.Category{
		{Name: "Tin trong nước", Slug: "tin-trong-nuoc", ParentID: &tinTuc.ID, IsActive: true, SortOrder: 1},
		{Name: "Tin quốc tế", Slug: "tin-quoc-te", ParentID: &tinTuc.ID, IsActive: true, SortOrder: 2},
		{Name: "Tin quân sự", Slug: "tin-quan-su", ParentID: &tinTuc.ID, IsActive: true, SortOrder: 3},
		{Name: "Tin hoạt động Sư đoàn", Slug: "tin-hoat-dong-su-doan", ParentID: &tinTuc.ID, IsActive: true, SortOrder: 4},
	}
	for _, cat := range tinTucSubs {
		c := cat
		if err := repos.Categories.Create(ctx, &c); err != nil {
			log.Printf("  Failed to create %s: %v", c.Name, err)
		} else {
			log.Printf("  ✓ Created: %s (ID: %d)", c.Name, c.ID)
		}
	}

	// 3. KHO VĂN BẢN
	khoVanBan := &models.Category{
		Name:        "Kho văn bản",
		Slug:        "kho-van-ban",
		Description: "Kho lưu trữ văn bản các cấp",
		IsActive:    true,
		SortOrder:   3,
	}
	if err := repos.Categories.Create(ctx, khoVanBan); err != nil {
		log.Fatalf("Failed to create Kho văn bản: %v", err)
	}
	log.Printf("✓ Created: %s (ID: %d)", khoVanBan.Name, khoVanBan.ID)

	khoVanBanSubs := []models.Category{
		{Name: "Văn bản Nhà nước", Slug: "van-ban-nha-nuoc", ParentID: &khoVanBan.ID, IsActive: true, SortOrder: 1},
		{Name: "Văn bản BQP", Slug: "van-ban-bqp", ParentID: &khoVanBan.ID, IsActive: true, SortOrder: 2},
		{Name: "Văn bản QC", Slug: "van-ban-qc", ParentID: &khoVanBan.ID, IsActive: true, SortOrder: 3},
		{Name: "Văn bản Sư đoàn", Slug: "van-ban-su-doan", ParentID: &khoVanBan.ID, IsActive: true, SortOrder: 4},
		{Name: "Văn bản Trung đoàn", Slug: "van-ban-trung-doan", ParentID: &khoVanBan.ID, IsActive: true, SortOrder: 5},
	}
	for _, cat := range khoVanBanSubs {
		c := cat
		if err := repos.Categories.Create(ctx, &c); err != nil {
			log.Printf("  Failed to create %s: %v", c.Name, err)
		} else {
			log.Printf("  ✓ Created: %s (ID: %d)", c.Name, c.ID)
		}
	}

	// 4. MEDIA
	media := &models.Category{
		Name:        "Media",
		Slug:        "media",
		Description: "Thư viện hình ảnh và video",
		IsActive:    true,
		SortOrder:   4,
	}
	if err := repos.Categories.Create(ctx, media); err != nil {
		log.Fatalf("Failed to create Media: %v", err)
	}
	log.Printf("✓ Created: %s (ID: %d)", media.Name, media.ID)

	mediaSubs := []models.Category{
		{Name: "Thư viện Video", Slug: "thu-vien-video", ParentID: &media.ID, IsActive: true, SortOrder: 1},
		{Name: "Thư viện Hình ảnh", Slug: "thu-vien-hinh-anh", ParentID: &media.ID, IsActive: true, SortOrder: 2},
	}
	for _, cat := range mediaSubs {
		c := cat
		if err := repos.Categories.Create(ctx, &c); err != nil {
			log.Printf("  Failed to create %s: %v", c.Name, err)
		} else {
			log.Printf("  ✓ Created: %s (ID: %d)", c.Name, c.ID)
		}
	}

	log.Println("\n✅ Menu categories seeding completed!")
	log.Println("Summary:")
	log.Println("  - Hoạt động (3 sub-categories)")
	log.Println("  - Tin tức (4 sub-categories)")
	log.Println("  - Kho văn bản (5 sub-categories)")
	log.Println("  - Media (2 sub-categories)")
	log.Println("  Total: 4 main + 14 sub = 18 categories")

	// Display category tree
	displayCategoryTree(db)
}

func displayCategoryTree(db *sql.DB) {
	log.Println("\n📋 Category Tree:")
	rows, err := db.Query(`
		SELECT c1.id, c1.name, c1.slug, c2.name as parent_name
		FROM categories c1
		LEFT JOIN categories c2 ON c1.parent_id = c2.id
		ORDER BY c1.parent_id NULLS FIRST, c1.sort_order
	`)
	if err != nil {
		log.Printf("Failed to query categories: %v", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var id int64
		var name, slug string
		var parentName sql.NullString

		if err := rows.Scan(&id, &name, &slug, &parentName); err != nil {
			continue
		}

		if !parentName.Valid {
			// Main category
			log.Printf("\n%d. %s (%s)", id, name, slug)
		} else {
			// Sub-category
			log.Printf("   └─ %d. %s (%s)", id, name, slug)
		}
	}
}
