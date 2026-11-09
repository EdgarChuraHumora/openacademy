# OpenAcademy: instrucciones para Claude

Lee este archivo completo antes de hacer cualquier cambio. Después lee `docs/PLAN.md` (hoja de ruta) y `docs/IDEAS_MATERIALES.md` (ideas de materiales virtuales).

## Sobre el dueño del proyecto

- **Autor:** Edgar Chura Humora (GitHub: `EdgarChuraHumora`). **OpenAcademy es su marca propia**, un proyecto independiente: no pertenece a ningún colegio ni institución.
- Vive en Perú (relevante para pagos y para el contexto de los problemas).
- Sabe teoría de programación pero **nunca ha programado un proyecto real**. Explícale cada paso en español, sencillo y sin jerga innecesaria.
- Quiere que Claude escriba la mayor parte del código. Él revisa, prueba y decide.
- Por ahora todo debe correr **gratis** (hosting y servicios con plan gratuito).
- Responde siempre en **español**.

## Qué es OpenAcademy

Plataforma web de matemáticas, **para computadora y celular** (diseño responsive + PWA instalable), con tres módulos que comparten el mismo usuario y el mismo progreso (XP, monedas, nivel):

| Módulo | Inspiración | Público | Estado |
|---|---|---|---|
| **Juegos** | Educaplay, Wordwall | Primaria y secundaria | 7 plantillas con datos de prueba (quiz, emparejar, ordenar, V o F, clasificar, dominó, ruleta) |
| **Academia** | Academias pre-u (tipo "Cachimbo") | Secundaria (principal) y pre-universitario | Álgebra: unidad 1 (4 clases + repaso); videos pendientes |
| **Aventura** | Hero Wars (single player) | Primaria y secundaria | Solo tarjeta "Pronto" |

La idea central: lo que el alumno aprende en Academia y gana en Juegos (XP, monedas, "fórmulas desbloqueadas") se usa en Aventura para conseguir y mejorar héroes.

### Roles

| Rol | Puede |
|---|---|
| **Superadmin** (Edgar) | Todo: contenido oficial, aprobar docentes, planes |
| **Institución** (colegio, academia, instituto) | Paga suscripción, agrega docentes y alumnos, ve reportes |
| **Docente** | Crea juegos y cursos, los asigna a sus alumnos, ve resultados |
| **Estudiante** | Juega, estudia, sube de nivel |

Los pagos son para más adelante (alumno premium y suscripción docente o institución). Diseña la base de datos pensando en ello desde el inicio.

## Stack (decidido, no cambiar sin consultar)

- **Frontend:** React 19 + TypeScript + Vite + React Router + `vite-plugin-pwa`. **No usar Astro.**
- **Backend:** Node.js + Express + TypeScript (carpeta `backend/`), pequeño al inicio.
- **Base de datos y login:** Supabase (PostgreSQL + Auth + Storage), conectado (proyecto `openacademy`, región São Paulo). Claves en `frontend/.env`.
- **Despliegue:** frontend en Vercel (Root Directory = `frontend`), publicado en https://openacademy-ten.vercel.app; cada push a `main` se publica solo. Backend en Render (plan gratis), aún sin publicar.
- **Futuro:** KaTeX para fórmulas, Phaser.js para el modo Aventura, Mercado Pago o Culqi para pagos (Perú), Capacitor si se quiere publicar en tiendas de apps.

## Estructura actual

