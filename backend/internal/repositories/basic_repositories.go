package repositories

import (
	"context"
	"database/sql"

	"github.com/thieugt95/portal-365/backend/internal/models"
)

type RoleRepository interface {
	GetAll(ctx context.Context) ([]*models.Role, error)
	GetByID(ctx context.Context, id int64) (*models.Role, error)
	GetByName(ctx context.Context, name string) (*models.Role, error)
}

type roleRepository struct {
	db *sql.DB
}

func NewRoleRepository(db *sql.DB) RoleRepository {
	return &roleRepository{db: db}
}

func (r *roleRepository) GetAll(ctx context.Context) ([]*models.Role, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, name, description, created_at FROM roles ORDER BY id`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	roles := make([]*models.Role, 0)
	for rows.Next() {
		role := &models.Role{}
		if err := rows.Scan(&role.ID, &role.Name, &role.Description, &role.CreatedAt); err != nil {
			return nil, err
		}
		roles = append(roles, role)
	}

	return roles, rows.Err()
}

func (r *roleRepository) GetByID(ctx context.Context, id int64) (*models.Role, error) {
	role := &models.Role{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, name, description, created_at FROM roles WHERE id = ?`, id).Scan(
		&role.ID, &role.Name, &role.Description, &role.CreatedAt)
	if err != nil {
		return nil, err
	}
	return role, nil
}

func (r *roleRepository) GetByName(ctx context.Context, name string) (*models.Role, error) {
	role := &models.Role{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, name, description, created_at FROM roles WHERE name = ?`, name).Scan(
		&role.ID, &role.Name, &role.Description, &role.CreatedAt)
	if err != nil {
		return nil, err
	}
	return role, nil
}

type CategoryRepository interface {
	Create(ctx context.Context, category *models.Category) error
	GetByID(ctx context.Context, id int64) (*models.Category, error)
	GetBySlug(ctx context.Context, slug string) (*models.Category, error)
	Update(ctx context.Context, category *models.Category) error
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, page, pageSize int) ([]*models.Category, int, error)
	GetAll(ctx context.Context) ([]*models.Category, error)
}

type categoryRepository struct {
	db *sql.DB
}

func NewCategoryRepository(db *sql.DB) CategoryRepository {
	return &categoryRepository{db: db}
}

func (r *categoryRepository) Create(ctx context.Context, category *models.Category) error {
	result, err := r.db.ExecContext(ctx,
		`INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) 
		 VALUES (?, ?, ?, ?, ?, ?)`,
		category.Name, category.Slug, category.Description, category.ParentID, category.SortOrder, category.IsActive)
	if err != nil {
		return err
	}
	category.ID, err = result.LastInsertId()
	return err
}

func (r *categoryRepository) GetByID(ctx context.Context, id int64) (*models.Category, error) {
	category := &models.Category{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, name, slug, description, parent_id, sort_order, is_active, created_at, updated_at 
		 FROM categories WHERE id = ?`, id).Scan(
		&category.ID, &category.Name, &category.Slug, &category.Description,
		&category.ParentID, &category.SortOrder, &category.IsActive, &category.CreatedAt, &category.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return category, nil
}

func (r *categoryRepository) GetBySlug(ctx context.Context, slug string) (*models.Category, error) {
	category := &models.Category{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, name, slug, description, parent_id, sort_order, is_active, created_at, updated_at 
		 FROM categories WHERE slug = ?`, slug).Scan(
		&category.ID, &category.Name, &category.Slug, &category.Description,
		&category.ParentID, &category.SortOrder, &category.IsActive, &category.CreatedAt, &category.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return category, nil
}

func (r *categoryRepository) Update(ctx context.Context, category *models.Category) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE categories SET name = ?, slug = ?, description = ?, parent_id = ?, sort_order = ?, 
		 is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
		category.Name, category.Slug, category.Description, category.ParentID,
		category.SortOrder, category.IsActive, category.ID)
	return err
}

func (r *categoryRepository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM categories WHERE id = ?`, id)
	return err
}

