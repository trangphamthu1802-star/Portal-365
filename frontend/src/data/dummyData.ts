// Dummy data for the military news portal
import dientap1 from '@/assets/images/news/dientap1.jfif';
import news1 from '@/assets/images/news/news1.jpg';
import news3 from '@/assets/images/news/news3.jfif';
import raquanhl from '@/assets/images/news/raquanhl.jfif';

export const dummyArticles = [
  {
    id: 1,
    title: 'Sư đoàn 365 tổ chức diễn tập phòng thủ khu vực năm 2025',
    slug: 'dien-tap-phong-thu-khu-vuc-2025',
    summary: 'Diễn tập quy mô lớn với sự tham gia của các lực lượng thuộc Bộ Tư lệnh Quân khu, nhằm nâng cao khả năng phòng thủ và bảo vệ Tổ quốc.',
    thumbnail_url: dientap1,
    view_count: 12543,
    published_at: '2025-01-15T08:00:00Z',
    category: { name: 'Quốc phòng - An ninh' }
  },
  {
    id: 2,
    title: 'Khai mạc lớp tập huấn chính trị cho cán bộ, chiến sĩ Sư đoàn 365',
    slug: 'tap-huan-chinh-tri-2025',
    summary: 'Lớp tập huấn tập trung nâng cao nhận thức chính trị, bản lĩnh và trách nhiệm của cán bộ, chiến sĩ trong thời kỳ mới.',
    thumbnail_url: news1,
    view_count: 8234,
    published_at: '2025-01-14T10:30:00Z',
    category: { name: 'Chính trị' }
  },
  {
    id: 3,
    title: 'Đơn vị thực hiện tốt công tác hậu cần, kỹ thuật phục vụ huấn luyện',
    slug: 'hau-can-ky-thuat-2025',
    summary: 'Công tác hậu cần được đảm bảo chu đáo, kịp thời, góp phần quan trọng vào chất lượng huấn luyện chiến đấu.',
    thumbnail_url: news3,
    view_count: 6521,
    published_at: '2025-01-13T14:00:00Z',
    category: { name: 'Huấn luyện' }
  },
  {
    id: 4,
    title: 'Ứng dụng công nghệ 4.0 vào công tác quản lý huấn luyện',
    slug: 'ung-dung-cong-nghe-4-0',
    summary: 'Sư đoàn 365 tiên phong áp dụng các công nghệ hiện đại, nâng cao hiệu quả công tác quản lý và huấn luyện.',
    thumbnail_url: raquanhl,
    view_count: 9876,
    published_at: '2025-01-12T09:00:00Z',
    category: { name: 'Khoa học - Công nghệ' }
  },
  {
    id: 5,
    title: 'Chiến sĩ Sư đoàn 365 giúp dân xây dựng nông thôn mới',
    slug: 'giup-dan-xay-dung-nong-thon-moi',
    summary: 'Phát huy tinh thần "Bộ đội Cụ Hồ", các đơn vị tích cực giúp nhân dân phát triển kinh tế, xây dựng nông thôn mới.',
    thumbnail_url: dientap1,
    view_count: 7654,
    published_at: '2025-01-11T11:00:00Z',
    category: { name: 'Đời sống quân đội' }
  },
  {
    id: 6,
    title: 'Hội thao quân sự Sư đoàn 365 năm 2025',
    slug: 'hoi-thao-quan-su-2025',
    summary: 'Các đơn vị thi đấu sôi nổi, quyết liệt với nhiều nội dung chiến thuật, kỹ thuật cao.',
    thumbnail_url: news1,
    view_count: 5432,
    published_at: '2025-01-10T15:30:00Z',
    category: { name: 'Thể thao' }
  },
  {
    id: 7,
    title: 'Sư đoàn tổ chức hội nghị triển khai nhiệm vụ năm 2025',
    slug: 'hoi-nghi-nhiem-vu-2025',
    summary: 'Hội nghị đề ra các nhiệm vụ trọng tâm, giải pháp đột phá để hoàn thành xuất sắc nhiệm vụ được giao.',
    thumbnail_url: news3,
    view_count: 10234,
    published_at: '2025-01-09T08:00:00Z',
    category: { name: 'Chính trị' }
  },
  {
    id: 8,
    title: 'Nâng cao chất lượng công tác đào tạo, huấn luyện chiến đấu',
    slug: 'dao-tao-huan-luyen-chat-luong',
    summary: 'Các đơn vị tập trung đổi mới phương pháp, nội dung huấn luyện, sát với thực tiễn chiến đấu.',
    thumbnail_url: raquanhl,
    view_count: 8765,
    published_at: '2025-01-08T13:00:00Z',
    category: { name: 'Huấn luyện' }
  },
  {
    id: 9,
    title: 'Kỷ niệm 80 năm Ngày thành lập Quân đội nhân dân Việt Nam',
    slug: 'ky-niem-80-nam-quan-doi',
    summary: 'Các hoạt động kỷ niệm diễn ra trọng thể, thể hiện lòng tự hào về truyền thống vẻ vang của Quân đội nhân dân.',
    thumbnail_url: dientap1,
    view_count: 15678,
    published_at: '2025-01-07T10:00:00Z',
    category: { name: 'Chính trị' }
  },
  {
    id: 10,
    title: 'Chiến sĩ mới hòa nhập nhanh với môi trường quân đội',
    slug: 'chien-si-moi-hoa-nhap',
    summary: 'Các hoạt động giáo dục, huấn luyện giúp chiến sĩ mới nhanh chóng thích nghi với cuộc sống quân ngũ.',
    thumbnail_url: news1,
    view_count: 6234,
    published_at: '2025-01-06T16:00:00Z',
    category: { name: 'Đời sống quân đội' }
  },
  {
    id: 11,
    title: 'Tăng cường hợp tác quốc phòng với các nước trong khu vực',
    slug: 'hop-tac-quoc-phong-khu-vuc',
    summary: 'Các hoạt động hợp tác song phương, đa phương góp phần tăng cường quan hệ hữu nghị, củng cố hòa bình khu vực.',
    thumbnail_url: news3,
    view_count: 7890,
    published_at: '2025-01-05T09:30:00Z',
    category: { name: 'Quốc tế' }
  },
  {
    id: 12,
    title: 'Đổi mới công tác tuyên truyền, giáo dục chính trị tư tưởng',
    slug: 'doi-moi-tuyen-truyen-giao-duc',
    summary: 'Đa dạng hình thức tuyên truyền, gần gũi với cán bộ, chiến sĩ, nâng cao nhận thức và tinh thần trách nhiệm.',
    thumbnail_url: raquanhl,
    view_count: 5678,
    published_at: '2025-01-04T11:00:00Z',
    category: { name: 'Chính trị' }
  },
  {
    id: 13,
    title: 'Triển khai ứng dụng quản lý huấn luyện trên nền tảng di động',
    slug: 'ung-dung-quan-ly-huan-luyen',
    summary: 'Ứng dụng giúp cán bộ, chiến sĩ tra cứu, cập nhật thông tin huấn luyện mọi lúc, mọi nơi.',
    thumbnail_url: dientap1,
    view_count: 8900,
    published_at: '2025-01-03T14:30:00Z',
    category: { name: 'Khoa học - Công nghệ' }
  },
  {
    id: 14,
    title: 'Đơn vị hoàn thành xuất sắc nhiệm vụ tuần tra, bảo vệ biên giới',
    slug: 'tuan-tra-bao-ve-bien-gioi',
    summary: 'Các chiến sĩ kiên quyết, bản lĩnh trong mọi tình huống, góp phần giữ vững an ninh biên giới Tổ quốc.',
    thumbnail_url: news1,
    view_count: 11234,
    published_at: '2025-01-02T08:00:00Z',
    category: { name: 'Quốc phòng - An ninh' }
  },
  {
    id: 15,
    title: 'Giao lưu thể thao quần chúng trong doanh trại',
    slug: 'giao-luu-the-thao-quan-chung',
    summary: 'Các hoạt động thể thao phong phú, sôi nổi góp phần nâng cao thể lực, tăng cường đoàn kết nội bộ.',
    thumbnail_url: news3,
    view_count: 4567,
    published_at: '2025-01-01T10:00:00Z',
    category: { name: 'Thể thao' }
  },
  {
    id: 16,
    title: 'Nấu ăn tập thể: Bữa cơm đầm ấm tình đồng đội',
    slug: 'bua-com-tap-the',
    summary: 'Không chỉ là bữa ăn, đây còn là dịp để các chiến sĩ chia sẻ, gắn kết và tạo nên sức mạnh tập thể.',
    thumbnail_url: raquanhl,
    view_count: 6789,
    published_at: '2024-12-31T12:00:00Z',
    category: { name: 'Đời sống quân đội' }
  },
  {
    id: 17,
    title: 'Diễn tập cứu hộ, cứu nạn phòng chống thiên tai',
    slug: 'dien-tap-cuu-ho-cuu-nan',
    summary: 'Lực lượng sẵn sàng ứng phó mọi tình huống thiên tai, bảo vệ tính mạng và tài sản của nhân dân.',
    thumbnail_url: dientap1,
    view_count: 9012,
    published_at: '2024-12-30T09:00:00Z',
    category: { name: 'Huấn luyện' }
  },
  {
    id: 18,
    title: 'Nghiên cứu, ứng dụng vũ khí, khí tài hiện đại',
    slug: 'nghien-cuu-vu-khi-hien-dai',
    summary: 'Đơn vị tích cực nghiên cứu, làm chủ công nghệ, khai thác tối đa hiệu quả vũ khí, trang bị.',
    thumbnail_url: news1,
    view_count: 10567,
    published_at: '2024-12-29T13:30:00Z',
    category: { name: 'Khoa học - Công nghệ' }
  }
];

