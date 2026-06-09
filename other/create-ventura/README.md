# create-ventura

Crea un proyecto nuevo con el **Ventura Stack** (React Router v7 + Bun + Tailwind v4 + Cloudflare Workers) en un solo comando.

```bash
bunx create-ventura@latest mi-app
cd mi-app
bun run dev
```

Opciones:

```bash
bunx create-ventura@latest mi-app --name "Mi App"   # nombre visible del proyecto
```

Qué hace:

1. Descarga el template (sin historial de git).
2. `git init` + `bun install` (instala los git hooks vía `prepare`).
3. Genera secrets aleatorios en `.dev.vars` y renombra `package.json`, `wrangler.toml` y `app/config/site.ts`.
4. Deja un commit inicial limpio.

Requisitos: [Bun](https://bun.sh) y `tar` (incluido en Windows 10+, macOS y Linux).
