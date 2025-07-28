#!/bin/bash -i

echo "Recieved push to main. Deploying..."

echo "Versions:"
npm -v
node -v

APP_DIR=~/sfs-widget
GIT_DIR=$APP_DIR/.git
BRANCH="main"

# Pull the latest code
git --work-tree=$APP_DIR --git-dir=$GIT_DIR checkout -f $BRANCH

# Install dependencies
rm -r .next

cd $APP_DIR
npm ci

# Run tests/build
npm run test
npm run build

# Restart the application
pm2 restart app