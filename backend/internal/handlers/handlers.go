package handlers

import (
	"database/sql"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/text/runes"
	"golang.org/x/text/transform"
	"golang.org/x/text/unicode/norm"

	"github.com/thieugt95/portal-365/backend/internal/config"
	"github.com/thieugt95/portal-365/backend/internal/database"
	"github.com/thieugt95/portal-365/backend/internal/dto"
	"github.com/thieugt95/portal-365/backend/internal/middleware"
	"github.com/thieugt95/portal-365/backend/internal/models"
	"github.com/thieugt95/portal-365/backend/internal/repositories"
)

// Helper functions
func generateSlug(title string) string {
	// Convert to lowercase
	slug := strings.ToLower(title)

	// Remove Vietnamese diacritics
	t := transform.Chain(norm.NFD, runes.Remove(runes.In(unicode.Mn)), norm.NFC)
	slug, _, _ = transform.String(t, slug)

	// Replace special Vietnamese characters
	replacements := map[string]string{
		"đ": "d", "Đ": "d",
	}
	for old, new := range replacements {
		slug = strings.ReplaceAll(slug, old, new)
	}

	// Replace non-alphanumeric characters with hyphens
	reg := regexp.MustCompile("[^a-z0-9]+")
	slug = reg.ReplaceAllString(slug, "-")

	// Remove leading/trailing hyphens
	slug = strings.Trim(slug, "-")

	return slug
}

func getPage(c *gin.Context) int {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	return page
}

func getPageSize(c *gin.Context) int {
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	return pageSize
}

func getPagination(page, pageSize, total int) *dto.PaginationResponse {
	totalPages := (total + pageSize - 1) / pageSize
	return &dto.PaginationResponse{
		Page:       page,
		PageSize:   pageSize,
		Total:      total,
		TotalPages: totalPages,
	}
}

// toArticleResponse converts Article model to ArticleResponse with category and tags populated
func (h *ArticleHandler) toArticleResponse(c *gin.Context, article *models.Article) (*dto.ArticleResponse, error) {
	response := &dto.ArticleResponse{
		ID:            article.ID,
		Title:         article.Title,
		Slug:          article.Slug,
		Summary:       article.Summary,
		Content:       article.Content,
		FeaturedImage: article.FeaturedImage,
		AuthorID:      article.AuthorID,
		CategoryID:    article.CategoryID,
		Status:        string(article.Status),
		ViewCount:     article.ViewCount,
		IsFeatured:    article.IsFeatured,
		PublishedAt:   article.PublishedAt,
		ScheduledAt:   article.ScheduledAt,
		CreatedAt:     article.CreatedAt,
		UpdatedAt:     article.UpdatedAt,
	}

	// Get category with parent info
	category, err := h.repos.Categories.GetByID(c.Request.Context(), article.CategoryID)
	if err == nil && category != nil {
		response.CategoryName = category.Name
		categoryResp := &dto.CategoryResponse{
			ID:          category.ID,
			Name:        category.Name,
			Slug:        category.Slug,
			Description: category.Description,
			ParentID:    category.ParentID,
			SortOrder:   category.SortOrder,
			IsActive:    category.IsActive,
		}

		// Get parent slug if exists
		if category.ParentID != nil {
			parentCat, err := h.repos.Categories.GetByID(c.Request.Context(), *category.ParentID)
			if err == nil && parentCat != nil {
				categoryResp.ParentSlug = &parentCat.Slug
			}
		}
		response.Category = categoryResp
	}

	// Get tags
	tags, err := h.repos.Articles.GetTags(c.Request.Context(), article.ID)
	if err == nil && len(tags) > 0 {
		tagResponses := make([]dto.TagResponse, len(tags))
		for i, tag := range tags {
			tagResponses[i] = dto.TagResponse{
				ID:   tag.ID,
				Name: tag.Name,
				Slug: tag.Slug,
			}
		}
		response.Tags = tagResponses
	}

	return response, nil
}

// toArticleResponses batch converts multiple articles
func (h *ArticleHandler) toArticleResponses(c *gin.Context, articles []*models.Article) ([]*dto.ArticleResponse, error) {
	responses := make([]*dto.ArticleResponse, len(articles))
	for i, article := range articles {
		resp, err := h.toArticleResponse(c, article)
		if err != nil {
			// Log error but continue
			responses[i] = &dto.ArticleResponse{
				ID:            article.ID,
				Title:         article.Title,
				Slug:          article.Slug,
				Summary:       article.Summary,
				Content:       article.Content,
				FeaturedImage: article.FeaturedImage,
				AuthorID:      article.AuthorID,
				CategoryID:    article.CategoryID,
				Status:        string(article.Status),
				ViewCount:     article.ViewCount,
				IsFeatured:    article.IsFeatured,
				PublishedAt:   article.PublishedAt,
				ScheduledAt:   article.ScheduledAt,
				CreatedAt:     article.CreatedAt,
				UpdatedAt:     article.UpdatedAt,
			}
		} else {
			responses[i] = resp
		}
	}
	return responses, nil
}

// Article Handler
type ArticleHandler struct {
	repos *database.Repositories
}

