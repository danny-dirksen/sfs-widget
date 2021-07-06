git checkout HEAD
git stash save --keep-index --include-untracked
git reset HEAD
git pull
git stash drop
npm install
npm run build
pm2 restart app
