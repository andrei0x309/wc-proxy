import { Hono } from "https://deno.land/x/hono@v3.11.12/mod.ts"
import { cors } from "https://deno.land/x/hono@v3.11.12/middleware.ts"

const app = new Hono();

const URL_TO_PROXY = "https://client.warpcast.com"

app.use('/*', cors({
  origin: (origin: string) => (origin.toLocaleLowerCase().includes('://localhost') || 
  origin.toLocaleLowerCase().includes('://fc-app.pages') ) ||
  origin.toLocaleLowerCase().includes('://tun-')
  ? origin : '',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 3600,
}))

app.all('/*', async (c) => {
 const url = new URL(c.req.url);
  const path = url.pathname;
  const method = c.req.method;
  const headers = c.req.headers;
  const body = c.req.body;
  const options = {
    method,
    headers,
    body,
  };
  const response = await fetch(`${URL_TO_PROXY}${path}`, options);
  const data = await response.json();
  return c.json(data);
});

Deno.serve(app.fetch);