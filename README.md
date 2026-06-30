# ElectriShop

ElectriShop is an inquiry-based electronics marketplace. Customers browse products, save items to an inquiry cart, and submit inquiry requests. Sellers contact customers directly by phone or WhatsApp.

## Structure

- `frontend/` — React + Vite + TypeScript + TailwindCSS (deployed on GitHub Pages)
- `backend/` — Express.js + TypeScript + MongoDB + Firebase Admin (deployed on Render)
- `render.yaml` — Render backend service config

## Local Development

```bash
# Frontend
cd frontend
cp .env.example .env   # fill in your Firebase config
npm install
npm run dev

# Backend
cd backend
cp .env.example .env   # fill in MongoDB URI + Firebase service account
npm install
npm run dev
```

## Deployment

- **Frontend**: Push to `main` → GitHub Actions builds and deploys to GitHub Pages
- **Backend**: Connect the `elecrtistore/shop` repo to Render, set env vars via dashboard

## Required Environment Variables

### Frontend (`frontend/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (e.g. `https://your-app.onrender.com/api`) |
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key |
| `ADMIN_EMAILS` | Comma-separated emails for admin role assignment |
