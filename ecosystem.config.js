module.exports = {
  apps: [
    {
      name: 'school3D',
      script: 'serve',          // gọi lệnh serve trực tiếp
      args: ['-s', 'build'],    // tham số serve phục vụ thư mục build
      env: {
        PM2_SERVE_PORT: 3006,   // port serve qua biến môi trường PM2
        PM2_SERVE_PATH: 'build',
        PM2_SERVE_SPA: 'true',  // phục vụ SPA, redirect về index.html
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
      script: 'serve',
      args: ['-s', 'build_seq1'],
      env: {
        PM2_SERVE_PORT: 3007,
        PM2_SERVE_PATH: 'build_seq1',
        PM2_SERVE_SPA: 'true',
        NODE_ENV: 'production',
        HOST:'0.0.0.0',
        DANGEROUSLY_DISABLE_HOST_CHECK:true,
        GENERATE_SOURCEMAP:false,
        REACT_APP_ISSEQ:'1'
      },
      autorestart: true,
      watch: false,
    }
  ]
};

