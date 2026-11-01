# OpenAcademy

Plataforma de matemáticas para primaria, secundaria y pre-universitario:

- **Juegos**: quiz y retos tipo Educaplay / Wordwall.
- **Academia**: cursos por unidades con videos, teoría y ejercicios.
- **Aventura** (próximamente): modo RPG donde se consiguen héroes resolviendo ejercicios.

Autor: **Edgar Chura Humora** ([@EdgarChuraHumora](https://github.com/EdgarChuraHumora)). OpenAcademy es un proyecto independiente.

## Estructura

```
frontend/   React + TypeScript + Vite (PWA, se instala en el celular)
backend/    Node.js + Express + TypeScript (API)
```

**En línea:** https://openacademy-ten.vercel.app

## Desarrollo local

Frontend (http://localhost:5173):

```bash
cd frontend
npm install
npm run dev
```

Backend (http://localhost:3000/api/health):

```bash
cd backend
npm install
npm run dev
```

## Despliegue

- Frontend: Vercel, con **Root Directory** = `frontend`.
- Backend: Render (plan gratuito), con **Root Directory** = `backend`.
