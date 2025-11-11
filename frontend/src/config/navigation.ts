// Navigation menu structure and configuration

import { CATEGORY_SLUGS } from './categorySlugs';

export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  children?: MenuItem[];
  prefetchKey?: string[];
}

export type NavItem = MenuItem;

/**
 * Fallback navigation menu structure
 * Used when API /api/v1/menus is not available
 */
export const NAVIGATION_MENU: MenuItem[] = [
  {
    id: 'introduction',
    label: 'Giới thiệu',
    children: [
      {
        id: 'history',
        label: 'Lịch sử truyền thống',
        path: '/gioi-thieu/lich-su-truyen-thong',
        prefetchKey: ['intro', 'lich-su-truyen-thong']
      },
      {
        id: 'organization',
        label: 'Cơ cấu - Tổ chức',
        path: '/gioi-thieu/to-chuc-don-vi',
        prefetchKey: ['intro', 'to-chuc-don-vi']
      },
      {
        id: 'leadership',
        label: 'Lãnh đạo chỉ huy sư đoàn',
        path: '/gioi-thieu/lanh-dao',
        prefetchKey: ['intro', 'lanh-dao-su-doan']
      },
      {
        id: 'achievements',
        label: 'Thành tích đơn vị',
        path: '/gioi-thieu/thanh-tich',
        prefetchKey: ['intro', 'thanh-tich-don-vi']
      }
    ]
  },
  {
    id: 'activities',
    label: 'Hoạt động',
    path: '/hoat-dong',
    prefetchKey: ['activities'],
    children: [
      {
        id: 'activities-all',
        label: 'Tất cả hoạt động',
        path: '/hoat-dong'
      },
      {
        id: 'activities-su-doan',
        label: 'Hoạt động của Sư đoàn',
        path: '/hoat-dong/hoat-dong-su-doan',
        prefetchKey: ['articles', 'hoat-dong-su-doan']
      },
      {
        id: 'activities-don-vi',
        label: 'Hoạt động của các đơn vị',
        path: '/hoat-dong/hoat-dong-cac-don-vi',
        prefetchKey: ['articles', 'hoat-dong-cac-don-vi']
      },
      {
        id: 'activities-thu-truong',
        label: 'Hoạt động của Thủ trưởng',
        path: '/hoat-dong/hoat-dong-thu-truong',
        prefetchKey: ['articles', 'hoat-dong-thu-truong']
      }
    ]
  },
  {
    id: 'news',
    label: 'Tin tức',
    path: '/tin-tuc',
    prefetchKey: ['news'],
    children: [
      {
        id: 'news-all',
        label: 'Tất cả tin tức',
        path: '/tin-tuc'
      },
      {
        id: 'news-trong-nuoc',
        label: 'Tin trong nước',
        path: '/c/tin-trong-nuoc',
        prefetchKey: ['articles', 'tin-trong-nuoc']
      },
      {
        id: 'news-quoc-te',
        label: 'Tin quốc tế',
        path: '/c/tin-quoc-te',
        prefetchKey: ['articles', 'tin-quoc-te']
      },
      {
        id: 'news-quan-su',
        label: 'Tin quân sự',
        path: '/c/tin-quan-su',
        prefetchKey: ['articles', 'tin-quan-su']
      },
      {
        id: 'news-hoat-dong',
        label: 'Bảo vệ nền tảng tư tưởng của Đảng',
        path: '/c/bao-ve-nen-tang-tu-tuong-cua-dang',
        prefetchKey: ['articles', 'bao-ve-nen-tang-tu-tuong-cua-dang']
      }
    ]
  },
  {
    id: 'documents',
    label: 'Kho văn bản',
    path: '/docs',
    prefetchKey: ['documents']
  },
  {
    id: 'media',
    label: 'Media',
    children: [
      {
        id: 'media-videos',
        label: 'Thư viện video',
        path: '/media/videos',
        prefetchKey: ['media', 'videos']
      },
      {
        id: 'media-photos',
        label: 'Thư viện ảnh',
        path: '/media/photos',
        prefetchKey: ['media', 'photos']
      }
    ]
  }
];

/**
 * Check if current path matches menu item
 */
export const isMenuItemActive = (item: MenuItem, currentPath: string): boolean => {
  // Exact match
  if (item.path === currentPath) return true;

  // Pattern matching for parent items
  if (item.id === 'introduction' && currentPath.startsWith('/intro/')) return true;
  if (item.id === 'activities' && (currentPath === '/activities' || currentPath.startsWith('/c/hoat-dong-'))) return true;
  if (item.id === 'news' && (currentPath === '/news' || currentPath.startsWith('/c/tin-'))) return true;
  if (item.id === 'documents' && currentPath.startsWith('/docs')) return true;
  if (item.id === 'media' && currentPath.startsWith('/media/')) return true;

  // Check children
  if (item.children) {
    return item.children.some(child => isMenuItemActive(child, currentPath));
  }

  return false;
};

/**
 * Get breadcrumb trail for current path
 */
export const getBreadcrumbs = (
  currentPath: string,
  menu: MenuItem[] = NAVIGATION_MENU
): Array<{ label: string; path?: string }> => {
  const breadcrumbs: Array<{ label: string; path?: string }> = [];

  // Find matching menu item recursively
  const findItem = (items: MenuItem[], path: string): MenuItem | null => {
    for (const item of items) {
      if (item.path === path) return item;
      if (item.children) {
        const found = findItem(item.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  const findParent = (items: MenuItem[], targetPath: string): MenuItem | null => {
    for (const item of items) {
      if (item.children?.some(child => child.path === targetPath)) {
        return item;
      }
      if (item.children) {
        const found = findParent(item.children, targetPath);
        if (found) return found;
      }
    }
    return null;
  };

  const currentItem = findItem(menu, currentPath);
  if (currentItem) {
    const parent = findParent(menu, currentPath);
    if (parent) {
      breadcrumbs.push({ label: parent.label, path: parent.path });
    }
    breadcrumbs.push({ label: currentItem.label });
  }

  return breadcrumbs;
};
