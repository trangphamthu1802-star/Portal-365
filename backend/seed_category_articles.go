package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "modernc.org/sqlite"
)

func main() {
	// Connect to database
	db, err := sql.Open("sqlite", "portal.db?_busy_timeout=5000")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	ctx := context.Background()

	// Articles to seed for each category
	articles := []struct {
		Title         string
		Slug          string
		Summary       string
		Content       string
		CategoryID    int64
		FeaturedImage string
	}{
		// Tin trong nước (category_id = 16)
		{
			Title:      "Chính phủ ban hành Nghị quyết hỗ trợ doanh nghiệp năm 2025",
			Slug:       "chinh-phu-ban-hanh-nghi-quyet-ho-tro-doanh-nghiep-2025",
			Summary:    "Chính phủ vừa ban hành Nghị quyết về các giải pháp hỗ trợ doanh nghiệp, phát triển kinh tế năm 2025.",
			Content:    "<p>Chính phủ vừa ban hành Nghị quyết về các giải pháp hỗ trợ doanh nghiệp, phát triển kinh tế năm 2025, tập trung vào các lĩnh vực ưu tiên.</p>",
			CategoryID: 16,
		},
		{
			Title:      "Hội nghị Trung ương 9 bàn về phát triển kinh tế - xã hội",
			Slug:       "hoi-nghi-trung-uong-9-ban-ve-phat-trien-kinh-te-xa-hoi",
			Summary:    "Hội nghị lần thứ 9 Ban Chấp hành Trung ương Đảng khóa XIII sẽ bàn về phương hướng phát triển kinh tế - xã hội.",
			Content:    "<p>Hội nghị lần thứ 9 Ban Chấp hành Trung ương Đảng khóa XIII dự kiến diễn ra trong tháng này.</p>",
			CategoryID: 16,
		},

		// Tin quốc tế (category_id = 17)
		{
			Title:      "Hội nghị thượng đỉnh G20 thảo luận về biến đổi khí hậu",
			Slug:       "hoi-nghi-thuong-dinh-g20-thao-luan-ve-bien-doi-khi-hau",
			Summary:    "Các nhà lãnh đạo G20 đã cam kết tăng cường hợp tác quốc tế trong ứng phó với biến đổi khí hậu.",
			Content:    "<p>Hội nghị thượng đỉnh G20 đã kết thúc với cam kết mạnh mẽ về hợp tác toàn cầu.</p>",
			CategoryID: 17,
		},
		{
			Title:      "ASEAN và EU ký kết thỏa thuận hợp tác chiến lược",
			Slug:       "asean-va-eu-ky-ket-thoa-thuan-hop-tac-chien-luoc",
			Summary:    "ASEAN và Liên minh châu Âu đã ký kết thỏa thuận hợp tác chiến lược toàn diện.",
			Content:    "<p>Thỏa thuận mở ra cơ hội hợp tác mới giữa hai khu vực.</p>",
			CategoryID: 17,
		},

		// Tin quân sự (category_id = 18)
		{
			Title:      "Quân đội nhân dân Việt Nam tăng cường huấn luyện chính quy",
			Slug:       "quan-doi-nhan-dan-viet-nam-tang-cuong-huan-luyen-chinh-quy",
			Summary:    "Các đơn vị trong toàn quân đẩy mạnh công tác huấn luyện, sẵn sàng chiến đấu năm 2025.",
			Content:    "<p>Công tác huấn luyện được tăng cường với nhiều nội dung mới.</p>",
			CategoryID: 18,
		},
		{
			Title:      "Hải quân Việt Nam diễn tập bảo vệ chủ quyền biển đảo",
			Slug:       "hai-quan-viet-nam-dien-tap-bao-ve-chu-quyen-bien-dao",
			Summary:    "Các đơn vị Hải quân tổ chức diễn tập bảo vệ chủ quyền biển, đảo của Tổ quốc.",
			Content:    "<p>Diễn tập nhằm nâng cao khả năng sẵn sàng chiến đấu của lực lượng.</p>",
			CategoryID: 18,
		},

		// Tin hoạt động Sư đoàn (category_id = 19)
		{
			Title:      "Sư đoàn tổ chức Hội thi Bắn súng giỏi năm 2025",
			Slug:       "su-doan-to-chuc-hoi-thi-ban-sung-gioi-nam-2025",
			Summary:    "Hội thi Bắn súng giỏi cấp Sư đoàn thu hút hơn 200 xạ thủ xuất sắc tham gia.",
			Content:    "<p>Hội thi diễn ra sôi nổi với nhiều nội dung bắn súng chuyên nghiệp.</p>",
			CategoryID: 19,
		},
		{
			Title:      "Đảng ủy Sư đoàn triển khai Nghị quyết Trung ương",
			Slug:       "dang-uy-su-doan-trien-khai-nghi-quyet-trung-uong",
			Summary:    "Đảng ủy Sư đoàn tổ chức hội nghị triển khai Nghị quyết Trung ương về xây dựng Đảng.",
			Content:    "<p>Hội nghị đề ra nhiệm vụ trọng tâm trong năm 2025.</p>",
			CategoryID: 19,
		},
		{
			Title:      "Sư đoàn đạt thành tích cao trong kiểm tra công tác năm 2024",
			Slug:       "su-doan-dat-thanh-tich-cao-trong-kiem-tra-cong-tac-nam-2024",
			Summary:    "Ban Tư lệnh Quân khu đánh giá cao kết quả công tác của Sư đoàn trong năm qua.",
			Content:    "<p>Sư đoàn đứng đầu trong các đơn vị được kiểm tra.</p>",
			CategoryID: 19,
		},
	}

	publishedAt := time.Now().Add(-24 * time.Hour)

	fmt.Println("=== Seeding Articles ===")
	for i, article := range articles {
		_, err := db.ExecContext(ctx, `
			INSERT INTO articles (
				title, slug, summary, content, featured_image, 
				author_id, category_id, status, view_count, 
				is_featured, published_at, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
			article.Title,
			article.Slug,
			article.Summary,
			article.Content,
			article.FeaturedImage,
			1, // admin user
			article.CategoryID,
			"published",
			(i+1)*10, // fake view count
			i < 3,    // first 3 are featured
			publishedAt.Add(time.Duration(i)*time.Hour),
		)

		if err != nil {
			log.Printf("Failed to insert article %s: %v", article.Title, err)
		} else {
			fmt.Printf("✓ Created: %s (category_id=%d)\n", article.Title, article.CategoryID)
		}
	}

	// Count articles by category
	rows, _ := db.QueryContext(ctx, `
		SELECT c.name, COUNT(a.id) 
		FROM categories c 
		LEFT JOIN articles a ON c.id = a.category_id 
		WHERE c.parent_id = 1
		GROUP BY c.id, c.name
	`)
	defer rows.Close()

	fmt.Println("\n=== Articles by Category ===")
	for rows.Next() {
		var name string
		var count int
		rows.Scan(&name, &count)
		fmt.Printf("%s: %d articles\n", name, count)
	}

	fmt.Println("\n✅ Seeding completed!")
}
