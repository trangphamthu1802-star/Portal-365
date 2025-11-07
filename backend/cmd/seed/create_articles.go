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

	// Sample articles with Vietnamese content
	sampleArticles := []struct {
		title         string
		slug          string
		categorySlug  string
		tagSlugs      []string
		summary       string
		content       string
		featuredImage string
		isFeatured    bool
	}{
		// Hoạt động của Sư đoàn
		{
			title:        "Sư đoàn 365 tổ chức diễn tập chiến thuật cấp tiểu đoàn có bắn đạn thật",
			slug:         "su-doan-365-to-chuc-dien-tap-chien-thuat",
			categorySlug: "su-doan",
			tagSlugs:     []string{"dien-tap", "huan-luyen", "san-sang-chien-dau"},
			summary:      "Nhằm nâng cao chất lượng huấn luyện, khả năng sẵn sàng chiến đấu của đơn vị, Sư đoàn 365 vừa tổ chức diễn tập chiến thuật cấp tiểu đoàn có bắn đạn thật năm 2024.",
			content: `<h2>Diễn tập quy mô lớn với sự tham gia của nhiều lực lượng</h2>
<p>Cuộc diễn tập được tổ chức tại bãi tập Tam Điệp, với sự tham gia của hơn 500 cán bộ, chiến sĩ thuộc các đơn vị trực thuộc Sư đoàn. Nội dung diễn tập tập trung vào việc rèn luyện khả năng phối hợp chiến đấu giữa các binh chủng, sử dụng hiệu quả các loại vũ khí trang bị.</p>
<img src="https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800" alt="Diễn tập" />
<h3>Các nội dung chính của diễn tập</h3>
<ul>
<li>Huấn luyện chiến thuật tấn công và phòng thủ</li>
<li>Phối hợp hỏa lực giữa các đơn vị</li>
<li>Sử dụng vũ khí trang bị hiện đại</li>
<li>Tổ chức chỉ huy và điều hành chiến đấu</li>
</ul>
<p>Kết quả diễn tập đạt mục tiêu đề ra, các đơn vị hoàn thành xuất sắc nhiệm vụ được giao.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800",
			isFeatured:    true,
		},
		{
			title:        "Sư đoàn 365 triển khai nhiệm vụ huấn luyện năm 2025",
			slug:         "su-doan-365-trien-khai-huan-luyen-2025",
			categorySlug: "su-doan",
			tagSlugs:     []string{"huan-luyen", "quyet-thang"},
			summary:      "Ngày 05/01/2025, Sư đoàn 365 tổ chức hội nghị triển khai nhiệm vụ huấn luyện năm 2025 với quyết tâm hoàn thành xuất sắc mọi nhiệm vụ.",
			content: `<h2>Hội nghị triển khai nhiệm vụ huấn luyện năm 2025</h2>
<p>Tại hội nghị, Chỉ huy Sư đoàn đã quán triệt sâu sắc chỉ thị của Bộ Quốc phòng về công tác huấn luyện năm 2025. Năm nay, Sư đoàn tập trung nâng cao chất lượng huấn luyện toàn diện, đặc biệt là huấn luyện chiến thuật, kỹ thuật sử dụng vũ khí trang bị hiện đại.</p>
<img src="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800" alt="Hội nghị" />
<h3>Mục tiêu chính năm 2025</h3>
<ul>
<li>100% cán bộ, chiến sĩ đạt khá giỏi về quân sự, chính trị</li>
<li>Tổ chức 3 cuộc diễn tập lớn cấp Sư đoàn</li>
<li>Nâng cao năng lực sẵn sàng chiến đấu</li>
</ul>`,
			featuredImage: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800",
			isFeatured:    true,
		},
		// Hoạt động của các đơn vị
		{
			title:        "Trung đoàn 1 hoàn thành xuất sắc nhiệm vụ huấn luyện quý I",
			slug:         "trung-doan-1-hoan-thanh-xuat-sac-quy-1",
			categorySlug: "don-vi",
			tagSlugs:     []string{"huan-luyen", "quyet-thang"},
			summary:      "Với tinh thần quyết tâm cao, Trung đoàn 1 đã hoàn thành xuất sắc kế hoạch huấn luyện quý I năm 2025.",
			content: `<p>Trung đoàn 1 đã tổ chức huấn luyện theo kế hoạch, tập trung nâng cao chất lượng huấn luyện đơn binh, tổ, chiến đấu xe. 98% cán bộ, chiến sĩ đạt khá giỏi.</p>
<img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800" alt="Huấn luyện" />`,
			featuredImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
		},
		{
			title:         "Tiểu đoàn Trinh sát tổ chức diễn tập trinh sát địa hình phức tạp",
			slug:          "tieu-doan-trinh-sat-dien-tap",
			categorySlug:  "don-vi",
			tagSlugs:      []string{"dien-tap", "huan-luyen"},
			summary:       "Tiểu đoàn Trinh sát vừa tổ chức diễn tập trinh sát trên địa hình núi rừng phức tạp, rèn luyện kỹ năng thực chiến.",
			content:       `<p>Diễn tập diễn ra trong 3 ngày đêm liên tục trên địa hình núi rừng hiểm trở. Các trinh sát viên đã thể hiện tinh thần vượt khó, hoàn thành xuất sắc nhiệm vụ thu thập thông tin địch.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1622556498246-755f44ca76f3?w=800",
		},
		// Hoạt động của Thủ trưởng
		{
			title:        "Chính uỷ Sư đoàn kiểm tra công tác xây dựng Đảng tại Trung đoàn 2",
			slug:         "chinh-uy-kiem-tra-xay-dung-dang",
			categorySlug: "thu-truong-su-doan",
			tagSlugs:     []string{"xay-dung-dang", "cong-tac-dang-chinh-tri"},
			summary:      "Đồng chí Chính uỷ Sư đoàn đã đến kiểm tra, chỉ đạo công tác xây dựng Đảng tại Trung đoàn 2.",
			content: `<h2>Kiểm tra toàn diện công tác Đảng</h2>
<p>Tại buổi làm việc, đồng chí Chính uỷ đã nghe báo cáo về công tác xây dựng Đảng bộ, công tác giáo dục chính trị tư tưởng trong 6 tháng đầu năm. Đồng chí đánh giá cao những kết quả đạt được, đồng thời chỉ ra những tồn tại cần khắc phục.</p>
<img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800" alt="Họp Đảng" />
<p>Đồng chí yêu cầu Đảng bộ Trung đoàn tiếp tục nâng cao chất lượng sinh hoạt chi bộ, quan tâm xây dựng đội ngũ cán bộ, đảng viên trong sạch, vững mạnh.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
			isFeatured:    true,
		},
		// Tin trong nước
		{
			title:        "Thủ tướng chủ trì hội nghị triển khai nhiệm vụ quốc phòng năm 2025",
			slug:         "thu-tuong-hoi-nghi-quoc-phong-2025",
			categorySlug: "trong-nuoc",
			tagSlugs:     []string{"dam-bao-chinh-tri"},
			summary:      "Ngày 10/01, Thủ tướng Chính phủ chủ trì hội nghị toàn quốc triển khai nhiệm vụ quốc phòng năm 2025.",
			content: `<p>Tại hội nghị, Thủ tướng nhấn mạnh tầm quan trọng của công tác quốc phòng trong tình hình mới. Yêu cầu các lực lượng vũ trang tiếp tục nâng cao năng lực sẵn sàng chiến đấu, bảo vệ vững chắc Tổ quốc.</p>
<img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800" alt="Hội nghị quốc phòng" />`,
			featuredImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
		},
		{
			title:         "Bộ Quốc phòng trao tặng nhà tình nghĩa cho gia đình chính sách",
			slug:          "bo-quoc-phong-trao-nha-tinh-nghia",
			categorySlug:  "trong-nuoc",
			tagSlugs:      []string{"doan-ket-quan-dan", "cong-tac-dan-van"},
			summary:       "Bộ Quốc phòng và các đơn vị vừa trao tặng 50 căn nhà tình nghĩa cho các gia đình chính sách.",
			content:       `<p>Chương trình thể hiện truyền thống "Uống nước nhớ nguồn" của dân tộc, tri ân công lao to lớn của các anh hùng liệt sĩ, thương binh, gia đình có công với cách mạng.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
			isFeatured:    true,
		},
		// Tin quốc tế
		{
			title:        "Việt Nam tham gia diễn đàn an ninh quốc tế tại Singapore",
			slug:         "viet-nam-dien-dan-an-ninh-singapore",
			categorySlug: "quoc-te",
			tagSlugs:     []string{"dam-bao-chinh-tri"},
			summary:      "Đoàn đại biểu Việt Nam đã tham dự Diễn đàn An ninh Shangri-La lần thứ 21 tại Singapore.",
			content: `<p>Tại diễn đàn, đại biểu Việt Nam đã chia sẻ quan điểm về hợp tác quốc phòng, an ninh khu vực, nhấn mạnh vai trò của luật pháp quốc tế trong giải quyết tranh chấp.</p>
<img src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800" alt="Hội nghị quốc tế" />`,
			featuredImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
		},
		// Tin quân sự
		{
			title:        "Quân đội nhân dân Việt Nam hiện đại hóa trang bị kỹ thuật",
			slug:         "quan-doi-hien-dai-hoa-trang-bi",
			categorySlug: "quan-su",
			tagSlugs:     []string{"hau-can-ky-thuat", "san-sang-chien-dau"},
			summary:      "Quân đội ta đang từng bước hiện đại hóa vũ khí trang bị, nâng cao sức mạnh chiến đấu.",
			content: `<h2>Đầu tư hiện đại hóa toàn diện</h2>
<p>Trong những năm qua, Quân đội nhân dân Việt Nam đã đầu tư mạnh vào hiện đại hóa trang bị kỹ thuật, đặc biệt là các loại vũ khí, khí tài hiện đại phục vụ nhiệm vụ bảo vệ Tổ quốc.</p>
<img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800" alt="Vũ khí hiện đại" />`,
			featuredImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800",
			isFeatured:    true,
		},
		// Thêm các bài viết khác
		{
			title:         "Trung đoàn 3 tổ chức hội thao quân sự cấp đơn vị",
			slug:          "trung-doan-3-hoi-thao-quan-su",
			categorySlug:  "don-vi",
			tagSlugs:      []string{"huan-luyen", "thi-dua-yeu-nuoc"},
			summary:       "Hội thao diễn ra sôi nổi với sự tham gia của 12 đội thi đến từ các đơn vị trực thuộc.",
			content:       `<p>Các nội dung thi gồm: bắn súng tiểu liên, ném lựu đạn, vượt vật cản, huấn luyện chiến đấu đơn binh. Qua hội thao, phát hiện và biểu dương nhiều chiến sĩ xuất sắc.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
		},
		{
			title:         "Đại đội Pháo binh số 1 đạt danh hiệu Đơn vị Quyết thắng",
			slug:          "dai-doi-phao-binh-quyet-thang",
			categorySlug:  "don-vi",
			tagSlugs:      []string{"quyet-thang", "huan-luyen"},
			summary:       "Với thành tích xuất sắc trong huấn luyện và xây dựng đơn vị, Đại đội Pháo binh số 1 vinh dự đón nhận danh hiệu Đơn vị Quyết thắng năm 2024.",
			content:       `<p>Đại đội đã hoàn thành 100% chỉ tiêu huấn luyện, 95% cán bộ chiến sĩ đạt khá giỏi. Đơn vị có nhiều sáng kiến cải tiến kỹ thuật, nâng cao hiệu quả huấn luyện.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1529590776689-3b00f9c1934a?w=800",
		},
		{
			title:         "Sư đoàn trưởng kiểm tra công tác sẵn sàng chiến đấu các đơn vị",
			slug:          "su-doan-truong-kiem-tra-san-sang-chien-dau",
			categorySlug:  "thu-truong-su-doan",
			tagSlugs:      []string{"san-sang-chien-dau"},
			summary:       "Đồng chí Sư đoàn trưởng trực tiếp kiểm tra công tác sẵn sàng chiến đấu tại các đơn vị.",
			content:       `<p>Qua kiểm tra, đồng chí Sư đoàn trưởng ghi nhận những kết quả đạt được, đồng thời yêu cầu các đơn vị tiếp tục nâng cao cảnh giác, sẵn sàng chiến đấu cao trong mọi tình huống.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800",
		},
		{
			title:         "Học viện Chính trị tổ chức bồi dưỡng lý luận chính trị cho cán bộ",
			slug:          "hoc-vien-chinh-tri-boi-duong-can-bo",
			categorySlug:  "trong-nuoc",
			tagSlugs:      []string{"cong-tac-dang-chinh-tri", "xay-dung-dang"},
			summary:       "Lớp bồi dưỡng lý luận chính trị dành cho cán bộ chủ chốt các đơn vị vừa khai giảng tại Học viện Chính trị.",
			content:       `<p>200 học viên tham gia khóa học trong 3 tháng, nghiên cứu sâu về lý luận chính trị, đường lối của Đảng, nâng cao bản lĩnh chính trị.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
		},
		{
			title:         "Hội thảo quốc tế về biển Đông tại Hà Nội",
			slug:          "hoi-thao-quoc-te-bien-dong",
			categorySlug:  "quoc-te",
			tagSlugs:      []string{"dam-bao-chinh-tri"},
			summary:       "Hội thảo với sự tham gia của các chuyên gia quốc tế bàn về hòa bình, an ninh biển Đông.",
			content:       `<p>Các đại biểu nhất trí nhấn mạnh tầm quan trọng của luật pháp quốc tế, tôn trọng chủ quyền các quốc gia, giải quyết tranh chấp bằng biện pháp hòa bình.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
		},
		{
			title:         "Ngành Hậu cần Quân đội đảm bảo vật chất cho huấn luyện",
			slug:          "nganh-hau-can-dam-bao-vat-chat",
			categorySlug:  "quan-su",
			tagSlugs:      []string{"hau-can-ky-thuat"},
			summary:       "Ngành Hậu cần đã chủ động đảm bảo đầy đủ vật chất, kỹ thuật phục vụ huấn luyện và sẵn sàng chiến đấu.",
			content:       `<p>Các kho tàng được bảo quản tốt, luôn sẵn sàng cung ứng kịp thời. Công tác sửa chữa vũ khí, khí tài được đẩy mạnh, đảm bảo trang bị luôn ở trạng thái tốt.</p>`,
			featuredImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
		},
	}

	now := time.Now()
	for i, sa := range sampleArticles {
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
			AuthorID:      1, // Admin user
			CategoryID:    categoryID,
			Status:        models.StatusPublished,
			ViewCount:     int64((i + 1) * 150),
			IsFeatured:    sa.isFeatured,
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

	log.Println("✅ All sample articles created successfully!")
}
