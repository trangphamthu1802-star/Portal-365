package database

import (
	"database/sql"
	"fmt"

	_ "modernc.org/sqlite"
)

func Initialize(dsn string) (*sql.DB, error) {
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Test connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	// Enable foreign keys
	if _, err := db.Exec("PRAGMA foreign_keys = ON"); err != nil {
		return nil, fmt.Errorf("failed to enable foreign keys: %w", err)
	}

	return db, nil
}

func Migrate(db *sql.DB) error {
	migrations := []string{
		createUsersTable,
		createRolesTable,
		createUserRolesTable,
		createCategoriesTable,
		createTagsTable,
		createArticlesTable,
		createArticleTagsTable,
		createArticleRevisionsTable,
		createMediaTable,
		createCommentsTable,
		createMenusTable,
		createMenuItemsTable,
		createPagesTable,
		createBannersTable,
		createSettingsTable,
		createAuditLogsTable,
		createRefreshTokensTable,
		createViewLogsTable,
		createDocumentsTable,
		createMediaItemsTable,
	}

	for _, migration := range migrations {
		if _, err := db.Exec(migration); err != nil {
			return fmt.Errorf("migration failed: %w", err)
		}
	}

	return nil
}

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	email TEXT NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	full_name TEXT NOT NULL,
	avatar TEXT,
	is_active BOOLEAN NOT NULL DEFAULT 1,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
