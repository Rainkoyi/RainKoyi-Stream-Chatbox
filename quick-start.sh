#!/bin/bash

echo "🚀 RainKoyi Chatbox Quick Start"
echo "==============================="

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Setup SSL certificates
echo "🔒 Setting up SSL certificates..."
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    ./setup-ssl.sh
else
    echo "✅ SSL certificates already exist"
fi

echo "🏗️  Building and starting container..."
docker-compose up -d --build

echo "⏳ Waiting for container to start..."
sleep 3

# Check if container is running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "🎉 Chat is now running!"
    echo ""
    echo "📱 Access your chat at:"
    echo "   • https://localhost"
    echo "   • https://127.0.0.1"
    echo ""
    echo "🔍 Useful commands:"
    echo "   • View logs: docker-compose logs -f chatbox"
    echo "   • Stop chat: docker-compose down"
    echo "   • Restart: docker-compose restart chatbox"
    echo ""
    echo "⚠️  Browser Security Warning:"
    echo "   If using self-signed certificates, click 'Advanced' → 'Proceed to localhost'"
    echo ""
    
    LOCAL_IP=$(ip route get 1.1.1.1 2>/dev/null | awk '{print $7; exit}' || hostname -I | awk '{print $1}' || echo "Unable to detect")
    if [ "$LOCAL_IP" != "Unable to detect" ]; then
        echo "🌐 Network access (other devices):"
        echo "   • https://$LOCAL_IP"
        echo ""
    fi
    
    read -p "🌍 Open browser now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v xdg-open >/dev/null; then
            xdg-open https://localhost
        elif command -v open >/dev/null; then
            open https://localhost
        else
            echo "Please open https://localhost in your browser"
        fi
    fi
else
    echo "❌ Container failed to start. Check logs:"
    docker-compose logs chatbox
fi
