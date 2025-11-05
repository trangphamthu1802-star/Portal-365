# Portal 365 - News Portal

A modern news portal similar to qdnd.vn built with Go (backend) and React (frontend).

## Architecture

- **Backend**: Go + Gin + SQLite + JWT + Swagger
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **API Documentation**: Swagger/OpenAPI at `/swagger/index.html`

## Features

### Public
- Home page with featured articles, categories, latest news
- Category listing and filtering
- Article detail with related articles, tags, view counts
- Tag-based filtering
- Search functionality
- Static pages (About, Contact)

### CMS (Content Management System)
- Dashboard with statistics
- Article workflow: draft → under_review → published/hidden/rejected
- Categories and Tags management
- Media library (image/video upload)
- Comments moderation
- Banners/Ads management
- Pages and Menus management
- User and Role management (RBAC)
- Audit logs

## Getting Started

### Prerequisites
- Go 1.21+
- Node.js 18+
- npm/pnpm/yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Copy environment file:
```bash
copy .env.example .env
```

3. Install Go dependencies:
```bash
go mod download
```

4. Run migrations and seed data:
```bash
go run cmd/seed/main.go
```

5. Start the server:
```bash
go run cmd/server/main.go
```

The API will be available at `http://localhost:8080`

Swagger documentation: `http://localhost:8080/swagger/index.html`

### Generate Swagger Docs

```bash
swag init -g cmd/server/main.go -o docs/swagger
```

### Default Admin Credentials
- Email: `admin@portal365.com`
- Password: `admin123`

**⚠️ Change these in production!**

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Copy environment file:
```bash
copy .env.example .env
```

3. Install dependencies:
```bash
npm install
```

4. Generate API client from Swagger:
```bash
npm run generate:api
```

5. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Public Endpoints
- `GET /api/v1/healthz` - Health check
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/categories` - List categories
- `GET /api/v1/tags` - List tags
- `GET /api/v1/articles` - List published articles
- `GET /api/v1/articles/:slug` - Get article by slug
- `GET /api/v1/search` - Search articles
- `GET /api/v1/pages/:slug` - Get static page
- `GET /api/v1/banners` - Get banners by placement

### Protected Endpoints (require JWT)
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user
- `GET|POST|PUT|DELETE /api/v1/admin/articles` - Article CRUD
- `GET|POST|PUT|DELETE /api/v1/admin/categories` - Category CRUD
- `GET|POST|DELETE /api/v1/admin/tags` - Tag CRUD
- `GET|POST|DELETE /api/v1/admin/media` - Media management
- `GET|POST|PUT|DELETE /api/v1/admin/users` - User management
- `GET /api/v1/admin/roles` - List roles
- `GET /api/v1/stats/overview` - Dashboard statistics

See Swagger documentation for complete API reference.

## Database Schema

- **users**: User accounts
- **roles**: System roles (Admin, Editor, Author, Reviewer, Moderator)
- **user_roles**: User-Role associations
- **categories**: Article categories (hierarchical)
- **tags**: Article tags
- **articles**: News articles
- **article_tags**: Article-Tag associations
- **article_revisions**: Article revision history
- **media**: Uploaded files (images, videos)
- **comments**: Article comments
- **menus**: Site menus
- **menu_items**: Menu entries
- **pages**: Static pages
- **banners**: Advertisement banners
- **settings**: System settings
- **audit_logs**: Action audit trail
- **refresh_tokens**: JWT refresh tokens
- **view_logs**: Article view tracking

## RBAC (Role-Based Access Control)

### Roles
1. **Admin**: Full system access
2. **Editor**: Can edit and publish articles, manage content
3. **Author**: Can create and submit articles
4. **Reviewer**: Can review articles
5. **Moderator**: Can moderate comments

### Article Workflow
1. Author creates article (status: `draft`)
2. Author submits for review (status: `under_review`)
3. Reviewer/Editor approves (status: `published`) or rejects (status: `rejected`)
4. Editor can hide published articles (status: `hidden`)

## Development

### Project Structure

```
portal-365/
├── backend/
│   ├── cmd/
│   │   ├── server/        # Main server entry point
│   │   └── seed/          # Database seeding
│   ├── internal/
│   │   ├── config/        # Configuration
│   │   ├── database/      # Database setup and migrations
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── handlers/      # HTTP handlers
│   │   ├── middleware/    # HTTP middlewares
│   │   ├── models/        # Data models
│   │   ├── repositories/  # Data access layer
│   │   └── routes/        # Route definitions
│   ├── docs/              # Swagger documentation
│   ├── go.mod
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/           # Generated API client
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── hooks/         # Custom hooks
    │   ├── utils/         # Utilities
    │   └── App.tsx
    ├── package.json
    └── .env.example
```

### Environment Variables

#### Backend (.env)
```
PORT=8080
APP_ENV=dev
SQLITE_DSN=file:portal.db?_busy_timeout=5000
JWT_SECRET=change-me-in-production
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=720h
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

#### Frontend (.env)
```
VITE_API_BASE=http://localhost:8080/api/v1
VITE_SWAGGER_URL=http://localhost:8080/swagger/doc.json
```

## Testing

### Backend Tests
```bash
cd backend
go test ./...
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Backend Build
```bash
cd backend
go build -o bin/server cmd/server/main.go
```

### Frontend Build
```bash
cd frontend
npm run build
```

Build artifacts will be in `frontend/dist`

## Security Considerations

- JWT tokens use HS256 algorithm
- Passwords are hashed with bcrypt (cost >= 12 in production)
- CORS is restricted to configured origins
- Rate limiting on sensitive endpoints
- Input validation on all write operations
- SQL injection prevention through parameterized queries
- XSS prevention through proper escaping

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
