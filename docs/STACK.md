# Ventura Stack — Documentación Técnica

> React Router v7 · Cloudflare Workers · Bun · Tailwind CSS v4 · shadcn/ui

---

## Stack Tecnológico

| Capa           | Tecnología                                    |
| -------------- | --------------------------------------------- |
| **Runtime**    | Bun (local + CI)                              |
| **Framework**  | React Router v7 (SSR, framework mode)         |
| **Hosting**    | Cloudflare Workers + Static Assets (nativo)   |
| **Build**      | Vite 7 + `@cloudflare/vite-plugin`            |
| **Estilos**    | Tailwind CSS v4 + shadcn/ui + MagicUI         |
| **Lenguaje**   | TypeScript 5.9                                |
| **Validación** | Zod                                           |
| **Seguridad**  | Honeypot · rate-limit nativo · secure-headers |
| **Calidad**    | Biome (lint + formato)                        |
| **Animaciones**| Framer Motion + View Transition API           |

---

## Estructura del Proyecto

```
Ventura-stack/
├── app/
│   ├── root.tsx                    # Layout raíz, tema, meta tags, ENV
│   ├── routes.ts                   # Router central (compone todas las features)
│   ├── entry.server.tsx            # SSR entry point
│   │
│   ├── features/                   # ★ Módulos de negocio
│   │   ├── marketing/              #   Landing page (home pública, SEO)
│   │   ├── security/               #   Login, flujo de autenticación
│   │   ├── core/                   #   Dashboard principal y navegación app
│   │   ├── crm/                    #   Cliente, leads, oportunidades
│   │   ├── user/                   #   Gestión de cuenta y perfil
│   │   ├── settings/               #   Configuración global de la app
│   │   ├── accounting/             #   Contabilidad y finanzas
│   │   ├── inventory/              #   Inventario y stock
│   │   ├── invoicing/              #   Facturación
│   │   └── analytics/              #   KPIs, paneles analíticos
│   │
│   ├── routes/
│   │   └── layout/                 # Layouts compartidos para grupos de rutas
│   │       ├── layout-public.tsx   #   Layout público (landing, marketing)
│   │       ├── layout-app.tsx      #   Layout de aplicación autenticada (/c)
│   │       └── components/         #   Header, sidebar, footer públicos, etc.
│   │
│   ├── components/                 # Componentes globales reutilizables
│   │   ├── ui/                     #   shadcn/ui + MagicUI (genéricos)
│   │   ├── epic-progress.tsx       #   Barra de progreso global
│   │   └── error-boundary.tsx      #   Error boundary global
│   │
│   ├── utils/                      # Utilidades compartidas
│   │   ├── env.server.ts           #   Variables de entorno
│   │   ├── color-scheme.server.ts  #   Cookie de tema (server-only)
│   │   ├── client-hints.tsx        #   Client hints del navegador
│   │   ├── headers.server.ts       #   Utilidades de headers
│   │   └── misc.ts                 #   Helpers varios (dominio, etc.)
│   │
│   ├── utils/hooks/                # Custom hooks
│   │   ├── use-mobile.tsx
│   │   └── use-reduced-motion.tsx
│   │
│   └── styles/                     # CSS global
│       ├── tailwind.css            #   Tokens, temas, View Transition CSS
│       └── font.css                #   Tipografía
│
├── workers/                        # ★ Entry del Cloudflare Worker (nativo)
│   ├── app.ts                      #   fetch() + middleware (rate-limit, headers, logger)
│   └── logger.ts                   #   Epic logger con colores (solo dev)
│
├── public/                         # Archivos estáticos (los sirve la plataforma)
│   ├── favicons/
│   ├── icons/
│   └── images/
│
├── server/                         # Puente de contexto server-side
│   └── context.ts                  #   getLoadContext (env validado + bindings CF)
│
├── vite.config.ts                  # Vite + React Router + @cloudflare/vite-plugin
├── tsconfig.json                   # TypeScript config (paths "@/")
├── wrangler.toml                   # Config del Worker (assets, ratelimits, secrets)
├── components.json                 # Configuración shadcn/ui
└── package.json
```

---

## Arquitectura Modular (Features)

Cada feature es un módulo independiente con sus propias rutas, componentes y lógica de dominio.

### Estructura de una Feature

```
app/
└── features/
    └── [feature-name]/
        ├── routes.ts[x]         # Definición de rutas del módulo
        ├── routes/              # (opcional) Subrutas de la feature
        │   └── index.tsx
        ├── components/          # Componentes exclusivos de la feature
        │   └── ...
        └── [sub-feature]/       # (opcional) Sub-módulos adicionales
            ├── routes/
            └── components/
```

### Registro de Rutas (router central)

Cada feature exporta un array de rutas que se compone en `app/routes.ts`.  
Convenciones de URL:

- `/` → rutas públicas (marketing)
- `/c/*` → aplicación autenticada (core, crm, accounting, etc.)
- `/r/*` → resource routes (acciones como cambio de tema)

Ejemplo real simplificado de `app/routes.ts`:

