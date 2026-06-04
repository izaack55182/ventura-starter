# Migración: Cloudflare Pages → Workers (nativo, sin Hono)

> Estado: **✅ EJECUTADO** (jun 2026). Desplegado y verificado en vivo:
> `https://ventura-stack.claux.workers.dev`. Este documento queda como registro
> del proceso y referencia para futuros proyectos derivados.
>
> Objetivo cumplido: la landing (SSR) corre en **Workers + Static Assets**,
> con el middleware portado 1:1, **dentro del free tier ($0)**, y sin el bug de
> entrega de assets del adaptador de Hono.

## Resultado (verificado)

- Hono eliminado; entry nativo en `workers/app.ts` (logger, trailing-slash,
  rate-limit nativo, secure-headers, noindex).
- Assets servidos por la plataforma (bug de entrega resuelto).
- CI/CD: push a `main` → GitHub Actions → `wrangler deploy`.
- Subdominio de cuenta personalizado: `*.claux.workers.dev`.
- Deps de Hono y de `@react-router/{node,serve,cloudflare}` retiradas.

---

## 0. Resumen ejecutivo

- **Qué cambia:** la *plataforma de despliegue* (Pages → Workers) y la *capa de entrada*
  (adaptador Hono → handler nativo de React Router). Se elimina Hono.
- **Qué NO cambia:** loaders, actions, componentes, rutas, SEO, honeypot, sistema de
  tema/color-scheme, error boundary. Todo eso es React Router y queda intacto.
- **Costo:** $0. Todo el middleware es cómputo/headers → free tier de Workers
  (100k req/día). Rate-limit con binding nativo (sin almacenamiento, sin cuota).
- **Riesgo:** bajo y reversible. Pages se **pausa**, no se borra, hasta verificar Workers.
- **Esfuerzo:** una tarde. Mayormente mecánico; el rate-limiter se simplifica con el
  binding nativo.

Ya instalado y a favor: `@cloudflare/vite-plugin` (camino nativo) y `wrangler 4.x`.

---

## 1. Estado actual (lo que se sustituye)

| Pieza actual | Archivo | Destino |
|---|---|---|
| Entrada Pages (catch-all) | [`functions/[[path]].ts`](../functions/%5B%5Bpath%5D%5D.ts) | **Eliminar** → worker entry nativo |
| App Hono + middleware | [`server/index.ts`](../server/index.ts) | Portar lógica al `fetch()` / RR |
| Puente de contexto | [`server/context.ts`](../server/context.ts) | Adaptar `getLoadContext` (sin `Context` de Hono) |
| Adaptador Hono en Vite | [`vite.config.ts`](../vite.config.ts) (`serverAdapter` + `exclude`) | Reemplazar por `@cloudflare/vite-plugin` |
| Config Pages | [`wrangler.toml`](../wrangler.toml) (`pages_build_output_dir`) | `main` + `[assets]` |
| Rate limit Hono | [`server/middleware/rate-limit.ts`](../server/middleware/rate-limit.ts) | Binding nativo `[[ratelimits]]` |
| CI deploy Pages | [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) | `wrangler deploy` |

Dependencias a retirar al final: `hono`, `hono-react-router-adapter`, `hono-rate-limiter`,
y probablemente `@react-router/cloudflare` (verificar; con el vite-plugin suele sobrar).

---

## 2. Estrategia de assets (la decisión clave de costo)

En Workers, por defecto **los assets se sirven antes que el Worker** (gratis e ilimitado).
Dos modos:

- **Modo A — assets-first (recomendado):** el Worker atiende solo rutas/SSR; los assets
  los sirve la plataforma. Headers de assets vía archivo `_headers`. Máximo aprovechamiento
  del free tier. **Esto elimina el bug de assets** (ya no pasan por código JS).
- **Modo B — `run_worker_first = true` ("igual que Hono"):** el middleware corre en TODAS
  las requests, incluidos assets. Mismo comportamiento que hoy en Pages. Sigue siendo gratis
  para tráfico de landing, pero los assets consumen invocaciones.

**Decisión propuesta:** empezar en **Modo A**. La lógica de middleware sigue corriendo en
cada página SSR (que es lo que importa). Si algún caso exige tocar assets, se evalúa
`run_worker_first` puntualmente.

---

## 3. Fases

