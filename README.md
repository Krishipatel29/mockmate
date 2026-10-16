# MockMate – AI Mock Interview Platform

MockMate is a full-stack MERN application that helps students and freshers practise technical and HR interviews. An AI interviewer generates role-specific questions, evaluates every answer on a 10-point scale, and returns detailed feedback with a model answer. All sessions are saved, and a dashboard tracks progress over time.

**Live demo:** _coming soon_

---

## Features

- **AI-generated interviews** – questions tailored to the selected role (React, Node.js, MERN, Java, Python, Data Analyst, DSA, HR or any custom role), difficulty level and length.
- **Answer-by-answer evaluation** – each answer receives a score, specific feedback and an ideal answer.
- **Progress dashboard** – interview history, average and best scores, and a score-over-time chart.
- **Resilient AI layer** – automatic retries and backup models; if the AI service is unavailable, the app falls back to a curated question bank and keyword-based scoring, and the user can request an AI review later.
- **Secure authentication** – JWT-based login with bcrypt password hashing; users can only access their own interviews.
- **Animated, responsive UI** – dark theme with spotlight effects, typing animations, an animated score ring and smooth page transitions, built with Framer Motion.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React (Vite), React Router, Tailwind CSS, Framer Motion, Recharts, Axios |
| Backend | Node.js, Express, Mongoose, JSON Web Tokens, bcrypt |
| Database | MongoDB (Atlas) |
| AI | Google Gemini API (`@google/genai`) |
| Deployment | Vercel (frontend), Render (backend) |

---

## How It Works

```
React client ──► Express API ──► Gemini API
                     │
                     ▼
                  MongoDB
```

1. The user selects a role, level and number of questions.
2. The backend asks Gemini to generate the questions and stores the interview in MongoDB.
3. The user answers the questions one at a time in the browser.
4. On submission, all answers are sent to Gemini in a **single batch request** and returned as structured JSON (score, feedback, ideal answer).
5. Scores are saved and displayed on the result page and the dashboard.

Only two AI calls are made per interview, which keeps latency and API usage low. The API key stays on the server and is never exposed to the browser.

### Fault tolerance

When the AI service is overloaded (e.g. HTTP 503) the backend:

1. Retries the primary model with exponential back-off, then tries the configured backup models, within a 60-second time budget.
2. If no model responds, serves questions from a built-in question bank and scores answers with a keyword-coverage algorithm, so the interview is never blocked.
3. Marks the result as *basic scoring*; the user can later click **Get AI review** to have the same answers evaluated by the AI.

---

## API Reference

All `/api/interviews` routes require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Log in and receive a JWT |
| POST | `/api/interviews/start` | Generate questions and create an interview |
| POST | `/api/interviews/:id/submit` | Submit answers and receive scores |
| POST | `/api/interviews/:id/review` | Re-evaluate a basic-scored interview with AI |
| GET | `/api/interviews` | List the user's interviews |
| GET | `/api/interviews/:id` | Get a single interview with its results |

---

## Project Structure

```
MockMate/
├── server/
│   ├── server.js                  # App entry: config check, middleware, routes, error handling
│   ├── config/db.js               # MongoDB connection
│   ├── models/                    # User and Interview schemas
│   ├── middleware/auth.js         # JWT verification
│   ├── controllers/               # Auth and interview logic
│   ├── routes/                    # Express routers
│   └── services/
│       ├── aiService.js           # Gemini calls, retries, backup models, fallback scoring
│       └── questionBank.js        # Curated questions and model answers by role
│
└── client/
    └── src/
        ├── api/client.js          # Axios instance with auth interceptor
        ├── context/AuthContext.jsx
        ├── components/            # Navbar, ScoreRing, TypingText, HeroDemo, ...
        └── pages/                 # Landing, Auth, Setup, Interview, Result, Dashboard
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- MongoDB (local instance or a MongoDB Atlas cluster)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com)

### 1. Clone the repository

```bash
git clone https://github.com/Krishipatel29/mockmate.git
cd mockmate
```

### 2. Run the backend

```bash
cd server
npm install
cp .env.example .env    # then fill in your own values
npm run dev
```

The server starts on `http://localhost:5000`.

### 3. Run the frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173` in your browser.

### Environment variables

**server/.env**

| Variable | Description |
|---|---|
| `PORT` | Server port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Primary Gemini model |
| `GEMINI_BACKUP_MODEL` | Comma-separated backup models used when the primary is busy |
| `AI_FALLBACK` | `true` to enable the question bank and basic scoring fallback |
| `CLIENT_URL` | Frontend URL allowed by CORS |
| `AI_MOCK` | `true` to run without calling the AI (development only) |

**client/.env**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL, e.g. `http://localhost:5000/api` |

---

## Deployment

- **Backend (Render):** create a Web Service with root directory `server`, build command `npm install` and start command `npm start`. Add the server environment variables, with `CLIENT_URL` set to the Vercel URL.
- **Frontend (Vercel):** import the repository with root directory `client` and set `VITE_API_URL` to `https://<your-render-service>/api`. The included `vercel.json` handles client-side routing.

---

## Author

**Krishi Patel** – [GitHub](https://github.com/Krishipatel29)
