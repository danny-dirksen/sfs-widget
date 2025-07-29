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

# Run tests. If tests fail, exit without building.
npm run test
TEST_EXIT_CODE=$?
if [ $TEST_EXIT_CODE -ne 0 ]; then
  echo "Tests failed with exit code $TEST_EXIT_CODE. Exiting."
  exit 1
fi

# Build the application. If the build fails, revert to the previous build.
mv .next .next.old
npm run build
BUILD_EXIT_CODE=$?
if [ $BUILD_EXIT_CODE -ne 0 ]; then
  echo "Build failed with exit code $BUILD_EXIT_CODE. Reverting to previous build."
  mv .next.old .next || {
    echo "Failed to revert to previous build. Exiting."
    exit 1
  }
fi
rm -r .next.old

# Restart the application regardless of the build status
pm2 restart app