# Agrova AI Farmer Query

Agrova AI Farmer Query is a farmer-friendly AI assistant web app for crop guidance, pest detection, weather insights, market prices, and government schemes.

## Features
- Multilingual experience for Indian farmers
- AI-powered crop and pest guidance
- Weather and market insights
- Government schemes discovery
- Simple dashboard-first experience with no login required

## Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: FastAPI, Python
- Styling and UI: Framer Motion, Lucide Icons, React Router

## Project Structure
- frontend/: React frontend app
- backend/: FastAPI backend app
- docker-compose.yml: optional container setup for local development

## Run Locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Docker
```bash
docker compose up --build
```

## Deploy on Vercel

This repository includes a root `vercel.json` for the two-service deployment:

- `frontend/` is deployed as the Vite web service.
- `backend/` is deployed as the FastAPI web service.
- `/api/*` is routed to FastAPI and all other paths are routed to the React frontend.

In Vercel, import the repository with the repository root as the project root. Add the backend environment variables to the backend service, including `GEMINI_API_KEY`, `OPENWEATHER_API_KEY`, `JWT_SECRET`, and any database settings required by your deployment. The frontend can use the same-origin `/api` path through the included rewrites, so `VITE_API_URL` does not need to be set for this multi-service setup.

## Environment Variables
Create a `.env` file in the project root with values such as:

```env
USE_IN_MEMORY_STORE=true
GEMINI_API_KEY=your_google_gemini_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
JWT_SECRET=your_jwt_secret_key_change_me_to_something_secure
```

## Notes
- The app currently uses an in-memory store for local development.
- API keys are optional for basic local usage, but required for live AI features.
