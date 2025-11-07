/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum ModelsPageStatus {
  PageStatusDraft = "draft",
  PageStatusPublished = "published",
}

export enum ModelsArticleStatus {
  StatusDraft = "draft",
  StatusUnderReview = "under_review",
  StatusPublished = "published",
  StatusHidden = "hidden",
  StatusRejected = "rejected",
}

export interface DtoArticleResponse {
  author_id?: number;
  author_name?: string;
  category_id?: number;
  category_name?: string;
  content?: string;
  created_at?: string;
  featured_image?: string;
  id?: number;
  is_featured?: boolean;
  published_at?: string;
  scheduled_at?: string;
  slug?: string;
  status?: string;
  summary?: string;
  tags?: string[];
  title?: string;
  updated_at?: string;
  view_count?: number;
}

export interface DtoCreateArticleRequest {
  category_id: number;
  content: string;
  featured_image?: string;
  is_featured?: boolean;
  scheduled_at?: DtoFlexibleTime;
  /** Auto-generated from title if empty */
  slug?: string;
  summary?: string;
  tag_ids?: number[];
  title: string;
}

export interface DtoCreateCategoryRequest {
  description?: string;
  is_active?: boolean;
  name: string;
  parent_id?: number;
  slug: string;
  sort_order?: number;
}

export interface DtoCreatePageRequest {
  content: string;
  group: string;
  hero_image_url?: string;
  order?: number;
  seo_description?: string;
  seo_title?: string;
  slug: string;
  status: "draft" | "published";
  title: string;
}

export interface DtoCreateTagRequest {
  name: string;
  slug: string;
}

export interface DtoErrorDetail {
  code?: string;
  details?: any;
  message?: string;
}

export interface DtoErrorResponse {
  error?: DtoErrorDetail;
}

export interface DtoFlexibleTime {
  "time.Time"?: string;
}

export interface DtoLoginRequest {
  email: string;
  password: string;
}

export interface DtoLoginResponse {
  access_token?: string;
  expires_at?: string;
  refresh_token?: string;
  user?: DtoUserResponse;
}

export interface DtoPaginationResponse {
  page?: number;
  page_size?: number;
  total?: number;
  total_pages?: number;
}

export interface DtoRefreshTokenRequest {
  refresh_token: string;
}

export interface DtoSuccessResponse {
  data?: any;
  pagination?: DtoPaginationResponse;
}

export interface DtoUpdateArticleRequest {
  category_id: number;
  content: string;
  featured_image?: string;
  is_featured?: boolean;
  scheduled_at?: DtoFlexibleTime;
  /** Auto-generated from title if empty */
  slug?: string;
  summary?: string;
  tag_ids?: number[];
  title: string;
}

export interface DtoUpdateCategoryRequest {
  description?: string;
  is_active?: boolean;
  name: string;
  parent_id?: number;
  slug: string;
  sort_order?: number;
}

export interface DtoUpdatePageRequest {
  content: string;
  group: string;
  hero_image_url?: string;
  is_active?: boolean;
  order?: number;
  seo_description?: string;
  seo_title?: string;
  slug: string;
  status: "draft" | "published";
  title: string;
}

export interface DtoUserResponse {
  avatar?: string;
  created_at?: string;
  email?: string;
  full_name?: string;
  id?: number;
  is_active?: boolean;
  roles?: string[];
}

export interface HandlersCategorySection {
  articles?: ModelsArticle[];
  category?: ModelsCategory;
}

export interface HandlersHomeResponse {
  breaking?: ModelsArticle[];
  by_category?: HandlersCategorySection[];
  featured?: ModelsArticle[];
  hero?: ModelsArticle;
  most_read?: ModelsArticle[];
}

export interface MiddlewareErrorDetail {
  code?: string;
  details?: any;
  message?: string;
}

export interface MiddlewareErrorResponse {
  error?: MiddlewareErrorDetail;
}

export interface ModelsArticle {
  author_id?: number;
  category_id?: number;
  content?: string;
  created_at?: string;
  featured_image?: string;
  id?: number;
  is_featured?: boolean;
  published_at?: string;
  scheduled_at?: string;
  slug?: string;
  status?: ModelsArticleStatus;
  summary?: string;
  title?: string;
  updated_at?: string;
  view_count?: number;
}

export interface ModelsBanner {
  created_at?: string;
  end_date?: string;
  id?: number;
  image_url?: string;
  is_active?: boolean;
  link_url?: string;
  /** home_hero, sidebar, etc. */
  placement?: string;
  sort_order?: number;
  start_date?: string;
  title?: string;
  updated_at?: string;
}

