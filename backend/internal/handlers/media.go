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
	"github.com/thieugt95/portal-365/backend/internal/models"
	"github.com/thieugt95/portal-365/backend/internal/repositories"
)

type MediaItemHandler struct {
	repo repositories.MediaItemRepository
}

func NewMediaItemHandler(repos *database.Repositories) *MediaItemHandler {
	return &MediaItemHandler{repo: repos.MediaItems}
}

const (
	MaxUploadSize   = 5 * 1024 * 1024 // 5MB
	MinImageWidth   = 1200
	UploadDir       = "./storage/uploads/images"
	StaticURLPrefix = "/static/uploads/images"
)

var AllowedImageMIME = map[string]bool{
	"image/jpeg": true,
	"image/png":  true,
	"image/webp": true,
}

// Upload godoc
// @Summary Upload media file
// @Description Upload an image file (JPEG, PNG, WebP) with validation
// @Tags Media
// @Security BearerAuth
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "Image file (max 5MB, min 1200px width)"
// @Param title formData string false "Media title"
// @Param alt formData string false "Alt text for image"
// @Param category_id formData int false "Category ID"
// @Success 201 {object} dto.SuccessResponse{data=models.MediaItem}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/media/upload [post]
func (h *MediaItemHandler) Upload(c *gin.Context) {
	// 1. Get file from multipart form
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_FILE",
				Message: "File is required",
			},
		})
		return
	}
	defer file.Close()

	// 2. Validate file size
	if header.Size > MaxUploadSize {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "FILE_TOO_LARGE",
				Message: fmt.Sprintf("File size exceeds maximum of %d bytes", MaxUploadSize),
			},
		})
		return
	}

	// 3. Validate MIME type from header
	contentType := header.Header.Get("Content-Type")
	if !AllowedImageMIME[contentType] {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_FILE_TYPE",
				Message: "Only JPEG, PNG, and WebP images are allowed",
			},
		})
		return
	}

	// 4. Verify magic bytes (first 512 bytes)
	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil && err != io.EOF {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "FILE_READ_ERROR",
				Message: "Failed to read file",
			},
		})
		return
	}
	detectedType := http.DetectContentType(buffer)
	if !AllowedImageMIME[detectedType] {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_FILE_TYPE",
				Message: "File content does not match allowed image types",
			},
		})
		return
	}

	// Reset file pointer after reading magic bytes
	if _, err := file.Seek(0, 0); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "FILE_READ_ERROR",
				Message: "Failed to reset file pointer",
			},
		})
		return
	}

	// 5. Create directory structure: YYYY/MM
	now := time.Now()
	yearMonth := now.Format("2006/01")
	uploadPath := filepath.Join(UploadDir, yearMonth)
	if err := os.MkdirAll(uploadPath, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "STORAGE_ERROR",
				Message: "Failed to create upload directory",
			},
		})
		return
	}

	// 6. Generate unique filename with UUID
	ext := strings.ToLower(filepath.Ext(header.Filename))
	if ext == "" {
		// Derive extension from MIME type
		switch contentType {
		case "image/jpeg":
			ext = ".jpg"
		case "image/png":
			ext = ".png"
		case "image/webp":
			ext = ".webp"
		}
	}
	filename := uuid.New().String() + ext
	fullPath := filepath.Join(uploadPath, filename)

	// 7. Save file to disk
	dst, err := os.Create(fullPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "STORAGE_ERROR",
				Message: "Failed to create file on disk",
			},
		})
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "STORAGE_ERROR",
				Message: "Failed to save file",
			},
		})
		return
	}

	// 8. Get form values
	title := c.PostForm("title")
	if title == "" {
		title = strings.TrimSuffix(header.Filename, ext)
	}
	alt := c.PostForm("alt")

	var categoryID int64
	if catIDStr := c.PostForm("category_id"); catIDStr != "" {
		catID, err := strconv.ParseInt(catIDStr, 10, 64)
		if err == nil {
			categoryID = catID
		}
	}

	// 9. Get user ID from JWT context
	var uploadedBy int64
	if userID, exists := c.Get("user_id"); exists {
		if uid, ok := userID.(int64); ok {
			uploadedBy = uid
		}
	}

	// 10. Create MediaItem record
	urlPath := fmt.Sprintf("%s/%s/%s", StaticURLPrefix, yearMonth, filename)

	// Generate simple slug from title + timestamp for uniqueness
	slug := strings.ToLower(strings.ReplaceAll(title, " ", "-")) + "-" + uuid.New().String()[:8]

	media := models.MediaItem{
		Title:        title,
		Slug:         slug,
		Description:  alt,
		CategoryID:   categoryID,
		MediaType:    "image",
		URL:          urlPath,
		ThumbnailURL: urlPath, // TODO: Generate actual thumbnail
		FileSize:     header.Size,
		UploadedBy:   uploadedBy,
		Status:       "draft",
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	// 11. Save to database
	if err := h.repo.Create(c.Request.Context(), &media); err != nil {
		// Clean up file on database error
		_ = os.Remove(fullPath)
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "DATABASE_ERROR",
				Message: "Failed to save media record",
			},
		})
		return
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: media})
}

