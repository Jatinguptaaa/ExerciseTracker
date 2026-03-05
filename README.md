# Exercise Tracker API

Simple Node.js + Express + MongoDB API to manage users and track exercise logs.

## Setup

1. Install dependencies:

	npm install

2. Create a `.env` file:

	MONGO_URI=<your-mongodb-connection-string>
	PORT=3000

3. Run the server:

	npm start

## API Routes

- `POST /api/users` — create a user (`username`)
- `GET /api/users` — list all users
- `POST /api/users/:_id/exercises` — add exercise (`description`, `duration`, optional `date`)
- `GET /api/users/:_id/logs?[from][&to][&limit]` — get exercise log with optional filters