export interface ModelsCategory {
  created_at?: string;
  description?: string;
  id?: number;
  is_active?: boolean;
  name?: string;
  parent_id?: number;
  slug?: string;
  sort_order?: number;
  updated_at?: string;
}

export interface ModelsDocument {
  category_id?: number;
  created_at?: string;
  description?: string;
  /** Số văn bản */
  document_no?: string;
  file_name?: string;
  file_size?: number;
  /** pdf, doc, docx, xls, xlsx */
  file_type?: string;
  file_url?: string;
  id?: number;
  /** Ngày ban hành */
  issued_date?: string;
  published_at?: string;
  slug?: string;
  /** draft, published */
  status?: string;
  title?: string;
  updated_at?: string;
  uploaded_by?: number;
  view_count?: number;
}

export interface ModelsMediaItem {
  category_id?: number;
  created_at?: string;
  description?: string;
  /** For videos (seconds) */
  duration?: number;
  file_size?: number;
  height?: number;
  id?: number;
  /** video, image */
  media_type?: string;
  published_at?: string;
  slug?: string;
  /** draft, published */
  status?: string;
  thumbnail_url?: string;
  title?: string;
  updated_at?: string;
  uploaded_by?: number;
  url?: string;
  view_count?: number;
  width?: number;
}

export interface ModelsPage {
  /** HTML content */
  content?: string;
  created_at?: string;
  /** introduction, about, etc. */
  group?: string;
  /** optional */
  hero_image_url?: string;
  id?: number;
  is_active?: boolean;
  /** unique within group: history, organization, etc. */
  key?: string;
  /** for menu ordering */
  order?: number;
  published_at?: string;
  /** optional */
  seo_description?: string;
  /** optional */
  seo_title?: string;
  slug?: string;
  /** draft, published */
  status?: ModelsPageStatus;
  title?: string;
  updated_at?: string;
  /** page views */
  view_count?: number;
}

export interface ModelsTag {
  created_at?: string;
  id?: number;
  name?: string;
  slug?: string;
}

export interface BannersListParams {
  /** Filter by placement */
  placement?: string;
  /** Filter by active status */
  active?: boolean;
  /** Search by title */
  q?: string;
  /** Page number (default: 1) */
  page?: number;
  /** Page size (default: 20, max: 100) */
  page_size?: number;
}

export type BannersListData = DtoSuccessResponse & {
  data?: ModelsBanner[];
};

export type BannersCreateData = DtoSuccessResponse & {
  data?: ModelsBanner;
};

export interface BannersDetailParams {
  /** Banner ID */
  id: number;
}

export type BannersDetailData = DtoSuccessResponse & {
  data?: ModelsBanner;
};

export interface BannersUpdateParams {
  /** Banner ID */
  id: number;
}

export type BannersUpdateData = DtoSuccessResponse & {
  data?: ModelsBanner;
};

export interface BannersDeleteParams {
  /** Banner ID */
  id: number;
}

export type BannersDeleteData = any;

export interface MediaListParams {
  /** Media type filter */
  media_type?: string;
  /** Status filter */
  status?: string;
  /** Category ID filter */
  category_id?: number;
  /** Page number (default: 1) */
  page?: number;
  /** Page size (default: 20, max: 100) */
  page_size?: number;
}

export type MediaListData = DtoSuccessResponse & {
  data?: ModelsMediaItem[];
};

export type MediaCreateData = DtoSuccessResponse & {
  data?: ModelsMediaItem;
};

export type MediaUploadCreateData = DtoSuccessResponse & {
  data?: ModelsMediaItem;
};

export interface MediaDetailParams {
  /** Media ID */
  id: number;
}

export type MediaDetailData = DtoSuccessResponse & {
  data?: ModelsMediaItem;
};

export interface MediaUpdateParams {
  /** Media ID */
  id: number;
}

export type MediaUpdateData = DtoSuccessResponse & {
  data?: ModelsMediaItem;
};

export interface MediaDeleteParams {
  /** Media ID */
  id: number;
}

export type MediaDeleteData = any;

export interface V1ActivitiesListParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Items per page
   * @default 20
   */
  page_size?: number;
}

export type V1ActivitiesListData = DtoSuccessResponse & {
  data?: ModelsArticle[];
  pagination?: DtoPaginationResponse;
};

export interface V1ActivitiesDetailParams {
  /** Activity slug */
  slug: string;
}

export type V1ActivitiesDetailData = DtoSuccessResponse & {
  data?: DtoArticleResponse;
};

export type V1AdminActivitiesCreateData = DtoSuccessResponse & {
  data?: ModelsArticle;
};

export interface V1AdminActivitiesUpdateParams {
  /** Activity ID */
  id: number;
}

export type V1AdminActivitiesUpdateData = DtoSuccessResponse & {
  data?: ModelsArticle;
};

