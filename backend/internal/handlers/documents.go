package handlers

import (
	"database/sql"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

const (
	MaxDocumentSize      = 10 * 1024 * 1024 // 10MB
	DocumentUploadDir    = "./storage/uploads/documents"
	DocumentStaticPrefix = "/static/uploads/documents"
)

var AllowedDocumentMIME = map[string]string{
	"application/pdf":    ".pdf",
	"application/msword": ".doc",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
	"application/vnd.ms-excel": ".xls",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
}

// @Summary Upload document file
// @Description Upload a document file (PDF, DOC, DOCX, XLS, XLSX)
// @Tags documents
// @Security Bearer
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "Document file (max 10MB)"
// @Param title formData string true "Document title"
// @Param description formData string false "Document description"
// @Param category_id formData int true "Category ID"
// @Param document_no formData string false "Document number"
// @Param issued_date formData string false "Issued date (RFC3339)"
// @Success 201 {object} dto.SuccessResponse{data=models.Document}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /api/v1/admin/documents/upload [post]
func (h *DocumentsHandler) Upload(c *gin.Context) {
	// 1. Get file from multipart form
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_file", "File is required")
		return
	}
	defer file.Close()

	// 2. Validate file size
	if header.Size > MaxDocumentSize {
		middleware.AbortWithError(c, http.StatusBadRequest, "file_too_large",
			fmt.Sprintf("File size exceeds maximum of %d MB", MaxDocumentSize/(1024*1024)))
		return
	}

	// 3. Validate MIME type
	contentType := header.Header.Get("Content-Type")
	ext, allowed := AllowedDocumentMIME[contentType]
	if !allowed {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_file_type",
			"Only PDF, DOC, DOCX, XLS, XLSX files are allowed")
		return
	}

	// 4. Verify magic bytes
	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil && err != io.EOF {
		middleware.AbortWithError(c, http.StatusInternalServerError, "file_read_error", "Failed to read file")
		return
	}
	detectedType := http.DetectContentType(buffer)
	if _, ok := AllowedDocumentMIME[detectedType]; !ok && !strings.HasPrefix(detectedType, "application/") {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_file_type",
			"File content does not match allowed document types")
		return
	}

	// Reset file pointer
	if _, err := file.Seek(0, 0); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "file_read_error", "Failed to reset file pointer")
		return
	}

	// 5. Create directory structure: YYYY/MM
	now := time.Now()
	yearMonth := now.Format("2006/01")
	uploadPath := filepath.Join(DocumentUploadDir, yearMonth)
	if err := os.MkdirAll(uploadPath, 0755); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "storage_error", "Failed to create upload directory")
		return
	}

	// 6. Generate unique filename
	if ext == "" {
		ext = strings.ToLower(filepath.Ext(header.Filename))
	}
	filename := fmt.Sprintf("%s-%s%s", now.Format("20060102-150405"), uuid.New().String()[:8], ext)
	filePath := filepath.Join(uploadPath, filename)

	// 7. Save file
	dst, err := os.Create(filePath)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "storage_error", "Failed to create file")
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		os.Remove(filePath)
		middleware.AbortWithError(c, http.StatusInternalServerError, "storage_error", "Failed to save file")
		return
	}

	// 8. Get form data
	title := c.PostForm("title")
	if title == "" {
		title = strings.TrimSuffix(header.Filename, filepath.Ext(header.Filename))
	}
	description := c.PostForm("description")
	categoryIDStr := c.PostForm("category_id")
	documentNo := c.PostForm("document_no")
	issuedDateStr := c.PostForm("issued_date")

	categoryID, err := strconv.ParseInt(categoryIDStr, 10, 64)
	if err != nil {
		os.Remove(filePath)
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_category", "Category ID is required")
		return
	}

	// Parse issued date if provided
	var issuedDate *time.Time
	if issuedDateStr != "" {
		parsed, err := time.Parse(time.RFC3339, issuedDateStr)
		if err == nil {
			issuedDate = &parsed
		}
	}

	// 9. Generate slug from title
	slug := generateSlug(title)

	// 10. Create document record
	userID, _ := c.Get("user_id")
	filePathURL := fmt.Sprintf("%s/%s/%s", DocumentStaticPrefix, yearMonth, filename)

	document := &models.Document{
		Title:       title,
		Slug:        slug,
		Description: description,
		CategoryID:  categoryID,
		FilePath:    filePathURL,
		FileSize:    header.Size,
		MimeType:    contentType,
		DocumentNo:  documentNo,
		IssuedDate:  issuedDate,
		UploadedBy:  userID.(int64),
		Status:      "published", // Auto-publish on upload
	}

	if err := h.repo.Create(c.Request.Context(), document); err != nil {
		os.Remove(filePath)
		middleware.AbortWithError(c, http.StatusInternalServerError, "database_error", "Failed to save document record")
		return
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: document})
}