func (r *categoryRepository) List(ctx context.Context, page, pageSize int) ([]*models.Category, int, error) {
	offset := (page - 1) * pageSize

	var total int
	err := r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM categories`).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	rows, err := r.db.QueryContext(ctx,
		`SELECT id, name, slug, description, parent_id, sort_order, is_active, created_at, updated_at 
		 FROM categories ORDER BY sort_order, name LIMIT ? OFFSET ?`,
		pageSize, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	categories := make([]*models.Category, 0)
	for rows.Next() {
		category := &models.Category{}
		if err := rows.Scan(&category.ID, &category.Name, &category.Slug, &category.Description,
			&category.ParentID, &category.SortOrder, &category.IsActive,
			&category.CreatedAt, &category.UpdatedAt); err != nil {
			return nil, 0, err
		}
		categories = append(categories, category)
	}

	return categories, total, rows.Err()
}

func (r *categoryRepository) GetAll(ctx context.Context) ([]*models.Category, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, name, slug, description, parent_id, sort_order, is_active, created_at, updated_at 
		 FROM categories WHERE is_active = 1 ORDER BY sort_order, name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	categories := make([]*models.Category, 0)
	for rows.Next() {
		category := &models.Category{}
		if err := rows.Scan(&category.ID, &category.Name, &category.Slug, &category.Description,
			&category.ParentID, &category.SortOrder, &category.IsActive,
			&category.CreatedAt, &category.UpdatedAt); err != nil {
			return nil, err
		}
		categories = append(categories, category)
	}

	return categories, rows.Err()
}

type TagRepository interface {
	Create(ctx context.Context, tag *models.Tag) error
	GetByID(ctx context.Context, id int64) (*models.Tag, error)
	GetBySlug(ctx context.Context, slug string) (*models.Tag, error)
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, page, pageSize int) ([]*models.Tag, int, error)
	GetAll(ctx context.Context) ([]*models.Tag, error)
}

type tagRepository struct {
	db *sql.DB
}

func NewTagRepository(db *sql.DB) TagRepository {
	return &tagRepository{db: db}
}

func (r *tagRepository) Create(ctx context.Context, tag *models.Tag) error {
	result, err := r.db.ExecContext(ctx,
		`INSERT INTO tags (name, slug) VALUES (?, ?)`,
		tag.Name, tag.Slug)
	if err != nil {
		return err
	}
	tag.ID, err = result.LastInsertId()
	return err
}

func (r *tagRepository) GetByID(ctx context.Context, id int64) (*models.Tag, error) {
	tag := &models.Tag{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, name, slug, created_at FROM tags WHERE id = ?`, id).Scan(
		&tag.ID, &tag.Name, &tag.Slug, &tag.CreatedAt)
	if err != nil {
		return nil, err
	}
	return tag, nil
}

func (r *tagRepository) GetBySlug(ctx context.Context, slug string) (*models.Tag, error) {
	tag := &models.Tag{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, name, slug, created_at FROM tags WHERE slug = ?`, slug).Scan(
		&tag.ID, &tag.Name, &tag.Slug, &tag.CreatedAt)
	if err != nil {
		return nil, err
	}
	return tag, nil
}

func (r *tagRepository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM tags WHERE id = ?`, id)
	return err
}

func (r *tagRepository) List(ctx context.Context, page, pageSize int) ([]*models.Tag, int, error) {
	offset := (page - 1) * pageSize

	var total int
	err := r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM tags`).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	rows, err := r.db.QueryContext(ctx,
		`SELECT id, name, slug, created_at FROM tags ORDER BY name LIMIT ? OFFSET ?`,
		pageSize, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	tags := make([]*models.Tag, 0)
	for rows.Next() {
		tag := &models.Tag{}
		if err := rows.Scan(&tag.ID, &tag.Name, &tag.Slug, &tag.CreatedAt); err != nil {
			return nil, 0, err
		}
		tags = append(tags, tag)
	}

	return tags, total, rows.Err()
}

func (r *tagRepository) GetAll(ctx context.Context) ([]*models.Tag, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, name, slug, created_at FROM tags ORDER BY name`)
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
