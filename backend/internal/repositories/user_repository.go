package repositories

import (
	"context"
	"database/sql"

	"github.com/thieugt95/portal-365/backend/internal/models"
)

type UserRepository interface {
	Create(ctx context.Context, user *models.User) error
	GetByID(ctx context.Context, id int64) (*models.User, error)
	GetByEmail(ctx context.Context, email string) (*models.User, error)
	Update(ctx context.Context, user *models.User) error
	Delete(ctx context.Context, id int64) error
	List(ctx context.Context, page, pageSize int) ([]*models.User, int, error)
	AssignRole(ctx context.Context, userID, roleID int64) error
	RemoveRole(ctx context.Context, userID, roleID int64) error
	GetRoles(ctx context.Context, userID int64) ([]*models.Role, error)
	SaveRefreshToken(ctx context.Context, token *models.RefreshToken) error
	GetRefreshToken(ctx context.Context, token string) (*models.RefreshToken, error)
	DeleteRefreshToken(ctx context.Context, token string) error
}

type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *models.User) error {
	result, err := r.db.ExecContext(ctx,
		`INSERT INTO users (email, password_hash, full_name, avatar, is_active) 
		 VALUES (?, ?, ?, ?, ?)`,
		user.Email, user.PasswordHash, user.FullName, user.Avatar, user.IsActive)
	if err != nil {
		return err
	}
	user.ID, err = result.LastInsertId()
	return err
}

func (r *userRepository) GetByID(ctx context.Context, id int64) (*models.User, error) {
	user := &models.User{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, email, password_hash, full_name, avatar, is_active, created_at, updated_at 
		 FROM users WHERE id = ?`, id).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.FullName,
		&user.Avatar, &user.IsActive, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	user := &models.User{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, email, password_hash, full_name, avatar, is_active, created_at, updated_at 
		 FROM users WHERE email = ?`, email).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.FullName,
		&user.Avatar, &user.IsActive, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *userRepository) Update(ctx context.Context, user *models.User) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE users SET email = ?, full_name = ?, avatar = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
		 WHERE id = ?`,
		user.Email, user.FullName, user.Avatar, user.IsActive, user.ID)
	return err
}

func (r *userRepository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM users WHERE id = ?`, id)
	return err
}

func (r *userRepository) List(ctx context.Context, page, pageSize int) ([]*models.User, int, error) {
	offset := (page - 1) * pageSize

	var total int
	err := r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM users`).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	rows, err := r.db.QueryContext(ctx,
		`SELECT id, email, password_hash, full_name, avatar, is_active, created_at, updated_at 
		 FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`,
		pageSize, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	users := make([]*models.User, 0)
	for rows.Next() {
		user := &models.User{}
		if err := rows.Scan(&user.ID, &user.Email, &user.PasswordHash, &user.FullName,
			&user.Avatar, &user.IsActive, &user.CreatedAt, &user.UpdatedAt); err != nil {
			return nil, 0, err
		}
		users = append(users, user)
	}

	return users, total, rows.Err()
}

func (r *userRepository) AssignRole(ctx context.Context, userID, roleID int64) error {
	_, err := r.db.ExecContext(ctx,
		`INSERT OR IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)`,
		userID, roleID)
	return err
}

func (r *userRepository) RemoveRole(ctx context.Context, userID, roleID int64) error {
	_, err := r.db.ExecContext(ctx,
		`DELETE FROM user_roles WHERE user_id = ? AND role_id = ?`,
		userID, roleID)
	return err
}

func (r *userRepository) GetRoles(ctx context.Context, userID int64) ([]*models.Role, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT r.id, r.name, r.description, r.created_at 
		 FROM roles r 
		 INNER JOIN user_roles ur ON r.id = ur.role_id 
		 WHERE ur.user_id = ?`,
		userID)
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

func (r *userRepository) SaveRefreshToken(ctx context.Context, token *models.RefreshToken) error {
	// Delete old refresh tokens for this user first
	_, err := r.db.ExecContext(ctx, `DELETE FROM refresh_tokens WHERE user_id = ?`, token.UserID)
	if err != nil {
		return err
	}

	// Insert new refresh token
	result, err := r.db.ExecContext(ctx,
		`INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)`,
		token.UserID, token.Token, token.ExpiresAt)
	if err != nil {
		return err
	}
	token.ID, err = result.LastInsertId()
	return err
}

func (r *userRepository) GetRefreshToken(ctx context.Context, token string) (*models.RefreshToken, error) {
	rt := &models.RefreshToken{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, user_id, token, expires_at, created_at 
		 FROM refresh_tokens WHERE token = ?`, token).Scan(
		&rt.ID, &rt.UserID, &rt.Token, &rt.ExpiresAt, &rt.CreatedAt)
	if err != nil {
		return nil, err
	}
	return rt, nil
}

func (r *userRepository) DeleteRefreshToken(ctx context.Context, token string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM refresh_tokens WHERE token = ?`, token)
	return err
}
