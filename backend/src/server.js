import http from 'node:http';
import crypto from 'node:crypto';
import { runQuery, sql } from './db.js';

const port = Number(process.env.PORT || 3000);
const jwtSecret = process.env.JWT_SECRET || 'change-me-secret';
const allowedOrigin = process.env.CORS_ORIGIN || '*';

function toBase64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signJwt(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const body = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', jwtSecret)
    .update(body)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${body}.${signature}`;
}

function verifyJwt(token) {
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) {
    return null;
  }
  const expected = crypto
    .createHmac('sha256', jwtSecret)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expected) {
    return null;
  }

  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (Date.now() / 1000 > data.exp) {
    return null;
  }
  return data;
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  });
  res.end(JSON.stringify(body));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('invalid_json'));
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (req.url === '/health' && req.method === 'GET') {
    try {
      await runQuery('SELECT 1;');
      sendJson(res, 200, { status: 'ok' });
    } catch {
      sendJson(res, 500, { status: 'db_error' });
    }
    return;
  }

  if (req.url === '/api/auth/login' && req.method === 'POST') {
    try {
      const { username, password } = await parseBody(req);
      if (!username || !password) {
        sendJson(res, 400, { message: 'username 과 password 는 필수입니다.' });
        return;
      }

      const result = await runQuery(sql`
        SELECT id, username, display_name
        FROM users
        WHERE username = ${username}
          AND password_hash = crypt(${password}, password_hash)
        LIMIT 1;
      `);

      if (!result) {
        sendJson(res, 401, { message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
        return;
      }

      const [id, loginId, displayName] = result.split('\t');
      const token = signJwt({
        sub: Number(id),
        username: loginId,
        displayName,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
      });

      sendJson(res, 200, {
        token,
        user: { id: Number(id), username: loginId, displayName },
      });
      return;
    } catch {
      sendJson(res, 500, { message: '로그인 처리 중 오류가 발생했습니다.' });
      return;
    }
  }

  if (req.url === '/api/calendar/events' && req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const payload = verifyJwt(token);

    if (!payload) {
      sendJson(res, 401, { message: '토큰이 유효하지 않습니다.' });
      return;
    }

    try {
      const result = await runQuery(sql`
        SELECT id, title, category, start_at::text, end_at::text
        FROM calendar_events
        WHERE user_id = ${payload.sub}
        ORDER BY start_at;
      `);

      const rows = result ? result.split('\n') : [];
      const events = rows.filter(Boolean).map((line) => {
        const [id, title, category, start, end] = line.split('\t');
        return {
          id,
          calendarId: '1',
          title,
          category,
          start,
          end,
        };
      });

      sendJson(res, 200, events);
      return;
    } catch {
      sendJson(res, 500, { message: '캘린더 데이터를 불러오지 못했습니다.' });
      return;
    }
  }

  sendJson(res, 404, { message: 'Not found' });
});

server.listen(port, () => {
  console.log(`Backend API listening on port ${port}`);
});
