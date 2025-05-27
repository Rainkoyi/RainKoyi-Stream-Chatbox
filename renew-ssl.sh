#!/bin/bash


LOG_FILE="/var/log/chatbox-ssl-renewal.log"
DOMAIN_FILE="/etc/letsencrypt/renewal-hooks/deploy/chatbox-domain.txt"

echo "$(date): Starting SSL certificate renewal check..." >> $LOG_FILE

if /usr/bin/certbot renew --quiet --no-random-sleep-on-renew; then
    echo "$(date): Certificate renewal check completed successfully" >> $LOG_FILE
    
    if [ -f "$DOMAIN_FILE" ]; then
        DOMAIN=$(cat "$DOMAIN_FILE")
        CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
        
        if [ -f "$CERT_PATH/fullchain.pem" ]; then
            SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
            SSL_DIR="$SCRIPT_DIR/ssl"
            
            cp "$CERT_PATH/fullchain.pem" "$SSL_DIR/cert.pem"
            cp "$CERT_PATH/privkey.pem" "$SSL_DIR/key.pem"
            
            chown $(stat -c '%U:%G' "$SSL_DIR") "$SSL_DIR"/*.pem
            chmod 644 "$SSL_DIR/cert.pem"
            chmod 600 "$SSL_DIR/key.pem"
            
            cd "$SCRIPT_DIR"
            if docker-compose restart chatbox; then
                echo "$(date): Container restarted successfully with new certificates" >> $LOG_FILE
            else
                echo "$(date): ERROR: Failed to restart container" >> $LOG_FILE
                exit 1
            fi
        fi
    fi
    
else
    echo "$(date): ERROR: Certificate renewal failed" >> $LOG_FILE
    exit 1
fi

echo "$(date): SSL renewal process completed" >> $LOG_FILE
