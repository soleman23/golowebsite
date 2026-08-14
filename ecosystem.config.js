/**
 * PM2 process config for the GoLo website.
 * Start:   pm2 start ecosystem.config.js
 * Reload:  pm2 reload ecosystem.config.js --update-env   (zero-downtime)
 *
 * `cwd` assumes the repo lives at /var/www/golowebsite (as in the deploy guide).
 * Change it if you cloned elsewhere.
 */
module.exports = {
  apps: [
    {
      name: "golo",
      cwd: "/var/www/golowebsite",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "500M",
    },
  ],
};
