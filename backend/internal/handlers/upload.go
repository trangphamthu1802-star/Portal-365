package handlers

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/thieugt95/portal-365/backend/internal/dto"
)

type UploadHandler struct{}

func NewUploadHandler() *UploadHandler {
	return &UploadHandler{}
}

const (
	UploadMaxSize    = 5 * 1024 * 1024 // 5MB
	ArticleUploadDir = "./storage/uploads/articles"
	ArticleURLPrefix = "/static/uploads/articles"
)

var AllowedMIME = map[string]bool{
	"image/jpeg": true,
	"image/jpg":  true,
	"image/png":  true,
	"image/webp": true,
	"image/gif":  true,
}

// UploadImage godoc
// @Summary Upload image for article content or featured image
// @Description Upload an image file (JPEG, PNG, WebP, GIF)
// @Tags Upload
// @Security BearerAuth
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "Image file (max 5MB)"
// @Success 200 {object} dto.SuccessResponse{data=object{url=string}}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/uploads [post]
func (h *UploadHandler) UploadImage(c *gin.Context) {
	log.Println("Upload request received")

	// Get file from form
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		log.Printf("Failed to get file from form: %v", err)
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_FILE",
				Message: "File is required",
			},
		})
		return
	}
	defer file.Close()

	log.Printf("File received: %s, size: %d, type: %s", header.Filename, header.Size, header.Header.Get("Content-Type"))

	// Validate file size
	if header.Size > UploadMaxSize {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "FILE_TOO_LARGE",
				Message: fmt.Sprintf("File size exceeds maximum of %dMB", UploadMaxSize/(1024*1024)),
			},
		})
		return
	}

	// Validate MIME type
	contentType := header.Header.Get("Content-Type")
	if !AllowedMIME[contentType] {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_FILE_TYPE",
				Message: "Only JPEG, PNG, WebP, and GIF images are allowed",
			},
		})
		return
	}

	// Create upload directory if not exists
	if err := os.MkdirAll(ArticleUploadDir, 0755); err != nil {
		log.Printf("Failed to create directory: %v", err)
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "SERVER_ERROR",
				Message: "Failed to create upload directory",
			},
		})
		return
	}

	// Generate unique filename
	ext := filepath.Ext(header.Filename)
	if ext == "" {
		// Try to get extension from MIME type
		switch contentType {
		case "image/jpeg", "image/jpg":
			ext = ".jpg"
		case "image/png":
			ext = ".png"
		case "image/webp":
			ext = ".webp"
		case "image/gif":
			ext = ".gif"
		}
	}

	timestamp := time.Now().Format("20060102-150405")
	filename := fmt.Sprintf("%s-%s%s", timestamp, uuid.New().String()[:8], ext)
	filePath := filepath.Join(ArticleUploadDir, filename)

	log.Printf("Saving file to: %s", filePath)

	// Save file
	dst, err := os.Create(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "SERVER_ERROR",
				Message: "Failed to save file",
			},
		})
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "SERVER_ERROR",
				Message: "Failed to write file",
			},
		})
		return
	}

	// Build public URL
	baseURL := os.Getenv("APP_BASE_URL")
	if baseURL == "" {
		baseURL = "http://localhost:8080"
	}
	url := fmt.Sprintf("%s%s/%s", baseURL, ArticleURLPrefix, filename)

	log.Printf("Upload successful: %s", url)

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data: map[string]interface{}{
			"url":      url,
			"filename": filename,
		},
	})
}
