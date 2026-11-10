# Seguridad de OpenAcademy

Lista de lo que protege la app y de lo que hay que cuidar. Revisarla antes de cada etapa importante (publicar, abrir a docentes, cobrar).

## Cuentas de Edgar (lo más importante)

- [ ] Verificación en dos pasos (2FA) en GitHub
- [ ] 2FA en Vercel
- [ ] 2FA en Supabase
- [ ] Contraseñas largas y distintas (idealmente en un gestor de contraseñas)
- Nunca compartir la clave `service_role` de Supabase ni pegarla en el código, chats o capturas

## En el código

- Claves solo en `frontend/.env` (git no lo sube) y en las variables de entorno de Vercel. En el repositorio solo está `.env.example`.
- La clave `anon` de Supabase es pública por diseño; lo que protege los datos es **Row Level Security**, activada en todas las tablas (`supabase/migrations/`).
- Los alumnos solo pueden cambiar su nombre y su grado. XP, nivel, racha, monedas y rol solo los cambian funciones del servidor (`record_game`), con límites.
- Aventura (`0007_aventura.sql`): estrellas, XP de héroe, monedas y mejoras solo cambian con `adventure_win`, `adventure_buy` y `adventure_import`; el servidor calcula los premios, revisa que la etapa y el héroe estén desbloqueados, pide 15 s entre victorias y pone topes al pasar el avance del navegador. Probado el 10/11/2026 (8 intentos de trampa bloqueados).
- Contenido escrito por docentes: React y KaTeX (`trust: false`) no ejecutan código metido en preguntas o respuestas.
- Dependabot revisa las librerías una vez al mes (`.github/dependabot.yml`).

## Pendientes y límites conocidos

- **Confirmación por correo DESACTIVADA (31/10/2026):** el servicio de correos gratuito de Supabase solo permite unos pocos correos por hora. Antes de tener alumnos reales: configurar un servicio de correos (por ejemplo Resend) en Supabase → Authentication → Emails → SMTP, y volver a activar "Confirm email". Mientras tanto, "¿Olvidaste tu contraseña?" tampoco enviará correos de forma confiable.

- **Trampas con el XP:** los juegos se calculan en el navegador. Mientras el XP no dé premios ni notas es aceptable; si el ranking da premios, validar puntajes en el servidor.
- **Datos de menores (Ley 29733):** pedir solo nombre o apodo, grado y correo. Agregar política de privacidad y consentimiento de padres antes de abrir a colegios (consultar con alguien que conozca la ley).
- **Pausa por inactividad:** el plan gratis de Supabase pausa el proyecto si pasa 7 días sin uso (pasó el 9/11/2026). Mientras está pausado, el login y el XP no funcionan en la web. Se reactiva en el panel de Supabase con "Resume project" (tarda unos minutos).
- **Copias de seguridad:** el plan gratis de Supabase no las incluye. Exportar los datos periódicamente.
- **Vercel Hobby** es para uso no comercial: al empezar a cobrar, pasar a un plan que lo permita.
- **Pagos:** nunca manejar datos de tarjetas; Mercado Pago o Culqi los procesan y avisan por webhook al backend.
- **Herramientas de compilación:** `npm audit` muestra avisos "moderados" en `vite-plugin-pwa` (solo se usa al compilar, no llega al celular del alumno). Actualizar cuando salga una versión corregida.