export const latestNews = [
  {
    id: 101,
    title: 'Thông báo về kế hoạch diễn tập chiến thuật cấp trung đoàn',
    slug: 'thong-bao-dien-tap-chien-thuat',
    summary: 'Diễn tập dự kiến diễn ra từ ngày 20-25/01/2025 tại khu vực huấn luyện Trung đoàn 1.',
    thumbnail_url: news3,
    view_count: 3456,
    published_at: '2025-01-15T16:00:00Z',
    category: { name: 'Thông báo' }
  },
  {
    id: 102,
    title: 'Triển khai công tác kiểm tra, giám sát quý I/2025',
    slug: 'kiem-tra-giam-sat-quy-1',
    summary: 'Tập trung kiểm tra việc thực hiện nhiệm vụ chính trị, công tác xây dựng Đảng và công tác quân sự.',
    thumbnail_url: raquanhl,
    view_count: 2890,
    published_at: '2025-01-15T15:00:00Z',
    category: { name: 'Chính trị' }
  },
  {
    id: 103,
    title: 'Hướng dẫn thực hiện nhiệm vụ sẵn sàng chiến đấu',
    slug: 'huong-dan-san-sang-chien-dau',
    summary: 'Các đơn vị cần duy trì nghiêm chế độ trực sẵn sàng chiến đấu, đảm bảo ứng phó kịp thời mọi tình huống.',
    thumbnail_url: dientap1,
    view_count: 4123,
    published_at: '2025-01-15T14:00:00Z',
    category: { name: 'Quốc phòng - An ninh' }
  },
  {
    id: 104,
    title: 'Kế hoạch tập huấn chính trị cho cán bộ cơ sở tháng 2/2025',
    slug: 'tap-huan-chinh-tri-thang-2',
    summary: 'Lớp tập huấn tập trung nâng cao năng lực lãnh đạo, chỉ đạo và tổ chức thực hiện nhiệm vụ.',
    thumbnail_url: news1,
    view_count: 2567,
    published_at: '2025-01-15T13:00:00Z',
    category: { name: 'Chính trị' }
  },
  {
    id: 105,
    title: 'Thông báo nghỉ tết Nguyên đán Ất Tỵ 2025',
    slug: 'thong-bao-nghi-tet-2025',
    summary: 'Đơn vị nghỉ tết từ ngày 26/01 đến hết 02/02/2025. Các đơn vị duy trì lực lượng trực chiến đấu.',
    thumbnail_url: news3,
    view_count: 5678,
    published_at: '2025-01-15T12:00:00Z',
    category: { name: 'Thông báo' }
  },
  {
    id: 106,
    title: 'Tổng kết công tác xây dựng Đảng năm 2024',
    slug: 'tong-ket-xay-dung-dang-2024',
    summary: 'Đánh giá toàn diện kết quả, rút ra bài học kinh nghiệm, định hướng nhiệm vụ năm 2025.',
    thumbnail_url: raquanhl,
    view_count: 3890,
    published_at: '2025-01-15T11:00:00Z',
    category: { name: 'Chính trị' }
  }
];
