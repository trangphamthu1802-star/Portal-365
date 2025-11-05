package repositories

import (
	"context"
	"database/sql"

	"github.com/thieugt95/portal-365/backend/internal/models"
)

// Media Repository
type MediaRepository interface {
	Create(ctx context.Context, media *models.Media) error
	GetByID(ctx context.Context, id int64) (*models.Media, error)
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, mediaType *string, page, pageSize int) ([]*models.Media, int, error)
}

type mediaRepository struct {
	db *sql.DB
}

func NewMediaRepository(db *sql.DB) MediaRepository {
	return &mediaRepository{db: db}
}

func (r *mediaRepository) Create(ctx context.Context, media *models.Media) error {
	result, err := r.db.ExecContext(ctx,
		`INSERT INTO media (title, file_name, file_path, file_size, mime_type, type, uploaded_by) 
		 VALUES (?, ?, ?, ?, ?, ?, ?)`,
		media.Title, media.FileName, media.FilePath, media.FileSize, media.MimeType, media.Type, media.UploadedBy)
	if err != nil {
		return err
	}
	media.ID, err = result.LastInsertId()
	return err
}

func (r *mediaRepository) GetByID(ctx context.Context, id int64) (*models.Media, error) {
	media := &models.Media{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, title, file_name, file_path, file_size, mime_type, type, uploaded_by, created_at 
		 FROM media WHERE id = ?`, id).Scan(
		&media.ID, &media.Title, &media.FileName, &media.FilePath, &media.FileSize,
		&media.MimeType, &media.Type, &media.UploadedBy, &media.CreatedAt)
	if err != nil {
		return nil, err
	}
	return media, nil
}

func (r *mediaRepository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM media WHERE id = ?`, id)
	return err
}

func (r *mediaRepository) List(ctx context.Context, mediaType *string, page, pageSize int) ([]*models.Media, int, error) {
	offset := (page - 1) * pageSize

	whereClause := ""
	args := []interface{}{}
	if mediaType != nil {
		whereClause = "WHERE type = ?"
		args = append(args, *mediaType)
	}

	var total int
	countQuery := `SELECT COUNT(*) FROM media ` + whereClause
	err := r.db.QueryRowContext(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	query := `SELECT id, title, file_name, file_path, file_size, mime_type, type, uploaded_by, created_at 
		      FROM media ` + whereClause + ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
	args = append(args, pageSize, offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	mediaList := make([]*models.Media, 0)
	for rows.Next() {
		media := &models.Media{}
		if err := rows.Scan(&media.ID, &media.Title, &media.FileName, &media.FilePath,
			&media.FileSize, &media.MimeType, &media.Type, &media.UploadedBy, &media.CreatedAt); err != nil {
			return nil, 0, err
		}
		mediaList = append(mediaList, media)
	}

	return mediaList, total, rows.Err()
}

// Comment Repository
type CommentRepository interface {
	Create(ctx context.Context, comment *models.Comment) error
	GetByArticleID(ctx context.Context, articleID int64, approvedOnly bool) ([]*models.Comment, error)
	Approve(ctx context.Context, id int64) error
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, approvedOnly bool, page, pageSize int) ([]*models.Comment, int, error)
}

type commentRepository struct {
	db *sql.DB
}

func NewCommentRepository(db *sql.DB) CommentRepository {
	return &commentRepository{db: db}
}

func (r *commentRepository) Create(ctx context.Context, comment *models.Comment) error {
	result, err := r.db.ExecContext(ctx,
		`INSERT INTO comments (article_id, user_id, author_name, content, is_approved) 
		 VALUES (?, ?, ?, ?, ?)`,
		comment.ArticleID, comment.UserID, comment.AuthorName, comment.Content, comment.IsApproved)
	if err != nil {
		return err
	}
	comment.ID, err = result.LastInsertId()
	return err
}

func (r *commentRepository) GetByArticleID(ctx context.Context, articleID int64, approvedOnly bool) ([]*models.Comment, error) {
	query := `SELECT id, article_id, user_id, author_name, content, is_approved, created_at 
		      FROM comments WHERE article_id = ?`
	args := []interface{}{articleID}

	if approvedOnly {
		query += ` AND is_approved = 1`
	}
	query += ` ORDER BY created_at DESC`

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	comments := make([]*models.Comment, 0)
	for rows.Next() {
		comment := &models.Comment{}
		if err := rows.Scan(&comment.ID, &comment.ArticleID, &comment.UserID, &comment.AuthorName,
			&comment.Content, &comment.IsApproved, &comment.CreatedAt); err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}

	return comments, rows.Err()
}

func (r *commentRepository) Approve(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE comments SET is_approved = 1 WHERE id = ?`, id)
	return err
}

func (r *commentRepository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM comments WHERE id = ?`, id)
	return err
}

