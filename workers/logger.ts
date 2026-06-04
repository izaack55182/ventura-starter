/**
 * Epic Logger — Logging de requests ultra-limpio, tipado y responsivo a la terminal.
 * Optimizado para rendimiento en Edge (Cloudflare Workers) y minimalismo visual en Dev.
 */
const NAME = 'EPIC LOGGER'
const isDev = import.meta.env.DEV

// Paleta ANSI refinada (Estilo High-End Tech)
const c = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	red: '\x1b[31m',
	cyan: '\x1b[36m',
	magenta: '\x1b[35m',
	blue: '\x1b[34m',
} as const

function formatDuration(ms: number): string {
	if (ms < 1000) return `${ms.toFixed(2)}ms`
	if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`
	return `${Math.floor(ms / 60000)}m ${((ms % 60000) / 1000).toFixed(0)}s`
}

function methodColor(method: string): string {
	const colors: Record<string, string> = {
		GET: c.green,
		POST: c.yellow,
		PUT: c.blue,
		DELETE: c.red,
		PATCH: c.magenta,
	}
	const color = colors[method] ?? c.cyan
	return `${c.bold}${color}${method.padEnd(6)}${c.reset}` // Alineación fija para métodos largos
}

export function getLoggedUrl(url: URL): string {
	return url.pathname === '/__manifest' ? url.pathname : `${url.pathname}${url.search}`
}

/** Línea de inicio: "Processing..." con indicador dinámico. */
export function logStart(method: string, url: string): void {
	if (!isDev) return

	const header = `🔍 ${'─'.repeat(NAME.length + 2)} 🔍`

	// biome-ignore lint/suspicious/noConsole: Logger intencional
	console.log(
		`${c.bold}${c.dim}[${header}]${c.reset} ${methodColor(method)} ${c.dim}${url}${c.reset} → ${c.dim}processing...${c.reset}`
	)
}

/** Línea de cierre: Resultado tipado, alineado y responsivo al status. */
export function logEnd(
	method: string,
	url: string,
	status: number,
	duration: number,
	contentType: string
): void {
	const type = contentType.split(';')[0] || 'unknown'

	// Producción: Formato plano, rápido y sin ensuciar los logs de Cloudflare
	if (!isDev) {
		// biome-ignore lint/suspicious/noConsole: Logger intencional
		console.log(`${method} ${url} ${status} - ${formatDuration(duration)} [${type}]`)
		return
	}

	// Configuración dinámica por rangos de Status (Evita ifs anidados gigantes)
	const statsMap = [
		{ min: 200, max: 299, label: `🚀 ${NAME} 🚀`, tone: c.green },
		{ min: 300, max: 399, label: `🔄 REDIRECT 🔄`, tone: c.cyan },
		{ min: 400, max: 499, label: `😢 CLIENT ERR 😢`, tone: c.yellow },
		{ min: 500, max: 599, label: `🔥 SERVER ERR 🔥`, tone: c.red },
	]

	const config = statsMap.find((m) => status >= m.min && status <= m.max) || {
		label: `❓ UNKNOWN ${status} ❓`,
		tone: c.magenta,
	}

	// Centrado dinámico del label para que el bloque mida exactamente lo mismo que el de inicio
	const targetLength = NAME.length + 6
	const paddedLabel = config.label.padEnd(targetLength)

	// biome-ignore lint/suspicious/noConsole: Logger intencional
	console.log(
		`${c.bold}${config.tone}[${paddedLabel}]${c.reset} ${methodColor(method)} ${c.bold}${config.tone}${status}${c.reset} ${url} ${c.dim}(${formatDuration(duration)}) [${type}]${c.reset}`
	)
}