func NewArticleHandler(repos *database.Repositories) *ArticleHandler {
	return &ArticleHandler{repos: repos}
}

// List godoc
// @Summary List articles (Admin)
// @Description Get paginated list of articles with filters (requires authentication)
// @Tags Articles
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Param category_id query int false "Filter by category ID"
// @Param category_slug query string false "Filter by category slug"
// @Param author_id query int false "Filter by author ID"
// @Param status query string false "Filter by status (draft, under_review, published, hidden, rejected)"
// @Param tag query string false "Filter by tag"
// @Param q query string false "Search query"
// @Param sort query string false "Sort by field" default(-published_at)
// @Success 200 {object} dto.SuccessResponse{data=[]models.Article,pagination=dto.PaginationResponse}
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/articles [get]
func (h *ArticleHandler) List(c *gin.Context) {
	page := getPage(c)
	pageSize := getPageSize(c)

	filter := &repositories.ArticleFilter{}
	if categoryID := c.Query("category_id"); categoryID != "" {
		id, _ := strconv.ParseInt(categoryID, 10, 64)
		filter.CategoryID = &id
	}
	if categorySlug := c.Query("category_slug"); categorySlug != "" {
		filter.CategorySlug = &categorySlug
	}
	if authorID := c.Query("author_id"); authorID != "" {
		id, _ := strconv.ParseInt(authorID, 10, 64)
		filter.AuthorID = &id
	}
	if status := c.Query("status"); status != "" {
		filter.Status = &status
	}
	if tag := c.Query("tag"); tag != "" {
		filter.Tag = &tag
	}
	// Support multiple tags: ?tag_slugs=tag1,tag2,tag3
	if tagSlugs := c.Query("tag_slugs"); tagSlugs != "" {
		filter.TagSlugs = strings.Split(tagSlugs, ",")
	}
	if query := c.Query("q"); query != "" {
		filter.Query = &query
	}

	sortBy := c.DefaultQuery("sort", "-published_at")

	articles, total, err := h.repos.Articles.List(c.Request.Context(), filter, page, pageSize, sortBy)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch articles")
		return
	}

	// Convert to responses with full category and tags
	responses, err := h.toArticleResponses(c, articles)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to build responses")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data:       responses,
		Pagination: getPagination(page, pageSize, total),
	})
}

// ListPublic godoc
// @Summary List published articles (Public)
// @Description Get paginated list of published articles with filters
// @Tags Articles
// @Accept json
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Param category_id query int false "Filter by category ID"
// @Param category_slug query string false "Filter by category slug"
// @Param tag query string false "Filter by tag"
// @Param q query string false "Search query"
// @Param sort query string false "Sort by field" default(-published_at)
// @Param is_featured query bool false "Filter featured articles"
// @Success 200 {object} dto.SuccessResponse{data=[]models.Article,pagination=dto.PaginationResponse}
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/articles [get]
func (h *ArticleHandler) ListPublic(c *gin.Context) {
	page := getPage(c)
	pageSize := getPageSize(c)

	published := string(models.StatusPublished)
	filter := &repositories.ArticleFilter{
		Status: &published,
	}

	if categoryID := c.Query("category_id"); categoryID != "" {
		id, _ := strconv.ParseInt(categoryID, 10, 64)
		filter.CategoryID = &id
	}
	if categorySlug := c.Query("category_slug"); categorySlug != "" {
		filter.CategorySlug = &categorySlug
	}
	if tag := c.Query("tag"); tag != "" {
		filter.Tag = &tag
	}
	// Support multiple tags: ?tag_slugs=tag1,tag2,tag3
	if tagSlugs := c.Query("tag_slugs"); tagSlugs != "" {
		filter.TagSlugs = strings.Split(tagSlugs, ",")
	}
	if featured := c.Query("is_featured"); featured == "true" {
		f := true
		filter.IsFeatured = &f
	}
	if query := c.Query("q"); query != "" {
		filter.Query = &query
	}

	sortBy := c.DefaultQuery("sort", "-published_at")

	articles, total, err := h.repos.Articles.List(c.Request.Context(), filter, page, pageSize, sortBy)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch articles")
		return
	}

	// Convert to responses with full category and tags
	responses, err := h.toArticleResponses(c, articles)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to build responses")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data:       responses,
		Pagination: getPagination(page, pageSize, total),
	})
}

// GetByID godoc
// @Summary Get article by ID (Admin)
// @Description Get a single article by ID (requires authentication)
// @Tags Articles
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=models.Article}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/admin/articles/{id} [get]
func (h *ArticleHandler) GetByID(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	article, err := h.repos.Articles.GetByID(c.Request.Context(), id)
	if err != nil {
		if err == sql.ErrNoRows {
			middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Article not found")
			return
		}
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch article")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: article})
}

// GetBySlug godoc
// @Summary Get article by slug (Public)
// @Description Get a published article by its slug
// @Tags Articles
// @Accept json
// @Produce json
// @Param slug path string true "Article slug"
// @Success 200 {object} dto.SuccessResponse{data=models.Article}
// @Failure 404 {object} middleware.ErrorResponse
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/articles/{slug} [get]
func (h *ArticleHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	article, err := h.repos.Articles.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if err == sql.ErrNoRows {
			middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Article not found")
			return
		}
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch article")
		return
	}

	// Convert to response with full category and tags
	response, err := h.toArticleResponse(c, article)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to build article response")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: response})
}

