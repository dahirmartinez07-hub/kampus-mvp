# SPEC.md — Kampus

## 1. Problema

Los estudiantes universitarios en México que trabajan de manera informal (clases particulares, freelance, medio tiempo) no pueden abrir una cuenta bancaria a su nombre porque los bancos tradicionales piden historial crediticio y comprobante de ingresos fijos que no tienen. Como resultado, reciben sus pagos en efectivo o a través de la cuenta de sus padres, y no tienen forma propia de ahorrar ni de ver a dónde se va su dinero.

## 2. Usuario

**Mariana Torres, 20 años.** Estudiante de Contaduría, 5º semestre, Universidad Panamericana, Campus Guadalajara. Da clases de regularización de matemáticas medio tiempo y cobra en efectivo o por transferencia directa de sus alumnos. Sus papás le depositan su mesada en la cuenta de su mamá porque Mariana nunca ha podido abrir una cuenta a su nombre. Guarda el efectivo en un sobre y controla sus gastos en notas del celular.

Mariana representa a un estudiante identificable y entrevistable en septiembre — no un segmento demográfico abstracto.

## 3. Flujo central (core flow)

1. **Registro:** Mariana descarga la app, se registra con su credencial de estudiante o INE y una selfie. El KYC lo valida el partner licenciado.
2. **Apertura de cuenta:** el partner institucional (banco o SOFIPO) abre la cuenta a nombre de Mariana dentro de su propia licencia. Kampus es la app y la marca que Mariana ve y usa.
3. **Recepción de dinero:** Mariana recibe transferencias de sus alumnos y de sus papás directamente en su cuenta Kampus, con CLABE propia.
4. **Gasto:** Mariana paga con su tarjeta de débito física o virtual Kampus en comercios y en línea.
5. **Ahorro:** el saldo que Mariana no gasta genera un rendimiento básico, visible dentro de la app.
6. **Control:** la app le muestra en qué gastó su dinero cada mes, categorizado automáticamente.

## 4. Modelo de datos, en palabras simples

- **Usuario:** nombre, credencial escolar/INE verificada, universidad y campus, número de teléfono, fecha de nacimiento, estatus de KYC (pendiente/aprobado/rechazado por el partner).
- **Cuenta:** identificador de cuenta en el sistema del partner, CLABE, saldo disponible, saldo en ahorro, tasa de rendimiento vigente, plan (gratuito/premium).
- **Movimiento:** fecha, tipo (depósito, transferencia recibida, compra con tarjeta, pago de comisión), monto, categoría de gasto, comercio (si aplica), estado (aplicado/pendiente/rechazado).
- **Tarjeta:** identificador de tarjeta emitida por el partner, tipo (física/virtual), estatus (activa/bloqueada/repuesta).
- **Evento de referido:** usuario que refiere, usuario referido, fecha, bono aplicado — para medir CAC por canal.

Todos estos datos, excepto el perfil y las categorías de gasto que Kampus muestra en su app, viven en el sistema del partner licenciado; Kampus los consulta vía su API pero no es la fuente de verdad de los fondos.

## 5. Lista cerrada de dependencias

- **Partner de Banking-as-a-Service** (banco o SOFIPO con licencia CNBV): custodia de fondos, KYC regulatorio, emisión de tarjeta, rieles de transferencias (SPEI), pago de rendimiento.
- **Flutter** (SDK de app móvil, iOS + Android).
- **Node.js + PostgreSQL** (backend propio de producto: perfiles, notificaciones, categorización de gastos, soporte).
- **Red de tarjetas** (Visa o Mastercard, vía el partner): procesamiento de pagos con tarjeta e interchange.
- **PostHog** (analítica de producto).
- **Proveedor de KYC/selfie liveness** (delegado por el partner, no contratado directamente por Kampus).

No se agregan dependencias fuera de esta lista sin actualizar este archivo primero.
