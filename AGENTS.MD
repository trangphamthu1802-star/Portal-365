# Portal 365 — Multi-Agent Delivery Guide

This document defines the plan, conventions, and acceptance criteria for agents implementing Portal 365, a news portal similar to qdnd.vn. The repository root contains two apps:
- backend: Go (Gin) + SQLite + JWT + Swagger
- frontend: React + TypeScript + Vite + TailwindCSS
The frontend consumes the backend via the generated TypeScript API client from Swagger JSON.

## 1) Architecture Overview

- API base: /api/v1
- Auth: JWT (HS256) with access and refresh tokens
- RBAC: roles (Admin, Editor, Author, Reviewer, Moderator)
- DB: SQLite (file-based), schema defined in migrations
- API documentation: swaggo/swag with annotations; served at:
  - Swagger UI: /swagger/index.html
  - OpenAPI JSON: /swagger/doc.json
- Frontend: CSR with routes for Home, Category, Article, Search, Login, CMS Dashboard and CRUD views

## 2) High-Level Features and Scope

Public:
- Home with hero, featured, latest, per-category sections, most-read, video/photo blocks, and banners
- Category listing with pagination and filters
- Article detail with related articles, tags, view counts, share
- Tag page, Search results, Static pages (About, Contact)
- Optional: RSS feed, sitemap

CMS:
- Dashboard with basic stats
- Articles: draft → under_review → published/hidden/rejected; schedule and revisions
- Categories, Tags CRUD
- Media library: upload image/video
- Comments moderation (optional)
- Banners/Ads management
- Pages, Menus, Settings
- User/Role management
- Audit logs

Non-functional:
- CORS, rate limit (basic), logging, health endpoint

## 3) Contracts and Conventions

- JSON responses:
  - Success: { "data": any, "pagination"?: Pagination }
  - Error: { "error": { "code": string, "message": string, "details"?: any } }
- Pagination query params: page (>=1), page_size (<=100)
- Sorting: comma-separated fields, prefix "-" for descending (e.g., "-published_at,title")
- Filtering: query params (category_id, tag, status, author_id, from, to, q)
- JWT claims: sub (user_id), roles: string[], perms?: string[], iat, exp
- Passwords: bcrypt hash
- Time: ISO 8601 (UTC) in API
- Slugs: lowercase, hyphen-separated; unique per entity where applicable
- Media uploads: multipart/form-data

## 4) Backend Agent

Responsibilities:
- Initialize Gin server, middlewares (CORS, logging, error handling, JWT auth, request ID)
- Implement migrations and SQLite repository layer
- Implement domain services for Articles, Categories, Tags, Media, Users/Roles, Comments, Menus, Pages, Banners, Settings
- Implement handlers with Swagger annotations and consistent response envelopes
- Implement auth (login, refresh, logout), RBAC middleware
- Implement view counting endpoint with safety (e.g., IP + UA debounce per minute)
- Serve Swagger UI and swagger.json at /swagger

Deliverables:
- Binary: cmd/server/main.go entrypoint with ENV config:
  - PORT, APP_ENV, JWT_SECRET, ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL, SQLITE_DSN (e.g., file:portal.db?_busy_timeout=5000)
  - CORS_ALLOWED_ORIGINS
- Migrations for all tables described in the schema section
- Unit tests for services (auth, articles workflow, categories/tags)
- Seed script for roles, admin user, demo categories/tags

Swagger annotations:
- Each handler documents:
  - Summary, Description, Tags, Security, Params, Request body, Responses
- Keep OpenAPI consistent; rebuild docs with:
  - swag init -g cmd/server/main.go -o docs/swagger

Key Endpoints (non-exhaustive — see product spec):
- Health: GET /api/v1/healthz
- Auth: POST /api/v1/auth/login, POST /api/v1/auth/refresh, POST /api/v1/auth/logout, GET /api/v1/auth/me
- Users: CRUD, change password; Roles: CRUD
- Categories: CRUD
- Tags: CRUD
- Articles: listing, detail by slug, CRUD, submit-review, approve, reject, publish, unpublish, revisions, related, views
- Media: list, upload, detail, delete
- Comments: list/create (by article), approve, delete
- Menus: CRUD, list
- Pages: CRUD, public fetch by slug
- Banners: CRUD, public list by placement
- Settings: GET public, GET/PUT admin
- Search: GET /api/v1/search
- Stats: GET /api/v1/stats/overview

Acceptance Criteria:
- All protected endpoints enforce JWT and RBAC
- API error format is consistent and includes HTTP status mapping
- Pagination works and returns total estimates when feasible
- Swagger UI loads and reflects all implemented endpoints
- SQLite schema supports required relations and indexes (slug uniques, FKs, common filters)

