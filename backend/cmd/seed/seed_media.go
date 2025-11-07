package main

import (
	"context"
	"database/sql"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"github.com/thieugt95/portal-365/backend/internal/config"
	"github.com/thieugt95/portal-365/backend/internal/database"
	"github.com/thieugt95/portal-365/backend/internal/models"
)

// Sample image URLs for Sư đoàn 365 (using placeholder images)
var sampleImages = []struct {
	URL         string
	Title       string
	Alt         string
	Description string
}{
	{
		URL:         "https://picsum.photos/1200/800?random=1",
		Title:       "Lễ xuất quân huấn luyện Sư đoàn 365",
		Alt:         "Lễ xuất quân huấn luyện",
		Description: "Các chiến sĩ Sư đoàn 365 trong lễ xuất quân huấn luyện năm 2025",
	},
	{
		URL:         "https://picsum.photos/1200/800?random=2",
		Title:       "Diễn tập chiến thuật Sư đoàn 365",
		Alt:         "Diễn tập chiến thuật",
		Description: "Các đơn vị thực hành chiến thuật tại bãi tập",
	},
	{
		URL:         "https://picsum.photos/1200/800?random=3",
		Title:       "Hoạt động rèn luyện thể lực",
		Alt:         "Rèn luyện thể lực",
		Description: "Chiến sĩ Sư đoàn 365 rèn luyện thể lực buổi sáng",
	},
	{
		URL:         "https://picsum.photos/1200/800?random=4",
		Title:       "Hội thảo chuyên đề tác chiến",
		Alt:         "Hội thảo tác chiến",
		Description: "Các chỉ huy tham dự hội thảo chuyên đề tác chiến",
	},
	{
		URL:         "https://picsum.photos/1200/800?random=5",
		Title:       "Kiểm tra công tác chuẩn bị chiến đấu",
		Alt:         "Kiểm tra CCCĐ",
		Description: "Thủ trưởng Sư đoàn kiểm tra công tác chuẩn bị chiến đấu",
	},
	{
		URL:         "https://picsum.photos/1200/800?random=6",
		Title:       "Hoạt động văn hóa văn nghệ",
		Alt:         "Văn hóa văn nghệ",
		Description: "Chiến sĩ tham gia hoạt động văn hóa văn nghệ tại đơn vị",
	},
}

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Initialize(cfg.DatabaseDSN)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	repos := database.NewRepositories(db)
	ctx := context.Background()

	// Create upload directory structure
	uploadDir := "static/uploads"
	currentMonth := time.Now().Format("2006/01")
	uploadPath := filepath.Join(uploadDir, currentMonth)

	if err := os.MkdirAll(uploadPath, 0755); err != nil {
		log.Fatalf("Failed to create upload directory: %v", err)
	}

	log.Println("Starting media seeding for Sư đoàn 365...")

	// Get admin user (uploader)
	adminUser, err := getUserByEmail(db, "admin@portal365.com")
	if err != nil {
		log.Fatalf("Failed to get admin user: %v", err)
	}

	// Download and save sample images
	for i, img := range sampleImages {
		log.Printf("Processing image %d/%d: %s", i+1, len(sampleImages), img.Title)

		// Download image
		resp, err := http.Get(img.URL)
		if err != nil {
			log.Printf("Failed to download image %s: %v", img.URL, err)
			continue
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			log.Printf("Failed to download image, status: %d", resp.StatusCode)
			continue
		}

		// Generate unique filename
		filename := fmt.Sprintf("%s.jpg", uuid.New().String())
		fullPath := filepath.Join(uploadPath, filename)

		// Save file
		out, err := os.Create(fullPath)
		if err != nil {
			log.Printf("Failed to create file %s: %v", fullPath, err)
			continue
		}

		written, err := io.Copy(out, resp.Body)
		out.Close()

		if err != nil {
			log.Printf("Failed to save file %s: %v", fullPath, err)
			os.Remove(fullPath)
			continue
		}

		log.Printf("Saved image: %s (%d bytes)", fullPath, written)

		// Create media item in database
		mediaItem := &models.MediaItem{
			Title:       img.Title,
			Alt:         img.Alt,
			Description: img.Description,
			FileName:    filename,
			FilePath:    "/" + filepath.ToSlash(fullPath),
			MimeType:    "image/jpeg",
			FileSize:    written,
			UploadedBy:  adminUser.ID,
		}

		if err := repos.MediaItems.Create(ctx, mediaItem); err != nil {
			log.Printf("Failed to create media item: %v", err)
			continue
		}

		log.Printf("Created media item ID: %d - %s", mediaItem.ID, mediaItem.Title)
	}

	log.Println("Media seeding completed!")
	log.Printf("Created %d sample images in %s", len(sampleImages), uploadPath)
	log.Println("You can now use these images for articles about Sư đoàn 365")
}

func getUserByEmail(db *sql.DB, email string) (*models.User, error) {
	user := &models.User{}
	err := db.QueryRow(
		`SELECT id, email, password_hash, full_name, avatar, is_active, created_at, updated_at 
		 FROM users WHERE email = ?`, email).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.FullName,
		&user.Avatar, &user.IsActive, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return user, nil
}
