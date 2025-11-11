import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import logo from '@/assets/images/logos/logopkkq.jfif';

export default function SiteFooter() {
  const { data: settings } = useSettings();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-300 mt-16">
      {/* Top Footer */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & About */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img 
                src={logo} 
                alt={settings?.site_title || 'Sư đoàn 365'} 
                className="h-16 w-16 object-contain rounded-full border-2 border-yellow-500"
              />
              <span className="text-xl font-bold text-white">
                {settings?.site_title || 'SƯ ĐOÀN 365'}
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Cổng thông tin điện tử Sư đoàn 365 - Quân chủng Phòng không - Không quân. 
              Cơ động chiến đấu, chốt trụ kiên cường, đánh thắng địch trong mọi tình huống.
            </p>
            
            {/* Social Links */}
            {settings?.socials && (
              <div className="flex items-center gap-3">
                {settings.socials.facebook && (
                  <a
                    href={settings.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                
                {settings.socials.youtube && (
                  <a
                    href={settings.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                    aria-label="YouTube"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Giới thiệu</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/gioi-thieu/lich-su-truyen-thong" className="hover:text-white transition-colors">
                  Lịch sử truyền thống
                </Link>
              </li>
              <li>
                <Link to="/gioi-thieu/to-chuc-don-vi" className="hover:text-white transition-colors">
                  Cơ cấu tổ chức
                </Link>
              </li>
              <li>
                <Link to="/gioi-thieu/lanh-dao-su-doan" className="hover:text-white transition-colors">
                  Lãnh đạo chỉ huy Sư đoàn
                </Link>
              </li>
              <li>
                <Link to="/gioi-thieu/thanh-tich-don-vi" className="hover:text-white transition-colors">
                  Thành tích đơn vị
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Chuyên mục</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/hoat-dong" className="hover:text-white transition-colors">
                  Hoạt động
                </Link>
              </li>
              <li>
                <Link to="/tin-tuc" className="hover:text-white transition-colors">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-white transition-colors">
                  Kho văn bản
                </Link>
              </li>
              <li>
                <Link to="/media/videos" className="hover:text-white transition-colors">
                  Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              {settings?.contact?.address && (
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{settings.contact.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>
              &copy; {currentYear} {settings?.copyright || 'Sư đoàn 365. All rights reserved.'}
            </p>
            
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Điều khoản sử dụng
              </Link>
              <a 
                href="http://qlms.bqp/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Bình dân học vụ số
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
