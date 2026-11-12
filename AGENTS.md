# AGENTS.md — Kampus

Reglas del proyecto para cualquier agente de IA (Claude, Copilot, etc.) que trabaje en este repositorio. El objetivo de este archivo es que el agente nunca tenga que adivinar el contexto del proyecto.

## 1. Qué es Kampus

Kampus es una app de banca digital dirigida a estudiantes universitarios en México que no tienen una cuenta bancaria a su nombre. Es una cuenta de depósito con tarjeta, ahorro con rendimiento básico y control de gastos — operada como capa tecnológica (Banking-as-a-Service) sobre un banco o SOFIPO con licencia, no como institución financiera propia.

- **Vertical:** Banca digital.
- **Usuario primario:** estudiantes de licenciatura de 18 a 23 años, sin historial crediticio ni ingreso fijo comprobable, que hoy dependen de la cuenta bancaria de sus papás o manejan efectivo.
- **Propuesta de valor:** una cuenta que se abre sin comprobante de ingresos ni aval, con tarjeta de débito, ahorro con rendimiento y control de gastos en la app.

## 2. Flujo central (core flow)

1. El estudiante se registra con INE o credencial escolar + selfie (KYC ligero delegado al partner licenciado).
2. El partner institucional abre la cuenta a nombre del estudiante dentro de su propia licencia; Kampus es la interfaz y la marca.
3. El estudiante recibe pagos (transferencias, depósitos en efectivo en tiendas afiliadas) y paga con la tarjeta física o virtual Kampus.
4. El saldo ahorrado genera un rendimiento básico, pagado por el partner y mostrado dentro de la app Kampus.
5. Kampus cobra un plan premium opcional y recibe un porcentaje del interchange y del rendimiento generado, negociado con el partner.

## 3. Stack

- **App móvil:** Flutter (una sola base de código para iOS y Android).
- **Backend propio:** Node.js + PostgreSQL, sólo para lógica de producto (perfiles, notificaciones, control de gastos, soporte).
- **Custodia, KYC, emisión de tarjeta y rieles de pago:** delegados al partner institucional (banco/SOFIPO) vía su API de Banking-as-a-Service. Kampus **no** construye ni opera infraestructura bancaria propia.
- **Analítica:** eventos de producto en PostHog; métricas de negocio (CAC, ARPU, churn, LTV) en una hoja de cálculo mientras el volumen es bajo.

## 4. Fuera de alcance (out of scope) — al menos en esta fase

- **Otorgar crédito de cualquier tipo** (tarjeta de crédito, préstamos personales, BNPL). Requiere capital regulatorio y gestión de riesgo crediticio que el equipo no tiene.
- **Operar como institución financiera con licencia propia** (banco, SOFIPO, IFPE). El modelo es 100% sobre un socio licenciado.
- **Inversión de los depósitos captados.** Eso lo hace el partner con su propio balance; Kampus no toca ese dinero.
- **Onboarding sin partner licenciado.** Ningún flujo debe custodiar dinero fuera de la cuenta concentradora del partner.
- **Expansión fuera del segmento universitario** hasta validar el modelo con el primer campus.

## 5. Reglas para el agente de IA

- Nunca proponer que Kampus custodie fondos por su cuenta sin pasar por el partner licenciado.
- Nunca añadir funcionalidad de crédito (tarjeta de crédito, préstamos, BNPL) sin que el equipo lo apruebe explícitamente — está fuera de alcance por diseño regulatorio, no por olvido.
- Al proponer números de negocio, siempre etiquetarlos como asunción y explicar de dónde salen (ver SPEC.md y la bitácora).
- Preferir simplicidad: cualquier feature nueva debe justificarse contra el usuario nombrado en SPEC.md (Mariana), no contra un segmento genérico.
