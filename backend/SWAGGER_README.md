# Swagger Documentation Generator

This directory contains scripts to generate Swagger/OpenAPI documentation for the Portal-365 backend API.

## Prerequisites

Install swag CLI tool:

```bash
go install github.com/swaggo/swag/cmd/swag@latest
```

Make sure `$GOPATH/bin` or `$HOME/go/bin` is in your PATH.

## Usage

### Windows (PowerShell)

```powershell
.\gen-swagger.ps1
```

Or with execution policy bypass:

```powershell
powershell -ExecutionPolicy Bypass -File .\gen-swagger.ps1
```

### Windows (Command Prompt)

```cmd
gen-swagger.bat
```

### Linux/Mac (Bash)

```bash
chmod +x gen-swagger.sh
./gen-swagger.sh
```

## Output

The scripts will generate the following files in `docs/swagger/`:

- `docs.go` - Go source file with embedded Swagger spec
- `swagger.json` - OpenAPI spec in JSON format
- `swagger.yaml` - OpenAPI spec in YAML format

## Accessing Swagger UI

After generating the documentation and starting the server:

```
http://localhost:8080/swagger/index.html
```

## Manual Generation

You can also run swag directly:

```bash
cd backend
swag init -g cmd/server/main.go -o docs/swagger --parseDependency --parseInternal
```

## Troubleshooting

### swag: command not found

Make sure you've installed swag and added Go bin directory to PATH:

```bash
# Add to ~/.bashrc or ~/.zshrc (Linux/Mac)
export PATH=$PATH:$(go env GOPATH)/bin

# Add to PowerShell profile (Windows)
$env:PATH += ";$(go env GOPATH)\bin"
```

### Documentation not updating

1. Make sure you've added Swagger annotations to your handlers
2. Re-run the generation script after making changes
3. Restart the backend server to load new documentation

## Swagger Annotations

Example handler with Swagger annotations:

```go
// GetBySlug godoc
// @Summary Get page by slug
// @Description Retrieve a single page by its slug
// @Tags Pages
// @Accept json
// @Produce json
// @Param slug path string true "Page slug"
// @Success 200 {object} dto.SuccessResponse{data=models.Page}
// @Failure 404 {object} dto.ErrorResponse
// @Router /pages/{slug} [get]
func (h *PageHandler) GetBySlug(c *gin.Context) {
    // Implementation...
}
```

## References

- [swag Documentation](https://github.com/swaggo/swag)
- [Declarative Comments Format](https://github.com/swaggo/swag#declarative-comments-format)
- [OpenAPI Specification](https://swagger.io/specification/)
