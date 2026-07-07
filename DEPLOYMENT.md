# Deployment Guide

This project has two independent deployable units:

| Component | Tech | Location |
|-----------|------|----------|
| **Frontend** | React 19 + Vite 8 | `frontend/` |
| **Backend** | Spring Boot 3.3 + Java 17 | `UPI_Without_Internet-main/` |

Both **must** be deployed for the full demo to work. The frontend calls the backend's REST API.

---

## Table of Contents

1. [Frontend — Vercel (recommended)](#frontend--vercel-recommended)
2. [Frontend — Netlify](#frontend--netlify)
3. [Backend — Railway (recommended)](#backend--railway-recommended)
4. [Backend — Render](#backend--render)
5. [After Deployment: Connect Frontend to Backend](#after-deployment-connect-frontend-to-backend)
6. [Docker (Alternative)](#docker-alternative)
7. [Environment Variables Reference](#environment-variables-reference)

---

## Frontend — Vercel (recommended)

### Prerequisites
- A [Vercel](https://vercel.com) account
- Git repository connected to Vercel (or use Vercel CLI)

### Steps

1. **Import the project** in the Vercel dashboard.
   - Framework preset: **Vite**
   - Root directory: `frontend/`
   - Build command: `npm run build`
   - Output directory: `dist`

2. **(Optional) Environment Variables** — in Vercel dashboard → Settings → Environment Variables:
   | Name | Value |
   |------|-------|
   | `VITE_API_BASE_URL` | Your backend URL (e.g., `https://your-backend.up.railway.app`) |
   | `NODE_VERSION` | `22` (or your preferred LTS) |

3. **Deploy.** Vercel auto-detects the Vite framework and handles SPA routing via the included `vercel.json`.

### What `frontend/vercel.json` does
```json
{
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
This ensures all routes (`/overview`, `/ledger`, etc.) serve `index.html` instead of returning 404.

---

## Frontend — Netlify

### Prerequisites
- A [Netlify](https://netlify.com) account
- Git repository connected to Netlify (or drag-drop the `dist/` folder)

### Steps

1. **Import the project** in the Netlify dashboard.
   - Base directory: `frontend/`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist` (or just `dist` if base is `frontend/`)

2. **(Optional) Environment Variables** — in Netlify dashboard → Site settings → Build & deploy → Environment:
   | Name | Value |
   |------|-------|
   | `VITE_API_BASE_URL` | Your backend URL (e.g., `https://your-backend.up.railway.app`) |

3. **Deploy.** Netlify reads `frontend/netlify.toml` for SPA redirects.

### What `frontend/netlify.toml` does
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
This catches all client-side routes and serves `index.html`.

---

## Backend — Railway (recommended)

### Prerequisites
- A [Railway](https://railway.app) account
- Git repository connected to Railway

### Steps

1. **Create a new project** in Railway.
2. **Deploy from GitHub** → select your repo.
3. **Set root directory** to `UPI_Without_Internet-main/`.
4. Railway auto-detects Spring Boot (Maven) and runs:
   ```bash
   ./mvnw clean package -DskipTests && java -jar target/*.jar
   ```

5. **Set environment variable** (Railway dashboard → Variables):
   | Name | Value |
   |------|-------|
   | `PORT` | `8080` (Railway sets this automatically) |

6. **Deploy.** Railway assigns a `*.up.railway.app` domain.

### Notes
- Railway automatically sets `PORT` to `8080`; the backend reads it from `server.port=${PORT:8080}` in `application.properties`.
- No Dockerfile needed — Railway supports Maven natively.

---

## Backend — Render

### Prerequisites
- A [Render](https://render.com) account
- Git repository connected to Render

### Steps

1. **Create a new Web Service** → connect your repository.
2. **Configure**:
   - Name: `upi-mesh-backend`
   - Runtime: **Java 17** (Render detects `system.properties`)
   - Build command: `./mvnw clean package -DskipTests`
   - Start command: `java -jar target/upi-offline-mesh-0.0.1-SNAPSHOT.jar`
   - Root directory: `UPI_Without_Internet-main/`

3. **Set environment variable** (Render dashboard → Environment):
   | Name | Value |
   |------|-------|
   | `PORT` | `8080` (Render sets this automatically) |

4. **Deploy.** Render assigns a `*.onrender.com` domain.

### What `UPI_Without_Internet-main/system.properties` does
```properties
java.runtime.version=17
```
Tells Render which Java version to use.

---

## After Deployment: Connect Frontend to Backend

Once both are deployed:

1. Note your backend URL (e.g., `https://upi-mesh-backend.up.railway.app`).
2. Set `VITE_API_BASE_URL` to that URL in your frontend hosting platform's environment variables.
3. **Redeploy the frontend** so the build picks up the new variable.
4. The frontend's `apiClient.ts` reads `import.meta.env.VITE_API_BASE_URL` at build time.

### Alternative: Same Domain Proxy
If you host both on the same domain (e.g., backend at `/api` via a reverse proxy), set `VITE_API_BASE_URL=/api` and configure the proxy to forward `/api/*` to the backend. This avoids CORS.

---

## Docker (Alternative)

### Backend Dockerfile

The backend includes a `Dockerfile` in `UPI_Without_Internet-main/`:

```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build and run:

```bash
cd UPI_Without_Internet-main
docker build -t upi-mesh-backend .
docker run -p 8080:8080 upi-mesh-backend
```

---

## Environment Variables Reference

### Frontend (`VITE_*`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | No | `/api` | Backend API root URL. Set to full URL in production. |

### Backend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `8080` | Server port. Railway and Render set this automatically. |
| `SPRING_PROFILES_ACTIVE` | No | — | Spring Boot profile. Not required for default setup. |

> The backend uses H2 in-memory database. Data persists only for the lifetime of the process. In production you'd swap H2 for PostgreSQL.
