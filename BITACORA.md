# BITACORA.md — Kampus

Registro de sesiones de trabajo con IA en este proyecto. Cada entrada documenta el objetivo, lo que hizo la IA y lo que el equipo decidió a partir de eso.

---

## Entrada 1 — 27 de agosto de 2026

**Objetivo:** Definir el vehículo regulatorio de Kampus y armar el deck para la entrega del 30 de agosto (slides 1–7, con diagramas en las slides 3 y 5), además de dejar configurados AGENTS.md, SPEC.md y BITACORA.md.

**Qué hizo la IA:**
- Ayudó a responder las tres preguntas regulatorias (¿custodiamos dinero? sí; ¿prestamos? no; ¿pagamos rendimiento? sí) y a justificar cada respuesta desde el producto, no desde la teoría.
- Propuso el modelo de vehículo: operar como capa tecnológica (Banking-as-a-Service) sobre un banco o SOFIPO ya licenciados, en lugar de que Kampus tramite su propia licencia — por ser la ruta realista para un equipo en etapa de proyecto escolar/MVP.
- Construyó el diagrama de flujo de dinero (usuario, Kampus, institución partner, comercio + red de tarjetas) con los cuatro pagos numerados y su explicación.
- Calculó las métricas de la slide 6 (CAC, ARPU, margen, churn, LTV, LTV/CAC, payback) a partir de asunciones explícitas, y señaló que el margen de interés neto no aplica directamente al modelo de Kampus porque no invertimos los depósitos nosotros mismos.
- Generó el archivo .pptx con los 7 slides y los tres archivos de proyecto (AGENTS.md, SPEC.md, BITACORA.md) configurados para Kampus.

**Qué decidió el equipo:**
- Aceptar el vehículo BaaS como respuesta de la slide 4, entendiendo que se puede corregir en clase el martes si el profesor identifica una figura más apropiada.
- Usar a Mariana Torres (estudiante de Contaduría, Campus Guadalajara) como el usuario nombrado de la slide 2, y confirmar que es un perfil que el equipo puede efectivamente contactar y entrevistar en septiembre.
- Dejar pendiente para la próxima entrada: validar el CAC de $150 MXN y el churn de 4% con al menos 3 conversaciones informales con estudiantes del campus, antes de la defensa de números del martes.

---

## Entrada 2 — 22 de septiembre de 2026

**Objetivo:** avanzar el proyecto en dos frentes — dejar por escrito el razonamiento regulatorio en un formato más formal, y construir el entregable del sprint en clase (job statements, guía de entrevista, tabla de competidores + 2×2, hipótesis rankeadas) siguiendo la metodología vista en la Sesión 14.

**Qué se le pidió a la IA y qué hizo, en orden:**

1. El equipo pidió separar el contenido de las slides 2 y 3 (usuario/problema y las tres preguntas) en un documento aparte, para tenerlo como respaldo escrito independiente del diagrama. La IA extrajo ese contenido a un documento nuevo.
2. El equipo pidió un memo más técnico que capturara todo el razonamiento discutido hasta ese punto — no solo el resultado, sino el porqué de cada decisión. La IA redactó un memo formal cubriendo el perímetro regulatorio, la selección del vehículo, la arquitectura del flujo de fondos, el modelo de unidad económica y los riesgos.
3. El equipo pidió que ambos documentos fueran Word y no Markdown, para poder entregarlos o imprimirlos directamente. La IA los reconstruyó como .docx con tablas formateadas.
4. El equipo compartió una foto de la slide del profesor ("Today's sprint: build your interview guide") y pidió construir ese entregable usando el trabajo ya hecho de Kampus y Mariana. La IA generó los job statements, una guía de 10 preguntas, una tabla de 6 competidores con un 2×2, y 3 hipótesis rankeadas.
5. El equipo después compartió la presentación completa del profesor (con la anatomía exacta de la entrevista, los tiempos por bloque, y el template de hipótesis) y pidió ajustar lo ya construido para que calzara con esa plantilla. La IA reescribió la guía de entrevista con bloques de 5/5/15/5 minutos y preguntas estilo Mom Test, reclasificó a los competidores como Direct/Indirect/Incumbent/Status quo, y reescribió las hipótesis en el formato exacto "We believe... struggles with... when... We'll know we're right if...".
6. El equipo pidió actualizar esta bitácora para que reflejara con más detalle las preguntas y ajustes que se hicieron durante la sesión, en lugar de resumir todo en una sola entrada genérica.

