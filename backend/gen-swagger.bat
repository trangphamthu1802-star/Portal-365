@echo off
REM Swagger Documentation Generator Script for Portal-365 Backend (Windows Batch)
REM This script generates Swagger documentation from Go annotations

echo.
echo Generating Swagger documentation...
echo.

REM Check if swag is installed
where swag >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: swag command not found
    echo.
    echo Please install swag first:
    echo   go install github.com/swaggo/swag/cmd/swag@latest
    echo.
    exit /b 1
)

REM Navigate to script directory
cd /d "%~dp0"

REM Generate Swagger documentation
echo Running swag init...
echo.

swag init -g cmd/server/main.go -o docs/swagger --parseDependency --parseInternal

REM Check if generation was successful
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Swagger documentation generated successfully!
    echo.
    echo Output directory: docs/swagger/
    echo Files created:
    echo   - docs/swagger/docs.go
    echo   - docs/swagger/swagger.json
    echo   - docs/swagger/swagger.yaml
    echo.
    echo Access Swagger UI at: http://localhost:8080/swagger/index.html
    echo.
) else (
    echo.
    echo Failed to generate Swagger documentation
    echo.
    exit /b 1
)
