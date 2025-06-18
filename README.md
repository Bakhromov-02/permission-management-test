# Permissions Microservice

## 🚀 Run locally

```bash
# 1. Install dependencies
npm install

# 2. Copy .env
cp example.env .env

# 3. Start Postgres & NATS
docker-compose up -d postgres nats

# 4. Build & run the service
npm run build && npm start
