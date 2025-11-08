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
		Email:        "administrator",
		PasswordHash: string(hashedPassword),
		FullName:     "Admin User",
		IsActive:     true,
	}

	if err := repos.Users.Create(ctx, adminUser); err != nil {
		log.Printf("Admin user might already exist: %v", err)
		// Fetch existing user
		existingUser, err := repos.Users.GetByEmail(ctx, "administrator")
		if err == nil && existingUser != nil {
			adminUser = existingUser
			log.Printf("Using existing admin user with ID: %d", adminUser.ID)
		}
	} else {
		log.Printf("Created admin user with ID: %d", adminUser.ID)

		// Assign admin role
		adminRole, _ := repos.Roles.GetByName(ctx, "Admin")
		if adminRole != nil {
			repos.Users.AssignRole(ctx, adminUser.ID, adminRole.ID)
			log.Printf("Assigned Admin role to user")
		}
	}

	// Ensure we have a valid admin user ID
	if adminUser.ID == 0 {
		log.Fatal("Failed to get admin user ID")
	}

	// Create main categories with hierarchy
	// Parent categories
	hoatDong := models.Category{
		Name:        "Hoạt động",
		Slug:        "hoat-dong",
		Description: "Các hoạt động của Sư đoàn và đơn vị",
		IsActive:    true,
		SortOrder:   1,
	}
	if err := repos.Categories.Create(ctx, &hoatDong); err != nil {
		log.Printf("Category %s might already exist: %v", hoatDong.Name, err)
	} else {
		log.Printf("Created parent category: %s (ID: %d)", hoatDong.Name, hoatDong.ID)
	}

	tinTuc := models.Category{
		Name:        "Tin tức",
		Slug:        "tin-tuc",
		Description: "Tin tức trong nước và quốc tế",
		IsActive:    true,
		SortOrder:   2,
	}
	if err := repos.Categories.Create(ctx, &tinTuc); err != nil {
		log.Printf("Category %s might already exist: %v", tinTuc.Name, err)
	} else {
		log.Printf("Created parent category: %s (ID: %d)", tinTuc.Name, tinTuc.ID)
	}

	// Subcategories for "Hoạt động"
	hoatDongSubs := []models.Category{
		{
			Name:        "Hoạt động của Sư đoàn",
			Slug:        "su-doan",
			Description: "Các hoạt động của Sư đoàn",
			ParentID:    &hoatDong.ID,
			IsActive:    true,
			SortOrder:   1,
		},
		{
			Name:        "Hoạt động của các đơn vị",
			Slug:        "don-vi",
			Description: "Các hoạt động của các đơn vị trực thuộc",
			ParentID:    &hoatDong.ID,
			IsActive:    true,
			SortOrder:   2,
		},
		{
			Name:        "Hoạt động của Thủ trưởng Sư đoàn",
			Slug:        "thu-truong-su-doan",
			Description: "Các hoạt động của Thủ trưởng Sư đoàn",
			ParentID:    &hoatDong.ID,
			IsActive:    true,
			SortOrder:   3,
		},
	}

	for _, cat := range hoatDongSubs {
		c := cat
		if err := repos.Categories.Create(ctx, &c); err != nil {
			log.Printf("Subcategory %s might already exist: %v", cat.Name, err)
		} else {
			log.Printf("Created subcategory: %s (parent: Hoạt động)", cat.Name)
		}
	}

	// Subcategories for "Tin tức"
	tinTucSubs := []models.Category{
		{
			Name:        "Tin trong nước",
			Slug:        "trong-nuoc",
			Description: "Tin tức trong nước",
			ParentID:    &tinTuc.ID,
			IsActive:    true,
			SortOrder:   1,
		},
		{
			Name:        "Tin quốc tế",
			Slug:        "quoc-te",
			Description: "Tin tức quốc tế",
			ParentID:    &tinTuc.ID,
			IsActive:    true,
			SortOrder:   2,
		},
		{
			Name:        "Tin quân sự",
			Slug:        "quan-su",
			Description: "Tin tức quân sự",
			ParentID:    &tinTuc.ID,
			IsActive:    true,
			SortOrder:   3,
		},
		{
			Name:        "Tin hoạt động của Sư đoàn",
			Slug:        "hoat-dong-su-doan",
			Description: "Tin tức hoạt động của Sư đoàn",
			ParentID:    &tinTuc.ID,
			IsActive:    true,
			SortOrder:   4,
		},
		{
			Name:        "Tin đơn vị",
			Slug:        "tin-don-vi",
			Description: "Tin tức đơn vị",
			ParentID:    &tinTuc.ID,
			IsActive:    true,
			SortOrder:   5,
		},
	}

	for _, cat := range tinTucSubs {
		c := cat
		if err := repos.Categories.Create(ctx, &c); err != nil {
			log.Printf("Subcategory %s might already exist: %v", cat.Name, err)
		} else {
			log.Printf("Created subcategory: %s (parent: Tin tức)", cat.Name)
		}
	}

	// 3. Kho Văn bản
	khoVanBan := models.Category{Name: "Kho Văn bản", Slug: "kho-van-ban", Description: "Kho văn bản", IsActive: true, SortOrder: 8}
	if err := repos.Categories.Create(ctx, &khoVanBan); err != nil {
		log.Printf("Category Kho Văn bản might already exist: %v", err)
	} else {
		log.Printf("Created category: Kho Văn bản")
	}

	khoVanBanSubs := []models.Category{
		{Name: "Nghị quyết", Slug: "nghi-quyet", Description: "Các nghị quyết", ParentID: &khoVanBan.ID, IsActive: true, SortOrder: 1},
		{Name: "Chỉ thị", Slug: "chi-thi", Description: "Các chỉ thị", ParentID: &khoVanBan.ID, IsActive: true, SortOrder: 2},
		{Name: "Quyết định", Slug: "quyet-dinh", Description: "Các quyết định", ParentID: &khoVanBan.ID, IsActive: true, SortOrder: 3},
		{Name: "Thông tư", Slug: "thong-tu", Description: "Các thông tư", ParentID: &khoVanBan.ID, IsActive: true, SortOrder: 4},
		{Name: "Công văn", Slug: "cong-van", Description: "Các công văn", ParentID: &khoVanBan.ID, IsActive: true, SortOrder: 5},
	}
	for _, cat := range khoVanBanSubs {
		c := cat
		if err := repos.Categories.Create(ctx, &c); err != nil {
			log.Printf("Category %s might already exist: %v", cat.Name, err)
		} else {
			log.Printf("Created subcategory: %s", cat.Name)
		}
	}

	// 4. Media (2 sub)
	media := models.Category{Name: "Media", Slug: "media", Description: "Thư viện đa phương tiện", IsActive: true, SortOrder: 9}
	if err := repos.Categories.Create(ctx, &media); err != nil {
		log.Printf("Category Media might already exist: %v", err)
	} else {
		log.Printf("Created category: Media")
	}

	mediaSubs := []models.Category{
		{Name: "Thư viện ảnh", Slug: "thu-vien-anh", Description: "Thư viện hình ảnh", ParentID: &media.ID, IsActive: true, SortOrder: 1},
		{Name: "Thư viện video", Slug: "thu-vien-video", Description: "Thư viện video", ParentID: &media.ID, IsActive: true, SortOrder: 2},
	}
	for _, cat := range mediaSubs {
		c := cat
		if err := repos.Categories.Create(ctx, &c); err != nil {
			log.Printf("Category %s might already exist: %v", cat.Name, err)
		} else {
			log.Printf("Created subcategory: %s", cat.Name)
		}
	}

	// Create sample tags (Chuyên đề)
	tags := []models.Tag{
		{Name: "Diễn tập", Slug: "dien-tap"},
		{Name: "Giáo dục quốc phòng", Slug: "giao-duc-quoc-phong"},
		{Name: "Công tác Đảng - Công tác chính trị", Slug: "cong-tac-dang-chinh-tri"},
		{Name: "Xây dựng Đảng", Slug: "xay-dung-dang"},
		{Name: "Huấn luyện", Slug: "huan-luyen"},
		{Name: "Sẵn sàng chiến đấu", Slug: "san-sang-chien-dau"},
		{Name: "Công tác hậu cần - kỹ thuật", Slug: "hau-can-ky-thuat"},
		{Name: "Công tác dân vận", Slug: "cong-tac-dan-van"},
		{Name: "Đoàn kết quân dân", Slug: "doan-ket-quan-dan"},
		{Name: "Thi đua yêu nước", Slug: "thi-dua-yeu-nuoc"},
		{Name: "Quyết thắng", Slug: "quyet-thang"},
		{Name: "Đảm bảo chính trị", Slug: "dam-bao-chinh-tri"},
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
			Slug:     "intro/history",
			Group:    "introduction",
			Key:      "history",
			Content:  "<h2>Lịch sử truyền thống Sư đoàn 365</h2><p>Sư đoàn 365 được thành lập năm 1965, với truyền thống vẻ vang trong cuộc kháng chiến chống Mỹ cứu nước. Qua hơn 50 năm xây dựng và phát triển, đơn vị đã lập được nhiều chiến công xuất sắc, được Đảng, Nhà nước tặng thưởng nhiều huân chương cao quý.</p>",
			Status:   models.PageStatusPublished,
			Order:    1,
			IsActive: true,
		},
		{
			Title:    "Tổ chức đơn vị",
			Slug:     "intro/organization",
			Group:    "introduction",
			Key:      "organization",
			Content:  "<h2>Tổ chức bộ máy Sư đoàn 365</h2><p>Sư đoàn 365 tổ chức theo biên chế của Quân đội nhân dân Việt Nam, bao gồm các cơ quan: Tham mưu, Chính trị, Hậu cần - Kỹ thuật và các đơn vị trực thuộc. Bộ máy tổ chức được xây dựng tinh gọn, hoạt động hiệu quả, đáp ứng yêu cầu nhiệm vụ trong tình hình mới.</p>",
			Status:   models.PageStatusPublished,
			Order:    2,
			IsActive: true,
		},
		{
			Title:    "Lãnh đạo Sư đoàn",
			Slug:     "intro/leadership",
			Group:    "introduction",
			Key:      "leadership",
			Content:  "<h2>Ban Chỉ huy Sư đoàn 365</h2><p>Ban Chỉ huy Sư đoàn 365 gồm các đồng chí lãnh đạo có năng lực, kinh nghiệm, tâm huyết với sự nghiệp xây dựng và bảo vệ Tổ quốc. Với tinh thần trách nhiệm cao, Ban Chỉ huy luôn chỉ đạo sát sao, quyết liệt trong mọi hoạt động của đơn vị.</p>",
			Status:   models.PageStatusPublished,
			Order:    3,
			IsActive: true,
		},
		{
			Title:    "Thành tích đơn vị",
			Slug:     "intro/achievements",
			Group:    "introduction",
			Key:      "achievements",
			Content:  "<h2>Thành tích tiêu biểu của Sư đoàn 365</h2><p>Qua các thời kỳ, Sư đoàn 365 đã đạt được nhiều thành tích xuất sắc: Danh hiệu Anh hùng Lực lượng vũ trang nhân dân, Huân chương Quân công hạng Nhất, nhiều lần được công nhận Đơn vị Quyết thắng. Trong công tác huấn luyện, sẵn sàng chiến đấu, xây dựng đơn vị, Sư đoàn luôn hoàn thành xuất sắc nhiệm vụ được giao.</p>",
			Status:   models.PageStatusPublished,
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

	// Seed documents - need to get category IDs first
	// Get "Công văn" category ID, or fallback to "Kho Văn bản"
	congVanCat, _ := repos.Categories.GetBySlug(ctx, "cong-van")
	khoVanBanCat, _ := repos.Categories.GetBySlug(ctx, "kho-van-ban")

	var docCategoryID int64
	if congVanCat != nil {
		docCategoryID = congVanCat.ID
		log.Printf("Found 'Công văn' category with ID: %d", docCategoryID)
	} else if khoVanBanCat != nil {
		docCategoryID = khoVanBanCat.ID
		log.Printf("Found 'Kho Văn bản' category with ID: %d", docCategoryID)
	} else {
		log.Printf("Warning: Could not find category for documents, skipping document seed")
	}

	if docCategoryID > 0 {
		documents := []models.Document{
			{
				Title:       "Nghị định 100/2019/NĐ-CP",
				Slug:        "nghi-dinh-100-2019-nd-cp",
				Description: "Về xử phạt hành chính trong lĩnh vực giao thông đường bộ và đường sắt",
				CategoryID:  docCategoryID,
				FileURL:     "/static/uploads/documents/nghi-dinh-100.pdf",
				FileName:    "nghi-dinh-100.pdf",
				FileSize:    1024000,
				FileType:    "application/pdf",
				DocumentNo:  "100/2019/NĐ-CP",
				UploadedBy:  adminUser.ID,
				ViewCount:   0,
				Status:      "published",
			},
			{
				Title:       "Thông tư 01/2020/TT-BQP",
				Slug:        "thong-tu-01-2020-tt-bqp",
				Description: "Quy định về công tác huấn luyện",
				CategoryID:  docCategoryID,
				FileURL:     "/static/uploads/documents/thong-tu-01.pdf",
				FileName:    "thong-tu-01.pdf",
				FileSize:    512000,
				FileType:    "application/pdf",
				DocumentNo:  "01/2020/TT-BQP",
				UploadedBy:  adminUser.ID,
				ViewCount:   0,
				Status:      "published",
			},
			{
				Title:       "Kế hoạch công tác năm 2025",
				Slug:        "ke-hoach-cong-tac-nam-2025",
				Description: "Kế hoạch công tác toàn đơn vị năm 2025",
				CategoryID:  docCategoryID,
				FileURL:     "/static/uploads/documents/ke-hoach-2025.docx",
				FileName:    "ke-hoach-2025.docx",
				FileSize:    256000,
				FileType:    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				DocumentNo:  "KH/01-2025",
				UploadedBy:  adminUser.ID,
				ViewCount:   0,
				Status:      "published",
			},
		}

		log.Printf("Attempting to create %d documents...", len(documents))
		for _, doc := range documents {
			d := doc
			log.Printf("Creating document: %s (CategoryID: %d)", d.Slug, d.CategoryID)
			if err := repos.Documents.Create(ctx, &d); err != nil {
				log.Printf("Document %s might already exist: %v", doc.Slug, err)
			} else {
				log.Printf("Created document: %s", doc.Title)
			}
		}
	} else {
		log.Printf("Warning: Could not find category for documents, skipping document seed")
	}

	// Seed media items - need to get category IDs first
	// Get "Thư viện ảnh" and "Thư viện video" category IDs
	thuVienAnhCat, _ := repos.Categories.GetBySlug(ctx, "thu-vien-anh")
	thuVienVideoCat, _ := repos.Categories.GetBySlug(ctx, "thu-vien-video")
	mediaCat, _ := repos.Categories.GetBySlug(ctx, "media")

	var imageCategoryID, videoCategoryID int64
	if thuVienAnhCat != nil {
		imageCategoryID = thuVienAnhCat.ID
	} else if mediaCat != nil {
		imageCategoryID = mediaCat.ID
	}

	if thuVienVideoCat != nil {
		videoCategoryID = thuVienVideoCat.ID
	} else if mediaCat != nil {
		videoCategoryID = mediaCat.ID
	} else {
		videoCategoryID = imageCategoryID
	}

	if imageCategoryID > 0 {
		mediaItems := []models.MediaItem{
			{
				Title:        "Lễ xuất quân đầu năm 2025",
				Slug:         "le-xuat-quan-dau-nam-2025",
				Description:  "Hình ảnh lễ xuất quân thực hiện nhiệm vụ năm 2025",
				CategoryID:   imageCategoryID,
				URL:          "/static/uploads/media/xuat-quan-2025.jpg",
				ThumbnailURL: "/static/uploads/media/thumbs/xuat-quan-2025.jpg",
				MediaType:    "image",
				FileSize:     2048000,
				Width:        1920,
				Height:       1080,
				UploadedBy:   adminUser.ID,
				ViewCount:    0,
				Status:       "published",
			},
			{
				Title:        "Diễn tập chiến thuật cấp đại đội",
				Slug:         "dien-tap-chien-thuat-cap-dai-doi",
				Description:  "Hoạt động diễn tập chiến thuật của các đại đội",
				CategoryID:   imageCategoryID,
				URL:          "/static/uploads/media/dien-tap.jpg",
				ThumbnailURL: "/static/uploads/media/thumbs/dien-tap.jpg",
				MediaType:    "image",
				FileSize:     1536000,
				Width:        1920,
				Height:       1080,
				UploadedBy:   adminUser.ID,
				ViewCount:    0,
				Status:       "published",
			},
			{
				Title:        "Huấn luyện bắn đạn thật",
				Slug:         "huan-luyen-ban-dan-that",
				Description:  "Hình ảnh huấn luyện bắn đạn thật năm 2025",
				CategoryID:   imageCategoryID,
				URL:          "/static/uploads/media/ban-dan-that.jpg",
				ThumbnailURL: "/static/uploads/media/thumbs/ban-dan-that.jpg",
				MediaType:    "image",
				FileSize:     1792000,
				Width:        1920,
				Height:       1080,
				UploadedBy:   adminUser.ID,
				ViewCount:    0,
				Status:       "published",
			},
			{
				Title:        "Clip xuất quân năm 2025",
				Slug:         "clip-xuat-quan-nam-2025",
				Description:  "Video clip lễ xuất quân thực hiện nhiệm vụ",
				CategoryID:   videoCategoryID,
				URL:          "/static/uploads/media/xuat-quan-2025.mp4",
				ThumbnailURL: "/static/uploads/media/thumbs/xuat-quan-2025-thumb.jpg",
				MediaType:    "video",
				FileSize:     15360000,
				Duration:     125,
				UploadedBy:   adminUser.ID,
				ViewCount:    0,
				Status:       "published",
			},
			{
				Title:        "Diễn tập thực binh",
				Slug:         "dien-tap-thuc-binh",
				Description:  "Video diễn tập thực binh toàn Sư đoàn",
				CategoryID:   videoCategoryID,
				URL:          "/static/uploads/media/dien-tap-thuc-binh.mp4",
				ThumbnailURL: "/static/uploads/media/thumbs/dien-tap-thuc-binh-thumb.jpg",
				MediaType:    "video",
				FileSize:     28672000,
				Duration:     256,
				UploadedBy:   adminUser.ID,
				ViewCount:    0,
				Status:       "published",
			},
		}

		for _, media := range mediaItems {
			m := media
			if err := repos.MediaItems.Create(ctx, &m); err != nil {
				log.Printf("Media item %s might already exist: %v", media.Slug, err)
			} else {
				log.Printf("Created media item: %s (%s)", media.Title, media.MediaType)
			}
		}
	} else {
		log.Printf("Warning: Could not find category for media, skipping media seed")
	}

	// Create settings for home sections
	homeSettings := []models.Setting{
		{
			Key:      "home_sections_activities",
			Value:    "hoat-dong-cua-thu-truong,hoat-dong-cua-su-doan,hoat-dong-cua-cac-don-vi",
			IsPublic: true,
		},
		{
			Key:      "home_sections_news",
			Value:    "tin-quoc-te,tin-trong-nuoc,tin-quan-su,tin-don-vi",
			IsPublic: true,
		},
		{
			Key:      "site_name",
			Value:    "Portal 365 - Sư đoàn 365",
			IsPublic: true,
		},
		{
			Key:      "site_description",
			Value:    "Cổng thông tin điện tử Sư đoàn 365",
			IsPublic: true,
		},
	}

	for _, setting := range homeSettings {
		s := setting
		if err := repos.Settings.Set(ctx, &s); err != nil {
			log.Printf("Setting %s might already exist: %v", s.Key, err)
		} else {
			log.Printf("Created setting: %s", s.Key)
		}
	}

	log.Println("Seeding completed!")
	log.Println("Admin credentials: admin@portal365.com / admin123")
}
