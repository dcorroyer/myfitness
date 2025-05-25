#!/bin/sh

set -e

echo "Running Laravel post-build requirements"

# Generate application key if missing
if ! grep -q "^APP_KEY=base64:" .env 2>/dev/null || [ -z "$(grep "^APP_KEY=" .env 2>/dev/null | cut -d'=' -f2)" ]; then
    echo "Generating Laravel application key..."
    php artisan key:generate --force
else
    echo "APP_KEY already exists"
fi

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Build assets
npm run build

echo "Laravel post-build requirements completed" 