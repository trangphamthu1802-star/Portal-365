package config

import (
	"os"
	"strings"
	"time"
)

type Config struct {
	Port               string
	AppEnv             string
	DatabaseDSN        string
	JWTSecret          string
	AccessTokenTTL     time.Duration
	RefreshTokenTTL    time.Duration
	CORSAllowedOrigins []string
}

func Load() *Config {
	return &Config{
		Port:               getEnv("PORT", "8080"),
		AppEnv:             getEnv("APP_ENV", "dev"),
		DatabaseDSN:        getEnv("SQLITE_DSN", "file:portal.db?_busy_timeout=5000"),
		JWTSecret:          getEnv("JWT_SECRET", "change-me-in-production"),
		AccessTokenTTL:     parseDuration(getEnv("ACCESS_TOKEN_TTL", "15m"), 15*time.Minute),
		RefreshTokenTTL:    parseDuration(getEnv("REFRESH_TOKEN_TTL", "720h"), 720*time.Hour),
		CORSAllowedOrigins: parseOrigins(getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:5173")),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func parseDuration(value string, defaultDuration time.Duration) time.Duration {
	if d, err := time.ParseDuration(value); err == nil {
		return d
	}
	return defaultDuration
}

func parseOrigins(value string) []string {
	origins := strings.Split(value, ",")
	for i, origin := range origins {
		origins[i] = strings.TrimSpace(origin)
	}
	return origins
}
