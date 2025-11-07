package handlers

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/thieugt95/portal-365/backend/internal/database"
	"github.com/thieugt95/portal-365/backend/internal/dto"
	"github.com/thieugt95/portal-365/backend/internal/middleware"
	"github.com/thieugt95/portal-365/backend/internal/models"
	"github.com/thieugt95/portal-365/backend/internal/repositories"
)

type DocumentsHandler struct {
	repo repositories.DocumentRepository
}

func NewDocumentsHandler(repos *database.Repositories) *DocumentsHandler {
	return &DocumentsHandler{repo: repos.Documents}
}

// @Summary List documents (Public)
// @Description Get published documents with pagination and filtering
// @Tags documents
// @Accept json
// @Produce json
// @Param category_id query int false "Category ID"
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Success 200 {object} dto.SuccessResponse{data=[]models.Document}
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/documents [get]
func (h *DocumentsHandler) ListPublic(c *gin.Context) {
	page := getPage(c)
	pageSize := getPageSize(c)
	categoryID := c.Query("category_id")

	var catID *int64
	if categoryID != "" {
		id, err := strconv.ParseInt(categoryID, 10, 64)
		if err == nil {
			catID = &id
		}
	}

	documents, total, err := h.repo.ListPublished(c.Request.Context(), catID, page, pageSize)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch documents")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data:       documents,
		Pagination: getPagination(page, pageSize, total),
	})
}

// @Summary Get document by slug (Public)
// @Description Get a published document by slug and increment view count
// @Tags documents
// @Accept json
// @Produce json
// @Param slug path string true "Document slug"
// @Success 200 {object} dto.SuccessResponse{data=models.Document}
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/documents/{slug} [get]
func (h *DocumentsHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	document, err := h.repo.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if err == sql.ErrNoRows {
			middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Document not found")
			return
		}
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch document")
		return
	}

	// Only show published documents to public
	if document.Status != "published" {
		middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Document not found")
		return
	}

	// Increment view count
	_ = h.repo.IncrementViewCount(c.Request.Context(), document.ID)

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: document})
}

// @Summary List all documents (Admin)
// @Description Get all documents with pagination
// @Tags documents
// @Security Bearer
// @Accept json
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(20)
// @Param status query string false "Filter by status"
// @Param category_id query int false "Filter by category"
// @Success 200 {object} dto.SuccessResponse{data=[]models.Document}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/documents [get]
func (h *DocumentsHandler) List(c *gin.Context) {
	page := getPage(c)
	pageSize := getPageSize(c)
	status := c.Query("status")
	categoryID := c.Query("category_id")

	var catID *int64
	if categoryID != "" {
		id, err := strconv.ParseInt(categoryID, 10, 64)
		if err == nil {
			catID = &id
		}
	}

	documents, total, err := h.repo.List(c.Request.Context(), status, catID, page, pageSize)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to fetch documents")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data:       documents,
		Pagination: getPagination(page, pageSize, total),
	})
}

// @Summary Create document (Admin)
// @Description Create a new document
// @Tags documents
// @Security Bearer
// @Accept json
// @Produce json
// @Param document body models.Document true "Document data"
// @Success 201 {object} dto.SuccessResponse{data=models.Document}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/documents [post]
func (h *DocumentsHandler) Create(c *gin.Context) {
	var document models.Document
	if err := c.ShouldBindJSON(&document); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_input", err.Error())
		return
	}

	// Get user ID from context
	userID, _ := c.Get("user_id")
	document.UploadedBy = userID.(int64)

	if err := h.repo.Create(c.Request.Context(), &document); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to create document")
		return
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: document})
}

// @Summary Update document (Admin)
// @Description Update an existing document
// @Tags documents
// @Security Bearer
// @Accept json
// @Produce json
// @Param id path int true "Document ID"
// @Param document body models.Document true "Document data"
// @Success 200 {object} dto.SuccessResponse{data=models.Document}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/documents/{id} [put]
func (h *DocumentsHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_id", "Invalid document ID")
		return
	}

	var document models.Document
	if err := c.ShouldBindJSON(&document); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_input", err.Error())
		return
	}

	document.ID = id
	if err := h.repo.Update(c.Request.Context(), &document); err != nil {
		if err == sql.ErrNoRows {
			middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Document not found")
			return
		}
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to update document")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: document})
}

// @Summary Delete document (Admin)
// @Description Delete a document
// @Tags documents
// @Security Bearer
// @Produce json
// @Param id path int true "Document ID"
// @Success 200 {object} dto.SuccessResponse{data=string}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/documents/{id} [delete]
func (h *DocumentsHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_id", "Invalid document ID")
		return
	}

	if err := h.repo.Delete(c.Request.Context(), id); err != nil {
		if err == sql.ErrNoRows {
			middleware.AbortWithError(c, http.StatusNotFound, "not_found", "Document not found")
			return
		}
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to delete document")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: "Document deleted successfully"})
}
