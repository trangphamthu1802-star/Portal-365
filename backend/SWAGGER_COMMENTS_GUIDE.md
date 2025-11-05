# Swagger Comments for handlers.go

## Instructions:
Copy and paste these comments above each corresponding function in handlers.go

---

## ArticleHandler

### Create
```go
// Create godoc
// @Summary Create article (Admin)
// @Description Create a new article
// @Tags Articles
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param article body dto.CreateArticleRequest true "Article data"
// @Success 201 {object} dto.SuccessResponse{data=models.Article}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/articles [post]
```

### Update
```go
// Update godoc
// @Summary Update article (Admin)
// @Description Update an existing article
// @Tags Articles
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Article ID"
// @Param article body dto.UpdateArticleRequest true "Article data"
// @Success 200 {object} dto.SuccessResponse{data=models.Article}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/articles/{id} [put]
```

### Delete
```go
// Delete godoc
// @Summary Delete article (Admin)
// @Description Delete an article
// @Tags Articles
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=object}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/articles/{id} [delete]
```

### SubmitForReview
```go
// SubmitForReview godoc
// @Summary Submit article for review
// @Description Change article status to under_review
// @Tags Articles
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=object}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/articles/{id}/submit [post]
```

### Approve
```go
// Approve godoc
// @Summary Approve article
// @Description Approve an article under review
// @Tags Articles
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=object}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/articles/{id}/approve [post]
```

### Reject
```go
// Reject godoc
// @Summary Reject article
// @Description Reject an article under review
// @Tags Articles
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=object}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/articles/{id}/reject [post]
```

### Publish
```go
// Publish godoc
// @Summary Publish article
// @Description Publish an article (set status to published)
// @Tags Articles
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=object}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/articles/{id}/publish [post]
```

### Unpublish
```go
// Unpublish godoc
// @Summary Unpublish article
// @Description Unpublish an article (set status to hidden)
// @Tags Articles
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=object}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/articles/{id}/unpublish [post]
```

### GetRelated
```go
// GetRelated godoc
// @Summary Get related articles
// @Description Get related articles for a specific article
// @Tags Articles
// @Accept json
// @Produce json
// @Param slug path string true "Article slug"
// @Success 200 {object} dto.SuccessResponse{data=[]models.Article}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/articles/{slug}/related [get]
```

### RecordView
```go
// RecordView godoc
// @Summary Record article view
// @Description Increment view count for an article
// @Tags Articles
// @Accept json
// @Produce json
// @Param id path int true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=object}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/articles/{id}/views [post]
```

### GetRevisions
```go
// GetRevisions godoc
// @Summary Get article revisions
// @Description Get revision history for an article
// @Tags Articles
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=[]models.ArticleRevision}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/articles/{id}/revisions [get]
```

---

## CategoryHandler

### List
```go
// List godoc
// @Summary List categories
// @Description Get all categories
// @Tags Categories
// @Accept json
// @Produce json
// @Success 200 {object} dto.SuccessResponse{data=[]models.Category}
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/categories [get]
```

### GetBySlug
```go
// GetBySlug godoc
// @Summary Get category by slug
// @Description Get a single category by its slug
// @Tags Categories
// @Accept json
// @Produce json
// @Param slug path string true "Category slug"
// @Success 200 {object} dto.SuccessResponse{data=models.Category}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/categories/{slug} [get]
```

### Create
```go
// Create godoc
// @Summary Create category (Admin)
// @Description Create a new category
// @Tags Categories
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param category body dto.CreateCategoryRequest true "Category data"
// @Success 201 {object} dto.SuccessResponse{data=models.Category}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/categories [post]
```

### Update
```go
// Update godoc
// @Summary Update category (Admin)
// @Description Update an existing category
// @Tags Categories
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Category ID"
// @Param category body dto.UpdateCategoryRequest true "Category data"
// @Success 200 {object} dto.SuccessResponse{data=models.Category}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/categories/{id} [put]
```

