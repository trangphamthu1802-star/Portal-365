package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery

		c.Next()

		end := time.Now()
		latency := end.Sub(start)
		statusCode := c.Writer.Status()
		clientIP := c.ClientIP()
		method := c.Request.Method
		requestID := c.GetString("request_id")

		log.Printf("[%s] %s %s %s %d %s %s",
			requestID,
			clientIP,
			method,
			path,
			statusCode,
			latency,
			query,
		)
	}
}
