# cestasmart-server

REST API for CestaSmart. It runs beside Tareitas on the same Hetzner server, with its own PostgreSQL database and its own object-storage prefix.

| | Tareitas | CestaSmart |
| --- | --- | --- |
| App path | `/var/www/tareitas-server` | `/var/www/cestasmart-server` |
| API | `https://tareitas.net/api` | `https://cestasmart.com/api` |
| PM2 name | `tareitas-server` | `cestasmart-server` |
| Database | `tareitas` | `cestasmart` |
| Storage prefix | `photos/`, `voice/` | `cestasmart/` |
| Port | `3000` | `3001` |

Nginx on the server should proxy `cestasmart.com/api` and `www.cestasmart.com/api` to `127.0.0.1:3001`. Tareitas stays on port 3000.

## Local

```bash
npm install
npx prisma migrate dev
npm run dev
```

`GET http://localhost:3001/api/health` checks the database.

Without S3 settings, uploaded images are written to `./uploads`. In production, `S3_ENDPOINT`, `S3_BUCKET`, and the access keys are required. Object keys always start with `cestasmart/` (`cestasmart/dish-images/`, `cestasmart/generic-product-images/`). The bucket can be the same Hetzner bucket Tareitas uses.

Set `API_KEY` to require the `x-api-key` header on every route except `/api/health`.

## Data

Tables hold Mercadona and Carrefour categories and products, generic products, dishes, dish products, and prices. Responses use the same snake_case fields the admin sends.
