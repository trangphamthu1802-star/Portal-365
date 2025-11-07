package repositories

import (
	"context"
	"database/sql"
	"time"

	"github.com/thieugt95/portal-365/backend/internal/models"
)

type DocumentRepository interface {
	Create(ctx context.Context, doc *models.Document) error
	GetByID(ctx context.Context, id int64) (*models.Document, error)
	GetBySlug(ctx context.Context, slug string) (*models.Document, error)
	Update(ctx context.Context, doc *models.Document) error
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, status string, categoryID *int64, page, pageSize int) ([]models.Document, int, error)
	ListPublished(ctx context.Context, categoryID *int64, page, pageSize int) ([]models.Document, int, error)
	IncrementViewCount(ctx context.Context, id int64) error
}

type documentRepository struct {
	db *sql.DB
}

func NewDocumentRepository(db *sql.DB) DocumentRepository {
	return &documentRepository{db: db}
}

func (r *documentRepository) Create(ctx context.Context, doc *models.Document) error {
	now := time.Now()
	doc.CreatedAt = now
	doc.UpdatedAt = now

	result, err := r.db.ExecContext(ctx,
		`INSERT INTO documents (title, slug, description, category_id, file_url, file_name, 
		 file_size, file_type, document_no, issued_date, uploaded_by, status, published_at, 
		 created_at, updated_at) 
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		doc.Title, doc.Slug, doc.Description, doc.CategoryID, doc.FileURL, doc.FileName,
		doc.FileSize, doc.FileType, doc.DocumentNo, doc.IssuedDate, doc.UploadedBy,
		doc.Status, doc.PublishedAt, doc.CreatedAt, doc.UpdatedAt)
	if err != nil {
		return err
	}

	doc.ID, err = result.LastInsertId()
	return err
}

func (r *documentRepository) GetByID(ctx context.Context, id int64) (*models.Document, error) {
	doc := &models.Document{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, title, slug, description, category_id, file_url, file_name, file_size, 
		 file_type, document_no, issued_date, uploaded_by, view_count, status, published_at, 
		 created_at, updated_at 
		 FROM documents WHERE id = ?`, id).Scan(
		&doc.ID, &doc.Title, &doc.Slug, &doc.Description, &doc.CategoryID, &doc.FileURL,
		&doc.FileName, &doc.FileSize, &doc.FileType, &doc.DocumentNo, &doc.IssuedDate,
		&doc.UploadedBy, &doc.ViewCount, &doc.Status, &doc.PublishedAt,
		&doc.CreatedAt, &doc.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func (r *documentRepository) GetBySlug(ctx context.Context, slug string) (*models.Document, error) {
	doc := &models.Document{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, title, slug, description, category_id, file_url, file_name, file_size, 
		 file_type, document_no, issued_date, uploaded_by, view_count, status, published_at, 
		 created_at, updated_at 
		 FROM documents WHERE slug = ?`, slug).Scan(
		&doc.ID, &doc.Title, &doc.Slug, &doc.Description, &doc.CategoryID, &doc.FileURL,
		&doc.FileName, &doc.FileSize, &doc.FileType, &doc.DocumentNo, &doc.IssuedDate,
		&doc.UploadedBy, &doc.ViewCount, &doc.Status, &doc.PublishedAt,
		&doc.CreatedAt, &doc.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func (r *documentRepository) Update(ctx context.Context, doc *models.Document) error {
	doc.UpdatedAt = time.Now()

	_, err := r.db.ExecContext(ctx,
		`UPDATE documents SET title = ?, slug = ?, description = ?, category_id = ?, 
		 file_url = ?, file_name = ?, file_size = ?, file_type = ?, document_no = ?, 
		 issued_date = ?, status = ?, published_at = ?, updated_at = ? 
		 WHERE id = ?`,
		doc.Title, doc.Slug, doc.Description, doc.CategoryID, doc.FileURL, doc.FileName,
		doc.FileSize, doc.FileType, doc.DocumentNo, doc.IssuedDate, doc.Status,
		doc.PublishedAt, doc.UpdatedAt, doc.ID)
	return err
}

func (r *documentRepository) Delete(ctx context.Context, id int64) error {
	result, err := r.db.ExecContext(ctx, `DELETE FROM documents WHERE id = ?`, id)
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

func (r *documentRepository) List(ctx context.Context, status string, categoryID *int64, page, pageSize int) ([]models.Document, int, error) {
	offset := (page - 1) * pageSize

	// Build query
	query := `SELECT id, title, slug, description, category_id, file_url, file_name, file_size, 
	          file_type, document_no, issued_date, uploaded_by, view_count, status, published_at, 
	          created_at, updated_at FROM documents WHERE 1=1`
	countQuery := `SELECT COUNT(*) FROM documents WHERE 1=1`
	args := []interface{}{}

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

	// Get documents
	query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
	args = append(args, pageSize, offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	documents := []models.Document{}
	for rows.Next() {
		var doc models.Document
		if err := rows.Scan(&doc.ID, &doc.Title, &doc.Slug, &doc.Description, &doc.CategoryID,
			&doc.FileURL, &doc.FileName, &doc.FileSize, &doc.FileType, &doc.DocumentNo,
			&doc.IssuedDate, &doc.UploadedBy, &doc.ViewCount, &doc.Status, &doc.PublishedAt,
			&doc.CreatedAt, &doc.UpdatedAt); err != nil {
			return nil, 0, err
		}
		documents = append(documents, doc)
	}

	return documents, total, rows.Err()
}

func (r *documentRepository) ListPublished(ctx context.Context, categoryID *int64, page, pageSize int) ([]models.Document, int, error) {
	offset := (page - 1) * pageSize

	query := `SELECT id, title, slug, description, category_id, file_url, file_name, file_size, 
	          file_type, document_no, issued_date, uploaded_by, view_count, status, published_at, 
	          created_at, updated_at FROM documents WHERE status = 'published'`
	countQuery := `SELECT COUNT(*) FROM documents WHERE status = 'published'`
	args := []interface{}{}

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

	// Get documents
	query += " ORDER BY published_at DESC LIMIT ? OFFSET ?"
	args = append(args, pageSize, offset)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	documents := []models.Document{}
	for rows.Next() {
		var doc models.Document
		if err := rows.Scan(&doc.ID, &doc.Title, &doc.Slug, &doc.Description, &doc.CategoryID,
			&doc.FileURL, &doc.FileName, &doc.FileSize, &doc.FileType, &doc.DocumentNo,
			&doc.IssuedDate, &doc.UploadedBy, &doc.ViewCount, &doc.Status, &doc.PublishedAt,
			&doc.CreatedAt, &doc.UpdatedAt); err != nil {
			return nil, 0, err
		}
		documents = append(documents, doc)
	}

	return documents, total, rows.Err()
}

func (r *documentRepository) IncrementViewCount(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE documents SET view_count = view_count + 1 WHERE id = ?`, id)
	return err
}
