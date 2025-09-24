#!/bin/bash

# Docker Test Script for Railway Deployment
echo "🐳 Testing Docker build for Railway deployment..."

# Build Docker image
echo "📦 Building Docker image..."
docker build -t frontend-railway .

if [ $? -eq 0 ]; then
    echo "✅ Docker build successful!"
    
    # Run container
    echo "🚀 Starting container..."
    docker run -d -p 8080:80 --name frontend-test frontend-railway
    
    if [ $? -eq 0 ]; then
        echo "✅ Container started successfully!"
        echo "🌐 App is running at: http://localhost:8080"
        echo "🏥 Health check: http://localhost:8080/health"
        echo ""
        echo "📋 Test these endpoints:"
        echo "  - http://localhost:8080/"
        echo "  - http://localhost:8080/token/btc"
        echo "  - http://localhost:8080/token/eth"
        echo "  - http://localhost:8080/token/xpl"
        echo "  - http://localhost:8080/demo"
        echo ""
        echo "🛑 To stop container: docker stop frontend-test"
        echo "🗑️  To remove container: docker rm frontend-test"
        echo "🗑️  To remove image: docker rmi frontend-railway"
    else
        echo "❌ Failed to start container"
        exit 1
    fi
else
    echo "❌ Docker build failed"
    exit 1
fi
