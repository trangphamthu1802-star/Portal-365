package handlers

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/thieugt95/portal-365/backend/internal/database"
	"github.com/thieugt95/portal-365/backend/internal/dto"
	"github.com/thieugt95/portal-365/backend/internal/models"
)

type BannerHandlerImpl struct {
	repos *database.Repositories
}

func NewBannerHandlerImpl(repos *database.Repositories) *BannerHandlerImpl {
	return &BannerHandlerImpl{repos: repos}
}

// GetByPlacement godoc
// @Summary Get banners by placement (Public)
// @Description Get active banners for a specific placement with time window check
// @Tags Banners
// @Produce json
// @Param placement query string true "Placement (e.g., home_top, sidebar)"
// @Success 200 {object} dto.SuccessResponse{data=[]models.Banner}
// @Failure 500 {object} dto.ErrorResponse
// @Router /banners [get]
func (h *BannerHandlerImpl) GetByPlacement(c *gin.Context) {
	placement := c.Query("placement")
	if placement == "" {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_INPUT",
				Message: "Placement parameter is required",
			},
		})
		return
	}

	banners, err := h.repos.Banners.GetByPlacement(c.Request.Context(), placement)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to fetch banners",
			},
		})
		return
	}

	// Filter by time window and active status
	now := time.Now()
	var filtered []models.Banner
	for _, banner := range banners {
		if !banner.IsActive {
			continue
		}
		if banner.StartDate != nil && banner.StartDate.After(now) {
			continue
		}
		if banner.EndDate != nil && banner.EndDate.Before(now) {
			continue
		}
		filtered = append(filtered, *banner)
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: filtered})
}

// List godoc
// @Summary List all banners (Admin)
// @Description Get list of all banners with filters (admin only)
// @Tags Banners
// @Security BearerAuth
// @Produce json
// @Param placement query string false "Filter by placement"
// @Param active query bool false "Filter by active status"
// @Param q query string false "Search by title"
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 20, max: 100)"
// @Success 200 {object} dto.SuccessResponse{data=[]models.Banner}
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/banners [get]
func (h *BannerHandlerImpl) List(c *gin.Context) {
	// For simplicity, fetch all and filter client-side
	// In production, add repo methods with filters
	allBanners, err := h.repos.Banners.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to fetch banners",
			},
		})
		return
	}

	// Apply filters
	placement := c.Query("placement")
	activeStr := c.Query("active")
	search := c.Query("q")

	var filtered []*models.Banner
	for _, banner := range allBanners {
		if placement != "" && banner.Placement != placement {
			continue
		}
		if activeStr != "" {
			isActive := activeStr == "true" || activeStr == "1"
			if banner.IsActive != isActive {
				continue
			}
		}
		if search != "" && !contains(banner.Title, search) {
			continue
		}
		filtered = append(filtered, banner)
	}

	// Pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	total := len(filtered)
	start := (page - 1) * pageSize
	end := start + pageSize
	if start > total {
		start = total
	}
	if end > total {
		end = total
	}

	paginated := filtered[start:end]

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data:       paginated,
		Pagination: getPagination(page, pageSize, total),
	})
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(substr) == 0 ||
		(len(s) > 0 && len(substr) > 0 && stringContains(s, substr)))
}

func stringContains(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

// GetByID godoc
// @Summary Get banner by ID (Admin)
// @Description Get single banner by ID (admin only)
// @Tags Banners
// @Security BearerAuth
// @Produce json
// @Param id path int true "Banner ID"
// @Success 200 {object} dto.SuccessResponse{data=models.Banner}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/banners/{id} [get]
func (h *BannerHandlerImpl) GetByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_ID",
				Message: "Invalid banner ID",
			},
		})
		return
	}

	banner, err := h.repos.Banners.GetByID(c.Request.Context(), id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{
				Error: dto.ErrorDetail{
					Code:    "NOT_FOUND",
					Message: "Banner not found",
				},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to fetch banner",
			},
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: banner})
}

// Create godoc
// @Summary Create banner (Admin)
// @Description Create a new banner (admin only)
// @Tags Banners
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param banner body models.Banner true "Banner data"
// @Success 201 {object} dto.SuccessResponse{data=models.Banner}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/banners [post]
func (h *BannerHandlerImpl) Create(c *gin.Context) {
	var banner models.Banner
	if err := c.ShouldBindJSON(&banner); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_INPUT",
				Message: err.Error(),
			},
		})
		return
	}

	// Validation: starts_at < ends_at
	if banner.StartDate != nil && banner.EndDate != nil {
		if banner.StartDate.After(*banner.EndDate) {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{
				Error: dto.ErrorDetail{
					Code:    "INVALID_DATE_RANGE",
					Message: "Start date must be before end date",
				},
			})
			return
		}
	}

	if err := h.repos.Banners.Create(c.Request.Context(), &banner); err != nil {
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

// Update godoc
// @Summary Update banner (Admin)
// @Description Update an existing banner (admin only)
// @Tags Banners
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "Banner ID"
// @Param banner body models.Banner true "Banner data"
// @Success 200 {object} dto.SuccessResponse{data=models.Banner}
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/banners/{id} [put]
func (h *BannerHandlerImpl) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_ID",
				Message: "Invalid banner ID",
			},
		})
		return
	}

	var banner models.Banner
	if err := c.ShouldBindJSON(&banner); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_INPUT",
				Message: err.Error(),
			},
		})
		return
	}

	// Validation: starts_at < ends_at
	if banner.StartDate != nil && banner.EndDate != nil {
		if banner.StartDate.After(*banner.EndDate) {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{
				Error: dto.ErrorDetail{
					Code:    "INVALID_DATE_RANGE",
					Message: "Start date must be before end date",
				},
			})
			return
		}
	}

	banner.ID = id

	if err := h.repos.Banners.Update(c.Request.Context(), &banner); err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{
				Error: dto.ErrorDetail{
					Code:    "NOT_FOUND",
					Message: "Banner not found",
				},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to update banner",
			},
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{Data: banner})
}

// Delete godoc
// @Summary Delete banner (Admin)
// @Description Delete a banner (admin only)
// @Tags Banners
// @Security BearerAuth
// @Produce json
// @Param id path int true "Banner ID"
// @Success 204
// @Failure 400 {object} dto.ErrorResponse
// @Failure 401 {object} dto.ErrorResponse
// @Failure 404 {object} dto.ErrorResponse
// @Failure 500 {object} dto.ErrorResponse
// @Router /admin/banners/{id} [delete]
func (h *BannerHandlerImpl) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INVALID_ID",
				Message: "Invalid banner ID",
			},
		})
		return
	}

	if err := h.repos.Banners.Delete(c.Request.Context(), id); err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{
				Error: dto.ErrorDetail{
					Code:    "NOT_FOUND",
					Message: "Banner not found",
				},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: dto.ErrorDetail{
				Code:    "INTERNAL_ERROR",
				Message: "Failed to delete banner",
			},
		})
		return
	}

	c.Status(http.StatusNoContent)
}
