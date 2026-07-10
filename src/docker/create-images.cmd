docker build -f Dockerfile.PostgreSQL -t app/postgre-db .

docker build -f Dockerfile.Backend -t app/backend ../backend

docker build -f Dockerfile.Frontend -t app/frontend ../frontend
