package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "file:portal.db?_busy_timeout=5000")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Get media item with file path
	var id int64
	var title, url, thumbnailURL, status string
	err = db.QueryRow(`SELECT id, title, url, thumbnail_url, status FROM media_items WHERE id=1`).
		Scan(&id, &title, &url, &thumbnailURL, &status)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Media Item:\n")
	fmt.Printf("  ID: %d\n", id)
	fmt.Printf("  Title: %s\n", title)
	fmt.Printf("  URL: %s\n", url)
	fmt.Printf("  Thumbnail: %s\n", thumbnailURL)
	fmt.Printf("  Status: %s\n", status)

	// Check if file exists
	// Convert URL path to filesystem path
	// URL is like: /static/uploads/images/2025/01/filename.jpg
	// File should be at: ./storage/uploads/images/2025/01/filename.jpg
	filePath := "." + url[len("/static"):]

	fmt.Printf("\nChecking file: %s\n", filePath)

	absPath, _ := filepath.Abs(filePath)
	fmt.Printf("Absolute path: %s\n", absPath)

	if _, err := os.Stat(filePath); err == nil {
		fmt.Println("✓ File exists!")

		// Get file info
		info, _ := os.Stat(filePath)
		fmt.Printf("  Size: %d bytes\n", info.Size())
		fmt.Printf("  Modified: %s\n", info.ModTime())
	} else {
		fmt.Println("✗ File NOT found!")

		// List what's in the directory
		dir := filepath.Dir(filePath)
		fmt.Printf("\nContents of %s:\n", dir)
		entries, err := os.ReadDir(dir)
		if err != nil {
			fmt.Printf("  Error reading directory: %v\n", err)
		} else {
			for _, entry := range entries {
				fmt.Printf("  - %s\n", entry.Name())
			}
		}
	}
}
