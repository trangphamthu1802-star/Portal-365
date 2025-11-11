package main

import (
	"context"
	"fmt"
	"log"

	"github.com/thieugt95/portal-365/backend/internal/database"
	"github.com/thieugt95/portal-365/backend/internal/repositories"
)

func main() {
	// Initialize database
	db, err := database.InitDB("file:portal.db?_busy_timeout=5000")
	if err != nil {
		log.Fatal("Failed to init DB:", err)
	}
	defer db.Close()

	repos := database.NewRepositories(db)
	ctx := context.Background()

	// Test List with no filters
	filter := &repositories.ArticleFilter{}
	articles, total, err := repos.Articles.List(ctx, filter, 1, 10, "-published_at")

	fmt.Println("=== Test List Articles ===")
	if err != nil {
		fmt.Printf("ERROR: %v\n", err)
		return
	}

	fmt.Printf("Total: %d\n", total)
	fmt.Printf("Articles returned: %d\n", len(articles))

	for i, article := range articles {
		fmt.Printf("[%d] ID=%d Title=%s CategoryID=%d Status=%s\n",
			i+1, article.ID, article.Title, article.CategoryID, article.Status)
	}
}
