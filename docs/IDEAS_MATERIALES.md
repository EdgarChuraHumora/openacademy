# Ideas de materiales virtuales para OpenAcademy

Ideas para convertir materiales concretos de aula (los que un profesor de Matemática usa con las manos) en **manipulativos interactivos** dentro de la app. Son la base de una sección nueva, **Laboratorio**, y también de nuevas plantillas de juego y de recursos para las clases de la Academia.

Fuente: ideas recopiladas por Edgar Chura Humora a partir de su experiencia docente. OpenAcademy es un proyecto independiente.

---

## 1. Laboratorio: materiales manipulativos virtuales

Cada material es un componente interactivo (React + SVG o canvas) que se puede usar libremente en el Laboratorio o dentro de una clase o un ejercicio. Prioridad: ★★★ alta, ★★ media, ★ baja.

### Números y operaciones

| Material | Cómo funciona en la app | Temas | Prioridad |
|---|---|---|---|
| **Tiras de fracciones** | Barras de colores de 1/2, 1/3, 1/4, 1/6… que se arrastran y superponen para sumar, restar y comparar | Fracciones | ★★★ |
| **Recta numérica** | Recta con zoom donde se ubican fracciones, decimales y enteros arrastrando tarjetas | Racionales, orden, inecuaciones | ★★★ |
| **Cuadrícula de 100** | Tablero de 10 × 10 donde se pintan casillas y se muestra a la vez la fracción, el decimal y el porcentaje | Equivalencias, porcentajes | ★★★ |
| **Termómetro** | Termómetro vertical de −10 °C a +10 °C para sumar y restar enteros como subidas y bajadas de temperatura | Enteros | ★★ |
| **Ábaco** | Ábaco con fichas para formar cantidades y pasar a notación científica | Sistema decimal, notación científica | ★ |
| **Cubos apilables** | Cubos en 3D o isométrico para ver 2², 3³ como área y volumen | Potencias | ★★ |
| **Tienda simulada** | Productos con precio, monedas y billetes en soles, descuentos sucesivos y boleta con IGV (18 %) | Porcentajes, dinero, IGV | ★★ |
| **Balanza de cocina** | Balanza para convertir kg ↔ g y comparar masas | Unidades de medida | ★ |

### Álgebra

| Material | Cómo funciona en la app | Temas | Prioridad |
|---|---|---|---|
| **Balanza de ecuaciones** | Platillos con bolsitas (x) y pesas (números). Se quita o agrega lo mismo en ambos lados hasta despejar x; la balanza se inclina si se rompe el equilibrio | Ecuaciones lineales | ★★★ |
| **Fichas algebraicas** | Fichas de x y de 1 (positivas y negativas) para reducir expresiones y resolver ecuaciones | Expresiones algebraicas | ★★ |
| **Patrones con palitos** | Figuras que crecen (4, 7, 10… palitos) para descubrir la regla y el término general | Progresiones, patrones | ★★ |
| **Tabla posición–término** | Tabla n ↔ aₙ que se completa y genera la fórmula y su gráfica | Progresiones aritméticas | ★ |
| **Plano cartesiano interactivo** | Se colocan puntos y se trazan rectas; comparar y = mx (lineal) con y = mx + b (afín), por ejemplo la tarifa de un taxi | Funciones lineales y afines | ★★★ |
| **Tabla de proporcionalidad** | Al aumentar una magnitud, la otra se actualiza y se grafica | Proporcionalidad | ★★ |

### Geometría

