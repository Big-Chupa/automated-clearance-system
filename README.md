# EKSU Automated Clearance System

A React-based clearance portal prototype for Ekiti State University (EKSU), with an Express API and MongoDB persistence. The application demonstrates student registration and login, clearance requests, department approvals, document review, notifications, audit logs, and certificate access after required approvals.

## Features

- Role-based student, officer, and administrator views
- Student clearance requests, progress tracking, and supporting document uploads
- Department and administrator review workflows
- Notifications, audit logs, student and department management, and reports
- Certificate preview with print support; academic classification shown is example prototype data, not an official result
- Responsive interface

## Technology

- Frontend: React 18, React Router, and CSS
- Backend: Node.js, Express, and MongoDB via Mongoose
- Authentication: JWT-based API sessions

## Requirements

- Node.js 18 or later and npm
- MongoDB running locally or a MongoDB Atlas database

## Run Locally

### 1. Configure the backend

In PowerShell, from the repository root:

```powershell
Copy-Item backend/.env.example backend/.env
```

Edit `backend/.env` and set `MONGODB_URI` to your database connection string and `JWT_SECRET` to a long, random secret. Keep this file private; it is ignored by Git.

Then install and start the API:

```powershell
cd backend
npm install
npm run dev
```

The API defaults to `http://localhost:5000`. Check that it is running at `http://localhost:5000/api/health`.

### 2. Seed development data

In a second terminal, from the repository root:

```powershell
cd backend
npm run seed
```

The seed script creates or updates development accounts and departments. It sets seeded account passwords to `password123`; use these accounts only in a local development database. Do not run the seed script against production data.

### 3. Start the frontend

In another terminal, from the repository root:

```powershell
npm install
npm start
```

The frontend runs at `http://localhost:3000` and uses `http://localhost:5000` for the API by default. To change the API URL, set `REACT_APP_API_URL` in a root `.env.local` file before starting the frontend.

## Build and Tests

From the repository root:

```powershell
npm run build
npm test
```

Backend dependencies and scripts are managed separately in `backend/`. See [backend/README.md](backend/README.md) for backend setup details and API routes.

## Project Layout

```text
src/                 React application, pages, contexts, styles, and API client
backend/             Express API, MongoDB models, routes, and development seed script
public/              Frontend HTML entry point
```

## Prototype and Security Notes

This repository is an academic demonstration, not a production clearance or academic-records system. Seeded accounts and passwords are for local development only. Configure secrets securely, protect personal data, and complete a security and operational review before any real deployment. Certificate honours classifications are illustrative and are not evidence of official academic results.

## License

Developed as an academic research prototype for a final-year computer science project.