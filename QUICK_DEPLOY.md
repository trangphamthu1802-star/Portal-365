# PORTAL 365 - QUICK DEPLOYMENT GUIDE

## ✅ FIXED ISSUES

1. **CORS Error** - Backend now allows all origins in production
2. **Localhost Hardcoded** - Frontend now uses relative paths
3. **Network Access** - Works with any server IP address

---

## 🚀 QUICK START (5 MINUTES)

### Step 1: Extract (30 seconds)
```
Unzip: portal-365-deploy.zip
Location: C:\portal-365-deploy\
```

### Step 2: Configure (1 minute)
Edit `.env`:
```bash
JWT_SECRET=change-this-secret-min-32-chars
PORT=8080
APP_ENV=production
```

### Step 3: Firewall (1 minute)
```powershell
netsh advfirewall firewall add rule name="Portal365" dir=in action=allow protocol=TCP localport=8080
```

### Step 4: Start (10 seconds)
```
Double-click: start-server.bat
```

### Step 5: Access
```
From any device in network:
http://YOUR-SERVER-IP:8080

Example: http://192.168.6.41:8080
```

---

## 🔐 DEFAULT CREDENTIALS

```
Email: admin@portal365.com
Password: admin123
```
**⚠️ Change immediately after first login!**

---

## 📦 PACKAGE CONTENTS

```
portal-365-deploy/
├── server.exe          ← Backend (CORS fixed)
├── .env                ← Configuration
├── portal.db           ← Database
├── start-server.bat    ← Start script
├── README.txt          ← Full instructions
├── dist/               ← Frontend (API fixed)
└── storage/            ← Media files
```

---

## 🧪 QUICK TEST

### Test 1: From Server
```
http://localhost:8080
```

### Test 2: From Client
```
http://192.168.6.41:8080    ← Replace with your server IP
```

### Test 3: Check API (Browser Console)
```javascript
fetch('/api/v1/healthz')
  .then(r => r.json())
  .then(d => console.log('API Status:', d))
```

Expected: `{ "status": "ok", ... }`

---

## ❓ TROUBLESHOOTING

### Cannot access from other devices?
```powershell
# Check if server is running
netstat -an | findstr 8080

# Check firewall
netsh advfirewall firewall show rule name="Portal365"
```

### Still seeing CORS error?
- Make sure APP_ENV=production in .env
- Restart server.exe

### Database locked?
```powershell
# Kill all instances
taskkill /F /IM server.exe

# Restart
.\server.exe
```

---

## 📚 FULL DOCUMENTATION

See: `DEPLOYMENT_FIX_GUIDE.md` for detailed technical info

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Extracted files
- [ ] Edited .env
- [ ] Opened firewall port
- [ ] Started server
- [ ] Tested localhost access
- [ ] Tested network access
- [ ] Changed admin password

---

## 🎯 WHAT WAS FIXED

### Backend (server.exe)
- CORS config allows all origins when APP_ENV=production
- File: `cmd/server/main.go`

### Frontend (dist/)
- API calls use relative paths `/api/v1` instead of `http://localhost:8080/api/v1`
- Automatically works with any server IP
- Files: `apiClient.ts`, `useApi.ts`, `http.ts`, `client.ts`

### Result
✅ Works with any server IP: 192.168.x.x, 10.0.x.x, etc.
✅ No CORS errors
✅ No hardcoded localhost
✅ Ready for production deployment

---

**Package Location:** `C:\Users\Admin\portal-365\portal-365-deploy.zip`
**Size:** 60.74 MB
**Ready to Deploy:** YES ✅
