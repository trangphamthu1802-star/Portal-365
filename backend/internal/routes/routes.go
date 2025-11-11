package routes

import (
	"path/filepath"

	"github.com/gin-gonic/gin"

	"github.com/thieugt95/portal-365/backend/internal/config"
	"github.com/thieugt95/portal-365/backend/internal/database"
	"github.com/thieugt95/portal-365/backend/internal/handlers"
	"github.com/thieugt95/portal-365/backend/internal/middleware"
)

func Setup(r *gin.Engine, cfg *config.Config, repos *database.Repositories) {
	// Static file serving for uploads with Range request support for videos
	r.GET("/static/*filepath", func(c *gin.Context) {
		filePath := c.Param("filepath")
		fullPath := filepath.Join("./storage", filePath)

		// Serve file with Range request support (important for video preview)
		c.Header("Accept-Ranges", "bytes")
		c.File(fullPath)
	})

	// Health check
	r.GET("/api/v1/healthz", handlers.HealthCheck)

	api := r.Group("/api/v1")
	{
		// Public routes
		public := api.Group("")
		{
			// Auth
			auth := public.Group("/auth")
			{
				authHandler := handlers.NewAuthHandler(cfg, repos)
				auth.POST("/login", authHandler.Login)
				auth.POST("/refresh", authHandler.Refresh)
			}

			// Public content
			categoryHandler := handlers.NewCategoryHandler(repos)
			public.GET("/categories", categoryHandler.List)
			public.GET("/categories/menu", categoryHandler.GetMenuTree)
			public.GET("/categories/:slug", categoryHandler.GetBySlug)

			public.GET("/tags", handlers.NewTagHandler(repos).List)
			public.GET("/tags/:slug", handlers.NewTagHandler(repos).GetBySlug)

			// Home data
			homeHandler := handlers.NewHomeHandler(repos)
			public.GET("/home", homeHandler.GetHomeData)

			articlesHandler := handlers.NewArticleHandler(repos)
			public.GET("/articles", articlesHandler.ListPublic)
			public.GET("/articles/:slug", articlesHandler.GetBySlug)
			public.GET("/articles/:slug/related", articlesHandler.GetRelated)
			public.POST("/articles/:id/views", articlesHandler.RecordView)

			pageHandler := handlers.NewPageHandler(repos)
			public.GET("/pages", pageHandler.List)
			public.GET("/pages/:slug", pageHandler.GetBySlug)

			// Settings (public)
			settingHandler := handlers.NewSettingHandler(repos)
			public.GET("/settings", settingHandler.GetPublic)
			public.GET("/settings/public", settingHandler.GetPublic) // Alternative route for frontend compatibility

			// Menus (public)
			menuHandler := handlers.NewMenuHandler(repos)
			public.GET("/menus", menuHandler.List) // Public menu listing

			public.GET("/search", handlers.NewSearchHandler(repos).Search)

			// Introduction pages (public)
			introHandler := handlers.NewIntroductionHandler(repos)
			public.GET("/introduction", introHandler.ListIntroductionPages)
			public.GET("/introduction/:key", introHandler.GetIntroductionPage)

			// Activities
			activityHandler := handlers.NewActivityHandler(repos)
			public.GET("/activities", activityHandler.List)
			public.GET("/activities/:slug", activityHandler.GetBySlug)

			// Documents (public)
			documentHandler := handlers.NewDocumentsHandler(repos)
			public.GET("/documents", documentHandler.ListPublic)
			public.GET("/documents/:slug", documentHandler.GetBySlug)

			// Media Items (public)
			mediaItemHandler := handlers.NewMediaItemHandler(repos)
			public.GET("/media-items", mediaItemHandler.ListPublic)
			public.GET("/media-items/:slug", mediaItemHandler.GetBySlug)

			commentsHandler := handlers.NewCommentHandler(repos)
			public.GET("/comments/article/:article_id", commentsHandler.GetByArticle)
			public.POST("/comments", commentsHandler.Create)

			// Banners (public)
			bannerHandler := handlers.NewBannerHandlerImpl(repos)
			public.GET("/banners", bannerHandler.GetByPlacement)
		}

		// Protected routes
		protected := api.Group("")
		protected.Use(middleware.AuthRequired(cfg))
		{
			// Auth
			protected.POST("/auth/logout", handlers.NewAuthHandler(cfg, repos).Logout)
			protected.GET("/auth/me", handlers.NewAuthHandler(cfg, repos).Me)

			// Upload (for rich text editor images)
			protected.POST("/admin/uploads", handlers.NewUploadHandler().UploadImage)

			// Articles (Author, Editor, Admin)
			articles := protected.Group("/admin/articles")
			articles.Use(middleware.RequireRoles("Admin", "Editor", "Author"))
			{
				handler := handlers.NewArticleHandler(repos)
				articles.GET("", handler.List)
				articles.POST("", handler.Create)
				articles.GET("/:id", handler.GetByID)
				articles.PUT("/:id", handler.Update)
				articles.DELETE("/:id", handler.Delete)
				articles.POST("/:id/submit", handler.SubmitForReview)
				articles.POST("/:id/publish", handler.Publish)
				articles.POST("/:id/unpublish", handler.Unpublish)
				articles.POST("/:id/approve", handler.Approve)
				articles.POST("/:id/reject", handler.Reject)
				articles.GET("/:id/revisions", handler.GetRevisions)
			}

			// Categories (Admin, Editor)
			categories := protected.Group("/admin/categories")
			categories.Use(middleware.RequireRoles("Admin", "Editor"))
			{
				handler := handlers.NewCategoryHandler(repos)
				categories.POST("", handler.Create)
				categories.PUT("/:id", handler.Update)
				categories.DELETE("/:id", handler.Delete)
			}

			// Tags (Admin, Editor)
			tags := protected.Group("/admin/tags")
			tags.Use(middleware.RequireRoles("Admin", "Editor"))
			{
				handler := handlers.NewTagHandler(repos)
				tags.POST("", handler.Create)
				tags.DELETE("/:id", handler.Delete)
			}

			// Media
			media := protected.Group("/admin/media")
			media.Use(middleware.RequireRoles("Admin", "Editor", "Author"))
			{
				handler := handlers.NewMediaItemHandler(repos)
				media.GET("", handler.List)
				media.POST("/upload", handler.Upload)
				media.GET("/:id", handler.GetByID)
				media.DELETE("/:id", handler.Delete)
			}

			// Documents (Admin, Editor)
			documents := protected.Group("/admin/documents")
			documents.Use(middleware.RequireRoles("Admin", "Editor"))
			{
				handler := handlers.NewDocumentsHandler(repos)
				documents.GET("", handler.List)
				documents.POST("", handler.Create)
				documents.POST("/upload", handler.Upload)
				documents.PUT("/:id", handler.Update)
				documents.DELETE("/:id", handler.Delete)
			}

			// Media Items (Admin, Editor)
			mediaItems := protected.Group("/admin/media-items")
			mediaItems.Use(middleware.RequireRoles("Admin", "Editor"))
			{
				handler := handlers.NewMediaItemHandler(repos)
				mediaItems.GET("", handler.List)
				mediaItems.POST("", handler.Create)
				mediaItems.PUT("/:id", handler.Update)
				mediaItems.DELETE("/:id", handler.Delete)
			}

			// Comments (Admin, Moderator)
			comments := protected.Group("/admin/comments")
			comments.Use(middleware.RequireRoles("Admin", "Moderator"))
			{
				handler := handlers.NewCommentHandler(repos)
				comments.GET("", handler.List)
				comments.POST("/:id/approve", handler.Approve)
				comments.DELETE("/:id", handler.Delete)
			}

			// Banners (Admin, Editor)
			banners := protected.Group("/admin/banners")
			banners.Use(middleware.RequireRoles("Admin", "Editor"))
			{
				handler := handlers.NewBannerHandlerImpl(repos)
				banners.GET("", handler.List)
				banners.POST("", handler.Create)
				banners.POST("/upload", handler.CreateWithUpload) // New: Upload with image
				banners.GET("/:id", handler.GetByID)
				banners.PUT("/:id", handler.Update)
				banners.PUT("/:id/upload", handler.UpdateWithUpload) // New: Update with image
				banners.DELETE("/:id", handler.Delete)
			}

			// Pages (Admin, Editor)
			pages := protected.Group("/admin/pages")
			pages.Use(middleware.RequireRoles("Admin", "Editor"))
			{
				handler := handlers.NewPageHandler(repos)
				pages.GET("", handler.List)
				pages.POST("", handler.Create)
				pages.GET("/:id", handler.GetByID)
				pages.PUT("/:id", handler.Update)
				pages.DELETE("/:id", handler.Delete)
			}

			// Menus (Admin)
			menus := protected.Group("/admin/menus")
			menus.Use(middleware.RequireRoles("Admin"))
			{
				handler := handlers.NewMenuHandler(repos)
				menus.GET("", handler.List)
				menus.POST("", handler.Create)
				menus.GET("/:id", handler.GetByID)
				menus.PUT("/:id", handler.Update)
				menus.DELETE("/:id", handler.Delete)
				menus.POST("/:id/items", handler.AddMenuItem)
				menus.GET("/:id/items", handler.GetMenuItems)
				menus.DELETE("/items/:item_id", handler.DeleteMenuItem)
			}

			// Settings (Admin)
			settings := protected.Group("/admin/settings")
			settings.Use(middleware.RequireRoles("Admin"))
			{
				handler := handlers.NewSettingHandler(repos)
				settings.GET("", handler.GetAll)
				settings.PUT("/:key", handler.Update)
			}

			// Users (Admin)
			users := protected.Group("/admin/users")
			users.Use(middleware.RequireRoles("Admin"))
			{
				handler := handlers.NewUserHandler(cfg, repos)
				users.GET("", handler.List)
				users.POST("", handler.Create)
				users.GET("/:id", handler.GetByID)
				users.PUT("/:id", handler.Update)
				users.DELETE("/:id", handler.Delete)
				users.POST("/:id/roles", handler.AssignRole)
				users.DELETE("/:id/roles/:role_id", handler.RemoveRole)
				users.PUT("/:id/password", handler.ChangePassword)
			}

			// Roles (Admin)
			roles := protected.Group("/admin/roles")
			roles.Use(middleware.RequireRoles("Admin"))
			{
				handler := handlers.NewRoleHandler(repos)
				roles.GET("", handler.List)
			}

			// Stats (Admin, Editor)
			stats := protected.Group("/stats")
			stats.Use(middleware.RequireRoles("Admin", "Editor"))
			{
				stats.GET("/overview", handlers.NewStatsHandler(repos).GetOverview)
			}

			// Audit Logs (Admin)
			audit := protected.Group("/admin/audit-logs")
			audit.Use(middleware.RequireRoles("Admin"))
			{
				audit.GET("", handlers.NewAuditLogHandler(repos).List)
			}

			// Introduction (Admin, Editor)
			introduction := protected.Group("/admin/introduction")
			introduction.Use(middleware.RequireRoles("Admin", "Editor"))
			{
				handler := handlers.NewIntroductionHandler(repos)
				introduction.GET("", handler.ListIntroductionPagesAdmin)
				introduction.PUT("/:key", handler.UpdateIntroductionPage)
			}

			// Activities (Admin, Editor)
			activities := protected.Group("/admin/activities")
			activities.Use(middleware.RequireRoles("Admin", "Editor"))
			{
				handler := handlers.NewActivityHandler(repos)
				activities.POST("", handler.Create)
				activities.PUT("/:id", handler.Update)
				activities.DELETE("/:id", handler.Delete)
				activities.POST("/:id/publish", handler.Publish)
			}
		}
	}
}
