# Swagger Comments To Add

## UserHandler

```go
// @Summary List all users
// @Description Get a paginated list of users (admin only)
// @Tags Users
// @Accept json
// @Produce json
// @Security Bearer
// @Param page query integer false "Page number (default: 1)"
// @Param page_size query integer false "Page size (default: 20)"
// @Success 200 {object} dto.SuccessResponse{data=[]models.User}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/users [get]

// @Summary Get user by ID
// @Description Get a single user by ID (admin only)
// @Tags Users
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "User ID"
// @Success 200 {object} dto.SuccessResponse{data=models.User}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /api/v1/admin/users/{id} [get]

// @Summary Create a new user
// @Description Create a new user account (admin only)
// @Tags Users
// @Accept json
// @Produce json
// @Security Bearer
// @Param user body dto.CreateUserRequest true "User details"
// @Success 201 {object} dto.SuccessResponse{data=models.User}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/users [post]

// @Summary Update user
// @Description Update an existing user (admin only)
// @Tags Users
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "User ID"
// @Param user body dto.UpdateUserRequest true "User details"
// @Success 200 {object} dto.SuccessResponse{data=models.User}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/users/{id} [put]

// @Summary Delete user
// @Description Delete a user by ID (admin only)
// @Tags Users
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "User ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/users/{id} [delete]
```

## Article Handler (remaining functions)

```go
// @Summary Submit article for review
// @Description Change article status to under_review
// @Tags Articles
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=models.Article}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/articles/{id}/submit [post]

// @Summary Publish article
// @Description Change article status to published
// @Tags Articles
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=models.Article}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/articles/{id}/publish [post]

// @Summary Unpublish article
// @Description Change article status to draft
// @Tags Articles
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=models.Article}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/articles/{id}/unpublish [post]

// @Summary Reject article
// @Description Change article status to rejected
// @Tags Articles
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=models.Article}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/articles/{id}/reject [post]

// @Summary Get related articles
// @Description Get articles related to the specified article
// @Tags Articles
// @Accept json
// @Produce json
// @Param slug path string true "Article slug"
// @Param limit query integer false "Number of related articles (default: 5)"
// @Success 200 {object} dto.SuccessResponse{data=[]models.Article}
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/articles/{slug}/related [get]

// @Summary Get article revisions
// @Description Get revision history for an article
// @Tags Articles
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=[]models.ArticleRevision}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/articles/{id}/revisions [get]

// @Summary Record article view
// @Description Increment view count for an article
// @Tags Articles
// @Accept json
// @Produce json
// @Param id path integer true "Article ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/articles/{id}/views [post]
```

## MenuHandler

```go
// @Summary List all menus
// @Description Get all menus (admin only)
// @Tags Menus
// @Accept json
// @Produce json
// @Security Bearer
// @Success 200 {object} dto.SuccessResponse{data=[]models.Menu}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/menus [get]

// @Summary Get menu by ID
// @Description Get a single menu by ID (admin only)
// @Tags Menus
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Menu ID"
// @Success 200 {object} dto.SuccessResponse{data=models.Menu}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /api/v1/admin/menus/{id} [get]

// @Summary Create menu
// @Description Create a new menu (admin only)
// @Tags Menus
// @Accept json
// @Produce json
// @Security Bearer
// @Param menu body dto.CreateMenuRequest true "Menu details"
// @Success 201 {object} dto.SuccessResponse{data=models.Menu}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/menus [post]

// @Summary Update menu
// @Description Update an existing menu (admin only)
// @Tags Menus
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Menu ID"
// @Param menu body dto.UpdateMenuRequest true "Menu details"
// @Success 200 {object} dto.SuccessResponse{data=models.Menu}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/menus/{id} [put]

// @Summary Delete menu
// @Description Delete a menu by ID (admin only)
// @Tags Menus
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Menu ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/menus/{id} [delete]

// @Summary Add menu item
// @Description Add an item to a menu (admin only)
// @Tags Menus
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Menu ID"
// @Param item body dto.CreateMenuItemRequest true "Menu item details"
// @Success 201 {object} dto.SuccessResponse{data=models.MenuItem}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/menus/{id}/items [post]

// @Summary Get menu items
// @Description Get all items for a menu (admin only)
// @Tags Menus
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Menu ID"
// @Success 200 {object} dto.SuccessResponse{data=[]models.MenuItem}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/menus/{id}/items [get]

// @Summary Delete menu item
// @Description Delete a menu item (admin only)
// @Tags Menus
// @Accept json
// @Produce json
// @Security Bearer
// @Param item_id path integer true "Menu item ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/menus/items/{item_id} [delete]
```

## BannerHandler

