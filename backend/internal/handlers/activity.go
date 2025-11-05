package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/thieugt95/portal-365/backend/internal/database"
	"github.com/thieugt95/portal-365/backend/internal/dto"
	"github.com/thieugt95/portal-365/backend/internal/middleware"
	"github.com/thieugt95/portal-365/backend/internal/models"
	"github.com/thieugt95/portal-365/backend/internal/repositories"
)

type ActivityHandler struct {
	repos *database.Repositories
}

func NewActivityHandler(repos *database.Repositories) *ActivityHandler {
	return &ActivityHandler{repos: repos}
}

// ListActivities godoc
// @Summary List all activities
// @Description Get list of published activities with pagination
// @Tags Activities
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Items per page" default(20)
// @Success 200 {object} dto.SuccessResponse{data=[]models.Article,pagination=dto.PaginationResponse}
// @Router /activities [get]
func (h *ActivityHandler) List(c *gin.Context) {
	page := getPage(c)
	pageSize := getPageSize(c)

	// Lấy articles với category "Activities"
	published := string(models.StatusPublished)
	filter := &repositories.ArticleFilter{
		Status: &published,
	}

	articles, total, err := h.repos.Articles.List(c.Request.Context(), filter, page, pageSize, "-published_at")
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch activities")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data:       articles,
		Pagination: getPagination(page, pageSize, total),
	})
}

// GetActivity godoc
// @Summary Get activity by slug
// @Description Get a single activity by its slug
// @Tags Activities
// @Produce json
// @Param slug path string true "Activity slug"
// @Success 200 {object} dto.SuccessResponse{data=dto.ArticleResponse}
// @Failure 404 {object} middleware.ErrorResponse
// @Router /activities/{slug} [get]
func (h *ActivityHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	article, err := h.repos.Articles.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Activity not found")
		return
	}

	// Get tags
	tags, _ := h.repos.Articles.GetTags(c.Request.Context(), article.ID)
	tagNames := make([]string, len(tags))
	for i, tag := range tags {
		tagNames[i] = tag.Name
	}

	response := dto.ArticleResponse{
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
		Tags:          tagNames,
		PublishedAt:   article.PublishedAt,
		ScheduledAt:   article.ScheduledAt,
		CreatedAt:     article.CreatedAt,
		UpdatedAt:     article.UpdatedAt,
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: response})
}

// CreateActivity godoc
// @Summary Create activity
// @Description Create a new activity post (Admin only)
// @Tags Activities (Admin)
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param activity body dto.CreateArticleRequest true "Activity data"
// @Success 201 {object} dto.SuccessResponse{data=models.Article}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 401 {object} middleware.ErrorResponse
// @Router /admin/activities [post]
func (h *ActivityHandler) Create(c *gin.Context) {
	var req dto.CreateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	userID := c.GetInt64("user_id")

	article := &models.Article{
		Title:         req.Title,
		Slug:          req.Slug,
		Summary:       req.Summary,
		Content:       req.Content,
		FeaturedImage: req.FeaturedImage,
		AuthorID:      userID,
		CategoryID:    req.CategoryID,
		Status:        models.StatusDraft,
		IsFeatured:    req.IsFeatured,
		ScheduledAt:   req.ScheduledAt,
	}

	if err := h.repos.Articles.Create(c.Request.Context(), article); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to create activity")
		return
	}

	// Add tags
	for _, tagID := range req.TagIDs {
		h.repos.Articles.AddTag(c.Request.Context(), article.ID, tagID)
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: article})
}

// UpdateActivity godoc
// @Summary Update activity
// @Description Update an existing activity (Admin only)
// @Tags Activities (Admin)
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Activity ID"
// @Param activity body dto.UpdateArticleRequest true "Updated activity data"
// @Success 200 {object} dto.SuccessResponse{data=models.Article}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 401 {object} middleware.ErrorResponse
// @Failure 404 {object} middleware.ErrorResponse
// @Router /admin/activities/{id} [put]
func (h *ActivityHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	var req dto.UpdateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	article, err := h.repos.Articles.GetByID(c.Request.Context(), id)
	if err != nil {
		middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Activity not found")
		return
	}

	article.Title = req.Title
	article.Slug = req.Slug
	article.Summary = req.Summary
	article.Content = req.Content
	article.FeaturedImage = req.FeaturedImage
	article.CategoryID = req.CategoryID
	article.IsFeatured = req.IsFeatured
	article.ScheduledAt = req.ScheduledAt

	if err := h.repos.Articles.Update(c.Request.Context(), article); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to update activity")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: article})
}

// DeleteActivity godoc
// @Summary Delete activity
// @Description Delete an activity (Admin only)
// @Tags Activities (Admin)
// @Produce json
// @Security BearerAuth
// @Param id path int true "Activity ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} middleware.ErrorResponse
// @Failure 404 {object} middleware.ErrorResponse
// @Router /admin/activities/{id} [delete]
func (h *ActivityHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if err := h.repos.Articles.Delete(c.Request.Context(), id); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to delete activity")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Activity deleted successfully"}})
}

// PublishActivity godoc
// @Summary Publish activity
// @Description Publish an activity to make it public
// @Tags Activities (Admin)
// @Produce json
// @Security BearerAuth
// @Param id path int true "Activity ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} middleware.ErrorResponse
// @Failure 404 {object} middleware.ErrorResponse
// @Router /admin/activities/{id}/publish [post]
func (h *ActivityHandler) Publish(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if err := h.repos.Articles.UpdateStatus(c.Request.Context(), id, models.StatusPublished); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to publish activity")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Activity published successfully"}})
}