func (r *commentRepository) List(ctx context.Context, approvedOnly bool, page, pageSize int) ([]*models.Comment, int, error) {
	offset := (page - 1) * pageSize

	whereClause := ""
	if approvedOnly {
		whereClause = "WHERE is_approved = 1"
	}

	var total int
	countQuery := `SELECT COUNT(*) FROM comments ` + whereClause
	err := r.db.QueryRowContext(ctx, countQuery).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	query := `SELECT id, article_id, user_id, author_name, content, is_approved, created_at 
		      FROM comments ` + whereClause + ` ORDER BY created_at DESC LIMIT ? OFFSET ?`

	rows, err := r.db.QueryContext(ctx, query, pageSize, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	comments := make([]*models.Comment, 0)
	for rows.Next() {
		comment := &models.Comment{}
		if err := rows.Scan(&comment.ID, &comment.ArticleID, &comment.UserID, &comment.AuthorName,
			&comment.Content, &comment.IsApproved, &comment.CreatedAt); err != nil {
			return nil, 0, err
		}
		comments = append(comments, comment)
	}

	return comments, total, rows.Err()
}

// Menu Repository
type MenuRepository interface {
	Create(ctx context.Context, menu *models.Menu) error
	GetByID(ctx context.Context, id int64) (*models.Menu, error)
	Update(ctx context.Context, menu *models.Menu) error
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context) ([]*models.Menu, error)
	GetByLocation(ctx context.Context, location string) (*models.Menu, error)
	AddMenuItem(ctx context.Context, item *models.MenuItem) error
	GetMenuItems(ctx context.Context, menuID int64) ([]*models.MenuItem, error)
	DeleteMenuItem(ctx context.Context, id int64) error
}

type menuRepository struct {
	db *sql.DB
}

func NewMenuRepository(db *sql.DB) MenuRepository {
	return &menuRepository{db: db}
}

func (r *menuRepository) Create(ctx context.Context, menu *models.Menu) error {
	result, err := r.db.ExecContext(ctx,
		`INSERT INTO menus (name, location, sort_order, is_active) VALUES (?, ?, ?, ?)`,
		menu.Name, menu.Location, menu.SortOrder, menu.IsActive)
	if err != nil {
		return err
	}
	menu.ID, err = result.LastInsertId()
	return err
}

func (r *menuRepository) GetByID(ctx context.Context, id int64) (*models.Menu, error) {
	menu := &models.Menu{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, name, location, sort_order, is_active, created_at, updated_at 
		 FROM menus WHERE id = ?`, id).Scan(
		&menu.ID, &menu.Name, &menu.Location, &menu.SortOrder, &menu.IsActive,
		&menu.CreatedAt, &menu.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return menu, nil
}

func (r *menuRepository) Update(ctx context.Context, menu *models.Menu) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE menus SET name = ?, location = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
		 WHERE id = ?`,
		menu.Name, menu.Location, menu.SortOrder, menu.IsActive, menu.ID)
	return err
}

func (r *menuRepository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM menus WHERE id = ?`, id)
	return err
}

func (r *menuRepository) List(ctx context.Context) ([]*models.Menu, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, name, location, sort_order, is_active, created_at, updated_at 
		 FROM menus ORDER BY sort_order, name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	menus := make([]*models.Menu, 0)
	for rows.Next() {
		menu := &models.Menu{}
		if err := rows.Scan(&menu.ID, &menu.Name, &menu.Location, &menu.SortOrder,
			&menu.IsActive, &menu.CreatedAt, &menu.UpdatedAt); err != nil {
			return nil, err
		}
		menus = append(menus, menu)
	}

	return menus, rows.Err()
}

func (r *menuRepository) GetByLocation(ctx context.Context, location string) (*models.Menu, error) {
	menu := &models.Menu{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, name, location, sort_order, is_active, created_at, updated_at 
		 FROM menus WHERE location = ? AND is_active = 1`, location).Scan(
		&menu.ID, &menu.Name, &menu.Location, &menu.SortOrder, &menu.IsActive,
		&menu.CreatedAt, &menu.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return menu, nil
}

