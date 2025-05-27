#!/bin/bash

echo "🚀 RainKoyi Chatbox - Production Deployment"
echo "==========================================="

if [ "$EUID" -ne 0 ] && ! sudo -n true 2>/dev/null; then
    echo "❌ This script needs sudo access for Let's Encrypt certificates"
    echo "Please run: sudo $0 or ensure your user has sudo privileges"
    exit 1
fi

read -p "Enter your domain name (e.g., chat.yourdomain.com): " DOMAIN
read -p "Enter your email for Let's Encrypt: " EMAIL

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "❌ Domain and email are required"
    exit 1
fi

echo ""
echo "🔍 Pre-flight checks..."

if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

if ! command -v certbot &> /dev/null; then
    echo "📦 Installing certbot..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y certbot
        elif command -v yum &> /dev/null; then
            sudo yum install -y certbot
        elif command -v dnf &> /dev/null; then
            sudo dnf install -y certbot
        else
            echo "❌ Cannot install certbot automatically. Please install it manually."
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew &> /dev/null; then
            brew install certbot
        else
            echo "❌ Please install certbot: brew install certbot"
            exit 1
        fi
    fi
fi

echo "🛑 Stopping conflicting services..."
docker-compose down 2>/dev/null || true
sudo systemctl stop nginx 2>/dev/null || true
sudo systemctl stop apache2 2>/dev/null || true
sudo pkill -f nginx 2>/dev/null || true

sleep 3

PORT_80_PID=$(lsof -ti :80 2>/dev/null)
PORT_443_PID=$(lsof -ti :443 2>/dev/null)

if [ -n "$PORT_80_PID" ]; then
    echo "⚠️  Port 80 is still in use (PID: $PORT_80_PID)"
    echo "Attempting to kill process..."
    sudo kill -9 $PORT_80_PID 2>/dev/null || true
    sleep 2
fi

if [ -n "$PORT_443_PID" ]; then
    echo "⚠️  Port 443 is still in use (PID: $PORT_443_PID)"
    echo "Attempting to kill process..."
    sudo kill -9 $PORT_443_PID 2>/dev/null || true
    sleep 2
fi

mkdir -p ssl

echo "🔒 Obtaining Let's Encrypt certificate for $DOMAIN..."
sudo certbot certonly \
    --standalone \
    --preferred-challenges http \
    -d $DOMAIN \
    --email $EMAIL \
    --agree-tos \
    --non-interactive \
    --force-renewal

if [ $? -ne 0 ]; then
    echo "❌ Failed to obtain SSL certificate"
    echo ""
    echo "Common issues:"
    echo "1. Domain doesn't point to this server"
    echo "2. Firewall blocking port 80"
    echo "3. Another service using port 80"
    echo ""
    echo "Please check:"
    echo "  - Domain DNS points to this server's IP"
    echo "  - Firewall allows port 80 and 443"
    echo "  - No other web servers running"
    exit 1
fi

echo "📋 Setting up certificates..."
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*.pem
chmod 644 ssl/cert.pem
chmod 600 ssl/key.pem

if [ -f "nginx.conf" ]; then
    echo "🔧 Updating nginx configuration for domain: $DOMAIN"
    sed -i.bak "s/server_name _;/server_name $DOMAIN;/" nginx.conf
fi

echo "🏗️  Building and starting production container..."
docker-compose build --no-cache
docker-compose up -d

sleep 5

if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "🎉 Production deployment successful!"
    echo ""
    echo "🌐 Your chat is now live at:"
    echo "   • https://$DOMAIN"
    echo ""
    echo "🔒 SSL Certificate Info:"
    echo "   • Issued by: Let's Encrypt"
    echo "   • Valid for: 90 days"
    echo "   • Auto-renewal: Set up cron job (see below)"
    echo ""
    echo "📅 Set up auto-renewal (recommended):"
    echo "   sudo crontab -e"
    echo "   Add: 0 12 * * * /usr/bin/certbot renew --quiet --deploy-hook 'docker-compose restart chatbox'"
    echo ""
    echo "🔍 Useful commands:"
    echo "   • View logs: docker-compose logs -f chatbox"
    echo "   • Restart: docker-compose restart chatbox"
    echo "   • Stop: docker-compose down"
    echo ""
    echo "🛡️  Security:"
    echo "   • HTTPS redirect: Enabled"
    echo "   • Security headers: Enabled"
    echo "   • HTTP/2: Enabled"
    echo ""
    
    echo "🧪 Testing deployment..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L https://$DOMAIN 2>/dev/null || echo "000")
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ HTTPS test: PASSED"
    else
        echo "⚠️  HTTPS test: Response code $HTTP_STATUS"
    fi
    
else
    echo "❌ Container failed to start. Checking logs..."
    docker-compose logs chatbox
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   • Check nginx config: docker-compose exec chatbox nginx -t"
    echo "   • View full logs: docker-compose logs -f chatbox"
    echo "   • Manual restart: docker-compose restart chatbox"
fi