### Delete
```go
// Delete godoc
// @Summary Delete category (Admin)
// @Description Delete a category
// @Tags Categories
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Category ID"
// @Success 200 {object} dto.SuccessResponse{data=object}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/categories/{id} [delete]
```

---

## TagHandler

### List
```go
// List godoc
// @Summary List tags
// @Description Get all tags
// @Tags Tags
// @Accept json
// @Produce json
// @Success 200 {object} dto.SuccessResponse{data=[]models.Tag}
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/tags [get]
```

### GetBySlug
```go
// GetBySlug godoc
// @Summary Get tag by slug
// @Description Get a single tag by its slug
// @Tags Tags
// @Accept json
// @Produce json
// @Param slug path string true "Tag slug"
// @Success 200 {object} dto.SuccessResponse{data=models.Tag}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/tags/{slug} [get]
```

### Create
```go
// Create godoc
// @Summary Create tag (Admin)
// @Description Create a new tag
// @Tags Tags
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param tag body dto.CreateTagRequest true "Tag data"
// @Success 201 {object} dto.SuccessResponse{data=models.Tag}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/tags [post]
```

### Delete
```go
// Delete godoc
// @Summary Delete tag (Admin)
// @Description Delete a tag
// @Tags Tags
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Tag ID"
// @Success 200 {object} dto.SuccessResponse{data=object}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/tags/{id} [delete]
```

---

## UserHandler

### List
```go
// List godoc
// @Summary List users (Admin)
// @Description Get paginated list of users
// @Tags Users
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Success 200 {object} dto.SuccessResponse{data=[]dto.UserResponse,pagination=dto.PaginationResponse}
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/users [get]
```

### GetByID
```go
// GetByID godoc
// @Summary Get user by ID (Admin)
// @Description Get a single user by ID
// @Tags Users
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} dto.SuccessResponse{data=dto.UserResponse}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/users/{id} [get]
```

### Create
```go
// Create godoc
// @Summary Create user (Admin)
// @Description Create a new user
// @Tags Users
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param user body dto.CreateUserRequest true "User data"
// @Success 201 {object} dto.SuccessResponse{data=dto.UserResponse}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/users [post]
```

### Update
```go
// Update godoc
// @Summary Update user (Admin)
// @Description Update an existing user
// @Tags Users
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param user body dto.UpdateUserRequest true "User data"
// @Success 200 {object} dto.SuccessResponse{data=dto.UserResponse}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/users/{id} [put]
```

### Delete
```go
// Delete godoc
// @Summary Delete user (Admin)
// @Description Delete a user
// @Tags Users
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} dto.SuccessResponse{data=object}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/users/{id} [delete]
```

### AssignRole
```go
// AssignRole godoc
// @Summary Assign role to user (Admin)
// @Description Assign a role to a user
// @Tags Users
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param role_id body object{role_id=int} true "Role ID"
// @Success 200 {object} dto.SuccessResponse{data=object}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/users/{id}/roles [post]
```

### RemoveRole
```go
// RemoveRole godoc
// @Summary Remove role from user (Admin)
// @Description Remove a role from a user
// @Tags Users
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param role_id path int true "Role ID"
// @Success 200 {object} dto.SuccessResponse{data=object}
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/users/{id}/roles/{role_id} [delete]
```

### ChangePassword
```go
// ChangePassword godoc
// @Summary Change user password (Admin)
// @Description Change password for a user
// @Tags Users
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param password body dto.ChangePasswordRequest true "Password data"
// @Success 200 {object} dto.SuccessResponse{data=object}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/users/{id}/password [put]
```

---

## RoleHandler

### List
```go
// List godoc
// @Summary List roles (Admin)
// @Description Get all roles
// @Tags Roles
// @Security BearerAuth
// @Accept json
// @Produce json
// @Success 200 {object} dto.SuccessResponse{data=[]models.Role}
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/roles [get]
```

---

NOTE: PageHandler already has complete Swagger comments in the file.
Run `.\gen-swagger.ps1` after adding these comments to regenerate the Swagger documentation.
