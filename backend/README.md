# Expense Tracker Backend

This is an Express + MongoDB backend for the Expense Tracker app. It includes basic user auth, transactions, budgets, and a data-driven AI chat endpoint.

Setup

1. Copy `.env.example` to `.env` and fill `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies: `npm install`.
3. Run in dev: `npm run dev` (requires `nodemon`).

Endpoints (summary)
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/transactions
- GET /api/transactions/user/:userId
- POST /api/budgets
- GET /api/budgets/user/:userId
- POST /api/chat/query  - body: { userId, message }

For AI-powered replies configure `OPENAI_API_KEY` in the environment.
