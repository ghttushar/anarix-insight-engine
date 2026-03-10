

## Vercel SPA Routing Fix

The issue is that Vercel serves static files, so when you navigate directly to `/profitability/geo`, Vercel looks for a file at that path instead of serving `index.html` and letting React Router handle the route.

### Fix

Add a `vercel.json` file at the project root with a catch-all rewrite rule that sends all requests to `index.html`.

### File Created

| File | Change |
|------|--------|
| `vercel.json` | Add rewrite rule: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` |

This is the standard fix for all SPAs (React Router, etc.) deployed on Vercel.

