package repositories

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/thieugt95/portal-365/backend/internal/models"
)

type ArticleFilter struct {
	CategoryID   *int64
	CategorySlug *string
	AuthorID     *int64
	Status       *string
	Tag          *string
	TagSlugs     []string // Support multiple tags
	IsFeatured   *bool
	FromDate     *time.Time
	ToDate       *time.Time
	Query        *string
}

type ArticleRepository interface {
	Create(ctx context.Context, article *models.Article) error
	GetByID(ctx context.Context, id int64) (*models.Article, error)
	GetBySlug(ctx context.Context, slug string) (*models.Article, error)
	Update(ctx context.Context, article *models.Article) error
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, filter *ArticleFilter, page, pageSize int, sortBy string) ([]*models.Article, int, error)
	UpdateStatus(ctx context.Context, id int64, status models.ArticleStatus) error
	IncrementViewCount(ctx context.Context, id int64) error
	GetRelated(ctx context.Context, articleID int64, limit int) ([]*models.Article, error)
	AddTag(ctx context.Context, articleID, tagID int64) error
	RemoveTag(ctx context.Context, articleID, tagID int64) error
	GetTags(ctx context.Context, articleID int64) ([]*models.Tag, error)
	CreateRevision(ctx context.Context, revision *models.ArticleRevision) error
	GetRevisions(ctx context.Context, articleID int64) ([]*models.ArticleRevision, error)
	RecordView(ctx context.Context, articleID int64, ipAddress, userAgent string) error
}

type articleRepository struct {
	db *sql.DB
}

func NewArticleRepository(db *sql.DB) ArticleRepository {
	return &articleRepository{db: db}
}

