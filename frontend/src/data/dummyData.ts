// Dummy data for the military news portal
import dientap1 from '@/assets/images/news/dientap1.jfif';
import duongKhaiMac from '@/assets/images/news/10-2-a-duong-khai-mac.jpg';
import news1 from '@/assets/images/news/news1.jpg';
import news3 from '@/assets/images/news/news3.jfif';
import raquanhl from '@/assets/images/news/raquanhl.jfif';

// Temporary placeholders for missing images
const begiangkienthuc = news1;
const hoithaoquocphong = dientap1;
const xuanyeuthuong = news3;
const hoinghiasean = raquanhl;

export const dummyArticles = [
  {
    id: 1,
    title: 'Sư đoàn 365 tổ chức diễn tập phòng thủ khu vực năm 2025',
    slug: 'dien-tap-phong-thu-khu-vuc-2025',
    summary: 'Diễn tập quy mô lớn với sự tham gia của các lực lượng thuộc Bộ Tư lệnh Quân khu, nhằm nâng cao khả năng phòng thủ và bảo vệ Tổ quốc.',
    thumbnail_url: duongKhaiMac,
    view_count: 12543,
    published_at: '2025-01-15T08:00:00Z',
    category: { name: 'Tin đơn vị' }
  },
  {
    id: 2,
    title: 'Khai mạc lớp tập huấn chính trị cho cán bộ, chiến sĩ Sư đoàn 365',
    slug: 'tap-huan-chinh-tri-2025',
    summary: 'Lớp tập huấn tập trung nâng cao nhận thức chính trị, bản lĩnh và trách nhiệm của cán bộ, chiến sĩ trong thời kỳ mới.',
    thumbnail_url: news1,
    view_count: 8234,
    published_at: '2025-01-14T10:30:00Z',
    category: { name: 'Tin đơn vị' }
  },
  {
    id: 3,
    title: 'Đơn vị thực hiện tốt công tác hậu cần, kỹ thuật phục vụ huấn luyện',
    slug: 'hau-can-ky-thuat-2025',
    summary: 'Công tác hậu cần được đảm bảo chu đáo, kịp thời, góp phần quan trọng vào chất lượng huấn luyện chiến đấu.',
    thumbnail_url: news3,
    view_count: 6521,
    published_at: '2025-01-13T14:00:00Z',
    category: { name: 'Tin đơn vị' }
  },
  {
    id: 4,
    title: 'Ứng dụng công nghệ 4.0 vào công tác quản lý huấn luyện',
    slug: 'ung-dung-cong-nghe-4-0',
    summary: 'Sư đoàn 365 tiên phong áp dụng các công nghệ hiện đại, nâng cao hiệu quả công tác quản lý và huấn luyện.',
    thumbnail_url: raquanhl,
    view_count: 9876,
    published_at: '2025-01-12T09:00:00Z',
    category: { name: 'Tin đơn vị' }
  },
  {
    id: 5,
    title: 'Chiến sĩ Sư đoàn 365 giúp dân xây dựng nông thôn mới',
    slug: 'giup-dan-xay-dung-nong-thon-moi',
    summary: 'Phát huy tinh thần "Bộ đội Cụ Hồ", các đơn vị tích cực giúp nhân dân phát triển kinh tế, xây dựng nông thôn mới.',
    thumbnail_url: dientap1,
    view_count: 7654,
    published_at: '2025-01-11T11:00:00Z',
    category: { name: 'Tin trong nước' }
  },
  {
    id: 6,
    title: 'Hội thao quân sự Sư đoàn 365 năm 2025',
    slug: 'hoi-thao-quan-su-2025',
    summary: 'Các đơn vị thi đấu sôi nổi, quyết liệt với nhiều nội dung chiến thuật, kỹ thuật cao.',
    thumbnail_url: news1,
    view_count: 5432,
    published_at: '2025-01-10T15:30:00Z',
    category: { name: 'Tin quân sự' }
  },
  {
    id: 7,
    title: 'Sư đoàn tổ chức hội nghị triển khai nhiệm vụ năm 2025',
    slug: 'hoi-nghi-nhiem-vu-2025',
    summary: 'Hội nghị đề ra các nhiệm vụ trọng tâm, giải pháp đột phá để hoàn thành xuất sắc nhiệm vụ được giao.',
    thumbnail_url: news3,
    view_count: 10234,
    published_at: '2025-01-09T08:00:00Z',
    category: { name: 'Tin đơn vị' }
  },
  {
    id: 8,
    title: 'Nâng cao chất lượng công tác đào tạo, huấn luyện chiến đấu',
    slug: 'dao-tao-huan-luyen-chat-luong',
    summary: 'Các đơn vị tập trung đổi mới phương pháp, nội dung huấn luyện, sát với thực tiễn chiến đấu.',
    thumbnail_url: raquanhl,
    view_count: 8765,
    published_at: '2025-01-08T13:00:00Z',
    category: { name: 'Tin quân sự' }
  },
  {
    id: 9,
    title: 'Kỷ niệm 80 năm Ngày thành lập Quân đội nhân dân Việt Nam',
    slug: 'ky-niem-80-nam-quan-doi',
    summary: 'Các hoạt động kỷ niệm diễn ra trọng thể, thể hiện lòng tự hào về truyền thống vẻ vang của Quân đội nhân dân.',
    thumbnail_url: dientap1,
    view_count: 15678,
    published_at: '2025-01-07T10:00:00Z',
    category: { name: 'Tin trong nước' }
  },
  {
    id: 10,
    title: 'Chiến sĩ mới hòa nhập nhanh với môi trường quân đội',
    slug: 'chien-si-moi-hoa-nhap',
    summary: 'Các hoạt động giáo dục, huấn luyện giúp chiến sĩ mới nhanh chóng thích nghi với cuộc sống quân ngũ.',
    thumbnail_url: news1,
    view_count: 6234,
    published_at: '2025-01-06T16:00:00Z',
    category: { name: 'Tin đơn vị' }
  },
  {
    id: 11,
    title: 'Tăng cường hợp tác quốc phòng với các nước trong khu vực',
    slug: 'hop-tac-quoc-phong-khu-vuc',
    summary: 'Các hoạt động hợp tác song phương, đa phương góp phần tăng cường quan hệ hữu nghị, củng cố hòa bình khu vực.',
    thumbnail_url: news3,
    view_count: 7890,
    published_at: '2025-01-05T09:30:00Z',
    category: { name: 'Tin quốc tế' }
  },
  {
    id: 12,
    title: 'Đổi mới công tác tuyên truyền, giáo dục chính trị tư tưởng',
    slug: 'doi-moi-tuyen-truyen-giao-duc',
    summary: 'Đa dạng hình thức tuyên truyền, gần gũi với cán bộ, chiến sĩ, nâng cao nhận thức và tinh thần trách nhiệm.',
    thumbnail_url: raquanhl,
    view_count: 5678,
    published_at: '2025-01-04T11:00:00Z',
    category: { name: 'Tin trong nước' }
  },
  {
    id: 13,
    title: 'Triển khai ứng dụng quản lý huấn luyện trên nền tảng di động',
    slug: 'ung-dung-quan-ly-huan-luyen',
    summary: 'Ứng dụng giúp cán bộ, chiến sĩ tra cứu, cập nhật thông tin huấn luyện mọi lúc, mọi nơi.',
    thumbnail_url: dientap1,
    view_count: 8900,
    published_at: '2025-01-03T14:30:00Z',
    category: { name: 'Tin quân sự' }
  },
  {
    id: 14,
    title: 'Đơn vị hoàn thành xuất sắc nhiệm vụ tuần tra, bảo vệ biên giới',
    slug: 'tuan-tra-bao-ve-bien-gioi',
    summary: 'Các chiến sĩ kiên quyết, bản lĩnh trong mọi tình huống, góp phần giữ vững an ninh biên giới Tổ quốc.',
    thumbnail_url: news1,
    view_count: 11234,
    published_at: '2025-01-02T08:00:00Z',
    category: { name: 'Tin đơn vị' }
  },
  {
    id: 15,
    title: 'Hội nghị quốc phòng ASEAN thảo luận vấn đề an ninh khu vực',
    slug: 'hoi-nghi-quoc-phong-asean',
    summary: 'Các quốc gia trao đổi kinh nghiệm, cam kết hợp tác chặt chẽ vì hòa bình, ổn định khu vực.',
    thumbnail_url: news3,
    view_count: 4567,
    published_at: '2025-01-01T10:00:00Z',
    category: { name: 'Tin quốc tế' }
  },
  {
    id: 16,
    title: 'Nấu ăn tập thể: Bữa cơm đầm ấm tình đồng đội',
    slug: 'bua-com-tap-the',
    summary: 'Không chỉ là bữa ăn, đây còn là dịp để các chiến sĩ chia sẻ, gắn kết và tạo nên sức mạnh tập thể.',
    thumbnail_url: raquanhl,
    view_count: 6789,
    published_at: '2024-12-31T12:00:00Z',
    category: { name: 'Tin đơn vị' }
  },
  {
    id: 17,
    title: 'Diễn tập cứu hộ, cứu nạn phòng chống thiên tai',
    slug: 'dien-tap-cuu-ho-cuu-nan',
    summary: 'Lực lượng sẵn sàng ứng phó mọi tình huống thiên tai, bảo vệ tính mạng và tài sản của nhân dân.',
    thumbnail_url: dientap1,
    view_count: 9012,
    published_at: '2024-12-30T09:00:00Z',
    category: { name: 'Tin quân sự' }
  },
  {
    id: 18,
    title: 'Nghiên cứu, ứng dụng vũ khí, khí tài hiện đại',
    slug: 'nghien-cuu-vu-khi-hien-dai',
    summary: 'Đơn vị tích cực nghiên cứu, làm chủ công nghệ, khai thác tối đa hiệu quả vũ khí, trang bị.',
    thumbnail_url: news1,
    view_count: 10567,
    published_at: '2024-12-29T13:30:00Z',
    category: { name: 'Tin quân sự' }
  },
  {
    id: 19,
    title: 'Tổng thống Mỹ công bố chính sách quốc phòng mới',
    slug: 'chinh-sach-quoc-phong-my',
    summary: 'Chính sách tập trung tăng cường năng lực răn đe, đối phó với các thách thức an ninh toàn cầu.',
    thumbnail_url: news3,
    view_count: 8234,
    published_at: '2024-12-28T10:00:00Z',
    category: { name: 'Tin quốc tế' }
  },
  {
    id: 20,
    title: 'Nga triển khai hệ thống phòng thủ tên lửa mới',
    slug: 'nga-phong-thu-ten-lua',
    summary: 'Hệ thống S-500 được đánh giá có khả năng đánh chặn mọi loại mục tiêu trên không.',
    thumbnail_url: raquanhl,
    view_count: 9123,
    published_at: '2024-12-27T14:30:00Z',
    category: { name: 'Tin quốc tế' }
  },
  {
    id: 21,
    title: 'Quốc hội thông qua Luật Quốc phòng sửa đổi',
    slug: 'luat-quoc-phong-sua-doi',
    summary: 'Luật bổ sung nhiều quy định quan trọng, phù hợp với tình hình mới.',
    thumbnail_url: dientap1,
    view_count: 6789,
    published_at: '2024-12-26T09:00:00Z',
    category: { name: 'Tin trong nước' }
  },
  {
    id: 22,
    title: 'Trung Quốc hạ thủy tàu sân bay mới nhất',
    slug: 'trung-quoc-tau-san-bay',
    summary: 'Tàu sân bay Fujian được trang bị hệ thống phóng máy bay điện từ hiện đại.',
    thumbnail_url: news1,
    view_count: 10234,
    published_at: '2024-12-25T11:00:00Z',
    category: { name: 'Tin quốc tế' }
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
    category: { name: 'Tin đơn vị' }
  },
  {
    id: 102,
    title: 'Triển khai công tác kiểm tra, giám sát quý I/2025',
    slug: 'kiem-tra-giam-sat-quy-1',
    summary: 'Tập trung kiểm tra việc thực hiện nhiệm vụ chính trị, công tác xây dựng Đảng và công tác quân sự.',
    thumbnail_url: raquanhl,
    view_count: 2890,
    published_at: '2025-01-15T15:00:00Z',
    category: { name: 'Tin trong nước' }
  },
  {
    id: 103,
    title: 'Hướng dẫn thực hiện nhiệm vụ sẵn sàng chiến đấu',
    slug: 'huong-dan-san-sang-chien-dau',
    summary: 'Các đơn vị cần duy trì nghiêm chế độ trực sẵn sàng chiến đấu, đảm bảo ứng phó kịp thời mọi tình huống.',
    thumbnail_url: dientap1,
    view_count: 4123,
    published_at: '2025-01-15T14:00:00Z',
    category: { name: 'Tin quân sự' }
  }
];

