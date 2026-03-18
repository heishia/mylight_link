# Backend

Feature-based architecture. 기술스택은 자유롭게 선택 가능.

## 폴더 구조

```
src/
├── features/          # 기능별 코드 (도메인 단위)
│   ├── auth/          # 인증 (로그인, 회원가입, 토큰)
│   │   ├── controller/   → 요청/응답 처리
│   │   ├── service/      → 비즈니스 로직
│   │   └── repository/   → DB 접근
│   ├── user/          # 사용자 관리
│   └── post/          # 게시글
│
├── middleware/        # 공통 미들웨어 (인증, 에러 처리, 로깅)
├── config/            # 설정 (DB 연결, 환경변수 로드)
├── utils/             # 공통 유틸 함수
└── server.*           # 서버 엔트리포인트
```

## 기술스택 예시

| 언어 | 프레임워크 | 엔트리포인트 | 패키지 관리 |
|------|-----------|-------------|------------|
| TypeScript | Express / Fastify / NestJS | server.ts | package.json |
| Python | FastAPI / Django | server.py | requirements.txt |
| Go | Gin / Echo | main.go | go.mod |
| Java | Spring Boot | Application.java | pom.xml |
