#!/usr/bin/env bun
/**
 * Setup del template — Ventura Stack
 *
 * Personaliza una copia recién creada del template:
 *   1. Genera secrets aleatorios y crea `.dev.vars` desde `.dev.vars.example`.
 *   2. Renombra el proyecto (package.json, wrangler.toml, app/config/site.ts).
 *   3. Imprime los siguientes pasos (wrangler secret put, deploy…).
 *
 * Uso:
 *   bun run setup              # interactivo
 *   bun run setup --yes        # no interactivo (solo secrets + .dev.vars)
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

function replaceInFile(relPath: string, replacements: Array<[string | RegExp, string]>) {
	const path = join(ROOT, relPath)
	if (!existsSync(path)) return
	let content = readFileSync(path, 'utf8')
	for (const [from, to] of replacements) {
		content = content.replace(from, to)
	}
	writeFileSync(path, content)
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

function main() {
	log(`\n${c.bold}${c.cyan}⚡ Ventura Stack — setup${c.reset}\n`)

	// 1. Secrets + .dev.vars
	createDevVars()

	// 2. Renombrado del proyecto
	const slug = ask('Nombre del proyecto (slug, kebab-case)', 'Ventura-stack')
	const displayName = ask('Nombre visible (título del sitio)', 'Ventura Stack')
	const url = ask('URL de producción', 'https://Ventura-stack.claux.workers.dev')

	if (slug !== 'Ventura-stack') {
		replaceInFile('package.json', [[/"name":\s*"Ventura-stack"/, `"name": "${slug}"`]])
		replaceInFile('wrangler.toml', [[/^name = "Ventura-stack"/m, `name = "${slug}"`]])
	}
	if (displayName !== 'Ventura Stack' || url !== 'https://Ventura-stack.claux.workers.dev') {
		replaceInFile('app/config/site.ts', [
			[/name: 'Ventura Stack'/, `name: '${displayName}'`],
			[/url: 'https:\/\/Ventura-stack\.claux\.workers\.dev'/, `url: '${url}'`],
		])
	}

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
		`\n  ${c.yellow}Producción:${c.reset} configura los secrets en Cloudflare:\n` +
			`    ${c.dim}wrangler secret put HONEYPOT_SECRET${c.reset}\n` +
			`    ${c.dim}wrangler secret put COOKIE_SECRET${c.reset}\n` +
			`    ${c.dim}wrangler secret put SESSION_SECRET${c.reset}\n`
	)
}

main()
