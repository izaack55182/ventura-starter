# Post-mortem: Persistencia del Color Scheme (Dark/Light Mode)

## Resumen del Problema

El tema dark/light **funcionaba correctamente en local** pero en producción (Cloudflare Pages) se reseteaba al navegar entre páginas o al recargar. El comportamiento observado era:

```
Marketing (light) → Login (light) → Dashboard (light)
  ↓ cambio a dark en Dashboard
Dashboard (dark)
  ↓ navego atrás
Marketing (light)   ← debería ser dark
  ↓ retrocedo
Dashboard (dark)    ← React mantiene estado en memoria
  ↓ recargo (F5)
Dashboard (light)   ← el servidor no puede leer la cookie → reset
```

---

## Causa Raíz: 3 Bugs en Cascada

### Bug 1 — Cookie firmada sin `maxAge` (cookie de sesión)

**Archivo:** `/utils/color-scheme.server.ts`

```ts
// ❌ ANTES — sin maxAge = cookie de sesión (se borra al cerrar el tab)
function getThemeCookie() {
  return createCookie('kb-color-scheme', {
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
    secrets: [getServerEnv().COOKIE_SECRET],  // +  firma innecesaria
  })
}
```

Sin `maxAge`, la cookie era **de sesión**: vivía solo en RAM mientras el tab estaba abierto. Al recargar, el browser no la enviaba y el servidor retornaba `'system'` → `'light'`.

**Adicionalmente**, usar `createCookie` con `secrets` firmaba el valor como `"dark".<HMAC>`. Esto creó dos problemas:
- Si el `COOKIE_SECRET` en Cloudflare difería del usado al firmar → verificación HMAC fallaba → `null`
- El script anti-flash del cliente no podía leer el valor firmado correctamente

---

### Bug 2 — `animated-theme-toggler.tsx`: manipulación incorrecta del DOM

**Archivo:** `app/components/ui/animated-theme-toggler.tsx`

```ts
// ❌ ANTES — al cambiar a light solo removía 'dark', nunca añadía 'light'
if (newIsDark) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')  // DOM queda sin clase de tema
}
```

El sistema de temas usa **dos clases** en `<html>`: `dark` y `light`. Al cambiar a light, el DOM quedaba sin ninguna clase. En el siguiente render, React calculaba `isDark = false` (porque no había clase `dark`), pero el optimistic state ya decía `'light'` — generando una inconsistencia que hacía que el tema oscilara.

```ts
// ✅ DESPUÉS — maneja ambas clases correctamente
document.documentElement.classList.remove('dark', 'light')
document.documentElement.classList.add(newIsDark ? 'dark' : 'light')
```

---

### Bug 3 — `root.tsx`: Hook condicional (violación de Rules of Hooks)

**Archivo:** `app/root.tsx`

```tsx
// ❌ ANTES — hook condicional: PROHIBIDO por React
function Document({ colorScheme, ... }) {
  const localTheme = colorScheme ? undefined : useColorScheme()  // ← ilegal
  const resolvedColorScheme = colorScheme ?? localTheme ?? 'light'
  ...
}
```

React no permite llamar hooks condicionalmente. Esto creaba comportamiento no determinístico: en algunos renders `useColorScheme()` se llamaba, en otros no, generando una doble fuente de verdad entre la prop `colorScheme` y el hook.

```tsx
// ✅ DESPUÉS — prop requerida, una sola fuente de verdad
function Document({ colorScheme, ... }: { colorScheme: string }) {
  return <html className={colorScheme}>...</html>
}

// App calcula el tema y lo pasa:
export default function App({ loaderData }) {
  const colorScheme = useColorScheme()  // única llamada al hook
  return <Document colorScheme={colorScheme}>...</Document>
}
```

---

## Solución Final Aplicada

### `color-scheme.server.ts` — Reescrito al estilo Epic Stack

Abandonamos `createCookie` de React Router (con su firma HMAC) a favor de la librería `cookie` nativa — exactamente como lo hace el [Epic Stack](https://github.com/epicweb-dev/epic-stack):

```ts
// ✅ Simple, sin firma, sin dependencias de secretos
import * as cookie from 'cookie'

export function getColorScheme(request: Request): ColorScheme {
  const cookieHeader = request.headers.get('Cookie')
  if (!cookieHeader) return 'system'
  const parsed = cookie.parse(cookieHeader)['kb-color-scheme']
  const result = ThemeSchema.safeParse(parsed)
  return result.success ? result.data : 'system'
}

export function setColorScheme(colorScheme: ColorScheme) {
  return cookie.serialize('kb-color-scheme', colorScheme, {
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,  // 1 año — persistente
  })
}
```

**Ventajas:**
- Sin dependencia de `COOKIE_SECRET` para una preferencia no sensible
- API síncrona (sin `await`)
- Valor en texto plano: `dark` o `light` — legible en cliente y servidor
- Compatible con Cloudflare Workers/Pages sin configuración adicional

---

## Por qué Funcionaba en Local pero no en Producción

| Factor | Local (Bun) | Producción (Cloudflare) |
|---|---|---|
| Cookie firmada | Mismo secreto siempre (`dev_secret_key_12345`) | Secreto de CF puede diferir |
| Cookie sin `maxAge` | Tab generalmente abierto | Mayor probabilidad de perder sesión |
| View Transition DOM | Sin `startViewTransition` support en algunos envs | Activa el bug del toggler |

---

## Archivos Modificados

| Archivo | Cambio |
|---|---|
| `app/lib/color-scheme.server.ts` | Reescrito con librería `cookie` nativa (síncrono, sin firma) |
| `app/routes/resource/color-scheme.tsx` | Removido `await` (API ahora síncrona) |
| `app/root.tsx` | Sin hook condicional; `Document` recibe `colorScheme` como prop requerida; script anti-flash simplificado |
| `app/components/ui/animated-theme-toggler.tsx` | Corregida manipulación de clases CSS en view transition |
| `package.json` | Agregado `cookie@1.1.1` |

---

## Lecciones

1. **Las cookies de tema no necesitan firma.** El tema dark/light no es dato sensible — no uses `createCookie` con `secrets` para esto. Usa la librería `cookie` directamente.
2. **Siempre especifica `maxAge`** en cookies de preferencia del usuario. Sin él, la cookie es de sesión.
3. **El Epic Stack tiene razón.** Su implementación de `theme.server.ts` con `cookie.parse/serialize` directo es la forma correcta.
4. **Los hooks condicionales son bugs silenciosos.** `condition ? undefined : useHook()` viola las Rules of Hooks y genera comportamiento no determinístico.
5. **Los View Transitions que manipulan el DOM deben conocer tu sistema de clases.** Si usas dos clases (`dark`/`light`), tu transición debe hacer `remove` de ambas antes de `add`.
