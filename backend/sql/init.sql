CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(30) NOT NULL DEFAULT 'time',
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO users (username, display_name, password_hash)
VALUES
  ('alice', 'Alice Kim', crypt('Passw0rd!', gen_salt('bf'))),
  ('bob', 'Bob Lee', crypt('Passw0rd!', gen_salt('bf'))),
  ('carol', 'Carol Park', crypt('Passw0rd!', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;

INSERT INTO calendar_events (user_id, title, category, start_at, end_at)
SELECT u.id, e.title, 'time', e.start_at, e.end_at
FROM (
  VALUES
    ('alice', '프로젝트 킥오프', '2026-03-02T10:00:00+09:00'::timestamptz, '2026-03-02T11:00:00+09:00'::timestamptz),
    ('alice', '디자인 리뷰', '2026-03-08T14:00:00+09:00'::timestamptz, '2026-03-08T15:30:00+09:00'::timestamptz),
    ('bob', 'Sprint Planning', '2026-03-04T09:30:00+09:00'::timestamptz, '2026-03-04T11:00:00+09:00'::timestamptz),
    ('carol', '고객 미팅', '2026-03-05T13:00:00+09:00'::timestamptz, '2026-03-05T14:00:00+09:00'::timestamptz)
) AS e(username, title, start_at, end_at)
JOIN users u ON u.username = e.username
WHERE NOT EXISTS (
  SELECT 1 FROM calendar_events ce WHERE ce.user_id = u.id AND ce.title = e.title
);
