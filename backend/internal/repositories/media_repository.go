package repositories

import (
	"context"
	"database/sql"
	"time"

	"github.com/thieugt95/portal-365/backend/internal/models"
)

type MediaItemRepository interface {
	Create(ctx context.Context, media *models.MediaItem) error
	GetByID(ctx context.Context, id int64) (*models.MediaItem, error)
	GetBySlug(ctx context.Context, slug string) (*models.MediaItem, error)
	Update(ctx context.Context, media *models.MediaItem) error
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, mediaType, status string, categoryID *int64, page, pageSize int) ([]models.MediaItem, int, error)
	ListPublished(ctx context.Context, mediaType string, categoryID *int64, page, pageSize int) ([]models.MediaItem, int, error)
	IncrementViewCount(ctx context.Context, id int64) error
}

type mediaItemRepository struct {
	db *sql.DB
}

func NewMediaItemRepository(db *sql.DB) MediaItemRepository {
	return &mediaItemRepository{db: db}
}

func (r *mediaItemRepository) Create(ctx context.Context, media *models.MediaItem) error {
	now := time.Now()
	media.CreatedAt = now
	media.UpdatedAt = now

	result, err := r.db.ExecContext(ctx,
		`INSERT INTO media_items (title, slug, description, category_id, media_type, url, 
		 thumbnail_url, duration, width, height, uploaded_by, status, published_at, 
		 created_at, updated_at) 
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		media.Title, media.Slug, media.Description, media.CategoryID, media.MediaType,
		media.URL, media.ThumbnailURL, media.Duration, media.Width, media.Height,
		media.UploadedBy, media.Status, media.PublishedAt, media.CreatedAt, media.UpdatedAt)
	if err != nil {
		return err
	}

	media.ID, err = result.LastInsertId()
	return err
}

func (r *mediaItemRepository) GetByID(ctx context.Context, id int64) (*models.MediaItem, error) {
	media := &models.MediaItem{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, title, slug, description, category_id, media_type, url, thumbnail_url, 
		 duration, width, height, uploaded_by, view_count, status, published_at, 
		 created_at, updated_at 
		 FROM media_items WHERE id = ?`, id).Scan(
		&media.ID, &media.Title, &media.Slug, &media.Description, &media.CategoryID,
		&media.MediaType, &media.URL, &media.ThumbnailURL, &media.Duration, &media.Width,
		&media.Height, &media.UploadedBy, &media.ViewCount, &media.Status, &media.PublishedAt,
		&media.CreatedAt, &media.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return media, nil
}

func (r *mediaItemRepository) GetBySlug(ctx context.Context, slug string) (*models.MediaItem, error) {
	media := &models.MediaItem{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, title, slug, description, category_id, media_type, url, thumbnail_url, 
		 duration, width, height, uploaded_by, view_count, status, published_at, 
		 created_at, updated_at 
		 FROM media_items WHERE slug = ?`, slug).Scan(
		&media.ID, &media.Title, &media.Slug, &media.Description, &media.CategoryID,
		&media.MediaType, &media.URL, &media.ThumbnailURL, &media.Duration, &media.Width,
		&media.Height, &media.UploadedBy, &media.ViewCount, &media.Status, &media.PublishedAt,
		&media.CreatedAt, &media.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return media, nil
}

func (r *mediaItemRepository) Update(ctx context.Context, media *models.MediaItem) error {
	media.UpdatedAt = time.Now()

	_, err := r.db.ExecContext(ctx,
		`UPDATE media_items SET title = ?, slug = ?, description = ?, category_id = ?, 
		 media_type = ?, url = ?, thumbnail_url = ?, duration = ?, width = ?, height = ?, 
		 status = ?, published_at = ?, updated_at = ? 
		 WHERE id = ?`,
		media.Title, media.Slug, media.Description, media.CategoryID, media.MediaType,
		media.URL, media.ThumbnailURL, media.Duration, media.Width, media.Height,
		media.Status, media.PublishedAt, media.UpdatedAt, media.ID)
	return err
}

func (r *mediaItemRepository) Delete(ctx context.Context, id int64) error {
	result, err := r.db.ExecContext(ctx, `DELETE FROM media_items WHERE id = ?`, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *mediaItemRepository) List(ctx context.Context, mediaType, status string, categoryID *int64, page, pageSize int) ([]models.MediaItem, int, error) {
	offset := (page - 1) * pageSize

	query := `SELECT id, title, slug, description, category_id, media_type, url, thumbnail_url, 
	          duration, width, height, uploaded_by, view_count, status, published_at, 
	          created_at, updated_at FROM media_items WHERE 1=1`
	countQuery := `SELECT COUNT(*) FROM media_items WHERE 1=1`
	args := []interface{}{}

	if mediaType != "" {
		query += " AND media_type = ?"
		countQuery += " AND media_type = ?"
		args = append(args, mediaType)
	}

	if status != "" {
		query += " AND status = ?"
		countQuery += " AND status = ?"
		args = append(args, status)
	}

	if categoryID != nil {
		query += " AND category_id = ?"
		countQuery += " AND category_id = ?"
		args = append(args, *categoryID)
	}

	// Get total count
	var total int
	err := r.db.QueryRowContext(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Get media items
	query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
	args = append(args, pageSize, offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	items := []models.MediaItem{}
	for rows.Next() {
		var media models.MediaItem
		if err := rows.Scan(&media.ID, &media.Title, &media.Slug, &media.Description,
			&media.CategoryID, &media.MediaType, &media.URL, &media.ThumbnailURL,
			&media.Duration, &media.Width, &media.Height, &media.UploadedBy,
			&media.ViewCount, &media.Status, &media.PublishedAt,
			&media.CreatedAt, &media.UpdatedAt); err != nil {
			return nil, 0, err
		}
		items = append(items, media)
	}

	return items, total, rows.Err()
}

func (r *mediaItemRepository) ListPublished(ctx context.Context, mediaType string, categoryID *int64, page, pageSize int) ([]models.MediaItem, int, error) {
	offset := (page - 1) * pageSize

	query := `SELECT id, title, slug, description, category_id, media_type, url, thumbnail_url, 
	          duration, width, height, uploaded_by, view_count, status, published_at, 
	          created_at, updated_at FROM media_items WHERE status = 'published'`
	countQuery := `SELECT COUNT(*) FROM media_items WHERE status = 'published'`
	args := []interface{}{}

	if mediaType != "" {
		query += " AND media_type = ?"
		countQuery += " AND media_type = ?"
		args = append(args, mediaType)
	}

	if categoryID != nil {
		query += " AND category_id = ?"
		countQuery += " AND category_id = ?"
		args = append(args, *categoryID)
	}

	// Get total count
	var total int
	err := r.db.QueryRowContext(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Get media items
	query += " ORDER BY published_at DESC LIMIT ? OFFSET ?"
	args = append(args, pageSize, offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	items := []models.MediaItem{}
	for rows.Next() {
		var media models.MediaItem
		if err := rows.Scan(&media.ID, &media.Title, &media.Slug, &media.Description,
			&media.CategoryID, &media.MediaType, &media.URL, &media.ThumbnailURL,
			&media.Duration, &media.Width, &media.Height, &media.UploadedBy,
			&media.ViewCount, &media.Status, &media.PublishedAt,
			&media.CreatedAt, &media.UpdatedAt); err != nil {
			return nil, 0, err
		}
		items = append(items, media)
	}

	return items, total, rows.Err()
}

func (r *mediaItemRepository) IncrementViewCount(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE media_items SET view_count = view_count + 1 WHERE id = ?`, id)
	return err
}
