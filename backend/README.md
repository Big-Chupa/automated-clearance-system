# Automated Clearance System Backend

This backend adds MongoDB persistence, JWT authentication, role authorization, clearance requests, document submissions, administrator document review, notifications, and audit logs behind the existing React interface.

## Setup

1. Install MongoDB locally or create a MongoDB Atlas database.
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI` to your own connection string and set a long random `JWT_SECRET`.
4. Install and seed development accounts:

```powershell
cd backend
npm install
npm run seed
npm run dev
```

The API runs at `http://localhost:5000`.

## MongoDB Atlas

Create a free cluster at MongoDB Atlas, create a database user, add your current IP under Network Access, and copy the Node.js driver connection string. Paste it only into `backend/.env` as `MONGODB_URI`. Use `automated-clearance-system` as the database name in the connection string. Test with `Invoke-RestMethod http://localhost:5000/api/health` after the backend starts.

## Development accounts

These are seed accounts for local testing only:

- Admin: `admin@eksu.edu.ng` / `password123`
- Officer: `bursary@eksu.edu.ng` / `password123`
- Student: `EKSU/CSC/22/0063` / `password123`

Existing MongoDB records are not replaced by the seed command.

## Main API groups

- `POST /api/auth/login`, `/student/login`, `/admin/login`, `/department/login`
- `POST /api/auth/register`, `GET /api/auth/me`, `POST /api/auth/reset-password`
- `GET/POST /api/clearance/requests`
- `POST /api/clearance/requests/:id/documents`
- `GET /api/clearance/documents/my`
- `GET /api/clearance/admin/documents`
- `PUT /api/clearance/admin/documents/:documentId/approve`
- `PUT /api/clearance/admin/documents/:documentId/reject`
- `PUT /api/clearance/documents/:documentId/resubmit`
- `PATCH /api/clearance/requests/:id/status`
- `GET/POST /api/notifications`
- `GET /api/users` and `GET /api/audit-logs` for administrators

The frontend remains in the project root and runs with `npm start`.