// Create godoc
// @Summary Create a new article
// @Description Create a new article with title, content, category, and tags. Requires authentication.
// @Tags Articles (Admin)
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param article body dto.CreateArticleRequest true "Article data"
// @Success 201 {object} dto.SuccessResponse{data=models.Article} "Article created successfully"
// @Failure 400 {object} middleware.ErrorResponse "Invalid request body"
// @Failure 401 {object} middleware.ErrorResponse "Unauthorized"
// @Failure 500 {object} middleware.ErrorResponse "Internal server error"
// @Router /api/v1/admin/articles [post]
func (h *ArticleHandler) Create(c *gin.Context) {
	var req dto.CreateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	userID := c.GetInt64("user_id")

	// Auto-generate slug from title if not provided
	slug := req.Slug
	if slug == "" {
		slug = generateSlug(req.Title)
	}

	// Convert FlexibleTime to *time.Time
	var scheduledAt *time.Time
	if req.ScheduledAt != nil {
		scheduledAt = req.ScheduledAt.ToTimePtr()
	}

	article := &models.Article{
		Title:         req.Title,
		Slug:          slug,
		Summary:       req.Summary,
		Content:       req.Content,
		FeaturedImage: req.FeaturedImage,
		AuthorID:      userID,
		CategoryID:    req.CategoryID,
		Status:        models.StatusDraft,
		IsFeatured:    req.IsFeatured,
		ScheduledAt:   scheduledAt,
	}

	if err := h.repos.Articles.Create(c.Request.Context(), article); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to create article")
		return
	}

	// Add tags
	for _, tagID := range req.TagIDs {
		h.repos.Articles.AddTag(c.Request.Context(), article.ID, tagID)
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: article})
}

// Update godoc
// @Summary Update an existing article
// @Description Update article details including title, content, category, and featured image. Requires authentication.
// @Tags Articles (Admin)
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Article ID"
// @Param article body dto.UpdateArticleRequest true "Updated article data"
// @Success 200 {object} dto.SuccessResponse{data=models.Article} "Article updated successfully"
// @Failure 400 {object} middleware.ErrorResponse "Invalid request body"
// @Failure 401 {object} middleware.ErrorResponse "Unauthorized"
// @Failure 404 {object} middleware.ErrorResponse "Article not found"
// @Failure 500 {object} middleware.ErrorResponse "Internal server error"
// @Router /api/v1/admin/articles/{id} [put]
func (h *ArticleHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	var req dto.UpdateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	article, err := h.repos.Articles.GetByID(c.Request.Context(), id)
	if err != nil {
		middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Article not found")
		return
	}

	// Convert FlexibleTime to *time.Time
	var scheduledAt *time.Time
	if req.ScheduledAt != nil {
		scheduledAt = req.ScheduledAt.ToTimePtr()
	}

	// Auto-generate slug from title if not provided
	slug := req.Slug
	if slug == "" {
		slug = generateSlug(req.Title)
	}

	article.Title = req.Title
	article.Slug = slug
	article.Summary = req.Summary
	article.Content = req.Content
	article.FeaturedImage = req.FeaturedImage
	article.CategoryID = req.CategoryID
	article.IsFeatured = req.IsFeatured
	article.ScheduledAt = scheduledAt

	if err := h.repos.Articles.Update(c.Request.Context(), article); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to update article")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: article})
}

// Delete godoc
// @Summary Delete an article
// @Description Permanently delete an article by ID. Requires Admin or Editor role.
// @Tags Articles (Admin)
// @Produce json
// @Security BearerAuth
// @Param id path int true "Article ID"
// @Success 200 {object} dto.SuccessResponse{data=object} "Article deleted successfully"
// @Failure 401 {object} middleware.ErrorResponse "Unauthorized"
// @Failure 404 {object} middleware.ErrorResponse "Article not found"
// @Failure 500 {object} middleware.ErrorResponse "Internal server error"
// @Router /api/v1/admin/articles/{id} [delete]
func (h *ArticleHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if err := h.repos.Articles.Delete(c.Request.Context(), id); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to delete article")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Article deleted"}})
}

// @Summary Submit article for review
// @Description Change article status to under_review
// @Tags Articles
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Article ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/articles/{id}/submit [post]
func (h *ArticleHandler) SubmitForReview(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if err := h.repos.Articles.UpdateStatus(c.Request.Context(), id, models.StatusUnderReview); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to submit article")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Article submitted for review"}})
}

// @Summary Approve article
// @Description Change article status to published
// @Tags Articles
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Article ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/articles/{id}/approve [post]
func (h *ArticleHandler) Approve(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if err := h.repos.Articles.UpdateStatus(c.Request.Context(), id, models.StatusPublished); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to approve article")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Article approved and published"}})
}

