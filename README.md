# Vue + Node.js + PostgreSQL JWT Calendar SPA

Vue(Vite) 프론트엔드와 Node.js 백엔드, PostgreSQL을 Docker로 묶은 오프캔버스 기반 SPA 예제입니다.

## 기능

- JWT 로그인 인증
- 사용자별 캘린더 일정 조회
- Offcanvas 메뉴 기반 SPA UI
- PostgreSQL 초기 스키마 + 테스트 계정 3개 자동 삽입
- WSL 환경 개발 지원(Windows + WSL2)

## 구성

- `frontend` : Vue 3 + Vite + Tailwind + TUI Calendar
- `backend` : Node.js 내장 HTTP 서버 + PostgreSQL(psql) + JWT(HMAC)
- `postgres` : PostgreSQL 16

## 빠른 시작 (Docker)

```bash
docker compose up --build -d
```

서비스 접속:

- Frontend: http://localhost:5173
- Backend health: http://localhost:3000/health

종료:

```bash
docker compose down
```

DB를 초기화하고 다시 시작:

```bash
docker compose down -v
docker compose up --build -d
```

## 테스트 계정 (초기 SQL 삽입)

아래 계정은 `backend/sql/init.sql` 에서 자동 생성됩니다.

- `alice / Passw0rd!`
- `bob / Passw0rd!`
- `carol / Passw0rd!`

삽입 SQL:

```sql
INSERT INTO users (username, display_name, password_hash)
VALUES
  ('alice', 'Alice Kim', crypt('Passw0rd!', gen_salt('bf'))),
  ('bob', 'Bob Lee', crypt('Passw0rd!', gen_salt('bf'))),
  ('carol', 'Carol Park', crypt('Passw0rd!', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;
```

> pgcrypto의 `crypt` + `gen_salt('bf')`를 사용해 bcrypt 해시로 저장됩니다.

## WSL 개발 가이드

1. WSL2(Ubuntu)에서 프로젝트를 열고 Docker Desktop의 WSL 통합을 활성화합니다.
2. 아래 명령으로 실행합니다.

```bash
docker compose up --build
```

3. VS Code Remote - WSL 환경에서 수정하면 hot-reload로 즉시 반영됩니다.

## 로컬(비도커) 실행

### 1) frontend

```bash
npm install
npm run dev -- --host
```

### 2) backend

```bash
cd backend
cp .env.example .env
npm run dev
```

PostgreSQL은 별도로 실행한 뒤 `DATABASE_URL`을 맞춰주세요.

## 로그인 API 테스트 예시

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"Passw0rd!"}'
```

토큰으로 일정 조회:

```bash
curl http://localhost:3000/api/calendar/events \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
