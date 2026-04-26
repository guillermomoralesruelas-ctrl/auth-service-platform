# Auth Service Platform (JWT + OAuth2 + API Gateway)

Una plataforma de autenticación desacoplada basada en microservicios, capaz de gestionar identidad, autorización y sesiones para múltiples aplicaciones cliente. Implementada con Node.js, NestJS, Next.js, Redis, y PostgreSQL.

## 🚀 Arquitectura
El sistema se compone de una arquitectura orientada a microservicios:

```text
[ Frontend (Next.js) ] 
        │
        ▼
[ API Gateway (NestJS) ]
        │
 ┌──────┴──────┐
 │             │
 ▼             ▼
[Auth Service] [User Service]
 │             │
 ▼             ▼
[Redis Cache]  [PostgreSQL]
```

## ✨ Características Principales
- **API Gateway**: Proxy inverso centralizado que enruta el tráfico usando `http-proxy-middleware`. Incluye rate-limiting global (100 req/min) y validación temprana de JWT.
- **Autenticación (Auth Service)**: 
  - Inicio de sesión por Email/Contraseña con hash de `bcrypt`.
  - Autenticación segura mediante Google OAuth2.
  - Gestión de sesiones utilizando `access_token` (15 min) y `refresh_token` (7 días almacenados en Redis para revocación inmediata).
- **Gestión de Usuarios (User Service)**: CRUD completo protegido por Roles (`USER`, `ADMIN`).
- **Frontend Moderno (Next.js)**: UI asombrosa construida con Tailwind CSS v4, implementando técnicas de diseño Glassmorphism, y protección de rutas a través de middlewares de Next.js.
- **Infraestructura Contenedorizada**: Múltiples Dockerfiles (Multistage builds) listos para su despliegue en entornos productivos como Railway.

## 🛠 Tecnologías Utilizadas
- **Backend**: NestJS (Monorepo), TypeORM, Passport.js, Redis, Swagger.
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS v4, Axios.
- **Infraestructura**: Docker, Docker Compose, PostgreSQL, Redis, Railway.

## 📦 Despliegue en Railway

Para desplegar esta aplicación en Railway:
1. Crea un proyecto en Railway y aprovisiona una base de datos PostgreSQL y una instancia de Redis.
2. Agrega los servicios de backend apuntando a tu repositorio y establece la variable `RAILWAY_DOCKERFILE_PATH` a los diferentes Dockerfiles (`backend/Dockerfile.api-gateway`, etc.).
3. Despliega el Frontend apuntando a la carpeta `frontend/`.
4. ¡Asegúrate de configurar todas las variables de entorno en el panel de Railway!

## 📸 Demo Local
1. Inicia la base de datos y Redis: `docker-compose up -d`
2. Ejecuta el Gateway: `npm run start:dev api-gateway`
3. Ejecuta el Auth Service: `npm run start:dev auth-service`
4. Ejecuta el User Service: `npm run start:dev user-service`
5. Ejecuta el Frontend: `cd frontend && npm run dev`
