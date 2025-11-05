package handlers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"github.com/thieugt95/portal-365/backend/internal/config"
	"github.com/thieugt95/portal-365/backend/internal/database"
	"github.com/thieugt95/portal-365/backend/internal/dto"
	"github.com/thieugt95/portal-365/backend/internal/middleware"
	"github.com/thieugt95/portal-365/backend/internal/models"
)

type AuthHandler struct {
	cfg   *config.Config
	repos *database.Repositories
}

func NewAuthHandler(cfg *config.Config, repos *database.Repositories) *AuthHandler {
	return &AuthHandler{cfg: cfg, repos: repos}
}

// Login godoc
// @Summary User login
// @Description Authenticate user and return JWT tokens
// @Tags auth
// @Accept json
// @Produce json
// @Param request body dto.LoginRequest true "Login credentials"
// @Success 200 {object} dto.SuccessResponse{data=dto.LoginResponse}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 401 {object} middleware.ErrorResponse
// @Router /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	// Get user by email
	user, err := h.repos.Users.GetByEmail(c.Request.Context(), req.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			middleware.AbortWithError(c, http.StatusUnauthorized, "invalid_credentials", "Invalid email or password")
			return
		}
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to authenticate")
		return
	}

	// Check if user is active
	if !user.IsActive {
		middleware.AbortWithError(c, http.StatusUnauthorized, "account_disabled", "Account is disabled")
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		middleware.AbortWithError(c, http.StatusUnauthorized, "invalid_credentials", "Invalid email or password")
		return
	}

	// Get user roles
	roles, err := h.repos.Users.GetRoles(c.Request.Context(), user.ID)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to get user roles")
		return
	}

	roleNames := make([]string, len(roles))
	for i, role := range roles {
		roleNames[i] = role.Name
	}

	// Generate tokens
	accessToken, err := middleware.GenerateAccessToken(h.cfg, user.ID, roleNames)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to generate access token")
		return
	}

	refreshTokenStr, expiresAt, err := middleware.GenerateRefreshToken(h.cfg, user.ID, roleNames)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to generate refresh token")
		return
	}

	// Save refresh token
	refreshToken := &models.RefreshToken{
		UserID:    user.ID,
		Token:     refreshTokenStr,
		ExpiresAt: expiresAt,
	}
	if err := h.repos.Users.SaveRefreshToken(c.Request.Context(), refreshToken); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to save refresh token")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data: dto.LoginResponse{
			AccessToken:  accessToken,
			RefreshToken: refreshTokenStr,
			ExpiresAt:    expiresAt,
			User: &dto.UserResponse{
				ID:        user.ID,
				Email:     user.Email,
				FullName:  user.FullName,
				Avatar:    user.Avatar,
				IsActive:  user.IsActive,
				Roles:     roleNames,
				CreatedAt: user.CreatedAt,
			},
		},
	})
}

// Refresh godoc
// @Summary Refresh access token
// @Description Get new access token using refresh token
// @Tags auth
// @Accept json
// @Produce json
// @Param request body dto.RefreshTokenRequest true "Refresh token"
// @Success 200 {object} dto.SuccessResponse{data=dto.LoginResponse}
// @Failure 400 {object} middleware.ErrorResponse
// @Failure 401 {object} middleware.ErrorResponse
// @Router /auth/refresh [post]
func (h *AuthHandler) Refresh(c *gin.Context) {
	var req dto.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	// Get refresh token from database
	refreshToken, err := h.repos.Users.GetRefreshToken(c.Request.Context(), req.RefreshToken)
	if err != nil {
		middleware.AbortWithError(c, http.StatusUnauthorized, "invalid_token", "Invalid refresh token")
		return
	}

	// Get user
	user, err := h.repos.Users.GetByID(c.Request.Context(), refreshToken.UserID)
	if err != nil {
		middleware.AbortWithError(c, http.StatusUnauthorized, "invalid_token", "User not found")
		return
	}

	// Get user roles
	roles, err := h.repos.Users.GetRoles(c.Request.Context(), user.ID)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to get user roles")
		return
	}

	roleNames := make([]string, len(roles))
	for i, role := range roles {
		roleNames[i] = role.Name
	}

	// Generate new access token
	accessToken, err := middleware.GenerateAccessToken(h.cfg, user.ID, roleNames)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to generate access token")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data: dto.LoginResponse{
			AccessToken:  accessToken,
			RefreshToken: req.RefreshToken,
			ExpiresAt:    refreshToken.ExpiresAt,
			User: &dto.UserResponse{
				ID:        user.ID,
				Email:     user.Email,
				FullName:  user.FullName,
				Avatar:    user.Avatar,
				IsActive:  user.IsActive,
				Roles:     roleNames,
				CreatedAt: user.CreatedAt,
			},
		},
	})
}

// Logout godoc
// @Summary User logout
// @Description Invalidate refresh token
// @Tags auth
// @Accept json
// @Produce json
// @Param request body dto.RefreshTokenRequest true "Refresh token"
// @Success 200 {object} dto.SuccessResponse
// @Failure 400 {object} middleware.ErrorResponse
// @Security BearerAuth
// @Router /auth/logout [post]
func (h *AuthHandler) Logout(c *gin.Context) {
	var req dto.RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.AbortWithError(c, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	// Delete refresh token
	if err := h.repos.Users.DeleteRefreshToken(c.Request.Context(), req.RefreshToken); err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to logout")
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data: gin.H{"message": "Logged out successfully"},
	})
}

// Me godoc
// @Summary Get current user
// @Description Get authenticated user information
// @Tags auth
// @Produce json
// @Success 200 {object} dto.SuccessResponse{data=dto.UserResponse}
// @Failure 401 {object} middleware.ErrorResponse
// @Security BearerAuth
// @Router /auth/me [get]
func (h *AuthHandler) Me(c *gin.Context) {
	userID := c.GetInt64("user_id")

	user, err := h.repos.Users.GetByID(c.Request.Context(), userID)
	if err != nil {
		middleware.AbortWithError(c, http.StatusNotFound, "user_not_found", "User not found")
		return
	}

	roles, err := h.repos.Users.GetRoles(c.Request.Context(), user.ID)
	if err != nil {
		middleware.AbortWithError(c, http.StatusInternalServerError, "internal_error", "Failed to get user roles")
		return
	}

	roleNames := make([]string, len(roles))
	for i, role := range roles {
		roleNames[i] = role.Name
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Data: dto.UserResponse{
			ID:        user.ID,
			Email:     user.Email,
			FullName:  user.FullName,
			Avatar:    user.Avatar,
			IsActive:  user.IsActive,
			Roles:     roleNames,
			CreatedAt: user.CreatedAt,
		},
	})
}
