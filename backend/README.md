# Backend - NestJS

Feature-based architecture로 구성된 NestJS 백엔드입니다.

## 폴더 구조

```
backend/
├── prisma/
│   └── schema.prisma         # DB 모델 정의
├── src/
│   ├── main.ts               # 서버 엔트리포인트
│   ├── app.module.ts         # 루트 모듈
│   ├── features/
│   │   ├── auth/             # 인증 (JWT 발급, 회원가입, 로그인)
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   └── strategies/
│   │   ├── user/             # 사용자 프로필 관리
│   │   ├── page/             # 링크 페이지 관리
│   │   └── link/             # 링크 CRUD + 순서 변경
│   ├── prisma/               # PrismaService (Global)
│   └── common/               # 공통 유틸 (데코레이터, 필터)
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## 실행

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## 주요 기술스택

| 기술 | 버전 | 용도 |
|------|------|------|
| NestJS | 11 | 백엔드 프레임워크 |
| Prisma | 6 | ORM (PostgreSQL) |
| Passport.js | 0.7 | JWT 인증 |
| class-validator | 0.14 | DTO 검증 |
| bcrypt | 5.1 | 비밀번호 해싱 |
