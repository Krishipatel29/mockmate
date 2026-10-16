# MockMate – AI Mock Interview App

MockMate ek full stack (MERN) web app hai jismein user kisi bhi role ka mock interview deta hai. AI interviewer questions banata hai, user answers likhta hai, aur AI har answer ko 10 mein se score karke feedback aur ideal answer deta hai. Saare interviews save hote hain aur dashboard par progress graph dikhta hai.

**Tech stack:** React (Vite), Tailwind CSS, Framer Motion, Recharts, Node.js, Express, MongoDB (Mongoose), JWT, Gemini API

---

## 1. Folder structure

```
MockMate/
├── server/                     ← Backend (Node + Express)
│   ├── server.js               ← Entry point: DB connect, routes, error handling
│   ├── config/db.js            ← MongoDB connection
│   ├── models/
│   │   ├── User.js             ← User ka schema
│   │   └── Interview.js        ← Interview + questions ka schema
│   ├── middleware/auth.js      ← JWT token check (protected routes)
│   ├── controllers/
│   │   ├── authController.js       ← signup, login
│   │   └── interviewController.js  ← start, submit, list, get
│   ├── routes/                 ← URL ko controller se jodna
│   ├── services/aiService.js   ← Gemini AI call + retry + backup models + Plan B scoring
│   ├── services/questionBank.js ← Plan B: role-wise practice questions + ideal answers
│   └── .env.example
│
└── client/                     ← Frontend (React)
    └── src/
        ├── main.jsx            ← App start, Router, AuthProvider
        ├── App.jsx             ← Saare routes + page transition
        ├── index.css           ← Colors, fonts, button styles
        ├── api/client.js       ← Axios (token apne aap lagta hai)
        ├── context/AuthContext.jsx  ← Login user ki info
        ├── utils/score.js      ← Score ka rang aur label
        ├── components/         ← Navbar, HeroDemo, ScoreRing, TypingText...
        └── pages/              ← Landing, AuthPage, Setup, Interview, Result, Dashboard
```

## 2. Backend APIs

| Method | URL | Kaam | Login chahiye? |
|---|---|---|---|
| POST | `/api/auth/signup` | Naya account | Nahi |
| POST | `/api/auth/login` | Login, token milta hai | Nahi |
| POST | `/api/interviews/start` | AI se questions banwana | Haan |
| POST | `/api/interviews/:id/submit` | Answers bhejna, AI se score | Haan |
| GET | `/api/interviews` | Dashboard list | Haan |
| GET | `/api/interviews/:id` | Ek interview / result | Haan |
| POST | `/api/interviews/:id/review` | Basic score wale interview ko AI se dobara check karwana | Haan |

**AI sirf 2 baar call hota hai:** ek baar questions banane ke liye, ek baar saare answers ek saath check karne ke liye. Isse free API limit bachti hai.

**AI busy ho to kya hota hai (Plan B):**
1. Main model ko 3 baar try (beech mein 2s, 4s ka wait), phir backup models (`GEMINI_BACKUP_MODEL`) try hote hain. Sab milake max ~60 second.
2. Phir bhi jawab na mile to app rukti nahi: questions **practice question bank** se aate hain, aur answers **basic scoring** se check hote hain (answer kitna complete hai + ideal answer ke kitne key points cover kiye).
3. Result page par **"Get AI review"** button aata hai. AI free hone par wahi answers AI se dobara check ho jaate hain.

---

## 3. Pehli baar setup (ek hi baar karna hai)

### Step A: MongoDB Atlas
1. mongodb.com/atlas par login karo → **Create** → free (M0) cluster banao.
2. **Database Access** → ek user banao (username + password yaad rakho).
3. **Network Access** → **Add IP Address** → "Allow access from anywhere" (0.0.0.0/0).
4. **Connect** → **Drivers** → connection string copy karo. Usmein `<password>` ki jagah apna password daalo, aur `.net/` ke baad `mockmate` likho.

### Step B: Gemini API key
1. aistudio.google.com → **Get API key** → **Create API key**.
2. Key copy karo. Ye key kisi ko mat dena, GitHub par mat daalna.

### Step C: Backend chalao
```bash
cd server
npm install
```
`server/.env.example` ki copy banao, naam `.env` rakho, aur apni values bharo (MONGO_URI, JWT_SECRET, GEMINI_API_KEY). Phir:
```bash
npm run dev
```
Terminal mein `MongoDB connected` aur `Server running on http://localhost:5000` aana chahiye.

### Step D: Frontend chalao (naya terminal)
```bash
cd client
npm install
```
`client/.env.example` ki copy banao, naam `.env` rakho. Phir:
```bash
npm run dev
```
Browser mein `http://localhost:5173` kholo. 🎉

---

## 4. Problems aayein to

| Problem | Kya karo |
|---|---|
| `Missing in .env file: ...` | `server/.env` mein wo value bharo |
| `MongoDB connection failed` | MONGO_URI ka password check karo, Atlas mein Network Access 0.0.0.0/0 hai ya nahi |
| Terminal mein `503 high demand` | Google ke server par rush hai. App Plan B se chalti rahegi; baad mein "Get AI review" dabao |
| Terminal mein `404 ... model ... no longer available` | `.env` mein `GEMINI_MODEL` ko error message mein bataye gaye model ke naam se badlo, phir backend restart |
| Terminal mein `400 / 403 API key` | `.env` mein `GEMINI_API_KEY` dobara check karo (aage-peeche space nahi) |
| "Cannot reach the server" | Backend wala terminal chal raha hai ya nahi dekho |

**Testing mode:** `server/.env` mein `AI_MOCK=true` karoge to bina AI key ke nakli questions aur score aayenge (sirf testing ke liye). Real use mein `false` rakhna.

---

## 5. Live karna (deploy)

- **Backend → Render.com:** New Web Service → root folder `server` → build `npm install` → start `npm start` → `.env` wali saari values Environment mein daalo (CLIENT_URL mein Vercel wala link).
- **Frontend → Vercel:** root folder `client` → Environment mein `VITE_API_URL=https://<render-link>/api`. (`vercel.json` already hai, refresh par 404 nahi aayega.)

---

## 6. Resume ke liye points

- Built **MockMate**, an AI-powered mock interview platform using the MERN stack and the Gemini API that generates role-specific questions and scores answers with feedback.
- Designed a two-call AI flow (question generation and batch evaluation) with structured JSON responses, reducing API usage per interview.
- Made the AI layer fault-tolerant with retries, backup models and an offline fallback (practice question bank and keyword-based scoring), so the app keeps working when the AI service is overloaded.
- Implemented JWT authentication, protected REST APIs and per-user data access in Express and MongoDB.
- Built an animated React UI with Framer Motion (typing questions, score ring, page transitions) and a progress dashboard with Recharts.
