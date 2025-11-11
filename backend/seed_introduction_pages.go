package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "portal.db")
	if err != nil {
		log.Fatal("Failed to open database:", err)
	}
	defer db.Close()

	now := time.Now()

	pages := []struct {
		Key       string
		Title     string
		Content   string
		Group     string
		SortOrder int
	}{
		{
			Key:       "lich-su-truyen-thong",
			Title:     "Lịch sử truyền thống",
			Group:     "introduction",
			SortOrder: 1,
			Content: `
<h2>Quá trình hình thành và phát triển</h2>
<p>Sư đoàn 365 - Đơn vị Anh hùng Lực lượng vũ trang nhân dân, được thành lập từ những ngày đầu kháng chiến chống thực dân Pháp. Trải qua nhiều giai đoạn lịch sử, đơn vị đã không ngừng lớn mạnh và trưởng thành.</p>

<h3>Giai đoạn 1945-1954: Kháng chiến chống Pháp</h3>
<p>Trong cuộc kháng chiến chống thực dân Pháp xâm lược, tiền thân của Sư đoàn đã tham gia nhiều trận đánh lớn, góp phần quan trọng vào thắng lợi của cách mạng Việt Nam.</p>

<h3>Giai đoạn 1954-1975: Kháng chiến chống Mỹ</h3>
<p>Trong cuộc kháng chiến chống Mỹ cứu nước, Sư đoàn 365 đã chiến đấu anh dũng, lập nhiều chiến công xuất sắc, được Đảng, Nhà nước tặng thưởng nhiều huân chương cao quý.</p>

<blockquote>
"Sư đoàn 365 là biểu tượng của lòng dũng cảm, tinh thần chiến đấu kiên cường và sự hy sinh quên mình vì Tổ quốc."
</blockquote>

<h3>Giai đoạn 1975-1979: Bảo vệ biên giới Tổ quốc</h3>
<p>Sau giải phóng miền Nam, Sư đoàn tiếp tục thực hiện nhiệm vụ bảo vệ biên giới phía Bắc của Tổ quốc, chiến đấu anh dũng trong các chiến dịch bảo vệ chủ quyền biên giới.</p>

<h3>Giai đoạn từ 1980 đến nay: Xây dựng và phát triển</h3>
<p>Trong thời kỳ đổi mới đất nước, Sư đoàn không ngừng nâng cao chất lượng tổng hợp, sức mạnh chiến đấu, ứng dụng khoa học công nghệ hiện đại vào huấn luyện và sẵn sàng chiến đấu.</p>

<h2>Truyền thống vẻ vang</h2>
<ul>
<li><strong>Đoàn kết:</strong> Đoàn kết nội bộ vững chắc, đoàn kết quân dân, đoàn kết với lực lượng vũ trang các địa phương.</li>
<li><strong>Kỷ luật:</strong> Nghiêm túc chấp hành mệnh lệnh, kỷ luật quân đội nghiêm minh.</li>
<li><strong>Sáng tạo:</strong> Luôn chủ động, sáng tạo trong huấn luyện, sẵn sàng chiến đấu và công tác.</li>
<li><strong>Quyết thắng:</strong> Quyết tâm hoàn thành xuất sắc mọi nhiệm vụ được giao.</li>
</ul>
`,
		},
		{
			Key:       "to-chuc-don-vi",
			Title:     "Tổ chức đơn vị",
			Group:     "introduction",
			SortOrder: 2,
			Content: `
<h2>Cơ cấu tổ chức</h2>
<p>Sư đoàn 365 có cơ cấu tổ chức chặt chẽ, khoa học, đáp ứng yêu cầu nhiệm vụ trong tình hình mới. Đơn vị được tổ chức theo mô hình sư đoàn bộ binh hiện đại, gồm các cơ quan, đơn vị trực thuộc.</p>

<h3>Cơ quan chỉ huy</h3>
<ul>
<li><strong>Chỉ huy trưởng Sư đoàn:</strong> Người chỉ huy cao nhất, chịu tr책nhiệm toàn diện về mọi mặt công tác của đơn vị.</li>
<li><strong>Chính ủy Sư đoàn:</strong> Phụ trách công tác Đảng, công tác chính trị, bảo đảm chính trị cho mọi hoạt động của đơn vị.</li>
<li><strong>Các Phó chỉ huy trưởng:</strong> Hỗ trợ Chỉ huy trưởng chỉ đạo các mặt công tác chuyên môn.</li>
</ul>

<h3>Các cơ quan tham mưu</h3>
<ul>
<li><strong>Cơ quan Tham mưu:</strong> Tham mưu về tác chiến, huấn luyện, sẵn sàng chiến đấu.</li>
<li><strong>Cơ quan Chính trị:</strong> Tham mưu về công tác Đảng, công tác chính trị, giáo dục chính trị.</li>
<li><strong>Cơ quan Hậu cần:</strong> Tham mưu về công tác hậu cần, bảo đảm vật chất cho đơn vị.</li>
<li><strong>Cơ quan Kỹ thuật:</strong> Tham mưu về công tác kỹ thuật, vũ khí trang bị.</li>
</ul>

<h3>Các đơn vị trực thuộc</h3>
<p>Sư đoàn có 15+ đơn vị trực thuộc bao gồm:</p>
<ul>
<li>Các trung đoàn bộ binh</li>
<li>Trung đoàn pháo binh</li>
<li>Trung đoàn phòng không</li>
<li>Các tiểu đoàn chuyên môn, kỹ thuật</li>
<li>Các đội, phân đội hỗ trợ</li>
</ul>

<h2>Quy mô lực lượng</h2>
<p>Hiện nay, Sư đoàn có quy mô <strong>hơn 2.500 cán bộ, chiến sĩ</strong>, được trang bị đầy đủ vũ khí, phương tiện hiện đại, sẵn sàng thực hiện mọi nhiệm vụ được giao.</p>

<h2>Phương châm xây dựng</h2>
<blockquote>
"Xây dựng đơn vị vững mạnh toàn diện, chính quy, tinh nhuệ, từng bước hiện đại, làm nòng cốt trong xây dựng khu vực phòng thủ."
</blockquote>
`,
		},
		{
			Key:       "lanh-dao-su-doan",
			Title:     "Lãnh đạo Sư đoàn",
			Group:     "introduction",
			SortOrder: 3,
			Content: `
<h2>Ban Chỉ huy Sư đoàn</h2>
<p>Đội ngũ lãnh đạo, chỉ huy của Sư đoàn 365 gồm những cán bộ ưu tú, có trình độ chuyên môn cao, kinh nghiệm thực tiễn phong phú, tâm huyết với nghề nghiệp.</p>

<h3>Chỉ huy trưởng Sư đoàn</h3>
<p>Chịu trách nhiệm toàn diện về mọi mặt hoạt động của Sư đoàn, chỉ huy trực tiếp công tác huấn luyện, sẵn sàng chiến đấu và các hoạt động tác chiến của đơn vị.</p>

<h3>Chính ủy Sư đoàn</h3>
<p>Chịu trách nhiệm trước Đảng ủy và cấp trên về công tác xây dựng Đảng, công tác chính trị trong toàn Sư đoàn. Bảo đảm chính trị tuyệt đối cho mọi hoạt động của đơn vị.</p>

<h3>Phó Chỉ huy trưởng</h3>
<p>Giúp việc cho Chỉ huy trưởng trong việc chỉ đạo, điều hành các mặt công tác chuyên môn theo phân công.</p>

<h3>Phó Chính ủy</h3>
<p>Giúp việc cho Chính ủy trong công tác Đảng, công tác chính trị, công tác quần chúng và các phong trào thi đua.</p>

<h2>Các cơ quan chuyên môn</h2>
<ul>
<li><strong>Tham mưu trưởng:</strong> Tham mưu trực tiếp cho Chỉ huy trưởng về tác chiến, huấn luyện.</li>
<li><strong>Chủ nhiệm Chính trị:</strong> Tham mưu cho Chính ủy về công tác Đảng, công tác chính trị.</li>
<li><strong>Cục trưởng Hậu cần:</strong> Tham mưu về công tác hậu cần, kỹ thuật.</li>
<li><strong>Cục trưởng Kỹ thuật:</strong> Tham mưu về vũ khí trang bị, kỹ thuật.</li>
</ul>

<h2>Phong cách lãnh đạo</h2>
<p>Ban Chỉ huy Sư đoàn luôn phát huy tinh thần đoàn kết, dân chủ, gương mẫu, trách nhiệm cao trong lãnh đạo, chỉ đạo. Luôn gần gũi, sát cánh cùng cán bộ, chiến sĩ, chia sẻ khó khăn, động viên tinh thần.</p>

<blockquote>
"Người chỉ huy giỏi không chỉ là người ra lệnh mà còn là người đi đầu, gương mẫu, truyền cảm hứng cho toàn thể cán bộ, chiến sĩ."
</blockquote>

<h2>Cam kết</h2>
<p>Ban Chỉ huy Sư đoàn cam kết luôn lãnh đạo, chỉ đạo toàn diện, xây dựng đơn vị vững mạnh, hoàn thành xuất sắc mọi nhiệm vụ được giao, xứng đáng với niềm tin của Đảng, Nhà nước và nhân dân.</p>
`,
		},
		{
			Key:       "thanh-tich-don-vi",
			Title:     "Thành tích đơn vị",
			Group:     "introduction",
			SortOrder: 4,
			Content: `
<h2>Những thành tích nổi bật</h2>
<p>Trong suốt lịch sử vẻ vang của mình, Sư đoàn 365 đã lập được nhiều thành tích xuất sắc, được Đảng, Nhà nước và nhân dân ghi nhận, tôn vinh.</p>

<h3>Danh hiệu cao quý</h3>
<ul>
<li><strong>Danh hiệu Anh hùng Lực lượng vũ trang nhân dân:</strong> Vinh dự cao quý nhất của đơn vị, được trao tặng năm 1975 vì những chiến công xuất sắc trong kháng chiến.</li>
<li><strong>Huân chương Sao Vàng:</strong> Huân chương cao quý nhất của Nhà nước, ghi nhận những cống hiến đặc biệt của đơn vị.</li>
<li><strong>Huân chương Quân công hạng Nhất:</strong> Nhiều lần được tặng thưởng vì thành tích xuất sắc trong chiến đấu và huấn luyện.</li>
<li><strong>Huân chương Bảo vệ Tổ quốc:</strong> Ghi nhận những đóng góp trong sự nghiệp bảo vệ Tổ quốc Việt Nam xã hội chủ nghĩa.</li>
</ul>

<h3>Tập thể và cá nhân tiêu biểu</h3>
<table>
<thead>
<tr>
<th>Loại hình</th>
<th>Số lượng</th>
<th>Ghi chú</th>
</tr>
</thead>
<tbody>
<tr>
<td>Đơn vị Anh hùng LLVTND</td>
<td>1</td>
<td>Toàn Sư đoàn</td>
</tr>
<tr>
<td>Anh hùng LLVTND (cá nhân)</td>
<td>15+</td>
<td>Các thời kỳ</td>
</tr>
<tr>
<td>Huân chương các loại</td>
<td>50+</td>
<td>Tập thể và cá nhân</td>
</tr>
<tr>
<td>Danh hiệu Chiến sĩ thi đua</td>
<td>500+</td>
<td>Các cấp</td>
</tr>
<tr>
<td>Bằng khen các cấp</td>
<td>1000+</td>
<td>Tập thể và cá nhân</td>
</tr>
</tbody>
</table>

<h2>Dấu mốc lịch sử</h2>

<h3>1954 - Chiến thắng Điện Biên Phủ</h3>
<p>Các đơn vị tiền thân tham gia chiến dịch Điện Biên Phủ lịch sử, góp phần làm nên thắng lợi "chấn động địa cầu".</p>

<h3>1975 - Giải phóng miền Nam</h3>
<p>Tham gia chiến dịch Hồ Chí Minh lịch sử, góp phần giải phóng hoàn toàn miền Nam, thống nhất đất nước.</p>

<h3>1979 - Chiến tranh bảo vệ biên giới</h3>
<p>Chiến đấu anh dũng tại chiến trường biên giới phía Bắc, bảo vệ vững chắc chủ quyền lãnh thổ Tổ quốc.</p>

<h3>2000 - Đổi mới, hiện đại hóa</h3>
<p>Tiên phong trong việc ứng dụng khoa học công nghệ, hiện đại hóa trang bị, nâng cao sức mạnh chiến đấu.</p>

<h3>2020 - Xây dựng đơn vị mẫu mực</h3>
<p>Được Bộ Quốc phòng công nhận là đơn vị điển hình tiên tiến toàn diện.</p>

<h2>Phong trào thi đua</h2>
<p>Sư đoàn luôn duy trì và phát triển các phong trào thi đua yêu nước, thi đua quyết thắng, tạo không khí thi đua sôi nổi trong toàn đơn vị:</p>

<ul>
<li>"Quyết thắng 365" - Phong trào thi đua truyền thống của Sư đoàn</li>
<li>"Đơn vị vững mạnh toàn diện" - Phong trào xây dựng đơn vị</li>
<li>"Cán bộ, chiến sĩ rèn luyện 5 tốt" - Phong trào xây dựng con người</li>
<li>"Huấn luyện giỏi, sẵn sàng chiến đấu" - Phong trào nâng cao chất lượng</li>
</ul>

<blockquote>
"Vinh quang là của tập thể, là kết quả của sự đoàn kết, hy sinh và cống hiến của từng cán bộ, chiến sĩ Sư đoàn 365."
</blockquote>

<h2>Cam kết tương lai</h2>
<p>Thừa hưởng truyền thống vẻ vang, Sư đoàn 365 cam kết tiếp tục phấn đấu, rèn luyện, nâng cao chất lượng tổng hợp và sức mạnh chiến đấu, sẵn sàng nhận và hoàn thành xuất sắc mọi nhiệm vụ mà Đảng, Nhà nước và nhân dân giao phó.</p>
`,
		},
	}

	for _, p := range pages {
		// Check if page already exists
		var exists int
		err := db.QueryRow("SELECT COUNT(*) FROM pages WHERE `key` = ?", p.Key).Scan(&exists)
		if err != nil {
			log.Printf("Error checking page %s: %v", p.Key, err)
			continue
		}

		if exists > 0 {
			// Update existing page
			_, err = db.Exec(`
				UPDATE pages 
				SET title = ?, content = ?, group_name = ?, sort_order = ?, status = 'published', is_active = 1, created_at = ?
				WHERE `+"`key`"+` = ?
			`, p.Title, p.Content, p.Group, p.SortOrder, now, p.Key)
			if err != nil {
				log.Printf("Error updating page %s: %v", p.Key, err)
			} else {
				fmt.Printf("✓ Đã cập nhật: %s\n", p.Title)
			}
		} else {
			// Insert new page
			result, err := db.Exec(`
				INSERT INTO pages (`+"`key`"+`, slug, title, content, group_name, sort_order, status, is_active, created_at)
				VALUES (?, ?, ?, ?, ?, ?, 'published', 1, ?)
			`, p.Key, p.Key, p.Title, p.Content, p.Group, p.SortOrder, now)
			if err != nil {
				log.Printf("❌ Error inserting page %s: %v", p.Key, err)
			} else {
				id, _ := result.LastInsertId()
				fmt.Printf("✓ Đã tạo mới: %s (ID=%d)\n", p.Title, id)
			}
		}
	}

	fmt.Println("\n✅ Hoàn thành seed dữ liệu cho 4 trang giới thiệu!")
}