func (r *articleRepository) Create(ctx context.Context, article *models.Article) error {
	result, err := r.db.ExecContext(ctx,
		`INSERT INTO articles (title, slug, summary, content, featured_image, author_id, category_id, 
		 status, is_featured, published_at, scheduled_at) 
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		article.Title, article.Slug, article.Summary, article.Content, article.FeaturedImage,
		article.AuthorID, article.CategoryID, article.Status, article.IsFeatured,
		article.PublishedAt, article.ScheduledAt)
	if err != nil {
		return err
	}
	article.ID, err = result.LastInsertId()
	return err
}

func (r *articleRepository) GetByID(ctx context.Context, id int64) (*models.Article, error) {
	article := &models.Article{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, title, slug, summary, content, featured_image, author_id, category_id, 
		 status, view_count, is_featured, published_at, scheduled_at, created_at, updated_at 
		 FROM articles WHERE id = ?`, id).Scan(
		&article.ID, &article.Title, &article.Slug, &article.Summary, &article.Content,
		&article.FeaturedImage, &article.AuthorID, &article.CategoryID, &article.Status,
		&article.ViewCount, &article.IsFeatured, &article.PublishedAt, &article.ScheduledAt,
		&article.CreatedAt, &article.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return article, nil
}

func (r *articleRepository) GetBySlug(ctx context.Context, slug string) (*models.Article, error) {
	article := &models.Article{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, title, slug, summary, content, featured_image, author_id, category_id, 
		 status, view_count, is_featured, published_at, scheduled_at, created_at, updated_at 
		 FROM articles WHERE slug = ?`, slug).Scan(
		&article.ID, &article.Title, &article.Slug, &article.Summary, &article.Content,
		&article.FeaturedImage, &article.AuthorID, &article.CategoryID, &article.Status,
		&article.ViewCount, &article.IsFeatured, &article.PublishedAt, &article.ScheduledAt,
		&article.CreatedAt, &article.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return article, nil
}

func (r *articleRepository) Update(ctx context.Context, article *models.Article) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE articles SET title = ?, slug = ?, summary = ?, content = ?, featured_image = ?, 
		 category_id = ?, status = ?, is_featured = ?, published_at = ?, scheduled_at = ?, 
		 updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
		article.Title, article.Slug, article.Summary, article.Content, article.FeaturedImage,
		article.CategoryID, article.Status, article.IsFeatured, article.PublishedAt,
		article.ScheduledAt, article.ID)
	return err
}

func (r *articleRepository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM articles WHERE id = ?`, id)
	return err
}

func (r *articleRepository) List(ctx context.Context, filter *ArticleFilter, page, pageSize int, sortBy string) ([]*models.Article, int, error) {
	offset := (page - 1) * pageSize

	// Build WHERE clause
	whereClauses := []string{}
	args := []interface{}{}

	if filter != nil {
		if filter.CategoryID != nil {
			whereClauses = append(whereClauses, "category_id = ?")
			args = append(args, *filter.CategoryID)
		}
		if filter.CategorySlug != nil {
			whereClauses = append(whereClauses, "category_id = (SELECT id FROM categories WHERE slug = ?)")
			args = append(args, *filter.CategorySlug)
		}
		if filter.AuthorID != nil {
			whereClauses = append(whereClauses, "author_id = ?")
			args = append(args, *filter.AuthorID)
		}
		if filter.Status != nil {
			whereClauses = append(whereClauses, "status = ?")
			args = append(args, *filter.Status)
		}
		if filter.IsFeatured != nil {
			whereClauses = append(whereClauses, "is_featured = ?")
			args = append(args, *filter.IsFeatured)
		}
		if filter.FromDate != nil {
			whereClauses = append(whereClauses, "published_at >= ?")
			args = append(args, *filter.FromDate)
		}
		if filter.ToDate != nil {
			whereClauses = append(whereClauses, "published_at <= ?")
			args = append(args, *filter.ToDate)
		}
		if filter.Query != nil && *filter.Query != "" {
			whereClauses = append(whereClauses, "(title LIKE ? OR content LIKE ?)")
			searchPattern := "%" + *filter.Query + "%"
			args = append(args, searchPattern, searchPattern)
		}
		if filter.Tag != nil {
			whereClauses = append(whereClauses, "id IN (SELECT article_id FROM article_tags at INNER JOIN tags t ON at.tag_id = t.id WHERE t.slug = ?)")
			args = append(args, *filter.Tag)
		}
		if len(filter.TagSlugs) > 0 {
			// Filter by multiple tags (articles must have at least one of the tags)
			placeholders := make([]string, len(filter.TagSlugs))
			for i := range filter.TagSlugs {
				placeholders[i] = "?"
				args = append(args, filter.TagSlugs[i])
			}
			whereClauses = append(whereClauses, fmt.Sprintf("id IN (SELECT article_id FROM article_tags at INNER JOIN tags t ON at.tag_id = t.id WHERE t.slug IN (%s))", strings.Join(placeholders, ",")))
		}
	}

	whereClause := ""
	if len(whereClauses) > 0 {
		whereClause = "WHERE " + strings.Join(whereClauses, " AND ")
	}

	// Count total
	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM articles %s`, whereClause)
	var total int
	err := r.db.QueryRowContext(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Parse sort
	orderBy := "created_at DESC"
	if sortBy != "" {
		orderBy = parseSortBy(sortBy)
	}

	// Query articles
	query := fmt.Sprintf(`
		SELECT id, title, slug, summary, content, featured_image, author_id, category_id, 
		       status, view_count, is_featured, published_at, scheduled_at, created_at, updated_at 
		FROM articles %s ORDER BY %s LIMIT ? OFFSET ?`,
		whereClause, orderBy)

	args = append(args, pageSize, offset)
	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	articles := make([]*models.Article, 0)
	for rows.Next() {
		article := &models.Article{}
		if err := rows.Scan(&article.ID, &article.Title, &article.Slug, &article.Summary,
			&article.Content, &article.FeaturedImage, &article.AuthorID, &article.CategoryID,
			&article.Status, &article.ViewCount, &article.IsFeatured, &article.PublishedAt,
			&article.ScheduledAt, &article.CreatedAt, &article.UpdatedAt); err != nil {
			return nil, 0, err
		}
		articles = append(articles, article)
	}

	return articles, total, rows.Err()
}

func (r *articleRepository) UpdateStatus(ctx context.Context, id int64, status models.ArticleStatus) error {
	query := `UPDATE articles SET status = ?, updated_at = CURRENT_TIMESTAMP`
	args := []interface{}{status}

	if status == models.StatusPublished {
		query += `, published_at = CURRENT_TIMESTAMP`
	}
	query += ` WHERE id = ?`
	args = append(args, id)

	_, err := r.db.ExecContext(ctx, query, args...)
	return err
}

func (r *articleRepository) IncrementViewCount(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE articles SET view_count = view_count + 1 WHERE id = ?`, id)
	return err
}

