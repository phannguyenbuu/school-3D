server {
    listen 80;
    server_name admin3d.kvlounge.com;

    location / {
        proxy_pass http://31.97.76.62:5006/;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

