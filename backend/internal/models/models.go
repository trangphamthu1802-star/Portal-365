package models

import "time"

type User struct {
	ID           int64     `json:"id" db:"id"`
	Email        string    `json:"email" db:"email"`
	PasswordHash string    `json:"-" db:"password_hash"`
	FullName     string    `json:"full_name" db:"full_name"`
	Avatar       string    `json:"avatar" db:"avatar"`
	IsActive     bool      `json:"is_active" db:"is_active"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

type Role struct {
	ID          int64     `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Description string    `json:"description" db:"description"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
}

type UserRole struct {
	UserID int64 `db:"user_id"`
	RoleID int64 `db:"role_id"`
}

type Category struct {
	ID          int64     `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Slug        string    `json:"slug" db:"slug"`
	Description string    `json:"description" db:"description"`
	ParentID    *int64    `json:"parent_id" db:"parent_id"`
	SortOrder   int       `json:"sort_order" db:"sort_order"`
	IsActive    bool      `json:"is_active" db:"is_active"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

type Tag struct {
	ID        int64     `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Slug      string    `json:"slug" db:"slug"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type ArticleStatus string

const (
	StatusDraft       ArticleStatus = "draft"
	StatusUnderReview ArticleStatus = "under_review"
	StatusPublished   ArticleStatus = "published"
	StatusHidden      ArticleStatus = "hidden"
	StatusRejected    ArticleStatus = "rejected"
)

type Article struct {
	ID            int64         `json:"id" db:"id"`
	Title         string        `json:"title" db:"title"`
	Slug          string        `json:"slug" db:"slug"`
	Summary       string        `json:"summary" db:"summary"`
	Content       string        `json:"content" db:"content"`
	FeaturedImage string        `json:"featured_image" db:"featured_image"`
	AuthorID      int64         `json:"author_id" db:"author_id"`
	CategoryID    int64         `json:"category_id" db:"category_id"`
	Status        ArticleStatus `json:"status" db:"status"`
	ViewCount     int64         `json:"view_count" db:"view_count"`
	IsFeatured    bool          `json:"is_featured" db:"is_featured"`
	PublishedAt   *time.Time    `json:"published_at" db:"published_at"`
	ScheduledAt   *time.Time    `json:"scheduled_at" db:"scheduled_at"`
	CreatedAt     time.Time     `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time     `json:"updated_at" db:"updated_at"`
}

type ArticleTag struct {
	ArticleID int64 `db:"article_id"`
	TagID     int64 `db:"tag_id"`
}

type ArticleRevision struct {
	ID        int64     `json:"id" db:"id"`
	ArticleID int64     `json:"article_id" db:"article_id"`
	Title     string    `json:"title" db:"title"`
	Content   string    `json:"content" db:"content"`
	UserID    int64     `json:"user_id" db:"user_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type MediaType string

const (
	MediaTypeImage MediaType = "image"
	MediaTypeVideo MediaType = "video"
)

type Media struct {
	ID         int64     `json:"id" db:"id"`
	Title      string    `json:"title" db:"title"`
	FileName   string    `json:"file_name" db:"file_name"`
	FilePath   string    `json:"file_path" db:"file_path"`
	FileSize   int64     `json:"file_size" db:"file_size"`
	MimeType   string    `json:"mime_type" db:"mime_type"`
	Type       MediaType `json:"type" db:"type"`
	UploadedBy int64     `json:"uploaded_by" db:"uploaded_by"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

type Comment struct {
	ID         int64     `json:"id" db:"id"`
	ArticleID  int64     `json:"article_id" db:"article_id"`
	UserID     *int64    `json:"user_id" db:"user_id"`
	AuthorName string    `json:"author_name" db:"author_name"`
	Content    string    `json:"content" db:"content"`
	IsApproved bool      `json:"is_approved" db:"is_approved"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

type Menu struct {
	ID        int64     `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Location  string    `json:"location" db:"location"`
	SortOrder int       `json:"sort_order" db:"sort_order"`
	IsActive  bool      `json:"is_active" db:"is_active"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type MenuItem struct {
	ID        int64  `json:"id" db:"id"`
	MenuID    int64  `json:"menu_id" db:"menu_id"`
	Label     string `json:"label" db:"label"`
	URL       string `json:"url" db:"url"`
	ParentID  *int64 `json:"parent_id" db:"parent_id"`
	SortOrder int    `json:"sort_order" db:"sort_order"`
	Target    string `json:"target" db:"target"` // _self, _blank
}

type Page struct {
	ID             int64      `json:"id" db:"id"`
	Title          string     `json:"title" db:"title"`
	Slug           string     `json:"slug" db:"slug"`
	Group          string     `json:"group" db:"group_name"`                // introduction, about, etc.
	Content        string     `json:"content" db:"content"`                 // HTML content
	Status         string     `json:"status" db:"status"`                   // draft, published
	Order          int        `json:"order" db:"sort_order"`                // for menu ordering
	HeroImageURL   *string    `json:"hero_image_url" db:"hero_image_url"`   // optional
	SeoTitle       *string    `json:"seo_title" db:"seo_title"`             // optional
	SeoDescription *string    `json:"seo_description" db:"seo_description"` // optional
	PublishedAt    *time.Time `json:"published_at" db:"published_at"`
	IsActive       bool       `json:"is_active" db:"is_active"`
	CreatedAt      time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at" db:"updated_at"`
}

type Banner struct {
	ID        int64      `json:"id" db:"id"`
	Title     string     `json:"title" db:"title"`
	ImageURL  string     `json:"image_url" db:"image_url"`
	LinkURL   string     `json:"link_url" db:"link_url"`
	Placement string     `json:"placement" db:"placement"` // home_hero, sidebar, etc.
	SortOrder int        `json:"sort_order" db:"sort_order"`
	IsActive  bool       `json:"is_active" db:"is_active"`
	StartDate *time.Time `json:"start_date" db:"start_date"`
	EndDate   *time.Time `json:"end_date" db:"end_date"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt time.Time  `json:"updated_at" db:"updated_at"`
}

type Setting struct {
	Key       string    `json:"key" db:"key"`
	Value     string    `json:"value" db:"value"`
	IsPublic  bool      `json:"is_public" db:"is_public"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type AuditLog struct {
	ID        int64     `json:"id" db:"id"`
	UserID    int64     `json:"user_id" db:"user_id"`
	Action    string    `json:"action" db:"action"`
	Entity    string    `json:"entity" db:"entity"`
	EntityID  int64     `json:"entity_id" db:"entity_id"`
	Details   string    `json:"details" db:"details"`
	IPAddress string    `json:"ip_address" db:"ip_address"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type RefreshToken struct {
	ID        int64     `json:"id" db:"id"`
	UserID    int64     `json:"user_id" db:"user_id"`
	Token     string    `json:"token" db:"token"`
	ExpiresAt time.Time `json:"expires_at" db:"expires_at"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type ViewLog struct {
	ArticleID int64     `db:"article_id"`
	IPAddress string    `db:"ip_address"`
	UserAgent string    `db:"user_agent"`
	ViewedAt  time.Time `db:"viewed_at"`
}
