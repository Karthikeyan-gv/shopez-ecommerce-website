# Deployment Fix TODO

## Goal
Fix SPA routing 404 errors on Render and make the app work in both single-service and two-service deployments.

## Steps
- [x] 0. Analyze project structure and understand deployment issue
- [x] 1. Create `client/public/_redirects` (SPA rewrite rule)
- [x] 2. Create `client/public/404.html` (SPA fallback page)
- [x] 3. Update `client/src/config/index.js` to default API_URL to same-origin
- [x] 4. Update all store slices + image-upload to use `API_URL` from config
- [x] 5. Harden `server/server.js` to serve client build + SPA fallback + filter CORS
- [x] 6. Create optional `render.yaml` blueprint (single service)
- [x] 7. Verify build passes locally