export const featuredArticles = [
  {
    id: 201,
    title: 'Bế giảng lớp bồi dưỡng kiến thức quốc phòng, an ninh cho cán bộ chủ chốt',
    slug: 'be-giang-lop-boi-duong-kien-thuc-quoc-phong',
    summary: 'Lớp học đã trang bị kiến thức toàn diện về quốc phòng, an ninh cho 45 cán bộ chủ chốt của Sư đoàn.',
    thumbnail_url: begiangkienthuc,
    view_count: 5234,
    published_at: '2025-01-14T09:00:00Z',
    category: { name: 'Tin đơn vị' }
  },
  {
    id: 202,
    title: 'Khai mạc hội thao quốc phòng toàn quân năm 2025',
    slug: 'khai-mac-hoi-thao-quoc-phong',
    summary: 'Hội thao quy tụ hơn 500 vận động viên từ các quân khu, binh chủng tham gia tranh tài.',
    thumbnail_url: hoithaoquocphong,
    view_count: 6789,
    published_at: '2025-01-13T10:00:00Z',
    category: { name: 'Tin quân sự' }
  },
  {
    id: 203,
    title: 'Chương trình "Xuân yêu thương" mang Tết đến với người nghèo',
    slug: 'xuan-yeu-thuong-tet-nguoi-ngheo',
    summary: 'Trao tặng 200 suất quà Tết cho các gia đình chính sách, hộ nghèo trên địa bàn.',
    thumbnail_url: xuanyeuthuong,
    view_count: 4567,
    published_at: '2025-01-12T08:00:00Z',
    category: { name: 'Tin trong nước' }
  },
  {
    id: 204,
    title: 'Hội nghị Bộ trưởng Quốc phòng ASEAN lần thứ 18',
    slug: 'hoi-nghi-bo-truong-quoc-phong-asean-18',
    summary: 'Các bộ trưởng thống nhất tăng cường hợp tác quốc phòng, duy trì hòa bình khu vực.',
    thumbnail_url: hoinghiasean,
    view_count: 7890,
    published_at: '2025-01-11T11:00:00Z',
    category: { name: 'Tin quốc tế' }
  }
];

