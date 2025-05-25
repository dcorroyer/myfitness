#!/bin/sh

echo "Installing Laravel dependencies"

composer install --no-cache
npm install

echo "Laravel dependencies installed" 