## 5) Frontend Agent

Responsibilities:
- Bootstrap React + TS + Vite + Tailwind
- Design responsive layout similar to a news portal:
  - Header with logo, menu
  - Home sections (hero, featured, latest, per-category, banners)
  - Category list page with filters
  - Article detail with related, tags, share
  - Search results
  - CMS: Login, Dashboard, Article CRUD (editor), Media library, Category/Tag CRUD, User/Role CRUD (admin), Pages, Menus, Banners, Settings
- Styling with Tailwind; ensure accessibility basics (landmarks, alt text, color contrast)
- Consume API via generated TS client from swagger.json; handle auth token injection

API Client Generation:
- Tooling: choose one
  - swagger-typescript-api (recommended)
  - openapi-typescript + custom fetch/axios layer
- Script flow:
  1) Fetch OpenAPI: GET {BACKEND_BASE_URL}/swagger/doc.json
  2) Generate to src/api/
  3) Re-export typed clients/hooks
- Add an API layer for:
  - auth token management (localStorage)
  - axios/ky instance with interceptors (401 refresh flow)
  - error normalization to {code, message}

Routing:
- Public routes: /, /c/:slug, /a/:slug, /tag/:slug, /search, /page/:slug
- Auth routes: /login
- CMS routes (guarded): /admin, /admin/articles, /admin/media, /admin/categories, /admin/tags, /admin/users, /admin/roles, /admin/pages, /admin/menus, /admin/banners, /admin/settings

State:
- Minimal global state for auth user, settings, and menus
- React Query or SWR for data fetching/caching

Acceptance Criteria:
- Lighthouse (desktop) performance > 80 for public pages
- Works on modern browsers and mobile breakpoints
- JWT persisted and refreshed; logout clears client state
- Lists implement pagination controls
- Forms have validation and error display
- CMS actions show optimistic UI or clear loading states

## 6) DevOps/Build Agent

Responsibilities:
- Local dev scripts
  - Backend: `go run cmd/server/main.go`
  - Swagger: `swag init -g cmd/server/main.go -o docs/swagger`
  - Frontend: `npm run dev` (or pnpm/yarn)
  - API client regen: `npm run generate:api`
- ENV examples:
  - backend/.env.example:
    - PORT=8080
    - APP_ENV=dev
    - SQLITE_DSN=file:portal.db?_busy_timeout=5000
    - JWT_SECRET=change-me
    - ACCESS_TOKEN_TTL=15m
    - REFRESH_TOKEN_TTL=720h
    - CORS_ALLOWED_ORIGINS=http://localhost:5173
  - frontend/.env.example:
    - VITE_API_BASE=http://localhost:8080/api/v1
    - VITE_SWAGGER_URL=http://localhost:8080/swagger/doc.json
- Build:
  - Frontend build artifacts: frontend/dist
  - Backend binary: backend/bin/server
- Optional: Dockerfiles for both apps; docker-compose for local orchestration

Acceptance Criteria:
- One command per app to start development server
- Clear documentation in README for setup
- Reproducible API client generation

## 7) Security Agent

Checklist:
- JWT HS256 secret from env; rotate in non-dev environments
- bcrypt cost parameter reasonable (>= 12 in prod)
- CORS restricted to configured origins
- Rate limit login and view-count
- Validate file uploads (type/size), store outside webroot if serving via backend
- Input validation for all write endpoints
- Avoid leaking internal errors; standard error payload
- Audit critical actions (auth, publish, delete)

## 8) QA Agent

Test Plan:
- API contract tests with mocked SQLite
- Auth flows: login, refresh, logout, RBAC enforcement
- Articles workflow: draft → review → approve/publish → unpublish
- Pagination/sorting/filtering correctness
- Media upload and retrieval
- Frontend e2e critical paths: browse home, open category, open article, search
- CMS CRUD operations and permissions
- Accessibility smoke tests

Acceptance Criteria:
- No P0/P1 defects on core flows
- Contract tests pass against swagger.json
- e2e suite covers main user journeys

## 9) Milestones

- M1: Backend scaffolding, auth, categories/tags, swagger up
- M2: Articles CRUD + workflow, media upload, views
- M3: Public pages API (home sections, related, search), settings/menus/banners/pages
- M4: Frontend public site
- M5: Frontend CMS
- M6: Hardening, QA, docs

## 10) Definitions of Done

- Code reviewed, tested, and documented
- Swagger reflects implemented endpoints accurately
- Frontend uses generated client without type errors
- ENV and run instructions verified on a clean machine
- Accessibility and basic performance targets met