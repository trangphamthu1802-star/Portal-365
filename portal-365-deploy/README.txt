# Portal 365 - Production Deployment

## Quick Start

1. **Extract this package** to your server
2. **Edit .env file** and set your JWT_SECRET
3. **Run the server**: 
   - Windows: Double-click \start-server.bat\ or run \server.exe\
   - Linux: \chmod +x server && ./server\
4. **Access the application**: Open browser and go to \http://YOUR-SERVER-IP:8080\

## What's Included

- \server.exe\ - Backend server (Go binary)
- \dist/\ - Frontend application (React build)
- \storage/\ - Uploaded files (images, videos, documents)
- \portal.db\ - SQLite database with demo data
- \.env\ - Configuration file

## Configuration (.env)

Edit the \.env\ file to configure:

\\\
PORT=8080                    # Server port
APP_ENV=production          # Environment
JWT_SECRET=CHANGE-THIS      # ⚠️ IMPORTANT: Change this!
ACCESS_TOKEN_TTL=15m        # Access token lifetime
REFRESH_TOKEN_TTL=720h      # Refresh token lifetime
\\\

## Default Admin Account

- Email: \dmin@portal365.com\
- Password: \dmin123\

⚠️ **Change the password immediately after first login!**

## Network Access

The application will be accessible from any device on your network at:
- \http://YOUR-SERVER-IP:8080\
- Example: \http://192.168.6.41:8080\

## CORS & API

✅ **FIXED**: This version supports access from any client IP address.
- Backend CORS allows all origins in production
- Frontend uses relative API paths (works with any server IP)

## Troubleshooting

### Port already in use
- Change PORT in .env file to another port (e.g., 8081, 8082)

### Cannot access from other devices
- Check firewall settings on server
- Ensure port 8080 is open
- Try: \
etsh advfirewall firewall add rule name="Portal365" dir=in action=allow protocol=TCP localport=8080\

### Database locked error
- Make sure only one instance of server.exe is running
- Check if portal.db file has write permissions

## File Structure

\\\
portal-365-deploy/
├── server.exe              # Backend server
├── .env                    # Configuration
├── portal.db               # Database
├── dist/                   # Frontend files
│   ├── index.html
│   └── assets/
└── storage/                # Uploaded media
    └── uploads/
        ├── articles/
        ├── images/
        ├── videos/
        ├── documents/
        └── banners/
\\\

## Support

For issues or questions, check the logs in console output.
