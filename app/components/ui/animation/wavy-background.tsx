// CORE
import { useEffect, useRef } from 'react'
// UTILS
import { createNoise3D, type NoiseFunction3D } from 'simplex-noise'
import { cn } from '@/utils/misc'

type WavyBackgroundProps = {
	children?: React.ReactNode
	className?: string
	containerClassName?: string
	/** Bandas de color de la cinta, de borde superior-izq a inferior-der. */
	colors?: string[]
	/**
	 * Color de fondo del canvas. Por defecto es TRANSPARENTE: así se ve el
	 * `bg-background` que Tailwind ya aplica en el root, que cambia solo con el
	 * tema. El canvas no necesita conocer el tema -> cero parpadeos al alternar
	 * claro/oscuro. Solo pásalo si quieres un fondo propio independiente del tema.
	 */
	backgroundFill?: string
	blur?: number
	speed?: 'slow' | 'fast' | number // acepta número directo
	/** Opacidad de la cinta (0-1). */
	waveOpacity?: number
	trail?: number // 0 = sin trail, 1 = limpia cada frame
	/** Grosor de la cinta como fracción de la diagonal del canvas (0-1). */
	ribbonWidth?: number
	/** Cuánto ondula cada banda (en múltiplos del ancho de banda). Controla cuánto se juntan/separan. */
	waveAmplitude?: number
	/** Nº de ondulaciones a lo largo de la cinta. */
	waveFrequency?: number
}

