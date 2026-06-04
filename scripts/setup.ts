#!/usr/bin/env bun
/**
 * Setup del template — Ventura Stack
 *
 * Personaliza una copia recién creada del template:
 *   1. Genera secrets aleatorios y crea `.dev.vars` desde `.dev.vars.example`.
 *   2. Renombra el proyecto COMPLETO a partir de un solo nombre:
 *      package.json, wrangler.toml (worker prod + dev) y app/config/site.ts
 *      (name, url, twitterHandle, link del repo).
 *   3. Imprime los siguientes pasos (secrets de Cloudflare, deploy…).
 *
 * La identidad "vieja" se LEE de los archivos (no es un placeholder fijo), así
 * funciona sin importar cómo se llame el template del que clonaste.
 *
 * Uso:
 *   bun run setup                       # interactivo
 *   bun run setup --name "Mi App"       # renombra sin prompts (scriptable)
 *   bun run setup --name "Mi App" --slug mi-app
 *   bun run setup --yes                 # solo secrets + .dev.vars (sin renombrar)
 *
 * Es idempotente: no sobrescribe `.dev.vars` si ya existe.
 */
import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const NON_INTERACTIVE = process.argv.includes('--yes') || !process.stdin.isTTY

const c = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	green: '\x1b[32m',
	cyan: '\x1b[36m',
	yellow: '\x1b[33m',
}
const log = (m: string) => console.log(m)
const ok = (m: string) => log(`${c.green}✓${c.reset} ${m}`)
const info = (m: string) => log(`${c.cyan}›${c.reset} ${m}`)

function ask(question: string, fallback: string): string {
	if (NON_INTERACTIVE) return fallback
	const answer = prompt(`${c.bold}${question}${c.reset} ${c.dim}(${fallback})${c.reset}`)
	return answer?.trim() || fallback
}

function genSecret(): string {
	return randomBytes(32).toString('hex')
}

