#!/bin/sh

set -e

echo "Running Laravel migrations"
echo ""

if [ -f /app/.env ]; then
  if grep -q ^DB_CONNECTION= /app/.env; then
    echo "📦 Awaiting database to be ready..."
    ATTEMPTS_LEFT_TO_REACH_DATABASE=60
    until [ $ATTEMPTS_LEFT_TO_REACH_DATABASE -eq 0 ] || DATABASE_ERROR=$(php artisan tinker --execute="DB::connection()->getPdo(); echo 'Connected';" 2>&1); do
      if [ $? -eq 255 ]; then
        # If the Artisan command exits with 255, an unrecoverable error occurred
        ATTEMPTS_LEFT_TO_REACH_DATABASE=0
        break
      fi

      sleep 1
      ATTEMPTS_LEFT_TO_REACH_DATABASE=$((ATTEMPTS_LEFT_TO_REACH_DATABASE - 1))
      echo "Still waiting for database to be ready... Or maybe the database is not reachable. $ATTEMPTS_LEFT_TO_REACH_DATABASE attempts left."
    done

    if [ $ATTEMPTS_LEFT_TO_REACH_DATABASE -eq 0 ]; then
      echo "The database is not up or not reachable:"
      echo "$DATABASE_ERROR"
      exit 1
    else
      echo "The database is now ready and reachable"
    fi

    if [ "$( find ./database/migrations -iname '*.php' -print -quit )" ]; then
      echo "Running migrations"
      php artisan migrate --force || echo "📦 Migrations failed. Please check manually."
      echo "Migrations ran"
    else
      echo "No migrations to run"
    fi
  fi
fi

echo ""
