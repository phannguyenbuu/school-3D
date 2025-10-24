module.exports = {
  apps: [
    {
      name: 'school3D',
      script: './start-serve-3006.sh', // hoặc script shell bạn cần chạy
      interpreter: '/bin/bash', // dùng bash để chạy shell script
      env: {
        PORT: 3006,
        NODE_ENV: 'production',
        // thêm các biến môi trường khác nếu cần
      },
      autorestart: true,
      watch: false,
    },
    {
      name: 'school3D-SEQ',
      script: './start-serve-3007.sh',
      interpreter: '/bin/bash',
      env: {
        PORT: 3007,
        NODE_ENV: 'production',
      },
      autorestart: true,
      watch: false,
    }
  ],
};
