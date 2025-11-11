package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/thieugt95/portal-365/backend/internal/config"
	"github.com/thieugt95/portal-365/backend/internal/database"
	_ "modernc.org/sqlite"
)

func main() {
	cfg := config.Load()
	db, err := database.Initialize(cfg.DatabaseDSN)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	ctx := context.Background()
	fmt.Println("Starting to seed Activities and News data...")

	// Get categories map
	categoryIDs := make(map[string]int64)

	categories := []string{
		"hoat-dong", "hoat-dong-su-doan", "hoat-dong-cac-don-vi", "hoat-dong-thu-truong",
		"tin-tuc", "tin-trong-nuoc", "tin-quoc-te", "tin-quan-su", "tin-hoat-dong-su-doan",
	}

	for _, slug := range categories {
		var id int64
		err := db.QueryRowContext(ctx, "SELECT id FROM categories WHERE slug = ?", slug).Scan(&id)
		if err != nil {
			log.Printf("Category '%s' not found, please run category seed first", slug)
			continue
		}
		categoryIDs[slug] = id
	}

	// Get admin user
	var adminUserID int64
	err = db.QueryRowContext(ctx, "SELECT id FROM users LIMIT 1").Scan(&adminUserID)
	if err != nil {
		log.Fatal("Failed to get user:", err)
	}

	// Create Activities (as Articles)
	fmt.Println("\n=== Creating Activity Articles ===")
	activities := []struct {
		categorySlug string
		title        string
		content      string
	}{
		{
			"hoat-dong-su-doan",
			"Sư đoàn tổ chức Hội nghị Quán triệt nghị quyết Trung ương 9",
			`<p>Ngày 07/11/2025, Đảng ủy Sư đoàn đã tổ chức Hội nghị quán triệt Nghị quyết Hội nghị lần thứ 9 Ban Chấp hành Trung ương Đảng khóa XIII.</p>
<p>Tại hội nghị, đồng chí Chính ủy Sư đoàn đã truyền đạt đầy đủ nội dung các Nghị quyết, nhấn mạnh tầm quan trọng của việc quán triệt và triển khai thực hiện nghiêm túc các nghị quyết của Đảng.</p>
<p>Các đại biểu đã tham gia thảo luận sôi nổi, đề xuất nhiều giải pháp cụ thể để triển khai hiệu quả các nghị quyết vào thực tiễn đơn vị.</p>`,
		},
		{
			"hoat-dong-su-doan",
			"Lễ ra quân huấn luyện năm 2025 của Sư đoàn",
			`<p>Sáng ngày 04/11/2025, Sư đoàn long trọng tổ chức Lễ ra quân huấn luyện năm 2025.</p>
<p>Phát biểu chỉ đạo tại buổi lễ, đồng chí Tư lệnh Sư đoàn nhấn mạnh: "Năm 2025 là năm có ý nghĩa đặc biệt quan trọng, toàn Sư đoàn cần tập trung nâng cao chất lượng huấn luyện, sẵn sàng chiến đấu cao, hoàn thành xuất sắc mọi nhiệm vụ được giao".</p>
<p>Sau lễ ra quân, các đơn vị đã nhanh chóng triển khai các nội dung huấn luyện theo kế hoạch.</p>`,
		},
		{
			"hoat-dong-cac-don-vi",
			"Trung đoàn 1 tổ chức diễn tập chiến thuật cấp tiểu đoàn",
			`<p>Trong 3 ngày từ 05-07/11/2025, Trung đoàn 1 đã tổ chức diễn tập chiến thuật cấp tiểu đoàn với chủ đề "Tiểu đoàn bộ binh phòng ngự trong điều kiện địch có ưu thế về hỏa lực".</p>
<p>Diễn tập đã diễn ra sát thực tế chiến đấu, các đơn vị phối hợp chặt chẽ, vận dụng linh hoạt các phương án tác chiến.</p>
<p>Kết quả diễn tập đạt yêu cầu đề ra, góp phần nâng cao năng lực chỉ huy, điều hành của cán bộ và trình độ chiến đấu của đơn vị.</p>`,
		},
		{
			"hoat-dong-cac-don-vi",
			"Trung đoàn 2 đạt danh hiệu Đơn vị Quyết thắng",
			`<p>Tại Hội nghị tổng kết năm 2024, Trung đoàn 2 vinh dự được trao tặng Cờ thi đua của Bộ Quốc phòng và danh hiệu "Đơn vị Quyết thắng".</p>
<p>Đây là thành quả của sự nỗ lực phấn đấu không ngừng của toàn thể cán bộ, chiến sĩ đơn vị trong suốt năm qua.</p>
<p>Trung đoàn đã hoàn thành xuất sắc mọi nhiệm vụ được giao, đạt nhiều thành tích nổi bật trong huấn luyện, sẵn sàng chiến đấu và xây dựng đơn vị.</p>`,
		},
		{
			"hoat-dong-thu-truong",
			"Tư lệnh Sư đoàn kiểm tra công tác huấn luyện tại Trung đoàn 3",
			`<p>Ngày 06/11/2025, đồng chí Đại tá Nguyễn Văn A - Tư lệnh Sư đoàn đã đi kiểm tra công tác huấn luyện tại Trung đoàn 3.</p>
<p>Tại buổi làm việc, đồng chí Tư lệnh đã nghe báo cáo về tình hình thực hiện nhiệm vụ huấn luyện của đơn vị, trực tiếp kiểm tra một số nội dung huấn luyện.</p>
<p>Đồng chí đánh giá cao những kết quả đạt được, đồng thời chỉ đạo đơn vị tiếp tục nỗ lực, khắc phục những tồn tại để nâng cao hơn nữa chất lượng huấn luyện.</p>`,
		},
		{
			"hoat-dong-thu-truong",
			"Chính ủy Sư đoàn dự sinh hoạt Chi bộ Trung đoàn 1",
			`<p>Trong tháng 11/2025, đồng chí Đại tá Trần Văn B - Chính ủy Sư đoàn đã tham dự sinh hoạt Chi bộ Tiểu đoàn 1, Trung đoàn 1.</p>
<p>Tại buổi sinh hoạt, đồng chí Chính ủy đã trao đổi thẳng thắn với cán bộ, đảng viên về công tác xây dựng Đảng, xây dựng đơn vị.</p>
<p>Đồng chí nhấn mạnh vai trò nêu gương của cán bộ, đảng viên trong thực hiện nhiệm vụ và xây dựng đơn vị vững mạnh toàn diện.</p>`,
		},
	}

	for i, activity := range activities {
		if categoryID, ok := categoryIDs[activity.categorySlug]; ok {
			slug := fmt.Sprintf("%s-act-%d", activity.categorySlug, time.Now().Unix()+int64(i))
			summary := "Hoạt động quan trọng của Sư đoàn"

			_, err := db.ExecContext(ctx,
				`INSERT INTO articles (title, slug, summary, content, category_id, author_id, status, is_featured, published_at, created_at, updated_at)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				activity.title, slug, summary, activity.content, categoryID, adminUserID, "published", 0, time.Now(), time.Now(), time.Now())
			if err != nil {
				log.Printf("Failed to create activity '%s': %v", activity.title, err)
			} else {
				fmt.Printf("✓ Created: %s\n", activity.title)
			}
			time.Sleep(10 * time.Millisecond)
		}
	}

	// Create News Articles
	fmt.Println("\n=== Creating News Articles ===")
	articles := []struct {
		categorySlug string
		title        string
		summary      string
		content      string
	}{
		{
			"tin-trong-nuoc",
			"Thủ tướng làm việc với lãnh đạo các Bộ, ngành",
			"Thủ tướng Phạm Minh Chính làm việc về nhiệm vụ cuối năm 2025.",
			`<p>Chiều 07/11/2025, Thủ tướng Phạm Minh Chính chủ trì cuộc họp với lãnh đạo các Bộ, ngành.</p>
<p>Thủ tướng yêu cầu các Bộ trưởng trực tiếp chỉ đạo, điều hành quyết liệt để hoàn thành tốt nhiệm vụ.</p>`,
		},
		{
			"tin-trong-nuoc",
			"Quốc hội thông qua sửa đổi Luật Đất đai",
			"92,5% đại biểu tán thành sửa đổi Luật Đất đai 2013.",
			`<p>Quốc hội thông qua Luật sửa đổi Luật Đất đai 2013 với 462/499 đại biểu tán thành.</p>
<p>Luật có hiệu lực từ 01/01/2026, góp phần hoàn thiện thể chế về đất đai.</p>`,
		},
		{
			"tin-quoc-te",
			"Hội nghị ASEAN lần thứ 43 khai mạc",
			"Hội nghị Cấp cao ASEAN 43 khai mạc tại Jakarta.",
			`<p>Hội nghị ASEAN 43 khai mạc với sự tham dự của lãnh đạo các nước thành viên.</p>
<p>Hội nghị thảo luận kinh tế, an ninh, biến đổi khí hậu trong khu vực.</p>`,
		},
		{
			"tin-quoc-te",
			"LHQ kêu gọi hợp tác về khí hậu",
			"Tổng Thư ký LHQ kêu gọi hợp tác ứng phó biến đổi khí hậu.",
			`<p>Tổng Thư ký LHQ António Guterres kêu gọi tăng cường hợp tác quốc tế về khí hậu.</p>
<p>"Không quốc gia nào giải quyết được vấn đề này một mình", ông nhấn mạnh.</p>`,
		},
		{
			"tin-quan-su",
			"Nga thử tên lửa siêu thanh Zircon",
			"Bộ QP Nga công bố thử nghiệm tên lửa siêu thanh mới.",
			`<p>Nga thử nghiệm thành công tên lửa siêu thanh Zircon từ tàu chiến.</p>
<p>Tên lửa đạt tốc độ gấp 9 lần âm thanh, bắn trúng mục tiêu cách 1.000km.</p>`,
		},
		{
			"tin-quan-su",
			"NATO tăng lực lượng Đông Âu",
			"NATO triển khai thêm 5.000 binh sĩ tại Đông Âu.",
			`<p>NATO tăng cường 5.000 binh sĩ và thiết bị quân sự tại Đông Âu.</p>
<p>Động thái nhằm tăng năng lực phòng thủ tập thể trong khu vực.</p>`,
		},
		{
			"tin-hoat-dong-su-doan",
			"Sư đoàn giành Giải Nhất Hội thi QP toàn dân",
			"Đội tuyển Sư đoàn đạt Giải Nhất cấp Quân khu.",
			`<p>Đội tuyển Sư đoàn giành Giải Nhất Hội thi QP toàn dân cấp Quân khu 2025.</p>
<p>Đội tuyển xuất sắc ở tất cả nội dung thi, đặc biệt kiến thức QP-AN và bắn súng.</p>`,
		},
		{
			"tin-hoat-dong-su-doan",
			"Khai mạc Giải thể thao Quân sự 2025",
			"Sư đoàn khai mạc Giải thể thao với 12 đội tuyển.",
			`<p>Sư đoàn tổ chức Giải thể thao Quân sự 2025 với 12 đơn vị tham gia.</p>
<p>Giải tranh tài 5 môn: bóng đá, bóng chuyền, cầu lông, bắn súng, vượt vật cản.</p>`,
		},
	}

	for i, article := range articles {
		if categoryID, ok := categoryIDs[article.categorySlug]; ok {
			slug := fmt.Sprintf("%s-news-%d", article.categorySlug, time.Now().Unix()+int64(i*10))

			_, err := db.ExecContext(ctx,
				`INSERT INTO articles (title, slug, summary, content, category_id, author_id, status, is_featured, published_at, created_at, updated_at)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				article.title, slug, article.summary, article.content, categoryID, adminUserID, "published", 0, time.Now(), time.Now(), time.Now())
			if err != nil {
				log.Printf("Failed to create article '%s': %v", article.title, err)
			} else {
				fmt.Printf("✓ Created: %s\n", article.title)
			}
			time.Sleep(10 * time.Millisecond)
		}
	}

	fmt.Println("\n✅ Seeding completed!")
}
