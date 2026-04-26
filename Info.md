NestJS (backend) + Next.js o React (frontend)
+ Docker + Redis + Deploy en Railway


¡Listo! He superado los inconvenientes iniciales (NestJS 11 y el puerto de Postgres).

¿Qué tenemos hasta ahora? (Fase 1 completada) ✅

Monorepo NestJS creado (backend) con los 3 servicios (auth-service, user-service, api-gateway).
Librerías compartidas configuradas (@app/common y @app/database).
Entidades Base de Datos creadas (User y Role en TypeORM).
Proyecto Next.js 14 creado (frontend) con Tailwind.
Docker Compose levantado con éxito:
PostgreSQL corriendo en puerto 5433 (lo cambié porque el 5432 ya lo tenías ocupado, probablemente por tu XAMPP/PgAdmin local).
Redis corriendo en puerto 6379.
He creado el checklist (task.md) donde iremos marcando el progreso.

¿Estás listo para que pasemos a la Fase 2 (Auth Core)? Aquí configuraré el registro, login, la generación de JWT (Access Tokens) y Refresh Tokens en el auth-service.