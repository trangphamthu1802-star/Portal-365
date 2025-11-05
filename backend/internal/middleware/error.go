package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	Error ErrorDetail `json:"error"`
}

type ErrorDetail struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			err := c.Errors.Last()

			// Check if already responded
			if c.Writer.Written() {
				return
			}

			statusCode := http.StatusInternalServerError
			code := "internal_error"
			message := "An internal error occurred"

			// Custom error handling based on error type
			if err.Meta != nil {
				if meta, ok := err.Meta.(map[string]interface{}); ok {
					if c, ok := meta["code"].(string); ok {
						code = c
					}
					if s, ok := meta["status"].(int); ok {
						statusCode = s
					}
					if m, ok := meta["message"].(string); ok {
						message = m
					}
				}
			}

			c.JSON(statusCode, ErrorResponse{
				Error: ErrorDetail{
					Code:    code,
					Message: message,
				},
			})
		}
	}
}

func AbortWithError(c *gin.Context, statusCode int, code, message string) {
	c.AbortWithStatusJSON(statusCode, ErrorResponse{
		Error: ErrorDetail{
			Code:    code,
			Message: message,
		},
	})
}

func AbortWithErrorDetails(c *gin.Context, statusCode int, code, message string, details interface{}) {
	c.AbortWithStatusJSON(statusCode, ErrorResponse{
		Error: ErrorDetail{
			Code:    code,
			Message: message,
			Details: details,
		},
	})
}