/** Convierte un nombre visible a slug kebab-case sin acentos. */
function toSlug(name: string): string {
	return name
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

/** Escapa una cadena para usarla literal dentro de un RegExp. */
function escapeRe(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Lee un flag de la forma `--name valor` o `--name=valor`. */
function getArg(name: string): string | undefined {
	const eq = process.argv.find((a) => a.startsWith(`--${name}=`))
	if (eq) return eq.slice(name.length + 3)
	const i = process.argv.indexOf(`--${name}`)
	const next = process.argv[i + 1]
	if (i !== -1 && next && !next.startsWith('--')) return next
	return undefined
}

function readFile(relPath: string): string | null {
	const path = join(ROOT, relPath)
	return existsSync(path) ? readFileSync(path, 'utf8') : null
}

function writeFile(relPath: string, content: string) {
	writeFileSync(join(ROOT, relPath), content)
	ok(`Actualizado ${relPath}`)
}

function createDevVars() {
	const examplePath = join(ROOT, '.dev.vars.example')
	const targetPath = join(ROOT, '.dev.vars')

	if (existsSync(targetPath)) {
		info('.dev.vars ya existe — no se sobrescribe.')
		return
	}
	if (!existsSync(examplePath)) {
		info('.dev.vars.example no encontrado — se omite la creación de .dev.vars.')
		return
	}

	const content = readFileSync(examplePath, 'utf8')
		.replace('dev_cookie_secret_change_me', genSecret())
		.replace('dev_session_secret_change_me', genSecret())
		.replace('dev_honeypot_secret_change_me', genSecret())

	writeFileSync(targetPath, content)
	ok('Creado .dev.vars con secrets aleatorios.')
}

function renameProject() {
	const pkg = readFile('package.json')
	const site = readFile('app/config/site.ts')
	const wrangler = readFile('wrangler.toml')

	// Identidad actual leída de los archivos (no placeholders fijos).
	const oldSlug = pkg?.match(/"name":\s*"([^"]+)"/)?.[1] ?? 'app'
	const oldDisplay = site?.match(/name:\s*'([^']+)'/)?.[1] ?? oldSlug

	const argName = getArg('name')
	const argSlug = getArg('slug')
	const displayName = argName ?? ask('Nombre del proyecto (visible)', oldDisplay)
	const slug = toSlug(
		argSlug ?? argName ?? ask('Slug (kebab-case, para worker/package)', toSlug(displayName))
	)

	if (slug === oldSlug && displayName === oldDisplay) {
		info('Nombre sin cambios — se omite el renombrado.')
		return
	}

	// package.json — solo el campo name
	if (pkg) {
		writeFile(
			'package.json',
			pkg.replace(new RegExp(`("name":\\s*")${escapeRe(oldSlug)}(")`), `$1${slug}$2`)
		)
	}

	// wrangler.toml — reemplaza todas las apariciones del slug viejo (cubre el
	// worker de prod y el de dev "<slug>-dev", además de comentarios).
	if (wrangler) {
		writeFile('wrangler.toml', wrangler.split(oldSlug).join(slug))
	}

	// app/config/site.ts — name, url (cambia solo el subdominio), twitter y repo.
	if (site) {
		let next = site.replace(
			new RegExp(`name:\\s*'${escapeRe(oldDisplay)}'`),
			`name: '${displayName}'`
		)

		const oldUrl = site.match(/url:\s*'([^']+)'/)?.[1]
		if (oldUrl) {
			const suffix = oldUrl.replace(/^https?:\/\/[^./]+/, '') // ej: .claux.workers.dev
			next = next.replace(`url: '${oldUrl}'`, `url: 'https://${slug}${suffix}'`)
		}

		const oldTwitter = site.match(/twitterHandle:\s*'([^']+)'/)?.[1]
		if (oldTwitter) {
			next = next.replace(
				`twitterHandle: '${oldTwitter}'`,
				`twitterHandle: '@${slug.replace(/-/g, '')}'`
			)
		}

		// Link del repo: conserva el owner, cambia el nombre del repo por el slug.
		const repo = site.match(/(https:\/\/github\.com\/[^/]+\/)([^'"]+)/)
		if (repo) {
			next = next.replace(`${repo[1]}${repo[2]}`, `${repo[1]}${slug}`)
		}

		writeFile('app/config/site.ts', next)
	}

	log(`\n${c.green}✓${c.reset} Proyecto renombrado a ${c.bold}${displayName}${c.reset} (${slug}).`)
}

function main() {
	log(`\n${c.bold}${c.cyan}⚡ Ventura Stack — setup${c.reset}\n`)

	// 1. Secrets + .dev.vars
	createDevVars()

	// 2. Renombrado del proyecto. Corre si es interactivo, o si se pasó --name
	//    (permite renombrar sin prompts: bun run setup --name "Mi App").
	if (!NON_INTERACTIVE || getArg('name')) renameProject()

	// 3. Siguientes pasos
	log(`\n${c.bold}${c.green}Listo.${c.reset} Siguientes pasos:\n`)
	log(`  ${c.dim}1.${c.reset} ${c.bold}bun install${c.reset}            instala dependencias`)
	log(
		`  ${c.dim}2.${c.reset} ${c.bold}bun run prepare${c.reset}        instala los git hooks (lefthook)`
	)
	log(
		`  ${c.dim}3.${c.reset} ${c.bold}bun run dev${c.reset}            arranca el servidor de desarrollo`
	)
	log(
		`\n  ${c.yellow}Deploy a Cloudflare:${c.reset}\n` +
			`    ${c.dim}• Secrets en GitHub (Actions): CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID${c.reset}\n` +
			`    ${c.dim}• Secrets del worker:${c.reset}\n` +
			`        ${c.dim}wrangler secret put HONEYPOT_SECRET${c.reset}\n` +
			`        ${c.dim}wrangler secret put COOKIE_SECRET${c.reset}\n` +
			`        ${c.dim}wrangler secret put SESSION_SECRET${c.reset}\n` +
			`    ${c.dim}• Si no existe .github/workflows/deploy.yml, agrégalo o corre 'bunx wrangler deploy'.${c.reset}\n`
	)
}

main()
