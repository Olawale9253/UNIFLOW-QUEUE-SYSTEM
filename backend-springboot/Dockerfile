version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: uniflow-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: uniflow_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - uniflow-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend-springboot
      dockerfile: Dockerfile
    container_name: uniflow-backend
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/uniflow_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend-springboot/logs:/app/logs
    networks:
      - uniflow-network

  frontend:
    build:
      context: ./frontend-react
      dockerfile: Dockerfile
    container_name: uniflow-frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:8080/api
      REACT_APP_WEBSOCKET_URL: ws://localhost:8080/ws
    depends_on:
      - backend
    networks:
      - uniflow-network

volumes:
  postgres_data:

networks:
  uniflow-network:
    driver: bridge