func (r *menuRepository) AddMenuItem(ctx context.Context, item *models.MenuItem) error {
	result, err := r.db.ExecContext(ctx,
		`INSERT INTO menu_items (menu_id, label, url, parent_id, sort_order, target) 
		 VALUES (?, ?, ?, ?, ?, ?)`,
		item.MenuID, item.Label, item.URL, item.ParentID, item.SortOrder, item.Target)
	if err != nil {
		return err
	}
	item.ID, err = result.LastInsertId()
	return err
}

func (r *menuRepository) GetMenuItems(ctx context.Context, menuID int64) ([]*models.MenuItem, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, menu_id, label, url, parent_id, sort_order, target 
		 FROM menu_items WHERE menu_id = ? ORDER BY sort_order, label`,
		menuID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]*models.MenuItem, 0)
	for rows.Next() {
		item := &models.MenuItem{}
		if err := rows.Scan(&item.ID, &item.MenuID, &item.Label, &item.URL,
			&item.ParentID, &item.SortOrder, &item.Target); err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	return items, rows.Err()
}

func (r *menuRepository) DeleteMenuItem(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM menu_items WHERE id = ?`, id)
	return err
}

// Page, Banner, Setting, AuditLog repositories
type PageRepository interface {
	Create(ctx context.Context, page *models.Page) error
	GetByID(ctx context.Context, id int64) (*models.Page, error)
	GetBySlug(ctx context.Context, slug string) (*models.Page, error)
	Update(ctx context.Context, page *models.Page) error
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, group *string, status *string) ([]*models.Page, error)
}

type pageRepository struct {
	db *sql.DB
}

func NewPageRepository(db *sql.DB) PageRepository {
	return &pageRepository{db: db}
}

func (r *pageRepository) Create(ctx context.Context, page *models.Page) error {
	result, err := r.db.ExecContext(ctx,
		`INSERT INTO pages (title, slug, group_name, content, status, sort_order, hero_image_url, seo_title, seo_description, published_at, is_active) 
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		page.Title, page.Slug, page.Group, page.Content, page.Status, page.Order,
		page.HeroImageURL, page.SeoTitle, page.SeoDescription, page.PublishedAt, page.IsActive)
	if err != nil {
		return err
	}
	page.ID, err = result.LastInsertId()
	return err
}

func (r *pageRepository) GetByID(ctx context.Context, id int64) (*models.Page, error) {
	page := &models.Page{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, title, slug, group_name, content, status, sort_order, hero_image_url, seo_title, seo_description, 
		        published_at, is_active, created_at, updated_at 
		 FROM pages WHERE id = ?`, id).Scan(
		&page.ID, &page.Title, &page.Slug, &page.Group, &page.Content, &page.Status, &page.Order,
		&page.HeroImageURL, &page.SeoTitle, &page.SeoDescription, &page.PublishedAt,
		&page.IsActive, &page.CreatedAt, &page.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return page, nil
}

func (r *pageRepository) GetBySlug(ctx context.Context, slug string) (*models.Page, error) {
	page := &models.Page{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, title, slug, group_name, content, status, sort_order, hero_image_url, seo_title, seo_description,
		        published_at, is_active, created_at, updated_at 
		 FROM pages WHERE slug = ?`, slug).Scan(
		&page.ID, &page.Title, &page.Slug, &page.Group, &page.Content, &page.Status, &page.Order,
		&page.HeroImageURL, &page.SeoTitle, &page.SeoDescription, &page.PublishedAt,
		&page.IsActive, &page.CreatedAt, &page.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return page, nil
}

func (r *pageRepository) Update(ctx context.Context, page *models.Page) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE pages SET title = ?, slug = ?, group_name = ?, content = ?, status = ?, sort_order = ?,
		        hero_image_url = ?, seo_title = ?, seo_description = ?, published_at = ?, is_active = ?, 
		        updated_at = CURRENT_TIMESTAMP 
		 WHERE id = ?`,
		page.Title, page.Slug, page.Group, page.Content, page.Status, page.Order,
		page.HeroImageURL, page.SeoTitle, page.SeoDescription, page.PublishedAt, page.IsActive, page.ID)
	return err
}

func (r *pageRepository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM pages WHERE id = ?`, id)
	return err
}

func (r *pageRepository) List(ctx context.Context, group *string, status *string) ([]*models.Page, error) {
	query := `SELECT id, title, slug, group_name, content, status, sort_order, hero_image_url, seo_title, seo_description,
	                 published_at, is_active, created_at, updated_at 
	          FROM pages WHERE 1=1`
	args := []interface{}{}

	if group != nil && *group != "" {
		query += " AND group_name = ?"
		args = append(args, *group)
	}
	if status != nil && *status != "" {
		query += " AND status = ?"
		args = append(args, *status)
	}

	query += " ORDER BY sort_order, title"

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	pages := make([]*models.Page, 0)
	for rows.Next() {
		page := &models.Page{}
		if err := rows.Scan(&page.ID, &page.Title, &page.Slug, &page.Group, &page.Content,
			&page.Status, &page.Order, &page.HeroImageURL, &page.SeoTitle, &page.SeoDescription,
			&page.PublishedAt, &page.IsActive, &page.CreatedAt, &page.UpdatedAt); err != nil {
			return nil, err
		}
		pages = append(pages, page)
	}

	return pages, rows.Err()
}

type BannerRepository interface {
	Create(ctx context.Context, banner *models.Banner) error
	GetByID(ctx context.Context, id int64) (*models.Banner, error)
	Update(ctx context.Context, banner *models.Banner) error
	Delete(ctx context.Context, id int64) error
	GetByPlacement(ctx context.Context, placement string) ([]*models.Banner, error)
	List(ctx context.Context) ([]*models.Banner, error)
}

type bannerRepository struct {
	db *sql.DB
}

func NewBannerRepository(db *sql.DB) BannerRepository {
	return &bannerRepository{db: db}
}

func (r *bannerRepository) Create(ctx context.Context, banner *models.Banner) error {
	result, err := r.db.ExecContext(ctx,
		`INSERT INTO banners (title, image_url, link_url, placement, sort_order, is_active, start_date, end_date) 
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		banner.Title, banner.ImageURL, banner.LinkURL, banner.Placement, banner.SortOrder,
		banner.IsActive, banner.StartDate, banner.EndDate)
	if err != nil {
		return err
	}
	banner.ID, err = result.LastInsertId()
	return err
}