### Fase 0 — Preparación (sin tocar producción)
- [ ] Crear rama `feat/migrate-workers`.
- [ ] Quitar los disparadores **TEMPORALES** del loader raíz (`/?boom`, `/?notfound`) en
      [`app/root.tsx`](../app/root.tsx) antes de cualquier deploy.
- [ ] Leer la guía oficial: `developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/`.

### Fase 1 — Configuración de Workers
- [ ] **Worker entry** (p. ej. `workers/app.ts`): handler nativo de React Router.
  ```ts
  import { createRequestHandler } from 'react-router'

  const handler = createRequestHandler(
    () => import('virtual:react-router/server-build'),
    import.meta.env.MODE,
  )

  export default {
    async fetch(request, env, ctx) {
      // ── aquí va el middleware portado (ver Fase 2) ──
      return handler(request, {
        cloudflare: { env, ctx },
        // …resto del load context (ver server/context.ts adaptado)
      })
    },
  } satisfies ExportedHandler<Env>
  ```
- [ ] **vite.config.ts:** quitar `serverAdapter({ entry: 'server/index.ts', exclude: [...] })`
      (incluida toda la lista frágil de `exclude`) y añadir `cloudflare()` de
      `@cloudflare/vite-plugin`. Mantener `reactRouter()`, `tailwindcss()`, iconos, paths.
- [ ] **wrangler.toml:** reemplazar
  ```toml
  pages_build_output_dir = "./build/client"
  ```
  por
  ```toml
  main = "./workers/app.ts"            # ruta final a confirmar con el build de RR

  [assets]
  directory = "./build/client"
  # run_worker_first = true            # solo si se elige Modo B
  not_found_handling = "single-page-application"  # o "404-page" según SSR
  ```
- [ ] Confirmar `compatibility_flags = ["nodejs_compat"]` y `compatibility_date` actualizado.

### Fase 2 — Portar el middleware (1:1, todo gratis)

| Hoy (Hono, `server/index.ts`) | Nativo | Dónde |
|---|---|---|
| `initEnv(c.env)` | Validar env con zod a partir de `env` | inicio del `fetch()` / `getLoadContext` |
| `epicLogger` | log de método/URL/status | `fetch()` (o observability nativa) |
| `removeTrailingSlash` | redirect 301 | `fetch()` antes del handler |
| Cache headers de assets | innecesario (assets-first) o `_headers` | archivo `public/_headers` |
| Redirect HTTPS (`X-Forwarded-Proto`) | redirect, o setting "Always Use HTTPS" | `fetch()` / dashboard |
| `secureHeaders` (hono/secure-headers) | setear headers en la `Response` | wrapper tras `handler()` |
| `rateLimit` (hono-rate-limiter) | binding nativo `[[ratelimits]]` | wrangler + `fetch()` |
| `poweredBy` / `X-Robots-Tag` noindex | headers de 1 línea | wrapper de respuesta |

- [ ] **Rate limit nativo** en `wrangler.toml`:
  ```toml
  [[ratelimits]]
  name = "LANDING_LIMITER"
  namespace_id = "1001"
    [ratelimits.simple]
    limit = 100
    period = 60        # 10 o 60
  ```
  y en el `fetch()`:
  ```ts
  const { success } = await env.LANDING_LIMITER.limit({ key: clientIp })
  if (!success) return new Response('Too Many Requests', { status: 429 })
  ```
  Añadir `LANDING_LIMITER: RateLimit` a la interfaz `Env`.

### Fase 3 — Adaptar el load context
- [ ] [`server/context.ts`](../server/context.ts): mantener la forma del contexto
      (`env` validado por zod, `clientEnv`, `cloudflare.env`) pero recibiendo `{ request, env }`
      en vez de un `Context` de Hono. Quitar el merge manual `c.env = Object.assign(...)`
      de `functions/[[path]].ts` (ya no hace falta: `env` llega directo).
- [ ] Verificar que `declare module 'react-router' { interface AppLoadContext { ... } }` sigue igual.

### Fase 4 — Limpieza de Hono
- [ ] Borrar [`functions/[[path]].ts`](../functions/%5B%5Bpath%5D%5D.ts) y la carpeta `functions/`.
- [ ] Borrar/portar `server/middleware/*` de Hono → lógica nativa.
- [ ] `bun remove hono hono-react-router-adapter hono-rate-limiter` (y verificar `@react-router/cloudflare`).
- [ ] Crear `public/_headers` si se necesitan headers en assets (Modo A).

