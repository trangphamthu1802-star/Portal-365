package database

import (
	"database/sql"

	"github.com/thieugt95/portal-365/backend/internal/repositories"
)

type Repositories struct {
	Users      repositories.UserRepository
	Roles      repositories.RoleRepository
	Categories repositories.CategoryRepository
	Tags       repositories.TagRepository
	Articles   repositories.ArticleRepository
	Media      repositories.MediaRepository
	Documents  repositories.DocumentRepository
	MediaItems repositories.MediaItemRepository
	Comments   repositories.CommentRepository
	Menus      repositories.MenuRepository
	Pages      repositories.PageRepository
	Banners    repositories.BannerRepository
	Settings   repositories.SettingRepository
	AuditLogs  repositories.AuditLogRepository
}

func NewRepositories(db *sql.DB) *Repositories {
	return &Repositories{
		Users:      repositories.NewUserRepository(db),
		Roles:      repositories.NewRoleRepository(db),
		Categories: repositories.NewCategoryRepository(db),
		Tags:       repositories.NewTagRepository(db),
		Articles:   repositories.NewArticleRepository(db),
		Media:      repositories.NewMediaRepository(db),
		Documents:  repositories.NewDocumentRepository(db),
		MediaItems: repositories.NewMediaItemRepository(db),
		Comments:   repositories.NewCommentRepository(db),
		Menus:      repositories.NewMenuRepository(db),
		Pages:      repositories.NewPageRepository(db),
		Banners:    repositories.NewBannerRepository(db),
		Settings:   repositories.NewSettingRepository(db),
		AuditLogs:  repositories.NewAuditLogRepository(db),
	}
}
