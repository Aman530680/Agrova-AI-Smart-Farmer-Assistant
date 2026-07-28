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
