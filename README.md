<div align="center">
  <br />
  <img src="https://img.shields.io/badge/VENTURA_STACK-ENTERPRISE_READY-blue?style=for-the-badge&logo=react" alt="Ventura Banner" />
  
  <h1 style="border-bottom: none; margin-bottom: 0;">Ventura Stack</h1>
  
  <p style="font-size: 1.1em; color: #586069; margin-top: 0;">
    <strong style="color: #3178C6;">C</strong>ore Architecture &bull; 
    <strong style="color: #F38020;">C</strong>loud Edge &bull; 
    <strong style="color: #ED8B00;">E</strong>nterprise Logic &bull; 
    <strong style="color: #60A5FA;">I</strong>ntelligent Design
  </p>

  <p><i>The high-performance foundation for mission-critical web applications.</i></p>

  <p>
    <a href="https://opensource.org/licenses">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License" />
    </a>
    <img src="https://img.shields.io/badge/Status-Alpha-orange?style=flat-square" alt="Status" />
    <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square" alt="Build" />
    <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square" alt="Version" />
  </p>
  
  <hr style="border: 0; height: 1px; background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));" />
</div>

## 🚀 Introduction

**Ventura Stack** es un proyecto *learn-in-public* que fusiona las tecnologías web más vanguardistas para crear un entorno de desarrollo full-stack de alto rendimiento. Construido sobre la base de **React Router v7** con el runtime de **Bun**, este stack está diseñado para ofrecer una arquitectura híbrida: la agilidad del frontend moderno con la potencia de backends empresariales.

> ⚠️ **Experimental Notice**: Este proyecto se encuentra en fase alfa. La combinación de **React Router v7**, **Tailwind v4** y despliegues en **Cloudflare** es altamente experimental y está en constante evolución.

## 🌟 Inspiration

Este stack toma inspiración de grandes referentes del ecosistema:

- **[Epic Stack](https://github.com/epicweb-dev/epic-stack)** - Estructura modular y robustez.
- **[TEDI Stack](https://github.com/koikar/tedi-stack)** - Implementación eficiente con Bun.

## 🛠️ Key Technologies
| Technology | Description | Link |
|------------|-------------|------|
| ![React Router](https://img.shields.io/badge/-React%20Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white) | Framework principal para SSR y Routing modular | [reactrouter.com](https://reactrouter.com) |
| ![Bun](https://img.shields.io/badge/-Bun-000000?style=flat-square&logo=bun&logoColor=white) | Runtime, gestor de paquetes y bundler ultra veloz | [bun.sh](https://bun.sh/) |
| ![Cloudflare Workers](https://img.shields.io/badge/-Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white) | Runtime de despliegue en el edge (SSR + Static Assets) | [workers.dev](https://workers.dev) |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | Desarrollo seguro con tipado estático de extremo a extremo | [typescriptlang.org](https://typescriptlang.org) |
| ![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | Motor de estilos de alto rendimiento basado en variables CSS | [tailwindcss.com](https://tailwindcss.com) |
| ![Zod](https://img.shields.io/badge/-Zod-3E67B1?style=flat-square&logo=zod&logoColor=white) | Validación de esquemas con inferencia de tipos para TS | [zod.dev](https://zod.dev) |
| ![Cloudflare](https://img.shields.io/badge/-Cloudflare-F38020?style=flat-square&logo=cloudflare&logoColor=white) | Despliegue en el Edge y optimización de red global | [cloudflare.com](https://cloudflare.com) |


- **Workers-Native Edge**: Despliegue nativo en **Cloudflare Workers + Static Assets**. El middleware (rate-limit, secure-headers, trailing-slash, logger) vive en el `fetch()` del Worker — sin capas extra, dentro del free tier.
- **Cloudflare Edge Ready**: Optimizado para despliegues globales con baja latencia.
- **Feature-Based Architecture**: Organización modular por dominios de negocio (Marketing, Security, Core, CRM, Accounting, Inventory, Invoicing, Analytics, Settings, User) para escalabilidad real.
- **SSR Dark Mode**: Sistema de modo oscuro basado en *Client Hints* para una UX sin parpadeos.
- **Tailwind v4 & Magic UI**: Estilos modernos con variables CSS nativas y componentes visuales impactantes.

---

## ⚡ Quickstart

```bash
bun install
bun run setup                    # genera secrets, crea .dev.vars e instala git hooks
bun run dev                      # http://localhost:5173
```

> El script `setup` es idempotente y, si lo ejecutas sin `--yes`, te pregunta el
> nombre y la URL del proyecto para personalizar `package.json`, `wrangler.toml` y
> `app/config/site.ts`. `bun install` ya instala los git hooks vía `prepare`.

## 📜 Scripts

| Comando | Qué hace |
|---|---|
| `bun run dev` | Dev server (Vite + runtime de Workers) |
| `bun run build` | Build de producción (`build/client` + worker) |
| `bun run typecheck` | `wrangler types` + `react-router typegen` + `tsc` |
| `bun run test` | Tests unitarios y de componente (Vitest, jsdom) |
| `bun run test:watch` | Vitest en modo watch |
| `bun run test:e2e` | E2E con navegador real (Playwright) contra el build |
| `bun run setup` | Personaliza el template (secrets, nombre, URL) |
| `bun run deploy` | Build + `wrangler deploy` (manual) |
| `bun run start` | Build + `vite preview` (worker en local) |

## 🧪 Testing & Calidad

- **Vitest** (`tests/unit`, `*.test.ts(x)`) — unidad y componente en jsdom.
- **Playwright** (`tests/e2e`) — smoke + verificación de la cabecera CSP/nonce.
- **Lefthook** — `pre-commit` corre Biome (lint+format con auto-fix) sobre los
  archivos staged; `pre-push` corre el typecheck completo.

## 🚀 Despliegue (CI/CD)

Push a `main` → GitHub Actions corre **typecheck + build + `wrangler deploy`** a Cloudflare Workers.
Requiere los secrets de repo `CLOUDFLARE_API_TOKEN` (permiso *Workers Scripts: Edit*) y `CLOUDFLARE_ACCOUNT_ID`.

Secrets del Worker en producción:

```bash
wrangler secret put HONEYPOT_SECRET
wrangler secret put COOKIE_SECRET
wrangler secret put SESSION_SECRET
```

## 📊 Observabilidad y Costos (Cloudflare)

Cloudflare ofrece potentes herramientas de observabilidad, pero debes conocer cómo impactan en los costos:

- **Dashboard (Workers Logs, Traces, Muestreo):** Vienen apagados por defecto. Activar el almacenamiento histórico y exportación de logs normalmente requiere el plan **Workers Paid ($5/mes)**.
- **Tail Worker:** Puedes programar un Worker para leer tus propios logs, pero consumirá tu cuota gratuita diaria (100k requests/día).

✨ **Recomendación para Desarrollo / Free Tier:**
Deja las opciones del dashboard desactivadas. Para depurar tu aplicación en vivo, abre tu terminal y ejecuta:
```bash
bunx wrangler tail
```
Este comando intercepta y transmite los logs de producción en tiempo real directamente a tu pantalla. **Es 100% gratis e ilimitado**, ideal para cazar bugs sin pagar almacenamiento.

## 🧬 Usar como plantilla

Este repo está marcado como **GitHub Template**: pulsa **Use this template** para
crear un repo nuevo (o usa `degit izaack55182/ventura-stack`).

1. **Use this template** en GitHub → repo nuevo, luego clónalo.
2. `bun install && bun run setup` → instala deps, genera secrets, crea `.dev.vars`
   y te pregunta nombre/URL para reemplazarlos en `package.json`, `wrangler.toml` y
   `app/config/site.ts`.
3. Revisa lo que el script no toca:
   - `wrangler.toml` → los `namespace_id` de `[[ratelimits]]`.
   - Contenido en `app/features/marketing/` y assets en `public/`.
4. Configura los secrets (GitHub + Workers).
5. Push a `main` → se despliega en `<name>.<tu-subdominio>.workers.dev`.

## 🗂️ Estructura

```
app/
  config/site.ts     # config única del sitio (SEO, marca)
  features/          # features por dominio (marketing, security, …)
  root.tsx           # shell HTML, tema, honeypot, error boundary
workers/
  app.ts             # entry del Worker (middleware nativo)
  logger.ts          # epic logger con colores (dev)
server/context.ts    # AppLoadContext (bindings de Cloudflare)
wrangler.toml        # config de Workers (assets, ratelimits, secrets)
```

> Migración Pages → Workers documentada en [`docs/migration-pages-to-workers.md`](docs/migration-pages-to-workers.md).

<!-- Nota: Archivo actualizado para probar despliegues en modo Preview -->
