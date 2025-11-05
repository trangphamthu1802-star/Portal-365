package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/thieugt95/portal-365/backend/internal/database"
	"github.com/thieugt95/portal-365/backend/internal/dto"
	"github.com/thieugt95/portal-365/backend/internal/middleware"
	"github.com/thieugt95/portal-365/backend/internal/models"
)

type IntroductionHandler struct {
	repos *database.Repositories
}

func NewIntroductionHandler(repos *database.Repositories) *IntroductionHandler {
	return &IntroductionHandler{repos: repos}
}

// ListIntroductions godoc
// @Summary List all introduction pages
// @Description Get list of all introduction pages (public access)
// @Tags Introduction
// @Produce json
// @Success 200 {object} dto.SuccessResponse{data=[]models.Page}
// @Router /introduction [get]
func (h *IntroductionHandler) List(c *gin.Context) {
	group := "introduction"
	status := "published"
	pages, err := h.repos.Pages.List(c.Request.Context(), &group, &status)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch introduction pages")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: pages})
}

// GetIntroduction godoc
// @Summary Get introduction page by slug
// @Description Get a single introduction page by its slug
// @Tags Introduction
// @Produce json
// @Param slug path string true "Page slug"
// @Success 200 {object} dto.SuccessResponse{data=models.Page}
// @Failure 404 {object} middleware.ErrorResponse
// @Router /introduction/{slug} [get]
func (h *IntroductionHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	page, err := h.repos.Pages.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Introduction page not found")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: page})
}

// CreateIntroduction godoc
// @Summary Create introduction page
// @Description Create a new introduction page (Admin only)
// @Tags Introduction (Admin)
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param page body dto.CreatePageRequest true "Introduction page data"
// @Success 201 {object} dto.SuccessResponse{data=models.Page}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 401 {object} middleware.ErrorResponse
// @Router /admin/introduction [post]
func (h *IntroductionHandler) Create(c *gin.Context) {
	var req dto.CreatePageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	page := &models.Page{
		Title:    req.Title,
		Slug:     req.Slug,
		Content:  req.Content,
		IsActive: true, // Introduction pages are active by default
	}

	if err := h.repos.Pages.Create(c.Request.Context(), page); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to create introduction page")
		return
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: page})
}

// UpdateIntroduction godoc
// @Summary Update introduction page
// @Description Update an existing introduction page (Admin only)
// @Tags Introduction (Admin)
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "Page ID"
// @Param page body dto.UpdatePageRequest true "Updated page data"
// @Success 200 {object} dto.SuccessResponse{data=models.Page}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 401 {object} middleware.ErrorResponse
// @Failure 404 {object} middleware.ErrorResponse
// @Router /admin/introduction/{id} [put]
func (h *IntroductionHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	var req dto.UpdatePageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	page, err := h.repos.Pages.GetByID(c.Request.Context(), id)
	if err != nil {
		middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Introduction page not found")
		return
	}

	page.Title = req.Title
	page.Slug = req.Slug
	page.Content = req.Content

	if err := h.repos.Pages.Update(c.Request.Context(), page); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to update introduction page")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: page})
}

// DeleteIntroduction godoc
// @Summary Delete introduction page
// @Description Delete an introduction page (Admin only)
// @Tags Introduction (Admin)
// @Produce json
// @Security BearerAuth
// @Param id path int true "Page ID"
// @Success 200 {object} dto.SuccessResponse
// @Failure 401 {object} middleware.ErrorResponse
// @Failure 404 {object} middleware.ErrorResponse
// @Router /admin/introduction/{id} [delete]
func (h *IntroductionHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)

	if err := h.repos.Pages.Delete(c.Request.Context(), id); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to delete introduction page")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: gin.H{"message": "Introduction page deleted successfully"}})
}
