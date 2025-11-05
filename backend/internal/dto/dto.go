package dto

import "time"

// Common
type PaginationResponse struct {
	Page       int `json:"page"`
	PageSize   int `json:"page_size"`
	Total      int `json:"total"`
	TotalPages int `json:"total_pages"`
}

type SuccessResponse struct {
	Data       interface{}         `json:"data"`
	Pagination *PaginationResponse `json:"pagination,omitempty"`
}

type ErrorDetail struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}

type ErrorResponse struct {
	Error ErrorDetail `json:"error"`
}

// Auth
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	AccessToken  string        `json:"access_token"`
	RefreshToken string        `json:"refresh_token"`
	ExpiresAt    time.Time     `json:"expires_at"`
	User         *UserResponse `json:"user"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// User
type CreateUserRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	FullName string `json:"full_name" binding:"required"`
	Avatar   string `json:"avatar"`
}

type UpdateUserRequest struct {
	Email    string `json:"email" binding:"required,email"`
	FullName string `json:"full_name" binding:"required"`
	Avatar   string `json:"avatar"`
	IsActive bool   `json:"is_active"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=8"`
}

type UserResponse struct {
	ID        int64     `json:"id"`
	Email     string    `json:"email"`
	FullName  string    `json:"full_name"`
	Avatar    string    `json:"avatar"`
	IsActive  bool      `json:"is_active"`
	Roles     []string  `json:"roles"`
	CreatedAt time.Time `json:"created_at"`
}

// Category
type CreateCategoryRequest struct {
	Name        string `json:"name" binding:"required"`
	Slug        string `json:"slug" binding:"required"`
	Description string `json:"description"`
	ParentID    *int64 `json:"parent_id"`
	SortOrder   int    `json:"sort_order"`
	IsActive    bool   `json:"is_active"`
}

type UpdateCategoryRequest struct {
	Name        string `json:"name" binding:"required"`
	Slug        string `json:"slug" binding:"required"`
	Description string `json:"description"`
	ParentID    *int64 `json:"parent_id"`
	SortOrder   int    `json:"sort_order"`
	IsActive    bool   `json:"is_active"`
}

// Tag
type CreateTagRequest struct {
	Name string `json:"name" binding:"required"`
	Slug string `json:"slug" binding:"required"`
}

// Article
type CreateArticleRequest struct {
	Title         string     `json:"title" binding:"required"`
	Slug          string     `json:"slug" binding:"required"`
	Summary       string     `json:"summary"`
	Content       string     `json:"content" binding:"required"`
	FeaturedImage string     `json:"featured_image"`
	CategoryID    int64      `json:"category_id" binding:"required"`
	TagIDs        []int64    `json:"tag_ids"`
	IsFeatured    bool       `json:"is_featured"`
	ScheduledAt   *time.Time `json:"scheduled_at"`
}

type UpdateArticleRequest struct {
	Title         string     `json:"title" binding:"required"`
	Slug          string     `json:"slug" binding:"required"`
	Summary       string     `json:"summary"`
	Content       string     `json:"content" binding:"required"`
	FeaturedImage string     `json:"featured_image"`
	CategoryID    int64      `json:"category_id" binding:"required"`
	TagIDs        []int64    `json:"tag_ids"`
	IsFeatured    bool       `json:"is_featured"`
	ScheduledAt   *time.Time `json:"scheduled_at"`
}

type ArticleResponse struct {
	ID            int64      `json:"id"`
	Title         string     `json:"title"`
	Slug          string     `json:"slug"`
	Summary       string     `json:"summary"`
	Content       string     `json:"content"`
	FeaturedImage string     `json:"featured_image"`
	AuthorID      int64      `json:"author_id"`
	AuthorName    string     `json:"author_name,omitempty"`
	CategoryID    int64      `json:"category_id"`
	CategoryName  string     `json:"category_name,omitempty"`
	Status        string     `json:"status"`
	ViewCount     int64      `json:"view_count"`
	IsFeatured    bool       `json:"is_featured"`
	Tags          []string   `json:"tags,omitempty"`
	PublishedAt   *time.Time `json:"published_at"`
	ScheduledAt   *time.Time `json:"scheduled_at"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

// Comment
type CreateCommentRequest struct {
	ArticleID  int64  `json:"article_id" binding:"required"`
	AuthorName string `json:"author_name" binding:"required"`
	Content    string `json:"content" binding:"required"`
}

// Page
type CreatePageRequest struct {
	Title          string  `json:"title" binding:"required"`
	Slug           string  `json:"slug" binding:"required"`
	Group          string  `json:"group" binding:"required"`
	Content        string  `json:"content" binding:"required"`
	Status         string  `json:"status" binding:"required,oneof=draft published"`
	Order          int     `json:"order"`
	HeroImageURL   *string `json:"hero_image_url"`
	SeoTitle       *string `json:"seo_title"`
	SeoDescription *string `json:"seo_description"`
}

type UpdatePageRequest struct {
	Title          string  `json:"title" binding:"required"`
	Slug           string  `json:"slug" binding:"required"`
	Group          string  `json:"group" binding:"required"`
	Content        string  `json:"content" binding:"required"`
	Status         string  `json:"status" binding:"required,oneof=draft published"`
	Order          int     `json:"order"`
	HeroImageURL   *string `json:"hero_image_url"`
	SeoTitle       *string `json:"seo_title"`
	SeoDescription *string `json:"seo_description"`
	IsActive       bool    `json:"is_active"`
}

// Menu
type CreateMenuRequest struct {
	Name      string `json:"name" binding:"required"`
	Location  string `json:"location" binding:"required"`
	SortOrder int    `json:"sort_order"`
	IsActive  bool   `json:"is_active"`
}

type CreateMenuItemRequest struct {
	Label     string `json:"label" binding:"required"`
	URL       string `json:"url" binding:"required"`
	ParentID  *int64 `json:"parent_id"`
	SortOrder int    `json:"sort_order"`
	Target    string `json:"target"`
}

// Banner
type CreateBannerRequest struct {
	Title     string     `json:"title" binding:"required"`
	ImageURL  string     `json:"image_url" binding:"required"`
	LinkURL   string     `json:"link_url"`
	Placement string     `json:"placement" binding:"required"`
	SortOrder int        `json:"sort_order"`
	IsActive  bool       `json:"is_active"`
	StartDate *time.Time `json:"start_date"`
	EndDate   *time.Time `json:"end_date"`
}

type UpdateBannerRequest struct {
	Title     string     `json:"title" binding:"required"`
	ImageURL  string     `json:"image_url" binding:"required"`
	LinkURL   string     `json:"link_url"`
	Placement string     `json:"placement" binding:"required"`
	SortOrder int        `json:"sort_order"`
	IsActive  bool       `json:"is_active"`
	StartDate *time.Time `json:"start_date"`
	EndDate   *time.Time `json:"end_date"`
}

// Setting
type UpdateSettingRequest struct {
	Value    string `json:"value" binding:"required"`
	IsPublic bool   `json:"is_public"`
}

// Stats
type StatsResponse struct {
	TotalArticles     int64 `json:"total_articles"`
	PublishedArticles int64 `json:"published_articles"`
	TotalUsers        int64 `json:"total_users"`
	TotalCategories   int64 `json:"total_categories"`
	TotalComments     int64 `json:"total_comments"`
}
