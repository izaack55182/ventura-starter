import type { CreateReporter } from '@epic-web/cachified'

/**
 * Representa el mapa de tiempos acumulados durante una petición.
 */
export type Timings = Record<
	string,
	Array<{ desc?: string } & ({ time: number; start?: never } | { time?: never; start: number })>
>

/**
 * Inicializa el objeto de tiempos para una petición.
 * @param type El nombre del proceso principal (ej. 'root loader')
 * @param desc Una descripción opcional
 */
export function makeTimings(type: string, desc?: string) {
	const timings: Timings = {
		[type]: [{ desc, start: performance.now() }],
	}
	Object.defineProperty(timings, 'toString', {
		value: () => getServerTimeHeader(timings),
		enumerable: false,
	})
	return timings
}

/**
 * Crea un temporizador interno para medir un bloque de código.
 */
function createTimer(type: string, desc?: string) {
	const start = performance.now()
	return {
		end(timings: Timings) {
			let timingType = timings[type]
			if (!timingType) {
				timingType = timings[type] = []
			}
			timingType.push({ desc, time: performance.now() - start })
		},
	}
}

/**
 * Envuelve una función o promesa para medir su tiempo de ejecución.
 *
 * @example
 * const user = await time(() => db.user.findUnique({ where: { id } }), {
 *   timings,
 *   type: 'db',
 *   desc: 'fetch user'
 * })
 */
export async function time<ReturnType>(
	fn: Promise<ReturnType> | (() => ReturnType | Promise<ReturnType>),
	{
		type,
		desc,
		timings,
	}: {
		type: string
		desc?: string
		timings?: Timings
	}
): Promise<ReturnType> {
	const timer = createTimer(type, desc)
	try {
		const promise = typeof fn === 'function' ? fn() : fn
		const result = await promise
		return result
	} finally {
		// El temporizador se detiene siempre, incluso si hay un error
		if (timings) timer.end(timings)
	}
}

/**
 * Genera el string para el encabezado HTTP 'Server-Timing'.
 */
export function getServerTimeHeader(timings?: Timings) {
	if (!timings) return ''
	return Object.entries(timings)
		.map(([key, timingInfos]) => {
			const dur = timingInfos
				.reduce((acc, timingInfo) => {
					const time = timingInfo.time ?? performance.now() - timingInfo.start
					return acc + time
				}, 0)
				.toFixed(1)
			const desc = timingInfos
				.map((t) => t.desc)
				.filter(Boolean)
				.join(' & ')

			// Limpieza de caracteres no permitidos en los keys de los headers
			const safeKey = key.replace(/(:| |@|=|;|,|\/|\\)/g, '_')
			const safeDesc = desc ? `desc=${JSON.stringify(desc)}` : null

			return [safeKey, safeDesc, `dur=${dur}`].filter(Boolean).join(';')
		})
		.join(',')
}

/**
 * Combina múltiples encabezados de Server-Timing.
 */
export function combineServerTimings(headers1: Headers, headers2: Headers) {
	const timing1 = headers1.get('Server-Timing')
	const timing2 = headers2.get('Server-Timing')
	return [timing1, timing2].filter(Boolean).join(',')
}

/**
 * Reporter para la librería @epic-web/cachified que mide hits/misses de caché.
 */
export function cachifiedTimingReporter<Value>(
	timings?: Timings
): undefined | CreateReporter<Value> {
	if (!timings) return

	return ({ key }) => {
		const cacheRetrievalTimer = createTimer(`cache:${key}`, `${key} cache retrieval`)
		let getFreshValueTimer: ReturnType<typeof createTimer> | undefined

		return (event) => {
			switch (event.name) {
				case 'getFreshValueStart':
					getFreshValueTimer = createTimer(
						`getFreshValue:${key}`,
						`request forced to wait for a fresh ${key} value`
					)
					break
				case 'getFreshValueSuccess':
					getFreshValueTimer?.end(timings)
					break
				case 'done':
					cacheRetrievalTimer.end(timings)
					break
			}
		}
	}
}
