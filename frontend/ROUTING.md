# Routing & 404 Handling Guide

## SPA Routing Architecture

This application uses **React Router DOM v6** with client-side routing. All routes are handled by the frontend, which means:

- ✅ Navigation via `<Link>` components works perfectly
- ✅ Browser back/forward buttons work
- ⚠️ **Direct URL access or page refresh may cause 404** if server is not configured

## Routes Structure

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/search` - Search results
- `/a/:slug` - Article detail
- `/c/:slug` - Category listing
- `/intro/:slug` - Introduction pages (legacy)
- `/gioi-thieu/:slug` - Introduction pages (new URL)
  - `/gioi-thieu/history` - Lịch sử truyền thống
  - `/gioi-thieu/organization` - Tổ chức đơn vị
  - `/gioi-thieu/leadership` - Lãnh đạo Sư đoàn
  - `/gioi-thieu/achievements` - Thành tích đơn vị
- `/activities` - Activities index
- `/news` - News index
- `/docs` - Documents index
- `/media/videos` - Video gallery
- `/media/photos` - Photo gallery

### Admin Routes (Protected)
- `/admin` - Redirects to `/admin/activities`
- `/admin/articles` - Article management
- `/admin/users` - User management
- `/admin/pages` - Page management
- `/admin/introduction` - Introduction pages admin
- `/admin/banners` - Banner management
- `/admin/media` - Media management
- `/admin/activities` - Activities admin
- `/admin/news` - News admin
- `/admin/docs` - Documents admin

### 404 Handling
- `*` - Any unmatched route shows NotFound page

## Development Server (Vite)

Vite automatically handles SPA routing in development mode. No configuration needed.

```bash
npm run dev
```

All routes work correctly, including:
- Direct URL access: `http://localhost:5173/gioi-thieu/history`
- Page refresh on any route
- Browser back/forward navigation

## Production Deployment

### Problem
When you deploy the built app to a server, **direct URL access or page refresh will return 404** because:

1. Browser requests `/gioi-thieu/history`
2. Server looks for file `gioi-thieu/history/index.html`
3. File doesn't exist → Server returns 404
4. React Router never loads → Can't handle the route

### Solution: Server-Side Rewrite

Configure your server to **rewrite all requests to `index.html`** (except actual files like CSS, JS, images).

---

## Deployment Configuration Examples

### 1. Nginx

Create or edit nginx configuration:

```nginx
server {
    listen 80;
    server_name portal365.com;
    root /var/www/portal-365/frontend/dist;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (if backend on same server)
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SPA fallback - CRITICAL for routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Key line:** `try_files $uri $uri/ /index.html;`

This means:
1. Try to serve the exact file (`$uri`)
2. Try to serve as directory (`$uri/`)
3. **Fallback to `index.html`** if neither exists

---

### 2. Apache (.htaccess)

Create `.htaccess` in the `dist/` folder:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Enable gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/woff2 "access plus 1 year"
</IfModule>
```

---

### 3. Netlify

Create `netlify.toml` in project root:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

Or create `_redirects` file in `public/` folder:

```
/*    /index.html   200
```

---

### 4. Vercel

Create `vercel.json` in project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

### 5. Firebase Hosting

