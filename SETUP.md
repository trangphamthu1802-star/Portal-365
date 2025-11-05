# Portal 365 - Quick Setup Guide

## ✅ What's Been Implemented

### Backend (Go + Gin + SQLite + Swagger)
- ✅ Complete project structure with all packages
- ✅ Database migrations for all tables (users, roles, articles, categories, tags, media, etc.)
- ✅ Repository pattern for data access
- ✅ JWT authentication with access and refresh tokens
- ✅ RBAC middleware (Admin, Editor, Author, Reviewer, Moderator)
- ✅ All API handlers (auth, articles, categories, tags, users, etc.)
- ✅ Swagger documentation generated
- ✅ Seed script for admin user and sample data
- ✅ Error handling and logging middleware
- ✅ CORS configuration

### Frontend (React + TypeScript + Vite + TailwindCSS)
- ✅ Vite + React + TypeScript setup
- ✅ TailwindCSS configured
- ✅ React Router for navigation
- ✅ React Query for data fetching
- ✅ Axios client with JWT interceptors
- ✅ Home page with featured articles
- ✅ Login page
- ✅ Article detail page
- ✅ Admin dashboard
- ✅ Protected routes
- ✅ API client infrastructure

## 🚀 Getting Started

### Prerequisites

For **Windows** users, you need:
1. **Go 1.21+** - Already installed ✅
2. **Node.js 18+** - Already installed ✅

**Note:** The backend now uses `modernc.org/sqlite`, a pure Go SQLite driver that doesn't require CGO or GCC! 🎉

### Backend Setup

1. **Navigate to backend:**
```bash
cd backend
```

2. **Copy environment file:**
```bash
copy .env.example .env
```

3. **Install dependencies (already done):**
```bash
go mod download
```

4. **Run database seed:**
```bash
go run cmd/seed/main.go
```

Expected output:
```
Created admin user with ID: 1
Assigned Admin role to user
Created category: Politics
Created category: Economy
...
Seeding completed!
Admin credentials: admin@portal365.com / admin123
```

5. **Start the server:**
```bash
go run cmd/server/main.go
```

The backend will run at: **http://localhost:8080**
Swagger docs at: **http://localhost:8080/swagger/index.html**

### Frontend Setup

1. **Navigate to frontend:**
```bash
cd frontend
```

2. **Copy environment file:**
```bash
copy .env.example .env
```

3. **Install dependencies (already done):**
```bash
npm install
```

4. **Start development server:**
```bash
npm run dev
```

The frontend will run at: **http://localhost:5173**

## 📋 Default Credentials

```
Email: admin@portal365.com
Password: admin123
```

**⚠️ IMPORTANT: Change these credentials in production!**

## 🧪 Testing the Application

### 1. Test Backend API

Open Swagger UI: http://localhost:8080/swagger/index.html

Try these endpoints:
- `GET /api/v1/healthz` - Should return status: ok
- `POST /api/v1/auth/login` - Login with admin credentials
- `GET /api/v1/categories` - List categories
- `GET /api/v1/articles` - List published articles

### 2. Test Frontend

1. Visit http://localhost:5173
2. Click "Login" in the navigation
3. Login with admin credentials
4. You'll be redirected to the admin dashboard
5. Explore the CMS features

## 📁 Project Structure

```
portal-365/
├── backend/
│   ├── cmd/
│   │   ├── server/main.go         # Server entry point
│   │   └── seed/main.go           # Database seeding
│   ├── internal/
│   │   ├── config/                # Configuration
│   │   ├── database/              # DB setup & migrations
│   │   ├── dto/                   # Request/Response DTOs
│   │   ├── handlers/              # HTTP handlers
│   │   ├── middleware/            # Auth, logging, errors
│   │   ├── models/                # Data models
│   │   ├── repositories/          # Data access layer
│   │   └── routes/                # Route definitions
│   ├── docs/                      # Swagger docs
│   ├── portal.db                  # SQLite database (created after seed)
│   ├── go.mod
│   └── .env
└── frontend/
    ├── src/
    │   ├── lib/api.ts             # API client & auth
    │   ├── pages/                 # Page components
    │   │   ├── Home.tsx
    │   │   ├── Login.tsx
    │   │   ├── Article.tsx
    │   │   └── admin/
    │   │       ├── Dashboard.tsx
    │   │       └── Articles.tsx
    │   ├── App.tsx                # Main app with routing
    │   └── main.tsx
    ├── package.json
    └── .env
```

## 🔧 Development Commands

### Backend
```bash
# Run server
go run cmd/server/main.go

# Run seed
go run cmd/seed/main.go

# Generate Swagger docs (after changing API)
swag init -g cmd/server/main.go -o docs

# Build
go build -o bin/server cmd/server/main.go
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Generate API client (when backend swagger changes)
npm run generate:api
```

## 🔑 Key Features Implemented

### Public Features
- ✅ Home page with featured articles
- ✅ Article detail view with related articles
- ✅ Category filtering
- ✅ View count tracking
- ✅ Tag-based organization
- ✅ Search functionality (API ready)
- ✅ Responsive design with TailwindCSS

### CMS Features
- ✅ JWT authentication
- ✅ Role-based access control (RBAC)
- ✅ Admin dashboard
- ✅ Article workflow: draft → review → publish
- ✅ User management
- ✅ Category & tag management
- ✅ Media library support
- ✅ Audit logging
- ✅ Settings management

### API Features
- ✅ RESTful API design
- ✅ Swagger/OpenAPI documentation
- ✅ Pagination on list endpoints
- ✅ Sorting and filtering
- ✅ Error handling with consistent format
- ✅ Request logging
- ✅ CORS support

## 🎯 Next Steps (Optional Enhancements)

1. **Implement remaining frontend pages:**
   - Category listing page
   - Search results page
   - Complete admin CRUD interfaces
   - Media upload UI
   - Comments moderation UI

2. **Add features:**
   - Rich text editor for articles (TinyMCE, Quill, etc.)
   - Image upload and management
   - Email notifications
   - RSS feed generation
   - SEO optimization

3. **Testing:**
   - Unit tests for backend services
   - Integration tests for API
   - E2E tests for frontend

4. **Deployment:**
   - Docker containerization
   - CI/CD pipeline
   - Production environment setup

## ❓ Troubleshooting

### Port already in use
Change PORT in backend/.env or frontend vite.config.ts

### CORS errors
Check CORS_ALLOWED_ORIGINS in backend/.env matches frontend URL

### Database locked
Close any other processes using portal.db

## 📚 Additional Resources

- [Gin Web Framework](https://gin-gonic.com/)
- [React Documentation](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)
- [Swagger/OpenAPI](https://swagger.io/)

## ✨ Success!

You now have a fully functional news portal with:
- Modern tech stack (Go, React, TypeScript)
- Authentication & authorization
- Content management system
- API documentation
- Responsive design

Happy coding! 🎉