export const WavyBackground = ({
	children,
	className,
	containerClassName,
	colors,
	backgroundFill, // undefined = transparente (deja ver el bg del tema)
	blur = 0, // 0 = bandas nítidas (sin difuminado). Súbelo para suavizar bordes.
	speed = 'slow',
	waveOpacity = 1,
	trail = 1,
	ribbonWidth = 0.24,
	waveAmplitude = 1,
	waveFrequency = 2,
}: WavyBackgroundProps) => {
	const noiseRef = useRef<NoiseFunction3D | null>(null)
	if (!noiseRef.current) noiseRef.current = createNoise3D()
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const stateRef = useRef({ nt: 0, animId: 0 })

	// Paleta por defecto: degradado violeta -> amarillo (borde sup-izq a inf-der).
	const ribbonColors = colors ?? [
		'#8b5cf6', // violeta
		'#a855f7', // púrpura
		'#d946ef', // magenta
		'#fb5d6b', // rojo-rosa
		'#fb923c', // naranja
		'#fde047', // amarillo
	]

	// Guardamos los props en un ref para que el loop de animación los lea sin
	// necesidad de reiniciar el efecto (un reinicio dispara resize(), que borra
	// el canvas un frame -> parpadeo).
	const configRef = useRef({
		backgroundFill,
		colors: ribbonColors,
		waveOpacity,
		trail,
		blur,
		speed,
		ribbonWidth,
		waveAmplitude,
		waveFrequency,
	})
	configRef.current = {
		backgroundFill,
		colors: ribbonColors,
		waveOpacity,
		trail,
		blur,
		speed,
		ribbonWidth,
		waveAmplitude,
		waveFrequency,
	}

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return
		const state = stateRef.current

		const getSpeed = (): number => {
			const { speed } = configRef.current
			if (typeof speed === 'number') return speed
			return speed === 'fast' ? 0.0025 : 0.0013
		}

		const resize = () => {
			const parent = canvas.parentElement
			const nextW = parent?.clientWidth ?? window.innerWidth
			const nextH = parent?.clientHeight ?? window.innerHeight
			// Asignar canvas.width/height BORRA el canvas, aunque el valor no
			// cambie. Si el tamaño es el mismo (p. ej. reflow por cambio de tema),
			// no tocamos el backing-store para no provocar un frame en blanco.
			if (nextW === canvas.width && nextH === canvas.height) {
				ctx.filter = `blur(${configRef.current.blur}px)`
				return
			}
			canvas.width = nextW
			canvas.height = nextH
			ctx.filter = `blur(${configRef.current.blur}px)`
		}
		resize()
		const observer = new ResizeObserver(resize)
		if (canvas.parentElement) observer.observe(canvas.parentElement)

		// Dibuja UNA cinta diagonal (abajo-izq -> arriba-der) compuesta por bandas
		// de color paralelas. Cada banda ondula con ruido propio, por lo que se
		// juntan y se separan un poco de forma orgánica (estilo Aceternity).
		const drawRibbon = () => {
			state.nt += getSpeed()
			const { width: w, height: h } = canvas
			const { colors, waveOpacity, ribbonWidth, waveAmplitude, waveFrequency } = configRef.current
			const n = colors.length
			const diag = Math.hypot(w, h)

			// Línea central de esquina a esquina, extendida fuera del canvas para
			// que la cinta "sangre" por los bordes.
			const ext = 0.2
			const sx = -ext * w
			const sy = (1 + ext) * h // abajo-izquierda
			const ex = (1 + ext) * w
			const ey = -ext * h // arriba-derecha
			const dx = ex - sx
			const dy = ey - sy
			const len = Math.hypot(dx, dy)
			// Perpendicular (apunta hacia abajo-derecha): sobre ella desplazamos las bandas.
			const perpX = -dy / len
			const perpY = dx / len

			const band = (diag * ribbonWidth) / n
			const amp = band * waveAmplitude // cuánto se mueve cada banda

			ctx.globalCompositeOperation = 'source-over'
			ctx.lineCap = 'round'
			ctx.lineJoin = 'round'
			ctx.globalAlpha = waveOpacity
			ctx.lineWidth = band + 1.5 // leve solape para que no queden costuras

			const steps = 48
			for (let i = 0; i < n; i++) {
				ctx.beginPath()
				ctx.strokeStyle = colors[i] ?? '#000000'
				const base = (i - (n - 1) / 2) * band
				for (let s = 0; s <= steps; s++) {
					const t = s / steps
					// Ondulación con ruido: varía a lo largo de la cinta (t) y por
					// banda (i), y avanza en el tiempo (nt) -> se juntan/separan.
					const noise = noiseRef.current!(t * waveFrequency, i * 0.35, state.nt)
					const off = base + noise * amp
					const x = sx + dx * t + perpX * off
					const y = sy + dy * t + perpY * off
					if (s === 0) ctx.moveTo(x, y)
					else ctx.lineTo(x, y)
				}
				ctx.stroke()
			}
		}

		// Pinta UN frame (sin agendar el siguiente). Se reutiliza tanto en el bucle
		// como para el frame estático inicial / prefers-reduced-motion.
		const paintFrame = () => {
			const { width: w, height: h } = canvas
			const { trail, backgroundFill } = configRef.current

			if (backgroundFill) {
				// Fondo sólido propio (independiente del tema). trail<1 deja estela.
				ctx.globalCompositeOperation = 'source-over'
				ctx.globalAlpha = trail
				ctx.fillStyle = backgroundFill
				ctx.fillRect(0, 0, w, h)
			} else if (trail >= 1) {
				// Sin fondo: limpiamos a transparente para dejar ver el bg del tema.
				ctx.clearRect(0, 0, w, h)
			} else {
				// Estela sobre fondo transparente: borramos una fracción `trail` de
				// lo ya pintado cada frame (el color es irrelevante en destination-out).
				ctx.globalCompositeOperation = 'destination-out'
				ctx.globalAlpha = trail
				ctx.fillStyle = '#000000'
				ctx.fillRect(0, 0, w, h)
			}

			drawRibbon()
		}

		// ── Control de animación ──────────────────────────────────────────────
		// El canvas solo se repinta cuando: está en viewport, la pestaña está
		// visible y el usuario NO está haciendo scroll. Pausar el repintado durante
		// el scroll evita que el `backdrop-blur` del header (fixed) tenga que
		// re-rasterizar contenido animado en cada frame -> elimina el "tirón".
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

		let inView = true
		let scrolling = false
		let running = false
		let scrollIdle: ReturnType<typeof setTimeout>

		const tick = () => {
			paintFrame()
			state.animId = requestAnimationFrame(tick)
		}
		const start = () => {
			if (running || prefersReducedMotion) return
			running = true
			state.animId = requestAnimationFrame(tick)
		}
		const stop = () => {
			running = false
			cancelAnimationFrame(state.animId)
		}
		const sync = () => {
			if (inView && !document.hidden && !scrolling) start()
			else stop()
		}

		const onScroll = () => {
			if (!scrolling) {
				scrolling = true
				sync()
			}
			clearTimeout(scrollIdle)
			scrollIdle = setTimeout(() => {
				scrolling = false
				sync()
			}, 120)
		}
		const onVisibility = () => sync()

		const io = new IntersectionObserver(
			(entries) => {
				inView = entries.some((entry) => entry.isIntersecting)
				sync()
			},
			{ threshold: 0 }
		)
		io.observe(canvas)
		window.addEventListener('scroll', onScroll, { passive: true })
		document.addEventListener('visibilitychange', onVisibility)

		// Frame estático inicial (también cubre prefers-reduced-motion) + arranque.
		paintFrame()
		sync()

		return () => {
			stop()
			clearTimeout(scrollIdle)
			io.disconnect()
			window.removeEventListener('scroll', onScroll)
			document.removeEventListener('visibilitychange', onVisibility)
			observer.disconnect()
		}
		// Sin dependencias: la animación corre una sola vez y lee los valores
		// dinámicos desde configRef. El canvas es transparente y agnóstico al tema.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className={cn('relative h-full w-full overflow-hidden', containerClassName)}>
			<canvas ref={canvasRef} className="absolute inset-0 h-full w-full transform-gpu" />
			{children ? <div className={cn('relative z-10', className)}>{children}</div> : null}
		</div>
	)
}