// Activities sections dummy data
export const activitiesSuDoan = [
  {
    id: 401,
    title: 'Sư đoàn 365 tổ chức Hội nghị Đảng bộ lần thứ 15',
    slug: 'hoi-nghi-dang-bo-lan-15',
    summary: 'Hội nghị đánh giá toàn diện kết quả thực hiện nhiệm vụ năm 2024, triển khai nhiệm vụ trọng tâm năm 2025.',
    thumbnail_url: duongKhaiMac,
    view_count: 9234,
    published_at: '2025-01-12T09:00:00Z',
    category: { name: 'Hoạt động của Sư đoàn' }
  },
  {
    id: 402,
    title: 'Diễn tập khu vực phòng thủ Sư đoàn 365 năm 2025',
    slug: 'dien-tap-khu-vuc-phong-thu-2025',
    summary: 'Diễn tập quy mô lớn với sự tham gia của nhiều lực lượng, nâng cao khả năng phòng thủ toàn diện.',
    thumbnail_url: dientap1,
    view_count: 7856,
    published_at: '2025-01-11T08:30:00Z',
    category: { name: 'Hoạt động của Sư đoàn' }
  },
  {
    id: 403,
    title: 'Lễ kỷ niệm 80 năm Ngày thành lập Quân đội nhân dân Việt Nam',
    slug: 'le-ky-niem-80-nam-quan-doi',
    summary: 'Chương trình trang trọng tôn vinh truyền thống vẻ vang của Quân đội ta.',
    thumbnail_url: news1,
    view_count: 6543,
    published_at: '2025-01-10T10:00:00Z',
    category: { name: 'Hoạt động của Sư đoàn' }
  },
  {
    id: 404,
    title: 'Phát động phong trào thi đua "Quyết thắng" năm 2025',
    slug: 'phong-trao-thi-dua-quyet-thang',
    summary: 'Phong trào nhằm nâng cao chất lượng huấn luyện, xây dựng đơn vị vững mạnh toàn diện.',
    thumbnail_url: raquanhl,
    view_count: 5432,
    published_at: '2025-01-09T14:00:00Z',
    category: { name: 'Hoạt động của Sư đoàn' }
  },
  {
    id: 405,
    title: 'Hội thao quân sự Sư đoàn 365 sôi nổi, hấp dẫn',
    slug: 'hoi-thao-quan-su-su-doan',
    summary: 'Hơn 300 vận động viên tranh tài các môn bắn súng, chạy địa hình, vượt vật cản.',
    thumbnail_url: news3,
    view_count: 4876,
    published_at: '2025-01-08T11:00:00Z',
    category: { name: 'Hoạt động của Sư đoàn' }
  },
  {
    id: 406,
    title: 'Khen thưởng các tập thể, cá nhân xuất sắc năm 2024',
    slug: 'khen-thuong-tap-the-ca-nhan-2024',
    summary: 'Lễ khen thưởng ghi nhận những thành tích xuất sắc của các đơn vị và cá nhân.',
    thumbnail_url: duongKhaiMac,
    view_count: 4321,
    published_at: '2025-01-07T15:30:00Z',
    category: { name: 'Hoạt động của Sư đoàn' }
  }
];

