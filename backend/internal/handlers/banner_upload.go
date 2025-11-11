package handlers

import (
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/thieugt95/portal-365/backend/internal/dto"
	"github.com/thieugt95/portal-365/backend/internal/models"
	"golang.org/x/image/draw"
	"golang.org/x/image/webp"
)

const (
	BannerMaxUploadSize = 100 * 1024 * 1024 // 100MB
	// Banner dimensions based on placement
	Banner1Width        = 760 // Banner 1 (left)
	Banner1Height       = 190 // Banner 1 height
	Banner2Width        = 760 // Banner 2 (right)
	Banner2Height       = 190 // Banner 2 height
	DefaultBannerWidth  = 1200
	DefaultBannerHeight = 200
)

var AllowedBannerMIME = map[string]bool{
	"image/jpeg": true,
	"image/png":  true,
	"image/webp": true,
}

// CreateWithUpload godoc
// @Summary Create banner with image upload (Admin)
// @Description Create a new banner with image file upload. Image will be auto-resized based on placement: banner-1 (760x190), banner-2 (760x190), others (1200x200)
// @Tags Banners
// @Security BearerAuth
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "Banner image (max 100MB, JPEG/PNG/WebP)"
// @Param title formData string true "Banner title"
// @Param placement formData string true "Placement (banner-1, banner-2, home-middle, article-top, etc.)"
// @Param link_url formData string false "Link URL"
// @Param sort_order formData int false "Sort order (default: 0)"
// @Param is_active formData bool false "Is active (default: true)"
// @Success 201 {object} dto.SuccessResponse{data=models.Banner}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/banners/upload [post]
func (h *BannerHandlerImpl) CreateWithUpload(c *gin.Context) {
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
	if header.Size > BannerMaxUploadSize {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "FILE_TOO_LARGE",
				Message: fmt.Sprintf("File size exceeds maximum of %d bytes", BannerMaxUploadSize),
			},
		})
		return
	}

	// 3. Validate MIME type
	contentType := header.Header.Get("Content-Type")
	if !AllowedBannerMIME[contentType] {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_FILE_TYPE",
				Message: "Only JPEG, PNG, WebP images are allowed",
			},
		})
		return
	}

	// 4. Decode image
	var img image.Image
	switch contentType {
	case "image/jpeg":
		img, err = jpeg.Decode(file)
	case "image/png":
		img, err = png.Decode(file)
	case "image/webp":
		img, err = webp.Decode(file)
	default:
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_FILE_TYPE",
				Message: "Unsupported image format",
			},
		})
		return
	}

	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_IMAGE",
				Message: "Failed to decode image: " + err.Error(),
			},
		})
		return
	}

	// 5. Get form data early to determine placement
	title := c.PostForm("title")
	placement := c.PostForm("placement")
	linkURL := c.PostForm("link_url")
	isActive := c.PostForm("is_active") != "false" // Default true

	if title == "" {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_INPUT",
				Message: "Title is required",
			},
		})
		return
	}

	if placement == "" {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_INPUT",
				Message: "Placement is required",
			},
		})
		return
	}

	// 6. Resize image based on placement type
	targetWidth, targetHeight := getBannerDimensions(placement)
	resizedImg := resizeImage(img, targetWidth, targetHeight)

	// 7. Create directory structure: storage/uploads/banners/YYYY/MM
	now := time.Now()
	yearMonth := now.Format("2006/01")
	uploadPath := filepath.Join("./storage/uploads/banners", yearMonth)
	if err := os.MkdirAll(uploadPath, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "STORAGE_ERROR",
				Message: "Failed to create upload directory",
			},
		})
		return
	}

	// 7. Generate unique filename
	ext := strings.ToLower(filepath.Ext(header.Filename))
	if ext == "" {
		ext = ".jpg" // Default to JPEG
	}
	uniqueFilename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	fullPath := filepath.Join(uploadPath, uniqueFilename)

	// 8. Save resized image
	outFile, err := os.Create(fullPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "STORAGE_ERROR",
				Message: "Failed to create file",
			},
		})
		return
	}
	defer outFile.Close()

	// Save as JPEG with high quality
	err = jpeg.Encode(outFile, resizedImg, &jpeg.Options{Quality: 90})
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "STORAGE_ERROR",
				Message: "Failed to save image",
			},
		})
		return
	}

	// 9. Build URL path
	imageURL := fmt.Sprintf("/static/uploads/banners/%s/%s", yearMonth, uniqueFilename)

	// 10. Create banner record
	banner := &models.Banner{
		Title:     title,
		ImageURL:  imageURL,
		LinkURL:   linkURL,
		Placement: placement,
		SortOrder: 0,
		IsActive:  isActive,
	}

	err = h.repos.Banners.Create(c.Request.Context(), banner)
	if err != nil {
		// Clean up uploaded file if DB insert fails
		os.Remove(fullPath)
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to create banner",
			},
		})
		return
	}

	c.JSON(http.StatusCreated, dto.SuccessResponse{Data: banner})
}

