#!/bin/bash

echo "RainKoyi Chatbox SSL Setup"
echo "=========================="

mkdir -p ssl

echo "Select SSL certificate type:"
echo "1) Self-signed certificate (for development/testing)"
echo "2) Let's Encrypt certificate (for production)"
echo "3) Use existing certificates"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "Generating self-signed certificate..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/key.pem \
            -out ssl/cert.pem \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
        echo "Self-signed certificate generated!"
        ;;
    2)
        read -p "Enter your domain name: " domain
        read -p "Enter your email: " email
        
        echo "Setting up Let's Encrypt certificate for $domain..."
        
        if ! command -v certbot &> /dev/null; then
            echo "Installing certbot..."
            if [[ "$OSTYPE" == "linux-gnu"* ]]; then
                sudo apt-get update && sudo apt-get install -y certbot
            elif [[ "$OSTYPE" == "darwin"* ]]; then
                brew install certbot
            else
                echo "Please install certbot manually for your system"
                exit 1
            fi
        fi
        
        echo "Stopping any running containers..."
        docker-compose down 2>/dev/null || true
        
        sleep 2
        if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo "⚠️  Port 80 is still in use. Please stop the service using it:"
            lsof -Pi :80 -sTCP:LISTEN
            echo ""
            echo "Common commands to free port 80:"
            echo "  sudo systemctl stop nginx"
            echo "  sudo systemctl stop apache2"
            echo "  sudo pkill -f nginx"
            read -p "Press Enter after freeing port 80..."
        fi
        
        echo "Getting Let's Encrypt certificate for $domain..."
        sudo certbot certonly --standalone \
            -d $domain \
            --email $email \
            --agree-tos \
            --non-interactive \
            --force-renewal
        
        sudo cp /etc/letsencrypt/live/$domain/fullchain.pem ssl/cert.pem
        sudo cp /etc/letsencrypt/live/$domain/privkey.pem ssl/key.pem
        sudo chown $USER:$USER ssl/*.pem
        
        echo "Let's Encrypt certificate installed!"
        echo "Note: Set up auto-renewal with: sudo crontab -e"
        echo "Add: 0 12 * * * /usr/bin/certbot renew --quiet"
        ;;
    3)
        echo "Place your certificate files in the ssl/ directory:"
        echo "  - ssl/cert.pem (certificate file)"
        echo "  - ssl/key.pem (private key file)"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

chmod 600 ssl/key.pem 2>/dev/null || true
chmod 644 ssl/cert.pem 2>/dev/null || true

echo ""
echo "SSL setup complete!"
echo "You can now run: docker-compose up -d"
