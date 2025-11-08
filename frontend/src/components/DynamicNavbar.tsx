import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import { NAVIGATION_MENU, isMenuItemActive, type MenuItem } from '../config/navigation';
import AuthButton from './AuthButton';

interface ApiMenu {
  id: number;
  title: string;
  url: string;
  order: number;
  children?: ApiMenu[];
}

const DynamicNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(NAVIGATION_MENU);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await apiClient.get<{ data: ApiMenu[] }>('/menus?location=header');
        // TODO: Transform API menu to MenuItem[] format
        // For now, use fallback
        console.log('API menu loaded:', response.data);
      } catch (error) {
        console.log('Using fallback navigation menu');
        setMenuItems(NAVIGATION_MENU);
      }
    };
    fetchMenu();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handlePrefetch = (item: MenuItem) => {
    if (!item.prefetchKey) return;

    // Prefetch data when hovering over menu item
    const [resource, ...params] = item.prefetchKey;
    
    if (resource === 'activities') {
      queryClient.prefetchQuery({
        queryKey: ['activities', 'hoat-dong-cua-thu-truong'],
        staleTime: 60000
      });
    } else if (resource === 'articles' && params[0]) {
      queryClient.prefetchQuery({
        queryKey: ['articles', params[0]],
        staleTime: 60000
      });
    } else if (resource === 'documents') {
      queryClient.prefetchQuery({
        queryKey: ['documents', { page: 1 }],
        staleTime: 60000
      });
    } else if (resource === 'media') {
      const type = params[0];
      queryClient.prefetchQuery({
        queryKey: ['media', type, { page: 1 }],
        staleTime: 60000
      });
    }
  };

  const renderDesktopMenu = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = isMenuItemActive(item, location.pathname);

    if (!hasChildren) {
      return (
        <NavLink
          key={item.id}
          to={item.path || '#'}
          onMouseEnter={() => handlePrefetch(item)}
          className={({ isActive: linkActive }) => `
            px-3 py-6 hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-2
            ${linkActive || isActive ? 'bg-blue-700' : ''}
          `}
        >
          {item.label}
        </NavLink>
      );
    }

    return (
      <div
        key={item.id}
        className="relative group"
        onMouseEnter={() => {
          setOpenDropdown(item.id);
          handlePrefetch(item);
        }}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <button 
          className={`px-3 py-6 hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1 whitespace-nowrap ${
            isActive ? 'bg-blue-700' : ''
          }`}
          aria-haspopup="true"
          aria-expanded={openDropdown === item.id}
        >
          {item.label}
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute left-0 top-full bg-white text-gray-800 shadow-xl rounded-b-lg min-w-[240px] transition-all duration-200 z-50 ${
            openDropdown === item.id ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          role="menu"
        >
          {item.children?.map((child) => (
            <NavLink
              key={child.id}
              to={child.path || '#'}
              onMouseEnter={() => handlePrefetch(child)}
              className={({ isActive: childActive }) => `
                block px-6 py-3 hover:bg-blue-50 hover:text-blue-700 transition-colors 
                border-b border-gray-100 last:border-b-0 text-sm
                ${childActive ? 'bg-blue-50 text-blue-700 font-medium' : ''}
              `}
              role="menuitem"
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      </div>
    );
  };

  const renderMobileMenu = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const [isOpen, setIsOpen] = useState(false);
    const isActive = isMenuItemActive(item, location.pathname);

    if (!hasChildren) {
      return (
        <NavLink
          key={item.id}
          to={item.path || '#'}
          className={({ isActive: linkActive }) => `
            block px-4 py-3 hover:bg-blue-700 transition-colors
            ${linkActive || isActive ? 'bg-blue-700' : ''}
          `}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {item.label}
        </NavLink>
      );
    }

    return (
      <div key={item.id} className="border-b border-blue-700">
        <button
          className={`w-full px-4 py-3 flex items-center justify-between hover:bg-blue-700 transition-colors ${
            isActive ? 'bg-blue-700' : ''
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{item.label}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="bg-blue-800">
            {item.children?.map((child) => (
              <NavLink
                key={child.id}
                to={child.path || '#'}
                className={({ isActive: childActive }) => `
                  block px-8 py-2 hover:bg-blue-700 transition-colors text-sm
                  ${childActive ? 'bg-blue-700 font-medium' : ''}
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-[#0C2D84] text-white sticky top-0 z-50 shadow-lg" role="navigation" aria-label="Main">
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="flex items-center gap-1">
            {/* Render menu items from config */}
            {menuItems.map(renderDesktopMenu)}

            {/* Bình dân học vụ số - External Link */}
            <a
              href="http://qlms.bqp/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-6 hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-2"
            >
              Bình dân học vụ số
            </a>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative ml-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 rounded-full bg-sky-50 text-sky-900 placeholder-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white w-64 border border-sky-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sky-500" />
            </form>

            {/* Auth Button */}
            <div className="ml-4">
              <AuthButton />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between py-4">
            <span className="font-bold text-lg">Menu</span>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="pb-4 border-t border-blue-700">
              {/* Search Mobile */}
              <form onSubmit={handleSearch} className="p-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="w-full pl-10 pr-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </form>

              {/* Mobile Menu Items */}
              {menuItems.map(renderMobileMenu)}
              {/* Bình dân học vụ số - Mobile */}
              <a
                href="http://qlms.bqp/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 hover:bg-blue-700 transition-colors border-b border-blue-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bình dân học vụ số
              </a>

              {/* Auth Button Mobile */}
              <div className="px-4 mt-4">
                <AuthButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DynamicNavbar;
