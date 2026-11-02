# Receptor de leads (Google Apps Script)

`Code.gs` recibe los envíos de los dos formularios del sitio y los guarda en
una Google Sheet, cada uno en su pestaña:

- Formulario de contacto de la landing (`components/sections/ContactForm.tsx`
  → `submitLead()` en `lib/leads.ts`) → pestaña **"Leads"**.
- Inscripción de `/masterclass` (`components/masterclass/MasterclassForm.tsx`
  → `submitMasterclass()`, que añade `"form": "masterclass"` al cuerpo) →
  pestaña **"Masterclass"** (ver [más abajo](#inscripciones-a-la-masterclass)).

Las dos usan la misma URL `/exec` y la misma variable
`NEXT_PUBLIC_LEADS_ENDPOINT`. No forma parte del build de Next: se copia a
mano en Apps Script.

## 1. Crear la hoja y el script

1. Crea una Google Sheet nueva (p. ej. "La Emperatriz — Leads") con la cuenta
   que será dueña de los datos.
2. En la hoja: **Extensiones → Apps Script**. Así el script queda vinculado a
   esa hoja.
3. Borra el contenido de `Código.gs`, pega `Code.gs` y guarda.
4. Opcional: pon un correo en `NOTIFY_EMAIL` para recibir un aviso por lead.

## 2. Desplegar como Web App

1. **Implementar → Nueva implementación → tipo "Aplicación web"**.
2. *Ejecutar como*: **Yo**.
3. *Quién tiene acceso*: **Cualquier usuario** ("Anyone"), no "Cualquier
   usuario con cuenta de Google". Si no, Google responde con la página de
   inicio de sesión y el formulario muestra error.
4. Autoriza los permisos. Si aparece "Google no ha verificado esta app":
   **Configuración avanzada → Ir a … (no seguro)**. Es tu propio script.
5. Copia la URL que termina en `/exec` (no la de `/dev`).
6. Comprueba que responde: abre la URL en el navegador y debe mostrar
   `{"ok":true,"service":"la-emperatriz-leads"}`.

### Si no aparece la opción "Cualquier usuario"

La cuenta es de Google Workspace y el administrador restringe compartir fuera
del dominio. Hay dos salidas:

- Pedir al administrador que lo permita (Consola de administración →
  Drive y Documentos → Configuración de uso compartido).
- Crear la hoja y el script con una cuenta personal de Gmail y compartir la
  hoja con la cuenta del equipo.

### Al cambiar el código

Usa **Implementar → Gestionar implementaciones → editar → Versión: nueva**.
Así se conserva la misma URL `/exec`. "Nueva implementación" genera otra URL.

## 3. Conectar el sitio

- **Local**: crea `.env.local` en la raíz (ya está ignorado por git):

  ```
  NEXT_PUBLIC_LEADS_ENDPOINT=https://script.google.com/macros/s/XXXX/exec
  ```

  Reinicia `npm run dev` (las variables `NEXT_PUBLIC_` se leen al arrancar)
  y haz un envío real. Debe aparecer una fila en la hoja.

- **Producción**: en GitHub → repo → **Settings → Secrets and variables →
  Actions → pestaña Variables → New repository variable**:
  `NEXT_PUBLIC_LEADS_ENDPOINT` = la URL `/exec`. Debe ser *Variable*, no
  *Secret*: el workflow la lee como `vars.NEXT_PUBLIC_LEADS_ENDPOINT`. En
  cualquier caso, la URL acaba visible en el JS público. Después relanza el
  deploy (Actions → Deploy to GitHub Pages → Run workflow) o haz un push.

## Respuestas

| Respuesta | Significado |
|---|---|
| `{"ok":true}` | Fila guardada → el sitio muestra éxito. También si la fila se guardó pero el correo de aviso falló o se omitió por el límite (ver abajo). |
| `{"ok":false,"error":"invalid_body"}` | El cuerpo no es un objeto JSON |
| `{"ok":false,"error":"no_consent"}` | `consent` no es exactamente `true` |
| `{"ok":false,"error":"invalid_name"}` | Nombre ausente, no es texto o queda vacío tras recortar espacios |
| `{"ok":false,"error":"invalid_email"}` | Correo ausente, no es texto o no cumple el formato del formulario |
| `{"ok":false,"error":"invalid_phone"}` | Teléfono no es texto, o (si es obligatorio o viene con valor) no cumple la regla del formulario: solo `+`, dígitos, espacios, guiones y paréntesis, con 7–15 dígitos |
| `{"ok":false,"error":"invalid_country"}` | País obligatorio vacío, no son 2 letras mayúsculas, o `countryName` no es texto |
| `{"ok":false,"error":"invalid_project_type"}` | No es una lista, algún elemento no es texto o no está permitido, o la lista queda vacía siendo obligatoria |
| `{"ok":false,"error":"too_many_project_types"}` | Más de 10 tipos tras quitar duplicados |
| `{"ok":false,"error":"invalid_budget"}` | Presupuesto obligatorio vacío, o no es una de las claves permitidas |
| `{"ok":false,"error":"invalid_language"}` | `language` no es `es` ni `pt` |
| `{"ok":false,"error":"server_error"}` | JSON inválido o error al guardar la fila |

Con cualquier `ok:false` el sitio muestra el mensaje de error genérico.

## Campos obligatorios (`REQUIRED`)

Nombre, correo y consentimiento son siempre obligatorios. El resto se
configura al inicio de `Code.gs`:

```js
const REQUIRED = { phone: true, country: true, budget: true, projectType: true };
```

**Debe coincidir con `FIELD_REQUIRED` en `components/sections/ContactForm.tsx`.**
El servidor nunca debe ser más estricto que el formulario: si un campo es
obligatorio aquí pero opcional allí, la persona recibe un error genérico que
no puede corregir. Si cambias `FIELD_REQUIRED`, cambia `REQUIRED` y publica
una versión nueva del script. Un campo opcional puede llegar vacío, pero si
trae valor se valida igual (p. ej. un teléfono opcional con "12" se rechaza).

Las reglas del correo y del teléfono (`EMAIL_RE`, `PHONE_CHARS_RE`, 7–15
dígitos) están copiadas del formulario; si cambian allí, cámbialas aquí.

## Correos de aviso

Si `NOTIFY_EMAIL` tiene un correo, cada lead guardado envía un aviso:

- La fila se guarda **antes** de enviar el aviso. Si `MailApp` falla (p. ej.
  cuota diaria agotada), el error se registra con `Logger.log` (visible en
  **Ejecuciones** del editor de Apps Script) y el sitio recibe igualmente
  `{"ok":true}`, porque el lead ya está guardado.
- Límite: **20 avisos por hora** (`MAX_NOTIFICATIONS_PER_HOUR`), contados en
  `CacheService` por hora de reloj (de 10:00 a 10:59, de 11:00 a 11:59…).
  Pasado el límite se siguen guardando las filas, pero sin aviso; revisa la
  hoja directamente. `CacheService` puede borrar el contador antes de tiempo,
  así que en casos raros podrían enviarse algunos avisos de más.
- El asunto incluye el nombre con los saltos de línea y caracteres de control
  reemplazados por espacios.

Si cambian los rangos de inversión o los tipos de proyecto, actualiza también
`PROJECT_TYPES` y `BUDGETS` en `Code.gs`. Si no, esos envíos se rechazan.

## Columnas de la hoja

La pestaña "Leads" tiene exactamente estas 13 columnas, en este orden (es el
orden de `COLUMNS` en `Code.gs`, y la fila 1 lleva estos nombres):

| # | Columna | Contenido |
|---|---|---|
| A | `submittedAt` | Momento del envío en el navegador, texto ISO 8601 en UTC (`2026-10-24T09:15:02.123Z`) |
| B | `name` | Nombre |
| C | `email` | Correo electrónico |
| D | `phone` | Teléfono o WhatsApp (empieza por `+`, así que se guarda con apóstrofo delante; ver abajo) |
| E | `country` | Código ISO 3166-1 de 2 letras (`CO`) |
| F | `countryName` | Nombre del país, siempre en español (`Colombia`) |
| G | `projectType` | Claves de tipo de proyecto, sin duplicados, **unidas por coma y espacio** en el orden del formulario (`escritura, genero`) |
| H | `budget` | Clave del rango de inversión (`lt100`, `r100_150`, `r150_250`, `gt250`) |
| I | `language` | Idioma de la interfaz al enviar (`es` o `pt`) |
| J | `consent` | Casilla de consentimiento (`TRUE`) |
| K | `consentAt` | Momento en que se marcó el consentimiento, texto ISO 8601 en UTC |
| L | `pageUrl` | URL de la página desde la que se envió |
| M | `receivedAt` | Momento en que el script recibió el envío, texto ISO 8601 en UTC |

Notas:

- Los valores que empiezan por `=`, `+`, `-`, `@`, tabulador o retorno de
  carro se guardan con un apóstrofo delante (`'+34 600…`) para que la hoja no
  los interprete como fórmula. El apóstrofo no se ve en la celda.
- Nombre, correo, teléfono y nombre del país se guardan sin espacios al
  principio ni al final.
- Cada valor se recorta a 500 caracteres.
- Las fechas (`submittedAt`, `consentAt`, `receivedAt`) se guardan como texto,
  no como fecha de la hoja. Para ordenar o filtrar por fecha, conviértelas con
  una columna auxiliar, p. ej. `=DATEVALUE(LEFT(A2;10))` (con `,` en lugar de
  `;` si la hoja usa configuración regional en inglés).

## Al añadir columnas (p. ej. `country` y `countryName`)

La fila de títulos solo se escribe cuando la pestaña "Leads" está vacía. Si
ya tiene filas, inserta a mano las columnas nuevas en la misma posición que
en `COLUMNS` (país y nombre del país van justo después de `phone`) antes de
publicar la nueva versión. Otra opción es renombrar la pestaña vieja para
que se cree una nueva. Si no, los datos quedan desplazados respecto a los
títulos.

## Inscripciones a la masterclass

La página `/masterclass` no está enlazada desde la landing (se comparte por
enlace y lleva `noindex`). Al enviar el paso 1, el script guarda la fila en la
pestaña "Masterclass" y solo entonces el sitio muestra el paso 2 (invitación
a la comunidad de WhatsApp). Si el guardado falla, la persona sigue en el
paso 1 con el mensaje de error.

Todos los campos son obligatorios. Errores propios de este formulario, además
de `invalid_name`, `invalid_email`, `invalid_phone`, `invalid_language` y
`no_consent` (mismas reglas que arriba):

| Respuesta | Significado |
|---|---|
| `{"ok":false,"error":"invalid_form"}` | `form` trae un valor que el script no conoce |
| `{"ok":false,"error":"invalid_country"}` | País vacío o no es texto (aquí es texto libre, no código ISO) |
| `{"ok":false,"error":"invalid_gender"}` | No es una de las claves de `GENDERS` |
| `{"ok":false,"error":"invalid_sector"}` | Sector vacío o no es texto |
| `{"ok":false,"error":"invalid_project"}` | Descripción del proyecto vacía o no es texto |

Columnas de la pestaña "Masterclass" (orden de `MASTERCLASS_COLUMNS`):

| # | Columna | Contenido |
|---|---|---|
| A | `submittedAt` | Momento del envío en el navegador (ISO 8601, UTC) |
| B | `name` | Nombre y apellido |
| C | `email` | Correo electrónico |
| D | `phone` | Teléfono o WhatsApp |
| E | `country` | País de residencia, tal como lo escribió la persona |
| F | `gender` | `masculino`, `femenino`, `no_binario` o `prefiero_no_decirlo` |
| G | `sector` | Sector en el que trabaja (texto libre) |
| H | `project` | Descripción del proyecto, hasta 2000 caracteres (`MAX_PROJECT_LENGTH`) |
| I | `language` | Idioma de la interfaz al enviar (`es` o `pt`) |
| J | `consent` | Casilla de consentimiento (`TRUE`) |
| K | `consentAt` | Momento en que se marcó el consentimiento (ISO 8601, UTC) |
| L | `pageUrl` | URL desde la que se envió |
| M | `receivedAt` | Momento en que el script recibió el envío (ISO 8601, UTC) |

Si `NOTIFY_EMAIL` está configurado, cada inscripción manda un aviso con el
asunto "Nueva inscripción a la masterclass: <nombre>" (comparte el límite de
20 avisos por hora con los leads). Si cambian las opciones de género, cambia
`GENDERS` en `Code.gs` y en `MasterclassForm.tsx` a la vez.
