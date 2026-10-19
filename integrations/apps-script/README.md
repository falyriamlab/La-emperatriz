# Receptor de leads (Google Apps Script)

`Code.gs` recibe los envíos del formulario de contacto
(`components/sections/ContactForm.tsx` → `lib/leads.ts`) y los guarda en una
Google Sheet. No forma parte del build de Next: se copia a mano en Apps Script.

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
| `{"ok":true}` | Fila guardada → el sitio muestra éxito |
| `{"ok":false,"error":"..."}` | Rechazado (`no_consent`, `invalid_email`, `invalid_budget`, …) → el sitio muestra error |

Si cambian los rangos de inversión o los tipos de proyecto, actualiza también
`PROJECT_TYPES` y `BUDGETS` en `Code.gs`. Si no, esos envíos se rechazan.