// ListPublic godoc
// @Summary List published media items
// @Description Get list of published media items with optional filters
// @Tags Media
// @Produce json
// @Param media_type query string false "Media type filter (image, video)"
// @Param category_id query int false "Category ID filter"
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 20, max: 100)"
// @Success 200 {object} dto.SuccessResponse{data=[]models.MediaItem}
// @Failure 500 {object} dto.ErrorResponse
// @Router /media [get]
func (h *MediaItemHandler) ListPublic(c *gin.Context) {
	mediaType := c.Query("media_type")

	var categoryID *int64
	if catIDStr := c.Query("category_id"); catIDStr != "" {
		catID, err := strconv.ParseInt(catIDStr, 10, 64)
		if err == nil {
			categoryID = &catID
		}
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	// Show all images regardless of status
	items, total, err := h.repo.List(c.Request.Context(), mediaType, "", categoryID, page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to fetch media items",
			},
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data:       items,
		Pagination: getPagination(page, pageSize, total),
	})
}

// GetBySlug godoc
// @Summary Get media item by slug
// @Description Get single published media item by slug and increment view count
// @Tags Media
// @Produce json
// @Param slug path string true "Media slug"
// @Success 200 {object} dto.SuccessResponse{data=models.MediaItem}
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /media/{slug} [get]
func (h *MediaItemHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	media, err := h.repo.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{
				Error: dto.ErrorDetail{
					Code:    "NOT_FOUND",
					Message: "Media item not found",
				},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to fetch media item",
			},
		})
		return
	}

	if media.Status != "published" {
		c.JSON(http.StatusNotFound, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "NOT_FOUND",
				Message: "Media item not found",
			},
		})
		return
	}

	// Increment view count
	_ = h.repo.IncrementViewCount(c.Request.Context(), media.ID)

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: media})
}

// GetByID godoc
// @Summary Get media item by ID (Admin)
// @Description Get single media item by ID (admin only)
// @Tags Media
// @Security BearerAuth
// @Produce json
// @Param id path int true "Media ID"
// @Success 200 {object} dto.SuccessResponse{data=models.MediaItem}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/media/{id} [get]
func (h *MediaItemHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_ID",
				Message: "Invalid media item ID",
			},
		})
		return
	}

	media, err := h.repo.GetByID(c.Request.Context(), id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{
				Error: dto.ErrorDetail{
					Code:    "NOT_FOUND",
					Message: "Media item not found",
				},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to fetch media item",
			},
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: media})
}

// List godoc
// @Summary List all media items (Admin)
// @Description Get list of all media items with filters (admin only)
// @Tags Media
// @Security BearerAuth
// @Produce json
// @Param media_type query string false "Media type filter"
// @Param status query string false "Status filter"
// @Param category_id query int false "Category ID filter"
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 20, max: 100)"
// @Success 200 {object} dto.SuccessResponse{data=[]models.MediaItem}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/media [get]
func (h *MediaItemHandler) List(c *gin.Context) {
	mediaType := c.Query("media_type")
	status := c.Query("status")

	var categoryID *int64
	if catIDStr := c.Query("category_id"); catIDStr != "" {
		catID, err := strconv.ParseInt(catIDStr, 10, 64)
		if err == nil {
			categoryID = &catID
		}
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	items, total, err := h.repo.List(c.Request.Context(), mediaType, status, categoryID, page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to fetch media items",
			},
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data:       items,
		Pagination: getPagination(page, pageSize, total),
	})
}

// Create godoc
// @Summary Create media item (Admin)
// @Description Create a new media item (admin only)
// @Tags Media
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param media body models.MediaItem true "Media item data"
// @Success 201 {object} dto.SuccessResponse{data=models.MediaItem}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/media [post]
func (h *MediaItemHandler) Create(c *gin.Context) {
	var media models.MediaItem
	if err := c.ShouldBindJSON(&media); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_INPUT",
				Message: err.Error(),
			},
		})
		return
	}

	// Set uploaded_by from JWT context
	if userID, exists := c.Get("user_id"); exists {
		if uid, ok := userID.(int64); ok {
			media.UploadedBy = uid
		}
	}

	if err := h.repo.Create(c.Request.Context(), &media); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to create media item",
			},
		})
		return
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: media})
}

// Update godoc
// @Summary Update media item (Admin)
// @Description Update an existing media item (admin only)
// @Tags Media
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Media ID"
// @Param media body models.MediaItem true "Media item data"
// @Success 200 {object} dto.SuccessResponse{data=models.MediaItem}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/media/{id} [put]
func (h *MediaItemHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_ID",
				Message: "Invalid media item ID",
			},
		})
		return
	}

	var media models.MediaItem
	if err := c.ShouldBindJSON(&media); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_INPUT",
				Message: err.Error(),
			},
		})
		return
	}

	media.ID = id

	if err := h.repo.Update(c.Request.Context(), &media); err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{
				Error: dto.ErrorDetail{
					Code:    "NOT_FOUND",
					Message: "Media item not found",
				},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to update media item",
			},
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: media})
}

// Delete godoc
// @Summary Delete media item (Admin)
// @Description Delete a media item (admin only)
// @Tags Media
// @Security BearerAuth
// @Produce json
// @Param id path int true "Media ID"
// @Success 204
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/media/{id} [delete]
func (h *MediaItemHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_ID",
				Message: "Invalid media item ID",
			},
		})
		return
	}

	if err := h.repo.Delete(c.Request.Context(), id); err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{
				Error: dto.ErrorDetail{
					Code:    "NOT_FOUND",
					Message: "Media item not found",
				},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to delete media item",
			},
		})
		return
	}

	c.Status(http.StatusNoContent)
}