// @Summary Reject article
// @Description Change article status to rejected
// @Tags Articles
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Article ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/articles/{id}/reject [post]
func (h *ArticleHandler) Reject(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if err := h.repos.Articles.UpdateStatus(c.Request.Context(), id, models.StatusRejected); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to reject article")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Article rejected"}})
}

// @Summary Publish article
// @Description Change article status to published
// @Tags Articles
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Article ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/articles/{id}/publish [post]
func (h *ArticleHandler) Publish(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if err := h.repos.Articles.UpdateStatus(c.Request.Context(), id, models.StatusPublished); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to publish article")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Article published"}})
}

// @Summary Unpublish article
// @Description Change article status to hidden
// @Tags Articles
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Article ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/articles/{id}/unpublish [post]
func (h *ArticleHandler) Unpublish(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if err := h.repos.Articles.UpdateStatus(c.Request.Context(), id, models.StatusHidden); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to unpublish article")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Article unpublished"}})
}

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
func (h *ArticleHandler) GetRelated(c *gin.Context) {
	slug := c.Param("slug")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))

	article, err := h.repos.Articles.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Article not found")
		return
	}

	related, err := h.repos.Articles.GetRelated(c.Request.Context(), article.ID, limit)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch related articles")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: related})
}

func (h *ArticleHandler) RecordView(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	ipAddress := c.ClientIP()
	userAgent := c.GetHeader("User-Agent")

	// Record view with debounce
	if err := h.repos.Articles.RecordView(c.Request.Context(), id, ipAddress, userAgent); err != nil {
		// Silently fail, don't block user
		c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"recorded": false}})
		return
	}

	// Increment view count
	h.repos.Articles.IncrementViewCount(c.Request.Context(), id)

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"recorded": true}})
}

func (h *ArticleHandler) GetRevisions(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	revisions, err := h.repos.Articles.GetRevisions(c.Request.Context(), id)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch revisions")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: revisions})
}

// Home Handler
type HomeHandler struct {
	repos *database.Repositories
}

func NewHomeHandler(repos *database.Repositories) *HomeHandler {
	return &HomeHandler{repos: repos}
}

// CategorySection represents a category with its articles
type CategorySection struct {
	Category *models.Category  `json:"category"`
	Articles []*models.Article `json:"articles"`
}

// HomeResponse represents the home page data
type HomeResponse struct {
	Hero       *models.Article   `json:"hero,omitempty"`
	Breaking   []*models.Article `json:"breaking,omitempty"`
	Featured   []*models.Article `json:"featured,omitempty"`
	ByCategory []CategorySection `json:"by_category"`
	MostRead   []*models.Article `json:"most_read,omitempty"`
}

// GetHomeData godoc
// @Summary Get home page data
// @Description Get aggregated data for home page sections by category slugs
// @Tags Home
// @Accept json
// @Produce json
// @Param sections query string false "Comma-separated category slugs" example("hoat-dong-cua-thu-truong,tin-quan-su")
// @Success 200 {object} dto.SuccessResponse{data=HomeResponse}
// @Failure 500 {object} middleware.ErrorResponse
// @Router /api/v1/home [get]
func (h *HomeHandler) GetHomeData(c *gin.Context) {
	// Default category slugs for home page sections
	defaultSlugs := []string{"tin-quoc-te", "tin-trong-nuoc", "tin-quan-su", "tin-don-vi"}

	sectionsParam := c.Query("sections")
	var slugs []string

	if sectionsParam == "" {
		slugs = defaultSlugs
	} else {
		slugs = strings.Split(sectionsParam, ",")
	}

	result := HomeResponse{
		ByCategory: make([]CategorySection, 0, len(slugs)),
	}

	published := string(models.StatusPublished)

	// Fetch hero article (latest with thumbnail)
	heroFilter := &repositories.ArticleFilter{
		Status: &published,
	}
	heroArticles, _, err := h.repos.Articles.List(c.Request.Context(), heroFilter, 1, 1, "-published_at")
	if err == nil && len(heroArticles) > 0 {
		result.Hero = heroArticles[0]
	}

	// Fetch breaking news (latest 10)
	breakingArticles, _, err := h.repos.Articles.List(c.Request.Context(), heroFilter, 1, 10, "-published_at")
	if err == nil {
		result.Breaking = breakingArticles
	}

	// Fetch featured (latest 6)
	featuredArticles, _, err := h.repos.Articles.List(c.Request.Context(), heroFilter, 1, 6, "-published_at")
	if err == nil {
		result.Featured = featuredArticles
	}

	// Fetch most read (top 10 by view_count)
	mostReadArticles, _, err := h.repos.Articles.List(c.Request.Context(), heroFilter, 1, 10, "-view_count")
	if err == nil {
		result.MostRead = mostReadArticles
	}

	// For each slug, fetch category and its articles
	for _, slug := range slugs {
		slug = strings.TrimSpace(slug)
		if slug == "" {
			continue
		}

		// Get category by slug
		category, err := h.repos.Categories.GetBySlug(c.Request.Context(), slug)
		if err != nil {
			// Skip if category not found
			continue
		}

		// Get published articles for this category (max 6, sorted by -published_at)
		filter := &repositories.ArticleFilter{
			CategoryID: &category.ID,
			Status:     &published,
		}

		articles, _, err := h.repos.Articles.List(c.Request.Context(), filter, 1, 6, "-published_at")
		if err != nil {
			// Return empty articles on error but include the category
			articles = []*models.Article{}
		}

		result.ByCategory = append(result.ByCategory, CategorySection{
			Category: category,
			Articles: articles,
		})
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: result})
}

