# UniFlow Queue System

UniFlow Queue System is a university service management platform for queue handling, appointment scheduling, document requests, and admin operations.

## Overview

The project is split into two main parts:

- Frontend: React application for the student, staff, and admin interfaces
- Backend: Spring Boot REST API with JWT authentication, PostgreSQL persistence, and real-time notifications

## Features

- Student login and registration
- Queue management for office services
- Appointment booking and tracking
- Document request workflow
- Staff and admin dashboards
- Recent activity logs
- Notifications and live updates
- Office and service management
- Branding and system configuration

## Tech Stack

### Frontend

- React
- JavaScript
- Tailwind CSS
- Axios
- SockJS

### Backend

- Java 17+
- Spring Boot 3
- Spring Security
- JWT authentication
- Spring Data JPA
- PostgreSQL
- Flyway (project migration support)

## Project Structure

```text
backend-springboot/
  src/
  pom.xml
  mvnw

frontend-react/
  src/
  public/
  package.json
```

## Local Development

### 1. Start the backend

```bash
cd backend-springboot
./mvnw spring-boot:run
```

### 2. Start the frontend

```bash
cd frontend-react
npm install
npm start
```

## Environment Variables

### Backend

Set environment variables such as:

```env
APP_JWT_SECRET=your-secret
APP_JWT_EXPIRATION_MS=86400000
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
SUPABASE_DB_URL=your_database_url
SUPABASE_DB_USERNAME=postgres
SUPABASE_DB_PASSWORD=your_password
```

### Frontend

```env
REACT_APP_API_URL=http://localhost:8081/api
REACT_APP_WEBSOCKET_URL=http://localhost:8081/api/ws
```

## Production Notes

For deployed environments, the backend and frontend should be configured to use the correct Render or hosting domains, with the backend CORS settings explicitly allowing the frontend origin.

### Render deployment checklist

Backend service environment variables:

```env
APP_CORS_ALLOWED_ORIGINS=https://uniflow-queue-system-1.onrender.com,https://uniflow-queue-system.onrender.com
APP_FRONTEND_URL=https://uniflow-queue-system-1.onrender.com
```

Frontend service environment variables:

```env
REACT_APP_API_URL=https://uniflow-queue-system.onrender.com/api
REACT_APP_WEBSOCKET_URL=https://uniflow-queue-system.onrender.com/api/ws
```

After changing environment variables, redeploy the backend first and the frontend second. The frontend build embeds its environment values at build time, so changing them requires a new frontend deploy.

### Production verification

After deployment, check the following in the browser:

- `/api/system/settings` returns successfully
- notifications load without a CORS error
- the `/api/ws` SockJS connection stays connected
- recent activities show formatted local date and time
- the mobile navigation and notification panel fit within the viewport

## Notes

- Recent activity timestamps are shown in a readable formatted date/time style.
- Notification panel is responsive and optimized for smaller screens.
- Admin office cards are designed to present office and service information in a cleaner, more professional layout.

## UI direction

The interface uses a restrained university workspace visual system: Manrope headings, DM Sans body text, indigo navigation accents, soft slate surfaces, and responsive panels designed for repeated operational use. The shared admin, staff, and student shells carry the same visual language so the product feels like one system across roles.

## License

This project is intended for internal institutional use and may be adapted to local project requirements.
