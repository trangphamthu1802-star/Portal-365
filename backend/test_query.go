package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "file:portal.db?_busy_timeout=5000")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	ctx := context.Background()

	// Test the exact query used by repository
	query := `
		SELECT id, title, slug, summary, content, featured_image, author_id, category_id, 
		       status, view_count, is_featured, published_at, scheduled_at, created_at, updated_at 
		FROM articles ORDER BY created_at DESC LIMIT ? OFFSET ?`

	rows, err := db.QueryContext(ctx, query, 20, 0)
	if err != nil {
		log.Fatal("Query error:", err)
	}
	defer rows.Close()

	fmt.Println("Testing repository query...")
	count := 0
	for rows.Next() {
		var id, authorID, categoryID int64
		var viewCount int
		var isFeatured bool
		var title, slug, summary, content string
		var featuredImage, status sql.NullString
		var publishedAt, scheduledAt, createdAt, updatedAt sql.NullTime

		err := rows.Scan(&id, &title, &slug, &summary, &content, &featuredImage,
			&authorID, &categoryID, &status, &viewCount, &isFeatured,
			&publishedAt, &scheduledAt, &createdAt, &updatedAt)

		if err != nil {
			log.Printf("Scan error at row %d: %v", count+1, err)
			continue
		}

		count++
		statusStr := "NULL"
		if status.Valid {
			statusStr = status.String
		}
		fmt.Printf("%d. [%d] %s (status: %s, category: %d)\n", count, id, title, statusStr, categoryID)
	}

	if err = rows.Err(); err != nil {
		log.Fatal("Rows error:", err)
	}

	fmt.Printf("\n✓ Successfully scanned %d articles\n", count)
}