// Category Handler
type CategoryHandler struct {
	repos *database.Repositories
}

func NewCategoryHandler(repos *database.Repositories) *CategoryHandler {
	return &CategoryHandler{repos: repos}
}

// @Summary List all categories
// @Description Get all categories (public access)
// @Tags Categories
// @Accept json
// @Produce json
// @Success 200 {object} dto.SuccessResponse{data=[]models.Category}
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/categories [get]
func (h *CategoryHandler) List(c *gin.Context) {
	categories, err := h.repos.Categories.GetAll(c.Request.Context())
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch categories")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: categories})
}

// @Summary Get category tree for menu
// @Description Returns hierarchical category tree for navigation menu
// @Tags Categories
// @Accept json
// @Produce json
// @Success 200 {object} dto.SuccessResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/categories/menu [get]
func (h *CategoryHandler) GetMenuTree(c *gin.Context) {
	categories, err := h.repos.Categories.GetAll(c.Request.Context())
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch categories")
		return
	}

	// Convert []*models.Category to []models.Category
	catList := make([]models.Category, len(categories))
	for i, cat := range categories {
		catList[i] = *cat
	}

	// Build tree structure
	tree := buildCategoryTreeHelper(catList, nil)

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: tree})
}

// @Summary Get category by slug
// @Description Get a single category by its slug (public access)
// @Tags Categories
// @Accept json
// @Produce json
// @Param slug path string true "Category slug"
// @Success 200 {object} dto.SuccessResponse{data=models.Category}
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/categories/{slug} [get]
func (h *CategoryHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	category, err := h.repos.Categories.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if err == sql.ErrNoRows {
			middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Category not found")
			return
		}
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch category")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: category})
}

// @Summary Create a new category
// @Description Create a new category (admin only)
// @Tags Categories
// @Accept json
// @Produce json
// @Security Bearer
// @Param category body dto.CreateCategoryRequest true "Category details"
// @Success 201 {object} dto.SuccessResponse{data=models.Category}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/categories [post]
func (h *CategoryHandler) Create(c *gin.Context) {
	var req dto.CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	category := &models.Category{
		Name:        req.Name,
		Slug:        req.Slug,
		Description: req.Description,
		ParentID:    req.ParentID,
		SortOrder:   req.SortOrder,
		IsActive:    req.IsActive,
	}

	if err := h.repos.Categories.Create(c.Request.Context(), category); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to create category")
		return
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: category})
}

// @Summary Update a category
// @Description Update an existing category (admin only)
// @Tags Categories
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Category ID"
// @Param category body dto.UpdateCategoryRequest true "Category details"
// @Success 200 {object} dto.SuccessResponse{data=models.Category}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/categories/{id} [put]
func (h *CategoryHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	var req dto.UpdateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	category, err := h.repos.Categories.GetByID(c.Request.Context(), id)
	if err != nil {
		middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Category not found")
		return
	}

	category.Name = req.Name
	category.Slug = req.Slug
	category.Description = req.Description
	category.ParentID = req.ParentID
	category.SortOrder = req.SortOrder
	category.IsActive = req.IsActive

	if err := h.repos.Categories.Update(c.Request.Context(), category); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to update category")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: category})
}

// @Summary Delete a category
// @Description Delete a category by ID (admin only)
// @Tags Categories
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Category ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/categories/{id} [delete]
func (h *CategoryHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if err := h.repos.Categories.Delete(c.Request.Context(), id); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to delete category")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Category deleted"}})
}

// Tag Handler
type TagHandler struct {
	repos *database.Repositories
}

func NewTagHandler(repos *database.Repositories) *TagHandler {
	return &TagHandler{repos: repos}
}

// @Summary List all tags
// @Description Get all tags (public access)
// @Tags Tags
// @Accept json
// @Produce json
// @Success 200 {object} dto.SuccessResponse{data=[]models.Tag}
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/tags [get]
func (h *TagHandler) List(c *gin.Context) {
	tags, err := h.repos.Tags.GetAll(c.Request.Context())
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch tags")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: tags})
}

// @Summary Get tag by slug
// @Description Get a single tag by its slug (public access)
// @Tags Tags
// @Accept json
// @Produce json
// @Param slug path string true "Tag slug"
// @Success 200 {object} dto.SuccessResponse{data=models.Tag}
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/tags/{slug} [get]
func (h *TagHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	tag, err := h.repos.Tags.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if err == sql.ErrNoRows {
			middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Tag not found")
			return
		}
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch tag")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: tag})
}

