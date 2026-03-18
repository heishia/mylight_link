# MyLight Link

Feature-based architecture monorepo project.

## Tech Stack

| Layer    | Stack                        |
| -------- | ---------------------------- |
| Frontend | Next.js (App Router) + TypeScript |
| Backend  | 자유 선택 (feature-based 구조)      |
| Database | PostgreSQL                   |
| Infra    | Docker Compose               |

## Quick Start

```bash
# 1. DB 실행
docker compose up -d

# 2. Backend
cd backend
npm install
npm run dev

# 3. Frontend
cd frontend
npm install
npm run dev
```

## Project Structure

```
project/
├── frontend/          # Next.js (App Router)
├── backend/           # API Server (feature-based)
├── database/          # Migrations & Seeds
├── docker-compose.yml
└── .env
```