export const activitiesDonVi = [
  {
    id: 501,
    title: 'Trung đoàn 1 hoàn thành xuất sắc nhiệm vụ huấn luyện quý I',
    slug: 'trung-doan-1-hoan-thanh-huan-luyen',
    summary: 'Đơn vị đạt kết quả xuất sắc các nội dung huấn luyện chiến thuật, kỹ thuật và thể lực.',
    thumbnail_url: dientap1,
    view_count: 5678,
    published_at: '2025-01-11T09:00:00Z',
    category: { name: 'Hoạt động của các đơn vị' }
  },
  {
    id: 502,
    title: 'Trung đoàn 2 tổ chức diễn tập chiến thuật cấp tiểu đoàn',
    slug: 'trung-doan-2-dien-tap-chien-thuat',
    summary: 'Diễn tập tập trung nâng cao khả năng phối hợp hiệp đồng chiến đấu của các đơn vị.',
    thumbnail_url: duongKhaiMac,
    view_count: 4987,
    published_at: '2025-01-10T08:30:00Z',
    category: { name: 'Hoạt động của các đơn vị' }
  },
  {
    id: 503,
    title: 'Trung đoàn 3 đạt danh hiệu "Đơn vị quyết thắng"',
    slug: 'trung-doan-3-don-vi-quyet-thang',
    summary: 'Đơn vị hoàn thành xuất sắc nhiệm vụ chính trị, quân sự và xây dựng Đảng năm 2024.',
    thumbnail_url: news1,
    view_count: 4234,
    published_at: '2025-01-09T10:00:00Z',
    category: { name: 'Hoạt động của các đơn vị' }
  },
  {
    id: 504,
    title: 'Tiểu đoàn pháo binh tổ chức hội thi bắn đạn thật',
    slug: 'tieu-doan-phao-binh-hoi-thi-ban',
    summary: 'Hội thi nhằm nâng cao kỹ năng chiến đấu, rèn luyện tác phong quân sự.',
    thumbnail_url: raquanhl,
    view_count: 3876,
    published_at: '2025-01-08T14:00:00Z',
    category: { name: 'Hoạt động của các đơn vị' }
  },
  {
    id: 505,
    title: 'Đại đội trinh sát đạt giải nhất hội thao cấp Sư đoàn',
    slug: 'dai-doi-trinh-sat-giai-nhat',
    summary: 'Đại đội thể hiện kỹ năng chuyên môn cao, tinh thần thi đua quyết liệt.',
    thumbnail_url: news3,
    view_count: 3456,
    published_at: '2025-01-07T11:00:00Z',
    category: { name: 'Hoạt động của các đơn vị' }
  },
  {
    id: 506,
    title: 'Tiểu đoàn công binh hoàn thành xuất sắc nhiệm vụ đột xuất',
    slug: 'tieu-doan-cong-binh-nhiem-vu-dot-xuat',
    summary: 'Đơn vị nhanh chóng triển khai lực lượng, hoàn thành nhiệm vụ đúng thời gian.',
    thumbnail_url: dientap1,
    view_count: 3123,
    published_at: '2025-01-06T15:00:00Z',
    category: { name: 'Hoạt động của các đơn vị' }
  }
];