// @Summary Create a new tag
// @Description Create a new tag (admin only)
// @Tags Tags
// @Accept json
// @Produce json
// @Security Bearer
// @Param tag body dto.CreateTagRequest true "Tag details"
// @Success 201 {object} dto.SuccessResponse{data=models.Tag}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/tags [post]
func (h *TagHandler) Create(c *gin.Context) {
	var req dto.CreateTagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	tag := &models.Tag{
		Name: req.Name,
		Slug: req.Slug,
	}

	if err := h.repos.Tags.Create(c.Request.Context(), tag); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to create tag")
		return
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: tag})
}

// @Summary Delete a tag
// @Description Delete a tag by ID (admin only)
// @Tags Tags
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path integer true "Tag ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/tags/{id} [delete]
func (h *TagHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if err := h.repos.Tags.Delete(c.Request.Context(), id); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to delete tag")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Tag deleted"}})
}

// User Handler
type UserHandler struct {
	cfg   *config.Config
	repos *database.Repositories
}

func NewUserHandler(cfg *config.Config, repos *database.Repositories) *UserHandler {
	return &UserHandler{cfg: cfg, repos: repos}
}

func (h *UserHandler) List(c *gin.Context) {
	page := getPage(c)
	pageSize := getPageSize(c)

	users, total, err := h.repos.Users.List(c.Request.Context(), page, pageSize)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch users")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data:       users,
		Pagination: getPagination(page, pageSize, total),
	})
}

func (h *UserHandler) GetByID(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	user, err := h.repos.Users.GetByID(c.Request.Context(), id)
	if err != nil {
		middleware.AbortWithError(c, http.StatusNotFound, "not_found", "User not found")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: user})
}

func (h *UserHandler) Create(c *gin.Context) {
	var req dto.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to hash password")
		return
	}

	user := &models.User{
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		FullName:     req.FullName,
		Avatar:       req.Avatar,
		IsActive:     true,
	}

	if err := h.repos.Users.Create(c.Request.Context(), user); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to create user")
		return
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: user})
}

func (h *UserHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	var req dto.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	user, err := h.repos.Users.GetByID(c.Request.Context(), id)
	if err != nil {
		middleware.AbortWithError(c, http.StatusNotFound, "not_found", "User not found")
		return
	}

	user.Email = req.Email
	user.FullName = req.FullName
	user.Avatar = req.Avatar
	user.IsActive = req.IsActive

	if err := h.repos.Users.Update(c.Request.Context(), user); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to update user")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: user})
}

func (h *UserHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if err := h.repos.Users.Delete(c.Request.Context(), id); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to delete user")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "User deleted"}})
}

