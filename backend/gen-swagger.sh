#!/bin/bash

# Swagger Documentation Generator Script for Portal-365 Backend
# This script generates Swagger documentation from Go annotations

echo "🔄 Generating Swagger documentation..."

# Check if swag is installed
if ! command -v swag &> /dev/null
then
    echo "❌ Error: swag command not found"
    echo "📦 Please install swag first:"
    echo "   go install github.com/swaggo/swag/cmd/swag@latest"
    exit 1
fi

# Navigate to backend directory (if not already there)
cd "$(dirname "$0")" || exit 1

# Generate Swagger documentation
swag init \
    -g cmd/server/main.go \
    -o docs/swagger \
    --parseDependency \
    --parseInternal

# Check if generation was successful
if [ $? -eq 0 ]; then
    echo "✅ Swagger documentation generated successfully!"
    echo "📁 Output directory: docs/swagger/"
    echo "📄 Files created:"
    echo "   - docs/swagger/docs.go"
    echo "   - docs/swagger/swagger.json"
    echo "   - docs/swagger/swagger.yaml"
    echo ""
    echo "🌐 Access Swagger UI at: http://localhost:8080/swagger/index.html"
else
    echo "❌ Failed to generate Swagger documentation"
    exit 1
fi