func (r *bannerRepository) GetByID(ctx context.Context, id int64) (*models.Banner, error) {
	banner := &models.Banner{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, title, image_url, link_url, placement, sort_order, is_active, start_date, end_date, created_at, updated_at 
		 FROM banners WHERE id = ?`, id).Scan(
		&banner.ID, &banner.Title, &banner.ImageURL, &banner.LinkURL, &banner.Placement,
		&banner.SortOrder, &banner.IsActive, &banner.StartDate, &banner.EndDate,
		&banner.CreatedAt, &banner.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return banner, nil
}

func (r *bannerRepository) Update(ctx context.Context, banner *models.Banner) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE banners SET title = ?, image_url = ?, link_url = ?, placement = ?, sort_order = ?, 
		 is_active = ?, start_date = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP 
		 WHERE id = ?`,
		banner.Title, banner.ImageURL, banner.LinkURL, banner.Placement, banner.SortOrder,
		banner.IsActive, banner.StartDate, banner.EndDate, banner.ID)
	return err
}

func (r *bannerRepository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM banners WHERE id = ?`, id)
	return err
}

func (r *bannerRepository) GetByPlacement(ctx context.Context, placement string) ([]*models.Banner, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, title, image_url, link_url, placement, sort_order, is_active, start_date, end_date, created_at, updated_at 
		 FROM banners 
		 WHERE placement = ? AND is_active = 1 
		   AND (start_date IS NULL OR start_date <= CURRENT_TIMESTAMP)
		   AND (end_date IS NULL OR end_date >= CURRENT_TIMESTAMP)
		 ORDER BY sort_order`,
		placement)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	banners := make([]*models.Banner, 0)
	for rows.Next() {
		banner := &models.Banner{}
		if err := rows.Scan(&banner.ID, &banner.Title, &banner.ImageURL, &banner.LinkURL,
			&banner.Placement, &banner.SortOrder, &banner.IsActive, &banner.StartDate,
			&banner.EndDate, &banner.CreatedAt, &banner.UpdatedAt); err != nil {
			return nil, err
		}
		banners = append(banners, banner)
	}

	return banners, rows.Err()
}

