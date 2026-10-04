import assert from 'node:assert/strict';
import test, { after } from 'node:test';

process.env.PORT = '0';
const { default: server } = await import('./app.js');
after(() => server.close());
const get = (path) => fetch(`http://localhost:${server.address().port}/pokemon${path}`);

test('pokemon routes', async () => {
  assert.equal((await (await get('')).json()).length, 809);
  assert.equal((await (await get('/25')).json()).name.english, 'Pikachu');
  assert.deepEqual(await (await get('/25/type')).json(), { type: ['Electric'] });
  assert.equal((await get('/9999')).status, 404);
  assert.equal((await get('/25/constructor')).status, 404);
});
