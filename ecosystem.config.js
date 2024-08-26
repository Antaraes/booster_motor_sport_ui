module.exports = {
  apps: [
    {
      name: 'booster-ui',
      script: 'node_modules/.bin/next',
      args: 'start -p 4000',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