```
CLAUDE.md                  este archivo
README.md
docs/PLAN.md               hoja de ruta por fases
docs/IDEAS_MATERIALES.md   ideas de materiales manipulativos virtuales
docs/SEGURIDAD.md          qué protege la app y qué falta cuidar
supabase/migrations/       SQL de las tablas (con Row Level Security); se pegan en el SQL Editor de Supabase
.github/dependabot.yml     avisos mensuales de librerías
frontend/
  public/                  favicon.svg, pwa-192x192.png, pwa-512x512.png (mascota Opi)
  src/
    App.tsx                rutas (GamePage se carga aparte porque usa KaTeX)
    main.tsx
    styles/global.css      TODO el diseño (variables de marca en :root)
    components/MathText.tsx  texto con fórmulas KaTeX entre signos $ (ej. "La mitad de $\frac{3}{4}$")
    components/brand/      Mascot.tsx (Opi, moods: happy | sad | celebrate), Logo.tsx
    components/layout/     AppLayout, TopNav (escritorio), BottomNav (celular), navLinks.ts
    features/games/        catalog.ts (lista de todos los juegos y su tipo: quiz | match | order | truefalse | classify | domino | roulette), shuffle.ts
    features/games/quiz/   types.ts, demoQuizzes.ts (datos de prueba con pistas, errores típicos y solución)
    features/games/match/  types.ts, demoMatches.ts (plantilla Emparejar)
    features/games/order/  types.ts, demoOrders.ts (plantilla Ordenar pasos)
    features/games/truefalse/  types.ts, demoTrueFalse.ts (plantilla Verdadero o falso contra el tiempo)
    features/games/classify/   types.ts, demoClassify.ts (plantilla Clasificar)
    features/games/domino/     types.ts, demoDominoes.ts (plantilla Dominó)
    features/games/roulette/   types.ts, demoRoulettes.ts, Wheel.tsx (plantilla Ruleta)
    features/academy/      types.ts, courses.ts (Curso → Unidad → Clase, contenido de prueba)
    features/teacher/      editorShared.tsx (partes comunes) y un editor por plantilla (Quiz, Match, TrueFalse, Order, Classify, Domino, Roulette)
    features/lab/          balance/ (balanza de ecuaciones), fractions/ (tiras), geoboard/ (geoplano)
    lib/supabase.ts        cliente de Supabase (null si faltan las variables de .env)
    lib/auth.tsx           sesión y perfil (AuthProvider, useAuth)
    lib/results.ts         useRecordGame: guarda resultado y XP con la función record_game
    lib/progress.ts        avance de la Academia (localStorage + tabla lesson_progress)
    lib/userGames.ts       juegos creados por docentes (tabla games): leer, buscar por código, convertir al formato del catálogo
    lib/classrooms.ts      aulas: tipos y consultas (tablas classrooms, classroom_members, classroom_games)
    pages/                 HomePage, GamesPage, QuizPage, AcademyPage, ProfilePage, LoginPage,
                           LabPage, BalancePage, FractionStripsPage, GeoboardPage,
                           GamePage (abre cada juego según su tipo), MatchPage, OrderPage, TrueFalsePage, ClassifyPage, DominoPage, RoulettePage,
                           CoursePage, LessonPage, AcademyPracticePage (Academia), RankingPage,
                           TeacherPage (panel docente) y GameEditorPage (elige el editor según el tipo), AdminPage (roles),
                           TeacherClassroomsPage y TeacherClassroomPage (aulas del docente), MyClassroomsPage y ClassroomPage (aulas del alumno)
  vercel.json              rewrite para que funcionen las rutas de React Router
  vite.config.ts           manifest PWA (nombre, colores, iconos)
backend/
  src/index.ts             Express, CORS, JSON
  src/routes/health.ts     GET /api/health → { status: "ok" }
```

Comandos:

```bash
cd frontend && npm install && npm run dev     # http://localhost:5173
cd frontend && npm run build                   # compila y verifica tipos
cd backend && npm install && npm run dev       # http://localhost:3000/api/health
```

## Diseño (marca)

- **Nombre:** OpenAcademy. **Mascota:** Opi, un personaje redondo morado con birrete (provisional, Edgar puede cambiarla).
- **Estilo:** divertido tipo Duolingo o Kahoot (botones con relieve que se hunden al tocar, tarjetas redondeadas, colores vivos), con un toque épico (oscuro + dorado) solo en la sección Aventura. La Academia puede ser algo más sobria.
- **Colores:** morado `#6c4cf5` (principal), amarillo `#ffc93c`, verde `#22c55e` (correcto), rojo `#f43f5e` (incorrecto), noche `#1b1640` + dorado (Aventura).
- **Fuentes:** Fredoka (títulos) y Nunito (texto), desde Google Fonts.
- **Responsive:** en celular hay menú inferior; desde 768 px, menú superior y tarjetas en columnas. Diseña siempre primero para celular.
- No hay modo oscuro por ahora (se quitó a propósito).
- Usa clases y variables de `global.css`; no metas colores sueltos en los componentes.

## Reglas de trabajo

1. Avanza en **pasos pequeños que funcionen**. Al terminar cada paso, ejecuta `npm run build` y muestra el resultado (capturas en tamaño celular y escritorio cuando cambie algo visual).
2. Explica a Edgar qué hiciste y qué tiene que hacer él (crear cuentas, pegar claves, etc.), con pasos numerados.
3. **Nunca subas claves ni secretos** al repositorio. Usa `.env` (ignorado por git) y `.env.example` con los nombres de las variables.
4. Commits pequeños con mensajes en español.
5. Comentarios en el código: pocos y en español, solo donde aclaren algo.
6. Si una decisión cambia el plan (stack, estructura, alcance), pregúntale antes a Edgar.

## Créditos

- Pie de página (footer) en la web: "© OpenAcademy · Creado por Edgar Chura Humora".
- Campo `author` en los `package.json` y en el README.

## Siguiente paso inmediato

El código ya está en GitHub (`EdgarChuraHumora/openacademy`). Ver `docs/PLAN.md`, sección "Ahora". En resumen:
1. ~~Publicar en Vercel~~ y ~~conectar Supabase~~ (hecho). Falta probar la instalación PWA en el celular.
2. Configurar correos (SMTP) y volver a activar la confirmación por correo antes de tener alumnos reales.
3. Seguir con el resto de la Fase 1: quizzes en la base de datos, panel docente y ranking.
