# UniFlow Queue System

UniFlow Queue System is a university service management platform for queue handling, appointment scheduling, document requests, and admin operations.

## Overview

The project is split into two main parts:

- Frontend: React application for the student, staff, and admin interfaces
- Backend: Spring Boot REST API with JWT authentication, PostgreSQL persistence, and real-time notifications

## Features

- Student login and registration
- Queue management for office services
- Student appointment booking, cancellation, and status tracking
- Staff office appointment visibility for upcoming student requests
- Appointment confirmation, completion, and cancellation at the scheduled time
- Document request workflow
- Staff and admin dashboards
- Recent activity logs with relative timestamps
- Notifications, polling, and SockJS live updates
- Office and service management
- Branding, school logo, browser title, and system configuration

## Tech Stack

### Frontend

- React 18
- JavaScript
- Tailwind CSS
- Axios
- SockJS and WebSocket support
- React Router

### Backend

- Java 17+
- Spring Boot 3
- Spring Security
- JWT authentication
- Spring Data JPA
- PostgreSQL
- Flyway migration support

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

The frontend is organized around shared contexts and role-specific pages:

- Student pages for queues, appointments, documents, history, and profile management
- Staff pages for office queues, upcoming appointments, documents, activity, and settings
- Admin pages for users, staff, offices, appointments, reports, branding, and activity logs
- Shared authentication, branding, notification, theme, and WebSocket contexts

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

The backend runs on port `8081` with the `/api` context path by default. The frontend development server runs on port `3000`.

### Appointment workflow

1. A student selects an office, service, date, and available time slot.
2. The appointment is created with `PENDING` status and appears in the assigned staff office view.
3. Staff can see all upcoming appointments for their office, but appointment actions remain unavailable until the exact scheduled date and time.
4. At the scheduled time, authorized staff or admins can confirm, complete, or cancel the appointment.
5. Students see status changes through refreshed appointment data and notifications.

Appointment lists refresh in the background without replacing active booking forms with a loading screen.

## Environment Variables

### Backend

Set environment variables such as:

```env
APP_JWT_SECRET=your-secret
APP_JWT_EXPIRATION_MS=86400000
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/uniflow
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password
```

### Frontend

```env
REACT_APP_API_URL=http://localhost:8081/api
REACT_APP_WEBSOCKET_URL=http://localhost:8081/api/ws
```

Do not commit credentials, JWT secrets, database passwords, mail credentials, or service keys. Keep local `application.properties` files outside version control; the backend resources directory already ignores this file.

## Production Notes

For deployed environments, the backend and frontend should be configured to use the correct Render or hosting domains, with the backend CORS settings explicitly allowing the frontend origin.

### Render deployment checklist

Backend service environment variables:

```env
APP_CORS_ALLOWED_ORIGINS=https://uniflow-queue-system-1.onrender.com,https://uniflow-queue-system.onrender.com
APP_FRONTEND_URL=https://uniflow-queue-system-1.onrender.com
SPRING_DATASOURCE_URL=your_production_postgresql_url
SPRING_DATASOURCE_USERNAME=your_production_database_user
SPRING_DATASOURCE_PASSWORD=your_production_database_password
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
- recent activities show correctly formatted relative date and time
- staff can see upcoming student appointments for the assigned office
- staff cannot confirm an appointment before its scheduled date and time
- browser title and school logo load correctly without missing `logo192.png` errors
- the mobile navigation and notification panel fit within the viewport

## Notes

- Recent activity timestamps are shown in a readable relative-time format and account for timezone-less backend timestamps.
- Appointment and notification data refresh in the background while preserving active form input.
- The browser title includes the current page, application name, and unread activity count when applicable.
- The school logo is used as the default browser icon and can be replaced through branding settings.
- Notification panels and appointment views are responsive and optimized for smaller screens.

## UI direction

The interface uses a restrained university workspace visual system: Manrope headings, DM Sans body text, indigo navigation accents, soft slate surfaces, and responsive panels designed for repeated operational use. The shared admin, staff, and student shells carry the same visual language so the product feels like one system across roles.

## License

This project is intended for internal institutional use and may be adapted to local project requirements.
