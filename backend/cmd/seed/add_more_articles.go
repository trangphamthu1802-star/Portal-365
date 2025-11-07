package main

import (
	"context"
	"log"
	"time"

	"github.com/thieugt95/portal-365/backend/internal/config"
	"github.com/thieugt95/portal-365/backend/internal/database"
	"github.com/thieugt95/portal-365/backend/internal/models"
)

func main() {
	cfg := config.Load()
	db, err := database.Initialize(cfg.DatabaseDSN)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	repos := database.NewRepositories(db)
	ctx := context.Background()

	// Get categories
	allCats, _ := repos.Categories.List(ctx, nil)
	catBySlug := make(map[string]int64)
	for _, cat := range allCats {
		catBySlug[cat.Slug] = cat.ID
	}

	// Get tags
	allTags, _, _ := repos.Tags.List(ctx, 1, 1000)
	tagBySlug := make(map[string]int64)
	for _, tag := range allTags {
		tagBySlug[tag.Slug] = tag.ID
	}

	// Additional articles for missing categories
	additionalArticles := []struct {
		title         string
		slug          string
		categorySlug  string
		tagSlugs      []string
		summary       string
		content       string
		featuredImage string
	}{
		// Tin hoạt động của Sư đoàn
		{
			title:        "Sư đoàn 365 tổ chức Hội nghị Đảng bộ lần thứ X",
			slug:         "su-doan-365-hoi-nghi-dang-bo-lan-10",
			categorySlug: "hoat-dong-su-doan",
			tagSlugs:     []string{"xay-dung-dang", "cong-tac-dang-chinh-tri"},
			summary:      "Đảng bộ Sư đoàn 365 tổ chức Hội nghị lần thứ X, tổng kết công tác năm 2024 và triển khai nhiệm vụ năm 2025.",
			content: `<h2>Hội nghị Đảng bộ lần thứ X</h2>
<p>Với sự tham gia đầy đủ của 150 đại biểu, Hội nghị Đảng bộ Sư đoàn 365 lần thứ X đã diễn ra trong không khí dân chủ, đoàn kết, thống nhất cao.</p>
<img src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800" alt="Hội nghị Đảng bộ" />
<p>Tại hội nghị, các đại biểu đã thảo luận sôi nổi về các nội dung quan trọng, đề xuất nhiều giải pháp thiết thực để nâng cao chất lượng lãnh đạo của Đảng bộ.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800",
		},
		{
			title:        "Thi đua lập công chào mừng kỷ niệm 80 năm thành lập Quân đội",
			slug:         "thi-dua-lap-cong-80-nam-quan-doi",
			categorySlug: "hoat-dong-su-doan",
			tagSlugs:     []string{"thi-dua-yeu-nuoc", "quyet-thang"},
			summary:      "Phát động phong trào thi đua lập công chào mừng kỷ niệm 80 năm ngày thành lập Quân đội nhân dân Việt Nam.",
			content: `<p>Toàn Sư đoàn phát động phong trào thi đua lập công, phấn đấu hoàn thành xuất sắc mọi nhiệm vụ được giao, chào mừng kỷ niệm 80 năm Ngày thành lập Quân đội nhân dân Việt Nam (22/12/1944 - 22/12/2024).</p>
<img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800" alt="Thi đua" />`,
			featuredImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
		},
		{
			title:         "Sư đoàn 365 tham gia diễn tập khu vực phòng thủ cấp tỉnh",
			slug:          "su-doan-tham-gia-dien-tap-khu-vuc-phong-thu",
			categorySlug:  "hoat-dong-su-doan",
			tagSlugs:      []string{"dien-tap", "san-sang-chien-dau"},
			summary:       "Sư đoàn 365 tham gia diễn tập khu vực phòng thủ cấp tỉnh với nội dung chuyển trạng thái sẵn sàng chiến đấu.",
			content:       `<p>Diễn tập quy mô lớn với sự tham gia của nhiều lực lượng, Sư đoàn 365 đảm nhận vai trò lực lượng nòng cốt trong diễn tập.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
		},
		{
			title:         "Công tác bảo đảm hậu cần - kỹ thuật trong huấn luyện",
			slug:          "cong-tac-bao-dam-hau-can-ky-thuat",
			categorySlug:  "hoat-dong-su-doan",
			tagSlugs:      []string{"hau-can-ky-thuat"},
			summary:       "Sư đoàn đẩy mạnh công tác bảo đảm hậu cần - kỹ thuật, đáp ứng yêu cầu huấn luyện và sẵn sàng chiến đấu.",
			content:       `<p>Với phương châm "Chủ động, kịp thời, hiệu quả", các đơn vị hậu cần - kỹ thuật đã làm tốt công tác bảo đảm cho huấn luyện.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
		},
		{
			title:         "Công tác dân vận của Sư đoàn 365 đạt nhiều kết quả",
			slug:          "cong-tac-dan-van-dat-nhieu-ket-qua",
			categorySlug:  "hoat-dong-su-doan",
			tagSlugs:      []string{"cong-tac-dan-van", "doan-ket-quan-dan"},
			summary:       "Công tác dân vận được triển khai sâu rộng, góp phần củng cố mối quan hệ quân dân.",
			content:       `<p>Sư đoàn đã tổ chức nhiều hoạt động ý nghĩa như: khám bệnh, phát thuốc miễn phí, xây dựng nhà tình nghĩa, tặng quà cho người nghèo...</p>`,
			featuredImage: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800",
		},
		{
			title:         "Đại hội thi đua quyết thắng Sư đoàn 365",
			slug:          "dai-hoi-thi-dua-quyet-thang",
			categorySlug:  "hoat-dong-su-doan",
			tagSlugs:      []string{"thi-dua-yeu-nuoc", "quyet-thang"},
			summary:       "Đại hội thi đua quyết thắng Sư đoàn 365 giai đoạn 2020-2025 diễn ra long trọng, biểu dương 100 tập thể, cá nhân tiêu biểu.",
			content:       `<p>Đại hội đã tôn vinh những tập thể, cá nhân có thành tích xuất sắc, góp phần xây dựng Sư đoàn vững mạnh toàn diện.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
		},
		// Tin đơn vị
		{
			title:        "Trung đoàn 2 đạt danh hiệu Đơn vị Quyết thắng xuất sắc",
			slug:         "trung-doan-2-quyet-thang-xuat-sac",
			categorySlug: "tin-don-vi",
			tagSlugs:     []string{"quyet-thang", "huan-luyen"},
			summary:      "Với thành tích xuất sắc trong huấn luyện, xây dựng đơn vị, Trung đoàn 2 vinh dự đón nhận danh hiệu Đơn vị Quyết thắng xuất sắc.",
			content: `<p>100% cán bộ, chiến sĩ đạt khá giỏi, đơn vị có nhiều sáng kiến cải tiến kỹ thuật được công nhận và áp dụng rộng rãi.</p>
<img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800" alt="Đơn vị Quyết thắng" />`,
			featuredImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800",
		},
		{
			title:         "Tiểu đoàn Pháo binh 3 lập thành tích xuất sắc trong huấn luyện",
			slug:          "tieu-doan-phao-binh-3-thanh-tich-xuat-sac",
			categorySlug:  "tin-don-vi",
			tagSlugs:      []string{"huan-luyen"},
			summary:       "Tiểu đoàn Pháo binh 3 hoàn thành xuất sắc kế hoạch huấn luyện, 100% đội, tổ đạt khá giỏi.",
			content:       `<p>Đơn vị tập trung huấn luyện theo phương châm "Cơ bản, thiết thực, vững chắc", mọi cán bộ chiến sĩ đều nâng cao trình độ.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1569025743873-ea3a9ade89f9?w=800",
		},
		{
			title:         "Tiểu đoàn Thiết giáp tổ chức hội thi sáng kiến cải tiến kỹ thuật",
			slug:          "tieu-doan-thiet-giap-hoi-thi-sang-kien",
			categorySlug:  "tin-don-vi",
			tagSlugs:      []string{"hau-can-ky-thuat"},
			summary:       "Hội thi sáng kiến cải tiến kỹ thuật với 25 đề tài tham gia, góp phần nâng cao chất lượng huấn luyện.",
			content:       `<p>Các sáng kiến đều xuất phát từ thực tiễn, có giá trị ứng dụng cao, giúp tiết kiệm thời gian và nâng cao hiệu quả huấn luyện.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
		},
		{
			title:         "Đại đội Công binh số 2 hoàn thành xuất sắc nhiệm vụ huấn luyện",
			slug:          "dai-doi-cong-binh-2-hoan-thanh-xuat-sac",
			categorySlug:  "tin-don-vi",
			tagSlugs:      []string{"huan-luyen", "quyet-thang"},
			summary:       "Đại đội Công binh số 2 hoàn thành 100% chỉ tiêu huấn luyện, 98% cán bộ chiến sĩ đạt khá giỏi.",
			content:       `<p>Đơn vị đã tổ chức nhiều cuộc huấn luyện thực hành trên công trường, rèn luyện kỹ năng thực chiến cho cán bộ chiến sĩ.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
		},
		{
			title:         "Tiểu đoàn Thông tin liên lạc nâng cao chất lượng huấn luyện chuyên môn",
			slug:          "tieu-doan-thong-tin-lien-lac-nang-cao-chat-luong",
			categorySlug:  "tin-don-vi",
			tagSlugs:      []string{"huan-luyen"},
			summary:       "Tiểu đoàn Thông tin liên lạc tập trung nâng cao chất lượng huấn luyện chuyên môn nghiệp vụ.",
			content:       `<p>Đơn vị đã tổ chức nhiều lớp bồi dưỡng nâng cao trình độ cho cán bộ, chiến sĩ, đáp ứng yêu cầu nhiệm vụ trong tình hình mới.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
		},
		{
			title:         "Trung đoàn 3 tổ chức Hội thi chiến sĩ giỏi",
			slug:          "trung-doan-3-hoi-thi-chien-si-gioi",
			categorySlug:  "tin-don-vi",
			tagSlugs:      []string{"huan-luyen", "thi-dua-yeu-nuoc"},
			summary:       "Hội thi chiến sĩ giỏi cấp Trung đoàn với sự tham gia của 50 chiến sĩ xuất sắc nhất các đơn vị.",
			content:       `<p>Các nội dung thi gồm: bắn súng, ném lựu đàn, vượt vật cản, huấn luyện chiến đấu đơn binh. Qua hội thi phát hiện nhiều chiến sĩ xuất sắc.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800",
		},
	}

	now := time.Now()
	for i, sa := range additionalArticles {
		categoryID, ok := catBySlug[sa.categorySlug]
		if !ok {
			log.Printf("Category %s not found, skipping article: %s", sa.categorySlug, sa.title)
			continue
		}

		article := &models.Article{
			Title:         sa.title,
			Slug:          sa.slug,
			Summary:       sa.summary,
			Content:       sa.content,
			FeaturedImage: sa.featuredImage,
			AuthorID:      1,
			CategoryID:    categoryID,
			Status:        models.StatusPublished,
			ViewCount:     int64((i + 10) * 120),
			IsFeatured:    false,
			PublishedAt:   &now,
		}

		if err := repos.Articles.Create(ctx, article); err != nil {
			log.Printf("Failed to create article %s: %v", sa.title, err)
			continue
		}

		// Add tags
		for _, tagSlug := range sa.tagSlugs {
			if tagID, ok := tagBySlug[tagSlug]; ok {
				repos.Articles.AddTag(ctx, article.ID, tagID)
			}
		}

		log.Printf("Created article: %s (ID: %d)", sa.title, article.ID)
	}

	log.Println("✅ All additional articles created successfully!")
}