```go
// @Summary List all banners
// @Description Get all banners (admin only)
// @Tags Banners
// @Accept json
// @Produce json
// @Security Bearer
// @Success 200 {object} dto.SuccessResponse{data=[]models.Banner}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/banners [get]

// @Summary Get banner by ID
// @Description Get a single banner by ID (admin only)
// @Tags Banners
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Banner ID"
// @Success 200 {object} dto.SuccessResponse{data=models.Banner}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /api/v1/admin/banners/{id} [get]

// @Summary Get banners by placement
// @Description Get active banners for a specific placement (public access)
// @Tags Banners
// @Accept json
// @Produce json
// @Param placement query string false "Banner placement (header, sidebar, footer)"
// @Success 200 {object} dto.SuccessResponse{data=[]models.Banner}
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/banners [get]

// @Summary Create banner
// @Description Create a new banner (admin only)
// @Tags Banners
// @Accept json
// @Produce json
// @Security Bearer
// @Param banner body dto.CreateBannerRequest true "Banner details"
// @Success 201 {object} dto.SuccessResponse{data=models.Banner}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/banners [post]

// @Summary Update banner
// @Description Update an existing banner (admin only)
// @Tags Banners
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Banner ID"
// @Param banner body dto.UpdateBannerRequest true "Banner details"
// @Success 200 {object} dto.SuccessResponse{data=models.Banner}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/banners/{id} [put]

// @Summary Delete banner
// @Description Delete a banner by ID (admin only)
// @Tags Banners
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Banner ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/banners/{id} [delete]
```

## CommentHandler

```go
// @Summary List all comments
// @Description Get a list of all comments (admin only)
// @Tags Comments
// @Accept json
// @Produce json
// @Security Bearer
// @Success 200 {object} dto.SuccessResponse{data=[]models.Comment}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/comments [get]

// @Summary Get comments by article
// @Description Get all comments for a specific article (public access)
// @Tags Comments
// @Accept json
// @Produce json
// @Param article_id path integer true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=[]models.Comment}
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/comments/article/{article_id} [get]

// @Summary Create comment
// @Description Create a new comment on an article (public access)
// @Tags Comments
// @Accept json
// @Produce json
// @Param comment body dto.CreateCommentRequest true "Comment details"
// @Success 201 {object} dto.SuccessResponse{data=models.Comment}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/comments [post]

// @Summary Approve comment
// @Description Approve a pending comment (admin only)
// @Tags Comments
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Comment ID"
// @Success 200 {object} dto.SuccessResponse{data=models.Comment}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/comments/{id}/approve [post]

// @Summary Delete comment
// @Description Delete a comment by ID (admin only)
// @Tags Comments
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Comment ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/comments/{id} [delete]
```

## MediaHandler

```go
// @Summary List all media
// @Description Get a paginated list of media files (admin only)
// @Tags Media
// @Accept json
// @Produce json
// @Security Bearer
// @Param page query integer false "Page number (default: 1)"
// @Param page_size query integer false "Page size (default: 20)"
// @Success 200 {object} dto.SuccessResponse{data=[]models.Media}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/media [get]

// @Summary Get media by ID
// @Description Get a single media file by ID (admin only)
// @Tags Media
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Media ID"
// @Success 200 {object} dto.SuccessResponse{data=models.Media}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /api/v1/admin/media/{id} [get]

// @Summary Upload media
// @Description Upload a new media file (admin only)
// @Tags Media
// @Accept multipart/form-data
// @Produce json
// @Security Bearer
// @Param file formData file true "Media file"
// @Success 201 {object} dto.SuccessResponse{data=models.Media}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/media/upload [post]

// @Summary Delete media
// @Description Delete a media file by ID (admin only)
// @Tags Media
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Media ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/media/{id} [delete]
```

## SettingHandler

```go
// @Summary Get public settings
// @Description Get publicly available settings (public access)
// @Tags Settings
// @Accept json
// @Produce json
// @Success 200 {object} dto.SuccessResponse{data=map[string]interface{}}
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/settings [get]

// @Summary Get all settings
// @Description Get all settings including private ones (admin only)
// @Tags Settings
// @Accept json
// @Produce json
// @Security Bearer
// @Success 200 {object} dto.SuccessResponse{data=[]models.Setting}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/settings [get]

// @Summary Update setting
// @Description Update a setting value (admin only)
// @Tags Settings
// @Accept json
// @Produce json
// @Security Bearer
// @Param key path string true "Setting key"
// @Param setting body dto.UpdateSettingRequest true "Setting value"
// @Success 200 {object} dto.SuccessResponse{data=models.Setting}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/settings/{key} [put]
```

## SearchHandler

```go
// @Summary Search content
// @Description Search for articles, pages, and other content
// @Tags Search
// @Accept json
// @Produce json
// @Param q query string true "Search query"
// @Param type query string false "Content type to search (articles, pages, all)"
// @Param page query integer false "Page number (default: 1)"
// @Param page_size query integer false "Page size (default: 20)"
// @Success 200 {object} dto.SuccessResponse{data=map[string]interface{}}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/search [get]
```

## RoleHandler

```go
// @Summary List all roles
// @Description Get all available roles (admin only)
// @Tags Roles
// @Accept json
// @Produce json
// @Security Bearer
// @Success 200 {object} dto.SuccessResponse{data=[]models.Role}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/roles [get]
```
