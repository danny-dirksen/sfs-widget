module.exports = {
  apps : [{
    name: 'app',
    // Run Next directly so PM2 controls the app's Node interpreter, not an npm wrapper.
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    // Reuse the Node executable running this config during deployment.
    // This prevents PM2 from using a different Node version for PM2 vs the application.
    interpreter: process.execPath,
    watch: false
  }],
};
