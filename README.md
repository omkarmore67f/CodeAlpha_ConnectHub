# ConnectHub

**Share ideas. Build communities.**

ConnectHub is a production-style social media platform built with React, Vite, TypeScript, Express, MongoDB, JWT authentication, secure cookies, Cloudinary uploads, and a polished responsive interface inspired by modern social products.

## Features

- Secure register, login, logout, persistent sessions, forgot password UI, and password change.
- User profiles with avatar, cover image support, bio, location, website, skills, followers, following, and post counts.
- Posts with rich text, multiple image uploads, edit/delete APIs, likes, comments, shares, bookmarks, copy link, and infinite feed loading.
- Nested comments with edit/delete/like API support.
- Follow and unfollow system with follower/following lists and suggested users.
- Personalized latest, following, and trending feeds.
- Search across users, posts, hashtags, and names.
- Notifications for follows, likes, and comments.
- Settings for profile, privacy/security, logout, and account deletion.
- Admin dashboard with analytics plus user and post management views.

## Architecture

```text
CodeAlpha_ConnectHub
  client/   React 19, Vite, TypeScript, Tailwind CSS, TanStack Query, Zustand
  server/   Node.js, Express, Mongoose, JWT, Cloudinary, security middleware
```

The frontend uses typed API clients, protected routes, reusable UI components, responsive navigation, and query-driven data fetching. The backend is organized around models, controllers, routes, middleware, config, and utilities.

## Installation

```bash
cd CodeAlpha_ConnectHub
npm run install:all
```

Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Fill in MongoDB Atlas, Cloudinary, and JWT values.

## Development

Start the API:

```bash
npm run dev:server
```

Start the client:

```bash
npm run dev:client
```

Frontend: `http://localhost:5173`  
Backend health check: `http://localhost:5000/api/health`

Optional development seed data:

```bash
npm run seed --prefix server
```

Seed users are clearly marked with `@connecthub.dev` emails and `#devseed` posts.

## Environment Variables

| Variable | Used by | Description |
| --- | --- | --- |
| `MONGODB_URI` | server | MongoDB Atlas connection string |
| `JWT_SECRET` | server | Strong secret used to sign JWTs |
| `CLIENT_URL` | server | Allowed frontend origin |
| `CLOUDINARY_CLOUD_NAME` | server | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | server | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | server | Cloudinary API secret |
| `VITE_API_URL` | client | API base URL |

## API Documentation

Base URL: `/api`

- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- `POST /auth/forgot-password`, `PATCH /auth/change-password`
- `GET /users/search`, `GET /users/suggested`, `GET /users/:username`
- `PATCH /users/me`, `DELETE /users/me`
- `POST /users/:userId/follow`, `DELETE /users/:userId/follow`
- `GET /users/:userId/followers`, `GET /users/:userId/following`
- `GET /posts/feed`, `GET /posts/trending`, `GET /posts/bookmarks`
- `POST /posts`, `GET /posts/:postId`, `PATCH /posts/:postId`, `DELETE /posts/:postId`
- `POST /posts/:postId/like`, `POST /posts/:postId/bookmark`, `POST /posts/:postId/share`
- `GET /comments/post/:postId`, `POST /comments/post/:postId`
- `PATCH /comments/:commentId`, `DELETE /comments/:commentId`, `POST /comments/:commentId/like`
- `GET /notifications`, `PATCH /notifications/read`
- `GET /admin/dashboard`, `GET /admin/users`, `GET /admin/posts`

## Deployment

### Frontend: Vercel

1. Import `client` as the project root.
2. Set `VITE_API_URL` to the Render API URL plus `/api`.
3. Build command: `npm run build`.
4. Output directory: `dist`.

### Backend: Render

1. Import `server` as the service root.
2. Build command: `npm install`.
3. Start command: `npm start`.
4. Set all server environment variables from `.env.example`.

### Database and Images

Use MongoDB Atlas for `MONGODB_URI` and Cloudinary for uploaded avatars, covers, and post images.

## Screenshots

Add screenshots of the feed, profile, explore, and settings pages after deployment.

## Future Improvements

- WebSocket-powered notification delivery.
- Full email delivery for password reset tokens.
- Moderation queues and audit logs.
- Full text ranking and recommendation tuning.
- Automated API and Playwright test suites.