In `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico|woff|woff2)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

### 6. AWS S3 + CloudFront

**S3 Bucket:**
1. Enable static website hosting
2. Set index document: `index.html`
3. Set error document: `index.html` (this is the key!)

**CloudFront Distribution:**
1. Create distribution with S3 origin
2. **Custom Error Responses:**
   - HTTP Error Code: `403` → Response Page: `/index.html` → HTTP Response Code: `200`
   - HTTP Error Code: `404` → Response Page: `/index.html` → HTTP Response Code: `200`

---

## Build & Preview

### Build for Production

```bash
npm run build
```

Output: `dist/` folder

### Preview Production Build Locally

```bash
npm run preview
```

This runs Vite preview server with correct SPA routing. Test all routes:

```bash
# Should all work without 404
http://localhost:4173/
http://localhost:4173/gioi-thieu/history
http://localhost:4173/gioi-thieu/organization
http://localhost:4173/admin
http://localhost:4173/search
```

---

## Testing Checklist

Before deploying, verify:

- [ ] Build completes without errors: `npm run build`
- [ ] Preview works: `npm run preview`
- [ ] All routes load in preview:
  - [ ] Home: `/`
  - [ ] Introduction pages: `/gioi-thieu/history`, `/gioi-thieu/organization`, `/gioi-thieu/leadership`, `/gioi-thieu/achievements`
  - [ ] Activities: `/activities`
  - [ ] News: `/news`
  - [ ] Search: `/search`
  - [ ] Admin: `/admin` (with login)
  - [ ] 404 page: `/non-existent-page`
- [ ] Direct URL access works (copy-paste URL in new tab)
- [ ] Page refresh works on all routes
- [ ] Browser back/forward works
- [ ] Links in NotFound page work

After deploying:

- [ ] Test direct URL access: `https://yourdomain.com/gioi-thieu/history`
- [ ] Test page refresh on sub-routes
- [ ] Test 404 page shows for invalid routes
- [ ] Verify no console errors
- [ ] Check Lighthouse performance score

---

## Common Issues & Solutions

### Issue: Getting 404 on refresh in production

**Cause:** Server not configured to rewrite to index.html

**Solution:** Add server configuration from examples above

### Issue: Works in dev but not production

**Cause:** Vite dev server handles routing automatically, production server doesn't

**Solution:** Configure your hosting platform per examples above

### Issue: CSS/JS files return HTML content

**Cause:** Server is rewriting static assets to index.html

**Solution:** Ensure your rewrite rule checks if file exists first:
- Nginx: `try_files $uri $uri/ /index.html;` (correct)
- Apache: `RewriteCond %{REQUEST_FILENAME} !-f` (correct)

### Issue: Admin routes redirect to home

**Cause:** Route protection redirecting unauthenticated users

**Solution:** This is expected behavior. Login first at `/login`

### Issue: API calls fail with CORS errors

**Cause:** API backend URL not configured or CORS not enabled

**Solution:** 
1. Check `.env` file has correct `VITE_API_BASE_URL`
2. Ensure backend CORS allows your frontend domain
3. For production, use proxy or same domain for API

---

## Environment Variables

Create `.env.production` for production build:

```env
VITE_API_BASE_URL=https://api.portal365.com
```

Or use build-time variables:

```bash
VITE_API_BASE_URL=https://api.portal365.com npm run build
```

---

## SEO Considerations

**Important:** React is a CSR (Client-Side Rendering) framework. Search engines may have difficulty indexing dynamic content.

For better SEO:

1. **Use meta tags** in each page component
2. **Consider SSR** (Next.js) or **SSG** (Vite SSG plugin) for production
3. **Add sitemap.xml** in `public/` folder
4. **Use React Helmet** or `react-helmet-async` for dynamic meta tags

Example with React Helmet:

```tsx
import { Helmet } from 'react-helmet-async';

function IntroductionPage() {
  return (
    <>
      <Helmet>
        <title>Lịch sử truyền thống - Sư đoàn 365</title>
        <meta name="description" content="Tìm hiểu về lịch sử hình thành và phát triển của Sư đoàn Phòng không 365" />
        <meta property="og:title" content="Lịch sử truyền thống - Sư đoàn 365" />
        <meta property="og:description" content="Tìm hiểu về lịch sử hình thành và phát triển" />
      </Helmet>
      {/* Page content */}
    </>
  );
}
```

---

## Summary

✅ **Development:** Works out of the box with Vite

✅ **Production:** Requires server configuration to rewrite all routes to `index.html`

✅ **Key concept:** The server should serve `index.html` for any route that doesn't match a physical file, then React Router takes over and renders the correct component

✅ **Testing:** Always test production build locally with `npm run preview` before deploying
