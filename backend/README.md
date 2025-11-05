# Portal 365 Backend API

Go backend API for Portal 365 news portal, built with Gin framework, SQLite database, JWT authentication, and Swagger documentation.

## Tech Stack

- **Framework**: Gin (Go web framework)
- **Database**: SQLite with modernc.org/sqlite driver
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **CORS**: Gin CORS middleware

## Features

✅ RESTful API architecture
✅ JWT-based authentication
✅ Role-based access control (Admin, Editor, Author, Reviewer, Moderator)
✅ Article/News management (CRUD operations)
✅ Category and Tag management
✅ User management
✅ Media library
✅ Comments moderation
✅ Search functionality
✅ Pagination and filtering
✅ View counting
✅ Swagger API documentation
✅ CORS support for frontend integration

## Project Structure

```
backend/
├── cmd/
│   ├── server/          # Main application entry point
│   └── seed/            # Database seeding script
├── internal/
│   ├── config/          # Configuration management
│   ├── database/        # Database initialization and migrations
│   ├── dto/             # Data Transfer Objects
│   ├── handlers/        # HTTP request handlers
│   ├── middleware/      # Custom middleware (auth, logging, etc.)
│   ├── models/          # Database models
│   ├── repositories/    # Data access layer
│   └── routes/          # API routes setup
├── docs/                # Swagger documentation (auto-generated)
├── .env                 # Environment variables
├── .env.example         # Example environment configuration
├── go.mod               # Go module dependencies
└── portal.db            # SQLite database file
```

## Prerequisites

- Go 1.21 or higher
- Git

## Installation

### 1. Clone the repository

```bash
cd backend
```

### 2. Install dependencies

```bash
go mod download
```

### 3. Configure environment variables

Copy the example .env file and update with your settings:

```bash
cp .env.example .env
```

Edit `.env`:

```env
APP_ENV=development
PORT=8080
DATABASE_DSN=file:portal.db?_busy_timeout=5000&_journal_mode=WAL&_foreign_keys=on
JWT_SECRET=your-secret-key-change-this-in-production
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=720h
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Run database migrations

Migrations will run automatically when you start the server, creating all necessary tables.

### 5. Seed the database (optional)

```bash
go run cmd/seed/main.go
```

This will populate the database with:
- Default roles (Admin, Editor, Author, Reviewer, Moderator)
- Admin user (email: admin@portal365.com, password: Admin123!)
- Sample categories and tags
- Demo articles

## Running the Server

### Development mode

```bash
go run cmd/server/main.go
```

### Build and run

```bash
# Build the binary
go build -o server cmd/server/main.go

# Run the binary
./server        # On Linux/Mac
server.exe      # On Windows
```

The server will start on `http://localhost:8080`

## API Endpoints

### Health Check

- `GET /api/v1/healthz` - Health check endpoint

### Public Endpoints

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token

#### Articles
- `GET /api/v1/articles` - List published articles
- `GET /api/v1/articles/:slug` - Get article by slug
- `GET /api/v1/articles/:slug/related` - Get related articles
- `POST /api/v1/articles/:id/views` - Record article view

#### Categories
- `GET /api/v1/categories` - List all categories
- `GET /api/v1/categories/:slug` - Get category by slug

#### Tags
- `GET /api/v1/tags` - List all tags
- `GET /api/v1/tags/:slug` - Get tag by slug

#### Search
- `GET /api/v1/search?q=query` - Search articles

#### Settings
- `GET /api/v1/settings` - Get public settings

#### Banners
- `GET /api/v1/banners?placement=home` - Get banners by placement

#### Comments
- `GET /api/v1/comments/article/:article_id` - Get article comments
- `POST /api/v1/comments` - Create a comment

### Protected Endpoints (Require Authentication)

#### Auth
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user info

#### Admin - Articles
- `GET /api/v1/admin/articles` - List all articles (with drafts)
- `POST /api/v1/admin/articles` - Create article
- `GET /api/v1/admin/articles/:id` - Get article by ID
- `PUT /api/v1/admin/articles/:id` - Update article
- `DELETE /api/v1/admin/articles/:id` - Delete article
- `POST /api/v1/admin/articles/:id/submit` - Submit for review
- `POST /api/v1/admin/articles/:id/publish` - Publish article
- `POST /api/v1/admin/articles/:id/unpublish` - Unpublish article
- `POST /api/v1/admin/articles/:id/approve` - Approve article
- `POST /api/v1/admin/articles/:id/reject` - Reject article
- `GET /api/v1/admin/articles/:id/revisions` - Get article revisions

#### Admin - Categories
- `POST /api/v1/admin/categories` - Create category
- `PUT /api/v1/admin/categories/:id` - Update category
- `DELETE /api/v1/admin/categories/:id` - Delete category

#### Admin - Tags
- `POST /api/v1/admin/tags` - Create tag
- `DELETE /api/v1/admin/tags/:id` - Delete tag

