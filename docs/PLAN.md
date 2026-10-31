# Hoja de ruta de OpenAcademy

Marca cada casilla al terminarla y haz commit de este archivo para que el progreso quede registrado.

## Hecho

- [x] Estructura `frontend/` (React + TS + Vite + PWA) y `backend/` (Express + TS)
- [x] Diseño de marca OpenAcademy con la mascota Opi, responsive (celular y escritorio)
- [x] Pantallas: Inicio, Juegos (filtro Primaria/Secundaria), Quiz (feedback, estrellas, XP), Academia (cursos bloqueados), Perfil, Login (solo visual)
- [x] 4 quizzes de prueba en `frontend/src/features/games/quiz/demoQuizzes.ts`

## Ahora: Fase 1, MVP publicado

- [x] Subir a GitHub `EdgarChuraHumora/openacademy`
- [x] Footer con "© OpenAcademy · Creado por Edgar Chura Humora" y `author` en los package.json
- [ ] Publicar el frontend en Vercel (Root Directory = `frontend`) y probar la instalación PWA en el celular
- [ ] Crear proyecto en Supabase; variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `frontend/.env` y en Vercel
- [ ] Registro, login, logout y recuperación de contraseña con Supabase Auth; rutas protegidas
- [ ] Tabla `profiles` (nombre, rol, grado, nivel, xp, monedas, racha) con Row Level Security
- [ ] Guardar el XP y las partidas al terminar un quiz; mostrar el XP real en el encabezado y en Perfil
- [ ] Mover los quizzes de prueba a tablas (`games`, `questions`) y leerlos desde Supabase
- [ ] Soporte de fórmulas con KaTeX en preguntas y respuestas
- [ ] Panel docente básico: crear, editar y publicar un quiz, y compartirlo con enlace o código
- [ ] Retroalimentación por pregunta: pista progresiva antes de la solución y explicación del error típico al fallar

## Fase 2: Academia

- [ ] Modelo Curso → Unidad → Clase (video de YouTube no listado + teoría + ejercicios)
- [ ] Primer curso completo (temario a definir con Edgar)
- [ ] Ejercicios resueltos paso a paso (comprender, planificar, resolver, comprobar)
- [ ] Avance del alumno por clase y unidad
- [ ] Práctica de repaso al final de cada unidad
- [ ] Simulaciones de GeoGebra incrustadas en las clases (ver `IDEAS_MATERIALES.md`)
- [ ] Más grados de secundaria y pre-universitario

## Fase 2.5: Laboratorio (materiales virtuales)

- [x] Sección "Laboratorio" con manipulativos interactivos (ver `IDEAS_MATERIALES.md`), empezando por: tiras de fracciones, balanza de ecuaciones y geoplano
  - [x] Página del Laboratorio y balanza de ecuaciones (`/laboratorio/balanza`, 7 ecuaciones de práctica)
  - [x] Tiras de fracciones (`/laboratorio/fracciones`: 7 retos y modo Explorar para comparar)
  - [x] Geoplano (`/laboratorio/geoplano`: 7 retos y modo Libre con área, perímetro y nombre de la figura)

## Fase 3: Más juegos (plantillas tipo Wordwall)

- [ ] Emparejar (fórmula ↔ resultado)
- [ ] Verdadero o falso contra el tiempo
- [ ] Ordenar los pasos de una resolución
- [ ] Dominó (emparejar expresión ↔ resultado)
- [ ] Clasificar (arrastrar a grupos, por ejemplo suceso seguro / probable / imposible)
- [ ] Ruleta de ejercicios
- [ ] Ranking por juego y por clase

## Fase 4: Instituciones y docentes

- [ ] Tablas `organizations`, `memberships` (institución, docente, alumno), `classes`
- [ ] El docente asigna juegos y clases a su aula y ve resultados por alumno y competencia
- [ ] Reportes de resultados por alumno y por tema

## Fase 5: Aventura (RPG single player)

- [ ] Héroes por área: Aritmética, Álgebra, Geometría, Estadística y Probabilidad
- [ ] Se desbloquean al dominar temas; se mejoran resolviendo ejercicios del área
- [ ] Combate por turnos donde cada ataque es un ejercicio (Phaser.js)
- [ ] Inventario, monedas y mejoras

## Fase 6: Pagos

- [ ] Planes: gratis, alumno premium, docente, institución
- [ ] Pasarela: Mercado Pago o Culqi (Perú); webhooks en el backend
- [ ] Contenido y límites según el plan
