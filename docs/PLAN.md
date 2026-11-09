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
- [x] Publicar el frontend en Vercel (Root Directory = `frontend`): https://openacademy-ten.vercel.app
- [ ] Probar la instalación PWA en el celular
- [x] Crear proyecto en Supabase; variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `frontend/.env` y en Vercel
- [x] Registro, login, logout y recuperación de contraseña con Supabase Auth (falta configurar el envío de correos para alumnos)
- [x] Tabla `profiles` (nombre, rol, grado, nivel, xp, monedas, racha) con Row Level Security
- [x] Guardar el XP y las partidas al terminar cualquier juego o práctica; XP real en el encabezado y en Perfil; avance de la Academia en la cuenta
- [x] Tabla `games` en Supabase (una sola tabla con `content` en JSON para las 7 plantillas); los juegos publicados se leen desde ahí
- [ ] Pasar los juegos de prueba del código a la tabla (opcional: hoy conviven ambos)
- [x] Soporte de fórmulas con KaTeX en preguntas y respuestas
- [x] Panel docente básico (`/docente`): crear, editar, publicar y borrar quizzes; compartir con enlace o código de 6 letras
- [ ] Editor para las otras 6 plantillas (emparejar, ordenar, V o F, clasificar, dominó, ruleta)
- [x] Solicitud "Soy docente" y pantalla de administración (`/admin`) para aprobar docentes y cambiar roles
- [x] Retroalimentación por pregunta: pista progresiva antes de la solución y explicación del error típico al fallar

## Fase 2: Academia

- [x] Modelo Curso → Unidad → Clase (video de YouTube no listado + teoría + ejemplo resuelto + ejercicios) en `features/academy/`
- [ ] Primer curso completo (temario a definir con Edgar)
  - [x] Álgebra, 1.º de secundaria · Unidad 1: Ecuaciones de primer grado (4 clases + repaso; contenido provisional para que Edgar lo revise)
  - [ ] Grabar los videos y pegar su `videoId` en `features/academy/courses.ts`
- [x] Ejercicios resueltos paso a paso (comprender, planificar, resolver, comprobar)
- [x] Avance del alumno por clase y unidad (por ahora en el navegador, `lib/progress.ts`; pasar a Supabase)
- [x] Práctica de repaso al final de cada unidad
- [ ] Simulaciones de GeoGebra incrustadas en las clases (ver `IDEAS_MATERIALES.md`)
- [ ] Más grados de secundaria y pre-universitario

## Fase 2.5: Laboratorio (materiales virtuales)

- [x] Sección "Laboratorio" con manipulativos interactivos (ver `IDEAS_MATERIALES.md`), empezando por: tiras de fracciones, balanza de ecuaciones y geoplano
  - [x] Página del Laboratorio y balanza de ecuaciones (`/laboratorio/balanza`, 7 ecuaciones de práctica)
  - [x] Tiras de fracciones (`/laboratorio/fracciones`: 7 retos y modo Explorar para comparar)
  - [x] Geoplano (`/laboratorio/geoplano`: 7 retos y modo Libre con área, perímetro y nombre de la figura)

## Fase 3: Más juegos (plantillas tipo Wordwall)

- [x] Emparejar (fórmula ↔ resultado): 3 juegos de prueba en `features/games/match/demoMatches.ts`
- [x] Verdadero o falso contra el tiempo: 2 juegos de prueba en `features/games/truefalse/demoTrueFalse.ts`
- [x] Ordenar los pasos de una resolución: 3 juegos de prueba en `features/games/order/demoOrders.ts`
- [x] Dominó (cadena circular: cada ficha empieza con el resultado de la anterior): 3 juegos de prueba en `features/games/domino/demoDominoes.ts`
- [x] Clasificar (tocar el grupo de cada tarjeta, por ejemplo suceso seguro / probable / imposible)
- [x] Ruleta de ejercicios: 2 juegos de prueba en `features/games/roulette/demoRoulettes.ts`
- [x] Ranking semanal (XP de todos los juegos) y por juego (`/ranking`, función `leaderboard` en Supabase)
- [ ] Ranking por clase (cuando existan las aulas de la Fase 4)

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