#### Admin - Users
- `GET /api/v1/admin/users` - List users
- `POST /api/v1/admin/users` - Create user
- `GET /api/v1/admin/users/:id` - Get user by ID
- `PUT /api/v1/admin/users/:id` - Update user
- `DELETE /api/v1/admin/users/:id` - Delete user

## API Documentation (Swagger)

Once the server is running, access the Swagger UI at:

```
http://localhost:8080/swagger/index.html
```

The OpenAPI JSON specification is available at:

```
http://localhost:8080/swagger/doc.json
```

### Regenerate Swagger Documentation

If you make changes to API endpoints or add Swagger annotations:

```bash
# Install swag CLI (if not already installed)
go install github.com/swaggo/swag/cmd/swag@latest

# Generate docs
swag init -g cmd/server/main.go -o docs/swagger
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login Flow

1. **Login**: POST to `/api/v1/auth/login` with email and password
   ```json
   {
     "email": "admin@portal365.com",
     "password": "Admin123!"
   }
   ```

2. **Response**: Receive access token and refresh token
   ```json
   {
     "data": {
       "access_token": "eyJhbGc...",
       "refresh_token": "eyJhbGc...",
       "expires_in": 900
     }
   }
   ```

3. **Use Token**: Include in Authorization header for protected endpoints
   ```
   Authorization: Bearer eyJhbGc...
   ```

4. **Refresh**: When access token expires, use refresh token
   ```json
   POST /api/v1/auth/refresh
   {
     "refresh_token": "eyJhbGc..."
   }
   ```

## Query Parameters

### Pagination

- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

Example:
```
GET /api/v1/articles?page=2&page_size=10
```

### Filtering

Articles can be filtered by:
- `category_id`: Filter by category
- `tag`: Filter by tag slug
- `author_id`: Filter by author
- `status`: Filter by status (draft, published, etc.)
- `is_featured`: Filter featured articles
- `q`: Search query

Example:
```
GET /api/v1/articles?category_id=1&tag=defense&is_featured=true
```

### Sorting

Use the `sort` parameter with field name. Prefix with `-` for descending order.

Example:
```
GET /api/v1/articles?sort=-published_at  # Most recent first
GET /api/v1/articles?sort=title           # Alphabetical
GET /api/v1/articles?sort=-view_count     # Most viewed first
```

## Database Schema

### Main Tables

- **users**: User accounts
- **roles**: User roles
- **user_roles**: User-role mapping
- **categories**: Article categories (hierarchical)
- **tags**: Article tags
- **articles**: News articles
- **article_tags**: Article-tag mapping
- **article_revisions**: Article version history
- **media**: Media library (images, videos)
- **comments**: Article comments
- **pages**: Static pages
- **menus**: Navigation menus
- **menu_items**: Menu item entries
- **banners**: Advertisement banners
- **settings**: Site settings

## CORS Configuration

The backend is configured to accept requests from the frontend. Update `CORS_ALLOWED_ORIGINS` in `.env` to match your frontend URL:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://yourdomain.com
```

## Error Handling

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {}  // Optional additional details
  }
}
```

Common error codes:
- `validation_error`: Invalid input data
- `unauthorized`: Missing or invalid authentication
- `forbidden`: Insufficient permissions
- `not_found`: Resource not found
- `internal_error`: Server error

## Deployment

### Building for Production

```bash
# Set production mode
export APP_ENV=production

# Build optimized binary
go build -ldflags="-s -w" -o portal-api cmd/server/main.go

# Run
./portal-api
```

### Environment Variables for Production

```env
APP_ENV=production
PORT=8080
DATABASE_DSN=file:/path/to/portal.db?_busy_timeout=5000&_journal_mode=WAL
JWT_SECRET=use-a-strong-random-secret-key-here
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=720h
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Systemd Service (Linux)

Create `/etc/systemd/system/portal-api.service`:

```ini
[Unit]
Description=Portal 365 API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/portal365/backend
ExecStart=/opt/portal365/backend/portal-api
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable portal-api
sudo systemctl start portal-api
sudo systemctl status portal-api
```

## Development Tips

### Hot Reload

Install Air for hot reload during development:

```bash
go install github.com/cosmtrek/air@latest
air
```

### Testing

```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run specific package tests
go test ./internal/handlers/...
```

### Database Management

View database:
```bash
sqlite3 portal.db
.tables
.schema articles
SELECT * FROM articles LIMIT 5;
```

Backup database:
```bash
sqlite3 portal.db ".backup portal_backup.db"
```

## Troubleshooting

### Database locked error

If you encounter "database is locked" errors:
1. Ensure `_busy_timeout` is set in DATABASE_DSN
2. Use WAL mode: `_journal_mode=WAL`
3. Check for long-running transactions

### CORS errors

If frontend cannot connect:
1. Verify CORS_ALLOWED_ORIGINS includes frontend URL
2. Check that protocol (http/https) matches
3. Ensure port numbers are correct

### Swagger not generating

```bash
# Install swag
go install github.com/swaggo/swag/cmd/swag@latest

# Regenerate docs
swag init -g cmd/server/main.go -o docs/swagger
```

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