func (r *bannerRepository) List(ctx context.Context) ([]*models.Banner, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, title, image_url, link_url, placement, sort_order, is_active, start_date, end_date, created_at, updated_at 
		 FROM banners ORDER BY placement, sort_order`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	banners := make([]*models.Banner, 0)
	for rows.Next() {
		banner := &models.Banner{}
		if err := rows.Scan(&banner.ID, &banner.Title, &banner.ImageURL, &banner.LinkURL,
			&banner.Placement, &banner.SortOrder, &banner.IsActive, &banner.StartDate,
			&banner.EndDate, &banner.CreatedAt, &banner.UpdatedAt); err != nil {
			return nil, err
		}
		banners = append(banners, banner)
	}

	return banners, rows.Err()
}

type SettingRepository interface {
	Get(ctx context.Context, key string) (*models.Setting, error)
	Set(ctx context.Context, setting *models.Setting) error
	GetPublic(ctx context.Context) ([]*models.Setting, error)
	GetAll(ctx context.Context) ([]*models.Setting, error)
}

type settingRepository struct {
	db *sql.DB
}

func NewSettingRepository(db *sql.DB) SettingRepository {
	return &settingRepository{db: db}
}

func (r *settingRepository) Get(ctx context.Context, key string) (*models.Setting, error) {
	setting := &models.Setting{}
	err := r.db.QueryRowContext(ctx,
		`SELECT key, value, is_public, updated_at FROM settings WHERE key = ?`, key).Scan(
		&setting.Key, &setting.Value, &setting.IsPublic, &setting.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return setting, nil
}

func (r *settingRepository) Set(ctx context.Context, setting *models.Setting) error {
	_, err := r.db.ExecContext(ctx,
		`INSERT INTO settings (key, value, is_public) VALUES (?, ?, ?) 
		 ON CONFLICT(key) DO UPDATE SET value = excluded.value, is_public = excluded.is_public, updated_at = CURRENT_TIMESTAMP`,
		setting.Key, setting.Value, setting.IsPublic)
	return err
}

func (r *settingRepository) GetPublic(ctx context.Context) ([]*models.Setting, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT key, value, is_public, updated_at FROM settings WHERE is_public = 1`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	settings := make([]*models.Setting, 0)
	for rows.Next() {
		setting := &models.Setting{}
		if err := rows.Scan(&setting.Key, &setting.Value, &setting.IsPublic, &setting.UpdatedAt); err != nil {
			return nil, err
		}
		settings = append(settings, setting)
	}

	return settings, rows.Err()
}

func (r *settingRepository) GetAll(ctx context.Context) ([]*models.Setting, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT key, value, is_public, updated_at FROM settings`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	settings := make([]*models.Setting, 0)
	for rows.Next() {
		setting := &models.Setting{}
		if err := rows.Scan(&setting.Key, &setting.Value, &setting.IsPublic, &setting.UpdatedAt); err != nil {
			return nil, err
		}
		settings = append(settings, setting)
	}

	return settings, rows.Err()
}

type AuditLogRepository interface {
	Create(ctx context.Context, log *models.AuditLog) error
	List(ctx context.Context, userID *int64, page, pageSize int) ([]*models.AuditLog, int, error)
}

type auditLogRepository struct {
	db *sql.DB
}

func NewAuditLogRepository(db *sql.DB) AuditLogRepository {
	return &auditLogRepository{db: db}
}

func (r *auditLogRepository) Create(ctx context.Context, log *models.AuditLog) error {
	result, err := r.db.ExecContext(ctx,
		`INSERT INTO audit_logs (user_id, action, entity, entity_id, details, ip_address) 
		 VALUES (?, ?, ?, ?, ?, ?)`,
		log.UserID, log.Action, log.Entity, log.EntityID, log.Details, log.IPAddress)
	if err != nil {
		return err
	}
	log.ID, err = result.LastInsertId()
	return err
}

func (r *auditLogRepository) List(ctx context.Context, userID *int64, page, pageSize int) ([]*models.AuditLog, int, error) {
	offset := (page - 1) * pageSize

	whereClause := ""
	args := []interface{}{}
	if userID != nil {
		whereClause = "WHERE user_id = ?"
		args = append(args, *userID)
	}

	var total int
	countQuery := `SELECT COUNT(*) FROM audit_logs ` + whereClause
	err := r.db.QueryRowContext(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	query := `SELECT id, user_id, action, entity, entity_id, details, ip_address, created_at 
		      FROM audit_logs ` + whereClause + ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
	args = append(args, pageSize, offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	logs := make([]*models.AuditLog, 0)
	for rows.Next() {
		log := &models.AuditLog{}
		if err := rows.Scan(&log.ID, &log.UserID, &log.Action, &log.Entity, &log.EntityID,
			&log.Details, &log.IPAddress, &log.CreatedAt); err != nil {
			return nil, 0, err
		}
		logs = append(logs, log)
	}

	return logs, total, rows.Err()
}