export const activitiesThuTruong = [
  {
    id: 601,
    title: 'Đồng chí Chính ủy Sư đoàn kiểm tra công tác chuẩn bị Tết',
    slug: 'chinh-uy-kiem-tra-chuan-bi-tet',
    summary: 'Chính ủy yêu cầu các đơn vị chuẩn bị chu đáo, đảm bảo cán bộ chiến sĩ đón Tết vui tươi.',
    thumbnail_url: news1,
    view_count: 6789,
    published_at: '2025-01-12T10:00:00Z',
    category: { name: 'Hoạt động của Thủ trưởng' }
  },
  {
    id: 602,
    title: 'Đồng chí Tư lệnh Sư đoàn thăm, tặng quà gia đình chính sách',
    slug: 'tu-lenh-tham-gia-dinh-chinh-sach',
    summary: 'Tư lệnh gửi lời thăm hỏi, tặng quà các gia đình chính sách, người có công nhân dịp Tết.',
    thumbnail_url: raquanhl,
    view_count: 5678,
    published_at: '2025-01-11T09:30:00Z',
    category: { name: 'Hoạt động của Thủ trưởng' }
  },
  {
    id: 603,
    title: 'Thủ trưởng Sư đoàn làm việc với Ban Chỉ huy Trung đoàn 1',
    slug: 'thu-truong-lam-viec-trung-doan-1',
    summary: 'Cuộc làm việc tập trung đánh giá kết quả huấn luyện, triển khai nhiệm vụ năm 2025.',
    thumbnail_url: duongKhaiMac,
    view_count: 4987,
    published_at: '2025-01-10T14:00:00Z',
    category: { name: 'Hoạt động của Thủ trưởng' }
  },
  {
    id: 604,
    title: 'Đồng chí Chính ủy dự sinh hoạt chi bộ Cơ quan Sư đoàn',
    slug: 'chinh-uy-sinh-hoat-chi-bo',
    summary: 'Chính ủy yêu cầu nâng cao chất lượng sinh hoạt chi bộ, tăng cường kỷ luật Đảng.',
    thumbnail_url: news3,
    view_count: 4234,
    published_at: '2025-01-09T11:00:00Z',
    category: { name: 'Hoạt động của Thủ trưởng' }
  },
  {
    id: 605,
    title: 'Tư lệnh Sư đoàn kiểm tra công tác trực sẵn sàng chiến đấu',
    slug: 'tu-lenh-kiem-tra-truc-san-sang',
    summary: 'Tư lệnh nhấn mạnh duy trì nghiêm chế độ trực, sẵn sàng ứng phó mọi tình huống.',
    thumbnail_url: dientap1,
    view_count: 3876,
    published_at: '2025-01-08T08:00:00Z',
    category: { name: 'Hoạt động của Thủ trưởng' }
  },
  {
    id: 606,
    title: 'Thủ trưởng Sư đoàn dự Hội nghị trực tuyến Quân khu',
    slug: 'thu-truong-hoi-nghi-truc-tuyen',
    summary: 'Hội nghị triển khai nhiệm vụ quân sự, quốc phòng địa phương năm 2025.',
    thumbnail_url: news1,
    view_count: 3456,
    published_at: '2025-01-07T09:00:00Z',
    category: { name: 'Hoạt động của Thủ trưởng' }
  }
];