`

const createRolesTable = `
CREATE TABLE IF NOT EXISTS roles (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL UNIQUE,
	description TEXT,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO roles (id, name, description) VALUES
(1, 'Admin', 'Full system access'),
(2, 'Editor', 'Can edit and publish articles'),
(3, 'Author', 'Can create and submit articles'),
(4, 'Reviewer', 'Can review articles'),
(5, 'Moderator', 'Can moderate comments');
`

const createUserRolesTable = `
CREATE TABLE IF NOT EXISTS user_roles (
	user_id INTEGER NOT NULL,
	role_id INTEGER NOT NULL,
	PRIMARY KEY (user_id, role_id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
`

const createCategoriesTable = `
CREATE TABLE IF NOT EXISTS categories (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	slug TEXT NOT NULL UNIQUE,
	description TEXT,
	parent_id INTEGER,
	sort_order INTEGER NOT NULL DEFAULT 0,
	is_active BOOLEAN NOT NULL DEFAULT 1,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
`

const createTagsTable = `
CREATE TABLE IF NOT EXISTS tags (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL UNIQUE,
	slug TEXT NOT NULL UNIQUE,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
`

const createArticlesTable = `
CREATE TABLE IF NOT EXISTS articles (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	slug TEXT NOT NULL UNIQUE,
	summary TEXT,
	content TEXT NOT NULL,
	featured_image TEXT,
	author_id INTEGER NOT NULL,
	category_id INTEGER NOT NULL,
	status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'under_review', 'published', 'hidden', 'rejected')),
	view_count INTEGER NOT NULL DEFAULT 0,
	is_featured BOOLEAN NOT NULL DEFAULT 0,
	published_at DATETIME,
	scheduled_at DATETIME,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_articles_view_count ON articles(view_count);
`

const createArticleTagsTable = `
CREATE TABLE IF NOT EXISTS article_tags (
	article_id INTEGER NOT NULL,
	tag_id INTEGER NOT NULL,
	PRIMARY KEY (article_id, tag_id),
	FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
	FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_article_tags_tag_id ON article_tags(tag_id);
`

const createArticleRevisionsTable = `
CREATE TABLE IF NOT EXISTS article_revisions (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	article_id INTEGER NOT NULL,
	title TEXT NOT NULL,
	content TEXT NOT NULL,
	user_id INTEGER NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_article_revisions_article_id ON article_revisions(article_id);
`

const createMediaTable = `
CREATE TABLE IF NOT EXISTS media (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	file_name TEXT NOT NULL,
	file_path TEXT NOT NULL,
	file_size INTEGER NOT NULL,
	mime_type TEXT NOT NULL,
	type TEXT NOT NULL CHECK(type IN ('image', 'video')),
	uploaded_by INTEGER NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);
`

const createCommentsTable = `
CREATE TABLE IF NOT EXISTS comments (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	article_id INTEGER NOT NULL,
	user_id INTEGER,
	author_name TEXT NOT NULL,
	content TEXT NOT NULL,
	is_approved BOOLEAN NOT NULL DEFAULT 0,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_is_approved ON comments(is_approved);
`

const createMenusTable = `
CREATE TABLE IF NOT EXISTS menus (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	location TEXT NOT NULL,
	sort_order INTEGER NOT NULL DEFAULT 0,
	is_active BOOLEAN NOT NULL DEFAULT 1,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`

const createMenuItemsTable = `
CREATE TABLE IF NOT EXISTS menu_items (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	menu_id INTEGER NOT NULL,
	label TEXT NOT NULL,
	url TEXT NOT NULL,
	parent_id INTEGER,
	sort_order INTEGER NOT NULL DEFAULT 0,
	target TEXT NOT NULL DEFAULT '_self',
	FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
	FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_menu_items_menu_id ON menu_items(menu_id);
`

const createPagesTable = `
CREATE TABLE IF NOT EXISTS pages (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	slug TEXT NOT NULL UNIQUE,
	group_name TEXT NOT NULL DEFAULT '',
	key TEXT NOT NULL DEFAULT '',
	content TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'draft',
	sort_order INTEGER NOT NULL DEFAULT 0,
	view_count INTEGER NOT NULL DEFAULT 0,
	hero_image_url TEXT,
	seo_title TEXT,
	seo_description TEXT,
	published_at DATETIME,
	is_active BOOLEAN NOT NULL DEFAULT 1,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pages_group_key ON pages(group_name, key);
CREATE INDEX IF NOT EXISTS idx_pages_group ON pages(group_name);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_order ON pages(group_name, sort_order);
`

const createBannersTable = `
CREATE TABLE IF NOT EXISTS banners (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	image_url TEXT NOT NULL,
	link_url TEXT,
	placement TEXT NOT NULL,
	sort_order INTEGER NOT NULL DEFAULT 0,
	is_active BOOLEAN NOT NULL DEFAULT 1,
	start_date DATETIME,
	end_date DATETIME,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_banners_placement ON banners(placement);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);
`

const createSettingsTable = `
CREATE TABLE IF NOT EXISTS settings (
	key TEXT PRIMARY KEY,
	value TEXT NOT NULL,
	is_public BOOLEAN NOT NULL DEFAULT 0,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO settings (key, value, is_public) VALUES
('site_name', 'Portal 365', 1),
('site_description', 'Your trusted news source', 1),
('articles_per_page', '20', 1);
`

const createAuditLogsTable = `
CREATE TABLE IF NOT EXISTS audit_logs (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	action TEXT NOT NULL,
	entity TEXT NOT NULL,
	entity_id INTEGER NOT NULL,
	details TEXT,
	ip_address TEXT,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);
`

const createRefreshTokensTable = `
CREATE TABLE IF NOT EXISTS refresh_tokens (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	token TEXT NOT NULL UNIQUE,
	expires_at DATETIME NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
`

const createViewLogsTable = `
CREATE TABLE IF NOT EXISTS view_logs (
	article_id INTEGER NOT NULL,
	ip_address TEXT NOT NULL,
	user_agent TEXT NOT NULL,
	viewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (article_id, ip_address, user_agent, viewed_at),
	FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_view_logs_viewed_at ON view_logs(viewed_at);
`

const createDocumentsTable = `
CREATE TABLE IF NOT EXISTS documents (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	slug TEXT NOT NULL UNIQUE,
	description TEXT,
	category_id INTEGER NOT NULL,
	file_path TEXT NOT NULL,
	file_size INTEGER NOT NULL DEFAULT 0,
	mime_type TEXT NOT NULL,
	document_no TEXT,
	issued_date DATETIME,
	uploaded_by INTEGER NOT NULL,
	view_count INTEGER NOT NULL DEFAULT 0,
	download_count INTEGER NOT NULL DEFAULT 0,
	status TEXT NOT NULL DEFAULT 'draft',
	published_at DATETIME,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
	FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_documents_slug ON documents(slug);
CREATE INDEX IF NOT EXISTS idx_documents_category_id ON documents(category_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_published_at ON documents(published_at);
CREATE INDEX IF NOT EXISTS idx_documents_document_no ON documents(document_no);
`

const createMediaItemsTable = `
CREATE TABLE IF NOT EXISTS media_items (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	slug TEXT NOT NULL UNIQUE,
	description TEXT,
	category_id INTEGER NOT NULL,
	media_type TEXT NOT NULL,
	url TEXT NOT NULL,
	thumbnail_url TEXT,
	file_size INTEGER NOT NULL DEFAULT 0,
	duration INTEGER NOT NULL DEFAULT 0,
	width INTEGER NOT NULL DEFAULT 0,
	height INTEGER NOT NULL DEFAULT 0,
	uploaded_by INTEGER NOT NULL,
	view_count INTEGER NOT NULL DEFAULT 0,
	status TEXT NOT NULL DEFAULT 'draft',
	published_at DATETIME,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
	FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_media_items_slug ON media_items(slug);
CREATE INDEX IF NOT EXISTS idx_media_items_category_id ON media_items(category_id);
CREATE INDEX IF NOT EXISTS idx_media_items_media_type ON media_items(media_type);
CREATE INDEX IF NOT EXISTS idx_media_items_status ON media_items(status);
CREATE INDEX IF NOT EXISTS idx_media_items_published_at ON media_items(published_at);
`