export interface V1AdminActivitiesDeleteParams {
  /** Activity ID */
  id: number;
}

export type V1AdminActivitiesDeleteData = DtoSuccessResponse;

export interface V1AdminActivitiesPublishCreateParams {
  /** Activity ID */
  id: number;
}

export type V1AdminActivitiesPublishCreateData = DtoSuccessResponse;

export interface V1AdminArticlesListParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Page size
   * @default 20
   */
  page_size?: number;
  /** Filter by category ID */
  category_id?: number;
  /** Filter by category slug */
  category_slug?: string;
  /** Filter by author ID */
  author_id?: number;
  /** Filter by status (draft, under_review, published, hidden, rejected) */
  status?: string;
  /** Filter by tag */
  tag?: string;
  /** Search query */
  q?: string;
  /**
   * Sort by field
   * @default "-published_at"
   */
  sort?: string;
}

export type V1AdminArticlesListData = DtoSuccessResponse & {
  data?: ModelsArticle[];
  pagination?: DtoPaginationResponse;
};

export type V1AdminArticlesCreateData = DtoSuccessResponse & {
  data?: ModelsArticle;
};

export interface V1AdminArticlesDetailParams {
  /** Article ID */
  id: number;
}

export type V1AdminArticlesDetailData = DtoSuccessResponse & {
  data?: ModelsArticle;
};

export interface V1AdminArticlesUpdateParams {
  /** Article ID */
  id: number;
}

export type V1AdminArticlesUpdateData = DtoSuccessResponse & {
  data?: ModelsArticle;
};

export interface V1AdminArticlesDeleteParams {
  /** Article ID */
  id: number;
}

export type V1AdminArticlesDeleteData = DtoSuccessResponse & {
  data?: object;
};

export interface V1AdminArticlesApproveCreateParams {
  /** Article ID */
  id: number;
}

export type V1AdminArticlesApproveCreateData = DtoSuccessResponse;

export interface V1AdminArticlesPublishCreateParams {
  /** Article ID */
  id: number;
}

export type V1AdminArticlesPublishCreateData = DtoSuccessResponse;

export interface V1AdminArticlesRejectCreateParams {
  /** Article ID */
  id: number;
}

export type V1AdminArticlesRejectCreateData = DtoSuccessResponse;

export interface V1AdminArticlesSubmitCreateParams {
  /** Article ID */
  id: number;
}

export type V1AdminArticlesSubmitCreateData = DtoSuccessResponse;

export interface V1AdminArticlesUnpublishCreateParams {
  /** Article ID */
  id: number;
}

export type V1AdminArticlesUnpublishCreateData = DtoSuccessResponse;

export type V1AdminCategoriesCreateData = DtoSuccessResponse & {
  data?: ModelsCategory;
};

export interface V1AdminCategoriesUpdateParams {
  /** Category ID */
  id: number;
}

export type V1AdminCategoriesUpdateData = DtoSuccessResponse & {
  data?: ModelsCategory;
};

export interface V1AdminCategoriesDeleteParams {
  /** Category ID */
  id: number;
}

export type V1AdminCategoriesDeleteData = DtoSuccessResponse;

export interface V1AdminDocumentsListParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Page size
   * @default 20
   */
  page_size?: number;
  /** Filter by status */
  status?: string;
  /** Filter by category */
  category_id?: number;
}

export type V1AdminDocumentsListData = DtoSuccessResponse & {
  data?: ModelsDocument[];
};

export type V1AdminDocumentsCreateData = DtoSuccessResponse & {
  data?: ModelsDocument;
};

export interface V1AdminDocumentsUpdateParams {
  /** Document ID */
  id: number;
}

export type V1AdminDocumentsUpdateData = DtoSuccessResponse & {
  data?: ModelsDocument;
};

export interface V1AdminDocumentsDeleteParams {
  /** Document ID */
  id: number;
}

export type V1AdminDocumentsDeleteData = DtoSuccessResponse & {
  data?: string;
};

export type V1AdminPagesCreateData = DtoSuccessResponse & {
  data?: ModelsPage;
};

export interface V1AdminPagesDetailParams {
  /** Page ID */
  id: number;
}

export type V1AdminPagesDetailData = DtoSuccessResponse & {
  data?: ModelsPage;
};

export interface V1AdminPagesUpdateParams {
  /** Page ID */
  id: number;
}

export type V1AdminPagesUpdateData = DtoSuccessResponse & {
  data?: ModelsPage;
};

export interface V1AdminPagesDeleteParams {
  /** Page ID */
  id: number;
}

export type V1AdminPagesDeleteData = DtoSuccessResponse & {
  data?: object;
};