**Qué decidió el equipo:**
- Mantener la hipótesis de Value como la más riesgosa y la primera en validarse en las entrevistas.
- Tratar las posiciones del 2×2 como punto de partida, no como respuesta definitiva — se ajustan según lo que digan los entrevistados.
- Agendar las primeras dos entrevistas antes de la próxima clase, tal como pidió el profesor.

---

<!-- Copiar el bloque de abajo para cada nueva sesión de trabajo con IA -->
<!--
## Entrada N — [fecha]

**Objetivo:**

**Qué hizo la IA:**

**Qué decidió el equipo:**
-->
## Entrada 3 — 11 de noviembre de 2026

**Objetivo:** preparar el entorno de desarrollo del MVP de Kampus, organizar la documentación del proyecto e implementar el primer paso del flujo central: el registro de usuarios.

**Qué hizo la IA:**
- Guió al equipo en la creación del proyecto web con React y TypeScript utilizando Vite.
- Ayudó a configurar la pantalla de registro con campos de nombre completo y número celular.
- Implementó una verificación simulada y una pantalla de confirmación de registro.
- A partir de las decisiones, indicaciones y preferencias visuales compartidas por el equipo, ayudó a desarrollar y documentar los lineamientos de diseño de Kampus en `design.md`.
- Ayudó a crear y organizar los archivos `AGENTS.md`, `SPEC.md`, `BITACORA.md` y `design.md`.
- Guió la inicialización de Git y la creación del primer commit.

**Qué decidió el equipo:**
- Utilizar una versión web con React y TypeScript como prototipo para este sprint.
- Mantener la verificación de identidad en modo demostración, sin realizar un proceso real de KYC.
- Dar por terminado el primer avance funcional del registro.
- Guardar el avance con el commit `26c1903`, con el mensaje "Primer avance: registro funcional de Kampus".

## Entrada 4 — 11 de noviembre de 2026

**Objetivo:** continuar el desarrollo del MVP de Kampus, ampliar las funciones principales de la cuenta digital y comprobar que el proyecto pueda compilarse correctamente.

**Qué hizo la IA:**

- Ayudó a implementar la recepción de dinero mediante transferencias simuladas, actualizando el saldo disponible y registrando los movimientos.
- Desarrolló la función de pagos con tarjeta en modo demostración, incluyendo la validación de saldo suficiente antes de realizar un pago.
- Incorporó un apartado de ahorro que permite mover dinero entre el saldo disponible y el ahorro.
- Implementó una simulación de rendimientos mensuales sobre el ahorro, utilizando una tasa anual ilustrativa del 5%.
- Agregó la clasificación automática de gastos por categorías, como comida, transporte, educación, entretenimiento y otros, mediante reglas basadas en palabras clave.
- Incorporó un resumen de gastos del mes y la opción de consultar u ocultar los movimientos recientes.
- Realizó ajustes visuales para mejorar el contraste, la legibilidad y la presentación del resumen de la cuenta.

**Qué decidió el equipo:**

- Mantener las transferencias, los pagos y los rendimientos como simulaciones, sin conectarse a servicios bancarios reales.
- Incorporar el apartado de ahorro y el control de gastos como parte de las funciones del prototipo.
- Mostrar los movimientos recientes únicamente cuando el usuario seleccione esa opción, para mantener el panel principal más limpio.
- Mantener la clasificación de gastos mediante reglas por palabras clave, sin presentarla como inteligencia artificial.
- Continuar desarrollando el MVP como un prototipo académico y no como una aplicación bancaria lista para operar.
