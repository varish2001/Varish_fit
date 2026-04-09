# AI-Powered Virtual Gym Trainer

A full-stack capstone-level web platform that acts as a virtual personal trainer.

## Tech Stack

- Frontend: React + Vite + TailwindCSS + Framer Motion + Recharts
- Backend: Node.js + Express + MongoDB + JWT
- AI/CV: MediaPipe Pose (browser) + OpenAI API (chatbot)

## Features

- Get Started onboarding (profile capture)
- Personalized workout plan generation
- Diet, macros, and hydration recommendations
- Real-time posture detection and feedback
- AI chatbot for fitness-only guidance
- Dashboard with progress analytics
- Hydration + calorie burn tracking

## Implemented Pages

- Landing Page
- Get Started Profile Page
- Dashboard
- Workout Plan Page
- Diet Plan Page
- Posture Detection Page
- Hydration Tracker
- Progress Analytics Page
- Chatbot Assistant Page

## Project Structure

```txt
varish_fit/
  server/
  client/
```

## Backend Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Environment Variables

See `server/.env.example`.

## API Endpoints

- `POST /api/users/get-started`
- `GET /api/users/me`
- `GET /api/plans/workout`
- `GET /api/plans/diet`
- `POST /api/plans/regenerate`
- `GET /api/tracking/logs`
- `POST /api/tracking/today`
- `POST /api/tracking/water`
- `POST /api/chat`

## Capstone Notes

- Clean layered architecture (`models`, `services`, `controllers`, `routes`, `middleware`, `utils`)
- Modular REST API
- Scalable data schema for future enhancements (rep counting, reports, social features)
- MediaPipe pose analysis in frontend for low-latency posture feedback
