#!/usr/bin/env node
/**
 * create-ventura — scaffolding del Ventura Stack desde la terminal.
 *
 * Uso:
 *   bunx create-ventura@latest mi-app
 *   bunx create-ventura@latest mi-app --name "Mi App"
 *   npx  create-ventura@latest mi-app
 *
 * Qué hace:
 *   1. Descarga el template (tarball de la rama main, sin historial de git).
 *   2. `git init` + `bun install` (instala git hooks vía `prepare`).
 *   3. Corre el setup del template: genera secrets en `.dev.vars` y renombra
 *      package.json, wrangler.toml y app/config/site.ts al nombre elegido.
 *   4. Deja un commit inicial limpio.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'

const TEMPLATE_TARBALL =
	'https://codeload.github.com/izaack55182/ventura-starter/tar.gz/refs/heads/main'

const c = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	green: '\x1b[32m',
	cyan: '\x1b[36m',
	red: '\x1b[31m',
}
const ok = (m) => console.log(`${c.green}✓${c.reset} ${m}`)
const info = (m) => console.log(`${c.cyan}›${c.reset} ${m}`)
const fail = (m) => {
	console.error(`${c.red}✗ ${m}${c.reset}`)
	process.exit(1)
}

/** Lee un flag de la forma `--name valor` o `--name=valor`. */
function getArg(name) {
	const eq = process.argv.find((a) => a.startsWith(`--${name}=`))
	if (eq) return eq.slice(name.length + 3)
	const i = process.argv.indexOf(`--${name}`)
	const next = process.argv[i + 1]
	if (i !== -1 && next && !next.startsWith('--')) return next
	return undefined
}

function toSlug(name) {
	return name
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

/** "mi-app" -> "Mi App" */
function toDisplay(slug) {
	return slug
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ')
}

function run(cmd, args, cwd, label) {
	const r = spawnSync(cmd, args, { cwd, stdio: 'inherit' })
	if (r.status !== 0) fail(`Falló: ${label ?? `${cmd} ${args.join(' ')}`}`)
}

function has(cmd) {
	return spawnSync(cmd, ['--version'], { stdio: 'ignore' }).status === 0
}

async function main() {
	console.log(`\n${c.bold}${c.cyan}⚡ create-ventura${c.reset} — Ventura Stack\n`)

	// 1. Directorio destino
	let dir = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : undefined
	if (!dir && process.stdin.isTTY) {
		const rl = createInterface({ input: process.stdin, output: process.stdout })
		dir =
			(
				await rl.question(`${c.bold}Nombre del directorio${c.reset} ${c.dim}(mi-app)${c.reset} `)
			).trim() || 'mi-app'
		rl.close()
	}
	if (!dir) fail('Indica el directorio: bunx create-ventura mi-app')

	const slug = toSlug(dir)
	const target = resolve(process.cwd(), dir)
	if (existsSync(target) && readdirSync(target).length > 0) {
		fail(`El directorio "${dir}" ya existe y no está vacío.`)
	}
	const displayName = getArg('name') ?? toDisplay(slug)

	if (!has('bun')) fail('Se requiere Bun (https://bun.sh). Instálalo y reintenta.')

	// 2. Descargar y extraer el template (sin historial de git)
	info(`Descargando el template…`)
	const res = await fetch(TEMPLATE_TARBALL)
	if (!res.ok) fail(`No se pudo descargar el template (HTTP ${res.status}).`)
	const tarball = Buffer.from(await res.arrayBuffer())
	mkdirSync(target, { recursive: true })
	// Extrae vía stdin y con cwd en el destino: sin rutas en los argumentos,
	// funciona igual con bsdtar (Windows/macOS) y GNU tar (Linux, Git Bash).
	const tar = spawnSync('tar', ['-xz', '--strip-components=1'], {
		cwd: target,
		input: tarball,
		stdio: ['pipe', 'inherit', 'inherit'],
	})
	if (tar.status !== 0) fail('Falló: extraer el template')
	// El paquete del CLI no forma parte de un proyecto nuevo.
	rmSync(join(target, 'other', 'create-ventura'), { recursive: true, force: true })
	ok(`Template copiado en ${dir}/`)

	// 3. git init antes de instalar (bun install corre `prepare` → lefthook)
	if (has('git')) run('git', ['init', '-q'], target)

	info('Instalando dependencias (bun install)…')
	run('bun', ['install'], target)

	// 4. Setup del template: secrets + renombrado completo
	run('bun', ['run', 'setup', '--name', displayName, '--slug', slug], target)

	// 5. Commit inicial limpio (ya renombrado). --no-verify: es el snapshot del
	// template tal cual; los hooks de lefthook aplican a los commits siguientes.
	if (has('git')) {
		run('git', ['add', '-A'], target)
		const commit = spawnSync(
			'git',
			['commit', '-q', '--no-verify', '-m', 'Initial commit (create-ventura)'],
			{ cwd: target, stdio: 'ignore' }
		)
		if (commit.status === 0) ok('Commit inicial creado.')
		else info('No se pudo crear el commit inicial (¿falta configurar git user.name/email?).')
	}

	console.log(`\n${c.bold}${c.green}Listo.${c.reset} Para empezar:\n`)
	console.log(`  cd ${dir}`)
	console.log(`  bun run dev\n`)
}

main().catch((e) => fail(e?.message ?? String(e)))
