/**
 * Boots the Express app without a database and checks the parts that must work
 * before any data exists: route wiring, auth guards, validation, CORS and the
 * 404/error handlers.
 *
 *   node src/test/smoke.js
 */
import 'dotenv/config';
import app from '../app.js';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-for-smoke-run';

let pass = 0;
let fail = 0;

function check(name, condition, detail = '') {
  if (condition) {
    pass += 1;
    console.log(`  ok   ${name}`);
  } else {
    fail += 1;
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

const server = app.listen(0);
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;

const call = async (path, init) => {
  const res = await fetch(`${base}${path}`, init);
  let body = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON response */
  }
  return { status: res.status, body, headers: res.headers };
};

try {
  console.log('\nHealth and headers');
  const health = await call('/api/health');
  check('health responds 200', health.status === 200, `got ${health.status}`);
  check('health reports ok', health.body?.ok === true);
  check('x-powered-by is suppressed', !health.headers.get('x-powered-by'));
  check('helmet sets nosniff', health.headers.get('x-content-type-options') === 'nosniff');

  console.log('\nUnknown routes');
  const missing = await call('/api/does-not-exist');
  check('unknown API route returns 404', missing.status === 404, `got ${missing.status}`);
  check('404 carries a readable message', typeof missing.body?.message === 'string');

  console.log('\nAuth guards on every admin surface');
  const guarded = [
    ['GET', '/api/education/all'],
    ['POST', '/api/education'],
    ['PATCH', '/api/education/reorder'],
    ['DELETE', '/api/education/000000000000000000000000'],
    ['GET', '/api/experience/all'],
    ['GET', '/api/expertise/all'],
    ['GET', '/api/awards/all'],
    ['GET', '/api/publications/all'],
    ['GET', '/api/workshops/all'],
    ['GET', '/api/gallery/all'],
    ['POST', '/api/upload/image'],
    ['GET', '/api/stats'],
    ['GET', '/api/auth/me'],
  ];
  for (const [method, path] of guarded) {
    const res = await call(path, { method, headers: { 'Content-Type': 'application/json' }, body: method === 'GET' || method === 'DELETE' ? undefined : '{}' });
    check(`${method} ${path} rejects anonymous callers`, res.status === 401, `got ${res.status}`);
  }

  console.log('\nSingleton writes are protected, reads are public');
  for (const path of ['/api/profile', '/api/contact', '/api/settings']) {
    const write = await call(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'nope' }),
    });
    check(`PUT ${path} rejects anonymous callers`, write.status === 401, `got ${write.status}`);
  }

  console.log('\nA forged token is refused');
  const forged = await call('/api/stats', { headers: { Authorization: 'Bearer not.a.real.token' } });
  check('garbage bearer token returns 401', forged.status === 401, `got ${forged.status}`);

  console.log('\nLogin validation');
  const badEmail = await call('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email', password: 'x' }),
  });
  check('invalid email returns 400', badEmail.status === 400, `got ${badEmail.status}`);
  check('validation lists the offending field', Array.isArray(badEmail.body?.details));

  const noPassword = await call('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.com' }),
  });
  check('missing password returns 400', noPassword.status === 400, `got ${noPassword.status}`);

  console.log('\nCORS allowlist');
  const disallowed = await call('/api/health', { headers: { Origin: 'https://evil.example.com' } });
  check('a foreign origin is not echoed back', !disallowed.headers.get('access-control-allow-origin'));

  console.log('\nPublic reads reach the database layer (a DB error, not a routing error)');
  const publicRead = await call('/api/education');
  check('GET /api/education is routed, not 404', publicRead.status !== 404, `got ${publicRead.status}`);
} catch (err) {
  fail += 1;
  console.error('\nThe smoke run threw:', err);
} finally {
  server.close();
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