```typescript
import { layout, prefix, type RouteConfig, route } from '@react-router/dev/routes'
import { accountingRoutes } from './features/accounting/routes'
import { analyticsRoutes } from './features/analytics/routes'
import { coreRoutes } from './features/core/routes'
import { crmRoutes } from './features/crm/routes'
import { inventoryRoutes } from './features/inventory/routes'
import { invoicingRoutes } from './features/invoicing/routes'
import { marketingRoutes } from './features/marketing/routes'
import { securityRoutes } from './features/security/routes'
import { settingsRoutes } from './features/settings/routes'
import { userRoutes } from './features/user/routes'

export default [
  // 1. PUBLIC / MARKETING
  ...marketingRoutes,

  // 2. AUTHENTICATION (SECURITY)
  ...securityRoutes,

  // 3. APPLICATION (CENTRALIZED)
  ...prefix('c', [
    layout('routes/layout/layout-app.tsx', [
      ...coreRoutes,
      ...crmRoutes,
      ...userRoutes,
      ...settingsRoutes,
      ...accountingRoutes,
      ...inventoryRoutes,
      ...invoicingRoutes,
      ...analyticsRoutes,
    ]),
  ]),

  // 4. RESOURCE ROUTES
  ...prefix('r', [
    route('color-scheme', 'routes/resource/color-scheme.tsx'),
  ]),

  // 5. SYSTEM / ERRORS
  route('404', 'routes/404.tsx'),
  route('500', 'routes/500.tsx'),
  route('*', 'routes/catch-all.tsx'),
] satisfies RouteConfig
```

### Ejemplo: Feature Marketing (Home pública)

```typescript
// app/features/marketing/home/routes/index.tsx
import type { MetaFunction } from 'react-router'
import Home from '../components/home'

export async function loader() {
  return { title: 'Ventura Stack - Home' }
}

export default function Index() {
  return <Home />
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.title ?? 'Ventura Stack' }]
}
```

### Agregar una nueva Feature

1. Crear `app/features/[nombre]/routes.ts[x]` exportando un array de rutas.
2. Crear `app/features/[nombre]/components/` con los componentes específicos.
3. Importar la nueva feature y hacer `...miNuevaFeatureRoutes` en `app/routes.ts`.

---

## Cloudflare Workers

### Arquitectura de Despliegue

```
[Browser] → Static Assets (gratis, edge) → Cloudflare Worker (SSR)
                  │                              │
            build/client/                  workers/app.ts
            (HTML, CSS, JS)         (middleware + React Router SSR)
```

> Los assets se sirven **antes** que el Worker (gratis e ilimitado). Si no hay
> asset en la ruta, cae al Worker. Esto elimina el bug de entrega de assets que
> tenía el adaptador de Hono sobre Pages.

### Configuración de Vite

```typescript
// vite.config.ts
export default defineConfig({
    plugins: [
        cloudflare({ viteEnvironment: { name: 'ssr' } }),
        reactRouter(),
        tailwindcss(),
        tsconfigPaths(),
        // iconsSpritesheet(...)
    ],
});
```

> El `@cloudflare/vite-plugin` hace que `dev`/`preview` corran en **workerd**
> (runtime real de Workers), sirviendo los assets como en producción.

### Comandos

| Comando              | Uso                                        |
| -------------------- | ------------------------------------------ |
| `bun run dev`        | Dev server (SSR en workerd, HMR)           |
| `bun run build`      | Build de producción (`build/client` + worker) |
| `bun run preview`    | Build + `vite preview` (worker en local)   |
| `bun run deploy`     | Build + `wrangler deploy` (manual)         |
| `bun run typecheck`  | `wrangler types` + `react-router typegen` + `tsc` |
| `bun run lint`       | Biome check (lint + formato)               |
| `bun run format`     | Biome check --write (auto-fix)             |

### CI/CD con GitHub Actions

El deploy se gestiona en **un solo job** (`.github/workflows/deploy.yml`). Build y
deploy van JUNTOS porque `wrangler deploy` necesita la config redirigida que
genera el build (`.wrangler/deploy/config.json` → `build/server/wrangler.json`),
que no viaja entre jobs.

```
git push main → GitHub Actions (un job):
  ┌────────────────────────────────────────────────┐
  │  • Checkout · Setup Bun · bun install           │
  │  • Typecheck                                    │
  │  • Build                                        │
  │  • wrangler deploy     ← solo si push a main    │
  └────────────────────────────────────────────────┘
```

- **Pull Requests** → typecheck + build (sin deploy)
- **Push a main** → typecheck + build + `wrangler deploy` a Cloudflare Workers

**Secrets requeridos** (GitHub → Settings → Secrets → Actions):
- `CLOUDFLARE_API_TOKEN` — Token con permiso **Workers Scripts: Edit**
- `CLOUDFLARE_ACCOUNT_ID` — Account ID de Cloudflare

> El Worker se **crea solo** en el primer `wrangler deploy` (no hace falta
> conectar el repo en el dashboard; el GitHub Action es el CI/CD).

### Worker Entry Point