func (h *UserHandler) AssignRole(c *gin.Context) {
	userID, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var req struct {
		RoleID int64 `json:"role_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	if err := h.repos.Users.AssignRole(c.Request.Context(), userID, req.RoleID); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to assign role")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Role assigned"}})
}

func (h *UserHandler) RemoveRole(c *gin.Context) {
	userID, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	roleID, _ := strconv.ParseInt(c.Param("role_id"), 10, 64)

	if err := h.repos.Users.RemoveRole(c.Request.Context(), userID, roleID); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to remove role")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Role removed"}})
}

func (h *UserHandler) ChangePassword(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	var req dto.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	user, err := h.repos.Users.GetByID(c.Request.Context(), id)
	if err != nil {
		middleware.AbortWithError(c, http.StatusNotFound, "not_found", "User not found")
		return
	}

	// Verify old password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.OldPassword)); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_password", "Invalid old password")
		return
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to hash password")
		return
	}

	user.PasswordHash = string(hashedPassword)
	if err := h.repos.Users.Update(c.Request.Context(), user); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to change password")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Password changed"}})
}

// Role Handler
type RoleHandler struct {
	repos *database.Repositories
}

func NewRoleHandler(repos *database.Repositories) *RoleHandler {
	return &RoleHandler{repos: repos}
}

func (h *RoleHandler) List(c *gin.Context) {
	roles, err := h.repos.Roles.GetAll(c.Request.Context())
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch roles")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: roles})
}

// Page, Menu, Banner, Comment, Media, Setting, Stats, AuditLog, Search handlers would follow similar patterns
// Creating stubs for them:

type PageHandler struct{ repos *database.Repositories }

func NewPageHandler(repos *database.Repositories) *PageHandler { return &PageHandler{repos: repos} }

// List godoc
// @Summary List pages
// @Description Get list of pages with optional filters
// @Tags Pages
// @Accept json
// @Produce json
// @Param group query string false "Filter by group (e.g. introduction)"
// @Param status query string false "Filter by status (draft, published)"
// @Success 200 {object} dto.SuccessResponse{data=[]models.Page}
// @Router /api/v1/pages [get]
func (h *PageHandler) List(c *gin.Context) {
	group := c.Query("group")
	status := c.Query("status")

	var groupPtr, statusPtr *string
	if group != "" {
		groupPtr = &group
	}
	if status != "" {
		statusPtr = &status
	}

	pages, err := h.repos.Pages.List(c.Request.Context(), groupPtr, statusPtr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{Code: "LIST_FAILED", Message: "Failed to list pages"},
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: pages})
}

// GetBySlug godoc
// @Summary Get page by slug
// @Description Get a single page by its slug (public endpoint)
// @Tags Pages
// @Accept json
// @Produce json
// @Param slug path string true "Page slug (e.g. intro/history)"
// @Success 200 {object} dto.SuccessResponse{data=models.Page}
// @Failure 404 {object} dto.ErrorResponse
// @Router /api/v1/pages/{slug} [get]
func (h *PageHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	page, err := h.repos.Pages.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, dto.ErrorResponse{
			Error: dto.ErrorDetail{Code: "NOT_FOUND", Message: "Page not found"},
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: page})
}

// GetByID godoc
// @Summary Get page by ID
// @Description Get a single page by its ID (admin only)
// @Tags Pages
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Page ID"
// @Success 200 {object} dto.SuccessResponse{data=models.Page}
// @Failure 404 {object} dto.ErrorResponse
// @Router /api/v1/admin/pages/{id} [get]
func (h *PageHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{Code: "INVALID_ID", Message: "Invalid page ID"},
		})
		return
	}

	page, err := h.repos.Pages.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, dto.ErrorResponse{
			Error: dto.ErrorDetail{Code: "NOT_FOUND", Message: "Page not found"},
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: page})
}

// Create godoc
// @Summary Create page
// @Description Create a new page (admin only)
// @Tags Pages
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param page body dto.CreatePageRequest true "Page data"
// @Success 201 {object} dto.SuccessResponse{data=models.Page}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 409 {object} dto.ErrorResponse
// @Router /api/v1/admin/pages [post]
func (h *PageHandler) Create(c *gin.Context) {
	var req dto.CreatePageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{Code: "INVALID_INPUT", Message: err.Error()},
		})
		return
	}

	page := &models.Page{
		Title:          req.Title,
		Slug:           req.Slug,
		Group:          req.Group,
		Content:        req.Content,
		Status:         models.PageStatus(req.Status),
		Order:          req.Order,
		HeroImageURL:   req.HeroImageURL,
		SeoTitle:       req.SeoTitle,
		SeoDescription: req.SeoDescription,
		IsActive:       true,
	}

	if req.Status == "published" {
		now := time.Now()
		page.PublishedAt = &now
	}

	if err := h.repos.Pages.Create(c.Request.Context(), page); err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed") {
			c.JSON(http.StatusConflict, dto.ErrorResponse{
				Error: dto.ErrorDetail{Code: "DUPLICATE_SLUG", Message: "Slug already exists"},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{Code: "CREATE_FAILED", Message: "Failed to create page"},
		})
		return
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: page})
}

// Update godoc
// @Summary Update page
// @Description Update an existing page (admin only)
// @Tags Pages
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Page ID"
// @Param page body dto.UpdatePageRequest true "Page data"
// @Success 200 {object} dto.SuccessResponse{data=models.Page}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Router /api/v1/admin/pages/{id} [put]
func (h *PageHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{Code: "INVALID_ID", Message: "Invalid page ID"},
		})
		return
	}

	existing, err := h.repos.Pages.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, dto.ErrorResponse{
			Error: dto.ErrorDetail{Code: "NOT_FOUND", Message: "Page not found"},
		})
		return
	}

	var req dto.UpdatePageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{Code: "INVALID_INPUT", Message: err.Error()},
		})
		return
	}

	existing.Title = req.Title
	existing.Slug = req.Slug
	existing.Group = req.Group
	existing.Content = req.Content
	existing.Status = models.PageStatus(req.Status)
	existing.Order = req.Order
	existing.HeroImageURL = req.HeroImageURL
	existing.SeoTitle = req.SeoTitle
	existing.SeoDescription = req.SeoDescription
	existing.IsActive = req.IsActive

	if req.Status == "published" && existing.PublishedAt == nil {
		now := time.Now()
		existing.PublishedAt = &now
	}

	if err := h.repos.Pages.Update(c.Request.Context(), existing); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{Code: "UPDATE_FAILED", Message: "Failed to update page"},
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: existing})
}

// Delete godoc
// @Summary Delete page
// @Description Delete a page (admin only)
// @Tags Pages
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Page ID"
// @Success 200 {object} dto.SuccessResponse{data=object}
// @Failure 400 {object} dto.ErrorResponse
// @Router /api/v1/admin/pages/{id} [delete]
func (h *PageHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{Code: "INVALID_ID", Message: "Invalid page ID"},
		})
		return
	}

	if err := h.repos.Pages.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{Code: "DELETE_FAILED", Message: "Failed to delete page"},
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Page deleted successfully"}})
}

type MenuHandler struct{ repos *database.Repositories }

func NewMenuHandler(repos *database.Repositories) *MenuHandler { return &MenuHandler{repos: repos} }
func (h *MenuHandler) List(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: []interface{}{}})
}
func (h *MenuHandler) GetByID(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{}})
}
func (h *MenuHandler) Create(c *gin.Context) {
	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: gin.H{}})
}
func (h *MenuHandler) Update(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{}})
}
func (h *MenuHandler) Delete(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Deleted"}})
}
func (h *MenuHandler) AddMenuItem(c *gin.Context) {
	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: gin.H{}})
}
func (h *MenuHandler) GetMenuItems(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: []interface{}{}})
}
func (h *MenuHandler) DeleteMenuItem(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Deleted"}})
}

type BannerHandler struct{ repos *database.Repositories }

func NewBannerHandler(repos *database.Repositories) *BannerHandler {
	return &BannerHandler{repos: repos}
}
func (h *BannerHandler) List(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: []interface{}{}})
}
func (h *BannerHandler) GetByID(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{}})
}
func (h *BannerHandler) GetByPlacement(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: []interface{}{}})
}
func (h *BannerHandler) Create(c *gin.Context) {
	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: gin.H{}})
}
func (h *BannerHandler) Update(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{}})
}
func (h *BannerHandler) Delete(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Deleted"}})
}

type CommentHandler struct{ repos *database.Repositories }

func NewCommentHandler(repos *database.Repositories) *CommentHandler {
	return &CommentHandler{repos: repos}
}
func (h *CommentHandler) List(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: []interface{}{}})
}
func (h *CommentHandler) GetByArticle(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: []interface{}{}})
}
func (h *CommentHandler) Create(c *gin.Context) {
	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: gin.H{}})
}
func (h *CommentHandler) Approve(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Approved"}})
}
func (h *CommentHandler) Delete(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Deleted"}})
}

type MediaHandler struct{ repos *database.Repositories }

func NewMediaHandler(repos *database.Repositories) *MediaHandler { return &MediaHandler{repos: repos} }
func (h *MediaHandler) List(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: []interface{}{}})
}
func (h *MediaHandler) GetByID(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{}})
}
func (h *MediaHandler) Upload(c *gin.Context) {
	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: gin.H{}})
}
func (h *MediaHandler) Delete(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Deleted"}})
}

type SettingHandler struct{ repos *database.Repositories }

func NewSettingHandler(repos *database.Repositories) *SettingHandler {
	return &SettingHandler{repos: repos}
}
func (h *SettingHandler) GetPublic(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: []interface{}{}})
}
func (h *SettingHandler) GetAll(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: []interface{}{}})
}
func (h *SettingHandler) Update(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{}})
}

type StatsHandler struct{ repos *database.Repositories }

func NewStatsHandler(repos *database.Repositories) *StatsHandler { return &StatsHandler{repos: repos} }
func (h *StatsHandler) GetOverview(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: dto.StatsResponse{
		TotalArticles:     0,
		PublishedArticles: 0,
		TotalUsers:        0,
		TotalCategories:   0,
		TotalComments:     0,
	}})
}

type AuditLogHandler struct{ repos *database.Repositories }

func NewAuditLogHandler(repos *database.Repositories) *AuditLogHandler {
	return &AuditLogHandler{repos: repos}
}
func (h *AuditLogHandler) List(c *gin.Context) {
	c.JSON(http.StatusOK, dto.SuccessResponse{Data: []interface{}{}})
}

type SearchHandler struct{ repos *database.Repositories }

func NewSearchHandler(repos *database.Repositories) *SearchHandler {
	return &SearchHandler{repos: repos}
}

// Search godoc
// @Summary Search articles
// @Description Search articles by keyword in title, content, and excerpt
// @Tags Search
// @Accept json
// @Produce json
// @Param q query string true "Search keyword"
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Success 200 {object} dto.SuccessResponse{data=[]models.Article,pagination=dto.PaginationResponse}
// @Failure 400 {object} middleware.ErrorResponse
// @Router /api/v1/search [get]
func (h *SearchHandler) Search(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, middleware.ErrorResponse{
			Error: middleware.ErrorDetail{
				Code:    "INVALID_REQUEST",
				Message: "Search query is required",
			},
		})
		return
	}

	page := getPage(c)
	pageSize := getPageSize(c)

	published := string(models.StatusPublished)
	filter := &repositories.ArticleFilter{
		Status: &published,
		Query:  &query,
	}

	articles, total, err := h.repos.Articles.List(c.Request.Context(), filter, page, pageSize, "-published_at")
	if err != nil {
		c.JSON(http.StatusInternalServerError, middleware.ErrorResponse{
			Error: middleware.ErrorDetail{
				Code:    "SEARCH_ERROR",
				Message: "Failed to search articles",
			},
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data:       articles,
		Pagination: getPagination(page, pageSize, total),
	})
}

// CategoryTreeNode represents a category with its children for menu tree
type CategoryTreeNode struct {
	models.Category
	Children []CategoryTreeNode `json:"children,omitempty"`
}

// buildCategoryTreeHelper builds a hierarchical category tree
func buildCategoryTreeHelper(categories []models.Category, parentID *int64) []CategoryTreeNode {
	var result []CategoryTreeNode

	for _, cat := range categories {
		// Check if this category matches the parent
		if (parentID == nil && cat.ParentID == nil) ||
			(parentID != nil && cat.ParentID != nil && *cat.ParentID == *parentID) {

			node := CategoryTreeNode{
				Category: cat,
				Children: buildCategoryTreeHelper(categories, &cat.ID),
			}
			result = append(result, node)
		}
	}

	return result
}
