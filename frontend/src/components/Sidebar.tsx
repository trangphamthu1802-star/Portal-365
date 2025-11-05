import { Link } from 'react-router-dom';

// Dummy data
const announcements = [
  { id: 1, title: 'Thông báo về kế hoạch diễn tập chiến thuật năm 2025', date: '2025-01-15' },
  { id: 2, title: 'Triển khai công tác kiểm tra, giám sát quý I/2025', date: '2025-01-14' },
  { id: 3, title: 'Hướng dẫn thực hiện nhiệm vụ bảo vệ biên giới', date: '2025-01-13' },
  { id: 4, title: 'Kế hoạch tập huấn chính trị tháng 2/2025', date: '2025-01-12' },
  { id: 5, title: 'Thông báo nghỉ tết Nguyên đán 2025', date: '2025-01-10' },
];

const trainingActivities = [
  { id: 1, title: 'Diễn tập phòng thủ khu vực biên giới phía Bắc', date: '2025-01-20', location: 'Cao Bằng' },
  { id: 2, title: 'Huấn luyện kỹ thuật súng bắn tỉa', date: '2025-01-18', location: 'Trung đoàn 1' },
  { id: 3, title: 'Tập huấn chiến thuật bộ binh hiện đại', date: '2025-01-17', location: 'Trung đoàn 2' },
  { id: 4, title: 'Huấn luyện phối hợp quân binh chủng', date: '2025-01-16', location: 'Sân tập B' },
  { id: 5, title: 'Diễn tập cứu hộ cứu nạn trong thiên tai', date: '2025-01-15', location: 'Khu vực A' },
];

const militaryLife = [
  { id: 1, title: 'Tết đến xuân về trong doanh trại Sư đoàn 365', image: 'https://picsum.photos/seed/mil1/200/150' },
  { id: 2, title: 'Những người lính canh giữ biên cương Tổ quốc', image: 'https://picsum.photos/seed/mil2/200/150' },
  { id: 3, title: 'Niềm vui ngày hội tòng quân', image: 'https://picsum.photos/seed/mil3/200/150' },
  { id: 4, title: 'Bữa cơm trưa đầm ấm của chiến sĩ', image: 'https://picsum.photos/seed/mil4/200/150' },
];

export default function Sidebar() {
  return (
    <aside className="space-y-6">
      {/* Announcements */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-green-600 px-4 py-3 border-l-4 border-yellow-400">
          <h3 className="font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Thông báo
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {announcements.map((item) => (
            <Link
              key={item.id}
              to={`/announcement/${item.id}`}
              className="block p-4 hover:bg-green-50 transition-colors group"
            >
              <h4 className="text-sm font-semibold text-gray-800 mb-1 group-hover:text-green-700 line-clamp-2">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString('vi-VN')}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Training Activities */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-3 border-l-4 border-yellow-400">
          <h3 className="font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Hoạt động huấn luyện
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {trainingActivities.map((item) => (
            <div key={item.id} className="p-4 hover:bg-blue-50 transition-colors">
              <h4 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
                {item.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(item.date).toLocaleDateString('vi-VN')}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {item.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Military Life */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-700 to-green-600 px-4 py-3 border-l-4 border-yellow-400">
          <h3 className="font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            Đời sống quân đội
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {militaryLife.map((item) => (
            <Link
              key={item.id}
              to={`/life/${item.id}`}
              className="block hover:bg-green-50 transition-colors group"
            >
              <div className="flex gap-3 p-3">
                <div className="flex-shrink-0 w-20 h-16 overflow-hidden rounded">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-800 group-hover:text-green-700 line-clamp-3">
                    {item.title}
                  </h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg shadow-md p-4 text-white">
        <h3 className="font-bold uppercase tracking-wide mb-3 text-yellow-400">Liên kết nhanh</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-2">→ Bộ Quốc phòng</a></li>
          <li><a href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-2">→ Báo Quân đội nhân dân</a></li>
          <li><a href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-2">→ Cổng thông tin Chính phủ</a></li>
          <li><a href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-2">→ Thư viện pháp luật</a></li>
        </ul>
      </div>
    </aside>
  );
}