export type V1AdminTagsCreateData = DtoSuccessResponse & {
  data?: ModelsTag;
};

export interface V1AdminTagsDeleteParams {
  /** Tag ID */
  id: number;
}

export type V1AdminTagsDeleteData = DtoSuccessResponse;

export interface V1ArticlesListParams {
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Page size
   * @default 20
   */
  page_size?: number;
  /** Filter by category ID */
  category_id?: number;
  /** Filter by category slug */
  category_slug?: string;
  /** Filter by tag */
  tag?: string;
  /** Search query */
  q?: string;
  /**
   * Sort by field
   * @default "-published_at"
   */
  sort?: string;
  /** Filter featured articles */
  is_featured?: boolean;
}

export type V1ArticlesListData = DtoSuccessResponse & {
  data?: ModelsArticle[];
  pagination?: DtoPaginationResponse;
};

export interface V1ArticlesDetailParams {
  /** Article slug */
  slug: string;
}

export type V1ArticlesDetailData = DtoSuccessResponse & {
  data?: ModelsArticle;
};

export interface V1ArticlesRelatedListParams {
  /** Number of related articles (default: 5) */
  limit?: number;
  /** Article slug */
  slug: string;
}

export type V1ArticlesRelatedListData = DtoSuccessResponse & {
  data?: ModelsArticle[];
};

export type V1AuthLoginCreateData = DtoSuccessResponse & {
  data?: DtoLoginResponse;
};

export type V1AuthLogoutCreateData = DtoSuccessResponse;

export type V1AuthMeListData = DtoSuccessResponse & {
  data?: DtoUserResponse;
};

export type V1AuthRefreshCreateData = DtoSuccessResponse & {
  data?: DtoLoginResponse;
};

export type V1CategoriesListData = DtoSuccessResponse & {
  data?: ModelsCategory[];
};

export type V1CategoriesMenuListData = DtoSuccessResponse;

export interface V1CategoriesDetailParams {
  /** Category slug */
  slug: string;
}

export type V1CategoriesDetailData = DtoSuccessResponse & {
  data?: ModelsCategory;
};

export interface V1DocumentsListParams {
  /** Category ID */
  category_id?: number;
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Page size
   * @default 20
   */
  page_size?: number;
}

export type V1DocumentsListData = DtoSuccessResponse & {
  data?: ModelsDocument[];
};

export interface V1DocumentsDetailParams {
  /** Document slug */
  slug: string;
}

export type V1DocumentsDetailData = DtoSuccessResponse & {
  data?: ModelsDocument;
};

export type V1HealthzListData = Record<string, string>;

export interface V1HomeListParams {
  /**
   * Comma-separated category slugs
   * @example ""hoat-dong-cua-thu-truong,tin-quan-su""
   */
  sections?: string;
}

export type V1HomeListData = DtoSuccessResponse & {
  data?: HandlersHomeResponse;
};

export interface V1PagesListParams {
  /** Filter by group (e.g. introduction) */
  group?: string;
  /** Filter by status (draft, published) */
  status?: string;
}

export type V1PagesListData = DtoSuccessResponse & {
  data?: ModelsPage[];
};

export interface V1PagesDetailParams {
  /** Page slug (e.g. intro/history) */
  slug: string;
}

export type V1PagesDetailData = DtoSuccessResponse & {
  data?: ModelsPage;
};

export interface V1SearchListParams {
  /** Search keyword */
  q: string;
  /**
   * Page number
   * @default 1
   */
  page?: number;
  /**
   * Page size
   * @default 20
   */
  page_size?: number;
}

export type V1SearchListData = DtoSuccessResponse & {
  data?: ModelsArticle[];
  pagination?: DtoPaginationResponse;
};

export type V1TagsListData = DtoSuccessResponse & {
  data?: ModelsTag[];
};

export interface V1TagsDetailParams {
  /** Tag slug */
  slug: string;
}

export type V1TagsDetailData = DtoSuccessResponse & {
  data?: ModelsTag;
};

export interface BannersListParams2 {
  /** Placement (e.g., home_top, sidebar) */
  placement: string;
}

export type BannersListResult = DtoSuccessResponse & {
  data?: ModelsBanner[];
};

export interface MediaListParams2 {
  /** Media type filter (image, video) */
  media_type?: string;
  /** Category ID filter */
  category_id?: number;
  /** Page number (default: 1) */
  page?: number;
  /** Page size (default: 20, max: 100) */
  page_size?: number;
}

export type MediaListResult = DtoSuccessResponse & {
  data?: ModelsMediaItem[];
};

export interface MediaDetailParams2 {
  /** Media slug */
  slug: string;
}

export type MediaDetailResult = DtoSuccessResponse & {
  data?: ModelsMediaItem;
};
