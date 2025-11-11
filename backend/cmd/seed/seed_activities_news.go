package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "modernc.org/sqlite"
)

func seedActivitiesAndNews(db *sql.DB) error {
	ctx := context.Background()

	// Categories for Activities (Hoạt động)
	activityCategories := []struct {
		name        string
		slug        string
		description string
		parentID    *int64
	}{
		{"Hoạt động", "hoat-dong", "Hoạt động của Sư đoàn", nil},
	}

	activitySubCategories := []struct {
		name        string
		slug        string
		description string
		parentSlug  string
	}{
		{"Hoạt động của Sư đoàn", "hoat-dong-su-doan", "Các hoạt động của Sư đoàn", "hoat-dong"},
		{"Hoạt động của các đơn vị", "hoat-dong-cac-don-vi", "Hoạt động của các đơn vị trực thuộc", "hoat-dong"},
		{"Hoạt động của Thủ trưởng Sư đoàn", "hoat-dong-thu-truong", "Hoạt động của các đồng chí Thủ trưởng", "hoat-dong"},
	}

	// Categories for News (Tin tức)
	newsCategories := []struct {
		name        string
		slug        string
		description string
		parentID    *int64
	}{
		{"Tin tức", "tin-tuc", "Tin tức trong và ngoài nước", nil},
	}

	newsSubCategories := []struct {
		name        string
		slug        string
		description string
		parentSlug  string
	}{
		{"Tin trong nước", "tin-trong-nuoc", "Tin tức trong nước", "tin-tuc"},
		{"Tin quốc tế", "tin-quoc-te", "Tin tức quốc tế", "tin-tuc"},
		{"Tin quân sự", "tin-quan-su", "Tin tức về quân sự", "tin-tuc"},
		{"Tin hoạt động của Sư đoàn", "tin-hoat-dong-su-doan", "Tin về hoạt động Sư đoàn", "tin-tuc"},
	}

	// Create parent categories
	fmt.Println("=== Creating Parent Categories ===")
	categoryIDs := make(map[string]int64)

	for _, cat := range activityCategories {
		var existingID int64
		err := db.QueryRowContext(ctx, "SELECT id FROM categories WHERE slug = ?", cat.slug).Scan(&existingID)
		if err == nil {
			categoryIDs[cat.slug] = existingID
			fmt.Printf("Category '%s' already exists (ID: %d)\n", cat.name, existingID)
			continue
		}

		result, err := db.ExecContext(ctx,
			`INSERT INTO categories (name, slug, description, parent_id, display_order, created_at, updated_at) 
			 VALUES (?, ?, ?, ?, ?, ?, ?)`,
			cat.name, cat.slug, cat.description, cat.parentID, 10, time.Now(), time.Now())
		if err != nil {
			return fmt.Errorf("failed to create category %s: %v", cat.name, err)
		}
		id, _ := result.LastInsertId()
		categoryIDs[cat.slug] = id
		fmt.Printf("✓ Created category: %s (ID: %d)\n", cat.name, id)
	}

	for _, cat := range newsCategories {
		var existingID int64
		err := db.QueryRowContext(ctx, "SELECT id FROM categories WHERE slug = ?", cat.slug).Scan(&existingID)
		if err == nil {
			categoryIDs[cat.slug] = existingID
			fmt.Printf("Category '%s' already exists (ID: %d)\n", cat.name, existingID)
			continue
		}

		result, err := db.ExecContext(ctx,
			`INSERT INTO categories (name, slug, description, parent_id, display_order, created_at, updated_at) 
			 VALUES (?, ?, ?, ?, ?, ?, ?)`,
			cat.name, cat.slug, cat.description, cat.parentID, 20, time.Now(), time.Now())
		if err != nil {
			return fmt.Errorf("failed to create category %s: %v", cat.name, err)
		}
		id, _ := result.LastInsertId()
		categoryIDs[cat.slug] = id
		fmt.Printf("✓ Created category: %s (ID: %d)\n", cat.name, id)
	}

	// Create sub-categories for Activities
	fmt.Println("\n=== Creating Activity Sub-Categories ===")
	for _, subCat := range activitySubCategories {
		parentID := categoryIDs[subCat.parentSlug]

		var existingID int64
		err := db.QueryRowContext(ctx, "SELECT id FROM categories WHERE slug = ?", subCat.slug).Scan(&existingID)
		if err == nil {
			categoryIDs[subCat.slug] = existingID
			fmt.Printf("Sub-category '%s' already exists (ID: %d)\n", subCat.name, existingID)
			continue
		}

		result, err := db.ExecContext(ctx,
			`INSERT INTO categories (name, slug, description, parent_id, display_order, created_at, updated_at) 
			 VALUES (?, ?, ?, ?, ?, ?, ?)`,
			subCat.name, subCat.slug, subCat.description, parentID, 0, time.Now(), time.Now())
		if err != nil {
			return fmt.Errorf("failed to create sub-category %s: %v", subCat.name, err)
		}
		id, _ := result.LastInsertId()
		categoryIDs[subCat.slug] = id
		fmt.Printf("✓ Created sub-category: %s (ID: %d)\n", subCat.name, id)
	}

	// Create sub-categories for News
	fmt.Println("\n=== Creating News Sub-Categories ===")
	for _, subCat := range newsSubCategories {
		parentID := categoryIDs[subCat.parentSlug]

		var existingID int64
		err := db.QueryRowContext(ctx, "SELECT id FROM categories WHERE slug = ?", subCat.slug).Scan(&existingID)
		if err == nil {
			categoryIDs[subCat.slug] = existingID
			fmt.Printf("Sub-category '%s' already exists (ID: %d)\n", subCat.name, existingID)
			continue
		}

		result, err := db.ExecContext(ctx,
			`INSERT INTO categories (name, slug, description, parent_id, display_order, created_at, updated_at) 
			 VALUES (?, ?, ?, ?, ?, ?, ?)`,
			subCat.name, subCat.slug, subCat.description, parentID, 0, time.Now(), time.Now())
		if err != nil {
			return fmt.Errorf("failed to create sub-category %s: %v", subCat.name, err)
		}
		id, _ := result.LastInsertId()
		categoryIDs[subCat.slug] = id
		fmt.Printf("✓ Created sub-category: %s (ID: %d)\n", subCat.name, id)
	}

	// Get admin user ID
	var adminUserID int64
	err := db.QueryRowContext(ctx, "SELECT id FROM users WHERE email = 'admin@portal365.com' LIMIT 1").Scan(&adminUserID)
	if err != nil {
		return fmt.Errorf("failed to get admin user: %v", err)
	}

	// Create Activities (using Articles table)
	fmt.Println("\n=== Creating Activities (as Articles) ===")
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
		categoryID := categoryIDs[activity.categorySlug]
		slug := fmt.Sprintf("%s-%d-%d", activity.categorySlug, time.Now().Unix(), i)
		summary := activity.content[:100] + "..."

		result, err := db.ExecContext(ctx,
			`INSERT INTO articles (title, slug, summary, content, category_id, author_id, status, is_featured, published_at, created_at, updated_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			activity.title, slug, summary, activity.content, categoryID, adminUserID, "published", 0, time.Now(), time.Now(), time.Now())
		if err != nil {
			log.Printf("Failed to create activity article '%s': %v", activity.title, err)
			continue
		}
		id, _ := result.LastInsertId()
		fmt.Printf("✓ Created activity: %s (ID: %d)\n", activity.title, id)
		time.Sleep(10 * time.Millisecond) // Small delay to ensure unique timestamps
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
			"Thủ tướng Chính phủ làm việc với lãnh đạo các Bộ, ngành",
			"Thủ tướng Phạm Minh Chính đã làm việc với lãnh đạo các Bộ, ngành để triển khai các nhiệm vụ trọng tâm cuối năm 2025.",
			`<p>Chiều ngày 07/11/2025, tại trụ sở Chính phủ, Thủ tướng Phạm Minh Chính đã chủ trì cuộc họp với lãnh đạo các Bộ, ngành về triển khai nhiệm vụ trọng tâm những tháng cuối năm 2025.</p>
<p>Tại cuộc họp, Thủ tướng nhấn mạnh: "Các Bộ, ngành cần tập trung hoàn thành tốt các mục tiêu đề ra, đặc biệt là các chỉ tiêu về tăng trưởng kinh tế, đảm bảo an sinh xã hội".</p>
<p>Thủ tướng yêu cầu các Bộ trưởng trực tiếp chỉ đạo, điều hành quyết liệt, kịp thời tháo gỡ khó khăn, vướng mắc để hoàn thành tốt nhiệm vụ được giao.</p>`,
		},
		{
			"tin-trong-nuoc",
			"Quốc hội thông qua Luật sửa đổi, bổ sung một số điều của Luật Đất đai",
			"Với 92,5% đại biểu tán thành, Quốc hội đã thông qua Luật sửa đổi, bổ sung một số điều của Luật Đất đai 2013.",
			`<p>Sáng ngày 06/11/2025, tiếp tục Kỳ họp thứ 8, Quốc hội đã biểu quyết thông qua Luật sửa đổi, bổ sung một số điều của Luật Đất đai 2013 với 92,5% đại 462/499 biểu tán thành.</p>
<p>Luật có hiệu lực thi hành từ ngày 01/01/2026, gồm 4 điều, sửa đổi, bổ sung 27 điều của Luật Đất đai 2013.</p>
<p>Việc sửa đổi, bổ sung Luật nhằm hoàn thiện thể chế, chính sách về đất đai, tạo hành lang pháp lý để phát triển kinh tế - xã hội bền vững.</p>`,
		},
		{
			"tin-quoc-te",
			"Hội nghị Cấp cao ASEAN lần thứ 43 khai mạc tại Jakarta",
			"Hội nghị Cấp cao ASEAN lần thứ 43 đã chính thức khai mạc tại Jakarta, Indonesia với sự tham dự của lãnh đạo các nước thành viên.",
			`<p>Ngày 07/11/2025, Hội nghị Cấp cao ASEAN lần thứ 43 đã chính thức khai mạc tại Jakarta, Indonesia.</p>
<p>Phát biểu khai mạc, Tổng thống Indonesia nhấn mạnh tầm quan trọng của đoàn kết, hợp tác trong khu vực để cùng vượt qua các thách thức chung.</p>
<p>Hội nghị tập trung thảo luận các vấn đề về kinh tế, an ninh, biến đổi khí hậu và hợp tác phát triển bền vững trong khu vực.</p>`,
		},
		{
			"tin-quoc-te",
			"Liên Hợp Quốc kêu gọi tăng cường hợp tác quốc tế về biến đổi khí hậu",
			"Tổng Thư ký LHQ António Guterres kêu gọi các quốc gia tăng cường hợp tác để ứng phó với biến đổi khí hậu.",
			`<p>Phát biểu tại Hội nghị COP29 về biến đổi khí hậu, Tổng Thư ký Liên Hợp Quốc António Guterres đã kêu gọi các quốc gia tăng cường hợp tác quốc tế.</p>
<p>"Biến đổi khí hậu là thách thức toàn cầu, đòi hỏi hành động toàn cầu. Không có quốc gia nào có thể giải quyết vấn đề này một mình", ông Guterres nhấn mạnh.</p>
<p>Tổng Thư ký kêu gọi các nước phát triển tăng hỗ trợ tài chính, kỹ thuật cho các nước đang phát triển trong công tác ứng phó biến đổi khí hậu.</p>`,
		},
		{
			"tin-quan-su",
			"Nga công bố thử nghiệm thành công tên lửa siêu thanh mới",
			"Bộ Quốc phòng Nga thông báo đã thử nghiệm thành công tên lửa siêu thanh thế hệ mới Zircon từ tàu chiến.",
			`<p>Ngày 06/11/2025, Bộ Quốc phòng Nga thông báo đã thử nghiệm thành công tên lửa siêu thanh Zircon thế hệ mới.</p>
<p>Tên lửa được phóng từ tàu khu trục Admiral Gorshkov ở Biển Trắng, đạt tốc độ gấp 9 lần vận tốc âm thanh và bắn trúng mục tiêu cách 1.000 km.</p>
<p>Đây được coi là bước tiến quan trọng trong việc hiện đại hóa lực lượng hải quân của Nga.</p>`,
		},
		{
			"tin-quan-su",
			"NATO tăng cường triển khai lực lượng tại Đông Âu",
			"NATO quyết định tăng cường triển khai thêm 5.000 binh sĩ và thiết bị quân sự tại các nước Đông Âu.",
			`<p>Tại cuộc họp của Hội đồng Bắc Đại Tây Dương, các nước thành viên NATO đã nhất trí tăng cường triển khai lực lượng tại khu vực Đông Âu.</p>
<p>Theo kế hoạch, khoảng 5.000 binh sĩ cùng thiết bị quân sự hiện đại sẽ được triển khai trong quý I/2026.</p>
<p>Động thái này nhằm tăng cường năng lực phòng thủ tập thể và đảm bảo an ninh cho các nước thành viên trong khu vực.</p>`,
		},
		{
			"tin-hoat-dong-su-doan",
			"Sư đoàn đạt thành tích cao trong Hội thi quốc phòng toàn dân",
			"Đội tuyển của Sư đoàn đã giành Giải Nhất tại Hội thi Quốc phòng toàn dân cấp Quân khu năm 2025.",
			`<p>Kết thúc 3 ngày thi đấu, đội tuyển của Sư đoàn đã xuất sắc giành Giải Nhất toàn đoàn tại Hội thi Quốc phòng toàn dân cấp Quân khu năm 2025.</p>
<p>Đội tuyển đã thể hiện xuất sắc ở tất cả các nội dung thi, đặc biệt là phần thi kiến thức quốc phòng - an ninh và bắn súng.</p>
<p>Thành tích này là kết quả của sự chuẩn bị công phu, tâm huyết của Ban huấn luyện và nỗ lực không ngừng của các thành viên đội tuyển.</p>`,
		},
		{
			"tin-hoat-dong-su-doan",
			"Sư đoàn khai mạc Giải thể thao Quân sự năm 2025",
			"Sáng nay, Sư đoàn đã long trọng khai mạc Giải thể thao Quân sự năm 2025 với sự tham gia của 12 đơn vị.",
			`<p>Sáng ngày 08/11/2025, Sư đoàn long trọng tổ chức Lễ khai mạc Giải thể thao Quân sự năm 2025.</p>
<p>Giải đấu quy tụ 12 đội tuyển của các đơn vị trong toàn Sư đoàn, tranh tài ở 5 môn: bóng đá, bóng chuyền, cầu lông, bắn súng và vượt vật cản.</p>
<p>Phát biểu khai mạc, đồng chí Tư lệnh Sư đoàn nhấn mạnh ý nghĩa của giải đấu trong việc nâng cao thể lực, rèn luyện ý chí cho cán bộ, chiến sĩ.</p>`,
		},
	}

	for i, article := range articles {
		categoryID := categoryIDs[article.categorySlug]
		slug := fmt.Sprintf("%s-%d-%d", article.categorySlug, time.Now().Unix(), i+100)

		result, err := db.ExecContext(ctx,
			`INSERT INTO articles (title, slug, summary, content, category_id, author_id, status, is_featured, published_at, created_at, updated_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			article.title, slug, article.summary, article.content, categoryID, adminUserID, "published", 0, time.Now(), time.Now(), time.Now())
		if err != nil {
			log.Printf("Failed to create article '%s': %v", article.title, err)
			continue
		}
		id, _ := result.LastInsertId()
		fmt.Printf("✓ Created article: %s (ID: %d)\n", article.title, id)
		time.Sleep(10 * time.Millisecond)
	}

	return nil
}
