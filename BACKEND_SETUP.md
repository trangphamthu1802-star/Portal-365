# Portal 365 - Complete Setup Guide

Complete guide to run both backend (Go) and frontend (React) of Portal 365 news portal.

## Quick Start

### Prerequisites

- **Go** 1.21 or higher ([Download](https://golang.org/dl/))
- **Node.js** 18+ and npm ([Download](https://nodejs.org/))
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/thieugt95/portal-365.git
cd portal-365
```

### 2. Start the Backend

```bash
cd backend

# Install Go dependencies
go mod download

# Create .env file
cp .env.example .env

# Run database migrations and seed data
go run cmd/seed/main.go

# Start the backend server
go run cmd/server/main.go
```

Backend will be running at `http://localhost:8080`

**API Documentation (Swagger)**: http://localhost:8080/swagger/index.html

**Default Admin Credentials**:
- Email: `admin@portal365.com`
- Password: `Admin123!`

### 3. Start the Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be running at `http://localhost:5173`

## Architecture

```
portal-365/
├── backend/              # Go API Backend
│   ├── cmd/
│   │   ├── server/      # Main application
│   │   └── seed/        # Database seeding
│   ├── internal/
│   │   ├── config/      # Configuration
│   │   ├── database/    # Database layer
│   │   ├── handlers/    # HTTP handlers
│   │   ├── middleware/  # Middleware
│   │   ├── models/      # Database models
│   │   └── routes/      # API routes
│   ├── docs/            # Swagger docs
│   ├── .env             # Environment variables
│   └── portal.db        # SQLite database
│
└── frontend/            # React Frontend
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── api/         # API client
    │   ├── lib/         # Utilities
    │   └── data/        # Mock data
    ├── public/          # Static assets
    └── package.json     # Dependencies
```

## Backend (Go + Gin)

### Technology Stack

- **Framework**: Gin
- **Database**: SQLite (modernc.org/sqlite)
- **Authentication**: JWT (golang-jwt/jwt)
- **Documentation**: Swagger (swaggo/swag)
- **CORS**: gin-contrib/cors

### Key Features

✅ RESTful API with Swagger docs
✅ JWT authentication & authorization
✅ Role-based access control (Admin, Editor, Author, Reviewer, Moderator)
✅ Article CRUD with workflow (draft → review → published)
✅ Category & Tag management
✅ Media library
✅ Comment moderation
✅ Search functionality
✅ View counting
✅ Pagination & filtering

### API Endpoints

#### Public
- `GET /api/v1/articles` - List articles
- `GET /api/v1/articles/:slug` - Get article details
- `GET /api/v1/categories` - List categories
- `GET /api/v1/search?q=query` - Search articles
- `POST /api/v1/auth/login` - User login

#### Protected (Requires Authentication)
- `POST /api/v1/admin/articles` - Create article
- `PUT /api/v1/admin/articles/:id` - Update article
- `DELETE /api/v1/admin/articles/:id` - Delete article
- `POST /api/v1/admin/articles/:id/publish` - Publish article

Full API documentation: http://localhost:8080/swagger/index.html

### Environment Variables

Edit `backend/.env`:

```env
APP_ENV=development
PORT=8080
DATABASE_DSN=file:portal.db?_busy_timeout=5000&_journal_mode=WAL&_foreign_keys=on
JWT_SECRET=your-secret-key-change-this
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=720h
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Database Seeding

The seed script creates:
- Default roles (Admin, Editor, Author, Reviewer, Moderator)
- Admin user (email: admin@portal365.com, password: Admin123!)
- Sample categories and tags

```bash
cd backend
go run cmd/seed/main.go
```

### Regenerate Swagger Docs

```bash
# Install swag CLI
go install github.com/swaggo/swag/cmd/swag@latest

# Generate documentation
cd backend
swag init -g cmd/server/main.go -o docs/swagger
```

## Frontend (React + TypeScript)

### Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router
- **Icons**: Lucide React

### Key Features

✅ Responsive design (mobile, tablet, desktop)
✅ News article browsing with categories
✅ Article detail view
✅ Search functionality
✅ Featured news section
✅ Category filtering
✅ Admin dashboard (CMS)
✅ User authentication
✅ Modern UI with Tailwind CSS

### Pages

- **Home** (`/`) - Homepage with featured articles, categories
- **Category** (`/c/:slug`) - Category listing
- **Article** (`/a/:slug`) - Article detail page
- **Search** (`/search`) - Search results
- **Login** (`/login`) - User login
- **Admin Dashboard** (`/admin`) - CMS dashboard
- **Admin Articles** (`/admin/articles`) - Article management

### Environment Variables

Edit `frontend/.env`:

```env
VITE_API_BASE=http://localhost:8080/api/v1
VITE_SWAGGER_URL=http://localhost:8080/swagger/doc.json
```

### Development Commands

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Integration Guide

### Frontend → Backend Connection

The frontend connects to the backend API at `http://localhost:8080/api/v1`.

1. **API Client** is in `frontend/src/lib/api.ts`
2. **Authentication** uses JWT tokens stored in localStorage
3. **CORS** is configured on the backend to allow requests from `http://localhost:5173`

### Authentication Flow

1. User logs in via `/login` page
2. Frontend sends credentials to `POST /api/v1/auth/login`
3. Backend returns access token and refresh token
4. Frontend stores tokens and includes in Authorization header
5. Protected routes check for valid token

### API Client Generation (Optional)

Generate TypeScript API client from Swagger:

```bash
cd frontend

# Install swagger-typescript-api
npm install -D swagger-typescript-api

# Generate API client
npx swagger-typescript-api -p http://localhost:8080/swagger/doc.json -o ./src/api --modular
```

## Production Build

### Backend

```bash
cd backend

# Build binary
go build -ldflags="-s -w" -o portal-api cmd/server/main.go

# Run in production
export APP_ENV=production
./portal-api
```

### Frontend

```bash
cd frontend

# Build for production
npm run build

# Output is in frontend/dist/
# Serve with any static file server (nginx, Apache, etc.)
```

## Troubleshooting

### Backend Issues

**Database locked error:**
- Ensure `_busy_timeout=5000` is in DATABASE_DSN
- Use WAL mode: `_journal_mode=WAL`

**CORS errors:**
- Verify `CORS_ALLOWED_ORIGINS` in backend/.env includes frontend URL
- Check protocol (http vs https) matches

**Swagger not loading:**
```bash
cd backend
swag init -g cmd/server/main.go -o docs/swagger
```

### Frontend Issues

**API connection failed:**
- Verify backend is running on port 8080
- Check `VITE_API_BASE` in frontend/.env
- Check browser console for CORS errors

**Build errors:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Testing

### Backend Tests

```bash
cd backend
go test ./...
go test -cover ./...
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## Docker Deployment (Optional)

### Backend Dockerfile

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -ldflags="-s -w" -o portal-api cmd/server/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/portal-api .
COPY --from=builder /app/.env .
EXPOSE 8080
CMD ["./portal-api"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - APP_ENV=production
      - DATABASE_DSN=file:/data/portal.db
    volumes:
      - ./data:/data

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

## Support & Documentation

- **Backend README**: [backend/README.md](backend/README.md)
- **Frontend README**: [frontend/README.md](frontend/README.md)
- **API Documentation**: http://localhost:8080/swagger/index.html

## License

MIT License

---

**Developed for Portal 365 - Military News Portal System**
