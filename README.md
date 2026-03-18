# MyLight Link

Linktree 스타일의 링크 관리 SaaS 서비스입니다.

## Tech Stack

| Layer    | Stack                              |
| -------- | ---------------------------------- |
| Frontend | Next.js 15 (App Router) + Tailwind CSS v4 |
| Backend  | NestJS 11 (feature-based)          |
| ORM      | Prisma 6                           |
| Database | PostgreSQL 16                      |
| Auth     | JWT (Passport.js)                  |
| Infra    | Docker Compose                     |

## Quick Start

```bash
# 1. DB 실행
docker compose up -d

# 2. Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev

# 3. Frontend (새 터미널)
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api

## Project Structure

```
project/
├── frontend/                  # Next.js (App Router)
│   └── src/
│       ├── app/
│       │   ├── page.tsx              # 랜딩 페이지
│       │   ├── login/                # 로그인
│       │   ├── register/             # 회원가입
│       │   ├── dashboard/            # 대시보드 (링크 관리, 설정)
│       │   └── [slug]/               # 퍼블릭 링크 페이지
│       ├── components/               # 공통 컴포넌트
│       ├── hooks/                    # 커스텀 훅
│       └── lib/                      # 유틸, API 클라이언트
├── backend/                   # NestJS (feature-based)
│   ├── prisma/schema.prisma          # DB 스키마
│   └── src/
│       ├── features/
│       │   ├── auth/                 # 인증 (JWT)
│       │   ├── user/                 # 사용자 관리
│       │   ├── page/                 # 페이지 관리
│       │   └── link/                 # 링크 CRUD
│       ├── prisma/                   # Prisma 서비스
│       └── common/                   # 공통 유틸
├── docker-compose.yml
└── .env
```

## API Endpoints

| Method | Path                | Description         | Auth |
| ------ | ------------------- | ------------------- | ---- |
| POST   | /api/auth/register  | 회원가입            | -    |
| POST   | /api/auth/login     | 로그인              | -    |
| GET    | /api/auth/me        | 내 정보 조회        | JWT  |
| PATCH  | /api/users/me       | 프로필 수정         | JWT  |
| GET    | /api/pages/me       | 내 페이지 조회      | JWT  |
| PATCH  | /api/pages/me       | 페이지 수정         | JWT  |
| GET    | /api/pages/:slug    | 퍼블릭 페이지 조회  | -    |
| GET    | /api/links          | 내 링크 목록        | JWT  |
| POST   | /api/links          | 링크 추가           | JWT  |
| PATCH  | /api/links/reorder  | 링크 순서 변경      | JWT  |
| PATCH  | /api/links/:id      | 링크 수정           | JWT  |
| DELETE | /api/links/:id      | 링크 삭제           | JWT  |

## Environment Variables

`.env` 파일을 프로젝트 루트에 생성하세요:

```env
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=mylight_link
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mylight_link
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```