```typescript
// workers/app.ts — entry nativo del Worker
import { createRequestHandler } from 'react-router'
import { getLoadContext } from '../server/context'

const handler = createRequestHandler(
    () => import('virtual:react-router/server-build'),
    import.meta.env.MODE,
)

export default {
    async fetch(request, env, ctx) {
        // middleware nativo: trailing-slash, rate-limit, secure-headers, logger…
        return handler(request, getLoadContext(env))
    },
} satisfies ExportedHandler<Env>
```

Los **bindings de Cloudflare** (`env`) llegan directos a `getLoadContext` y de ahí
a `context.cloudflare.env` en loaders/actions — sin el puente de Hono.

---

## Sistema de Temas (Dark/Light)

### Flujo

```
Cookie `kb-color-scheme` (httpOnly, firmada) ──┐
prefers-color-scheme (client hint)           ──┤
                                               ▼
                       root.tsx loader → resuelve  theme: "light" | "dark"
                                               ▼
                  root.tsx Layout → <Document>     ← <html class={theme}>
                                               ▼
        ColorSchemeSwitch / AnimatedToggler  ─ fetcher.submit({ colorScheme }) ─►
                                               ▼
              /r/color-scheme  action()  ← valida con Zod + Set-Cookie
```

**Resiliencia (sin parpadeo, incluso si el loader raíz cae):**

1. `App` espeja el tema resuelto en `localStorage.theme` en cada render.
2. Un **script inline anti-FOUC** en el `<head>` aplica el tema **antes del primer
   paint**: lee `localStorage.theme` y, si no hay, cae al `prefers-color-scheme` del SO.
3. En el **ErrorBoundary** (loader raíz sin datos) la cookie es `httpOnly` y no se
   puede leer desde el cliente → ese script es el que restaura la preferencia, por eso
   la página de error también respeta el tema.

### Componentes del Sistema

| Archivo | Responsabilidad |
| --- | --- |
| `app/utils/color-scheme.server.ts` | Cookie `kb-color-scheme` (httpOnly + firmada): `getColorScheme`/`setColorScheme` |
| `app/utils/client-hints.tsx` | Detecta `prefers-color-scheme` (+ time-zone, reduced-motion) |
| `app/root.tsx` loader | Resuelve tema: cookie → client hint → "light" |
| `app/root.tsx` Layout/Document | `<html class={theme}>` + script anti-FOUC en `<head>` |
| `app/root.tsx` App | Espeja `localStorage.theme` (fuente del fallback en error) |
| `app/routes/resource/color-scheme.tsx` | `action` en `/r/color-scheme` (Zod + Set-Cookie); hooks `useTheme`/`useOptionalTheme` |
| `app/components/color-scheme-switch.tsx` | UI + `fetcher.submit` (optimistic) |
| `app/components/ui/animated-theme-toggler.tsx` | Animación View Transition (clip-path circular) |

### Paleta de Colores (OKLCH)

Definida en `styles/tailwind.css` usando **OKLCH** para mayor consistencia perceptual:

- **Light:** Fondo blanco puro `oklch(1 0 0)`, texto negro suave `oklch(0.1 0 0)`
- **Dark:** Fondo oscuro `oklch(0.1 0 0)`, texto blanco suave `oklch(0.98 0 0)`
- **Sistema monocromático** con acentos semánticos (destructive en rojo desaturado)

### Animación del Toggle

La animación usa la **View Transition API** nativa:

1. `document.startViewTransition()` captura el estado "antes"
2. `flushSync()` aplica el cambio del tema síncronamente
3. `clip-path: circle()` expande desde el botón hacia las esquinas
4. Duración: 500ms con curva `cubic-bezier(0.4, 0, 0.2, 1)`

CSS requerido en `tailwind.css`:
```css
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-new(root) {
  z-index: 9999;
}
```

---

## UI & Componentes

### Stack de UI

- **shadcn/ui** — Componentes base (Button, Separator, Tooltip, etc.)
- **MagicUI** — Componentes animados (Dock)
- **Lucide React** — Iconografía
- **Framer Motion** — Animaciones complejas
- **CVA** (class-variance-authority) — Variantes de componentes

### Alias de importación

```json
// tsconfig.json
"paths": {
    "@/*": ["./app/*"]
}
```

Uso: `import { Button } from "@/components/ui/button"`

### Configuración shadcn

Definida en `components.json` — utilidades en `@/lib/utils`, componentes en `@/components/ui`.

---

## Desarrollo Local

### Requisitos

- **Bun** (runtime y package manager)
- **Node.js** ≥ 18 (para Wrangler compatibility)

### Inicio rápido

```bash
# Instalar dependencias
bun install

# Desarrollo local
bun run dev

# Type checking
bun run typecheck

# Preview con Wrangler (simula Cloudflare)
bun run preview
```

### Notas importantes

- **No usar npm** — El proyecto usa exclusivamente Bun (`bun.lock`)
- `package-lock.json` está en `.gitignore`
- El type generation de React Router se ejecuta con `react-router typegen`
- Los tipos generados se guardan en `.react-router/types/`
