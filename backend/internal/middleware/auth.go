package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"github.com/thieugt95/portal-365/backend/internal/config"
)

type Claims struct {
	UserID int64    `json:"sub"`
	Roles  []string `json:"roles"`
	jwt.RegisteredClaims
}

func AuthRequired(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			AbortWithError(c, http.StatusUnauthorized, "unauthorized", "Missing authorization header")
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			AbortWithError(c, http.StatusUnauthorized, "unauthorized", "Invalid authorization header format")
			return
		}

		tokenString := parts[1]
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(cfg.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			AbortWithError(c, http.StatusUnauthorized, "unauthorized", "Invalid or expired token")
			return
		}

		// Set user info in context
		c.Set("user_id", claims.UserID)
		c.Set("user_roles", claims.Roles)

		c.Next()
	}
}

func RequireRoles(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRoles, exists := c.Get("user_roles")
		if !exists {
			AbortWithError(c, http.StatusForbidden, "forbidden", "No roles found")
			return
		}

		userRolesList, ok := userRoles.([]string)
		if !ok {
			AbortWithError(c, http.StatusForbidden, "forbidden", "Invalid roles format")
			return
		}

		// Check if user has any of the required roles
		hasRole := false
		for _, requiredRole := range roles {
			for _, userRole := range userRolesList {
				if userRole == requiredRole {
					hasRole = true
					break
				}
			}
			if hasRole {
				break
			}
		}

		if !hasRole {
			AbortWithError(c, http.StatusForbidden, "forbidden", "Insufficient permissions")
			return
		}

		c.Next()
	}
}

func GenerateAccessToken(cfg *config.Config, userID int64, roles []string) (string, error) {
	claims := &Claims{
		UserID: userID,
		Roles:  roles,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(cfg.AccessTokenTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(cfg.JWTSecret))
}

func GenerateRefreshToken(cfg *config.Config, userID int64, roles []string) (string, time.Time, error) {
	expiresAt := time.Now().Add(cfg.RefreshTokenTTL)
	claims := &Claims{
		UserID: userID,
		Roles:  roles,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(cfg.JWTSecret))
	return tokenString, expiresAt, err
}
