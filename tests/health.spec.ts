import { test, expect } from '@playwright/test';

test('octocanvas homepage responds with expected title text', async ({ request }) => {
  const res = await request.get('http://localhost:4321/octocanvas');
  expect(res.status(), 'status should be 200').toBe(200);
  const body = await res.text();
  expect(body).toContain('OCTOCANVAS');
  expect(body).toContain('Collectibles');
});