### Fase 5 — Secrets y entorno
- [ ] En Workers el comando vuelve a ser **sin `pages`**:
  ```
  wrangler secret put HONEYPOT_SECRET
  wrangler secret put COOKIE_SECRET
  wrangler secret put SESSION_SECRET
  ```
- [ ] Revertir los comentarios de [`wrangler.toml`](../wrangler.toml) que ajustamos para Pages
      (secrets y la nota de `[triggers]`: en Workers los crons **sí** aplican).
- [ ] `.dev.vars` para desarrollo local (ya soportado por wrangler/vite-plugin).

### Fase 6 — CI/CD
- [ ] [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml): cambiar el comando de
      deploy de `pages deploy build/client --project-name=...` a:
  ```yaml
  command: deploy
  ```
  (wrangler-action con `wrangler deploy`). Mantener `typecheck` + `build` como gate.
- [ ] (Opcional) Migrar a **Workers Builds** (CI nativo de Cloudflare) más adelante.

### Fase 7 — Pausar la integración de Pages (seguro, reversible)
- [ ] **NO borrar** el proyecto Pages todavía.
- [ ] En el dashboard de Cloudflare → proyecto Pages → **desconectar/pausar la integración Git**
      para que deje de desplegar en cada push a `main`.
- [ ] Desplegar el Worker primero a una URL `*.workers.dev` y verificar (Fase 8).
- [ ] Mover el **dominio custom** de Pages → Worker (Routes/Custom Domains) solo cuando Workers
      esté verificado. Este es el punto de corte real del tráfico.
- [ ] Mantener el proyecto Pages inactivo unos días como rollback; borrar después.

### Fase 8 — Verificación
- [ ] `bun run typecheck` → verde.
- [ ] `bun run build` → genera `build/client` + server.
- [ ] `wrangler dev` local: la landing renderiza con SSR.
- [ ] **Assets:** `/assets/*`, `/icons/sprite.svg`, imágenes → se sirven correctamente
      (verificar que el bug de "devuelve HTML en vez del asset" desapareció).
- [ ] **Middleware:** headers de seguridad presentes; redirect trailing-slash; rate-limit
      devuelve 429 al superar el umbral.
- [ ] **Error boundary:** páginas 404/500 con estilos y JS (re-probar con un throw temporal).
- [ ] **Tema:** light/dark respeta cookie; fallback en error sigue funcionando.
- [ ] **Honeypot:** `getHoneypot().getInputProps()` corre en el loader sin errores.

---

## 4. Rollback
Si algo falla tras mover el dominio:
1. Reapuntar el dominio custom de vuelta al proyecto Pages.
2. Reactivar la integración Git de Pages.
3. El proyecto Pages sigue intacto → vuelve a desplegar como antes.

El riesgo se limita a la ventana entre mover el dominio y verificar.

---

## 5. Lo que NO se toca (confirmado)
- `app/routes/**`, loaders y actions.
- Componentes, UI, Tailwind/design tokens.
- SEO (`sitemap`, `robots`, `site.ts`).
- Honeypot (`app/utils/honeypot.server.ts`) y su cableado en `root.tsx`.
- Sistema de color-scheme y error boundary.

---

## 6. Checklist de archivos afectados
- [ ] `workers/app.ts` (nuevo)
- [ ] `vite.config.ts` (editar)
- [ ] `wrangler.toml` (editar)
- [ ] `server/context.ts` (editar)
- [ ] `server/index.ts` (portar → eliminar)
- [ ] `server/middleware/*` (portar → eliminar)
- [ ] `functions/[[path]].ts` (eliminar)
- [ ] `public/_headers` (nuevo, opcional)
- [ ] `.github/workflows/deploy.yml` (editar)
- [ ] `package.json` (quitar deps Hono)
- [ ] `app/root.tsx` (quitar disparadores temporales)

---

## 7. Riesgos y mitigaciones
| Riesgo | Mitigación |
|---|---|
| Rutas de assets / `not_found_handling` mal configuradas | Probar en `wrangler dev` y `*.workers.dev` antes del dominio |
| Diferencia de comportamiento del middleware | Portar 1:1 y verificar headers/redirects en Fase 8 |
| Pérdida de tráfico al mover dominio | Mover solo tras verificar; rollback de dominio listo |
| `nodejs_compat` faltante para alguna dep | Confirmar flag; revisar honeypot/oslojs en runtime Workers |
| Rate-limit por-colo menos estricto que esperado | Aceptable para anti-abuso; subir a Durable Object solo si se necesita exactitud global |
