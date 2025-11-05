# 🚀 Quick Start - Portal 365

## Start Backend (Terminal 1)

```powershell
cd backend
go run cmd/server/main.go
```

✅ Backend running at: **http://localhost:8080**
📚 Swagger API docs: **http://localhost:8080/swagger/index.html**

## Start Frontend (Terminal 2)

```powershell
cd frontend
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

## Default Admin Login

- **Email**: `admin@portal365.com`
- **Password**: `Admin123!`

## First Time Setup

### Backend Setup (One Time)

```powershell
cd backend

# Install dependencies
go mod download

# Create environment file
copy .env.example .env

# Seed database with admin user and sample data
go run cmd/seed/main.go
```

### Frontend Setup (One Time)

```powershell
cd frontend

# Install dependencies
npm install
```

## Testing the Integration

1. Start both backend and frontend servers
2. Open browser: http://localhost:5173
3. Browse the homepage - articles should load from backend
4. Try searching using the search bar
5. Login with admin credentials
6. Access admin dashboard: http://localhost:5173/admin

## Key API Endpoints

### Public
- `GET /api/v1/articles` - List articles
- `GET /api/v1/articles/:slug` - Article detail
- `GET /api/v1/categories` - Categories list
- `GET /api/v1/search?q=keyword` - Search
- `POST /api/v1/auth/login` - Login

### Protected (Require Auth Header)
- `GET /api/v1/auth/me` - Current user
- `POST /api/v1/admin/articles` - Create article
- `PUT /api/v1/admin/articles/:id` - Update article
- `DELETE /api/v1/admin/articles/:id` - Delete article

## Authentication Header Format

```
Authorization: Bearer <your-jwt-token>
```

## Environment Files

### backend/.env
```env
PORT=8080
DATABASE_DSN=file:portal.db?_busy_timeout=5000&_journal_mode=WAL
JWT_SECRET=your-secret-key
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### frontend/.env
```env
VITE_API_BASE=http://localhost:8080/api/v1
```

## Troubleshooting

### Backend won't start
- Check if port 8080 is available
- Verify .env file exists
- Run: `go mod download`

### Frontend can't connect to backend
- Ensure backend is running on port 8080
- Check CORS settings in backend/.env
- Verify VITE_API_BASE in frontend/.env

### Database errors
- Delete `portal.db` and run seed again:
  ```powershell
  cd backend
  del portal.db
  go run cmd/seed/main.go
  ```

## Useful Commands

### Backend
```powershell
# Run server
go run cmd/server/main.go

# Build binary
go build -o server.exe cmd/server/main.go

# Run tests
go test ./...

# Regenerate Swagger docs
swag init -g cmd/server/main.go -o docs/swagger
```

### Frontend
```powershell
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
portal-365/
├── backend/          # Go API (Port 8080)
│   ├── cmd/
│   │   ├── server/   # Main app
│   │   └── seed/     # Database seeding
│   ├── internal/     # Business logic
│   └── docs/         # Swagger docs
│
└── frontend/         # React App (Port 5173)
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── lib/
    └── public/
```

## Documentation

- **Full Backend Guide**: `backend/README.md`
- **Complete Setup Guide**: `BACKEND_SETUP.md`
- **API Documentation**: http://localhost:8080/swagger/index.html

---

Need help? Check the documentation files or open an issue on GitHub.