| Material | Cómo funciona en la app | Temas | Prioridad |
|---|---|---|---|
| **Geoplano** | Cuadrícula de clavos donde se estiran "ligas" para formar polígonos; calcula el área y el perímetro | Área, perímetro, figuras compuestas | ★★★ |
| **Tangram** | Piezas que se arrastran y rotan para armar figuras y comparar áreas | Áreas compuestas | ★★ |
| **Polígonos con apotema** | Polígonos regulares que se descomponen en triángulos para deducir A = P × ap / 2 | Área de polígonos regulares | ★★ |
| **Transformaciones** | Una figura sobre el plano cartesiano que se traslada, rota, refleja o amplía con controles | Isometrías, homotecia | ★★★ |
| **Espejo de simetrías** | Dibujar una mitad de un diseño (por ejemplo la chakana o un tejido andino) y ver su reflejo | Simetría | ★ |
| **Cubos y vistas** | Construcción con cubos en 3D o isométrico y sus vistas frontal, lateral y superior | Perspectiva | ★ |
| **Constructor de triángulos** | Construir triángulos dando lados y ángulos para comprobar los criterios LLL, LAL y ALA | Congruencia y semejanza | ★ |

### Estadística y probabilidad

| Material | Cómo funciona en la app | Temas | Prioridad |
|---|---|---|---|
| **Dados y monedas** | Lanzar 1 o 100 veces; tabla de frecuencias y gráfico que se acercan a 1/6 | Frecuencia, probabilidad | ★★★ |
| **Ruleta** | Ruleta de N sectores configurable; calcula la probabilidad con la regla de Laplace | Regla de Laplace | ★★ |
| **Bolsas de bolillas** | Bolsas con bolillas de colores; sacar al azar y clasificar sucesos seguros, probables e imposibles | Sucesos | ★★ |
| **Torres de cubos (media)** | Torres de distinta altura que se "nivelan" para visualizar la media | Media, mediana, moda | ★★ |
| **Constructor de histogramas** | Ingresar datos y ver la tabla, el histograma y el polígono de frecuencias | Estadística | ★★ |
| **Muestreo de semillas** | Bolsa con semillas de colores (población); sacar muestras e inferir su composición | Población y muestra | ★ |

---

## 2. Nuevas plantillas de juego

Ideas de materiales que encajan como plantillas del módulo Juegos (el docente solo llena los datos):

- **Dominó:** emparejar expresión con resultado (por ejemplo 2³ × 2² ↔ 2⁵).
- **Ordenar tarjetas:** ordenar valores de menor a mayor (precios de un mercado con fracciones y decimales) o los pasos de un problema (Datos → Condición → Operación → Respuesta).
- **Clasificar:** arrastrar elementos a grupos (suceso seguro / probable / imposible; función lineal / afín).
- **Ruleta de preguntas:** girar y responder.
- **Tienda:** resolver compras con descuentos e IGV para ganar monedas (encaja con la economía del modo Aventura).

---

## 3. Recursos externos gratuitos

- **GeoGebra:** sus applets se pueden incrustar gratis con `<iframe>` (https://www.geogebra.org/m/CODIGO). Útil en las clases de la Academia mientras no tengamos un material propio para ese tema. Hay applets para funciones lineales, ecuaciones con balanza, transformaciones, criterios de congruencia, histogramas, regla de Laplace, etc.
- Educaplay y Wordwall son **referencias de diseño** para nuestras plantillas de juego, no para incrustar (OpenAcademy debe tener sus propios juegos).

---

## 4. Identidad: contexto peruano y andino (opcional)

Para que los problemas y materiales se sientan cercanos, se pueden ambientar en situaciones cotidianas del Perú: precios en soles, el mercado o la feria, el IGV, la temperatura en una helada, la quinua, la papa y el chuño, tejidos como el awayo, la chakana para simetrías y los andenes para patrones. Puede ser también la temática visual de algún "mundo" del modo Aventura.

---

## 5. Uso de inteligencia artificial (futuro)

Cuatro usos de IA para la plataforma:

1. **Personalización:** recomendar ejercicios según los errores del alumno.
2. **Tutor o asistente:** que la mascota Opi dé pistas paso a paso sin dar la respuesta.
3. **Creación de recursos:** ayudar al docente a generar preguntas y problemas en el panel creador.
4. **Evaluación:** analizar resultados y sugerir qué reforzar.

Condiciones: el docente revisa lo generado, se verifica que la información sea correcta, y se protegen los datos de los estudiantes (sobre todo menores de edad).