// UpdateWithUpload godoc
// @Summary Update banner with new image (Admin)
// @Description Update banner and optionally upload new image (auto-resized based on placement)
// @Tags Banners
// @Security BearerAuth
// @Accept multipart/form-data
// @Produce json
// @Param id path int true "Banner ID"
// @Param file formData file false "New banner image (max 100MB, JPEG/PNG/WebP)"
// @Param title formData string false "Banner title"
// @Param placement formData string false "Placement (banner-1, banner-2, etc.)"
// @Param link_url formData string false "Link URL"
// @Param is_active formData bool false "Is active"
// @Success 200 {object} dto.SuccessResponse{data=models.Banner}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/banners/{id}/upload [put]
func (h *BannerHandlerImpl) UpdateWithUpload(c *gin.Context) {
	// Get banner ID
	id := c.Param("id")

	// Get existing banner
	var existingBanner models.Banner
	// TODO: Fetch from DB - simplified for now

	// Check if new file uploaded
	file, header, err := c.Request.FormFile("file")
	var newImageURL string

	if err == nil && file != nil {
		defer file.Close()

		// Process image upload (similar to Create)
		contentType := header.Header.Get("Content-Type")
		if !AllowedBannerMIME[contentType] {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{
				Error: dto.ErrorDetail{
					Code:    "INVALID_FILE_TYPE",
					Message: "Only JPEG, PNG, WebP images are allowed",
				},
			})
			return
		}

		// Decode and resize
		var img image.Image
		switch contentType {
		case "image/jpeg":
			img, err = jpeg.Decode(file)
		case "image/png":
			img, err = png.Decode(file)
		case "image/webp":
			img, err = webp.Decode(file)
		}

		if err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{
				Error: dto.ErrorDetail{
					Code:    "INVALID_IMAGE",
					Message: "Failed to decode image",
				},
			})
			return
		}

		// Get placement to determine resize dimensions
		placement := c.PostForm("placement")
		if placement == "" {
			placement = existingBanner.Placement // Use existing placement if not provided
		}
		targetWidth, targetHeight := getBannerDimensions(placement)
		resizedImg := resizeImage(img, targetWidth, targetHeight)

		// Save new image
		now := time.Now()
		yearMonth := now.Format("2006/01")
		uploadPath := filepath.Join("./storage/uploads/banners", yearMonth)
		os.MkdirAll(uploadPath, 0755)

		ext := strings.ToLower(filepath.Ext(header.Filename))
		if ext == "" {
			ext = ".jpg"
		}
		uniqueFilename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
		fullPath := filepath.Join(uploadPath, uniqueFilename)

		outFile, err := os.Create(fullPath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
				Error: dto.ErrorDetail{
					Code:    "STORAGE_ERROR",
					Message: "Failed to create file",
				},
			})
			return
		}
		defer outFile.Close()

		jpeg.Encode(outFile, resizedImg, &jpeg.Options{Quality: 90})
		newImageURL = fmt.Sprintf("/static/uploads/banners/%s/%s", yearMonth, uniqueFilename)

		// Delete old image if exists
		if existingBanner.ImageURL != "" {
			oldPath := strings.TrimPrefix(existingBanner.ImageURL, "/static/uploads/banners/")
			os.Remove(filepath.Join("./storage/uploads/banners", oldPath))
		}
	}

	// Update banner fields
	if title := c.PostForm("title"); title != "" {
		existingBanner.Title = title
	}
	if placement := c.PostForm("placement"); placement != "" {
		existingBanner.Placement = placement
	}
	if newImageURL != "" {
		existingBanner.ImageURL = newImageURL
	}
	existingBanner.LinkURL = c.PostForm("link_url")
	existingBanner.IsActive = c.PostForm("is_active") != "false"

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: map[string]interface{}{
		"id":      id,
		"message": "Banner updated (simplified implementation)",
	}})
}

// getBannerDimensions returns width and height based on placement type
func getBannerDimensions(placement string) (width, height int) {
	switch placement {
	case "banner-1":
		return Banner1Width, Banner1Height
	case "banner-2":
		return Banner2Width, Banner2Height
	default:
		return DefaultBannerWidth, DefaultBannerHeight
	}
}

// resizeImage resizes an image to fit within the specified dimensions while maintaining aspect ratio
// If the image is smaller, it will be scaled up. If larger, it will be scaled down.
func resizeImage(src image.Image, width, height int) image.Image {
	srcBounds := src.Bounds()
	srcWidth := srcBounds.Dx()
	srcHeight := srcBounds.Dy()

	// Calculate aspect ratios
	srcAspect := float64(srcWidth) / float64(srcHeight)
	dstAspect := float64(width) / float64(height)

	var newWidth, newHeight int

	if srcAspect > dstAspect {
		// Source is wider - fit to width
		newWidth = width
		newHeight = int(float64(width) / srcAspect)
	} else {
		// Source is taller - fit to height
		newHeight = height
		newWidth = int(float64(height) * srcAspect)
	}

	// Create destination image with target size
	dst := image.NewRGBA(image.Rect(0, 0, width, height))

	// Calculate centering offset
	offsetX := (width - newWidth) / 2
	offsetY := (height - newHeight) / 2

	// Draw resized image centered
	draw.BiLinear.Scale(dst, image.Rect(offsetX, offsetY, offsetX+newWidth, offsetY+newHeight), src, srcBounds, draw.Over, nil)

	return dst
}