func (r *articleRepository) GetRelated(ctx context.Context, articleID int64, limit int) ([]*models.Article, error) {
	// Get related articles from same category or with shared tags
	query := `
		SELECT DISTINCT a.id, a.title, a.slug, a.summary, a.content, a.featured_image, 
		       a.author_id, a.category_id, a.status, a.view_count, a.is_featured, 
		       a.published_at, a.scheduled_at, a.created_at, a.updated_at
		FROM articles a
		WHERE a.id != ? 
		  AND a.status = 'published'
		  AND (
		    a.category_id = (SELECT category_id FROM articles WHERE id = ?)
		    OR a.id IN (
		      SELECT at2.article_id 
		      FROM article_tags at1 
		      INNER JOIN article_tags at2 ON at1.tag_id = at2.tag_id 
		      WHERE at1.article_id = ? AND at2.article_id != ?
		    )
		  )
		ORDER BY a.published_at DESC
		LIMIT ?`

	rows, err := r.db.QueryContext(ctx, query, articleID, articleID, articleID, articleID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	articles := make([]*models.Article, 0)
	for rows.Next() {
		article := &models.Article{}
		if err := rows.Scan(&article.ID, &article.Title, &article.Slug, &article.Summary,
			&article.Content, &article.FeaturedImage, &article.AuthorID, &article.CategoryID,
			&article.Status, &article.ViewCount, &article.IsFeatured, &article.PublishedAt,
			&article.ScheduledAt, &article.CreatedAt, &article.UpdatedAt); err != nil {
			return nil, err
		}
		articles = append(articles, article)
	}

	return articles, rows.Err()
}

func (r *articleRepository) AddTag(ctx context.Context, articleID, tagID int64) error {
	_, err := r.db.ExecContext(ctx,
		`INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)`,
		articleID, tagID)
	return err
}

func (r *articleRepository) RemoveTag(ctx context.Context, articleID, tagID int64) error {
	_, err := r.db.ExecContext(ctx,
		`DELETE FROM article_tags WHERE article_id = ? AND tag_id = ?`,
		articleID, tagID)
	return err
}

func (r *articleRepository) GetTags(ctx context.Context, articleID int64) ([]*models.Tag, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT t.id, t.name, t.slug, t.created_at 
		 FROM tags t 
		 INNER JOIN article_tags at ON t.id = at.tag_id 
		 WHERE at.article_id = ?`,
		articleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tags := make([]*models.Tag, 0)
	for rows.Next() {
		tag := &models.Tag{}
		if err := rows.Scan(&tag.ID, &tag.Name, &tag.Slug, &tag.CreatedAt); err != nil {
			return nil, err
		}
		tags = append(tags, tag)
	}

	return tags, rows.Err()
}

func (r *articleRepository) CreateRevision(ctx context.Context, revision *models.ArticleRevision) error {
	result, err := r.db.ExecContext(ctx,
		`INSERT INTO article_revisions (article_id, title, content, user_id) VALUES (?, ?, ?, ?)`,
		revision.ArticleID, revision.Title, revision.Content, revision.UserID)
	if err != nil {
		return err
	}
	revision.ID, err = result.LastInsertId()
	return err
}

func (r *articleRepository) GetRevisions(ctx context.Context, articleID int64) ([]*models.ArticleRevision, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, article_id, title, content, user_id, created_at 
		 FROM article_revisions WHERE article_id = ? ORDER BY created_at DESC`,
		articleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	revisions := make([]*models.ArticleRevision, 0)
	for rows.Next() {
		revision := &models.ArticleRevision{}
		if err := rows.Scan(&revision.ID, &revision.ArticleID, &revision.Title,
			&revision.Content, &revision.UserID, &revision.CreatedAt); err != nil {
			return nil, err
		}
		revisions = append(revisions, revision)
	}

	return revisions, rows.Err()
}

func (r *articleRepository) RecordView(ctx context.Context, articleID int64, ipAddress, userAgent string) error {
	// Check if view was recorded recently (within 1 minute)
	var count int
	err := r.db.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM view_logs 
		 WHERE article_id = ? AND ip_address = ? AND user_agent = ? 
		 AND viewed_at > datetime('now', '-1 minute')`,
		articleID, ipAddress, userAgent).Scan(&count)
	if err != nil {
		return err
	}

	if count > 0 {
		return nil // Already recorded recently
	}

	_, err = r.db.ExecContext(ctx,
		`INSERT INTO view_logs (article_id, ip_address, user_agent) VALUES (?, ?, ?)`,
		articleID, ipAddress, userAgent)
	return err
}

func parseSortBy(sortBy string) string {
	parts := strings.Split(sortBy, ",")
	orderParts := make([]string, 0)

	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}

		direction := "ASC"
		field := part

		if strings.HasPrefix(part, "-") {
			direction = "DESC"
			field = part[1:]
		}

		// Validate field names to prevent SQL injection
		validFields := map[string]bool{
			"created_at":   true,
			"updated_at":   true,
			"published_at": true,
			"title":        true,
			"view_count":   true,
		}

		if validFields[field] {
			orderParts = append(orderParts, fmt.Sprintf("%s %s", field, direction))
		}
	}

	if len(orderParts) == 0 {
		return "created_at DESC"
	}

	return strings.Join(orderParts, ", ")
}
