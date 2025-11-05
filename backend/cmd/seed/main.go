package main

import (
	"context"
	"log"

	"golang.org/x/crypto/bcrypt"

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

	// Run migrations
	if err := database.Migrate(db); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	repos := database.NewRepositories(db)
	ctx := context.Background()

	// Create admin user
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}

	adminUser := &models.User{
		Email:        "admin@portal365.com",
		PasswordHash: string(hashedPassword),
		FullName:     "Admin User",
		IsActive:     true,
	}

	if err := repos.Users.Create(ctx, adminUser); err != nil {
		log.Printf("Admin user might already exist: %v", err)
	} else {
		log.Printf("Created admin user with ID: %d", adminUser.ID)

		// Assign admin role
		adminRole, _ := repos.Roles.GetByName(ctx, "Admin")
		if adminRole != nil {
			repos.Users.AssignRole(ctx, adminUser.ID, adminRole.ID)
			log.Printf("Assigned Admin role to user")
		}
	}

	// Create sample categories
	categories := []models.Category{
		{Name: "Politics", Slug: "politics", Description: "Political news and analysis", IsActive: true, SortOrder: 1},
		{Name: "Economy", Slug: "economy", Description: "Economic news and business", IsActive: true, SortOrder: 2},
		{Name: "Technology", Slug: "technology", Description: "Tech news and innovations", IsActive: true, SortOrder: 3},
		{Name: "Sports", Slug: "sports", Description: "Sports news and events", IsActive: true, SortOrder: 4},
		{Name: "Entertainment", Slug: "entertainment", Description: "Entertainment and culture", IsActive: true, SortOrder: 5},
	}

	for _, cat := range categories {
		c := cat
		if err := repos.Categories.Create(ctx, &c); err != nil {
			log.Printf("Category %s might already exist: %v", cat.Name, err)
		} else {
			log.Printf("Created category: %s", cat.Name)
		}
	}

	// Create sample tags
	tags := []models.Tag{
		{Name: "Breaking News", Slug: "breaking-news"},
		{Name: "Analysis", Slug: "analysis"},
		{Name: "Opinion", Slug: "opinion"},
		{Name: "Interview", Slug: "interview"},
		{Name: "Feature", Slug: "feature"},
	}

	for _, tag := range tags {
		t := tag
		if err := repos.Tags.Create(ctx, &t); err != nil {
			log.Printf("Tag %s might already exist: %v", tag.Name, err)
		} else {
			log.Printf("Created tag: %s", tag.Name)
		}
	}

	// Create introduction pages
	introPages := []models.Page{
		{
			Title:    "Lịch sử truyền thống",
			Slug:     "history",
			Group:    "introduction",
			Content:  "<h2>Lịch sử truyền thống Sư đoàn 365</h2><p>Sư đoàn 365 được thành lập năm 1965, với truyền thống vẻ vang trong cuộc kháng chiến chống Mỹ cứu nước. Qua hơn 50 năm xây dựng và phát triển, đơn vị đã lập được nhiều chiến công xuất sắc, được Đảng, Nhà nước tặng thưởng nhiều huân chương cao quý.</p>",
			Status:   "published",
			Order:    1,
			IsActive: true,
		},
		{
			Title:    "Tổ chức bộ máy",
			Slug:     "organization",
			Group:    "introduction",
			Content:  "<h2>Tổ chức bộ máy Sư đoàn 365</h2><p>Sư đoàn 365 tổ chức theo biên chế của Quân đội nhân dân Việt Nam, bao gồm các cơ quan: Tham mưu, Chính trị, Hậu cần - Kỹ thuật và các đơn vị trực thuộc. Bộ máy tổ chức được xây dựng tinh gọn, hoạt động hiệu quả, đáp ứng yêu cầu nhiệm vụ trong tình hình mới.</p>",
			Status:   "published",
			Order:    2,
			IsActive: true,
		},
		{
			Title:    "Lãnh đạo Sư đoàn",
			Slug:     "leadership",
			Group:    "introduction",
			Content:  "<h2>Ban Chỉ huy Sư đoàn 365</h2><p>Ban Chỉ huy Sư đoàn 365 gồm các đồng chí lãnh đạo có năng lực, kinh nghiệm, tâm huyết với sự nghiệp xây dựng và bảo vệ Tổ quốc. Với tinh thần trách nhiệm cao, Ban Chỉ huy luôn chỉ đạo sát sao, quyết liệt trong mọi hoạt động của đơn vị.</p>",
			Status:   "published",
			Order:    3,
			IsActive: true,
		},
		{
			Title:    "Thành tích đơn vị",
			Slug:     "achievements",
			Group:    "introduction",
			Content:  "<h2>Thành tích tiêu biểu của Sư đoàn 365</h2><p>Qua các thời kỳ, Sư đoàn 365 đã đạt được nhiều thành tích xuất sắc: Danh hiệu Anh hùng Lực lượng vũ trang nhân dân, Huân chương Quân công hạng Nhất, nhiều lần được công nhận Đơn vị Quyết thắng. Trong công tác huấn luyện, sẵn sàng chiến đấu, xây dựng đơn vị, Sư đoàn luôn hoàn thành xuất sắc nhiệm vụ được giao.</p>",
			Status:   "published",
			Order:    4,
			IsActive: true,
		},
	}

	for _, page := range introPages {
		p := page
		if err := repos.Pages.Create(ctx, &p); err != nil {
			log.Printf("Page %s might already exist: %v", page.Slug, err)
		} else {
			log.Printf("Created page: %s", page.Title)
		}
	}

	log.Println("Seeding completed!")
	log.Println("Admin credentials: admin@portal365.com / admin123")
}
