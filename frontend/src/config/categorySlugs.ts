/**
 * Category Slug Configuration
 * Maps UI slugs to database slugs and display names
 * Updated to match backend database (2025-01-07)
 */

// Database slugs (from backend)
export const CATEGORY_SLUGS = {
  // Hoạt động
  SU_DOAN: 'hoat-dong-su-doan',
  DON_VI: 'hoat-dong-cac-don-vi',
  THU_TRUONG: 'hoat-dong-thu-truong',
  
  // Tin tức
  TRONG_NUOC: 'tin-trong-nuoc',
  QUOC_TE: 'tin-quoc-te',
  QUAN_SU: 'tin-quan-su',
  HOAT_DONG_SU_DOAN_TIN: 'bao-ve-nen-tang-tu-tuong-cua-dang',
} as const;

// Display names
export const CATEGORY_NAMES: Record<string, string> = {
  [CATEGORY_SLUGS.SU_DOAN]: 'Hoạt động của Sư đoàn',
  [CATEGORY_SLUGS.DON_VI]: 'Hoạt động của các đơn vị',
  [CATEGORY_SLUGS.THU_TRUONG]: 'Hoạt động của Thủ trưởng Sư đoàn',
  [CATEGORY_SLUGS.TRONG_NUOC]: 'Tin trong nước',
  [CATEGORY_SLUGS.QUOC_TE]: 'Tin quốc tế',
  [CATEGORY_SLUGS.QUAN_SU]: 'Tin quân sự',
  [CATEGORY_SLUGS.HOAT_DONG_SU_DOAN_TIN]: 'Bảo vệ nền tảng tư tưởng của Đảng',
};

// Groups
export const CATEGORY_GROUPS: Record<string, 'activities' | 'news'> = {
  [CATEGORY_SLUGS.SU_DOAN]: 'activities',
  [CATEGORY_SLUGS.DON_VI]: 'activities',
  [CATEGORY_SLUGS.THU_TRUONG]: 'activities',
  [CATEGORY_SLUGS.TRONG_NUOC]: 'news',
  [CATEGORY_SLUGS.QUOC_TE]: 'news',
  [CATEGORY_SLUGS.QUAN_SU]: 'news',
  [CATEGORY_SLUGS.HOAT_DONG_SU_DOAN_TIN]: 'news',
};

// All category slugs as array (for CategoryPage validation)
export const ALL_CATEGORY_SLUGS = Object.values(CATEGORY_SLUGS);

// Activities slugs
export const ACTIVITIES_SLUGS = [
  CATEGORY_SLUGS.SU_DOAN,
  CATEGORY_SLUGS.DON_VI,
  CATEGORY_SLUGS.THU_TRUONG,
] as const;

// News slugs
export const NEWS_SLUGS = [
  CATEGORY_SLUGS.TRONG_NUOC,
  CATEGORY_SLUGS.QUOC_TE,
  CATEGORY_SLUGS.QUAN_SU,
  CATEGORY_SLUGS.HOAT_DONG_SU_DOAN_TIN,
] as const;
