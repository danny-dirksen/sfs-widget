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
cd $APP_DIR
npm i --no-save || {
  echo "Failed to install dependencies. Exiting."
  exit 1
}
# Run tests/build
npm run test || {
  echo "Tests failed. Exiting."
  exit 1
}

mv .next .next.old
npm run build || {
  echo "Build failed. Reverting to previous build."
  mv .next.old .next
  exit 1
}
rm -r .next.old

# Restart the application
pm2 restart app