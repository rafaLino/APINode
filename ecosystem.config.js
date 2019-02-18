module.exports = {
  apps: [{
    name: "meat-api",
    script: "./dist/main.js",
    instances: 0,
    exec_mode: "cluster",
    watch: false,
    merge_logs:true,
    env: {
      SERVER_PORT: 3000,
      DB_URL: 'mongodb://localhost/meat-api'

    },
    env_production: {
      SERVER_PORT: 4000,
      DB_URL: 'mongodb://localhost/meat-api',
      NODE_ENV: "production"
    }
  }]
}
