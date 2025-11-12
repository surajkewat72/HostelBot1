# HostelBot Backend

This backend uses Express + Prisma + MySQL.

Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
2. From `backend` folder install dependencies: `npm install`.
3. Generate prisma client: `npx prisma generate`.
4. Run migrations (or use `prisma migrate dev`): `npx prisma migrate dev --name init`.
5. Seed initial data: `npm run seed`.
6. Start server: `npm run dev` (default port 5000).

API base: `/api`

Endpoints implemented:
- `POST /api/auth/signup` - create student account
- `POST /api/auth/login` - login and receive JWT
- `GET /api/staff` - list staff members
- `GET /api/complaints` - list complaints (protected)
- `POST /api/complaints` - create complaint (protected)
- `PUT /api/complaints/:id/status` - update status (protected)
- `POST /api/complaints/:id/assign` - assign staff (protected)
- `POST /api/complaints/:id/vote` - vote up/down (protected)
- `POST /api/feedback` - submit feedback for resolved complaints (protected)
