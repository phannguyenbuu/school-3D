module.exports = {
  apps: [
    {
      name: 'school3D',
      script: './start-serve-3006.sh', // hoặc script shell bạn cần chạy
      interpreter: '/bin/bash', // dùng bash để chạy shell script
      env: {
        PORT: 3006,
        NODE_ENV: 'production',
        HOST:'0.0.0.0',
        DANGEROUSLY_DISABLE_HOST_CHECK:true,
        GENERATE_SOURCEMAP:false,
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
        HOST:'0.0.0.0',
        DANGEROUSLY_DISABLE_HOST_CHECK:true,
        GENERATE_SOURCEMAP:false,
        REACT_APP_ISSEQ:1
      },
      autorestart: true,
      watch: false,
    }
  ],
};
