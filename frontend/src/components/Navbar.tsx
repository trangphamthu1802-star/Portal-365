import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Info, Activity, Newspaper, BookOpen, FileText, Camera, Menu, X, ChevronDown, Search, LogIn } from 'lucide-react';
import { apiClient } from '../lib/api';
import { Page, SuccessResponse } from '../types/api';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [introPages, setIntroPages] = useState<Page[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIntroPages = async () => {
      try {
        const response = await apiClient.get<SuccessResponse<Page[]>>('/pages', {
          params: { group: 'introduction', status: 'published' }
        });
        const sortedPages = response.data.data.sort((a, b) => a.order - b.order);
        setIntroPages(sortedPages);
      } catch (error) {
        console.error('Error fetching intro pages:', error);
      }
    };
    fetchIntroPages();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const menuItems = [
    { name: 'Giới thiệu', icon: Info, hasDropdown: true, dropdownKey: 'gioithieu' },
    { name: 'Hoạt động', icon: Activity, hasDropdown: true, dropdownKey: 'hoatdong' },
    { name: 'Tin tức', icon: Newspaper, hasDropdown: true, dropdownKey: 'tintuc' },
    { name: 'Bình dân học vụ số', path: 'http://qlms.bqp/', icon: BookOpen, isExternal: true },
    { name: 'Văn bản', icon: FileText, hasDropdown: true, dropdownKey: 'vanban' },
    { name: 'Media', icon: Camera, hasDropdown: true, dropdownKey: 'media' },
  ];

  const dropdownMenus = {
    gioithieu: introPages.map(page => ({
      name: page.title,
      path: `/${page.slug}`
    })),
    hoatdong: [
      { name: 'Hoạt động của thủ trưởng sư đoàn', path: '/hoat-dong/thu-truong' },
      { name: 'Hoạt động của Sư đoàn', path: '/hoat-dong/su-doan' },
      { name: 'Hoạt động của các đơn vị', path: '/hoat-dong/don-vi' },
    ],
    tintuc: [
      { name: 'Tin trong nước', path: '/tin-tuc/trong-nuoc' },
      { name: 'Tin quốc tế', path: '/tin-tuc/quoc-te' },
      { name: 'Tin Quân sự', path: '/tin-tuc/quan-su' },
      { name: 'Tin hoạt động của Sư đoàn', path: '/tin-tuc/su-doan' },
    ],
    vanban: [
      { name: 'Văn bản pháp luật QSQP', path: '/van-ban/qsqp' },
      { name: 'Văn bản hành chính', path: '/van-ban/hanh-chinh' },
      { name: 'Tài liệu', path: '/van-ban/tai-lieu' },
    ],
    media: [
      { name: 'Thư viện video', path: '/media/video' },
      { name: 'Thư viện hình ảnh', path: '/media/hinh-anh' },
    ],
  };

  return (
    <nav className="bg-[#0C2D84] text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="hidden lg:flex items-center justify-between">
          {/* Navigation Menu Items */}
          <div className="flex items-center flex-1">
          {menuItems.map((item, index) => (
            <div 
              key={index}
              className="relative"
              onMouseEnter={() => item.hasDropdown && item.dropdownKey && setOpenDropdown(item.dropdownKey)}
              onMouseLeave={() => item.hasDropdown && setOpenDropdown(null)}
            >
              {item.hasDropdown ? (
                <button className="flex items-center justify-center gap-2 px-4 py-4 text-white font-bold uppercase text-sm hover:bg-[#007934] hover:border-b-4 hover:border-[#FFD700] transition-all duration-200 border-b-4 border-transparent whitespace-nowrap">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              ) : item.isExternal ? (
                <a href={item.path} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-4 py-4 text-white font-bold uppercase text-sm hover:bg-[#007934] hover:border-b-4 hover:border-[#FFD700] transition-all duration-200 border-b-4 border-transparent whitespace-nowrap">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              ) : (
                <NavLink to={item.path || '/'} className={({ isActive }) => `flex items-center justify-center gap-2 px-4 py-4 text-white font-bold uppercase text-sm hover:bg-[#007934] hover:border-b-4 hover:border-[#FFD700] transition-all duration-200 border-b-4 ${isActive ? 'bg-[#007934] border-[#FFD700]' : 'border-transparent'} whitespace-nowrap`}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              )}
              {item.hasDropdown && item.dropdownKey && openDropdown === item.dropdownKey && (
                <div className="absolute left-0 top-full w-64 bg-white shadow-xl border-t-4 border-[#FFD700] z-50" onMouseEnter={() => setOpenDropdown(item.dropdownKey!)} onMouseLeave={() => setOpenDropdown(null)}>
                  {dropdownMenus[item.dropdownKey as keyof typeof dropdownMenus]?.map((dropItem, dropIndex) => (
                    <NavLink key={dropIndex} to={dropItem.path} className="block px-6 py-3 text-gray-800 hover:bg-[#007934] hover:text-white transition-colors border-b border-gray-200 last:border-0">
                      {dropItem.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
          </div>

          {/* Search Bar and Login Button */}
          <div className="flex items-center gap-3 ml-4">
            {/* Search Bar - Modern Professional Design */}
            <form onSubmit={handleSearch} className="relative group">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm tin tức..."
                  className="w-72 px-4 py-2.5 pr-11 rounded-lg bg-white text-gray-800 placeholder-gray-500 border-2 border-white/20 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-[#007934] text-white hover:bg-[#006028] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Login Button */}
            <NavLink 
              to="/login" 
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FFD700] text-[#0C2D84] font-bold rounded-lg hover:bg-yellow-400 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <LogIn className="w-5 h-5" />
              <span>Đăng nhập</span>
            </NavLink>
          </div>
        </div>
        <div className="lg:hidden flex items-center justify-between py-4">
          <span className="text-xl font-bold">SƯ ĐOÀN 365</span>
          <div className="flex items-center gap-2">
            {/* Mobile Login Button */}
            <NavLink 
              to="/login" 
              className="flex items-center gap-1 px-3 py-2 bg-[#FFD700] text-[#0C2D84] font-bold rounded-md hover:bg-yellow-500 transition-all text-sm"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </NavLink>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-[#007934] rounded transition-colors">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#001f5c]">
            {/* Mobile Search Bar - Modern Professional Design */}
            <div className="px-4 py-3 border-b border-[#007934]">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm tin tức..."
                    className="w-full px-4 py-2.5 pr-11 rounded-lg bg-white text-gray-800 placeholder-gray-500 border-2 border-white/20 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 transition-all font-medium text-sm"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-[#007934] text-white hover:bg-[#006028] transition-all"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
            
            <div className="flex flex-col">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.hasDropdown && item.dropdownKey ? (
                    <>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-white font-bold uppercase text-sm hover:bg-[#007934] transition-colors" onClick={() => setOpenDropdown(openDropdown === item.dropdownKey ? null : item.dropdownKey)}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${openDropdown === item.dropdownKey ? 'rotate-180' : ''}`} />
                      </button>
                      {openDropdown === item.dropdownKey && (
                        <div className="bg-[#001f5c] pl-8">
                          {dropdownMenus[item.dropdownKey as keyof typeof dropdownMenus]?.map((dropItem, dropIndex) => (
                            <NavLink key={dropIndex} to={dropItem.path} className="block px-4 py-2 text-white hover:bg-[#007934] transition-colors text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                              {dropItem.name}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </>
                  ) : item.isExternal ? (
                    <a href={item.path} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 text-white font-bold uppercase text-sm hover:bg-[#007934] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </a>
                  ) : (
                    <NavLink to={item.path || '/'} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 text-white font-bold uppercase text-sm hover:bg-[#007934] transition-colors ${isActive ? 'bg-[#007934]' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
